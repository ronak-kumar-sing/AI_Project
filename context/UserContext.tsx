"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  name: string
  email: string
  faceDescriptor: Float32Array | null
}

interface UserContextType {
  currentUser: User | null
  users: User[]
  loginUser: (user: User, saveUser?: boolean) => void
  logoutUser: () => void
  addUser: (user: User) => void
  updateUserFaceDescriptor: (name: string, descriptor: Float32Array) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])

  // Load saved users on mount
  useEffect(() => {
    loadSavedUsers()
    checkLoggedInUser()
  }, [])

  // Load saved users from localStorage
  const loadSavedUsers = () => {
    try {
      const savedUsers = localStorage.getItem("smartMirrorUsers")
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers)

        // Convert Array descriptors back to Float32Array
        const convertedUsers = parsedUsers.map((user: any) => ({
          name: user.name,
          email: user.email,
          faceDescriptor: user.faceDescriptor ? new Float32Array(user.faceDescriptor) : null,
        }))

        setUsers(convertedUsers)
        console.log(`Loaded ${convertedUsers.length} users from storage`)
      }
    } catch (error) {
      console.error("Error loading saved users:", error)
    }
  }

  // Check if user is already logged in
  const checkLoggedInUser = () => {
    const savedUser = localStorage.getItem("smartMirrorUser")

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        loginUser(user, false)
      } catch (error) {
        console.error("Error parsing saved user:", error)
      }
    }
  }

  // Save users to localStorage
  const saveUsers = () => {
    try {
      localStorage.setItem(
        "smartMirrorUsers",
        JSON.stringify(
          users.map((user) => ({
            name: user.name,
            email: user.email,
            // Convert Float32Array to Array for storage
            faceDescriptor: user.faceDescriptor ? Array.from(user.faceDescriptor) : null,
          })),
        ),
      )
    } catch (error) {
      console.error("Error saving users:", error)
    }
  }

  // Login user
  const loginUser = (user: User, saveUser = true) => {
    setCurrentUser(user)

    // Save user to localStorage
    if (saveUser) {
      localStorage.setItem("smartMirrorUser", JSON.stringify(user))
    }
  }

  // Logout user
  const logoutUser = () => {
    setCurrentUser(null)
    localStorage.removeItem("smartMirrorUser")
  }

  // Add new user
  const addUser = (user: User) => {
    setUsers((prevUsers) => {
      const newUsers = [...prevUsers, user]
      // Save to localStorage
      localStorage.setItem(
        "smartMirrorUsers",
        JSON.stringify(
          newUsers.map((u) => ({
            name: u.name,
            email: u.email,
            faceDescriptor: u.faceDescriptor ? Array.from(u.faceDescriptor) : null,
          })),
        ),
      )
      return newUsers
    })
  }

  // Update user's face descriptor
  const updateUserFaceDescriptor = (name: string, descriptor: Float32Array) => {
    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.map((user) => {
        if (user.name.toLowerCase() === name.toLowerCase()) {
          return { ...user, faceDescriptor: descriptor }
        }
        return user
      })

      // Save to localStorage
      localStorage.setItem(
        "smartMirrorUsers",
        JSON.stringify(
          updatedUsers.map((u) => ({
            name: u.name,
            email: u.email,
            faceDescriptor: u.faceDescriptor ? Array.from(u.faceDescriptor) : null,
          })),
        ),
      )

      return updatedUsers
    })
  }

  return (
    <UserContext.Provider
      value={{
        currentUser,
        users,
        loginUser,
        logoutUser,
        addUser,
        updateUserFaceDescriptor,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

