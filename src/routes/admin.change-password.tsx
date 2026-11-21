import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { adminRequest } from "@/lib/admin-api";
import { AdminNav } from "@/components/admin/AdminNav";

export const Route = createFileRoute("/admin/change-password")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: ChangePasswordPage,
});

function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (newPassword !== confirmation) {
      setMessage("The new passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const response = await adminRequest("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Could not change password.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmation("");
      setMessage("Password changed successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not change password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-offwhite px-4 pb-20 pt-24 text-body-text">
      <div className="mx-auto max-w-6xl">
        <AdminNav />
        <section className="mx-auto mt-12 max-w-xl rounded-md border border-charcoal/15 bg-white p-6 sm:p-9">
          <p className="micro-label text-brand">Account security</p>
          <h1 className="display mt-3 text-4xl">Change password</h1>
          <form onSubmit={submit} className="mt-8 space-y-5">
            <PasswordField
              label="Current password"
              value={currentPassword}
              setValue={setCurrentPassword}
            />
            <PasswordField label="New password" value={newPassword} setValue={setNewPassword} />
            <PasswordField
              label="Confirm new password"
              value={confirmation}
              setValue={setConfirmation}
            />
            {message && (
              <p role="status" className="text-sm text-charcoal/75">
                {message}
              </p>
            )}
            <button
              disabled={busy}
              className="rounded bg-brand px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {busy ? "Saving…" : "Update password"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

function PasswordField({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <label className="block text-sm font-semibold">
      {label}
      <span className="mt-2 flex rounded border border-charcoal/20 bg-white">
        <input
          type={visible ? "text" : "password"}
          required
          minLength={10}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="min-w-0 flex-1 bg-transparent px-3 py-3 font-normal outline-none"
        />
        <button
          type="button"
          onClick={() => setVisible((shown) => !shown)}
          className="px-3 text-xs font-medium text-brand"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </span>
    </label>
  );
}
