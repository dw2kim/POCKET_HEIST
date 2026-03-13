"use client"

import { useState, type FormEvent } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import Link from "next/link"
import { getClientAuth } from "@/lib/firebase/config"
import styles from "./login.module.css"

const errorMessages: Record<string, string> = {
  "auth/invalid-credential": "Invalid email or password.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/user-not-found": "No account found with this email.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const { user } = await signInWithEmailAndPassword(getClientAuth(), email, password)
      setSuccess(user.displayName ? `Welcome back, ${user.displayName}!` : "You're logged in!")
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ""
      setError(errorMessages[code] ?? "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="center-content">
      <div className="page-content">
        <h1 className="form-title">Log in to Your Account</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.passwordWrapper}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          {success && <p className={styles.success}>{success}</p>}

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Logging in…" : "Log In"}
          </button>

          <Link href="/signup" className={styles.link}>
            Don&apos;t have an account? Sign up
          </Link>
        </form>
      </div>
    </div>
  )
}
