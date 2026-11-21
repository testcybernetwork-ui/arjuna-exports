import { createFileRoute } from "@tanstack/react-router";
import { currentAdmin, getCorsHeaders, verifyCsrf } from "@/server/admin-auth.server";
import { deleteArticle, findArticleById, savePost, type PostInput } from "@/server/blog-db.server";
import { parseArticleInput } from "@/lib/article-validation";

export const Route = createFileRoute("/api/admin/articles/$id")({
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
        const article = await findArticleById(params.id);
        const headers = new Headers(cors);
        headers.set("Cache-Control", "no-store");
        return article
          ? Response.json(article, { headers })
          : Response.json({ error: "Article not found" }, { status: 404, headers });
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
        const existing = await findArticleById(params.id);
        if (!existing) {
          return Response.json({ error: "Article not found" }, { status: 404, headers: cors });
        }
        const input = parseArticleInput(await request.json().catch(() => null));
        if (!input) {
          return Response.json(
            { error: "Check the required fields and their limits." },
            { status: 400, headers: cors },
          );
        }
        try {
          const saved = await savePost(input as PostInput, params.id);
          const headers = new Headers(cors);
          headers.set("Cache-Control", "no-store");
          return Response.json(saved, { headers });
        } catch (error) {
          const duplicate = error instanceof Error && error.message.includes("UNIQUE");
          const unavailable =
            error instanceof Error && error.message === "Database is not available";
          return Response.json(
            {
              error: duplicate
                ? "That slug is already in use."
                : error instanceof Error
                  ? error.message
                  : "Could not save article.",
            },
            { status: duplicate ? 409 : unavailable ? 500 : 400, headers: cors },
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
        const deleted = await deleteArticle(params.id);
        const headers = new Headers(cors);
        headers.set("Cache-Control", "no-store");
        return deleted
          ? Response.json({ ok: true }, { headers })
          : Response.json({ error: "Article not found" }, { status: 404, headers });
      },
    },
  },
});
