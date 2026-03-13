"use client"

import { useState, useEffect } from "react"
import { onAuthStateChanged, signOut, User } from "firebase/auth"
import { Clock8 } from "lucide-react"
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
          <div>Tiny missions. Big office mischief.</div>
        </header>
        <ul>
          <li>
            <Link href="/heists/create" className="btn">Create Heist</Link>
          </li>
          {user && (
            <>
              <li>
                <span className={styles.codename}>{user.displayName}</span>
              </li>
              <li>
                <button onClick={handleLogout} className={styles.logoutBtn}>Log Out</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  )
}
