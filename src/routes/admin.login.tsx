import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { hasAdminSession } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/login")({
  beforeLoad: async () => {
    if (await hasAdminSession()) throw redirect({ to: "/admin/dashboard" });
  },
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Admin sign in | Arjuna Exports" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [csrfReady, setCsrfReady] = useState(false);

  useEffect(() => {
    void fetch("/api/admin/csrf", { credentials: "same-origin", cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error();
        setCsrfReady(true);
      })
      .catch(() => setError("Sign in is temporarily unavailable."));
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const csrfResponse = await fetch("/api/admin/csrf", {
        credentials: "same-origin",
        cache: "no-store",
      });
      const { token } = (await csrfResponse.json()) as { token: string };
      const response = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": token },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Invalid credentials");
      if (data.token) {
        localStorage.setItem("arjuna_admin_token", data.token);
      }
      window.location.assign("/admin/dashboard");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Invalid credentials");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-brand-deep px-4 py-12">
      <section className="admin-login-card w-full max-w-md rounded-md bg-offwhite p-7 shadow-xl sm:p-10">
        <p className="micro-label text-brand">Arjuna Exports</p>
        <h1 className="display mt-4 text-3xl">Admin sign in</h1>
        <p className="mt-3 text-sm text-charcoal/65">Sign in to manage website articles.</p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <label className="block text-sm font-semibold">
            Email
            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded border border-charcoal/20 bg-white px-3 py-3 font-normal"
            />
          </label>
          <label className="block text-sm font-semibold">
            Password
            <div className="mt-2 flex rounded border border-charcoal/20 bg-white">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-w-0 flex-1 bg-transparent px-3 py-3 font-normal outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((shown) => !shown)}
                className="px-3 text-xs font-medium text-brand"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>
          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
          <button
            disabled={busy || !csrfReady}
            className="w-full rounded bg-brand px-4 py-3 font-semibold text-white disabled:opacity-50"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
