import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { LayoutGrid, MessageSquare, ListChecks, Search, Settings, Menu, X, Info } from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutGrid },
  { to: "/chat", label: "AI Chat", icon: MessageSquare },
  { to: "/planner", label: "Task Planner", icon: ListChecks },
  { to: "/research", label: "Research Assistant", icon: Search },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-1 p-3">
      <p className="px-3 pb-2 text-xs uppercase tracking-widest text-muted-foreground">Workspace</p>
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = path === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              active ? "bg-primary text-primary-foreground font-medium" : "text-foreground hover:bg-accent"
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </Link>
        );
      })}
    </nav>
  );

  const brand = (
    <div className="flex items-center gap-3 border-b border-border px-5 py-4">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary font-bold text-primary-foreground">W</div>
      <div>
        <p className="font-semibold leading-tight">Workly AI</p>
        <p className="text-xs text-muted-foreground">Productivity assistant</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar md:block">
        <div className="sticky top-0">{brand}{nav}</div>
      </aside>
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-background/80" onClick={() => setOpen(false)} />
          <aside className="relative h-full w-64 border-r border-border bg-sidebar">
            <button aria-label="Close menu" onClick={() => setOpen(false)} className="absolute right-3 top-4 p-1">
              <X className="h-5 w-5" />
            </button>
            {brand}{nav}
          </aside>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
          <button aria-label="Open menu" onClick={() => setOpen(true)} className="rounded-md p-1.5 hover:bg-accent md:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex min-w-0 items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">AI responses may be inaccurate — always review. Don't share confidential info.</span>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

export function PageTitle({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
    </div>
  );
}

export function ErrorBox({ msg }: { msg: string }) {
  return <div role="alert" className="rounded-lg border border-foreground/40 bg-muted px-4 py-3 text-sm">⚠ {msg}</div>;
}
