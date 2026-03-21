"use client"

import { use } from "react"
import Link from "next/link"
import { ChevronLeft, User, UserPen, CalendarClock, Clock } from "lucide-react"
import { useHeistById } from "@/hooks/useHeistById"
import { formatTimeRemaining } from "@/utils/formatTimeRemaining"
import styles from "./heist-detail.module.css"

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

function StatusBadge({ status }: { status: "success" | "failure" | null }) {
  if (status === "success") return <span className={styles.statusSuccess}>Success</span>
  if (status === "failure") return <span className={styles.statusFailure}>Failure</span>
  return <span className={styles.statusActive}>Active</span>
}

export default function HeistDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { heist, loading, notFound } = useHeistById(id)

  if (loading) {
    return (
      <div className="page-content">
        <div className={styles.header}>
          <Link href="/heists" className={styles.backLink}>
            <ChevronLeft size={16} />
            Back to Heists
          </Link>
        </div>
        <div className={styles.detail}>
          <div className={styles.titleRow}>
            <div className={`${styles.skeletonPulse} ${styles.skeletonTitle}`} />
          </div>
          <div className={styles.skeletonPulse} style={{ height: "1rem", width: "100%" }} />
          <div className={styles.skeletonPulse} style={{ height: "1rem", width: "75%" }} />
          <div className={styles.metaList}>
            <div className={`${styles.skeletonPulse} ${styles.skeletonMetaRow}`} />
            <div className={`${styles.skeletonPulse} ${styles.skeletonMetaRow}`} />
            <div className={`${styles.skeletonPulse} ${styles.skeletonMetaRow}`} />
            <div className={`${styles.skeletonPulse} ${styles.skeletonMetaRow}`} />
          </div>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="page-content">
        <div className={styles.header}>
          <Link href="/heists" className={styles.backLink}>
            <ChevronLeft size={16} />
            Back to Heists
          </Link>
        </div>
        <p className={styles.notFound}>This heist doesn&apos;t exist or has been removed.</p>
      </div>
    )
  }

  const timeRemaining = formatTimeRemaining(heist!.deadline)
  const isOverdue = timeRemaining === "Overdue"

  return (
    <div className="page-content">
      <div className={styles.header}>
        <Link href="/heists" className={styles.backLink}>
          <ChevronLeft size={16} />
          Back to Heists
        </Link>
      </div>

      <article className={styles.detail}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>{heist!.title}</h2>
          <StatusBadge status={heist!.finalStatus} />
        </div>

        <p className={styles.description}>{heist!.description}</p>

        <ul className={styles.metaList}>
          <li className={styles.metaRow}>
            <User className={styles.metaIcon} size={14} strokeWidth={1.75} />
            <span className={styles.label}>Assigned to</span>
            <span className={styles.valuePrimary}>{heist!.assignedToCodeName || "Unknown Agent"}</span>
          </li>

          <li className={styles.metaRow}>
            <UserPen className={styles.metaIcon} size={14} strokeWidth={1.75} />
            <span className={styles.label}>Created by</span>
            <span className={styles.valueSecondary}>{heist!.createdByCodeName || "Unknown Agent"}</span>
          </li>

          <li className={styles.metaRow}>
            <CalendarClock className={styles.metaIcon} size={14} strokeWidth={1.75} />
            <span className={styles.label}>Deadline</span>
            <span className={styles.valueBody}>{dateFormatter.format(heist!.deadline)}</span>
            <span className={styles.bullet}>•</span>
            <span className={isOverdue ? styles.valuePrimary : styles.valueBody}>{timeRemaining}</span>
          </li>

          <li className={styles.metaRow}>
            <Clock className={styles.metaIcon} size={14} strokeWidth={1.75} />
            <span className={styles.label}>Created</span>
            <span className={styles.valueBody}>{dateFormatter.format(heist!.createdAt)}</span>
          </li>
        </ul>
      </article>
    </div>
  )
}
