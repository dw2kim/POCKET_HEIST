import { Clock8 } from "lucide-react"
import Link from "next/link"
import styles from "./Footer.module.css"

export default function Footer() {
  return (
    <footer className={styles.siteFooter}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>
            P<Clock8 className={styles.logoIcon} size={12} strokeWidth={2.75} />
            cket Heist
          </span>
          <p className={styles.tagline}>Tiny missions. Big office mischief.</p>
        </div>

        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/heists" className={styles.navLink}>Dashboard</Link>
          <Link href="/heists/create" className={styles.navLink}>New Heist</Link>
        </nav>

        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} Pocket Heist
        </p>
      </div>
    </footer>
  )
}
