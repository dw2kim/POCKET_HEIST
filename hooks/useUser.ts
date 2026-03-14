import { useState, useEffect } from "react"
import { onAuthStateChanged, User } from "firebase/auth"
import { getClientAuth } from "@/lib/firebase/config"

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getClientAuth(), (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return { user, loading }
}
