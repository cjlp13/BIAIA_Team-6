"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Heart, Clock, Info, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface Exercise {
  id: string
  name: string
  description: string
  benefits: string[]
  instructions: string[]
  duration: string
  intensity: "Low" | "Moderate" | "Varies"
  trimester: "all" | "first" | "second" | "third"
  cautions?: string
  imageUrl: string
}

// Sample exercises data
const exercisesData: Exercise[] = [
  {
    id: "1",
    name: "Walking",
    description: "A simple, effective exercise that's safe throughout pregnancy.",
    benefits: [
      "Improves cardiovascular health",
      "Helps manage weight gain",
      "Reduces risk of gestational diabetes",
      "Boosts mood and energy levels",
    ],
    instructions: [
      "Start with 10-15 minutes if you're new to exercise",
      "Gradually increase to 30 minutes most days",
      "Wear supportive shoes and comfortable clothing",
      "Stay hydrated and walk in cool, shaded areas when possible",
    ],
    duration: "20-30 minutes, 3-5 times per week",
    intensity: "Low",
    trimester: "all",
    imageUrl: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "2",
    name: "Swimming",
    description: "Excellent low-impact exercise that works the entire body while supporting your weight.",
    benefits: [
      "Reduces swelling and joint pain",
      "Improves circulation",
      "Strengthens muscles without strain",
      "Helps maintain fitness with minimal injury risk",
    ],
    instructions: [
      "Use the freestyle, backstroke, or breaststroke",
      "Avoid diving or jumping into water",
      "Use a kickboard if needed for support",
      "Swim at a comfortable pace that doesn't leave you breathless",
    ],
    duration: "20-30 minutes, 2-3 times per week",
    intensity: "Moderate",
    trimester: "all",
    imageUrl: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "3",
    name: "Prenatal Yoga",
    description: "Gentle stretching and breathing exercises specifically designed for pregnant women.",
    benefits: [
      "Improves flexibility and balance",
      "Reduces stress and anxiety",
      "Helps prepare for labor and delivery",
      "Strengthens pelvic floor muscles",
    ],
    instructions: [
      "Join a prenatal yoga class or follow pregnancy-specific videos",
      "Focus on breathing and gentle stretching",
      "Avoid deep twists and poses that put pressure on your abdomen",
      "Use props like blocks and bolsters for support",
    ],
    duration: "20-45 minutes, 2-3 times per week",
    intensity: "Low",
    trimester: "all",
    cautions: "Avoid hot yoga, deep twists, and lying flat on your back after the first trimester.",
    imageUrl: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "4",
    name: "Stationary Cycling",
    description: "Low-impact cardio that's gentle on joints while providing a good workout.",
    benefits: [
      "Improves cardiovascular fitness",
      "Strengthens leg muscles",
      "Reduces pressure on joints",
      "Can be adjusted for comfort as pregnancy progresses",
    ],
    instructions: [
      "Adjust the seat and handlebars for comfort",
      "Keep resistance moderate",
      "Maintain good posture while cycling",
      "Stay hydrated and don't overheat",
    ],
    duration: "15-30 minutes, 3 times per week",
    intensity: "Moderate",
    trimester: "all",
    cautions: "As your belly grows, you may need to adjust the bike or switch to a recumbent bike for comfort.",
    imageUrl: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "5",
    name: "Pelvic Floor Exercises (Kegels)",
    description: "Exercises that strengthen the pelvic floor muscles, which support the uterus, bladder, and bowels.",
    benefits: [
      "Prevents urinary incontinence",
      "Prepares pelvic floor for delivery",
      "Helps with postpartum recovery",
      "Can be done anywhere, anytime",
    ],
    instructions: [
      "Identify pelvic floor muscles by stopping urination midstream",
      "Tighten these muscles and hold for 5-10 seconds",
      "Release and relax for 5-10 seconds",
      "Repeat 10-15 times, 3 times daily",
    ],
    duration: "5 minutes, 3 times daily",
    intensity: "Low",
    trimester: "all",
    imageUrl: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "6",
    name: "Prenatal Pilates",
    description: "Modified Pilates exercises that focus on core strength, posture, and flexibility.",
    benefits: [
      "Strengthens core muscles safely",
      "Improves posture and balance",
      "Reduces back pain",
      "Enhances body awareness",
    ],
    instructions: [
      "Join a prenatal Pilates class or follow pregnancy-specific videos",
      "Focus on breathing and proper form",
      "Use modifications as needed",
      "Avoid exercises that require lying flat on your back after the first trimester",
    ],
    duration: "30-45 minutes, 2 times per week",
    intensity: "Moderate",
    trimester: "all",
    cautions: "Ensure your instructor is certified in prenatal Pilates. Avoid traditional ab exercises like crunches.",
    imageUrl: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "7",
    name: "Light Resistance Training",
    description: "Gentle strength training using light weights or resistance bands.",
    benefits: [
      "Maintains muscle tone",
      "Prevents excessive weight gain",
      "Improves posture",
      "Prepares body for carrying baby after birth",
    ],
    instructions: [
      "Use light weights (3-5 lbs) or resistance bands",
      "Focus on controlled movements and proper form",
      "Include exercises for all major muscle groups",
      "Avoid holding breath while exercising",
    ],
    duration: "20-30 minutes, 2 times per week",
    intensity: "Moderate",
    trimester: "all",
    cautions: "Avoid heavy lifting, exercises that strain your back, or require lying flat after first trimester.",
    imageUrl: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "8",
    name: "Prenatal Barre",
    description: "Modified ballet-inspired workout that combines elements of Pilates, yoga, and ballet.",
    benefits: [
      "Improves posture and balance",
      "Strengthens legs and core",
      "Increases flexibility",
      "Low-impact but effective",
    ],
    instructions: [
      "Join a prenatal barre class or follow pregnancy-specific videos",
      "Use a chair or wall for balance if needed",
      "Focus on small, controlled movements",
      "Modify as needed for comfort",
    ],
    duration: "30-45 minutes, 2 times per week",
    intensity: "Moderate",
    trimester: "first",
    cautions:
      "As pregnancy progresses, you may need more modifications. Always inform your instructor that you're pregnant.",
    imageUrl: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "9",
    name: "Gentle Stretching",
    description: "Simple stretches to maintain flexibility and reduce muscle tension.",
    benefits: [
      "Relieves muscle tension and cramps",
      "Improves flexibility",
      "Reduces back pain",
      "Can help with relaxation",
    ],
    instructions: [
      "Hold each stretch for 20-30 seconds",
      "Breathe deeply and relax into the stretch",
      "Focus on shoulders, back, hips, and legs",
      "Never stretch to the point of pain",
    ],
    duration: "10-15 minutes daily",
    intensity: "Low",
    trimester: "all",
    imageUrl: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "10",
    name: "Water Aerobics",
    description: "Exercises performed in water that provide resistance while supporting your weight.",
    benefits: [
      "Reduces swelling and joint pain",
      "Provides resistance for strength building",
      "Keeps you cool while exercising",
      "Reduces pressure on bladder and other organs",
    ],
    instructions: [
      "Join a prenatal water aerobics class if available",
      "Include movements like water walking, leg lifts, and arm movements",
      "Use water dumbbells or noodles for added resistance if desired",
      "Exercise in chest-high water for optimal support",
    ],
    duration: "30 minutes, 2-3 times per week",
    intensity: "Varies",
    trimester: "all",
    imageUrl: "/placeholder.svg?height=300&width=400",
  },
]

export default function ActivitiesPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null)

  // Filter exercises based on active tab
  const filteredExercises = exercisesData.filter((exercise) => {
    if (activeTab === "all") return true
    if (activeTab === "first") return exercise.trimester === "all" || exercise.trimester === "first"
    if (activeTab === "second") return exercise.trimester === "all" || exercise.trimester === "second"
    if (activeTab === "third") return exercise.trimester === "all" || exercise.trimester === "third"
    if (activeTab === "low") return exercise.intensity === "Low"
    if (activeTab === "moderate") return exercise.intensity === "Moderate"
    return true
  })

  const toggleExerciseDetails = (id: string) => {
    if (expandedExercise === id) {
      setExpandedExercise(null)
    } else {
      setExpandedExercise(id)
    }
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
            <h1 className="text-xl font-semibold">Recommended Activities</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Safety Notice */}
      <div className="bg-blue-50 dark:bg-blue-950 p-4 border-b border-blue-100 dark:border-blue-900">
        <div className="container mx-auto flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800 dark:text-blue-300">Safety First</h3>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Always consult with your healthcare provider before starting any exercise program during pregnancy. Stop
              any activity that causes pain, dizziness, shortness of breath, or discomfort.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-background p-2 border-b border-border overflow-x-auto">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="container mx-auto">
          <TabsList className="grid grid-cols-3 w-full mb-2">
            <TabsTrigger value="all">All Activities</TabsTrigger>
            <TabsTrigger value="low">Low Intensity</TabsTrigger>
            <TabsTrigger value="moderate">Moderate Intensity</TabsTrigger>
          </TabsList>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="first">1st Trimester</TabsTrigger>
            <TabsTrigger value="second">2nd Trimester</TabsTrigger>
            <TabsTrigger value="third">3rd Trimester</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        {/* General Exercise Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Exercise Guidelines During Pregnancy</CardTitle>
            <CardDescription>General recommendations for staying active safely</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How much exercise is recommended?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    The American College of Obstetricians and Gynecologists recommends at least 150 minutes of
                    moderate-intensity aerobic activity per week during pregnancy, preferably spread throughout the
                    week. This is about 30 minutes of activity 5 days a week.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Signs to stop exercising immediately</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Vaginal bleeding or fluid leaking</li>
                    <li>Dizziness or feeling faint</li>
                    <li>Increased shortness of breath</li>
                    <li>Chest pain or heart palpitations</li>
                    <li>Headache</li>
                    <li>Muscle weakness</li>
                    <li>Calf pain or swelling</li>
                    <li>Regular, painful contractions</li>
                    <li>Decreased fetal movement</li>
                  </ul>
                  <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">
                    Contact your healthcare provider immediately if you experience any of these symptoms.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Activities to avoid during pregnancy</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Contact sports (basketball, soccer, hockey)</li>
                    <li>Activities with high fall risk (skiing, horseback riding, gymnastics)</li>
                    <li>Scuba diving</li>
                    <li>Hot yoga or hot Pilates</li>
                    <li>Activities at high altitude (above 6,000 feet) if you don't normally live at altitude</li>
                    <li>Exercises that involve lying flat on your back after the first trimester</li>
                    <li>Heavy weightlifting or activities that involve straining</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Exercise Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredExercises.map((exercise) => (
            <Card key={exercise.id} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={exercise.imageUrl || "/placeholder.svg"}
                  alt={exercise.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge
                    className={`
                    ${exercise.intensity === "Low" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : ""}
                    ${exercise.intensity === "Moderate" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" : ""}
                    ${exercise.intensity === "Varies" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" : ""}
                  `}
                  >
                    {exercise.intensity} Intensity
                  </Badge>
                </div>
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>{exercise.name}</CardTitle>
                  <Badge variant="outline">
                    {exercise.trimester === "all"
                      ? "All Trimesters"
                      : exercise.trimester === "first"
                        ? "1st Trimester"
                        : exercise.trimester === "second"
                          ? "2nd Trimester"
                          : "3rd Trimester"}
                  </Badge>
                </div>
                <CardDescription>{exercise.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                    <span>{exercise.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 mr-1 text-pink-600" />
                    <span>{exercise.intensity} intensity</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-center"
                  onClick={() => toggleExerciseDetails(exercise.id)}
                >
                  {expandedExercise === exercise.id ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1" /> Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" /> Show Details
                    </>
                  )}
                </Button>
              </CardFooter>
              {expandedExercise === exercise.id && (
                <div className="px-6 pb-6 pt-0 border-t">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm">Benefits:</h4>
                      <ul className="list-disc pl-5 text-sm mt-1 space-y-1">
                        {exercise.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">How to do it:</h4>
                      <ol className="list-decimal pl-5 text-sm mt-1 space-y-1">
                        {exercise.instructions.map((instruction, index) => (
                          <li key={index}>{instruction}</li>
                        ))}
                      </ol>
                    </div>
                    {exercise.cautions && (
                      <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded-md">
                        <h4 className="font-medium text-sm text-yellow-800 dark:text-yellow-300">Cautions:</h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">{exercise.cautions}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeItem="home" />
    </div>
  )
}
