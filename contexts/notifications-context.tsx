"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success"
  date: Date
  read: boolean
}

interface NotificationsContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "date" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotification: (id: string) => void
  clearAllNotifications: () => void
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

// Sample initial notifications
const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Weekly Update",
    message: "Your baby is now the size of an eggplant! Check out this week's development.",
    type: "info",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
  },
  {
    id: "2",
    title: "Appointment Reminder",
    message: "You have an appointment with Dr. Sarah Johnson tomorrow at 10:00 AM.",
    type: "warning",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: false,
  },
  {
    id: "3",
    title: "New Feature",
    message: "We've added a new Kick Counter feature to help you track your baby's movements.",
    type: "success",
    date: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    read: false,
  },
]

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Load notifications from localStorage on initial render
  useEffect(() => {
    const loadNotifications = () => {
      try {
        const savedNotifications = localStorage.getItem("notifications")
        if (savedNotifications) {
          const parsedNotifications = JSON.parse(savedNotifications)
          // Convert string dates back to Date objects
          const notificationsWithDates = parsedNotifications.map((notification: any) => ({
            ...notification,
            date: new Date(notification.date),
          }))
          setNotifications(notificationsWithDates)
        } else {
          // Set initial notifications if none exist
          setNotifications(initialNotifications)
          localStorage.setItem("notifications", JSON.stringify(initialNotifications))
        }
      } catch (error) {
        console.error("Failed to load notifications:", error)
        setNotifications(initialNotifications)
      }
    }

    loadNotifications()
  }, [])

  // Update unread count whenever notifications change
  useEffect(() => {
    const count = notifications.filter((notification) => !notification.read).length
    setUnreadCount(count)

    // Save to localStorage whenever notifications change
    localStorage.setItem("notifications", JSON.stringify(notifications))
  }, [notifications])

  const addNotification = (notification: Omit<Notification, "id" | "date" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      date: new Date(),
      read: false,
    }

    setNotifications((prev) => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}
