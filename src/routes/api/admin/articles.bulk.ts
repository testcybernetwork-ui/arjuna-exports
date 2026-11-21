import { createFileRoute } from "@tanstack/react-router";
import { currentAdmin, getCorsHeaders, verifyCsrf } from "@/server/admin-auth.server";
import { deleteArticle, findArticleById, updatePostStatus } from "@/server/blog-db.server";

export const Route = createFileRoute("/api/admin/articles/bulk")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        return new Response(null, {
          status: 204,
          headers: getCorsHeaders(request),
        });
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
        const body = (await request.json().catch(() => null)) as {
          ids?: unknown;
          action?: unknown;
        } | null;
        if (
          !Array.isArray(body?.ids) ||
          body.ids.length > 100 ||
          body.ids.some((id) => typeof id !== "string") ||
          !["delete", "published", "draft"].includes(String(body.action))
        ) {
          return Response.json({ error: "Invalid bulk action" }, { status: 400, headers: cors });
        }
        for (const id of body.ids as string[]) {
          const article = await findArticleById(id);
          if (!article) continue;
          if (body.action === "delete") {
            await deleteArticle(id);
          } else {
            await updatePostStatus(id, body.action as "published" | "draft");
          }
        }
        const headers = new Headers(cors);
        headers.set("Cache-Control", "no-store");
        return Response.json({ ok: true }, { headers });
      },
    },
  },
});
