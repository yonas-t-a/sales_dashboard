"use client";

import { useEffect, useRef } from "react";
import { CreditCard, MapPin, Package, X } from "lucide-react";
import {
  formatMoney,
  formatOrderDate,
  orderSubtotal,
  orderTotal,
  type Order,
} from "@/data/orders";
import { StatusBadge } from "./status-badge";
import styles from "./orders.module.css";
import shared from "@/components/leaderboard/leaderboard.module.css";

export function OrderDetails({
  order,
  onClose,
}: {
  order: Order | null;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (order && !dialog.current?.open) dialog.current?.showModal();
    if (!order && dialog.current?.open) dialog.current.close();
  }, [order]);
  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-labelledby="order-detail-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialog.current?.close();
      }}
    >
      {order && (
        <div className={styles.dialogBody}>
          <header className={styles.dialogHeader}>
            <div>
              <span className={shared.demoBadge}>Demo order</span>
              <h2 id="order-detail-title">Order #{order.id}</h2>
              <p>
                {formatOrderDate(order.date)} · {order.channel}
              </p>
            </div>
            <button
              className={shared.button}
              aria-label="Close order details"
              onClick={() => dialog.current?.close()}
            >
              <X aria-hidden="true" />
            </button>
          </header>
          <div className={styles.detailStatuses}>
            <StatusBadge status={order.status} />
            <StatusBadge status={order.payment} />
          </div>
          <div className={styles.detailGrid}>
            <section>
              <h3>
                <MapPin aria-hidden="true" />
                Customer &amp; shipping
              </h3>
              <strong>{order.customer}</strong>
              <p>{order.email}</p>
              <address>{order.address}</address>
            </section>
            <section>
              <h3>
                <CreditCard aria-hidden="true" />
                Payment &amp; delivery
              </h3>
              <p>Payment: {order.payment}</p>
              <p>{order.shippingMethod}</p>
              <p>
                {order.status === "Cancelled"
                  ? "Order cancelled. No shipment scheduled."
                  : order.status === "Processing"
                    ? order.payment === "Pending"
                      ? "Awaiting payment before fulfillment."
                      : "Payment received. Ready to prepare."
                    : order.status === "Shipped"
                      ? "Order has been dispatched."
                      : "Order delivered to the customer."}
              </p>
            </section>
          </div>
          <section className={styles.items}>
            <h3>
              <Package aria-hidden="true" />
              Order items
            </h3>
            {order.items.map((item) => (
              <div className={styles.item} key={item.sku}>
                <span className={styles.productIcon}>
                  <Package aria-hidden="true" />
                </span>
                <div>
                  <strong>{item.name}</strong>
                  <small>
                    {item.sku} · {item.quantity} ×{" "}
                    {formatMoney(item.priceCents)}
                  </small>
                </div>
                <strong>{formatMoney(item.priceCents * item.quantity)}</strong>
              </div>
            ))}
          </section>
          <dl className={styles.totals}>
            <div>
              <dt>Subtotal</dt>
              <dd>{formatMoney(orderSubtotal(order))}</dd>
            </div>
            <div>
              <dt>Shipping</dt>
              <dd>
                {order.shippingCents
                  ? formatMoney(order.shippingCents)
                  : "Free"}
              </dd>
            </div>
            <div>
              <dt>Tax</dt>
              <dd>{formatMoney(order.taxCents)}</dd>
            </div>
            <div>
              <dt>Order total</dt>
              <dd>{formatMoney(orderTotal(order))}</dd>
            </div>
          </dl>
          <p className={styles.detailNote}>
            Demo order · All amounts are shown in USD.
          </p>
        </div>
      )}
    </dialog>
  );
}
