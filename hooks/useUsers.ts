import { useState, useEffect } from "react"
import { getDocs, collection } from "firebase/firestore"
import { getClientDb } from "@/lib/firebase/config"
import { COLLECTIONS } from "@/types/firestore"

export interface UserDoc {
  id: string
  codename: string
}

export function useUsers(excludeUid?: string): { users: UserDoc[], loading: boolean } {
  const [users, setUsers] = useState<UserDoc[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDocs(collection(getClientDb(), COLLECTIONS.USERS))
      .then((snapshot) => {
        const all = snapshot.docs.map((doc) => ({
          id: doc.id,
          codename: doc.data().codename as string,
        }))
        setUsers(excludeUid ? all.filter((u) => u.id !== excludeUid) : all)
      })
      .finally(() => setLoading(false))
  }, [excludeUid])

  return { users, loading }
}
