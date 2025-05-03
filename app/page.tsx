"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Baby,
  Calendar,
  Book,
  Settings,
  Home,
  ChevronRight,
  MessageCircle,
  Camera,
  Clock,
  ShoppingBag,
  Clipboard,
  Activity,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserAvatar } from "@/components/user-avatar"
import { useUser } from "@/contexts/user-context"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { useNotifications } from "@/contexts/notifications-context"
import { calculatePregnancyProgress, calculatePregnancyWeek, getCurrentTrimester } from "@/utils/pregnancy-utils"
import { format } from "date-fns"

export default function HomePage() {
  const { user } = useUser()
  const { addNotification } = useNotifications()
  const [progress, setProgress] = useState(0)
  const [currentWeek, setCurrentWeek] = useState(1)
  const [trimester, setTrimester] = useState<"first" | "second" | "third">("first")

  // Calculate pregnancy progress based on due date
  useEffect(() => {
    if (user?.dueDate) {
      const calculatedProgress = calculatePregnancyProgress(user.dueDate)
      const calculatedWeek = calculatePregnancyWeek(user.dueDate)
      const calculatedTrimester = getCurrentTrimester(calculatedWeek)

      setProgress(calculatedProgress)
      setCurrentWeek(calculatedWeek)
      setTrimester(calculatedTrimester)
    }
  }, [user?.dueDate])

  // Function to add a test notification (for demo purposes)
  const addTestNotification = () => {
    addNotification({
      title: "New Tip Available",
      message: "Check out our new tips for week " + currentWeek + " of your pregnancy!",
      type: "info",
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Baby className="w-5 h-5 mr-2 text-pink-600" />
            <h1 className="text-xl font-semibold">BIAIA</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <NotificationsDropdown />
            <UserAvatar />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        {/* Hero Section */}
        <Card className="overflow-hidden border-none shadow-md">
          <div className="relative h-48">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oDcXuMq8gEx0d6aqH0KQ0Quyz7EJfQ.png"
              alt="Baby's foot wrapped in a pink blanket"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
              <h2 className="text-white text-2xl font-bold">Welcome back, {user?.name.split(" ")[0] || "Mommy"}!</h2>
              <p className="text-white/90">
                Week {currentWeek}: {trimester.charAt(0).toUpperCase() + trimester.slice(1)} Trimester
              </p>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Week 1</span>
                <span>Week 40</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Today's Summary</CardTitle>
            <CardDescription>{format(new Date(), "MMMM d, yyyy")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-pink-100 dark:bg-pink-900 p-2 rounded-full">
                <Baby className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h3 className="font-medium">Baby's Development</h3>
                <p className="text-sm text-muted-foreground">
                  {currentWeek < 10
                    ? "Your baby is still very tiny, developing essential organs and structures."
                    : currentWeek < 20
                      ? "Your baby is growing rapidly, with more defined features and movements."
                      : currentWeek < 30
                        ? "Your baby is gaining weight and developing senses, with regular movement patterns."
                        : "Your baby is preparing for birth, with most organs fully developed and gaining weight."}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Upcoming Appointment</h3>
                <p className="text-sm text-muted-foreground">Dr. Sarah Johnson - May 15, 10:00 AM</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/weekly">View Weekly Details</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Test Notification Button (for demo purposes) */}
        <Button onClick={addTestNotification} className="w-full">
          Send Test Notification
        </Button>

        {/* New Features Section */}
        <Card className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950 border-pink-200 dark:border-pink-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-pink-700 dark:text-pink-300">New Features</CardTitle>
            <CardDescription>Explore our latest additions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/appointments" className="block">
              <div className="flex items-center justify-between hover:bg-white/50 dark:hover:bg-white/5 p-2 rounded-md transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="bg-pink-100 dark:bg-pink-900 p-2 rounded-full">
                    <Clipboard className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Appointment Scheduler</h3>
                    <p className="text-sm text-muted-foreground">Track and manage your doctor visits</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Link>

            <Link href="/guidelines" className="block">
              <div className="flex items-center justify-between hover:bg-white/50 dark:hover:bg-white/5 p-2 rounded-md transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Pregnancy Do's & Don'ts</h3>
                    <p className="text-sm text-muted-foreground">Essential guidelines for a healthy pregnancy</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Link>

            <Link href="/activities" className="block">
              <div className="flex items-center justify-between hover:bg-white/50 dark:hover:bg-white/5 p-2 rounded-md transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                    <Activity className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Recommended Activities</h3>
                    <p className="text-sm text-muted-foreground">Safe exercises during pregnancy</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/chat" className="no-underline">
            <Card className="hover:bg-accent transition-colors h-full">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                <MessageCircle className="w-8 h-8 text-pink-600" />
                <h3 className="font-medium">AI Assistant</h3>
                <p className="text-xs text-muted-foreground">Chat with your pregnancy companion</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/names" className="no-underline">
            <Card className="hover:bg-accent transition-colors h-full">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                <Baby className="w-8 h-8 text-pink-600" />
                <h3 className="font-medium">Baby Names</h3>
                <p className="text-xs text-muted-foreground">Explore and save name ideas</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link href="/gallery" className="no-underline">
            <Card className="hover:bg-accent transition-colors h-full">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                <Camera className="w-8 h-8 text-pink-600" />
                <h3 className="font-medium">Photo Gallery</h3>
                <p className="text-xs text-muted-foreground">Capture your journey</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/timer" className="no-underline">
            <Card className="hover:bg-accent transition-colors h-full">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                <Clock className="w-8 h-8 text-pink-600" />
                <h3 className="font-medium">Contraction Timer</h3>
                <p className="text-xs text-muted-foreground">Track your contractions</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link href="/journal" className="no-underline">
            <Card className="hover:bg-accent transition-colors h-full">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                <Book className="w-8 h-8 text-pink-600" />
                <h3 className="font-medium">Journal Entry</h3>
                <p className="text-xs text-muted-foreground">Record your thoughts and feelings</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/shopping" className="no-underline">
            <Card className="hover:bg-accent transition-colors h-full">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                <ShoppingBag className="w-8 h-8 text-pink-600" />
                <h3 className="font-medium">Shopping List</h3>
                <p className="text-xs text-muted-foreground">Track baby essentials</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Tips & Articles */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Tips & Articles</CardTitle>
            <CardDescription>Helpful information for your journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                  <Baby className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">Staying Hydrated</h3>
                  <p className="text-sm text-muted-foreground">Tips for drinking enough water</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                  <Baby className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Healthy Eating</h3>
                  <p className="text-sm text-muted-foreground">Nutrition for you and baby</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full">
              View All Articles
            </Button>
          </CardFooter>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 bg-background border-t border-border py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-around">
            <Link href="/" className="flex flex-col items-center text-pink-600">
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link href="/weekly" className="flex flex-col items-center text-muted-foreground hover:text-pink-600">
              <Calendar className="w-6 h-6" />
              <span className="text-xs mt-1">Weekly</span>
            </Link>
            <Link href="/chat" className="flex flex-col items-center text-muted-foreground hover:text-pink-600">
              <MessageCircle className="w-6 h-6" />
              <span className="text-xs mt-1">Chat</span>
            </Link>
            <Link href="/journal" className="flex flex-col items-center text-muted-foreground hover:text-pink-600">
              <Book className="w-6 h-6" />
              <span className="text-xs mt-1">Journal</span>
            </Link>
            <Link href="/settings" className="flex flex-col items-center text-muted-foreground hover:text-pink-600">
              <Settings className="w-6 h-6" />
              <span className="text-xs mt-1">Settings</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
