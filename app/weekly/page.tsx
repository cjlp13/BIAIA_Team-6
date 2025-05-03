"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ChevronLeft, ChevronRight, Baby } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserAvatar } from "@/components/user-avatar"
import { useUser } from "@/contexts/user-context"
import { calculatePregnancyWeek } from "@/utils/pregnancy-utils"

export default function WeeklyPage() {
  const { user } = useUser()
  const [currentWeek, setCurrentWeek] = useState(28)

  // Calculate current week based on due date
  useEffect(() => {
    if (user?.dueDate) {
      const calculatedWeek = calculatePregnancyWeek(user.dueDate)
      setCurrentWeek(calculatedWeek)
    }
  }, [user?.dueDate])

  const decrementWeek = () => {
    if (currentWeek > 1) setCurrentWeek(currentWeek - 1)
  }

  const incrementWeek = () => {
    if (currentWeek < 40) setCurrentWeek(currentWeek + 1)
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
            <h1 className="text-xl font-semibold">Weekly Tracker</h1>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <UserAvatar />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        {/* Week Selector */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" size="icon" onClick={decrementWeek} disabled={currentWeek <= 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="text-center">
                <h2 className="text-2xl font-bold">Week {currentWeek}</h2>
                <p className="text-sm text-muted-foreground">
                  {currentWeek <= 13 ? "First Trimester" : currentWeek <= 26 ? "Second Trimester" : "Third Trimester"}
                </p>
              </div>

              <Button variant="outline" size="icon" onClick={incrementWeek} disabled={currentWeek >= 40}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Week Content */}
        <Tabs defaultValue="baby">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="baby">Baby</TabsTrigger>
            <TabsTrigger value="mom">Mom</TabsTrigger>
            <TabsTrigger value="tips">Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="baby" className="space-y-4 mt-4">
            <Card>
              <div className="relative h-48">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oDcXuMq8gEx0d6aqH0KQ0Quyz7EJfQ.png"
                  alt="Baby's foot wrapped in a pink blanket"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>Baby's Development</CardTitle>
                <CardDescription>Week {currentWeek}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-pink-100 dark:bg-pink-900 p-2 rounded-full">
                      <Baby className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Daily Tips</h3>
                      <p className="text-sm text-muted-foreground">Receive daily pregnancy tips and advice</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">Size</h3>
                    <p className="text-sm text-muted-foreground">
                      Your baby is now about the size of an eggplant, measuring around 14.8 inches long and weighing
                      about 2.2 pounds.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium">Development</h3>
                    <p className="text-sm text-muted-foreground">
                      Your baby's eyes can open and close now, and they can sense light. Their brain is developing
                      rapidly, and they're starting to have regular sleep and wake cycles.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium">Movement</h3>
                    <p className="text-sm text-muted-foreground">
                      You should be feeling regular movements. Your baby has established patterns of activity and rest.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mom" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Mom's Experience</CardTitle>
                <CardDescription>Week {currentWeek}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Physical Changes</h3>
                    <p className="text-sm text-muted-foreground">
                      You may be experiencing backaches, leg cramps, and shortness of breath as your uterus continues to
                      grow and put pressure on your organs.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium">Common Symptoms</h3>
                    <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                      <li>Heartburn and indigestion</li>
                      <li>Swelling in hands and feet</li>
                      <li>Braxton Hicks contractions</li>
                      <li>Trouble sleeping</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium">Weight Gain</h3>
                    <p className="text-sm text-muted-foreground">
                      By week 28, most women have gained between 17 and 24 pounds.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Tips & Recommendations</CardTitle>
                <CardDescription>Week {currentWeek}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Nutrition</h3>
                    <p className="text-sm text-muted-foreground">
                      Focus on iron-rich foods like lean meats, beans, and leafy greens to prevent anemia, which is
                      common in the third trimester.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium">Exercise</h3>
                    <p className="text-sm text-muted-foreground">
                      Swimming and prenatal yoga can help relieve back pain and improve sleep quality.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium">Preparation</h3>
                    <p className="text-sm text-muted-foreground">
                      Start preparing your hospital bag and finalizing your birth plan. Consider taking a childbirth
                      education class if you haven't already.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Save to My Notes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeItem="weekly" />
    </div>
  )
}
