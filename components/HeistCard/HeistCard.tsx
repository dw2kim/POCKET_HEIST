import Link from "next/link"
import { Clock, User, UserPen, CalendarClock } from "lucide-react"
import type { Heist } from "@/types/firestore"
import { formatTimeRemaining } from "@/utils/formatTimeRemaining"
import Badge from "@/components/Badge"
import styles from "./HeistCard.module.css"

interface HeistCardProps {
  heist: Heist
}

export default function HeistCard({ heist }: HeistCardProps) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(heist.deadline)

  const timeRemaining = formatTimeRemaining(heist.deadline)
  const isOverdue = timeRemaining === "Overdue"

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <Link href={`/heists/${heist.id}`} className={styles.title}>
          {heist.title}
        </Link>
        <div className={styles.headerRight}>
          {heist.finalStatus && <Badge variant={heist.finalStatus} />}
          <Clock className={styles.clockIcon} size={16} strokeWidth={1.75} />
        </div>
      </div>

      <ul className={styles.metaList}>
        <li className={styles.metaRow}>
          <User className={styles.metaIcon} size={12} strokeWidth={1.75} />
          <span className={styles.metaLabel}>To:</span>
          <span className={styles.metaValuePrimary}>
            {heist.assignedToCodeName || "Unknown Agent"}
          </span>
        </li>

        <li className={styles.metaRow}>
          <UserPen className={styles.metaIcon} size={12} strokeWidth={1.75} />
          <span className={styles.metaLabel}>By:</span>
          <span className={styles.metaValueSecondary}>
            {heist.createdByCodeName || "Unknown Agent"}
          </span>
        </li>

        <li className={styles.metaRow}>
          <CalendarClock className={styles.metaIcon} size={12} strokeWidth={1.75} />
          <span className={styles.deadlineText}>{formattedDate}</span>
          <span className={styles.bullet}>•</span>
          <span className={isOverdue ? styles.metaValuePrimary : styles.timeRemaining}>
            {timeRemaining}
          </span>
        </li>
      </ul>
    </div>
  )
}

export function HeistCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.skeletonPulse}>
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonTitleShort} />
        </div>
      </div>
      <ul className={styles.metaList}>
        <li className={`${styles.skeletonPulse} ${styles.skeletonRow}`} />
        <li className={`${styles.skeletonPulse} ${styles.skeletonRow}`} />
        <li className={`${styles.skeletonPulse} ${styles.skeletonRowShort}`} />
      </ul>
    </div>
  )
}
