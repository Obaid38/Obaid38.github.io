import { readFileSync } from "node:fs";
import path from "node:path";

type LegacyCrossOrigin = "" | "anonymous" | "use-credentials";
type LegacyReferrerPolicy =
  | ""
  | "no-referrer"
  | "no-referrer-when-downgrade"
  | "origin"
  | "origin-when-cross-origin"
  | "same-origin"
  | "strict-origin"
  | "strict-origin-when-cross-origin"
  | "unsafe-url";

export type LegacyLinkAttributes = {
  id?: string;
  rel?: string;
  href?: string;
  crossOrigin?: LegacyCrossOrigin;
  as?: string;
  type?: string;
  media?: string;
  referrerPolicy?: LegacyReferrerPolicy;
};

export type LegacyPageData = {
  key: LegacyPageKey;
  title: string;
  description?: string;
  links: LegacyLinkAttributes[];
  styles: string[];
  scripts: string[];
  bodyHtml: string;
  bodyStyleText?: string;
};

const PROJECT_ROOT = process.cwd();
const legacyPageRegistry = {
  home: {
    fileName: "index.html",
    slug: null,
  },
  about: {
    fileName: "about.html",
    slug: "about",
  },
  contact: {
    fileName: "contact.html",
    slug: "contact",
  },
  rag: {
    fileName: "rag.html",
    slug: "rag",
  },
  customAI: {
    fileName: "customAI.html",
    slug: "custom-ai",
  },
  computerVision: {
    fileName: "computer-vision.html",
    slug: "computer-vision",
  },
  intelligentDocumentProcessing: {
    fileName: "intelligent-document-processing.html",
    slug: "intelligent-document-processing",
  },
} as const;
type LegacyPageKey = keyof typeof legacyPageRegistry;
type LegacyPageSlug = Exclude<
  (typeof legacyPageRegistry)[LegacyPageKey]["slug"],
  null
>;

function getRoutePath(pageKey: LegacyPageKey) {
  const slug = legacyPageRegistry[pageKey].slug;

  return slug ? `/${slug}` : "/";
}

function extractMatch(source: string, pattern: RegExp) {
  const match = source.match(pattern);
  return match?.[1]?.trim() ?? "";
}

function parseAttributes(rawTag: string) {
  const attributes: Record<string, string> = {};
  const attributePattern =
    /([:@A-Za-z0-9_-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;

  for (const match of rawTag.matchAll(attributePattern)) {
    const [, rawName, doubleQuoted, singleQuoted, bareValue] = match;
    const name = rawName.toLowerCase();
    const value = doubleQuoted ?? singleQuoted ?? bareValue ?? "";

    attributes[name] = value.replaceAll("&amp;", "&");
  }

  return attributes;
}

function normalizeCrossOrigin(value?: string): LegacyCrossOrigin | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === "" || value === "anonymous" || value === "use-credentials") {
    return value;
  }

  return undefined;
}

function normalizeReferrerPolicy(value?: string): LegacyReferrerPolicy | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (
    value === "" ||
    value === "no-referrer" ||
    value === "no-referrer-when-downgrade" ||
    value === "origin" ||
    value === "origin-when-cross-origin" ||
    value === "same-origin" ||
    value === "strict-origin" ||
    value === "strict-origin-when-cross-origin" ||
    value === "unsafe-url"
  ) {
    return value;
  }

  return undefined;
}

function toLinkAttributes(rawAttributes: Record<string, string>): LegacyLinkAttributes {
  return {
    id: rawAttributes.id,
    rel: rawAttributes.rel,
    href: rawAttributes.href,
    crossOrigin: normalizeCrossOrigin(
      Object.prototype.hasOwnProperty.call(rawAttributes, "crossorigin")
        ? rawAttributes.crossorigin
        : undefined,
    ),
    as: rawAttributes.as,
    type: rawAttributes.type,
    media: rawAttributes.media,
    referrerPolicy: normalizeReferrerPolicy(rawAttributes.referrerpolicy),
  };
}

function parseLinkTags(source: string) {
  return Array.from(source.matchAll(/<link\b([^>]*)>/gi), (match) => {
    return toLinkAttributes(parseAttributes(match[1]));
  });
}

function extractStyleBlocks(source: string) {
  return Array.from(source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi), (match) => {
    return match[1];
  });
}

function extractScriptBlocks(source: string) {
  return Array.from(source.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi), (match) => {
    return match[1];
  }).filter((script) => script.trim().length > 0);
}

function resolveLegacyHref(
  currentPageKey: LegacyPageKey,
  targetPageKey: LegacyPageKey,
  hash?: string,
) {
  const routePath = getRoutePath(targetPageKey);

  if (currentPageKey === targetPageKey && hash) {
    return hash;
  }

  if (routePath === "/") {
    return hash ? `/${hash}` : "/";
  }

  return `${routePath}${hash ?? ""}`;
}

function rewriteLegacyMarkup(source: string, pageKey: LegacyPageKey) {
  let rewritten = source.replace(/(\b(?:src|href)=["'])uploads\//gi, "$1/uploads/");

  for (const [targetPageKey, page] of Object.entries(legacyPageRegistry) as Array<
    [LegacyPageKey, (typeof legacyPageRegistry)[LegacyPageKey]]
  >) {
    const filePattern = page.fileName.replace(".", "\\.");
    const expression = new RegExp(
      `(\\bhref=["'])${filePattern}(#[^"']*)?(["'])`,
      "gi",
    );

    rewritten = rewritten.replace(expression, (_, prefix, hash, suffix) => {
      return `${prefix}${resolveLegacyHref(pageKey, targetPageKey, hash)}${suffix}`;
    });
  }

  return rewritten;
}

function loadLegacyPage(fileName: string, pageKey: LegacyPageKey) {
  const filePath = path.join(PROJECT_ROOT, fileName);
  const html = readFileSync(filePath, "utf8");
  const bodyAttributes = extractMatch(html, /<body([^>]*)>/i);
  const bodyStyle = parseAttributes(bodyAttributes).style ?? "";
  const rawBody = extractMatch(html, /<body[^>]*>([\s\S]*?)<\/body>/i);
  const strippedBody = rawBody
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");

  return {
    key: pageKey,
    title: extractMatch(html, /<title>([\s\S]*?)<\/title>/i),
    description: extractMatch(
      html,
      /<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["'][^>]*>/i,
    ),
    links: parseLinkTags(html),
    styles: extractStyleBlocks(html),
    scripts: extractScriptBlocks(html),
    bodyHtml: rewriteLegacyMarkup(strippedBody, pageKey),
    bodyStyleText: bodyStyle.trim() || undefined,
  } satisfies LegacyPageData;
}

export function getLegacyPage(pageKey: LegacyPageKey) {
  return loadLegacyPage(legacyPageRegistry[pageKey].fileName, pageKey);
}

export function getLegacyPageBySlug(slug: string) {
  const entry = Object.entries(legacyPageRegistry).find(([, page]) => {
    return page.slug === slug || page.fileName === slug;
  });

  if (!entry) {
    return null;
  }

  return getLegacyPage(entry[0] as LegacyPageKey);
}

export function getLegacyStaticSlugs(): LegacyPageSlug[] {
  return Object.values(legacyPageRegistry)
    .map((page) => page.slug)
    .filter((slug): slug is LegacyPageSlug => slug !== null);
}
