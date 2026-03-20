import { useState, useEffect } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { getClientDb } from "@/lib/firebase/config"
import { heistConverter, COLLECTIONS } from "@/types/firestore"
import type { Heist } from "@/types/firestore"

export function useHeistById(id: string): { heist: Heist | null; loading: boolean; notFound: boolean } {
  const [heist, setHeist] = useState<Heist | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    const ref = doc(getClientDb(), COLLECTIONS.HEISTS, id).withConverter(heistConverter)
    return onSnapshot(ref, (snapshot) => {
      if (!snapshot.exists()) {
        setNotFound(true)
        setHeist(null)
      } else {
        setHeist(snapshot.data())
        setNotFound(false)
      }
      setLoading(false)
    })
  }, [id])

  return { heist, loading, notFound }
}
