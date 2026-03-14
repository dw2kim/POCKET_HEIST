"use client"

import { useState, useEffect } from "react"
import { onAuthStateChanged, signOut, User } from "firebase/auth"
import { Clock8, Plus } from "lucide-react"
import Link from "next/link"
import { getClientAuth } from "@/lib/firebase/config"
import styles from "./Navbar.module.css"

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    return onAuthStateChanged(getClientAuth(), setUser)
  }, [])

  function handleLogout() {
    signOut(getClientAuth())
  }

  return (
    <div className={styles.siteNav}>
      <nav>
        <header>
          <h1>
            <Link href="/heists">
              P<Clock8 className={styles.logo} size={14} strokeWidth={2.75} />
              cket Heist
            </Link>
          </h1>
        </header>
        <ul className={styles.actions}>
          {user && (
            <>
              <li>
                <span className={styles.codename}>{user.displayName}</span>
              </li>
              <li>
                <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
              </li>
            </>
          )}
          <li>
            <Link href="/heists/create" className={styles.createBtn}>
              <Plus size={16} strokeWidth={2.5} />
              Create New Heist
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
