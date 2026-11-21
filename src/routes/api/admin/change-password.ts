import { createFileRoute } from "@tanstack/react-router";
import {
  changeAdminPassword,
  clearCsrfCookie,
  clearSessionCookie,
  createSession,
  currentAdmin,
  getCorsHeaders,
  verifyCsrf,
} from "@/server/admin-auth.server";

export const Route = createFileRoute("/api/admin/change-password")({
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
          currentPassword?: unknown;
          newPassword?: unknown;
        } | null;
        const currentPassword =
          typeof body?.currentPassword === "string" ? body.currentPassword.trim() : "";
        const newPassword = typeof body?.newPassword === "string" ? body.newPassword.trim() : "";
        if (!currentPassword || newPassword.length < 10 || newPassword.length > 1024) {
          return Response.json(
            { error: "Use a new password between 10 and 1024 characters." },
            { status: 400, headers: cors },
          );
        }
        const success = await changeAdminPassword(admin.id, currentPassword, newPassword);
        if (!success) {
          return Response.json({ error: "Current password is incorrect." }, { status: 401, headers: cors });
        }
        const session = createSession(admin.id);
        const headers = new Headers(cors);
        headers.set("Cache-Control", "no-store");
        headers.append("Set-Cookie", clearSessionCookie());
        headers.append("Set-Cookie", clearCsrfCookie());
        headers.append("Set-Cookie", session.cookie);
        return Response.json({ ok: true, token: session.token }, { headers });
      },
    },
  },
});
