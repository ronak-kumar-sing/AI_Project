"use client"

import { useState } from "react"

interface SmartHomeDevice {
  id: string
  name: string
  icon: string
  isActive: boolean
}

export default function SmartHomeControls() {
  const [devices, setDevices] = useState<SmartHomeDevice[]>([
    { id: "lights", name: "Lights", icon: "fa-lightbulb", isActive: false },
    { id: "thermostat", name: "Thermostat", icon: "fa-thermometer-half", isActive: false },
    { id: "security", name: "Security", icon: "fa-lock", isActive: false },
    { id: "music", name: "Music", icon: "fa-music", isActive: false },
  ])

  const toggleDevice = (id: string) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) => (device.id === id ? { ...device, isActive: !device.isActive } : device)),
    )

    // Find the device
    const device = devices.find((d) => d.id === id)

    if (device) {
      // Speak confirmation
      speakText(`${device.name} turned ${!device.isActive ? "on" : "off"}`)
    }
  }

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text)
      speech.lang = "en-US"
      window.speechSynthesis.speak(speech)
    }
  }

  return (
    <div className="mirror-card rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-4 gradient-text">Smart Home</h3>
      <div className="grid grid-cols-2 gap-4">
        {devices.map((device) => (
          <button
            key={device.id}
            className={`smart-home-button p-4 rounded-lg bg-mirror-card flex flex-col items-center ${device.isActive ? "active" : ""}`}
            onClick={() => toggleDevice(device.id)}
          >
            <i className={`fas ${device.icon} text-2xl mb-2`}></i>
            <span>{device.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

