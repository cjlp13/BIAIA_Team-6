"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Plus, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ThemeToggle } from "@/components/theme-toggle"

interface Photo {
  id: string
  url: string
  caption: string
  date: Date
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([
    {
      id: "1",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oDcXuMq8gEx0d6aqH0KQ0Quyz7EJfQ.png",
      caption: "First ultrasound picture",
      date: new Date(2025, 1, 15),
    },
    {
      id: "2",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oDcXuMq8gEx0d6aqH0KQ0Quyz7EJfQ.png",
      caption: "Baby bump at 20 weeks",
      date: new Date(2025, 2, 10),
    },
    {
      id: "3",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oDcXuMq8gEx0d6aqH0KQ0Quyz7EJfQ.png",
      caption: "Nursery preparation",
      date: new Date(2025, 3, 5),
    },
  ])

  const [newPhoto, setNewPhoto] = useState({
    caption: "",
    date: format(new Date(), "yyyy-MM-dd"),
  })

  const [viewPhoto, setViewPhoto] = useState<Photo | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const handleAddPhoto = () => {
    // In a real app, this would handle file upload
    // For demo purposes, we're just using the same image
    const photo: Photo = {
      id: Date.now().toString(),
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oDcXuMq8gEx0d6aqH0KQ0Quyz7EJfQ.png",
      caption: newPhoto.caption,
      date: new Date(newPhoto.date),
    }

    setPhotos([photo, ...photos])
    setNewPhoto({
      caption: "",
      date: format(new Date(), "yyyy-MM-dd"),
    })
    setIsAddDialogOpen(false)
  }

  const handleViewPhoto = (photo: Photo) => {
    setViewPhoto(photo)
    setIsViewDialogOpen(true)
  }

  const handleDeletePhoto = (id: string) => {
    setPhotos(photos.filter((photo) => photo.id !== id))
    setIsViewDialogOpen(false)
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
            <h1 className="text-xl font-semibold">Photo Gallery</h1>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="rounded-full">
                  <Plus className="w-4 h-4 mr-1" /> Add Photo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Photo</DialogTitle>
                  <DialogDescription>Capture special moments of your pregnancy journey.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="photo">Photo</Label>
                    <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
                      <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        (For demo purposes, a default image will be used)
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="caption">Caption</Label>
                    <Textarea
                      id="caption"
                      value={newPhoto.caption}
                      onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                      placeholder="Add a caption for your photo..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newPhoto.date}
                      onChange={(e) => setNewPhoto({ ...newPhoto, date: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddPhoto}>Add Photo</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Gallery */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {photos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No photos yet. Start capturing your journey!</p>
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-1" /> Add First Photo
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden cursor-pointer" onClick={() => handleViewPhoto(photo)}>
                <CardContent className="p-0 relative">
                  <div className="aspect-square relative">
                    <Image src={photo.url || "/placeholder.svg"} alt={photo.caption} fill className="object-cover" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-white text-sm truncate">{photo.caption}</p>
                    <div className="flex items-center text-white/80 text-xs mt-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      {format(photo.date, "MMM d, yyyy")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* View Photo Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{viewPhoto?.caption}</DialogTitle>
            <DialogDescription>{viewPhoto && format(viewPhoto.date, "MMMM d, yyyy")}</DialogDescription>
          </DialogHeader>
          {viewPhoto && (
            <div className="relative aspect-square w-full">
              <Image
                src={viewPhoto.url || "/placeholder.svg"}
                alt={viewPhoto.caption}
                fill
                className="object-contain"
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="destructive" onClick={() => viewPhoto && handleDeletePhoto(viewPhoto.id)}>
              Delete Photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation */}
      <BottomNavigation activeItem="home" />
    </div>
  )
}
