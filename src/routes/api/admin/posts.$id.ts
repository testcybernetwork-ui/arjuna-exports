import { createFileRoute } from "@tanstack/react-router";
import { currentAdmin, getCorsHeaders, verifyCsrf } from "@/server/admin-auth.server";
import { deletePost, findPost, savePost, type PostInput } from "@/server/blog-db.server";

function isPostInput(value: unknown): value is PostInput {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  return (
    typeof data.title === "string" &&
    typeof data.slug === "string" &&
    typeof data.excerpt === "string" &&
    typeof data.content === "string" &&
    (data.coverImage === null || typeof data.coverImage === "string") &&
    (data.status === "draft" || data.status === "published")
  );
}

export const Route = createFileRoute("/api/admin/posts/$id")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        return new Response(null, {
          status: 204,
          headers: getCorsHeaders(request),
        });
      },
      GET: async ({ request, params }) => {
        const cors = getCorsHeaders(request);
        const admin = await currentAdmin(request);
        if (!admin) {
          return Response.json({ error: "Unauthorized" }, { status: 401, headers: cors });
        }
        const post = await findPost(params.id);
        const headers = new Headers(cors);
        headers.set("Cache-Control", "no-store");
        return post
          ? Response.json(post, { headers })
          : Response.json({ error: "Not found" }, { status: 404, headers });
      },
      PUT: async ({ request, params }) => {
        const cors = getCorsHeaders(request);
        if (!verifyCsrf(request)) {
          return Response.json({ error: "Invalid request" }, { status: 403, headers: cors });
        }
        const admin = await currentAdmin(request);
        if (!admin) {
          return Response.json({ error: "Unauthorized" }, { status: 401, headers: cors });
        }
        const existing = await findPost(params.id);
        if (!existing) {
          return Response.json({ error: "Not found" }, { status: 404, headers: cors });
        }
        const input = await request.json().catch(() => null);
        if (!isPostInput(input)) {
          return Response.json({ error: "Invalid post data" }, { status: 400, headers: cors });
        }
        try {
          const saved = await savePost(input, params.id);
          const headers = new Headers(cors);
          headers.set("Cache-Control", "no-store");
          return Response.json(saved, { headers });
        } catch (error) {
          return Response.json(
            {
              error:
                error instanceof Error && error.message.includes("UNIQUE")
                  ? "That slug is already in use."
                  : "Could not save the post.",
            },
            { status: 409, headers: cors },
          );
        }
      },
      DELETE: async ({ request, params }) => {
        const cors = getCorsHeaders(request);
        if (!verifyCsrf(request)) {
          return Response.json({ error: "Invalid request" }, { status: 403, headers: cors });
        }
        const admin = await currentAdmin(request);
        if (!admin) {
          return Response.json({ error: "Unauthorized" }, { status: 401, headers: cors });
        }
        const deleted = await deletePost(params.id);
        const headers = new Headers(cors);
        headers.set("Cache-Control", "no-store");
        return deleted
          ? Response.json({ ok: true }, { headers })
          : Response.json({ error: "Not found" }, { status: 404, headers });
      },
    },
  },
});
