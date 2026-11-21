import { createFileRoute } from "@tanstack/react-router";
import { AdminPostEditor } from "@/components/admin/AdminPostEditor";

export const Route = createFileRoute("/admin/posts/$id/edit")({
  component: EditArticle,
});

function EditArticle() {
  const { id } = Route.useParams();
  return <AdminPostEditor postId={id} />;
}
