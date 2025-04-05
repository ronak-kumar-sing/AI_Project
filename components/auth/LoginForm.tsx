"use client"

import { useState } from "react"
import { useUser } from "@/context/UserContext"
import { motion } from "framer-motion"

export default function LoginForm() {
  const { users, loginUser } = useUser()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = () => {
    // In a real app, you would use the Google Sign-In API
    setIsLoading(true)
    setTimeout(() => {
      loginUser({
        name: "Google User",
        email: "google.user@example.com",
        faceDescriptor: null,
      })
      setIsLoading(false)
    }, 1000)
  }

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please enter both email and password")
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Find user by email
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

      if (user) {
        // In a real app, you would validate the password
        loginUser(user)
      } else {
        // Create a new user if not found
        const newUser = {
          name: email.split("@")[0],
          email: email,
          faceDescriptor: null,
        }

        // Add user to our local array
        loginUser(newUser)
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <button
        className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-lg transition-all mb-6"
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        <i className="fab fa-google"></i>
        <span>Continue with Google</span>
      </button>

      <div className="relative flex items-center my-6">
        <div className="flex-grow border-t border-gray-700"></div>
        <span className="flex-shrink mx-4 text-gray-400">or continue with email</span>
        <div className="flex-grow border-t border-gray-700"></div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mirror-accent transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-400">
              Password
            </label>
            <a href="#" className="text-sm text-mirror-accent hover:underline">
              Forgot password?
            </a>
          </div>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mirror-accent transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            className="h-4 w-4 text-mirror-accent border-gray-700 rounded focus:ring-mirror-accent"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
            Remember me
          </label>
        </div>
      </div>

      <button
        className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-mirror-accent to-mirror-accent2 text-white rounded-lg hover:opacity-90 transition-all flex items-center justify-center"
        onClick={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </button>
    </motion.div>
  )
}

