import { createFileRoute } from "@tanstack/react-router";
import { currentAdmin, getCorsHeaders, verifyCsrf } from "@/server/admin-auth.server";
import { listPosts, savePost, type PostInput, type PostStatus } from "@/server/blog-db.server";

function postInput(value: unknown): PostInput | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if ([data.title, data.slug, data.excerpt, data.content].some((item) => typeof item !== "string")) {
    return null;
  }
  if (
    data.coverImage !== null &&
    data.coverImage !== undefined &&
    typeof data.coverImage !== "string"
  ) {
    return null;
  }
  const status: PostStatus = data.status === "published" ? "published" : "draft";
  const coverImage =
    typeof data.coverImage === "string" &&
    /^\/api\/uploads\/blog\/[a-f0-9-]+\.(jpg|jpeg|png|webp|gif)$/i.test(data.coverImage)
      ? data.coverImage
      : null;
  return {
    title: data.title as string,
    slug: data.slug as string,
    excerpt: data.excerpt as string,
    content: data.content as string,
    coverImage,
    status,
  };
}

export const Route = createFileRoute("/api/admin/posts")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        return new Response(null, {
          status: 204,
          headers: getCorsHeaders(request),
        });
      },
      GET: async ({ request }) => {
        const cors = getCorsHeaders(request);
        const admin = await currentAdmin(request);
        if (!admin) {
          return Response.json({ error: "Unauthorized" }, { status: 401, headers: cors });
        }
        const url = new URL(request.url);
        const statusValue = url.searchParams.get("status") || "all";
        const status = ["draft", "published", "all"].includes(statusValue)
          ? (statusValue as "draft" | "published" | "all")
          : "all";
        const res = await listPosts({
          status,
          query: url.searchParams.get("q") || "",
          page: Number(url.searchParams.get("page") || 1),
          pageSize: 10,
        });
        const headers = new Headers(cors);
        headers.set("Cache-Control", "no-store");
        return Response.json(res, { headers });
      },
      POST: async ({ request }) => {
        const cors = getCorsHeaders(request);
        if (!verifyCsrf(request)) {
          return Response.json({ error: "Invalid request" }, { status: 403, headers: cors });
        }
        const admin = await currentAdmin(request);
        if (!admin) {
          return Response.json({ error: "Unauthorized" }, { status: 401, headers: cors });
        }
        const input = postInput(await request.json().catch(() => null));
        if (!input) {
          return Response.json({ error: "Invalid post data" }, { status: 400, headers: cors });
        }
        try {
          const saved = await savePost(input);
          const headers = new Headers(cors);
          headers.set("Cache-Control", "no-store");
          return Response.json(saved, { status: 201, headers });
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
    },
  },
});
