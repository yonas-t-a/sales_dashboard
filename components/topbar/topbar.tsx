"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/config/navigation";
import { TopbarIcon } from "./topbar-icon";
import { TopbarSearch } from "./topbar-search";
import styles from "./topbar.module.css";

export function Topbar() {
  const pathname = usePathname();
  const currentPage = navigationItems.find(({ href }) => href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));
  const title = currentPage?.label ?? (pathname === "/upgrade" ? "Dabang Pro" : pathname === "/sign-out" ? "Sign Out" : "Dabang");

  return (
    <header className={styles.topbar}>
      <p className={styles.title}>{title}</p>
      <TopbarSearch />
      <div className={styles.actions}>
        <label className={styles.language}>
          <span className={styles.flag} aria-hidden="true">🇺🇸</span>
          <select aria-label="Language" defaultValue="en-US">
            <option value="en-US">Eng (US)</option>
          </select>
          <TopbarIcon name="chevron" />
        </label>

        <details className={styles.dropdown} onKeyDown={closeOnEscape}>
          <summary className={styles.notification} aria-label="Notifications">
            <TopbarIcon name="bell" />
          </summary>
          <div className={styles.popover}>
            <p className={styles.popoverHeading}>Notifications</p>
            <p className={styles.emptyState}>You’re all caught up.</p>
          </div>
        </details>

        <details className={styles.dropdown} onKeyDown={closeOnEscape}>
          <summary className={styles.profile} aria-label="Musfiq account options">
            <span className={styles.avatar} aria-hidden="true">M</span>
            <span className={styles.profileText}>
              <span className={styles.name}>Musfiq</span>
              <span className={styles.role}>Admin</span>
            </span>
            <TopbarIcon name="chevron" />
          </summary>
          <div className={styles.popover} onClick={(event) => {
            if ((event.target as HTMLElement).closest("a")) event.currentTarget.closest("details")?.removeAttribute("open");
          }}>
            <p className={styles.popoverLabel}>My account</p>
            <Link href="/settings">Profile &amp; settings</Link>
            <Link href="/sign-out">Sign out</Link>
          </div>
        </details>
      </div>
    </header>
  );
}

function closeOnEscape(event: React.KeyboardEvent<HTMLDetailsElement>) {
  if (event.key === "Escape") {
    event.currentTarget.open = false;
    event.currentTarget.querySelector("summary")?.focus();
  }
}
