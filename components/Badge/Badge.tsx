import styles from "./Badge.module.css"

export type BadgeVariant = "success" | "failure" | "active" | "assigned" | "expired"

interface BadgeProps {
  variant: BadgeVariant
  label?: string
}

const defaultLabels: Record<BadgeVariant, string> = {
  success: "Success",
  failure: "Failure",
  active: "Active",
  assigned: "Assigned",
  expired: "Expired",
}

export default function Badge({ variant, label }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {label ?? defaultLabels[variant]}
    </span>
  )
}
