import { createFileRoute } from "@tanstack/react-router";
import { currentAdmin, getCorsHeaders, verifyCsrf } from "@/server/admin-auth.server";
import {
  listAdminArticles,
  listArticleTags,
  savePost,
  type PostInput,
} from "@/server/blog-db.server";
import { parseArticleInput } from "@/lib/article-validation";

export const Route = createFileRoute("/api/admin/articles")({
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
        const status = url.searchParams.get("status") || "all";
        const articlesData = await listAdminArticles({
          status: ["draft", "published", "all"].includes(status)
            ? (status as "draft" | "published" | "all")
            : "all",
          query: url.searchParams.get("q") || "",
          ...(url.searchParams.get("tag") ? { tag: url.searchParams.get("tag")! } : {}),
          sort: url.searchParams.get("sort") === "title" ? "title" : "date",
          page: Number(url.searchParams.get("page") || 1),
        });
        const tags = await listArticleTags();

        const headers = new Headers(cors);
        headers.set("Cache-Control", "no-store");
        return Response.json(
          {
            ...articlesData,
            tags,
          },
          { headers },
        );
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
        const input = parseArticleInput(await request.json().catch(() => null));
        if (!input) {
          return Response.json(
            { error: "Check the required fields and their limits." },
            { status: 400, headers: cors },
          );
        }
        try {
          const saved = await savePost(input);
          const headers = new Headers(cors);
          headers.set("Cache-Control", "no-store");
          return Response.json(saved, {
            status: 201,
            headers,
          });
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
    },
  },
});
