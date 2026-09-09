import Link from "next/link";
import { SidebarIcon } from "./sidebar-icon";
import styles from "./sidebar.module.css";

export function ProCard() {
  return (
    <section className={styles.proCard} aria-labelledby="pro-title">
      <span className={styles.proLogo}><SidebarIcon name="brand" /></span>
      <h2 id="pro-title">Dabang Pro</h2>
      <p>Get access to all<br />features on tetumbas</p>
      <Link href="/upgrade" className={styles.proButton}>Get Pro</Link>
    </section>
  );
}
