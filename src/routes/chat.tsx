import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Loader2, Send, Trash2 } from "lucide-react";
import { askAI } from "@/lib/ai.functions";
import { PageTitle, ErrorBox } from "@/components/AppShell";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat — Workly AI" },
      { name: "description", content: "Chat with an AI assistant about workplace questions and tasks." },
      { property: "og:title", content: "AI Chat — Workly AI" },
      { property: "og:description", content: "Chat with an AI assistant about workplace questions and tasks." },
    ],
  }),
  component: Chat,
});

type Msg = { role: "user" | "assistant"; content: string };
const KEY = "workly-chat";

function Chat() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try { setMsgs(JSON.parse(sessionStorage.getItem(KEY) || "[]")); } catch {}
    taRef.current?.focus();
  }, []);
  useEffect(() => {
    sessionStorage.setItem(KEY, JSON.stringify(msgs));
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  async function send() {
    const text = input.trim();
    if (!text) return setError("Please type a message first.");
    if (loading) return;
    setError("");
    const next = [...msgs, { role: "user" as const, content: text }];
    setMsgs(next);
    setInput("");
    setLoading(true);
    try {
      const res = await askAI({ data: { tool: "chat", messages: next.slice(-30) } });
      if (res.ok) setMsgs([...next, { role: "assistant", content: res.text }]);
      else setError(res.error);
    } catch {
      setError("Couldn't reach the AI. Check your connection and try again.");
    } finally {
      setLoading(false);
      taRef.current?.focus();
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="flex items-start justify-between gap-2">
        <PageTitle title="AI Chat" sub="Conversation is kept for this browser session only." />
        {msgs.length > 0 && (
          <button onClick={() => setMsgs([])} className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-accent">
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto rounded-xl border border-border bg-card p-4">
        {msgs.length === 0 && !loading && (
          <p className="py-10 text-center text-sm text-muted-foreground">Try: "Draft an agenda for a 30-minute project kickoff."</p>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
            {m.role === "user" ? (
              <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl bg-primary px-4 py-2 text-sm text-primary-foreground">{m.content}</div>
            ) : (
              <div className="md-body max-w-none text-sm"><ReactMarkdown>{m.content}</ReactMarkdown></div>
            )}
          </div>
        ))}
        {loading && <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Thinking…</p>}
        <div ref={endRef} />
      </div>
      {error && <div className="mt-3"><ErrorBox msg={error} /></div>}
      <form onSubmit={(e) => { e.preventDefault(); send(); }} className="mt-3 flex gap-2">
        <textarea
          ref={taRef}
          aria-label="Message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          rows={2}
          maxLength={4000}
          placeholder="Ask a workplace question…"
          className="flex-1 resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <button type="submit" disabled={loading} aria-label="Send" className="grid w-12 place-items-center rounded-xl bg-primary text-primary-foreground disabled:opacity-50">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </button>
      </form>
    </div>
  );
}
