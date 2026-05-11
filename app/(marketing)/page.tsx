import type { Metadata } from "next";

import { LegacyPage } from "@/components/legacy/legacy-page";
import { getLegacyPage } from "@/lib/legacy-pages";

export function generateMetadata(): Metadata {
  const page = getLegacyPage("home");

  return {
    title: page.title,
    description: page.description,
  };
}

export default function HomePage() {
  return <LegacyPage page={getLegacyPage("home")} />;
}
