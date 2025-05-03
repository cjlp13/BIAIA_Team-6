"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, User, Mail, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from "@/contexts/user-context"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { format } from "date-fns"
import { ImageUpload } from "@/components/image-upload"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilePage() {
  const { user, updateUser, isLoading } = useUser()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dueDate: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [activeTab, setActiveTab] = useState("info")

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        dueDate: user.dueDate,
      })
    }
  }, [user])

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
          <p className="text-lg mb-4">Please log in to view your profile</p>
          <Button asChild>
            <Link href="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      updateUser(formData)
      setSaveMessage("Profile updated successfully!")
      setIsSaving(false)

      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveMessage("")
      }, 3000)
    }, 1000)
  }

  const handleImageChange = (imageData: string | null) => {
    // Update the user's avatar in the context
    updateUser({ avatarUrl: imageData })

    // Show success message
    setSaveMessage("Profile picture updated successfully!")

    // Clear message after 3 seconds
    setTimeout(() => {
      setSaveMessage("")
    }, 3000)
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  const dueDate = new Date(user.dueDate)
  const formattedDueDate = isNaN(dueDate.getTime()) ? "Not set" : format(dueDate, "MMMM d, yyyy")
  const weeksUntilDue = isNaN(dueDate.getTime())
    ? 0
    : Math.max(0, Math.floor((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 7)))

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="mr-3">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <h1 className="text-xl font-semibold">My Profile</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        {/* Profile Summary Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <ImageUpload initialImage={user.avatarUrl || undefined} onImageChange={handleImageChange} size="lg" />

              <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-4 flex flex-col items-center">
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-pink-600" />
                  <span>Due Date: {formattedDueDate}</span>
                </div>
                {weeksUntilDue > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {weeksUntilDue} {weeksUntilDue === 1 ? "week" : "weeks"} until due date
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Profile Sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Personal Info</TabsTrigger>
            <TabsTrigger value="photo">Profile Photo</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4">
            {/* Edit Profile Form */}
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="dueDate"
                        name="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  {saveMessage && (
                    <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-3 rounded-md text-sm">
                      {saveMessage}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="photo" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Photo</CardTitle>
                <CardDescription>Upload or change your profile picture</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <ImageUpload initialImage={user.avatarUrl || undefined} onImageChange={handleImageChange} size="lg" />

                  {saveMessage && (
                    <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-3 rounded-md text-sm mt-4 w-full">
                      {saveMessage}
                    </div>
                  )}

                  <div className="mt-6 text-sm text-muted-foreground">
                    <h4 className="font-medium text-foreground mb-2">Tips for a good profile photo:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Use a clear, well-lit photo</li>
                      <li>Choose a recent photo that looks like you</li>
                      <li>Select an image less than 5MB in size</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeItem="home" />
    </div>
  )
}
