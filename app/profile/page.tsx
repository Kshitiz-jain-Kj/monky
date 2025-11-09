"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/auth/protected-route"
import Image from "next/image"
import { AvatarSelector } from "@/components/profile/avatar-selector"

function ProfileContent() {
  const { user, updateProfile } = useAuth()
  const [name, setName] = useState(user?.name || "")
  const [bio, setBio] = useState(user?.bio || "")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const result = await updateProfile({ name, bio })

    if (result.success) {
      setMessage({ type: "success", text: "Profile updated successfully!" })
    } else {
      setMessage({ type: "error", text: result.error || "Failed to update profile" })
    }

    setIsLoading(false)
  }

  const handleAvatarSelect = async (avatarUrl: string) => {
    const result = await updateProfile({ avatar: avatarUrl })
    if (result.success) {
      setMessage({ type: "success", text: "Avatar updated successfully!" })
    } else {
      setMessage({ type: "error", text: result.error || "Failed to update avatar" })
    }
  }

  return (
    <div className="py-sides space-y-gap">
      <div>
        <h1 className="text-4xl font-display mb-2">Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="size-24 rounded-lg overflow-hidden bg-primary/10">
                <Image
                  src={user?.avatar || "/placeholder.svg"}
                  alt={user?.name || "User"}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">Profile Picture</p>
                <Button type="button" variant="outline" size="sm" onClick={() => setAvatarDialogOpen(true)}>
                  Change Avatar
                </Button>
              </div>
            </div>

            {message && (
              <div
                className={`p-3 text-sm rounded ${
                  message.type === "success"
                    ? "text-success bg-success/10 border border-success/20"
                    : "text-destructive bg-destructive/10 border border-destructive/20"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user?.email} disabled className="opacity-50" />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
                disabled={isLoading}
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <AvatarSelector
        open={avatarDialogOpen}
        onOpenChange={setAvatarDialogOpen}
        currentAvatar={user?.avatar}
        onAvatarSelect={handleAvatarSelect}
      />
    </div>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}
