"use client"

import { useState } from "react"
import { useUser } from "@/context/UserContext"
import { motion } from "framer-motion"

export default function SignupForm() {
  const { users, loginUser, addUser } = useUser()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignup = () => {
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

  const handleSignup = () => {
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    if (!termsAccepted) {
      alert("Please agree to the Terms of Service and Privacy Policy")
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Check if user already exists
      const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

      if (existingUser) {
        alert("An account with this email already exists")
        setIsLoading(false)
        return
      }

      // Create new user
      const newUser = {
        name: name,
        email: email,
        faceDescriptor: null,
      }

      // Add user to our local array
      addUser(newUser)

      // Login the user
      loginUser(newUser)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <button
        className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-lg transition-all mb-6"
        onClick={handleGoogleSignup}
        disabled={isLoading}
      >
        <i className="fab fa-google"></i>
        <span>Sign up with Google</span>
      </button>

      <div className="relative flex items-center my-6">
        <div className="flex-grow border-t border-gray-700"></div>
        <span className="flex-shrink mx-4 text-gray-400">or sign up with email</span>
        <div className="flex-grow border-t border-gray-700"></div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mirror-accent transition-all"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="signup-email" className="block text-sm font-medium text-gray-400 mb-1">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mirror-accent transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="signup-password" className="block text-sm font-medium text-gray-400 mb-1">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mirror-accent transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-400 mb-1">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mirror-accent transition-all"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 text-mirror-accent border-gray-700 rounded focus:ring-mirror-accent"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
          </div>
          <div className="ml-3">
            <label htmlFor="terms" className="text-sm text-gray-400">
              I agree to the{" "}
              <a href="#" className="text-mirror-accent hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-mirror-accent hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>
        </div>
      </div>

      <button
        className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-mirror-accent to-mirror-accent2 text-white rounded-lg hover:opacity-90 transition-all flex items-center justify-center"
        onClick={handleSignup}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </button>
    </motion.div>
  )
}

