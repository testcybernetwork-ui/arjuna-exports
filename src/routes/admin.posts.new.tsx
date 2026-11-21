import { createFileRoute } from "@tanstack/react-router";
import { AdminPostEditor } from "@/components/admin/AdminPostEditor";

export const Route = createFileRoute("/admin/posts/new")({ component: () => <AdminPostEditor /> });
