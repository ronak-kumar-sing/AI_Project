"use client"

import { useState, useRef, useEffect } from "react"
import { callGeminiAPI } from "@/config/api-config"
import { useUser } from "@/context/UserContext"
import { motion, AnimatePresence } from "framer-motion"

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
  const [showConfetti, setShowConfetti] = useState(false)
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

        // Show confetti when schedule is successfully generated
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)

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

  // Progress dots animation for loading state
  const LoadingDots = () => {
    return (
      <div className="flex space-x-1 ml-2">
        <motion.div
          className="w-2 h-2 bg-white rounded-full"
          animate={{ scale: [0.8, 1.2, 0.8] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 0 }}
        />
        <motion.div
          className="w-2 h-2 bg-white rounded-full"
          animate={{ scale: [0.8, 1.2, 0.8] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }}
        />
        <motion.div
          className="w-2 h-2 bg-white rounded-full"
          animate={{ scale: [0.8, 1.2, 0.8] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 0.8 }}
        />
      </div>
    )
  }

  // Simple confetti effect
  const Confetti = () => {
    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C', '#FF9F1C'][Math.floor(Math.random() * 5)],
              top: '-5%',
              left: `${Math.random() * 100}%`
            }}
            initial={{ y: 0, x: 0 }}
            animate={{
              y: '105vh',
              x: (Math.random() - 0.5) * 200,
              rotate: Math.random() * 360 * 2
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mirror-card rounded-xl p-6 overflow-hidden border border-gray-700 shadow-lg"
    >
      {showConfetti && <Confetti />}

      <motion.h3
        className="text-xl font-semibold gradient-text mb-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <span className="mr-2">✨</span> Daily Planner
      </motion.h3>

      <div className="mb-6">
        <div className="flex mb-3 group">
          <motion.input
            ref={inputRef}
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Add a task..."
            className="flex-grow p-3 bg-gray-800/60 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-mirror-accent"
            whileFocus={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          />
          <motion.button
            onClick={addTask}
            className="p-3 bg-mirror-accent rounded-r-lg hover:bg-mirror-accent2 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-plus"></i>
          </motion.button>
        </div>

        {tasks.length > 0 ? (
          <motion.ul
            className="space-y-2 mb-5 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pr-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AnimatePresence>
              {tasks.map((task) => (
                <motion.li
                  key={task.id}
                  className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg border border-gray-700/50 backdrop-blur-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0, padding: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  whileHover={{ x: 5, backgroundColor: "rgba(75, 85, 99, 0.4)" }}
                >
                  <span className="overflow-hidden text-ellipsis">{task.description}</span>
                  <motion.button
                    onClick={() => removeTask(task.id)}
                    className="text-red-400 hover:text-red-300 transition-colors ml-2 p-1 hover:bg-red-400/20 rounded"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <i className="fas fa-times"></i>
                  </motion.button>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/30 border border-dashed border-gray-700 rounded-lg text-gray-400 text-center py-6 px-4 mb-5"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <i className="fas fa-tasks text-2xl mb-2 text-gray-500"></i>
              <p>Add tasks to generate your daily schedule</p>
              <p className="text-xs mt-1 text-gray-500">Start by typing a task above</p>
            </motion.div>
          </motion.div>
        )}

        <motion.button
          onClick={generateSchedule}
          disabled={isGenerating || tasks.length === 0}
          className="w-full py-3 bg-gradient-to-r from-mirror-accent to-mirror-accent2 text-white rounded-lg hover:shadow-lg hover:shadow-mirror-accent/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="absolute inset-0 bg-white/10"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.8 }}
          />
          {isGenerating ? (
            <div className="flex items-center justify-center">
              <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2">Generating Schedule</span>
              <LoadingDots />
            </div>
          ) : (
            <span>Generate Schedule</span>
          )}
        </motion.button>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 text-red-400 text-sm flex items-center justify-center bg-red-900/20 p-2 rounded"
            >
              <i className="fas fa-exclamation-circle mr-2"></i> {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {schedule.length > 0 && (
          <motion.div
            className="mt-6 pt-5 border-t border-gray-700/50"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <motion.h4
              className="text-lg font-medium mb-4 flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.span
                className="mr-2 text-mirror-accent"
                animate={{ rotate: [0, 20, 0] }}
                transition={{ repeat: 1, duration: 0.5, delay: 0.5 }}
              >
                <i className="fas fa-calendar-check"></i>
              </motion.span>
              Your Schedule
            </motion.h4>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-mirror-accent/30 scrollbar-track-transparent">
              {schedule.map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-4 border-l-4 border-opacity-80 shadow-md hover:shadow-lg transition-all"
                  style={{
                    borderLeftColor:
                      item.priority === "high" ? "#ef4444" : item.priority === "medium" ? "#f59e0b" : "#10b981",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.4 }}
                  whileHover={{ x: 5, backgroundColor: "rgba(31, 41, 55, 0.5)" }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-bold text-lg flex items-center">
                        <i className="fas fa-clock mr-2 text-sm text-gray-400"></i>
                        {item.time}
                      </div>
                      <div className="mt-2 font-medium">{item.task}</div>
                      {item.notes && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 + 0.1 * index }}
                          className="mt-2 text-sm text-gray-400 bg-gray-700/20 p-2 rounded"
                        >
                          <i className="fas fa-info-circle mr-1"></i> {item.notes}
                        </motion.div>
                      )}
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      <motion.span
                        className={`text-xs px-3 py-1 rounded-full flex items-center ${item.priority === "high"
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : item.priority === "medium"
                              ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                              : "bg-green-500/20 text-green-300 border border-green-500/30"
                          }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        <i className={`mr-1 fas ${item.priority === "high"
                            ? "fa-exclamation-circle"
                            : item.priority === "medium"
                              ? "fa-dot-circle"
                              : "fa-check-circle"
                          }`}></i>
                        {item.priority}
                      </motion.span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

