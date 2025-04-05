"use client"

import { useState, useEffect } from "react"
import { useVoice } from "@/context/VoiceContext"

export default function VoiceAssistant() {
  const { isMuted } = useVoice()
  const [isListening, setIsListening] = useState(false)
  const [status, setStatus] = useState("Click to activate voice assistant")
  const [recognition, setRecognition] = useState<any>(null)

  useEffect(() => {
    // Initialize speech recognition
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()

      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = "en-US"

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript

        // Dispatch custom event with transcript
        window.dispatchEvent(
          new CustomEvent("voiceCommand", {
            detail: { transcript },
          }),
        )

        // Reset UI
        setStatus("Click to activate voice assistant")
        setIsListening(false)
      }

      recognitionInstance.onend = () => {
        setStatus("Click to activate voice assistant")
        setIsListening(false)
      }

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error", event.error)
        setStatus(`Error: ${event.error}`)
        setIsListening(false)
      }

      setRecognition(recognitionInstance)
    }

    return () => {
      if (recognition) {
        recognition.abort()
      }
    }
  }, [])

  const toggleListening = () => {
    if (!recognition) {
      setStatus("Speech recognition not supported in this browser")
      return
    }

    if (!isListening) {
      // Start listening
      recognition.start()
      setStatus("Listening...")
      setIsListening(true)
    } else {
      // Stop listening
      recognition.stop()
      setStatus("Click to activate voice assistant")
      setIsListening(false)
    }
  }

  return (
    <div className="mirror-card rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold gradient-text">Voice Assistant</h3>
        {isMuted && (
          <div className="text-xs px-2 py-1 bg-red-500 bg-opacity-30 text-red-300 rounded-full">
            <i className="fas fa-volume-mute mr-1"></i> Muted
          </div>
        )}
      </div>
      <div className="flex flex-col items-center">
        <div className="relative">
          <button
            className={`w-20 h-20 rounded-full bg-mirror-accent flex items-center justify-center mb-4 hover:bg-mirror-accent2 transition-all z-10 ${isListening ? "pulse-animation" : ""}`}
            onClick={toggleListening}
          >
            <i className="fas fa-microphone text-2xl"></i>
          </button>
          <div className="voice-ripple"></div>
          <div className="voice-ripple" style={{ animationDelay: "0.5s" }}></div>
        </div>
        <p className="text-center text-gray-400">{status}</p>
      </div>
    </div>
  )
}

