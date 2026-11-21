import { createFileRoute } from "@tanstack/react-router";
import { AdminPostEditor } from "@/components/admin/AdminPostEditor";

export const Route = createFileRoute("/admin/articles/new")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: () => <AdminPostEditor />,
});
