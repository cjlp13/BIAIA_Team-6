"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ThemeToggle } from "@/components/theme-toggle"

interface BabyName {
  id: string
  name: string
  gender: "boy" | "girl" | "neutral"
  meaning: string
  origin: string
}

// Sample baby names data
const babyNamesData: BabyName[] = [
  { id: "1", name: "Olivia", gender: "girl", meaning: "Olive tree", origin: "Latin" },
  { id: "2", name: "Liam", gender: "boy", meaning: "Strong-willed warrior", origin: "Irish" },
  { id: "3", name: "Emma", gender: "girl", meaning: "Universal", origin: "Germanic" },
  { id: "4", name: "Noah", gender: "boy", meaning: "Rest, comfort", origin: "Hebrew" },
  { id: "5", name: "Ava", gender: "girl", meaning: "Life", origin: "Latin" },
  { id: "6", name: "Elijah", gender: "boy", meaning: "Yahweh is God", origin: "Hebrew" },
  { id: "7", name: "Charlotte", gender: "girl", meaning: "Free man", origin: "French" },
  { id: "8", name: "Oliver", gender: "boy", meaning: "Olive tree", origin: "Latin" },
  { id: "9", name: "Amelia", gender: "girl", meaning: "Work", origin: "Germanic" },
  { id: "10", name: "James", gender: "boy", meaning: "Supplanter", origin: "Hebrew" },
  { id: "11", name: "Sophia", gender: "girl", meaning: "Wisdom", origin: "Greek" },
  { id: "12", name: "Benjamin", gender: "boy", meaning: "Son of the right hand", origin: "Hebrew" },
  { id: "13", name: "Riley", gender: "neutral", meaning: "Valiant", origin: "Irish" },
  { id: "14", name: "Jordan", gender: "neutral", meaning: "To flow down", origin: "Hebrew" },
  { id: "15", name: "Avery", gender: "neutral", meaning: "Ruler of the elves", origin: "English" },
  { id: "16", name: "Quinn", gender: "neutral", meaning: "Counsel", origin: "Irish" },
  { id: "17", name: "Morgan", gender: "neutral", meaning: "Sea circle", origin: "Welsh" },
  { id: "18", name: "Taylor", gender: "neutral", meaning: "Tailor", origin: "English" },
]

export default function NamesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [filteredNames, setFilteredNames] = useState<BabyName[]>(babyNamesData)

  useEffect(() => {
    filterNames()
  }, [searchTerm, activeTab])

  const filterNames = () => {
    let filtered = babyNamesData

    // Filter by gender/tab
    if (activeTab !== "all" && activeTab !== "favorites") {
      filtered = filtered.filter((name) => name.gender === activeTab)
    } else if (activeTab === "favorites") {
      filtered = filtered.filter((name) => favorites.includes(name.id))
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (name) =>
          name.name.toLowerCase().includes(term) ||
          name.meaning.toLowerCase().includes(term) ||
          name.origin.toLowerCase().includes(term),
      )
    }

    setFilteredNames(filtered)
  }

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((fav) => fav !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }

  const clearSearch = () => {
    setSearchTerm("")
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
            <h1 className="text-xl font-semibold">Baby Names</h1>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Badge variant="outline" className="bg-pink-100 dark:bg-pink-900 text-pink-600">
              {favorites.length} Favorites
            </Badge>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="sticky top-14 z-10 bg-background p-4 border-b border-border">
        <div className="container mx-auto relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search names, meanings, or origins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchTerm && (
            <button className="absolute right-3 top-2.5" onClick={clearSearch}>
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-background p-2 border-b border-border">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="container mx-auto">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="boy">Boys</TabsTrigger>
            <TabsTrigger value="girl">Girls</TabsTrigger>
            <TabsTrigger value="neutral">Neutral</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Names List */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {filteredNames.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No names found matching your criteria.</p>
            {searchTerm && (
              <Button variant="outline" onClick={clearSearch} className="mt-4">
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNames.map((name) => (
              <Card key={name.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{name.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        <span className="capitalize">{name.gender}</span> • {name.origin}
                      </p>
                      <p className="text-sm mt-1">{name.meaning}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={favorites.includes(name.id) ? "text-pink-600" : "text-muted-foreground"}
                      onClick={() => toggleFavorite(name.id)}
                    >
                      <Heart className="h-5 w-5" fill={favorites.includes(name.id) ? "currentColor" : "none"} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeItem="home" />
    </div>
  )
}
