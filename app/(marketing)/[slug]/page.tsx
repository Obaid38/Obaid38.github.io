import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { LegacyPage } from "@/components/legacy/legacy-page";
import { getLegacyPageBySlug, getLegacyStaticSlugs } from "@/lib/legacy-pages";

type LegacySlugPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getLegacyStaticSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: LegacySlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getLegacyPageBySlug(slug);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
  };
}

export default async function LegacySlugPage({ params }: LegacySlugPageProps) {
  const { slug } = await params;
  const page = getLegacyPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return <LegacyPage page={page} />;
}
