"use client"

import { useHeist } from "@/hooks/useHeist"
import type { Heist } from "@/types/firestore"
import HeistCard, { HeistCardSkeleton } from "@/components/HeistCard"
import styles from "./heists.module.css"

function HeistCardGrid({ heists, loading, emptyMessage }: {
  heists: Heist[]
  loading: boolean
  emptyMessage: string
}) {
  if (loading) {
    return (
      <div className={styles.grid}>
        <HeistCardSkeleton />
        <HeistCardSkeleton />
        <HeistCardSkeleton />
      </div>
    )
  }
  if (heists.length === 0) return <p className={styles.emptyMessage}>{emptyMessage}</p>
  return (
    <div className={styles.grid}>
      {heists.map((heist) => (
        <HeistCard key={heist.id} heist={heist} />
      ))}
    </div>
  )
}

function HeistList({ heists, loading, emptyMessage }: {
  heists: Heist[]
  loading: boolean
  emptyMessage: string
}) {
  if (loading) return <p className={styles.loadingMessage}>Loading...</p>
  if (heists.length === 0) return <p className={styles.emptyMessage}>{emptyMessage}</p>

  return (
    <ul className={styles.list}>
      {heists.map((heist) => (
        <li key={heist.id} className={styles.listItem}>{heist.title}</li>
      ))}
    </ul>
  )
}

export default function HeistsPage() {
  const active = useHeist("active")
  const assigned = useHeist("assigned")
  const expired = useHeist("expired")

  return (
    <div className="page-content">
      <section className={styles.section}>
        <h2>Your Active Heists</h2>
        <HeistCardGrid heists={active.heists} loading={active.loading} emptyMessage="No active heists right now." />
      </section>
      <section className={styles.section}>
        <h2>Heists You&apos;ve Assigned</h2>
        <HeistCardGrid heists={assigned.heists} loading={assigned.loading} emptyMessage="You haven&apos;t assigned any heists." />
      </section>
      <section className={styles.section}>
        <h2>All Expired Heists</h2>
        <HeistList heists={expired.heists} loading={expired.loading} emptyMessage="No expired heists yet." />
      </section>
    </div>
  )
}
