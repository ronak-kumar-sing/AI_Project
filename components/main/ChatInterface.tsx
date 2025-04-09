"use client"

import { useState, useEffect, useRef } from "react"
import { useUser } from "@/context/UserContext"
import { useVoice } from "@/context/VoiceContext"
import { useWeather } from "@/context/WeatherContext"
import { callGeminiAPI } from "@/config/api-config"

interface Message {
  text: string
  sender: "user" | "assistant"
}

export default function ChatInterface() {
  const { currentUser } = useUser()
  const { speakText } = useVoice()
  const { weatherData } = useWeather()
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I assist you today?", sender: "assistant" },
  ])
  const [inputText, setInputText] = useState("")
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Listen for voice commands
  useEffect(() => {
    const handleVoiceCommand = (event: CustomEvent<{ transcript: string }>) => {
      const transcript = event.detail.transcript

      // Add user message to chat
      addMessage(transcript, "user")

      // Process the command
      processCommand(transcript)
    }

    window.addEventListener("voiceCommand", handleVoiceCommand as EventListener)

    return () => {
      window.removeEventListener("voiceCommand", handleVoiceCommand as EventListener)
    }
  }, [currentUser])

  const addMessage = (text: string, sender: "user" | "assistant") => {
    setMessages((prev) => [...prev, { text, sender }])
  }

  const handleSendMessage = () => {
    if (inputText.trim()) {
      // Add user message to chat
      addMessage(inputText, "user")

      // Process the command
      processCommand(inputText)

      // Clear input
      setInputText("")
    }
  }

  // Get outfit recommendation based on weather
  const getOutfitRecommendation = () => {
    // Check if real weather data has been loaded
    if (weatherData.description === "Loading weather..." || weatherData.temperature === "--°C") {
      return "I'm still loading weather data. Please ask again in a moment for outfit recommendations."
    }

    const temp = weatherData.tempNumeric
    const description = weatherData.description.toLowerCase()

    let outfit = ""

    if (temp < 0) {
      outfit = "You should wear a heavy winter coat, scarf, gloves, thermal layers, and winter boots."
    } else if (temp < 10) {
      outfit = "I recommend a winter coat, hat, and warm layers today."
    } else if (temp < 15) {
      outfit = "A light jacket or heavy sweater would be appropriate today."
    } else if (temp < 20) {
      outfit = "Consider wearing a light sweater or long-sleeve shirt."
    } else if (temp < 25) {
      outfit = "It's pleasant out! A t-shirt with a light jacket or sweater should work well."
    } else if (temp < 30) {
      outfit = "It's warm today. A t-shirt and shorts or light pants would be comfortable."
    } else {
      outfit = "It's hot out there! Wear light, breathable clothing like shorts and a t-shirt."
    }

    // Additional recommendations based on weather conditions
    if (description.includes("rain") || description.includes("drizzle") || description.includes("shower")) {
      outfit += " Don't forget an umbrella and waterproof shoes!"
    } else if (description.includes("snow") || description.includes("sleet")) {
      outfit += " Be sure to wear waterproof boots and warm socks."
    } else if (description.includes("wind") || parseInt(weatherData.windSpeed) > 20) {
      outfit += " It's windy, so avoid loose items that might blow around."
    } else if (description.includes("sunny") || description.includes("clear")) {
      outfit += " Don't forget sunglasses and sunscreen for UV protection."
    }

    return `Based on the current weather (${weatherData.temperature}, ${weatherData.description}), ${outfit}`
  }

  const processCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase()
    let response = ""

    // Add outfit recommendation handling
    if (lowerCommand.includes("outfit") || lowerCommand.includes("wear") ||
      lowerCommand.includes("clothes") || lowerCommand.includes("dress")) {
      response = getOutfitRecommendation()
    }
    // Simple command processing
    else if (lowerCommand.includes("time")) {
      const now = new Date()
      response = `The time is ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`
    } else if (lowerCommand.includes("date")) {
      const now = new Date()
      response = `Today is ${now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}`
    } else if (lowerCommand.includes("weather")) {
      // Check if real weather data has been loaded
      if (weatherData.description === "Loading weather..." || weatherData.temperature === "--°C") {
        response = "I'm still loading weather data. Please check back in a moment."
      } else {
        response = `The current weather is ${weatherData.temperature} and ${weatherData.description}`
      }
    } else if (lowerCommand.includes("news")) {
      response = "Here are the latest headlines. You can see them on your screen."
    } else if (lowerCommand.includes("hello") || lowerCommand.includes("hi")) {
      response = `Hello, ${currentUser?.name || "there"}! How can I help you today?`
    } else if (
      lowerCommand.includes("dark mode") ||
      lowerCommand.includes("light mode") ||
      lowerCommand.includes("theme")
    ) {
      // Dispatch theme toggle event
      window.dispatchEvent(new CustomEvent("toggleTheme"))
      response = "I've toggled the theme for you"
    } else if (lowerCommand.includes("who am i")) {
      response = `You're logged in as ${currentUser?.name || "Guest"}`
    } else if (lowerCommand.includes("logout") || lowerCommand.includes("sign out")) {
      response = "Logging you out now."
      setTimeout(() => {
        // Dispatch logout event
        window.dispatchEvent(new CustomEvent("logout"))
      }, 1500)
    } else {
      // Use Gemini API for more complex queries
      addMessage("Thinking...", "assistant")

      try {
        console.log("Sending complex query to Gemini API")
        const prompt = `You are an AI assistant for a smart mirror application. The user's name is ${currentUser?.name || "Guest"}.
    Please provide a helpful, concise response to this query: "${command}"
    Keep your response under 3 sentences and make it conversational.`

        const geminiResponse = await callGeminiAPI(prompt)

        // Remove the "Thinking..." message
        setMessages((prev) => {
          const newMessages = [...prev]
          // Replace the last message if it was "Thinking..."
          if (newMessages.length > 0 && newMessages[newMessages.length - 1].text === "Thinking...") {
            newMessages.pop()
          }
          return [...newMessages, { text: geminiResponse, sender: "assistant" }]
        })

        // Speak response
        speakText(geminiResponse)

        return // Skip the default message addition below
      } catch (error) {
        console.error("Error calling Gemini API:", error)
        response = "I'm having trouble connecting to my AI brain right now. Please try again later."

        // Remove the "Thinking..." message
        setMessages((prev) => {
          const newMessages = [...prev]
          if (newMessages.length > 0 && newMessages[newMessages.length - 1].text === "Thinking...") {
            newMessages.pop()
          }
          return newMessages
        })
      }
    }

    // Add assistant response to chat
    addMessage(response, "assistant")

    // Speak response
    speakText(response)
  }

  return (
    <div className="mirror-card rounded-xl p-6 flex flex-col h-96">
      <h3 className="text-xl font-semibold mb-4">Chat</h3>
      <div ref={chatContainerRef} className="chat-container flex-grow space-y-4 mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.sender === "user" ? "user-message p-3 ml-auto max-w-3/4" : "assistant-message p-3 max-w-3/4"
            }
          >
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-grow p-3 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-mirror-accent"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          className="p-3 bg-mirror-accent rounded-r-lg hover:bg-mirror-accent2 transition-all"
          onClick={handleSendMessage}
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  )
}

