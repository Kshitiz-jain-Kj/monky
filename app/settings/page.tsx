"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from "@/lib/theme-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function SettingsContent() {
  const { changePassword, deleteAccount, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [deletePassword, setDeletePassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (newPassword !== confirmNewPassword) {
      setMessage({ type: "error", text: "New passwords do not match" })
      return
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" })
      return
    }

    setIsLoading(true)

    const result = await changePassword(currentPassword, newPassword)

    if (result.success) {
      setMessage({ type: "success", text: "Password changed successfully!" })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmNewPassword("")
    } else {
      setMessage({ type: "error", text: result.error || "Failed to change password" })
    }

    setIsLoading(false)
  }

  const handleDeleteAccount = async () => {
    const result = await deleteAccount(deletePassword)

    if (!result.success) {
      setMessage({ type: "error", text: result.error || "Failed to delete account" })
    }
  }

  return (
    <div className="py-sides space-y-gap">
      <div>
        <h1 className="text-4xl font-display mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how M.O.N.K.Y. OS looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="theme-toggle">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
            </div>
            <Switch id="theme-toggle" checked={theme === "dark"} onCheckedChange={toggleTheme} />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your password and security settings</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
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
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible account actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Logout</p>
              <p className="text-sm text-muted-foreground">Sign out of your account</p>
            </div>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-destructive">Delete Account</p>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove all your data
                    from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                  <Label htmlFor="deletePassword">Enter your password to confirm</Label>
                  <Input
                    id="deletePassword"
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Your password"
                    className="mt-2"
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  )
}
