import { createFileRoute } from "@tanstack/react-router";
import { findResourceArticle } from "@/server/blog-db.server";

export const Route = createFileRoute("/api/articles/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const article = await findResourceArticle(params.slug);
        return article
          ? Response.json(article, { headers: { "Cache-Control": "no-store" } })
          : Response.json({ error: "Article not found" }, { status: 404 });
      },
    },
  },
});
