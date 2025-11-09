"use client"

import { motion } from "framer-motion"
import { useEffect } from "react"

interface WelcomeAnimationProps {
  user: {
    name: string
    email: string
  }
  onComplete: () => void
}

export default function WelcomeAnimation({ user, onComplete }: WelcomeAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute size-1 rounded-full bg-primary/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Welcome message */}
      <div className="relative z-10 text-center space-y-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <div className="inline-flex items-center justify-center size-24 rounded-full bg-primary/20 border-2 border-primary mb-4">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
              }}
              className="text-5xl"
            >
              👋
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-2"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white">Welcome back,</h1>
          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-5xl md:text-6xl font-display font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent"
          >
            {user.name}!
          </motion.h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-lg text-muted-foreground"
        >
          Launching your workspace...
        </motion.p>

        {/* Loading bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 1.2, duration: 1.5, ease: "easeInOut" }}
          className="h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 rounded-full max-w-xs mx-auto"
        />
      </div>
    </motion.div>
  )
}
