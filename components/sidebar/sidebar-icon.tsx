import type { ReactNode } from "react";
import type { NavigationIconName } from "@/config/navigation";

type IconName = NavigationIconName | "brand" | "sign-out";

export function SidebarIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    brand: <><path d="m10 4-3 3a3 3 0 0 0 0 4l4 4a2 2 0 0 0 3-3L10 8" /><path d="m14 20 3-3a3 3 0 0 0 0-4l-4-4a2 2 0 0 0-3 3l4 4" /></>,
    dashboard: <><path d="M10 3a9 9 0 1 0 11 11H10Z" fill="currentColor" stroke="none" /><path d="M13 2v9h9a9 9 0 0 0-9-9" fill="currentColor" stroke="none" opacity=".55" /></>,
    leaderboard: <path d="M4 21V11M12 21V3M20 21v-7" />,
    orders: <><path d="M2 3h3l3 12h11l3-9H6M8 15l-1 3h12" /><circle cx="9" cy="21" r="1.5" /><circle cx="19" cy="21" r="1.5" /></>,
    products: <><rect x="4" y="6" width="16" height="16" rx="1" /><path d="M8 7V5a4 4 0 0 1 8 0v2M8 11a4 4 0 0 0 8 0" /></>,
    reports: <path d="M3 4v16h19M4 14l6-6 5 4 7-7" />,
    messages: <><path d="M3 3h19v15H8l-5 4Z" /><path d="M7 10h.01M12 10h.01M17 10h.01" strokeWidth="2.5" /></>,
    settings: <><path d="m9 3 1-2h4l1 3 2 1 3-1 2 4-2 2v3l2 2-2 4-3-1-2 1-1 3h-4l-1-3-2-1-3 1-2-4 2-2v-3L2 8l2-4 3 1Z" /><circle cx="12" cy="11.5" r="3.5" /></>,
    "sign-out": <path d="M10 5V3H4v18h6v-3M8 12h12m-4-4 4 4-4 4" />,
  };
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
