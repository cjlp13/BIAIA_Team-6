"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, X, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Guideline {
  id: string
  category: string
  type: "do" | "dont"
  title: string
  description: string
  trimester: "all" | "first" | "second" | "third"
  source?: string
}

// Sample guidelines data
const guidelinesData: Guideline[] = [
  // Food guidelines
  {
    id: "1",
    category: "food",
    type: "do",
    title: "Eat plenty of fruits and vegetables",
    description: "Aim for 5-9 servings of fruits and vegetables daily to get essential vitamins, minerals, and fiber.",
    trimester: "all",
    source: "American College of Obstetricians and Gynecologists",
  },
  {
    id: "2",
    category: "food",
    type: "do",
    title: "Stay hydrated",
    description: "Drink at least 8-10 glasses of water daily to support increased blood volume and amniotic fluid.",
    trimester: "all",
    source: "American Pregnancy Association",
  },
  {
    id: "3",
    category: "food",
    type: "do",
    title: "Consume adequate protein",
    description: "Include lean meats, poultry, fish, eggs, dairy, legumes, and nuts to support your baby's growth.",
    trimester: "all",
    source: "Academy of Nutrition and Dietetics",
  },
  {
    id: "4",
    category: "food",
    type: "dont",
    title: "Avoid raw or undercooked meat and eggs",
    description: "These may contain harmful bacteria like Salmonella or parasites that can cause foodborne illness.",
    trimester: "all",
    source: "FDA",
  },
  {
    id: "5",
    category: "food",
    type: "dont",
    title: "Limit caffeine intake",
    description: "Keep caffeine consumption under 200mg daily (about one 12oz cup of coffee).",
    trimester: "all",
    source: "American College of Obstetricians and Gynecologists",
  },
  {
    id: "6",
    category: "food",
    type: "dont",
    title: "Avoid high-mercury fish",
    description:
      "Skip shark, swordfish, king mackerel, and tilefish due to high mercury levels that can harm fetal development.",
    trimester: "all",
    source: "FDA and EPA",
  },

  // Activity guidelines
  {
    id: "7",
    category: "activity",
    type: "do",
    title: "Exercise regularly",
    description: "Aim for 150 minutes of moderate activity weekly, spread throughout the week.",
    trimester: "all",
    source: "American College of Obstetricians and Gynecologists",
  },
  {
    id: "8",
    category: "activity",
    type: "do",
    title: "Practice pelvic floor exercises",
    description: "Kegel exercises strengthen pelvic floor muscles, which helps with delivery and recovery.",
    trimester: "all",
    source: "Mayo Clinic",
  },
  {
    id: "9",
    category: "activity",
    type: "do",
    title: "Get adequate rest",
    description: "Prioritize 7-9 hours of sleep and rest when tired, especially in the first trimester.",
    trimester: "first",
    source: "National Sleep Foundation",
  },
  {
    id: "10",
    category: "activity",
    type: "dont",
    title: "Avoid contact sports",
    description:
      "Skip activities with high risk of falls or abdominal trauma like horseback riding, skiing, or contact sports.",
    trimester: "all",
    source: "American College of Obstetricians and Gynecologists",
  },
  {
    id: "11",
    category: "activity",
    type: "dont",
    title: "Don't exercise in extreme heat",
    description: "Avoid hot yoga, hot tubs, saunas, and exercising in very hot weather to prevent overheating.",
    trimester: "all",
    source: "American Pregnancy Association",
  },
  {
    id: "12",
    category: "activity",
    type: "dont",
    title: "Avoid lying flat on your back after first trimester",
    description: "This position can compress major blood vessels and reduce blood flow to you and your baby.",
    trimester: "second",
    source: "Mayo Clinic",
  },

  // Health guidelines
  {
    id: "13",
    category: "health",
    type: "do",
    title: "Take prenatal vitamins",
    description:
      "Start taking prenatal vitamins with folic acid before conception or as soon as you know you're pregnant.",
    trimester: "all",
    source: "CDC",
  },
  {
    id: "14",
    category: "health",
    type: "do",
    title: "Attend all prenatal appointments",
    description: "Regular checkups help monitor your health and your baby's development.",
    trimester: "all",
    source: "World Health Organization",
  },
  {
    id: "15",
    category: "health",
    type: "do",
    title: "Get vaccinated as recommended",
    description: "The flu shot and Tdap vaccine are recommended during pregnancy to protect you and your baby.",
    trimester: "all",
    source: "CDC",
  },
  {
    id: "16",
    category: "health",
    type: "dont",
    title: "Don't smoke or use tobacco products",
    description: "Smoking increases risks of miscarriage, premature birth, low birth weight, and birth defects.",
    trimester: "all",
    source: "American Lung Association",
  },
  {
    id: "17",
    category: "health",
    type: "dont",
    title: "Avoid alcohol completely",
    description:
      "There is no known safe amount of alcohol during pregnancy. Alcohol can cause fetal alcohol spectrum disorders.",
    trimester: "all",
    source: "CDC",
  },
  {
    id: "18",
    category: "health",
    type: "dont",
    title: "Don't take medications without consulting your doctor",
    description: "Some over-the-counter and prescription medications can harm your baby's development.",
    trimester: "all",
    source: "FDA",
  },

  // Lifestyle guidelines
  {
    id: "19",
    category: "lifestyle",
    type: "do",
    title: "Wear comfortable, supportive shoes",
    description: "As your center of gravity shifts, supportive footwear helps prevent falls and reduces back pain.",
    trimester: "second",
    source: "American Podiatric Medical Association",
  },
  {
    id: "20",
    category: "lifestyle",
    type: "do",
    title: "Use pregnancy-safe skincare products",
    description:
      "Check ingredients and avoid retinoids, salicylic acid, and certain essential oils in skincare products.",
    trimester: "all",
    source: "American Academy of Dermatology",
  },
  {
    id: "21",
    category: "lifestyle",
    type: "do",
    title: "Practice stress management",
    description: "Try meditation, prenatal yoga, or deep breathing to manage stress, which can affect your baby.",
    trimester: "all",
    source: "March of Dimes",
  },
  {
    id: "22",
    category: "lifestyle",
    type: "dont",
    title: "Avoid exposure to toxic chemicals",
    description:
      "Limit exposure to cleaning products, paint fumes, pesticides, and other potentially harmful chemicals.",
    trimester: "all",
    source: "Environmental Protection Agency",
  },
  {
    id: "23",
    category: "lifestyle",
    type: "dont",
    title: "Don't clean cat litter boxes",
    description:
      "Cat feces can contain toxoplasmosis, a parasite that can cause birth defects. Have someone else clean the litter box.",
    trimester: "all",
    source: "CDC",
  },
  {
    id: "24",
    category: "lifestyle",
    type: "dont",
    title: "Avoid excessive heat exposure",
    description: "Skip hot tubs, saunas, and very hot baths which can raise your core temperature and harm the baby.",
    trimester: "all",
    source: "Mayo Clinic",
  },
]

export default function GuidelinesPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    trimester: "all" as "all" | "first" | "second" | "third",
    type: "both" as "both" | "do" | "dont",
  })

  // Filter guidelines based on active tab, search term, and filters
  const filteredGuidelines = guidelinesData.filter((guideline) => {
    // Filter by category tab
    if (activeTab !== "all" && guideline.category !== activeTab) return false

    // Filter by search term
    if (
      searchTerm &&
      !guideline.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !guideline.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false

    // Filter by trimester
    if (filters.trimester !== "all" && guideline.trimester !== "all" && guideline.trimester !== filters.trimester)
      return false

    // Filter by type (do/don't)
    if (filters.type !== "both" && guideline.type !== filters.type) return false

    return true
  })

  // Group guidelines by type (do/don't)
  const doGuidelines = filteredGuidelines.filter((g) => g.type === "do")
  const dontGuidelines = filteredGuidelines.filter((g) => g.type === "dont")

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="mr-3">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <h1 className="text-xl font-semibold">Pregnancy Guidelines</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Search and Filter */}
      <div className="sticky top-14 z-10 bg-background border-b border-border p-4">
        <div className="container mx-auto space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search guidelines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchTerm && (
              <button className="absolute right-3 top-2.5" onClick={() => setSearchTerm("")}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="food">Food</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="health">Health</TabsTrigger>
                <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
              </TabsList>
            </Tabs>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="ml-2">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2">
                  <h4 className="mb-2 text-sm font-medium">Trimester</h4>
                  <div className="space-y-1">
                    <DropdownMenuCheckboxItem
                      checked={filters.trimester === "all"}
                      onCheckedChange={() => setFilters({ ...filters, trimester: "all" })}
                    >
                      All Trimesters
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filters.trimester === "first"}
                      onCheckedChange={() => setFilters({ ...filters, trimester: "first" })}
                    >
                      First Trimester
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filters.trimester === "second"}
                      onCheckedChange={() => setFilters({ ...filters, trimester: "second" })}
                    >
                      Second Trimester
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filters.trimester === "third"}
                      onCheckedChange={() => setFilters({ ...filters, trimester: "third" })}
                    >
                      Third Trimester
                    </DropdownMenuCheckboxItem>
                  </div>

                  <h4 className="mt-4 mb-2 text-sm font-medium">Type</h4>
                  <div className="space-y-1">
                    <DropdownMenuCheckboxItem
                      checked={filters.type === "both"}
                      onCheckedChange={() => setFilters({ ...filters, type: "both" })}
                    >
                      Both Do's & Don'ts
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filters.type === "do"}
                      onCheckedChange={() => setFilters({ ...filters, type: "do" })}
                    >
                      Do's Only
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filters.type === "dont"}
                      onCheckedChange={() => setFilters({ ...filters, type: "dont" })}
                    >
                      Don'ts Only
                    </DropdownMenuCheckboxItem>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        {filteredGuidelines.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No guidelines found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setFilters({ trimester: "all", type: "both" })
                setActiveTab("all")
              }}
              className="mt-4"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <>
            {/* Do's Section */}
            {doGuidelines.length > 0 && (
              <Card>
                <CardHeader className="bg-green-50 dark:bg-green-950 border-b">
                  <CardTitle className="flex items-center text-green-700 dark:text-green-300">
                    <Check className="mr-2 h-5 w-5" />
                    Pregnancy Do's
                  </CardTitle>
                  <CardDescription>Recommended practices during pregnancy</CardDescription>
                </CardHeader>
                <CardContent className="divide-y">
                  {doGuidelines.map((guideline) => (
                    <div key={guideline.id} className="py-4 first:pt-6 last:pb-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-green-700 dark:text-green-300">{guideline.title}</h3>
                          <p className="text-sm mt-1">{guideline.description}</p>
                          {guideline.source && (
                            <p className="text-xs text-muted-foreground mt-1">Source: {guideline.source}</p>
                          )}
                        </div>
                        <Badge variant="outline" className="ml-2 shrink-0">
                          {guideline.trimester === "all"
                            ? "All Trimesters"
                            : guideline.trimester === "first"
                              ? "1st Trimester"
                              : guideline.trimester === "second"
                                ? "2nd Trimester"
                                : "3rd Trimester"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Don'ts Section */}
            {dontGuidelines.length > 0 && (
              <Card>
                <CardHeader className="bg-red-50 dark:bg-red-950 border-b">
                  <CardTitle className="flex items-center text-red-700 dark:text-red-300">
                    <X className="mr-2 h-5 w-5" />
                    Pregnancy Don'ts
                  </CardTitle>
                  <CardDescription>Practices to avoid during pregnancy</CardDescription>
                </CardHeader>
                <CardContent className="divide-y">
                  {dontGuidelines.map((guideline) => (
                    <div key={guideline.id} className="py-4 first:pt-6 last:pb-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-red-700 dark:text-red-300">{guideline.title}</h3>
                          <p className="text-sm mt-1">{guideline.description}</p>
                          {guideline.source && (
                            <p className="text-xs text-muted-foreground mt-1">Source: {guideline.source}</p>
                          )}
                        </div>
                        <Badge variant="outline" className="ml-2 shrink-0">
                          {guideline.trimester === "all"
                            ? "All Trimesters"
                            : guideline.trimester === "first"
                              ? "1st Trimester"
                              : guideline.trimester === "second"
                                ? "2nd Trimester"
                                : "3rd Trimester"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeItem="home" />
    </div>
  )
}
