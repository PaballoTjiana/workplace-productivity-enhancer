import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Loader2, Search } from "lucide-react";
import { askAI } from "@/lib/ai.functions";
import { PageTitle, ErrorBox } from "@/components/AppShell";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workly AI" },
      { name: "description", content: "Summaries, key findings and recommendations from a topic or article." },
      { property: "og:title", content: "AI Research Assistant — Workly AI" },
      { property: "og:description", content: "Summaries, key findings and recommendations from a topic or article." },
    ],
  }),
  component: Research,
});

function Research() {
  const [mode, setMode] = useState<"topic" | "article">("topic");
  const [text, setText] = useState("");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function run() {
    const t = text.trim();
    if (t.length < (mode === "topic" ? 3 : 100)) return setError(mode === "topic" ? "Enter a topic (at least 3 characters)." : "Paste an article of at least 100 characters.");
    setError(""); setLoading(true); setOut("");
    const prompt = mode === "topic" ? `Research topic (use general knowledge only): ${t}` : `Analyse this pasted article:\n\n${t}`;
    try {
      const res = await askAI({ data: { tool: "research", messages: [{ role: "user", content: prompt }] } });
      res.ok ? setOut(res.text) : setError(res.error);
    } catch { setError("Couldn't reach the AI. Please try again."); }
    finally { setLoading(false); }
  }

  return (
    <div className="space-y-6">
      <PageTitle title="AI Research Assistant" sub="No web browsing: analysis uses your pasted text or the AI's general knowledge." />
      <section className="space-y-3 rounded-xl border border-border bg-card p-4 md:p-6">
        <div className="inline-flex rounded-lg border border-border p-1">
          {(["topic", "article"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`rounded-md px-4 py-1.5 text-sm ${mode === m ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>
              {m === "topic" ? "Topic" : "Paste article"}
            </button>
          ))}
        </div>
        <textarea
          aria-label={mode === "topic" ? "Topic" : "Article text"}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={mode === "topic" ? 2 : 10}
          maxLength={15000}
          placeholder={mode === "topic" ? "e.g. Benefits of hybrid work for small teams" : "Paste article text here…"}
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <button onClick={run} disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground disabled:opacity-50">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} {loading ? "Analysing…" : "Analyse"}
        </button>
      </section>
      {error && <ErrorBox msg={error} />}
      {out && <section className="md-body rounded-xl border border-border bg-card p-4 text-sm md:p-6"><ReactMarkdown>{out}</ReactMarkdown></section>}
    </div>
  );
}
