"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Baby, Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useUser } from "@/contexts/user-context"

export default function LoginPage() {
  const router = useRouter()
  const { login, register } = useUser()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    dueDate: "",
    rememberMe: false,
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simple validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    if (!isLogin && !formData.name) {
      setError("Please enter your name")
      setIsLoading(false)
      return
    }

    try {
      // For registration
      if (!isLogin) {
        const success = await register(
          {
            name: formData.name,
            email: formData.email,
            dueDate: formData.dueDate || "2025-08-15",
            notifications: {
              dailyTips: true,
              weeklyUpdates: true,
              appointments: true,
            },
          },
          formData.password,
        )

        if (success) {
          // Redirect to home page after successful registration
          router.push("/")
        } else {
          setError("Registration failed. Please try again.")
        }
      }
      // For login
      else {
        const success = await login(formData.email, formData.password)

        if (success) {
          // Redirect to home page after successful login
          router.push("/")
        } else {
          setError("Invalid email or password")
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError("")
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Background Image and Welcome Text */}
      <div className="relative w-full md:w-1/2 bg-pink-600 text-white p-8 md:p-12 flex flex-col justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oDcXuMq8gEx0d6aqH0KQ0Quyz7EJfQ.png"
            alt="Baby's foot wrapped in a pink blanket"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600/80 to-pink-700/80" />
        </div>

        <div className="relative z-10 max-w-md">
          <div className="flex items-center mb-6">
            <Baby className="w-8 h-8 mr-2" />
            <h1 className="text-2xl font-bold">BIAIA</h1>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Your Pregnancy Journey</h2>
          <p className="text-lg mb-8 text-white/90">
            Track your pregnancy, connect with your baby, and prepare for the beautiful journey ahead with our
            comprehensive companion app.
          </p>

          <div className="flex space-x-4 mt-8">
            <a href="#" className="hover:text-white/80 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white/80 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white/80 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white/80 transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Right Side - Login/Register Form */}
      <div className="w-full md:w-1/2 bg-background p-8 md:p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6">{isLogin ? "Sign In" : "Create Account"}</h2>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date (Optional)</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
                disabled={isLoading}
              />
              <Label htmlFor="rememberMe" className="text-sm">
                Remember Me
              </Label>
            </div>

            <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {isLogin ? "Signing In..." : "Creating Account..."}
                </span>
              ) : (
                <span>{isLogin ? "Sign In" : "Create Account"}</span>
              )}
            </Button>
          </form>

          {isLogin && (
            <div className="text-center mt-4">
              <Link href="/forgot-password" className="text-sm text-pink-600 hover:underline">
                Forgot your password?
              </Link>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={toggleMode}
                className="ml-1 text-pink-600 hover:underline font-medium"
                disabled={isLoading}
              >
                {isLogin ? "Register" : "Sign In"}
              </button>
            </p>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-8">
            By clicking on "Sign In" or "Create Account" you agree to our{" "}
            <Link href="#" className="text-pink-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-pink-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
