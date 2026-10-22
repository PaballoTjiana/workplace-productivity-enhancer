import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageSquare, ListChecks, Search, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Workly AI — Workplace Productivity Assistant" },
      { name: "description", content: "AI chat, task planning and research tools for your workday." },
      { property: "og:title", content: "Workly AI — Workplace Productivity Assistant" },
      { property: "og:description", content: "AI chat, task planning and research tools for your workday." },
    ],
  }),
  component: Index,
});

const TOOLS = [
  { to: "/chat", icon: MessageSquare, title: "AI Chat", desc: "Ask workplace questions and get context-aware answers." },
  { to: "/planner", icon: ListChecks, title: "Task Planner", desc: "Turn tasks and deadlines into a prioritised schedule." },
  { to: "/research", icon: Search, title: "Research Assistant", desc: "Summarise topics or articles into findings and actions." },
] as const;

function Index() {
  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-border bg-card p-6 md:p-12">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs">
          <Sparkles className="h-3.5 w-3.5" /> Powered by AI
        </span>
        <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">Your AI workplace assistant</h1>
        <p className="mt-4 max-w-xl text-muted-foreground md:text-lg">
          Chat through problems, plan your week, and digest research — all in one simple workspace.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/chat" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground hover:opacity-90">
            Open AI Chat <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/planner" className="rounded-lg border border-border px-5 py-3 font-medium hover:bg-accent">
            Plan my tasks
          </Link>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold">Productivity tools</h2>
        <p className="text-sm text-muted-foreground">Pick a tool to get started.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {TOOLS.map(({ to, icon: Icon, title, desc }) => (
            <Link key={to} to={to} className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-foreground">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary text-primary-foreground"><Icon className="h-5 w-5" /></div>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium group-hover:underline">Open tool <ArrowRight className="h-4 w-4" /></span>
            </Link>
          ))}
        </div>
      </section>
      <p className="rounded-xl border border-border p-4 text-xs text-muted-foreground">
        <strong className="text-foreground">Responsible AI:</strong> AI responses may be inaccurate or incomplete and require human review before use. Please do not submit confidential, personal or sensitive workplace information.
      </p>
    </div>
  );
}
