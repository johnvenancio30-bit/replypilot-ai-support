import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return ["", "/demo", "/dashboard", "/case-study"].map((path, index) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: index ? "monthly" : "weekly", priority: index ? 0.8 : 1 }));
}
