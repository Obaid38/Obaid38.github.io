import Script from "next/script";

import type { LegacyLinkAttributes, LegacyPageData } from "@/lib/legacy-pages";

type LegacyPageProps = {
  page: LegacyPageData;
};

function renderLinkAttributes(attributes: LegacyLinkAttributes) {
  return {
    ...attributes,
    crossOrigin:
      attributes.crossOrigin === undefined ? undefined : attributes.crossOrigin,
  };
}

export function LegacyPage({ page }: LegacyPageProps) {
  const combinedScript = page.scripts.join("\n\n");

  return (
    <>
      {page.links.map((linkAttributes, index) => (
        <link
          key={`${page.key}-link-${index}`}
          {...renderLinkAttributes(linkAttributes)}
        />
      ))}

      {page.styles.map((style, index) => (
        <style
          dangerouslySetInnerHTML={{ __html: style }}
          key={`${page.key}-style-${index}`}
        />
      ))}

      {page.bodyStyleText ? (
        <style
          dangerouslySetInnerHTML={{ __html: `body { ${page.bodyStyleText} }` }}
          key={`${page.key}-body-style`}
        />
      ) : null}

      <div dangerouslySetInnerHTML={{ __html: page.bodyHtml }} />

      {combinedScript ? (
        <Script id={`${page.key}-legacy-scripts`} strategy="afterInteractive">
          {combinedScript}
        </Script>
      ) : null}
    </>
  );
}
