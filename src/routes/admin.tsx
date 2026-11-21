import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { hasAdminSession } from "@/lib/admin-data";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/login") return;
    if (!(await hasAdminSession())) throw redirect({ to: "/admin/login" });
    if (location.pathname === "/admin") throw redirect({ to: "/admin/dashboard" });
  },
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <Outlet />
    </>
  );
}
