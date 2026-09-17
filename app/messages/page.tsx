import type { Metadata } from "next";
import { MessagesPage } from "@/components/messages/messages-page";
export const metadata: Metadata = { title: "Messages | Dabang" };
export default function Page() { return <MessagesPage />; }
