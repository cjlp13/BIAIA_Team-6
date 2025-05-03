"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Bell, Shield, HelpCircle, ChevronRight, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { useUser } from "@/contexts/user-context"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { user, updateUser, logout, isLoading } = useUser()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  const handleNotificationToggle = (key: keyof typeof user.notifications) => {
    if (!user?.notifications) return;  // Ensure user and notifications are available
  
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      if (key && user.notifications[key] !== undefined) {
        updateUser({
          notifications: {
            ...user.notifications,
            [key]: !user.notifications[key] // Toggle the notification setting
          }
        });
        setIsSaving(false);
        
        setSaveMessage("Settings updated!");
        setTimeout(() => setSaveMessage(""), 3000);
      }
    }, 500);
  };
  
  

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg mb-4">Please log in to view settings</p>
          <Button asChild>
            <Link href="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="mr-3">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <h1 className="text-xl font-semibold">Settings</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        {/* Profile Link */}
        <Card className="cursor-pointer" onClick={() => router.push("/profile")}>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">My Profile</h3>
              <p className="text-sm text-muted-foreground">View and edit your profile information</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </CardContent>
        </Card>

        {/* Theme Toggle */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize your app experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  {theme === "dark" ? (
                    <Moon className="w-5 h-5 text-primary" />
                  ) : (
                    <Sun className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                </div>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
            </div>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {saveMessage && (
              <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-3 rounded-md text-sm mb-4">
                {saveMessage}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-pink-100 dark:bg-pink-900 p-2 rounded-full">
                  <Bell className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-medium">Daily Tips</h3>
                  <p className="text-sm text-muted-foreground">Receive daily pregnancy tips and advice</p>
                </div>
              </div>
              <Switch
                checked={user.notifications.dailyTips}
                onCheckedChange={() => handleNotificationToggle("dailyTips")}
                disabled={isSaving}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Weekly Updates</h3>
                  <p className="text-sm text-muted-foreground">Receive weekly pregnancy progress updates</p>
                </div>
              </div>
              <Switch
                checked={user.notifications.weeklyUpdates}
                onCheckedChange={() => handleNotificationToggle("weeklyUpdates")}
                disabled={isSaving}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                  <Bell className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">Appointment Reminders</h3>
                  <p className="text-sm text-muted-foreground">Receive reminders for upcoming appointments</p>
                </div>
              </div>
              <Switch
                checked={user.notifications.appointments}
                onCheckedChange={() => handleNotificationToggle("appointments")}
                disabled={isSaving}
              />
            </div>
          </CardContent>
        </Card>

        {/* Other Settings */}
        <Card>
          <CardHeader>
            <CardTitle>More Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Privacy Settings</h3>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-full">
                  <HelpCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-medium">Help & Support</h3>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>

            <Separator />

            <Button
              variant="outline"
              className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeItem="settings" />
    </div>
  )
}
