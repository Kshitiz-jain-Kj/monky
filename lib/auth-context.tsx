"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  auth0Id: string
  name: string
  email: string
  avatar?: string
  bio?: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>
  deleteAccount: (password: string) => Promise<{ success: boolean; error?: string }>
  isLoading: boolean
  getAccessToken: () => Promise<string>
  loginWithAuth0: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const router = useRouter()

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user")
    const storedToken = localStorage.getItem("auth_token")

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setAccessToken(storedToken)
    }
    setIsLoading(false)
  }, [])

  const loginWithAuth0 = async () => {
    try {
      const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN
      const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID
      const redirectUri = `${window.location.origin}/callback`

      window.location.href =
        `https://${domain}/authorize?` +
        `response_type=code&` +
        `client_id=${clientId}&` +
        `redirect_uri=${redirectUri}&` +
        `scope=openid profile email`
    } catch (error) {
      console.error("Auth0 login error:", error)
    }
  }

  const getAccessToken = async (): Promise<string> => {
    if (accessToken) {
      return accessToken
    }
    throw new Error("No access token available")
  }

  const login = async (email: string, password: string) => {
    try {
      // Get users from localStorage
      const usersData = localStorage.getItem("users")
      const users = usersData ? JSON.parse(usersData) : []

      // Find user
      const foundUser = users.find((u: any) => u.email === email && u.password === password)

      if (!foundUser) {
        return { success: false, error: "Invalid email or password" }
      }

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = foundUser

      setUser(userWithoutPassword)
      localStorage.setItem("auth_user", JSON.stringify(userWithoutPassword))

      const mockToken = btoa(`${email}:${Date.now()}`)
      setAccessToken(mockToken)
      localStorage.setItem("auth_token", mockToken)

      return { success: true }
    } catch (error) {
      return { success: false, error: "An error occurred during login" }
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    try {
      // Get existing users
      const usersData = localStorage.getItem("users")
      const users = usersData ? JSON.parse(usersData) : []

      // Check if user already exists
      if (users.some((u: any) => u.email === email)) {
        return { success: false, error: "Email already registered" }
      }

      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        auth0Id: `local-${Math.random().toString(36).substr(2, 9)}`,
        name,
        email,
        password,
        avatar: "/professional-developer-avatar-blue.jpg",
        bio: "",
        createdAt: new Date().toISOString(),
      }

      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      // Remove password and set as current user
      const { password: _, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)
      localStorage.setItem("auth_user", JSON.stringify(userWithoutPassword))

      const mockToken = btoa(`${email}:${Date.now()}`)
      setAccessToken(mockToken)
      localStorage.setItem("auth_token", mockToken)

      return { success: true }
    } catch (error) {
      return { success: false, error: "An error occurred during signup" }
    }
  }

  const logout = () => {
    setUser(null)
    setAccessToken(null)
    localStorage.removeItem("auth_user")
    localStorage.removeItem("auth_token")
    router.push("/login")
  }

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!user) return { success: false, error: "Not authenticated" }

      const updatedUser = { ...user, ...updates }

      // Update in users array
      const usersData = localStorage.getItem("users")
      const users = usersData ? JSON.parse(usersData) : []
      const userIndex = users.findIndex((u: any) => u.id === user.id)

      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates }
        localStorage.setItem("users", JSON.stringify(users))
      }

      setUser(updatedUser)
      localStorage.setItem("auth_user", JSON.stringify(updatedUser))

      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to update profile" }
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      if (!user) return { success: false, error: "Not authenticated" }

      const usersData = localStorage.getItem("users")
      const users = usersData ? JSON.parse(usersData) : []
      const userIndex = users.findIndex((u: any) => u.id === user.id)

      if (userIndex === -1) {
        return { success: false, error: "User not found" }
      }

      if (users[userIndex].password !== currentPassword) {
        return { success: false, error: "Current password is incorrect" }
      }

      users[userIndex].password = newPassword
      localStorage.setItem("users", JSON.stringify(users))

      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to change password" }
    }
  }

  const deleteAccount = async (password: string) => {
    try {
      if (!user) return { success: false, error: "Not authenticated" }

      const usersData = localStorage.getItem("users")
      const users = usersData ? JSON.parse(usersData) : []
      const userIndex = users.findIndex((u: any) => u.id === user.id)

      if (userIndex === -1) {
        return { success: false, error: "User not found" }
      }

      if (users[userIndex].password !== password) {
        return { success: false, error: "Password is incorrect" }
      }

      users.splice(userIndex, 1)
      localStorage.setItem("users", JSON.stringify(users))

      setUser(null)
      setAccessToken(null)
      localStorage.removeItem("auth_user")
      localStorage.removeItem("auth_token")
      router.push("/login")

      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to delete account" }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateProfile,
        changePassword,
        deleteAccount,
        isLoading,
        getAccessToken,
        loginWithAuth0,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
