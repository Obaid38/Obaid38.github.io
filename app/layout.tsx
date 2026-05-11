import type { Metadata } from "next";
import type { ReactNode } from "react";

import { siteConfig } from "@/config/site";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  applicationName: siteConfig.name,
  icons: {
    icon: siteConfig.iconPath,
    shortcut: siteConfig.iconPath,
    apple: siteConfig.iconPath,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
