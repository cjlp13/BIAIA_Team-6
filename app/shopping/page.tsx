"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ThemeToggle } from "@/components/theme-toggle"

interface ShoppingItem {
  id: string
  name: string
  category: string
  completed: boolean
}

// Sample categories
const categories = [
  "Clothing",
  "Nursery",
  "Feeding",
  "Diapering",
  "Bathing",
  "Safety",
  "Travel",
  "Toys",
  "Healthcare",
  "Other",
]

// Sample initial items
const initialItems: ShoppingItem[] = [
  { id: "1", name: "Onesies (0-3 months)", category: "Clothing", completed: false },
  { id: "2", name: "Crib", category: "Nursery", completed: true },
  { id: "3", name: "Diapers", category: "Diapering", completed: false },
  { id: "4", name: "Baby bottles", category: "Feeding", completed: false },
  { id: "5", name: "Baby bathtub", category: "Bathing", completed: false },
  { id: "6", name: "Car seat", category: "Travel", completed: true },
  { id: "7", name: "Baby monitor", category: "Safety", completed: false },
]

export default function ShoppingPage() {
  const [items, setItems] = useState<ShoppingItem[]>(initialItems)
  const [newItemName, setNewItemName] = useState("")
  const [newItemCategory, setNewItemCategory] = useState("Other")
  const [activeTab, setActiveTab] = useState("all")

  const addItem = () => {
    if (newItemName.trim() === "") return

    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      category: newItemCategory,
      completed: false,
    }

    setItems([...items, newItem])
    setNewItemName("")
  }

  const toggleItem = (id: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const filteredItems = items.filter((item) => {
    if (activeTab === "all") return true
    if (activeTab === "completed") return item.completed
    if (activeTab === "pending") return !item.completed
    return item.category === activeTab
  })

  const getCompletionStats = () => {
    const total = items.length
    const completed = items.filter((item) => item.completed).length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    return { total, completed, percentage }
  }

  const stats = getCompletionStats()

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="mr-3">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <h1 className="text-xl font-semibold">Shopping List</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Add Item Form */}
      <div className="bg-background border-b border-border p-4">
        <div className="container mx-auto flex items-end gap-2">
          <div className="flex-1">
            <Input
              placeholder="Add new item..."
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addItem()
                }
              }}
            />
          </div>
          <div className="w-1/3">
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={addItem} disabled={newItemName.trim() === ""}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-background p-2 border-b border-border overflow-x-auto">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="container mx-auto">
          <TabsList className="grid grid-cols-3 w-full mb-2">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsList className="w-full overflow-x-auto flex whitespace-nowrap">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="flex-shrink-0">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        {/* Progress Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Shopping Progress</h3>
                <p className="text-sm text-muted-foreground">
                  {stats.completed} of {stats.total} items completed
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center">
                <span className="text-pink-600 font-semibold">{stats.percentage}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shopping List */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-medium text-muted-foreground">No items found</h2>
            <p className="text-muted-foreground mt-2">
              {activeTab === "all" ? "Start adding items to your shopping list" : "No items match the current filter"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className={item.completed ? "opacity-70" : ""}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleItem(item.id)}
                      id={`item-${item.id}`}
                    />
                    <div>
                      <label
                        htmlFor={`item-${item.id}`}
                        className={`font-medium ${item.completed ? "line-through text-muted-foreground" : ""}`}
                      >
                        {item.name}
                      </label>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteItem(item.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
