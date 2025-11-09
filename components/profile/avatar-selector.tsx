"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const PRESET_AVATARS = [
  {
    id: "avatar-1",
    url: "/professional-developer-avatar-blue.jpg",
    name: "Blue Developer",
  },
  {
    id: "avatar-2",
    url: "/friendly-coder-avatar-green.jpg",
    name: "Green Coder",
  },
  {
    id: "avatar-3",
    url: "/tech-enthusiast-avatar-purple.jpg",
    name: "Purple Tech",
  },
  {
    id: "avatar-4",
    url: "/creative-programmer-avatar-orange.jpg",
    name: "Orange Creative",
  },
  {
    id: "avatar-5",
    url: "/expert-developer-avatar-red.jpg",
    name: "Red Expert",
  },
]

interface AvatarSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentAvatar?: string
  onAvatarSelect: (avatarUrl: string) => void
}

export function AvatarSelector({ open, onOpenChange, currentAvatar, onAvatarSelect }: AvatarSelectorProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentAvatar || PRESET_AVATARS[0].url)
  const [customAvatarUrl, setCustomAvatarUrl] = useState("")
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handlePresetSelect = (url: string) => {
    setSelectedAvatar(url)
    setCustomAvatarUrl("")
    setUploadError(null)
  }

  const handleCustomUrlChange = (url: string) => {
    setCustomAvatarUrl(url)
    if (url) {
      setSelectedAvatar(url)
      setUploadError(null)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file")
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Image size should be less than 2MB")
      return
    }

    // Convert to base64
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setSelectedAvatar(base64String)
      setCustomAvatarUrl("")
      setUploadError(null)
    }
    reader.onerror = () => {
      setUploadError("Failed to read file")
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    onAvatarSelect(selectedAvatar)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choose Your Avatar</DialogTitle>
          <DialogDescription>Select a preset avatar or upload your own image</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preview */}
          <div className="flex justify-center">
            <div className="size-32 rounded-lg overflow-hidden bg-primary/10 border-2 border-primary/20">
              <Image
                src={selectedAvatar || "/placeholder.svg"}
                alt="Selected avatar"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Preset Avatars */}
          <div>
            <Label className="mb-3 block">Preset Avatars</Label>
            <div className="grid grid-cols-5 gap-3">
              {PRESET_AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => handlePresetSelect(avatar.url)}
                  className={cn(
                    "size-20 rounded-lg overflow-hidden border-2 transition-all hover:scale-105",
                    selectedAvatar === avatar.url ? "border-primary ring-2 ring-primary/20" : "border-border",
                  )}
                  title={avatar.name}
                >
                  <Image
                    src={avatar.url || "/placeholder.svg"}
                    alt={avatar.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Custom Upload */}
          <div className="space-y-3">
            <Label>Upload Custom Avatar</Label>
            <div className="flex gap-2">
              <Input type="file" accept="image/*" onChange={handleFileUpload} className="flex-1" id="avatar-upload" />
            </div>
            {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
            <p className="text-xs text-muted-foreground">Max size: 2MB. Supported formats: JPG, PNG, GIF, WebP</p>
          </div>

          {/* Custom URL */}
          <div className="space-y-3">
            <Label htmlFor="custom-url">Or Enter Image URL</Label>
            <Input
              id="custom-url"
              type="url"
              placeholder="https://example.com/avatar.jpg"
              value={customAvatarUrl}
              onChange={(e) => handleCustomUrlChange(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Avatar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
