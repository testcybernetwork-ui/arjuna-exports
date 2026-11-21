import { createFileRoute } from "@tanstack/react-router";
import { currentAdmin, getCorsHeaders, verifyCsrf } from "@/server/admin-auth.server";
import { findArticleById, updatePostStatus } from "@/server/blog-db.server";

export const Route = createFileRoute("/api/admin/articles/$id/status")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        return new Response(null, {
          status: 204,
          headers: getCorsHeaders(request),
        });
      },
      PATCH: async ({ request, params }) => {
        const cors = getCorsHeaders(request);
        if (!verifyCsrf(request)) {
          return Response.json({ error: "Invalid request" }, { status: 403, headers: cors });
        }
        const admin = await currentAdmin(request);
        if (!admin) {
          return Response.json({ error: "Unauthorized" }, { status: 401, headers: cors });
        }
        const article = await findArticleById(params.id);
        if (!article) {
          return Response.json({ error: "Article not found" }, { status: 404, headers: cors });
        }
        const body = (await request.json().catch(() => null)) as { status?: unknown } | null;
        if (body?.status !== "draft" && body?.status !== "published") {
          return Response.json({ error: "Invalid status" }, { status: 400, headers: cors });
        }
        const saved = await updatePostStatus(article.id, body.status);
        const headers = new Headers(cors);
        headers.set("Cache-Control", "no-store");
        return Response.json(saved, { headers });
      },
    },
  },
});
