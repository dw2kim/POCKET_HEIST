import { useState, useEffect } from "react"
import { collection, query, where, onSnapshot, Timestamp } from "firebase/firestore"
import type { Query } from "firebase/firestore"
import { getClientDb } from "@/lib/firebase/config"
import { useUser } from "@/hooks/useUser"
import { heistConverter, COLLECTIONS } from "@/types/firestore"
import type { Heist } from "@/types/firestore"

export type HeistMode = "active" | "assigned" | "expired"

function buildQuery(mode: HeistMode, uid: string): Query<Heist> {
  const col = collection(getClientDb(), COLLECTIONS.HEISTS).withConverter(heistConverter)

  switch (mode) {
    case "active":
      return query(col, where("assignedTo", "==", uid))
    case "assigned":
      return query(col, where("createdBy", "==", uid))
    case "expired":
      return query(col, where("deadline", "<=", Timestamp.now()))
  }
}

export function useHeist(mode: HeistMode): { heists: Heist[], loading: boolean } {
  const { user, loading: userLoading } = useUser()
  const [heists, setHeists] = useState<Heist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userLoading) return
    if (mode !== "expired" && !user?.uid) return

    const now = Timestamp.now()
    const q = buildQuery(mode, user?.uid ?? "")
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let results = snapshot.docs.map((doc) => doc.data())
      if (mode === "active" || mode === "assigned") {
        results = results.filter((h) => h.deadline > now.toDate())
      }
      if (mode === "expired") {
        results = results.filter((h) => h.finalStatus != null)
      }
      setHeists(results)
      setLoading(false)
    })

    return unsubscribe
  }, [mode, user?.uid, userLoading])

  return { heists, loading }
}
