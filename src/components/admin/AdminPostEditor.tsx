import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Node as TiptapNode } from "@tiptap/core";
import { Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { adminRequest, slugify } from "@/lib/admin-api";
import { toast } from "sonner";
import type { Editor } from "@tiptap/react";

type EditablePost = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  status: "draft" | "published";
  tag: string;
  contentType: string;
  imageAlt: string;
  publishedAt: string;
  readTime: string;
  metaTitle: string;
  metaDescription: string;
};

const today = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
};

const initialPost: EditablePost = {
  title: "",
  slug: "",
  excerpt: "",
  content: "<p></p>",
  coverImage: null,
  status: "draft",
  tag: "COCO COIR \u2014 PRODUCT INSIGHTS",
  contentType: "Resource guide",
  imageAlt: "",
  publishedAt: today(),
  readTime: "",
  metaTitle: "",
  metaDescription: "",
};

function LayoutImage() {
  return Image.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        width: {
          default: "100%",
          parseHTML: (element) => element.getAttribute("width") || "100%",
          renderHTML: (attrs) => ({ width: attrs["width"] }),
        },
        alignment: {
          default: "center",
          parseHTML: (element) => element.getAttribute("data-align") || "center",
          renderHTML: (attrs) => ({ "data-align": attrs["alignment"] }),
        },
      };
    },
  }).configure({ inline: false, allowBase64: false });
}

const ArticleTable = TiptapNode.create({
  name: "articleTable",
  group: "block",
  content: "articleTableRow+",
  parseHTML: () => [{ tag: "table" }],
  renderHTML: ({ HTMLAttributes }) => ["table", HTMLAttributes, 0],
});
const ArticleTableRow = TiptapNode.create({
  name: "articleTableRow",
  content: "articleTableCell+",
  parseHTML: () => [{ tag: "tr" }],
  renderHTML: ({ HTMLAttributes }) => ["tr", HTMLAttributes, 0],
});
const ArticleTableCell = TiptapNode.create({
  name: "articleTableCell",
  content: "block+",
  isolating: true,
  addAttributes: () => ({
    header: { default: false, parseHTML: (element) => element.tagName.toLowerCase() === "th" },
  }),
  parseHTML: () => [{ tag: "td" }, { tag: "th" }],
  renderHTML: ({ node, HTMLAttributes }) => [node.attrs["header"] ? "th" : "td", HTMLAttributes, 0],
});

export function AdminPostEditor({ postId }: { postId?: string }) {
  const navigate = useNavigate();
  const [post, setPost] = useState<EditablePost>(initialPost);
  const [loaded, setLoaded] = useState(!postId);
  const [slugEdited, setSlugEdited] = useState(false);
  const readTimeEdited = useRef(false);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const snapshot = useRef("");
  const contentRef = useRef(post.content);
  const editorRef = useRef<Editor | null>(null);

  const update = useCallback((changes: Partial<EditablePost>) => {
    setPost((current) => {
      const next = { ...current, ...changes };
      snapshot.current = JSON.stringify(next);
      return next;
    });
    setDirty(true);
    setMessage("Unsaved changes");
  }, []);

  const insertUploadedImage = useCallback(async (file: File, position?: number) => {
    const form = new FormData();
    form.set("file", file);
    const response = await adminRequest("/api/admin/upload", { method: "POST", body: form });
    const result = (await response.json()) as { url?: string; error?: string };
    if (!response.ok || !result.url) throw new Error(result.error || "Image upload failed.");
    const alt = window.prompt("Image alt text", file.name.replace(/\.[^.]+$/, "")) || "";
    const caption = window.prompt("Optional image caption") || "";
    const chain = editorRef.current?.chain().focus();
    if (position !== undefined)
      chain
        ?.insertContentAt(position, {
          type: "image",
          attrs: { src: result.url, alt, title: caption, width: "100%", alignment: "center" },
        })
        .run();
    else
      chain
        ?.insertContent({
          type: "image",
          attrs: { src: result.url, alt, title: caption, width: "100%", alignment: "center" },
        })
        .run();
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      LinkExtension.configure({ openOnClick: false, autolink: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      LayoutImage(),
      ArticleTable,
      ArticleTableRow,
      ArticleTableCell,
    ],
    content: post.content,
    onUpdate: ({ editor: activeEditor }) => {
      const content = activeEditor.getHTML();
      contentRef.current = content;
      const words = content
        .replace(/<[^>]*>/g, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;
      update({
        content,
        ...(!readTimeEdited.current
          ? { readTime: `${Math.max(1, Math.ceil(words / 200))} min read` }
          : {}),
      });
    },
    editorProps: {
      handlePaste: (_view, event) => {
        const file = Array.from(event.clipboardData?.files || []).find((item) =>
          item.type.startsWith("image/"),
        );
        if (!file) return false;
        void insertUploadedImage(file).catch((error: Error) => setMessage(error.message));
        return true;
      },
      handleDrop: (view, event) => {
        const file = Array.from(event.dataTransfer?.files || []).find((item) =>
          item.type.startsWith("image/"),
        );
        if (!file) return false;
        const position = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
        void insertUploadedImage(file, position).catch((error: Error) => setMessage(error.message));
        return true;
      },
      attributes: { class: "admin-rich-editor prose max-w-none focus:outline-none" },
    },
  });
  editorRef.current = editor;

  useEffect(() => {
    if (!postId) return;
    void adminRequest(`/api/admin/articles/${encodeURIComponent(postId)}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load this post.");
        const result = (await response.json()) as EditablePost;
        setPost(result);
        contentRef.current = result.content;
        snapshot.current = JSON.stringify(result);
        editor?.commands.setContent(result.content || "<p></p>");
        setDirty(false);
        setLoaded(true);
      })
      .catch((error: Error) => {
        setMessage(error.message);
        setLoaded(true);
      });
  }, [postId, editor]);

  const save = useCallback(
    async (status: "draft" | "published", autosave = false) => {
      if (
        !post.title.trim() ||
        !post.slug.trim() ||
        !post.excerpt.trim() ||
        !post.coverImage ||
        !post.imageAlt.trim()
      ) {
        if (!autosave)
          setMessage(
            "Complete the title, excerpt, featured image and image alt text before saving.",
          );
        return;
      }
      const current = { ...post, content: contentRef.current, status };
      setBusy(true);
      try {
        const response = await adminRequest(
          post.id ? `/api/admin/articles/${encodeURIComponent(post.id)}` : "/api/admin/articles",
          {
            method: post.id ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(current),
          },
        );
        const result = (await response.json()) as EditablePost & { error?: string };
        if (!response.ok) throw new Error(result.error || "Could not save the post.");
        setPost((previous) => ({ ...previous, ...(result.id ? { id: result.id } : {}), status }));
        const afterSave = { ...current, id: result.id, status };
        if (snapshot.current === JSON.stringify({ ...current, status: post.status })) {
          snapshot.current = JSON.stringify(afterSave);
          setDirty(false);
        }
        setMessage(
          autosave ? "Draft autosaved" : status === "published" ? "Published" : "Draft saved",
        );
        if (!autosave) toast.success(status === "published" ? "Article published" : "Draft saved");
        if (!post.id)
          await navigate({ to: "/admin/articles/$id/edit", params: { id: result.id! } });
        else if (status === "published") await navigate({ to: "/admin/articles" });
      } catch (error) {
        const description = error instanceof Error ? error.message : "Could not save the article.";
        setMessage(description);
        if (!autosave) toast.error("Could not save article", { description });
      } finally {
        setBusy(false);
      }
    },
    [navigate, post],
  );

  useEffect(() => {
    if (!dirty) return;
    const timer = window.setTimeout(() => void save("draft", true), 30_000);
    return () => window.clearTimeout(timer);
  }, [dirty, post, save]);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    const guardLinks = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]") as HTMLAnchorElement | null;
      if (
        dirty &&
        anchor &&
        anchor.origin === window.location.origin &&
        !window.confirm("You have unsaved changes. Leave this page?")
      )
        event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    document.addEventListener("click", guardLinks, true);
    return () => {
      window.removeEventListener("beforeunload", warn);
      document.removeEventListener("click", guardLinks, true);
    };
  }, [dirty]);

  async function uploadCover(file?: File) {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) throw new Error("Featured images must be 2 MB or smaller.");
    const form = new FormData();
    form.set("file", file);
    const response = await adminRequest("/api/admin/upload", { method: "POST", body: form });
    const result = (await response.json()) as { url?: string; error?: string };
    if (!response.ok || !result.url) throw new Error(result.error || "Image upload failed.");
    update({ coverImage: result.url });
  }

  const action = (label: string, run: () => void, active = false) => (
    <button
      key={label}
      type="button"
      title={label}
      onClick={run}
      className={`rounded border px-2 py-1 text-sm ${active ? "bg-brand text-white" : "bg-white text-brand hover:bg-brand-soft"}`}
    >
      {label}
    </button>
  );

  if (!loaded) return <p className="py-12 text-center">Loading post…</p>;
  return (
    <main className="min-h-screen bg-offwhite px-4 pb-20 pt-24 text-body-text">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link to="/admin/articles" className="text-sm text-brand">
              ← Dashboard
            </Link>
            <h1 className="display mt-3 text-3xl">{postId ? "Edit article" : "New article"}</h1>
          </div>
          <span role="status" className="text-sm text-charcoal/70">
            {busy ? "Saving…" : message}
          </span>
        </div>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <section className="space-y-5 rounded-md border border-charcoal/15 bg-white p-5 sm:p-8">
            <label className="block text-sm font-semibold">
              Title
              <input
                value={post.title}
                required
                onChange={(event) =>
                  update({
                    title: event.target.value,
                    ...(!slugEdited ? { slug: slugify(event.target.value) } : {}),
                    ...(!post.metaTitle ? { metaTitle: event.target.value.slice(0, 60) } : {}),
                  })
                }
                className="mt-2 w-full rounded border border-charcoal/20 px-3 py-3 text-lg"
                maxLength={120}
              />
            </label>
            <label className="block text-sm font-semibold">
              Slug
              <div className="mt-2 flex items-center rounded border border-charcoal/20">
                <input
                  value={post.slug}
                  required
                  onChange={(event) => {
                    setSlugEdited(true);
                    update({ slug: slugify(event.target.value) });
                  }}
                  className="min-w-0 flex-1 px-2 py-3"
                />
              </div>
            </label>
            <label className="block text-sm font-semibold">
              Excerpt
              <textarea
                value={post.excerpt}
                required
                onChange={(event) => update({ excerpt: event.target.value })}
                className="mt-2 min-h-24 w-full rounded border border-charcoal/20 px-3 py-3"
                maxLength={250}
              />
              <span className="mt-1 block text-right text-xs font-normal text-charcoal/55">
                {post.excerpt.length}/250
              </span>
            </label>
            <label className="block text-sm font-semibold">
              Tag / category
              <input
                list="article-tags"
                value={post.tag}
                onChange={(event) => update({ tag: event.target.value })}
                maxLength={120}
                required
                className="mt-2 w-full rounded border border-charcoal/20 px-3 py-3 font-normal"
              />
              <datalist id="article-tags">
                <option value="COCO COIR — PRODUCT INSIGHTS" />
                <option value="COCO COIR — GROWING GUIDE" />
              </datalist>
            </label>
            <label className="block text-sm font-semibold">
              Content type
              <select
                value={post.contentType}
                onChange={(event) => update({ contentType: event.target.value })}
                className="mt-2 w-full rounded border border-charcoal/20 px-3 py-3 font-normal"
              >
                <option>Resource guide</option>
                <option>Comparison</option>
                <option>Technical note</option>
                <option>Case study</option>
              </select>
            </label>
            <div>
              <div className="mb-2 flex flex-wrap gap-1 border border-charcoal/15 bg-ivory p-2">
                {editor && (
                  <>
                    {action(
                      "H1",
                      () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
                      editor.isActive("heading", { level: 1 }),
                    )}
                    {action(
                      "H2",
                      () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
                      editor.isActive("heading", { level: 2 }),
                    )}
                    {action(
                      "H3",
                      () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
                      editor.isActive("heading", { level: 3 }),
                    )}
                    {action(
                      "B",
                      () => editor.chain().focus().toggleBold().run(),
                      editor.isActive("bold"),
                    )}
                    {action(
                      "I",
                      () => editor.chain().focus().toggleItalic().run(),
                      editor.isActive("italic"),
                    )}
                    {action(
                      "U",
                      () => editor.chain().focus().toggleUnderline().run(),
                      editor.isActive("underline"),
                    )}
                    {action(
                      "S",
                      () => editor.chain().focus().toggleStrike().run(),
                      editor.isActive("strike"),
                    )}
                    {action("• List", () => editor.chain().focus().toggleBulletList().run())}
                    {action("1. List", () => editor.chain().focus().toggleOrderedList().run())}
                    {action("Quote", () => editor.chain().focus().toggleBlockquote().run())}
                    {action("Code", () => editor.chain().focus().toggleCodeBlock().run())}
                    {action("Link", () => {
                      const href = window.prompt("Link URL");
                      if (href) editor.chain().focus().setLink({ href }).run();
                    })}
                    {action("Unlink", () => editor.chain().focus().unsetLink().run())}
                    {action("Align left", () => editor.chain().focus().setTextAlign("left").run())}
                    {action("Center", () => editor.chain().focus().setTextAlign("center").run())}
                    {action("Align right", () =>
                      editor.chain().focus().setTextAlign("right").run(),
                    )}
                    {action("Color", () => {
                      const color = window.prompt("Text color (hex)", "#006465");
                      if (color) editor.chain().focus().setColor(color).run();
                    })}
                    {action("Highlight", () => editor.chain().focus().toggleHighlight().run())}
                    {action("Rule", () => editor.chain().focus().setHorizontalRule().run())}
                    {action("Image", () =>
                      document.getElementById("article-image-upload")?.click(),
                    )}
                    {action("Table", () => {
                      const rowCount = Math.max(
                        1,
                        Math.min(12, Number(window.prompt("Number of rows", "3")) || 3),
                      );
                      const columnCount = Math.max(
                        1,
                        Math.min(8, Number(window.prompt("Number of columns", "2")) || 2),
                      );
                      editor
                        .chain()
                        .focus()
                        .insertContent({
                          type: "articleTable",
                          content: Array.from({ length: rowCount }, (_, row) => ({
                            type: "articleTableRow",
                            content: Array.from({ length: columnCount }, () => ({
                              type: "articleTableCell",
                              attrs: { header: row === 0 },
                              content: [{ type: "paragraph" }],
                            })),
                          })),
                        })
                        .run();
                    })}
                    {editor.isActive("image") && (
                      <>
                        {action("Image left", () =>
                          editor
                            .chain()
                            .focus()
                            .updateAttributes("image", { alignment: "left" })
                            .run(),
                        )}
                        {action("Image center", () =>
                          editor
                            .chain()
                            .focus()
                            .updateAttributes("image", { alignment: "center" })
                            .run(),
                        )}
                        {action("Image right", () =>
                          editor
                            .chain()
                            .focus()
                            .updateAttributes("image", { alignment: "right" })
                            .run(),
                        )}
                        {action("Image 50%", () =>
                          editor.chain().focus().updateAttributes("image", { width: "50%" }).run(),
                        )}
                        {action("Image 75%", () =>
                          editor.chain().focus().updateAttributes("image", { width: "75%" }).run(),
                        )}
                        {action("Image 100%", () =>
                          editor.chain().focus().updateAttributes("image", { width: "100%" }).run(),
                        )}
                      </>
                    )}
                    {action("Undo", () => editor.chain().focus().undo().run())}
                    {action("Redo", () => editor.chain().focus().redo().run())}
                  </>
                )}
              </div>
              <input
                id="article-image-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file)
                    void insertUploadedImage(file).catch((error: Error) =>
                      setMessage(error.message),
                    );
                  event.currentTarget.value = "";
                }}
              />
              <EditorContent
                editor={editor}
                className="min-h-[400px] rounded border border-charcoal/20 bg-white p-4"
              />
              <p className="mt-2 text-xs text-charcoal/55">
                Paste or drop an image into the editor. Uploads are limited to 2 MB.
              </p>
            </div>
          </section>
          <aside className="space-y-5">
            <section
              className="rounded-md border border-charcoal/15 bg-white p-5"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                void uploadCover(event.dataTransfer.files[0]).catch((error: Error) =>
                  setMessage(error.message),
                );
              }}
            >
              <h2 className="font-semibold">Cover image</h2>
              {post.coverImage && (
                <img
                  src={post.coverImage}
                  alt={post.imageAlt || "Article cover preview"}
                  className="mt-3 aspect-[4/3] w-full rounded object-cover"
                />
              )}
              <label className="mt-4 block cursor-pointer rounded border border-brand px-3 py-2 text-center text-sm text-brand hover:bg-brand-soft">
                Upload cover
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={(event) => {
                    void uploadCover(event.target.files?.[0]).catch((error: Error) =>
                      setMessage(error.message),
                    );
                    event.currentTarget.value = "";
                  }}
                />
              </label>
              <label className="mt-3 block text-sm font-semibold">
                Image alt text
                <input
                  value={post.imageAlt}
                  onChange={(event) => update({ imageAlt: event.target.value })}
                  maxLength={250}
                  required
                  className="mt-2 w-full rounded border border-charcoal/20 px-3 py-2 font-normal"
                />
              </label>
              {post.coverImage && (
                <button
                  type="button"
                  onClick={() => update({ coverImage: null })}
                  className="mt-2 w-full text-sm text-red-700"
                >
                  Remove cover
                </button>
              )}
            </section>
            <section className="rounded-md border border-charcoal/15 bg-white p-5">
              <h2 className="font-semibold">Publishing details</h2>
              <label className="mt-3 block text-sm font-medium">
                Published date
                <input
                  type="date"
                  value={post.publishedAt?.slice(0, 10) || today()}
                  onChange={(event) => update({ publishedAt: event.target.value })}
                  className="mt-2 w-full rounded border border-charcoal/20 px-3 py-2"
                />
              </label>
              <label className="mt-3 block text-sm font-medium">
                Read time
                <input
                  value={post.readTime}
                  placeholder="Auto from article body"
                  onChange={(event) => {
                    readTimeEdited.current = true;
                    update({ readTime: event.target.value });
                  }}
                  className="mt-2 w-full rounded border border-charcoal/20 px-3 py-2"
                />
              </label>
              <label className="mt-3 block text-sm font-medium">
                Meta title{" "}
                <span className="font-normal text-charcoal/50">{post.metaTitle.length}/60</span>
                <input
                  value={post.metaTitle}
                  maxLength={60}
                  onChange={(event) => update({ metaTitle: event.target.value })}
                  className="mt-2 w-full rounded border border-charcoal/20 px-3 py-2"
                />
              </label>
              <label className="mt-3 block text-sm font-medium">
                Meta description{" "}
                <span className="font-normal text-charcoal/50">
                  {post.metaDescription.length}/160
                </span>
                <textarea
                  value={post.metaDescription}
                  maxLength={160}
                  onChange={(event) => update({ metaDescription: event.target.value })}
                  className="mt-2 min-h-20 w-full rounded border border-charcoal/20 px-3 py-2"
                />
              </label>
            </section>
            <section className="rounded-md border border-charcoal/15 bg-white p-5">
              <h2 className="font-semibold">Status</h2>
              <p className="mt-2 text-sm capitalize text-charcoal/70">{post.status}</p>
              <div className="mt-5 grid gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void save("draft")}
                  className="rounded border border-brand px-4 py-3 text-sm font-semibold text-brand disabled:opacity-50"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void save("published")}
                  className="rounded bg-brand px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Publish
                </button>
              </div>
              <p className="mt-3 text-xs text-charcoal/55">Drafts autosave every 30 seconds.</p>
              {post.id && (
                <button
                  type="button"
                  onClick={() =>
                    window.open(
                      `/admin/articles/${post.id}/preview`,
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                  className="mt-3 w-full rounded border border-charcoal/20 px-4 py-3 text-sm"
                >
                  Preview
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (!dirty || window.confirm("You have unsaved changes. Leave this page?"))
                    void navigate({ to: "/admin/articles" });
                }}
                className="mt-2 w-full rounded px-4 py-3 text-sm text-charcoal/70"
              >
                Cancel
              </button>
            </section>
            <section className="rounded-md border border-charcoal/15 bg-white p-5">
              <h2 className="font-semibold">Preview</h2>
              <p className="mt-2 text-sm font-bold">{post.title || "Article title"}</p>
              <p className="mt-1 text-sm text-charcoal/60">
                {post.excerpt || "Your excerpt appears here."}
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
