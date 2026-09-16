import type { Metadata } from "next";
import { SalesReportPage } from "@/components/sales-report/sales-report-page";
export const metadata: Metadata = { title: "Sales Report | Dabang" };
export default function Page() { return <SalesReportPage />; }
