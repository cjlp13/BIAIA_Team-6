"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, X, Upload, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  initialImage?: string | null
  onImageChange: (imageData: string | null) => void
  className?: string
  size?: "sm" | "md" | "lg"
}

export function ImageUpload({ initialImage, onImageChange, className, size = "md" }: ImageUploadProps) {
  const [image, setImage] = useState<string | null>(initialImage || null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
  }

  const buttonSizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset error state
    setError(null)

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB")
      return
    }

    setIsUploading(true)

    const reader = new FileReader()
    reader.onload = (event) => {
      const imageData = event.target?.result as string
      setImage(imageData)
      onImageChange(imageData)
      setIsUploading(false)
    }

    reader.onerror = () => {
      setError("Failed to read the image file")
      setIsUploading(false)
    }

    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImage(null)
    onImageChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const initials = "U"

  return (
    <div className={cn("flex flex-col items-center space-y-4", className)}>
      <div className="relative">
        <Avatar className={cn(sizeClasses[size])}>
          <AvatarImage src={image || undefined} alt="Profile" />
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>

        {isUploading ? (
          <div
            className={cn(
              "absolute bottom-0 right-0 rounded-full bg-primary flex items-center justify-center",
              buttonSizeClasses[size],
            )}
          >
            <Loader2 className="h-4 w-4 animate-spin text-white" />
          </div>
        ) : (
          <Button
            size="icon"
            type="button"
            onClick={triggerFileInput}
            className={cn(
              "absolute bottom-0 right-0 rounded-full bg-primary hover:bg-primary/90",
              buttonSizeClasses[size],
            )}
          >
            <Camera className="h-4 w-4" />
            <span className="sr-only">Change avatar</span>
          </Button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        aria-label="Upload profile picture"
      />

      <div className="flex items-center space-x-2">
        {image && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemoveImage}
            className="text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
        )}
        <Button type="button" variant="outline" size="sm" onClick={triggerFileInput}>
          <Upload className="h-4 w-4 mr-1" />
          {image ? "Change" : "Upload"}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
