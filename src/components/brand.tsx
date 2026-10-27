import { Link } from "@tanstack/react-router";

export function BrandMark({ to = "/" }: { to?: "/" | "/studio" | "/login" }) {
  return (
    <Link to={to} className="flex items-center gap-2.5">
      <img src="/logo.png" alt="" width={40} height={44} className="h-10 w-auto shrink-0" />
      <span className="font-display text-xl tracking-tight text-ink">Richmirabel</span>
    </Link>
  );
}
