import { createFileRoute } from "@tanstack/react-router";
import { findPublishedPost } from "@/server/blog-db.server";

export const Route = createFileRoute("/api/posts/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const post = await findPublishedPost(params.slug);
        return post
          ? Response.json(post, { headers: { "Cache-Control": "public, max-age=60" } })
          : Response.json({ error: "Post not found" }, { status: 404 });
      },
    },
  },
});
