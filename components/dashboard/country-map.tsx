"use client";

import { useState } from "react";
import countries from "@/data/world-map.json";
import { countrySales } from "@/data/dashboard";
import styles from "./dashboard.module.css";

export function CountryMap() {
  const [selected, setSelected] = useState("");
  const sales = countrySales.find(({ country }) => country === selected);

  return (
    <section className={`${styles.card} ${styles.countryMap}`} aria-labelledby="map-heading">
      <h2 id="map-heading">Sales Mapping by Country</h2>
      <div className={styles.mapImage}>
        <svg className={styles.worldMap} viewBox="0 10 640 310" role="group" aria-label="Sales by country. Select a highlighted country to view demo sales.">
          {countries.map(({ name, path }) => {
            const entry = countrySales.find(({ country }) => country === name);
            return (
              <path
                key={name}
                d={path}
                fill={entry?.color ?? "#ededee"}
                fillRule="evenodd"
                className={entry ? styles.mapCountry : styles.mapLand}
                role={entry ? "button" : undefined}
                tabIndex={entry ? 0 : undefined}
                aria-label={entry ? `${entry.label}: $${entry.sales.toLocaleString("en-US")} in demo sales` : undefined}
                aria-pressed={entry ? selected === name : undefined}
                onClick={entry ? () => setSelected(name) : undefined}
                onKeyDown={entry ? (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelected(name);
                  }
                } : undefined}
              >
                <title>{entry ? `${entry.label}: $${entry.sales.toLocaleString("en-US")} in demo sales. Click for details.` : `${name}: no sales data`}</title>
              </path>
            );
          })}
        </svg>
      </div>
      <div className={styles.mapControls}>
        <select aria-label="Select sales country" value={selected} onChange={(event) => setSelected(event.target.value)}>
          <option value="">Select country</option>
          {countrySales.map(({ country, label }) => <option key={country} value={country}>{label}</option>)}
        </select>
        <span className={styles.mapResult} role="status" aria-live="polite">
          {sales ? <><strong>${sales.sales.toLocaleString("en-US")}</strong><span>Demo sales</span></> : <span>Demo data</span>}
        </span>
      </div>
    </section>
  );
}
