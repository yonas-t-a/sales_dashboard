"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { navigationItems } from "@/config/navigation";
import { TopbarIcon } from "./topbar-icon";
import styles from "./topbar.module.css";

export function TopbarSearch() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const results = navigationItems.filter(({ label }) => label.toLowerCase().includes(query.trim().toLowerCase()));
  const open = focused && query.trim().length > 0;

  return (
    <form
      className={styles.search}
      role="search"
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
      onSubmit={(event) => {
        event.preventDefault();
        if (query.trim() && results[0]) {
          router.push(results[0].href);
          setQuery("");
          setFocused(false);
        }
      }}
    >
      <TopbarIcon name="search" />
      <input
        type="search"
        aria-label="Search dashboard pages"
        placeholder="Search here..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setFocused(true)}
        onKeyDown={(event) => { if (event.key === "Escape") setFocused(false); }}
        aria-controls={open ? "page-search-results" : undefined}
      />
      {open && (
        <div id="page-search-results" className={`${styles.popover} ${styles.searchResults}`}>
          <p className={styles.popoverLabel} role="status">{results.length ? "Pages" : "No pages found"}</p>
          {results.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => { setQuery(""); setFocused(false); }}>{label}</Link>
          ))}
        </div>
      )}
    </form>
  );
}
