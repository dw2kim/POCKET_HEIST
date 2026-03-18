export function formatTimeRemaining(deadline: Date, now?: Date): string {
  const diffMs = deadline.getTime() - (now ?? new Date()).getTime()

  if (diffMs < 0) return "Overdue"

  const totalMinutes = Math.floor(diffMs / 60000)
  const totalHours = Math.floor(totalMinutes / 60)
  const days = Math.floor(totalHours / 24)

  if (days >= 1) {
    const remainingHours = totalHours - days * 24
    return `${days}d ${remainingHours}h`
  }

  if (totalHours >= 1) {
    const remainingMinutes = totalMinutes - totalHours * 60
    return `${totalHours}h ${remainingMinutes}m`
  }

  return `${totalMinutes}m`
}
