import { createFileRoute } from "@tanstack/react-router";
import { createCsrfToken, csrfCookie, getCorsHeaders } from "@/server/admin-auth.server";

export const Route = createFileRoute("/api/admin/csrf")({
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
        const token = createCsrfToken();
        const headers = new Headers(cors);
        headers.set("Cache-Control", "no-store");
        headers.append("Set-Cookie", csrfCookie(token));
        return Response.json({ token }, { headers });
      },
    },
  },
});
