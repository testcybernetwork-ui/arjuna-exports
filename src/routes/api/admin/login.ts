import { createFileRoute } from "@tanstack/react-router";
import {
  authenticateCredentials,
  clearLoginFailures,
  createAdminToken,
  createSessionCookie,
  getCorsHeaders,
  loginIsRateLimited,
  recordFailedLogin,
} from "@/server/admin-auth.server";

export const Route = createFileRoute("/api/admin/login")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        return new Response(null, {
          status: 204,
          headers: getCorsHeaders(request),
        });
      },
      POST: async ({ request }) => {
        const corsHeaders = getCorsHeaders(request);

        try {
          const ip =
            request.headers.get("cf-connecting-ip") ||
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            "unknown";

          if (await loginIsRateLimited(ip)) {
            return Response.json(
              { error: "Too many sign-in attempts. Try again in 15 minutes." },
              { status: 429, headers: corsHeaders },
            );
          }

          let body: unknown;
          try {
            body = await request.json();
          } catch {
            console.warn("[admin-login] Rejected login: invalid JSON");
            return Response.json(
              { error: "Invalid request body." },
              { status: 400, headers: corsHeaders },
            );
          }

          if (!body || typeof body !== "object") {
            console.warn("[admin-login] Rejected login: body is not an object");
            return Response.json(
              { error: "Missing required fields." },
              { status: 400, headers: corsHeaders },
            );
          }

          const values = body as Record<string, unknown>;
          if (
            typeof values.email !== "string" ||
            typeof values.password !== "string"
          ) {
            console.warn("[admin-login] Rejected login: email or password missing or not a string");
            return Response.json(
              { error: "Email and password are required." },
              { status: 400, headers: corsHeaders },
            );
          }

          const email = values.email.trim().toLowerCase().slice(0, 254);
          const password = values.password.trim();

          if (!email || !password) {
            console.warn("[admin-login] Rejected login: empty email or password");
            return Response.json(
              { error: "Email and password are required." },
              { status: 400, headers: corsHeaders },
            );
          }

          // Authenticate in Neon database using bcrypt
          const result = await authenticateCredentials(email, password);

          if (!result.user) {
            await recordFailedLogin(ip);
            // Log specific reason server-side only, never logging passwords
            console.warn("[admin-login] Authentication failed:", {
              reason: result.reason,
              email,
            });
            return Response.json(
              { error: "Invalid credentials" },
              { status: 401, headers: corsHeaders },
            );
          }

          await clearLoginFailures(ip);

          // Generate signed JWT token
          const token = createAdminToken(result.user);
          const cookieHeader = createSessionCookie(token);

          console.info("[admin-login] Admin authenticated successfully:", {
            email: result.user.email,
            id: result.user.id,
          });

          const responseHeaders = new Headers(corsHeaders);
          responseHeaders.append("Set-Cookie", cookieHeader);
          responseHeaders.set("Cache-Control", "no-store");

          return Response.json(
            {
              ok: true,
              token,
              admin: {
                id: result.user.id,
                email: result.user.email,
              },
            },
            {
              status: 200,
              headers: responseHeaders,
            },
          );
        } catch (error) {
          console.error("[admin-login] Internal authentication error:", error);
          return Response.json(
            { error: "Sign-in is temporarily unavailable. Please try again later." },
            { status: 500, headers: corsHeaders },
          );
        }
      },
    },
  },
});
