"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/useUser"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.replace("/heists")
    }
  }, [user, loading, router])

  if (loading || user) {
    return (
      <div className="center-content">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <main className="public">
      {children}
    </main>
  )
}
