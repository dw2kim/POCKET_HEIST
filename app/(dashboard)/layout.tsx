"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import { useUser } from "@/hooks/useUser"

export default function HeistsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="center-content">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  )
}
