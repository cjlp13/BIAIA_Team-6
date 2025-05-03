"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Baby, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simple validation
    if (!email) {
      setError("Please enter your email address")
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      // In a real app, this would send a password reset email
      setIsSubmitted(true)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-white dark:from-pink-950 dark:to-background p-4">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oDcXuMq8gEx0d6aqH0KQ0Quyz7EJfQ.png"
          alt="Baby's foot wrapped in a pink blanket"
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center bg-pink-600 text-white p-3 rounded-full mb-4">
            <Baby className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-center">BIAIA</h1>
          <p className="text-muted-foreground text-center mt-2">Your Pregnancy Companion</p>
        </div>

        <Card className="border-pink-200 dark:border-pink-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            {isSubmitted ? (
              <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <AlertTitle>Check your email</AlertTitle>
                <AlertDescription>
                  We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the
                  instructions to reset your password.
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={isLoading}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send reset link"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/signin" className="flex items-center text-pink-600 hover:underline">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to sign in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
