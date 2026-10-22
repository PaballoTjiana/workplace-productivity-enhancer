import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageTitle } from "@/components/AppShell";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Workly AI" },
      { name: "description", content: "Manage session data and read about how Workly AI works." },
      { property: "og:title", content: "Settings — Workly AI" },
      { property: "og:description", content: "Manage session data and read about how Workly AI works." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [cleared, setCleared] = useState(false);
  return (
    <div className="space-y-4">
      <PageTitle title="Settings" sub="Session data and AI information." />
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold">Session data</h2>
        <p className="mt-1 text-sm text-muted-foreground">Chat history is stored only in this browser tab and disappears when you close it.</p>
        <button onClick={() => { sessionStorage.clear(); setCleared(true); }} className="mt-4 rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent">
          Clear chat history
        </button>
        {cleared && <p className="mt-2 text-sm" role="status">History cleared.</p>}
      </section>
      <section className="rounded-xl border border-border bg-card p-6 text-sm">
        <h2 className="font-semibold">AI model</h2>
        <p className="mt-1 text-muted-foreground">All tools use Lovable's built-in AI (OpenAI GPT model). No account or API key is needed; the key stays on the server.</p>
      </section>
      <section className="rounded-xl border border-border bg-card p-6 text-sm">
        <h2 className="font-semibold">Responsible use</h2>
        <p className="mt-1 text-muted-foreground">AI responses may be inaccurate, outdated or biased and must be reviewed by a person before use. Do not submit confidential, personal or sensitive workplace information. The Research Assistant does not browse the web.</p>
      </section>
    </div>
  );
}
