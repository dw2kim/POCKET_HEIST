"use client"

import { useState, type FormEvent } from "react"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getClientAuth, getClientDb } from "@/lib/firebase/config"
import { generateCodename } from "@/lib/codename"
import styles from "./signup.module.css"

const errorMessages: Record<string, string> = {
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/weak-password": "Password must be at least 6 characters.",
}

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)

    try {
      const { user } = await createUserWithEmailAndPassword(getClientAuth(), email, password)
      const codename = generateCodename()

      await updateProfile(user, { displayName: codename })

      try {
        await setDoc(doc(getClientDb(), "users", user.uid), { id: user.uid, codename })
      } catch {
        // Firestore write failed but user is authenticated — continue
      }

      router.push("/heists")
    } catch (err: unknown) {
      console.error("Signup error:", err)
      const code = (err as { code?: string }).code ?? ""
      setError(errorMessages[code] ?? "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="center-content">
      <div className="page-content">
        <h2 className="form-title">Signup for an Account</h2>

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
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              type="password"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Signing up…" : "Sign Up"}
          </button>

          <Link href="/login" className={styles.link}>
            Already have an account? Log in
          </Link>
        </form>
      </div>
    </div>
  )
}
