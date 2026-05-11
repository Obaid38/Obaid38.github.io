const LOCAL_FALLBACK_URL = "http://localhost:3000";

function normalizeUrl(value: string) {
  if (!value.startsWith("http://") && !value.startsWith("https://")) {
    return `https://${value}`;
  }

  return value;
}

export const siteConfig = {
  name: "Quantafyre",
  siteUrl: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL?.trim() || LOCAL_FALLBACK_URL),
  iconPath: "/uploads/logo-flame.png",
};
