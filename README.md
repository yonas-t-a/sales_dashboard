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

## Run locally

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
