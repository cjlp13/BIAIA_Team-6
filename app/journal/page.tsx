"use client"

import { useState } from "react"
import Link from "next/link"
import { Book, ArrowLeft, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserAvatar } from "@/components/user-avatar"

interface JournalEntry {
  id: string
  title: string
  content: string
  date: Date
  mood: string
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: "1",
      title: "First kicks!",
      content:
        "Today I felt the baby kick for the first time! It was such an amazing feeling, like little butterflies.",
      date: new Date(2025, 3, 10),
      mood: "Happy",
    },
    {
      id: "2",
      title: "Doctor's appointment",
      content: "Had my checkup today. Everything looks good! Baby is growing well and heartbeat is strong.",
      date: new Date(2025, 3, 18),
      mood: "Relieved",
    },
  ])

  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    mood: "Happy",
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddEntry = () => {
    if (newEntry.title.trim() === "" || newEntry.content.trim() === "") {
      return
    }

    const entry: JournalEntry = {
      id: Date.now().toString(),
      title: newEntry.title,
      content: newEntry.content,
      date: new Date(),
      mood: newEntry.mood,
    }

    setEntries([entry, ...entries])
    setNewEntry({
      title: "",
      content: "",
      mood: "Happy",
    })
    setIsDialogOpen(false)
  }

  const deleteEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id))
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
            <h1 className="text-xl font-semibold">Pregnancy Journal</h1>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <UserAvatar />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="rounded-full">
                  <Plus className="w-4 h-4 mr-1" /> New Entry
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Journal Entry</DialogTitle>
                  <DialogDescription>
                    Record your thoughts, feelings, and experiences during your pregnancy journey.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Title
                    </label>
                    <Input
                      id="title"
                      value={newEntry.title}
                      onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                      placeholder="Enter a title for your entry"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="content" className="text-sm font-medium">
                      Entry
                    </label>
                    <Textarea
                      id="content"
                      value={newEntry.content}
                      onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                      placeholder="Write your thoughts here..."
                      rows={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="mood" className="text-sm font-medium">
                      Mood
                    </label>
                    <select
                      id="mood"
                      value={newEntry.mood}
                      onChange={(e) => setNewEntry({ ...newEntry, mood: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    >
                      <option value="Happy">Happy</option>
                      <option value="Excited">Excited</option>
                      <option value="Tired">Tired</option>
                      <option value="Anxious">Anxious</option>
                      <option value="Emotional">Emotional</option>
                      <option value="Relieved">Relieved</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddEntry}>Save Entry</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        {entries.length === 0 ? (
          <div className="text-center py-12">
            <Book className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-medium text-muted-foreground">No journal entries yet</h2>
            <p className="text-muted-foreground mt-2">Start recording your pregnancy journey</p>
            <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-1" /> New Entry
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <Card key={entry.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{entry.title}</CardTitle>
                      <CardDescription>
                        {format(entry.date, "MMMM d, yyyy")} • {entry.mood}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => deleteEntry(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground whitespace-pre-line">{entry.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeItem="journal" />
    </div>
  )
}
