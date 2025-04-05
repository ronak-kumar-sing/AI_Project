"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/context/UserContext"

export default function GreetingCard() {
  const { currentUser } = useUser()
  const [time, setTime] = useState("00:00:00")
  const [date, setDate] = useState("Monday, Jan 1")
  const [greeting, setGreeting] = useState("Hello")

  useEffect(() => {
    // Update clock every second
    const clockInterval = setInterval(updateClock, 1000)

    // Initial update
    updateClock()

    return () => clearInterval(clockInterval)
  }, [currentUser])

  const updateClock = () => {
    const now = new Date()

    // Update time
    const hours = now.getHours().toString().padStart(2, "0")
    const minutes = now.getMinutes().toString().padStart(2, "0")
    const seconds = now.getSeconds().toString().padStart(2, "0")
    setTime(`${hours}:${minutes}:${seconds}`)

    // Update date
    const options: Intl.DateTimeFormatOptions = { weekday: "long", month: "short", day: "numeric" }
    setDate(now.toLocaleDateString("en-US", options))

    // Update greeting based on time
    updateGreeting(now.getHours())
  }

  const updateGreeting = (hour: number) => {
    let greetingText = "Good morning"

    if (hour >= 12 && hour < 18) {
      greetingText = "Good afternoon"
    } else if (hour >= 18) {
      greetingText = "Good evening"
    }

    // Use recognized user if available, otherwise use logged in user
    const displayName = currentUser?.name || "User"
    setGreeting(`${greetingText}, ${displayName}!`)
  }

  return (
    <div className="mirror-card rounded-xl p-6 gradient-border">
      <h2 className="text-4xl font-light mb-2 gradient-text">{greeting}</h2>
      <div className="flex flex-wrap items-end">
        <div className="text-6xl font-bold">{time}</div>
        <div className="ml-4 text-xl text-gray-400">{date}</div>
      </div>
    </div>
  )
}

