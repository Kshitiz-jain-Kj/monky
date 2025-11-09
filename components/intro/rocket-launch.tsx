"use client"

import { motion, useAnimation } from "framer-motion"
import { useEffect, useState } from "react"

interface RocketLaunchProps {
  onComplete: () => void
}

export default function RocketLaunch({ onComplete }: RocketLaunchProps) {
  const [phase, setPhase] = useState<"idle" | "shake" | "launch" | "text-hold" | "fadeout">("idle")
  const rocketControls = useAnimation()

  useEffect(() => {
    const sequence = async () => {
      // Phase 1: Idle to Shake (0-1s)
      setPhase("shake")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Phase 2: Launch (1-2.5s)
      setPhase("launch")
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setPhase("text-hold")
      await new Promise((resolve) => setTimeout(resolve, 5500))

      setPhase("fadeout")
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Complete
      onComplete()
    }

    sequence()
  }, [onComplete])

  const stars = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 2.5 + 0.5,
    delay: Math.random() * 1.5,
    duration: Math.random() * 2 + 1,
  }))

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-black overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "fadeout" ? 0 : 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="absolute inset-0">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0.6, 1, 0.8],
              scale: [0, 1, 1.3, 1, 1.1],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {(phase === "text-hold" || phase === "fadeout") && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-20"
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{
            opacity: phase === "fadeout" ? 0 : 1,
            y: 0,
            scale: 1,
          }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white text-center px-4">
            Welcome to{" "}
            <motion.span
              className="text-pop bg-gradient-to-r from-pop via-green-400 to-pop bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Monky
            </motion.span>
          </h1>
        </motion.div>
      )}

      {(phase === "shake" || phase === "launch") && (
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.p
            className="text-pop text-sm font-mono tracking-wider uppercase"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            Launching your experience...
          </motion.p>
        </motion.div>
      )}

      {phase !== "text-hold" && phase !== "fadeout" && (
        <motion.div
          className="relative"
          initial={{ scale: 0.5, y: 0, rotate: 0 }}
          animate={{
            scale: phase === "idle" || phase === "shake" ? 0.6 : 1.2,
            y: phase === "launch" ? -1200 : 0,
            x: phase === "shake" ? [0, -4, 4, -4, 4, -2, 2, 0] : 0,
            rotate: phase === "shake" ? [0, -2, 2, -2, 2, 0] : 0,
          }}
          transition={{
            scale: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
            y: { duration: 1.5, ease: [0.6, 0.01, 0.05, 0.95] },
            x: { duration: 0.8, ease: "easeInOut" },
            rotate: { duration: 0.8, ease: "easeInOut" },
          }}
        >
          <motion.div
            className="absolute inset-0 blur-3xl"
            animate={{
              scale: phase === "launch" ? [1, 1.8, 2.5] : [1, 1.2, 1],
              opacity: phase === "launch" ? [0.7, 0.5, 0] : [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: phase === "launch" ? 1.5 : 2,
              repeat: phase === "launch" ? 0 : Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <div className="w-40 h-40 bg-pop rounded-full" />
          </motion.div>

          {/* Rocket SVG */}
          <svg
            width="140"
            height="140"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10 drop-shadow-2xl"
          >
            {/* Rocket Body */}
            <motion.path
              d="M60 10 L70 50 L70 80 L60 90 L50 80 L50 50 Z"
              fill="url(#rocketGradient)"
              stroke="#00ff88"
              strokeWidth="2.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {/* Rocket Nose */}
            <path d="M60 10 L70 30 L50 30 Z" fill="#00ff88" />

            {/* Rocket Window */}
            <circle cx="60" cy="40" r="8" fill="#0a0a0a" stroke="#00ff88" strokeWidth="2" />
            <circle cx="60" cy="40" r="4" fill="#00ff88" opacity="0.5" />

            {/* Left Fin */}
            <path d="M50 60 L40 80 L50 80 Z" fill="#00ff88" />

            {/* Right Fin */}
            <path d="M70 60 L80 80 L70 80 Z" fill="#00ff88" />

            <defs>
              <linearGradient id="rocketGradient" x1="60" y1="10" x2="60" y2="90">
                <stop offset="0%" stopColor="#1a1a1a" />
                <stop offset="50%" stopColor="#2a2a2a" />
                <stop offset="100%" stopColor="#1a1a1a" />
              </linearGradient>
            </defs>
          </svg>

          {(phase === "shake" || phase === "launch") && (
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 top-full"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{
                opacity: phase === "launch" ? [0.9, 1, 0.7] : [0.6, 0.8, 0.6],
                scaleY: phase === "launch" ? [1, 1.8, 2.5] : [0.8, 1, 0.8],
                scaleX: [1, 1.3, 1.1, 1.3, 1],
              }}
              transition={{
                duration: phase === "launch" ? 1.5 : 0.5,
                repeat: phase === "shake" ? Number.POSITIVE_INFINITY : 0,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            >
              <svg width="70" height="100" viewBox="0 0 60 80" className="drop-shadow-2xl">
                <defs>
                  <linearGradient id="flameGradient" x1="30" y1="0" x2="30" y2="80">
                    <stop offset="0%" stopColor="#00ff88" stopOpacity="1" />
                    <stop offset="30%" stopColor="#00dd77" stopOpacity="0.9" />
                    <stop offset="60%" stopColor="#ff8800" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#ff3300" stopOpacity="0.2" />
                  </linearGradient>
                  <filter id="flameGlow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path
                  d="M30 0 Q20 20 15 40 Q10 60 30 80 Q50 60 45 40 Q40 20 30 0 Z"
                  fill="url(#flameGradient)"
                  filter="url(#flameGlow)"
                />
              </svg>
            </motion.div>
          )}

          {phase === "launch" && (
            <>
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-full rounded-full blur-md"
                  style={{
                    width: 8 + Math.random() * 8,
                    height: 8 + Math.random() * 8,
                    background: `rgba(156, 163, 175, ${0.6 - i * 0.05})`,
                  }}
                  initial={{ opacity: 0.7, y: 0, x: -4 }}
                  animate={{
                    opacity: 0,
                    y: 120 + i * 25,
                    x: (Math.random() - 0.5) * 60,
                    scale: [1, 2, 3.5],
                  }}
                  transition={{
                    duration: 1.8,
                    delay: i * 0.08,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                />
              ))}
            </>
          )}

          {phase === "launch" && (
            <>
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={`spark-${i}`}
                  className="absolute left-1/2 top-full w-1 h-1 bg-pop rounded-full"
                  initial={{ opacity: 1, y: 0, x: 0 }}
                  animate={{
                    opacity: 0,
                    y: 80 + Math.random() * 100,
                    x: (Math.random() - 0.5) * 80,
                    scale: [1, 0.5, 0],
                  }}
                  transition={{
                    duration: 1 + Math.random() * 0.5,
                    delay: i * 0.05,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
