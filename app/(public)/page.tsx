import Link from "next/link"
import { Clock8 } from "lucide-react"
import { Bebas_Neue } from "next/font/google"
import styles from "./home.module.css"

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" })

export default function Home() {
  return (
    <div className={styles.hero}>
      <div className={styles.grid} />
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <div className={styles.content}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          Mission Active
        </div>

        <h1 className={`${bebas.className} ${styles.title}`}>
          P<Clock8 className={styles.clock} strokeWidth={2.5} />cket Heist
        </h1>

        <p className={styles.tagline}>Mischief, delivered.</p>

        <p className={styles.description}>
          Assign sneaky little tasks to your coworkers. Create a heist, pick your mark,
          set a deadline — then watch the chaos unfold.
        </p>

        <div className={styles.steps}>
          <div className={styles.step}>
            <span className={styles.stepNum}>01</span>
            <span className={styles.stepLabel}>Create a heist</span>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNum}>02</span>
            <span className={styles.stepLabel}>Pick your target</span>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNum}>03</span>
            <span className={styles.stepLabel}>Watch chaos unfold</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Link href="/signup" className={styles.btnPrimary}>Get Started</Link>
          <Link href="/login" className={styles.btnGhost}>Log In</Link>
        </div>
      </div>
    </div>
  )
}
