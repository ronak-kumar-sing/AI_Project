"use client"

import { useState, useEffect } from "react"
import AuthContainer from "@/components/auth/AuthContainer"
import MainApp from "@/components/main/MainApp"
import { UserProvider } from "@/context/UserContext"
import { VoiceProvider } from "@/context/VoiceContext"
import ParticlesBackground from "@/components/ui/ParticlesBackground"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading of resources
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-mirror-dark text-white">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-mirror-accent border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl font-semibold">Loading Smart Mirror...</p>
        </div>
      </div>
    )
  }

  return (
    <UserProvider>
      <VoiceProvider>
        <div className="dark bg-mirror-dark text-white min-h-screen">
          <ParticlesBackground />
          <AuthContainer />
          <MainApp />
        </div>
      </VoiceProvider>
    </UserProvider>
  )
}

