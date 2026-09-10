import type { OrderStatus, PaymentStatus } from "@/data/orders";
import styles from "./orders.module.css";

export function StatusBadge({
  status,
}: {
  status: OrderStatus | PaymentStatus;
}) {
  return (
    <span className={`${styles.badge} ${styles[status.toLowerCase()]}`}>
      <i aria-hidden="true" />
      {status}
    </span>
  );
}
