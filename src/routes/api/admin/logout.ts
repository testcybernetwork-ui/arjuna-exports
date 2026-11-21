import { createFileRoute } from "@tanstack/react-router";
import {
  clearCsrfCookie,
  clearSessionCookie,
  currentAdmin,
  destroySession,
  getCorsHeaders,
  verifyCsrf,
} from "@/server/admin-auth.server";

export const Route = createFileRoute("/api/admin/logout")({
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
        await destroySession(request);
        const headers = new Headers(cors);
        headers.set("Cache-Control", "no-store");
        headers.append("Set-Cookie", clearSessionCookie());
        headers.append("Set-Cookie", clearCsrfCookie());
        return Response.json({ ok: true }, { headers });
      },
    },
  },
});
