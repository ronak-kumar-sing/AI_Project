"use client"

import { useState, useRef } from "react"
import { callGeminiAPI } from "@/config/api-config"
import { useUser } from "@/context/UserContext"

interface Task {
  id: string
  description: string
}

interface ScheduleItem {
  time: string
  task: string
  priority: "high" | "medium" | "low"
  notes?: string
}

export default function TaskPlanner() {
  const { currentUser } = useUser()
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now().toString(),
        description: newTask.trim(),
      }
      setTasks([...tasks, task])
      setNewTask("")
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }

  const removeTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const generateSchedule = async () => {
    if (tasks.length === 0) {
      setError("Please add at least one task")
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const taskList = tasks.map((task) => task.description).join("\n- ")
      const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      const currentDate = new Date().toLocaleDateString([], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      const prompt = `
You are an AI assistant that creates optimized daily schedules. 
Today is ${currentDate} and the current time is ${currentTime}.
Create a detailed timetable for ${currentUser?.name || "the user"} based on these tasks:
- ${taskList}

Consider the following:
1. Start the schedule from the current time
2. Allocate appropriate time for each task based on complexity
3. Include short breaks between tasks
4. Prioritize tasks (high, medium, low)
5. Add brief notes or tips for each task

Format the response as a JSON array with objects containing:
- time (string): The start time for the task
- task (string): The task description
- priority (string): "high", "medium", or "low"
- notes (string): Brief tips or context

Only return the JSON array, nothing else.
`

      const response = await callGeminiAPI(prompt)

      try {
        // Extract JSON from the response
        const jsonStr = response.replace(/```json|```/g, "").trim()
        const scheduleData = JSON.parse(jsonStr) as ScheduleItem[]
        setSchedule(scheduleData)
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError)
        setError("Failed to parse the schedule. Please try again.")
      }
    } catch (apiError) {
      console.error("Error calling Gemini API:", apiError)
      setError("Failed to generate schedule. Please try again later.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="mirror-card rounded-xl p-6">
      <h3 className="text-xl font-semibold gradient-text mb-4">Daily Planner</h3>

      <div className="mb-6">
        <div className="flex mb-2">
          <input
            ref={inputRef}
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Add a task..."
            className="flex-grow p-3 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-mirror-accent"
          />
          <button
            onClick={addTask}
            className="p-3 bg-mirror-accent rounded-r-lg hover:bg-mirror-accent2 transition-all"
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>

        {tasks.length > 0 ? (
          <ul className="space-y-2 mb-4 max-h-40 overflow-y-auto">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-center justify-between bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                <span>{task.description}</span>
                <button
                  onClick={() => removeTask(task.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <i className="fas fa-times"></i>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-center py-4">Add tasks to generate your daily schedule</p>
        )}

        <button
          onClick={generateSchedule}
          disabled={isGenerating || tasks.length === 0}
          className="w-full py-3 bg-gradient-to-r from-mirror-accent to-mirror-accent2 text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Generating Schedule...
            </>
          ) : (
            "Generate Schedule"
          )}
        </button>

        {error && (
          <div className="mt-2 text-red-400 text-sm text-center">
            <i className="fas fa-exclamation-circle mr-1"></i> {error}
          </div>
        )}
      </div>

      {schedule.length > 0 && (
        <div className="mt-4">
          <h4 className="text-lg font-medium mb-3">Your Schedule</h4>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {schedule.map((item, index) => (
              <div
                key={index}
                className="bg-gray-800 bg-opacity-50 rounded-lg p-4 border-l-4 border-opacity-80 transition-all hover:translate-x-1"
                style={{
                  borderLeftColor:
                    item.priority === "high" ? "#ef4444" : item.priority === "medium" ? "#f59e0b" : "#10b981",
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-lg">{item.time}</div>
                    <div className="mt-1">{item.task}</div>
                    {item.notes && (
                      <div className="mt-2 text-sm text-gray-400">
                        <i className="fas fa-info-circle mr-1"></i> {item.notes}
                      </div>
                    )}
                  </div>
                  <div className="ml-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.priority === "high"
                          ? "bg-red-500 bg-opacity-20 text-red-300"
                          : item.priority === "medium"
                            ? "bg-yellow-500 bg-opacity-20 text-yellow-300"
                            : "bg-green-500 bg-opacity-20 text-green-300"
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

