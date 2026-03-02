
import type { MetaDescriptor } from "react-router";

export function constructMetadata({
  title,
  description,
  noIndex = false,
  image = "/og.png",
  url = "https://pay.citatech.cloud"
}: {
  title: string;
  description: string;
  noIndex?: boolean;
  image?: string
  url?: string
}): MetaDescriptor[] {
  const fullImageUrl = image.startsWith("http") ? image : `${url}${image}`;

  return [
    {
      title: title ? `${title} | CITAPAY` : "CITAPAY",
    },
    { name: "description", content: description },
    { name: "viewport", content: "width=device-width, initial-scale=1" },

    // Open Graph
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: fullImageUrl },
    { property: "og:url", content: url },
    { property: "og:site_name", content: "CITAPAY" },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "en_KE" },

    // Twitter
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: fullImageUrl },
    { name: "twitter:creator", content: "@citapay" },

    ...(noIndex ? [{ name: "robots", content: "noindex, nofollow" }] : []),
  ];
}