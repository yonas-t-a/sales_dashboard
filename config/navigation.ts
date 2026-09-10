export const navigationItems = [
  { label: "Dashboard", href: "/", icon: "dashboard" },
  { label: "Leaderboard", href: "/leaderboard", icon: "leaderboard" },
  { label: "Orders", href: "/orders", icon: "orders" },
  { label: "Products", href: "/products", icon: "products" },
  { label: "Sales Report", href: "/sales-report", icon: "reports" },
  { label: "Messages", href: "/messages", icon: "messages" },
  { label: "Settings", href: "/settings", icon: "settings" },
] as const;

export type NavigationIconName = (typeof navigationItems)[number]["icon"];
