"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { getClientDb } from "@/lib/firebase/config"
import { useUser } from "@/hooks/useUser"
import { useUsers } from "@/hooks/useUsers"
import { COLLECTIONS } from "@/types/firestore"
import type { CreateHeistInput } from "@/types/firestore"
import styles from "./create.module.css"

export default function CreateHeistPage() {
  const router = useRouter()
  const { user } = useUser()
  const { users, loading: usersLoading } = useUsers(user?.uid)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [assignedTo, setAssignedTo] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user) return
    setError("")
    setSubmitting(true)

    const assignedUser = users.find((u) => u.id === assignedTo)
    if (!assignedUser) {
      setError("Please select a valid target agent.")
      setSubmitting(false)
      return
    }

    const data: CreateHeistInput = {
      title,
      description,
      createdBy: user.uid,
      createdByCodeName: user.displayName ?? "Unknown Agent",
      assignedTo: assignedUser.id,
      assignedToCodeName: assignedUser.codename,
      createdAt: serverTimestamp(),
      deadline: new Date(Date.now() + 48 * 60 * 60 * 1000),
      finalStatus: null,
    }

    try {
      await addDoc(collection(getClientDb(), COLLECTIONS.HEISTS), data)
      router.push("/heists")
    } catch {
      setError("Failed to create heist. Please try again.")
      setSubmitting(false)
    }
  }

  return (
    <div className="center-content">
      <div className="page-content">
        <h2 className="form-title">Create a New Heist</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="assignedTo">Assign To</label>
            {!usersLoading && users.length === 0 ? (
              <p className={styles.emptyMessage}>No other agents available to assign.</p>
            ) : (
              <select
                id="assignedTo"
                className={styles.select}
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                disabled={usersLoading}
                required
              >
                {usersLoading ? (
                  <option value="">Loading agents...</option>
                ) : (
                  <>
                    <option value="">Select a target agent</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.codename}</option>
                    ))}
                  </>
                )}
              </select>
            )}
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button
            type="submit"
            className="btn"
            disabled={submitting || usersLoading || users.length === 0}
          >
            {submitting ? "Creating..." : "Create Heist"}
          </button>
        </form>
      </div>
    </div>
  )
}
