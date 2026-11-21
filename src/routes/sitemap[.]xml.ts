import { createFileRoute } from "@tanstack/react-router";
import { resourceArticles } from "@/lib/resource-data";

const publicPages = [
  "/",
  "/our-story",
  "/products",
  "/applications",
  "/process",
  "/gallery",
  "/resources",
  "/sustainability",
  "/contact",
];
const xml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const origin = (process.env["SITE_URL"] || "https://www.arjunaexports.com").replace(
          /\/$/,
          "",
        );
        const urls = [
          ...publicPages,
          ...resourceArticles.map((article) => `/resources/${article.slug}`),
        ];
        const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((path) => `<url><loc>${xml(`${origin}${path}`)}</loc></url>`).join("")}</urlset>`;
        return new Response(body, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=300",
          },
        });
      },
    },
  },
});
