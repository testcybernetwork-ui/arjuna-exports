import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { adminRequest } from "@/lib/admin-api";

export function AdminNav() {
  const [email, setEmail] = useState("");
  useEffect(() => {
    void adminRequest("/api/admin/summary")
      .then((response) => response.json())
      .then((data: { admin?: { email?: string } }) => setEmail(data.admin?.email ?? ""))
      .catch(() => {});
  }, []);
  async function logout() {
    await adminRequest("/api/admin/logout", { method: "POST" });
    window.location.assign("/admin/login");
  }
  return (
    <nav
      aria-label="Admin navigation"
      className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-charcoal/15 pb-5 text-sm"
    >
      <Link to="/admin/dashboard" className="font-semibold text-brand">
        Dashboard
      </Link>
      <Link to="/admin/articles" className="text-charcoal/75 hover:text-brand">
        Articles
      </Link>
      <Link to="/admin/change-password" className="text-charcoal/75 hover:text-brand">
        Change Password
      </Link>
      <span className="ml-auto text-charcoal/65">{email}</span>
      <button type="button" onClick={() => void logout()} className="text-brand underline">
        Logout
      </button>
    </nav>
  );
}
