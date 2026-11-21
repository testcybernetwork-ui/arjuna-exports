import { createFileRoute } from "@tanstack/react-router";
import { listPublishedPosts } from "@/server/blog-db.server";

export const Route = createFileRoute("/api/posts")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const page = Number(url.searchParams.get("page") || 1);
        const pageSize = Number(url.searchParams.get("pageSize") || 12);
        const result = await listPublishedPosts(page, pageSize);
        return Response.json(result, {
          headers: { "Cache-Control": "public, max-age=60" },
        });
      },
    },
  },
});
