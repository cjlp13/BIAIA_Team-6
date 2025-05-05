"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

// Update the UserProfile interface to allow null for avatarUrl
export interface UserProfile {
  name: string
  email: string
  dueDate: string
  avatar?: string
  avatarUrl?: string | null
  notifications: {
    dailyTips: boolean
    weeklyUpdates: boolean
    appointments: boolean
  }
}

interface UserContextType {
  user: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: Partial<UserProfile>, password: string) => Promise<boolean>
  updateUser: (data: Partial<UserProfile>) => void
  logout: () => void
}

// Update the defaultUser to include a null avatarUrl
const defaultUser: UserProfile = {
  name: "Maria Juliana",
  email: "mariajuliana@gmail.com",
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
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Load user data from localStorage on initial render
    const loadUser = () => {
      try {
        const authToken = localStorage.getItem("auth_token")
        const savedUser = localStorage.getItem("user")

        if (authToken && savedUser) {
          setUser(JSON.parse(savedUser))
          setIsAuthenticated(true)
          // Set cookie for middleware authentication check
          document.cookie = `auth_token=${authToken}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error("Failed to load user data:", error)
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call to verify credentials
    if (email === "mariajuliana@gmail.com" && password === "password") {
      const userData = defaultUser

      // Create a mock auth token
      const authToken = `mock-token-${Date.now()}`

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(userData))
      localStorage.setItem("auth_token", authToken)

      // Set cookie for middleware authentication check
      document.cookie = `auth_token=${authToken}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days

      setUser(userData)
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const register = async (userData: Partial<UserProfile>, password: string): Promise<boolean> => {
    // In a real app, this would be an API call to create a user
    try {
      const newUser = {
        ...defaultUser,
        ...userData,
      }

      // Create a mock auth token
      const authToken = `mock-token-${Date.now()}`

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(newUser))
      localStorage.setItem("auth_token", authToken)

      // Set cookie for middleware authentication check
      document.cookie = `auth_token=${authToken}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days

      setUser(newUser)
      setIsAuthenticated(true)
      return true
    } catch (error) {
      console.error("Registration failed:", error)
      return false
    }
  }

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
    localStorage.removeItem("auth_token")
    // Remove the auth cookie
    document.cookie = "auth_token=; path=/; max-age=0"
    setUser(null)
    setIsAuthenticated(false)
    router.push("/login")
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        updateUser,
        logout,
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
