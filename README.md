This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Sales leaderboard

Open `/leaderboard` for the sales team rankings. The page reuses the dashboard layout,
sticky sidebar, responsive scale, colors, and card styling. TanStack Table v8 handles
search, column sorting, and pagination; Lucide supplies the icons.

- `app/leaderboard/page.tsx`: route and metadata.
- `components/leaderboard/`: page, rankings table, avatars, and styles.
- `data/leaderboard.ts`: demo snapshots, ranking calculations, and formatting.
- `lib/export-csv.ts`: CSV download helper.
- `tests/leaderboard.test.mjs`: ranking, tie, region, and snapshot checks (`npm test`, Node 22.6+).

The data is a fixed demo snapshot as of September 10, 2026, not a live CRM feed.
Period and region filters apply to the summaries and rankings. Search filters the
table; export includes every matching row in the current sort order, across pages.
Ranking metrics are revenue, orders, and revenue target attainment. Equal values
share a rank, and rank changes compare the same region and metric across periods.
Replace `getSalesReps` with your data source when integrating a backend.

## Orders

Open `/orders` to browse demo orders with period, fulfillment, and payment filters.
The overview reflects the selected period; status and payment filters narrow the
table. Search matches order IDs, customers, email addresses, products, and SKUs.
CSV export includes all matching rows across pages, in the current sort order.

- `app/orders/page.tsx`: route and metadata.
- `components/orders/`: order management, status badges, and accessible details dialog.
- `components/ui/data-table.tsx`: reusable TanStack table with search, sorting, pagination, and export.
- `data/orders.ts`: demo fixtures and order calculations using integer cents.
- `tests/orders.test.mjs`: totals, date boundaries, payment summaries, and empty-state calculations.

The demo is fixed at September 10, 2026. Order details show items, quantities,
shipping, tax, customer information, and current statuses. No backend is connected.

## Products

Open `/products` to browse and manage the demo catalog. It reuses the shared
TanStack table, CSV export, dashboard styles, and Lucide icons. Search matches
names, SKUs, and categories; filters cover catalog status, category, and inventory.
Low stock means 1–10 units. Summary alerts count only active products.

- `components/products/`: catalog page, product editor, category icons, and browser store.
- `data/products.ts`: fixtures, stock summaries, and validation.
- `tests/products.test.mjs`: thresholds, summaries, unique SKUs, and numeric validation.

Add/edit changes are saved under `dabang-products-v1` in this browser’s local
storage and survive navigation and reloads. They do not update the independent
dashboard or historical order demo fixtures. There is no backend synchronization.

## Sales Report

`/sales-report` derives its metrics from the existing demo orders, using inclusive
date presets and sales-channel filters. Product sales include paid, non-cancelled
orders and exclude shipping and tax. The payment breakdown adds those amounts back
to reconcile with the Orders page. Dates refer to order placement, not settlement.

- `data/sales-report.ts`: aggregation, daily zero-filling, and product/channel summaries.
- `components/sales-report/`: report page, interactive trend chart, and styles.
- `tests/sales-report.test.mjs`: totals, date boundaries, channel partitions, and empty data.

Download report exports the selected period's totals, daily values, and products;
the table's Export button exports only its matching, sorted product rows. The
snapshot remains fixed at September 10, 2026. Catalog edits do not alter these
historical demo orders.

## Messages

`/messages` provides a searchable demo inbox with unread, starred, and archived
views. Opening a conversation marks it read; toolbar controls change read/starred
state and archive or restore it. Mobile layouts show the inbox and thread separately.

- `data/messages.ts`: contacts, sample conversations, filtering, and stored-data validation.
- `components/messages/`: inbox, conversation view, compose dialog, and browser store.
- `tests/messages.test.mjs`: folder/search behavior and data/message validation.

Drafts, replies, new conversations, and organization changes persist under
`dabang-messages-v1` in local storage. Replies and new messages are saved locally
only; no email, messaging provider, or external delivery is connected. Stored changes
sync between tabs. Timestamps are shown in UTC.

## Development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
