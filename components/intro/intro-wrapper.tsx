"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { usePathname, useRouter } from "next/navigation"
import RocketLaunch from "./rocket-launch"
import WelcomeAnimation from "./welcome-animation"

interface IntroWrapperProps {
  children: React.ReactNode
}

export default function IntroWrapper({ children }: IntroWrapperProps) {
  const [showIntro, setShowIntro] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const { user, isLoading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/forgot-password"

  useEffect(() => {
    if (isLoading) return

    const hasSeenThisSession = sessionStorage.getItem("hasSeenRocketIntro")

    if (!hasSeenThisSession) {
      setShowIntro(true)
    } else {
      const justLoggedIn = sessionStorage.getItem("justLoggedIn")
      if (justLoggedIn && user) {
        sessionStorage.removeItem("justLoggedIn")
        setShowWelcome(true)
      } else {
        setIsReady(true)
      }
    }
  }, [isLoading, user])

  useEffect(() => {
    if (!isLoading && isReady && !user && !isAuthPage) {
      router.push("/login")
    }
  }, [isLoading, isReady, user, isAuthPage, router])

  const handleIntroComplete = () => {
    sessionStorage.setItem("hasSeenRocketIntro", "true")
    setShowIntro(false)

    if (user) {
      setShowWelcome(true)
    } else {
      setIsReady(true)
    }
  }

  const handleWelcomeComplete = () => {
    setShowWelcome(false)
    setIsReady(true)
  }

  // Show nothing until we check sessionStorage and auth
  if (!isReady && !showIntro && !showWelcome) {
    return null
  }

  return (
    <>
      {showIntro && <RocketLaunch onComplete={handleIntroComplete} />}
      {showWelcome && user && <WelcomeAnimation user={user} onComplete={handleWelcomeComplete} />}
      {isReady && (user || isAuthPage) && children}
    </>
  )
}
