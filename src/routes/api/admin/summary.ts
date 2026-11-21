import { createFileRoute } from "@tanstack/react-router";
import { currentAdmin, getCorsHeaders } from "@/server/admin-auth.server";
import { getAdminArticleSummary } from "@/server/blog-db.server";

export const Route = createFileRoute("/api/admin/summary")({
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
        const summary = await getAdminArticleSummary();
        return Response.json(
          {
            admin,
            ...summary,
            recent: Array.isArray(summary.recent)
              ? summary.recent
              : Array.isArray(summary.articles)
                ? summary.articles
                : [],
          },
          {
            headers: { ...Object.fromEntries(cors.entries()), "Cache-Control": "no-store" },
          },
        );
      },
    },
  },
});
