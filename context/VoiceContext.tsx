"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface VoiceContextType {
  isMuted: boolean
  toggleMute: () => void
  speakText: (text: string) => void
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined)

export function VoiceProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(false)

  // Load mute preference from localStorage on mount
  useEffect(() => {
    const savedMuteState = localStorage.getItem("smartMirrorMuted")
    if (savedMuteState) {
      setIsMuted(savedMuteState === "true")
    }
  }, [])

  // Toggle mute state
  const toggleMute = () => {
    const newMuteState = !isMuted
    setIsMuted(newMuteState)
    localStorage.setItem("smartMirrorMuted", newMuteState.toString())

    // Cancel any ongoing speech when muting
    if (newMuteState) {
      window.speechSynthesis.cancel()
    }
  }

  // Speak text if not muted
  const speakText = (text: string) => {
    if (!isMuted && "speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text)
      speech.lang = "en-US"
      window.speechSynthesis.speak(speech)
    }
  }

  return (
    <VoiceContext.Provider
      value={{
        isMuted,
        toggleMute,
        speakText,
      }}
    >
      {children}
    </VoiceContext.Provider>
  )
}

export function useVoice() {
  const context = useContext(VoiceContext)
  if (context === undefined) {
    throw new Error("useVoice must be used within a VoiceProvider")
  }
  return context
}

