"use client"

import { useState } from "react"
import { useUser } from "@/context/UserContext"
import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"
import { motion } from "framer-motion"

export default function AuthContainer() {
  const { currentUser } = useUser()
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")

  if (currentUser) {
    return null // Don't render auth container if user is logged in
  }

  return (
    <div className="auth-container min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="auth-card mirror-card rounded-xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Smart Mirror</h1>
          <p className="text-gray-400">Your personal AI assistant</p>
        </div>

        {/* Auth Tabs */}
        <div className="flex border-b border-gray-700 mb-8">
          <button
            className={`flex-1 py-3 text-center font-medium transition-all ${
              activeTab === "login"
                ? "text-mirror-accent border-b-2 border-mirror-accent"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium transition-all ${
              activeTab === "signup"
                ? "text-mirror-accent border-b-2 border-mirror-accent"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Login Form */}
        {activeTab === "login" && <LoginForm />}

        {/* Signup Form */}
        {activeTab === "signup" && <SignupForm />}
      </motion.div>
    </div>
  )
}

