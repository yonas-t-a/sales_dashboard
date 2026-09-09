"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/config/navigation";
import { ProCard } from "./pro-card";
import { SidebarIcon } from "./sidebar-icon";
import styles from "./sidebar.module.css";

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className={styles.sidebar}>
      <Link href="/" className={styles.brand} aria-label="Dabang home">
        <span className={styles.brandMark}><SidebarIcon name="brand" /></span>
        <span>Dabang</span>
      </Link>
      <nav className={styles.navigation} aria-label="Main navigation">
        {navigationItems.map(({ label, href, icon }) => {
          const active = href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link key={href} href={href} aria-label={label} title={label} className={`${styles.navLink} ${active ? styles.active : ""}`} aria-current={active ? "page" : undefined}>
              <SidebarIcon name={icon} /><span>{label}</span>
            </Link>
          );
        })}
        <Link href="/sign-out" aria-label="Sign Out" title="Sign Out" className={`${styles.navLink} ${pathname === "/sign-out" ? styles.active : ""}`} aria-current={pathname === "/sign-out" ? "page" : undefined}>
          <SidebarIcon name="sign-out" /><span>Sign Out</span>
        </Link>
      </nav>
      <ProCard />
    </aside>
  );
}
