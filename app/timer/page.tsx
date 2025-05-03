"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Play, Pause, Clock, X, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { format, formatDistance } from "date-fns"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"

interface Contraction {
  id: string
  startTime: Date
  endTime: Date | null
  duration: number | null
}

export default function TimerPage() {
  const [contractions, setContractions] = useState<Contraction[]>([])
  const [currentContraction, setCurrentContraction] = useState<Contraction | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [averageDuration, setAverageDuration] = useState(0)
  const [averageInterval, setAverageInterval] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (timerActive && currentContraction) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - currentContraction.startTime.getTime()) / 1000)
        setElapsedTime(elapsed)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerActive, currentContraction])

  useEffect(() => {
    calculateAverages()
  }, [contractions])

  const startContraction = () => {
    const newContraction: Contraction = {
      id: Date.now().toString(),
      startTime: new Date(),
      endTime: null,
      duration: null,
    }

    setCurrentContraction(newContraction)
    setTimerActive(true)
    setElapsedTime(0)
  }

  const stopContraction = () => {
    if (!currentContraction) return

    const endTime = new Date()
    const duration = Math.floor((endTime.getTime() - currentContraction.startTime.getTime()) / 1000)

    const completedContraction: Contraction = {
      ...currentContraction,
      endTime,
      duration,
    }

    setContractions([completedContraction, ...contractions])
    setCurrentContraction(null)
    setTimerActive(false)
  }

  const deleteContraction = (id: string) => {
    setContractions(contractions.filter((c) => c.id !== id))
  }

  const calculateAverages = () => {
    if (contractions.length < 2) {
      setAverageDuration(0)
      setAverageInterval(0)
      return
    }

    // Calculate average duration
    const totalDuration = contractions.reduce((sum, c) => sum + (c.duration || 0), 0)
    const avgDuration = totalDuration / contractions.length

    // Calculate average interval between contractions
    let totalInterval = 0
    for (let i = 0; i < contractions.length - 1; i++) {
      const current = contractions[i]
      const next = contractions[i + 1]
      if (current.startTime && next.startTime) {
        totalInterval += (current.startTime.getTime() - next.startTime.getTime()) / 1000
      }
    }

    const avgInterval = contractions.length > 1 ? totalInterval / (contractions.length - 1) : 0

    setAverageDuration(avgDuration)
    setAverageInterval(avgInterval)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const shouldShowAlert = () => {
    // Alert if contractions are less than 5 minutes apart and lasting more than 60 seconds
    return averageInterval > 0 && averageInterval < 300 && averageDuration > 60
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
            <h1 className="text-xl font-semibold">Contraction Timer</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        {/* Timer Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Contraction Timer</CardTitle>
            <CardDescription>Track the frequency and duration of your contractions</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="text-5xl font-bold my-6">{formatTime(elapsedTime)}</div>
            <div className="flex gap-4">
              {!timerActive ? (
                <Button size="lg" className="bg-pink-600 hover:bg-pink-700" onClick={startContraction}>
                  <Play className="mr-2 h-5 w-5" />
                  Start Contraction
                </Button>
              ) : (
                <Button size="lg" variant="outline" onClick={stopContraction}>
                  <Pause className="mr-2 h-5 w-5" />
                  Stop Contraction
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        {contractions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Contractions:</span>
                <span className="font-medium">{contractions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average Duration:</span>
                <span className="font-medium">{formatTime(Math.round(averageDuration))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average Interval:</span>
                <span className="font-medium">
                  {averageInterval > 0 ? formatDistance(0, averageInterval * 1000, { includeSeconds: true }) : "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alert */}
        {shouldShowAlert() && (
          <Alert variant="destructive">
            <AlertTitle className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Contractions are close together
            </AlertTitle>
            <AlertDescription>
              Your contractions are less than 5 minutes apart and lasting more than 60 seconds. Consider contacting your
              healthcare provider.
            </AlertDescription>
          </Alert>
        )}

        {/* Contractions History */}
        {contractions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Contraction History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contractions.map((contraction, index) => (
                <div
                  key={contraction.id}
                  className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{format(contraction.startTime, "h:mm a")}</p>
                    <div className="flex text-sm text-muted-foreground space-x-4">
                      <span>Duration: {formatTime(contraction.duration || 0)}</span>
                      {index < contractions.length - 1 && (
                        <span>
                          Interval: {formatDistance(contractions[index + 1].startTime, contraction.startTime)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteContraction(contraction.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save History
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeItem="home" />
    </div>
  )
}
