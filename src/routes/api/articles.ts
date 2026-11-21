import { createFileRoute } from "@tanstack/react-router";
import { listResourceArticles } from "@/server/blog-db.server";

export const Route = createFileRoute("/api/articles")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const result = await listResourceArticles({
          page: Number(url.searchParams.get("page") || 1),
          ...(url.searchParams.get("tag") ? { tag: url.searchParams.get("tag")! } : {}),
          ...(url.searchParams.get("q") ? { query: url.searchParams.get("q")! } : {}),
        });
        return Response.json(result, {
          headers: { "Cache-Control": "no-store" },
        });
      },
    },
  },
});
