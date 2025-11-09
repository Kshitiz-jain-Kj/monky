"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import MonkeyIcon from "@/components/icons/monkey"
import { Eye, EyeOff, Check, X } from "lucide-react"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signup } = useAuth()
  const router = useRouter()

  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: "", color: "" }

    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++

    if (score <= 2) return { score, label: "Weak", color: "text-red-500" }
    if (score <= 3) return { score, label: "Fair", color: "text-yellow-500" }
    if (score <= 4) return { score, label: "Good", color: "text-blue-500" }
    return { score, label: "Strong", color: "text-green-500" }
  }, [password])

  const passwordRequirements = [
    { met: password.length >= 8, text: "At least 8 characters" },
    { met: /[a-z]/.test(password) && /[A-Z]/.test(password), text: "Upper & lowercase letters" },
    { met: /\d/.test(password), text: "Contains a number" },
    { met: /[^a-zA-Z0-9]/.test(password), text: "Contains special character" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setIsLoading(true)

    const result = await signup(name, email, password)

    if (result.success) {
      sessionStorage.setItem("justLoggedIn", "true")
      router.push("/")
    } else {
      setError(result.error || "Signup failed")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-black relative overflow-hidden">
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute size-1 rounded-full bg-primary/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-primary/20 shadow-2xl shadow-primary/5">
          <CardHeader className="space-y-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center"
            >
              <div className="flex size-16 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <MonkeyIcon className="size-12" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <CardTitle className="text-3xl font-display">M.O.N.K.Y. OS</CardTitle>
              <CardDescription className="text-sm uppercase mt-2">Create your account</CardDescription>
            </motion.div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded"
                >
                  {error}
                </motion.div>
              )}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                  className="transition-all duration-200 focus:scale-[1.02]"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="transition-all duration-200 focus:scale-[1.02]"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-2"
              >
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pr-10 transition-all duration-200 focus:scale-[1.02]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-2 pt-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${
                            passwordStrength.score <= 2
                              ? "bg-red-500"
                              : passwordStrength.score <= 3
                                ? "bg-yellow-500"
                                : passwordStrength.score <= 4
                                  ? "bg-blue-500"
                                  : "bg-green-500"
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${passwordStrength.color}`}>{passwordStrength.label}</span>
                    </div>
                    <div className="space-y-1">
                      {passwordRequirements.map((req, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-2 text-xs"
                        >
                          {req.met ? (
                            <Check className="size-3 text-green-500" />
                          ) : (
                            <X className="size-3 text-muted-foreground" />
                          )}
                          <span className={req.met ? "text-green-500" : "text-muted-foreground"}>{req.text}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-2"
              >
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pr-10 transition-all duration-200 focus:scale-[1.02]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {confirmPassword && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-xs"
                  >
                    {password === confirmPassword ? (
                      <>
                        <Check className="size-3 text-green-500" />
                        <span className="text-green-500">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <X className="size-3 text-red-500" />
                        <span className="text-red-500">Passwords do not match</span>
                      </>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="w-full"
              >
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Sign up"}
                </Button>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-sm text-center text-muted-foreground"
              >
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </motion.p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
