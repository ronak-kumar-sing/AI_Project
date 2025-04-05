"use client"

import { useState } from "react"
import { useUser } from "@/context/UserContext"
import { useVoice } from "@/context/VoiceContext"
import { useTheme } from "next-themes"

export default function Header() {
  const { currentUser, logoutUser } = useUser()
  const { isMuted, toggleMute } = useVoice()
  const { theme, setTheme } = useTheme()
  const [showDropdown, setShowDropdown] = useState(false)

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="flex justify-between items-center mb-6">
      <h1 className="text-4xl font-bold gradient-text">Smart Mirror</h1>
      <div className="flex items-center gap-4">
        <button
          className="p-3 rounded-full bg-mirror-card text-white hover:glow transition-all"
          onClick={toggleMute}
          title={isMuted ? "Unmute AI Voice" : "Mute AI Voice"}
        >
          <i className={`fas ${isMuted ? "fa-volume-mute" : "fa-volume-up"}`}></i>
        </button>
        <button className="p-3 rounded-full bg-mirror-card text-white hover:glow transition-all" onClick={toggleTheme}>
          <i className={`fas ${theme === "dark" ? "fa-sun" : "fa-moon"}`}></i>
        </button>
        <div className="user-dropdown">
          <button
            className="flex items-center p-2 rounded-full bg-mirror-card hover:glow transition-all"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="w-8 h-8 rounded-full bg-mirror-accent flex items-center justify-center mr-2">
              <i className="fas fa-user"></i>
            </div>
            <span>{currentUser?.name || "User"}</span>
            <i className="fas fa-chevron-down ml-2"></i>
          </button>
          {showDropdown && (
            <div className="dropdown-menu show">
              <a href="#" className="dropdown-item">
                <i className="fas fa-user-circle"></i> Profile
              </a>
              <a href="#" className="dropdown-item">
                <i className="fas fa-cog"></i> Settings
              </a>
              <a
                href="#"
                className="dropdown-item"
                onClick={(e) => {
                  e.preventDefault()
                  logoutUser()
                }}
              >
                <i className="fas fa-sign-out-alt"></i> Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

