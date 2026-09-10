"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  Eye,
  Package,
  ShoppingBag,
} from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  formatMoney,
  formatOrderDate,
  orderPeriods,
  ordersForPeriod,
  orderStatuses,
  orderTotal,
  paymentStatuses,
  summarizeOrders,
  type Order,
  type OrderPeriod,
  type OrderStatus,
  type PaymentStatus,
} from "@/data/orders";
import { DataTable } from "@/components/ui/data-table";
import { OrderDetails } from "./order-details";
import { StatusBadge } from "./status-badge";
import shared from "@/components/leaderboard/leaderboard.module.css";
import dashboard from "@/components/dashboard/dashboard.module.css";
import styles from "./orders.module.css";

const searchText = (order: Order) =>
  `${order.id} ${order.customer} ${order.email} ${order.items.map((item) => `${item.name} ${item.sku}`).join(" ")}`;
const exportRow = (order: Order) => [
  order.id,
  order.customer,
  order.email,
  order.date,
  order.status,
  order.payment,
  order.channel,
  order.items.reduce((sum, item) => sum + item.quantity, 0),
  (orderTotal(order) / 100).toFixed(2),
];

export function OrdersPage() {
  const [period, setPeriod] = useState<OrderPeriod>("month");
  const [status, setStatus] = useState<OrderStatus | "All orders">(
    "All orders",
  );
  const [payment, setPayment] = useState<PaymentStatus | "All payments">(
    "All payments",
  );
  const [selected, setSelected] = useState<Order | null>(null);
  const periodOrders = useMemo(() => ordersForPeriod(period), [period]);
  const paymentOrders = useMemo(
    () =>
      periodOrders.filter(
        (order) => payment === "All payments" || order.payment === payment,
      ),
    [periodOrders, payment],
  );
  const filtered = useMemo(
    () =>
      paymentOrders.filter(
        (order) => status === "All orders" || order.status === status,
      ),
    [paymentOrders, status],
  );
  const summary = summarizeOrders(periodOrders);
  const ready = periodOrders.filter(
    (order) => order.status === "Processing" && order.payment === "Paid",
  ).length;
  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Order",
        cell: ({ row }) => (
          <button
            className={styles.orderLink}
            onClick={() => setSelected(row.original)}
          >
            #{row.original.id}
          </button>
        ),
      },
      {
        accessorKey: "customer",
        header: "Customer",
        cell: ({ row }) => (
          <div className={shared.member}>
            <span
              className={`${shared.avatar} ${shared.purple}`}
              aria-hidden="true"
            >
              {row.original.customer
                .split(" ")
                .map((name) => name[0])
                .join("")}
            </span>
            <span>
              <strong>{row.original.customer}</strong>
              <small>{row.original.email}</small>
            </span>
          </div>
        ),
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ getValue }) => formatOrderDate(getValue<string>()),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "payment",
        header: "Payment",
        cell: ({ row }) => <StatusBadge status={row.original.payment} />,
      },
      {
        id: "total",
        accessorFn: orderTotal,
        header: "Total",
        cell: ({ getValue }) => (
          <strong>{formatMoney(getValue<number>())}</strong>
        ),
      },
      {
        id: "actions",
        header: "Details",
        enableSorting: false,
        cell: ({ row }) => (
          <button
            className={shared.button}
            aria-label={`View order ${row.original.id}`}
            onClick={() => setSelected(row.original)}
          >
            <Eye aria-hidden="true" />
          </button>
        ),
      },
    ],
    [],
  );
  const stats = [
    {
      label: "Total orders",
      value: String(summary.count),
      detail: "All orders in the selected period",
      color: "purple",
      Icon: ShoppingBag,
    },
    {
      label: "Payments collected",
      value: formatMoney(summary.collectedCents),
      detail: "Paid orders · excludes refunds",
      color: "green",
      Icon: CircleDollarSign,
    },
    {
      label: "Awaiting fulfillment",
      value: String(summary.processing),
      detail: `${ready} paid and ready to prepare`,
      color: "peach",
      Icon: Clock3,
    },
    {
      label: "Average order value",
      value: formatMoney(summary.averageCents),
      detail: "Excludes cancelled orders",
      color: "pink",
      Icon: Package,
    },
  ];
  return (
    <main
      id="main-content"
      className={`${dashboard.dashboard} ${shared.page}`}
      aria-label="Orders"
    >
      <div className={shared.pageHeader}>
        <div>
          <div className={shared.headingLine}>
            <h1>Order management</h1>
            <span className={shared.demoBadge}>Demo data</span>
          </div>
          <p>Every order, from checkout to your customer’s doorstep.</p>
        </div>
        <div className={shared.filters}>
          <label>
            <CalendarDays aria-hidden="true" />
            <select
              aria-label="Orders period"
              value={period}
              onChange={(event) => setPeriod(event.target.value as OrderPeriod)}
            >
              {Object.entries(orderPeriods).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className={shared.periodNote}>
        <span>
          {period === "all"
            ? "All demo orders"
            : `${formatOrderDate(orderPeriods[period].start)} – ${formatOrderDate(orderPeriods[period].end)}`}
        </span>
        <span>Overview reflects the selected period</span>
      </div>
      <section className={shared.stats} aria-label="Order summary">
        {stats.map(({ label, value, detail, color, Icon }) => (
          <article
            key={label}
            className={`${shared.statCard} ${shared[color]}`}
          >
            <span className={shared.statIcon}>
              <Icon aria-hidden="true" />
            </span>
            <span className={shared.statLabel}>{label}</span>
            <strong>{value}</strong>
            <small>{detail}</small>
          </article>
        ))}
      </section>
      {ready > 0 && (
        <div className={styles.fulfillmentNotice}>
          <span className={styles.noticeIcon}>
            <Package aria-hidden="true" />
          </span>
          <div>
            <strong>
              {ready} {ready === 1 ? "order is" : "orders are"} ready for the
              next step
            </strong>
            <p>
              Payment received. Review the details before preparing shipment.
            </p>
          </div>
          <button
            onClick={() => {
              setStatus("Processing");
              setPayment("Paid");
            }}
          >
            View orders <ArrowRight aria-hidden="true" />
          </button>
        </div>
      )}
      <DataTable
        key={`${period}-${status}-${payment}`}
        data={filtered}
        columns={columns}
        title="All orders"
        description="Track fulfillment and payment status in one place."
        searchLabel="Search orders"
        searchText={searchText}
        noun="orders"
        initialSorting={[{ id: "date", desc: true }]}
        exportName={`dabang-orders-${period}-${status.toLowerCase().replaceAll(" ", "-")}-${payment.toLowerCase().replaceAll(" ", "-")}.csv`}
        exportHeaders={[
          "Order ID",
          "Customer",
          "Email",
          "Date",
          "Status",
          "Payment",
          "Channel",
          "Items",
          "Total (USD)",
        ]}
        exportRow={exportRow}
        toolbar={
          <div className={styles.toolbar}>
            <div
              className={styles.statusTabs}
              role="group"
              aria-label="Order status"
            >
              {(["All orders", ...orderStatuses] as const).map((value) => (
                <button
                  key={value}
                  aria-pressed={status === value}
                  onClick={() => setStatus(value)}
                >
                  {value}
                  <span>
                    {value === "All orders"
                      ? paymentOrders.length
                      : paymentOrders.filter((order) => order.status === value)
                          .length}
                  </span>
                </button>
              ))}
            </div>
            <div className={shared.filters}>
              <label>
                <select
                  aria-label="Payment status"
                  value={payment}
                  onChange={(event) =>
                    setPayment(
                      event.target.value as PaymentStatus | "All payments",
                    )
                  }
                >
                  {["All payments", ...paymentStatuses].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              {(status !== "All orders" || payment !== "All payments") && (
                <button
                  className={shared.button}
                  onClick={() => {
                    setStatus("All orders");
                    setPayment("All payments");
                  }}
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>
        }
      />
      <p className={shared.pageNote}>
        Demo snapshot · September 10, 2026. All amounts are USD and include
        shipping and tax. Open an order to view its items and delivery
        information.
      </p>
      <OrderDetails order={selected} onClose={() => setSelected(null)} />
    </main>
  );
}
