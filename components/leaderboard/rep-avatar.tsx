import type { SalesRep } from "@/data/leaderboard";
import styles from "./leaderboard.module.css";

export function RepAvatar({ rep, large = false }: { rep: SalesRep; large?: boolean }) {
  return <span aria-hidden="true" className={`${styles.avatar} ${styles[rep.color]} ${large ? styles.largeAvatar : ""}`}>{rep.name.split(" ").map((part) => part[0]).join("")}</span>;
}
