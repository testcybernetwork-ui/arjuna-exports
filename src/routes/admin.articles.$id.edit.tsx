import { createFileRoute } from "@tanstack/react-router";
import { AdminPostEditor } from "@/components/admin/AdminPostEditor";

export const Route = createFileRoute("/admin/articles/$id/edit")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: EditArticle,
});

function EditArticle() {
  const { id } = Route.useParams();
  return <AdminPostEditor postId={id} />;
}
