"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Update the UserProfile interface to include avatarUrl
export interface UserProfile {
  name: string
  email: string
  dueDate: string
  avatar?: string
  avatarUrl?: string
  notifications: {
    dailyTips: boolean
    weeklyUpdates: boolean
    appointments: boolean
  }
}

interface UserContextType {
  user: UserProfile | null
  isLoading: boolean
  updateUser: (data: Partial<UserProfile>) => void
  logout: () => void
}

// Update the defaultUser to include a null avatarUrl
const defaultUser: UserProfile = {
  name: "Maria Johnson",
  email: "maria@example.com",
  dueDate: "2025-08-15",
  avatarUrl: null,
  notifications: {
    dailyTips: true,
    weeklyUpdates: true,
    appointments: true,
  },
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load user data from localStorage on initial render
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem("user")
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        } else {
          // Set default user if none exists
          setUser(defaultUser)
          localStorage.setItem("user", JSON.stringify(defaultUser))
        }
      } catch (error) {
        console.error("Failed to load user data:", error)
        setUser(defaultUser)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const updateUser = (data: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null

      const updatedUser = {
        ...prev,
        ...data,
        notifications: {
          ...prev.notifications,
          ...(data.notifications || {}),
        },
      }

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser))
      return updatedUser
    })
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    // In a real app, you might redirect to login page here
  }

  return <UserContext.Provider value={{ user, isLoading, updateUser, logout }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
