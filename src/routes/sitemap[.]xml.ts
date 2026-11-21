import { createFileRoute } from "@tanstack/react-router";
import { listResourceArticles } from "@/server/blog-db.server";

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
        const firstPage = await listResourceArticles({ page: 1 });
        const pages = await Promise.all(
          Array.from({ length: firstPage.pageCount }, (_, index) =>
            listResourceArticles({ page: index + 1 }),
          ),
        );
        const articleUrls = pages
          .map((p) => p.articles)
          .flat()
          .flatMap((article) => [
            { path: `/resources/articles/${article.slug}`, date: article.updatedAt },
            {
              path: `/resources/${article.legacySlug ?? article.slug}`,
              date: article.updatedAt,
            },
          ]);
        const urls = [
          ...publicPages.map((path) => ({ path, date: new Date().toISOString() })),
          ...articleUrls,
        ];
        const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(({ path, date }) => `<url><loc>${xml(`${origin}${path}`)}</loc><lastmod>${xml(date.slice(0, 10))}</lastmod></url>`).join("")}</urlset>`;
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
