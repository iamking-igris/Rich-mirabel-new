import { Link, Navigate, useNavigate, useRouterState } from "@tanstack/react-router";
import { BookOpen, Home, PenLine, UserRound, BarChart3 } from "lucide-react";
import type { ReactNode } from "react";
import { BrandMark } from "@/components/brand";
import { cn } from "@/lib/cn";
import { trialLeft, useSession } from "@/lib/session";

const links = [
  { to: "/studio", label: "Home", icon: Home, exact: true },
  { to: "/studio/progress", label: "Progress", icon: BarChart3, exact: false },
  { to: "/studio/cbt", label: "Take CBT", icon: PenLine, exact: false, center: true },
  { to: "/studio/guides", label: "Guides", icon: BookOpen, exact: false },
  { to: "/studio/account", label: "Account", icon: UserRound, exact: false },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const name = useSession((s) => s.name);
  const leave = useSession((s) => s.leave);
  const trialStart = useSession((s) => s.trialStart);
  const subscribed = useSession((s) => s.subscribed);
  const navigate = useNavigate();
  const trial = trialLeft(trialStart, subscribed);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <BrandMark to="/studio" />
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((item) => {
              const active = item.exact ? path === item.to : path.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "min-h-11 border-b-2 px-3 py-2.5 text-sm font-medium",
                    active ? "border-primary text-primary" : "border-transparent text-muted hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2 text-sm">
            <span className={cn("rounded-full px-3 py-1", subscribed ? "bg-soft text-primary" : trial.active ? "bg-soft text-ink" : "border border-ink text-ink")}>
              {trial.label}
            </span>
            <Link to="/studio/profile" className="hidden min-h-11 items-center font-medium hover:text-primary sm:inline-flex">
              {name.split(" ")[0]}
            </Link>
            <button
              type="button"
              onClick={() => {
                leave();
                navigate({ to: "/" });
              }}
              className="min-h-11 rounded-full px-3 text-sm text-muted hover:text-ink"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-6 pb-28 md:pb-10">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
        <ul className="grid grid-cols-5">
          {links.map((item) => {
            const active = item.exact ? path === item.to : path.startsWith(item.to);
            const Icon = item.icon;
            const center = "center" in item && item.center;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex min-h-16 flex-col items-center justify-center gap-0.5 text-xs",
                    active ? "text-primary" : "text-muted",
                    center && "-mt-3",
                  )}
                >
                  <span className={cn("flex size-10 items-center justify-center rounded-full", center ? "bg-primary text-primary-fg shadow-sm" : "")}>
                    <Icon className="size-5" strokeWidth={1.75} />
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export function Gate({ children }: { children: ReactNode }) {
  const name = useSession((s) => s.name);
  const complete = useSession((s) => s.onboardingComplete);
  const navigate = useNavigate();
  if (!name) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-4">
        <div className="w-full max-w-md rounded-3xl border border-line bg-surface p-6 text-center">
          <p className="text-sm font-medium text-primary">Richmirabel</p>
          <h1 className="mt-2 font-display text-3xl">Sign in to continue</h1>
          <p className="mt-2 text-sm text-muted">Physics, Chemistry, Biology, and Mathematics are open. Your two free days start after a short setup.</p>
          <div className="mt-6 flex flex-col gap-2">
            <button type="button" onClick={() => navigate({ to: "/create-account" })} className="w-full rounded-full bg-primary py-3 font-semibold text-primary-fg">
              Start free trial
            </button>
            <button type="button" onClick={() => navigate({ to: "/login" })} className="w-full rounded-full border border-line py-3 font-semibold">
              Log in
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (!complete) return <Navigate to="/onboarding" />;
  return <Shell>{children}</Shell>;
}
