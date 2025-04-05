"use client"

import { useUser } from "@/context/UserContext"
import Header from "./Header"
import GreetingCard from "./GreetingCard"
import WeatherCard from "./WeatherCard"
import VoiceAssistant from "./VoiceAssistant"
import ChatInterface from "./ChatInterface"
import SmartHomeControls from "./SmartHomeControls"
import HealthMetrics from "./HealthMetrics"
import VideoChat from "./VideoChat"
import TaskPlanner from "./TaskPlanner"

export default function MainApp() {
  const { currentUser } = useUser()

  if (!currentUser) {
    return null // Don't render main app if user is not logged in
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Header />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <GreetingCard />
          <TaskPlanner />
          <VideoChat />
          <WeatherCard />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <VoiceAssistant />
          <ChatInterface />
          <SmartHomeControls />
          <HealthMetrics />
        </div>
      </div>
    </div>
  )
}

