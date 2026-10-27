import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { BrandMark } from "@/components/brand";

export const Route = createFileRoute("/admin")({ component: AdminGate });

const links = [
  ["/admin", "Overview"],
  ["/admin/subjects", "Subjects & Content"],
  ["/admin/past-questions", "Past Questions"],
  ["/admin/cbt", "CBT Generator"],
  ["/admin/students", "Students"],
  ["/admin/subscriptions", "Subscriptions & Pricing"],
  ["/admin/payments", "Payments & Revenue"],
  ["/admin/analytics", "Analytics"],
  ["/admin/settings", "Settings"],
] as const;

function AdminGate() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [ok, setOk] = useState(() => typeof sessionStorage !== "undefined" && sessionStorage.getItem("richmirabel-admin") === "1");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!ok) {
    return (
      <div className="min-h-screen bg-paper text-ink">
        <form
          className="mx-auto mt-16 max-w-sm rounded-3xl border border-line bg-surface p-6"
          onSubmit={(e) => {
            e.preventDefault();
            setBusy(true);
            const data = new FormData(e.currentTarget);
            const user = String(data.get("user") || "").trim();
            const pass = String(data.get("pass") || "");
            setTimeout(() => {
              if (user !== "admin" || pass !== (import.meta.env.VITE_ADMIN_PASSCODE || "admin")) {
                setError("Those credentials are not recognised. Demo login is admin / admin.");
                setBusy(false);
                return;
              }
              sessionStorage.setItem("richmirabel-admin", "1");
              setOk(true);
              setBusy(false);
            }, 200);
          }}
        >
          <BrandMark />
          <h1 className="mt-6 font-display text-3xl">Admin sign in</h1>
          <p className="mt-2 text-sm text-muted">Demo access only. Not a production account system.</p>
          <label className="mt-5 block text-sm font-medium" htmlFor="user">Username</label>
          <input id="user" name="user" autoComplete="username" className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-3" />
          <label className="mt-4 block text-sm font-medium" htmlFor="pass">Password</label>
          <div className="relative mt-2">
            <input id="pass" name="pass" type={show ? "text" : "password"} autoComplete="current-password" className="w-full rounded-xl border border-line bg-paper px-3 py-3 pr-16" />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary">{show ? "Hide" : "Show"}</button>
          </div>
          {error && <p className="mt-2 text-sm">{error}</p>}
          <button disabled={busy} className="mt-5 w-full rounded-full bg-primary py-3 font-semibold text-primary-fg disabled:opacity-50">{busy ? "Checking…" : "Sign in"}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper md:grid md:grid-cols-[230px_1fr]">
      <aside className="hidden bg-ink p-5 text-primary-fg md:block">
        <p className="font-display text-2xl">Richmirabel</p>
        <p className="mt-1 text-xs text-primary-fg/60">Admin · demo</p>
        <nav className="mt-6 space-y-0.5">
          {links.map(([to, label]) => (
            <Link key={to} to={to} className={cn("block min-h-10 border-l-2 px-3 py-2 text-sm", path === to || (to !== "/admin" && path.startsWith(to)) ? "border-brass text-primary-fg" : "border-transparent text-primary-fg/70 hover:text-primary-fg")}>
              {label}
            </Link>
          ))}
        </nav>
        <button type="button" className="mt-6 text-sm text-primary-fg/70" onClick={() => { sessionStorage.removeItem("richmirabel-admin"); setOk(false); }}>Sign out</button>
      </aside>
      <div>
        <div className="flex gap-2 overflow-x-auto border-b border-line px-3 py-2 md:hidden">
          {links.map(([to, label]) => (
            <Link key={to} to={to} className={cn("inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-sm", path === to || (to !== "/admin" && path.startsWith(to)) ? "bg-ink text-primary-fg" : "bg-soft")}>{label}</Link>
          ))}
          <button type="button" onClick={() => { sessionStorage.removeItem("richmirabel-admin"); setOk(false); }} className="inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-sm bg-soft">Sign out</button>
        </div>
        <main className="mx-auto max-w-5xl px-4 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
