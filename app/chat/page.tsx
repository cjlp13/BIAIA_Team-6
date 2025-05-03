"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Send, User, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ThemeToggle } from "@/components/theme-toggle"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

// Sample AI responses for pregnancy-related questions
const aiResponses = [
  {
    keywords: ["morning sickness", "nausea", "vomit"],
    response:
      "Morning sickness is common during the first trimester. Try eating small, frequent meals, staying hydrated, and avoiding strong smells. Ginger tea or crackers might help ease nausea. If vomiting is severe, talk to your doctor about medication options.",
  },
  {
    keywords: ["kick", "movement", "moving"],
    response:
      "Baby movements typically start between 16-25 weeks. First-time moms often feel movements later than experienced moms. Early movements feel like flutters or bubbles. By the third trimester, you should feel regular movements daily.",
  },
  {
    keywords: ["pain", "cramp", "contraction"],
    response:
      "Some cramping is normal during pregnancy as your uterus grows. However, severe or regular pain could indicate preterm labor. Use the contraction timer feature if you think you're having contractions, and contact your healthcare provider if you're concerned.",
  },
  {
    keywords: ["diet", "eat", "food", "nutrition"],
    response:
      "Focus on a balanced diet with plenty of fruits, vegetables, whole grains, lean proteins, and healthy fats. Aim for 300-500 extra calories daily. Stay hydrated and take your prenatal vitamins. Avoid raw fish, unpasteurized dairy, and limit caffeine.",
  },
  {
    keywords: ["sleep", "insomnia", "tired"],
    response:
      "Sleep challenges are common during pregnancy. Try sleeping on your left side with pillows supporting your belly and between your knees. Establish a relaxing bedtime routine and avoid screens before bed. Talk to your doctor if insomnia is severe.",
  },
  {
    keywords: ["exercise", "workout", "active"],
    response:
      "Regular exercise is beneficial during pregnancy. Aim for 150 minutes of moderate activity weekly. Walking, swimming, and prenatal yoga are excellent options. Listen to your body and avoid activities with fall risks or abdominal trauma.",
  },
  {
    keywords: ["weight", "gain"],
    response:
      "Healthy weight gain depends on your pre-pregnancy BMI. Generally, 25-35 pounds is recommended for normal weight women, 15-25 pounds if overweight, and 11-20 pounds if obese. Weight gain should be gradual throughout pregnancy.",
  },
  {
    keywords: ["baby name", "name"],
    response:
      "Choosing a baby name is exciting! Consider family traditions, name meanings, how it sounds with your last name, and potential nicknames. Check out our Baby Names feature for suggestions and to save your favorites.",
  },
  {
    keywords: ["birth plan", "delivery", "labor"],
    response:
      "A birth plan helps communicate your preferences for labor and delivery. Consider pain management, who you want present, atmosphere preferences, and contingency plans. Remember that flexibility is important as circumstances may require adjustments.",
  },
  {
    keywords: ["hello", "hi", "hey"],
    response: "Hello! I'm your BIAIA pregnancy assistant. How can I help you today with your pregnancy journey?",
  },
]

// Default response if no keywords match
const defaultResponse =
  "I'm here to support you through your pregnancy journey. Feel free to ask me about symptoms, development, nutrition, or any other pregnancy-related concerns."

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your BIAIA pregnancy assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Generate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputValue),
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    // Check for keyword matches
    for (const item of aiResponses) {
      if (item.keywords.some((keyword) => input.includes(keyword))) {
        return item.response
      }
    }

    return defaultResponse
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
            <h1 className="text-xl font-semibold">AI Assistant</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 container mx-auto px-4 py-6 overflow-y-auto">
        <div className="space-y-4 pb-20">
          {messages.map((message) => (
            <div key={message.id} className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}>
              <div className="flex items-start gap-2 max-w-[80%]">
                {message.sender === "ai" && (
                  <Avatar className="mt-1">
                    <AvatarFallback className="bg-pink-100 text-pink-600 dark:bg-pink-900">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <Card className={cn("p-3 text-sm", message.sender === "user" ? "bg-pink-600 text-white" : "bg-muted")}>
                  {message.content}
                </Card>
                {message.sender === "user" && (
                  <Avatar className="mt-1">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <div className="sticky bottom-16 bg-background border-t border-border p-4">
        <div className="container mx-auto flex items-center gap-2">
          <Input
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage()
              }
            }}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSendMessage} disabled={inputValue.trim() === ""}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeItem="chat" />
    </div>
  )
}
