import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const Route = createFileRoute("/admin/articles")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: ArticlesRoute,
});

function ArticlesRoute() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname.replace(/\/+$/, "") || "/",
  });

  return pathname === "/admin/articles" ? <AdminDashboard /> : <Outlet />;
}
