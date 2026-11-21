export async function adminRequest(input: RequestInfo | URL, init: RequestInit = {}) {
  const method = (init.method || "GET").toUpperCase();
  const headers = new Headers(init.headers);
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("arjuna_admin_token");
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }
  if (method !== "GET" && method !== "HEAD") {
    const csrf = await fetch("/api/admin/csrf", { credentials: "same-origin", cache: "no-store" });
    const { token } = (await csrf.json()) as { token: string };
    headers.set("X-CSRF-Token", token);
  }
  const response = await fetch(input, {
    ...init,
    headers,
    credentials: "same-origin",
    cache: "no-store",
  });
  if (
    response.status === 401 &&
    window.location.pathname.startsWith("/admin/") &&
    window.location.pathname !== "/admin/login"
  ) {
    window.location.assign("/admin/login");
  }
  return response;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
