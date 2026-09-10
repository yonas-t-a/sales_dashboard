import { notFound } from "next/navigation";
import { navigationItems } from "@/config/navigation";

const pages = [
  ...navigationItems.filter((item) => item.href !== "/" && item.href !== "/leaderboard").map((item) => ({ slug: item.href.slice(1), title: item.label, description: "Your page content goes here." })),
  { slug: "upgrade", title: "Dabang Pro", description: "Connect your upgrade flow here." },
  { slug: "sign-out", title: "Sign Out", description: "Connect your authentication provider here to enable sign out." },
];

export function generateStaticParams() {
  return pages.map(({ slug }) => ({ section: slug }));
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const page = pages.find(({ slug }) => slug === section);
  if (!page) notFound();
  return (
    <main id="main-content" className="workspace">
      <h1>{page.title}</h1>
      <p>{page.description}</p>
    </main>
  );
}
