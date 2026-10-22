import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Plus, Trash2, Wand2 } from "lucide-react";
import { askAI } from "@/lib/ai.functions";
import { PageTitle, ErrorBox } from "@/components/AppShell";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workly AI" },
      { name: "description", content: "Generate prioritised daily or weekly schedules from your tasks." },
      { property: "og:title", content: "AI Task Planner — Workly AI" },
      { property: "og:description", content: "Generate prioritised daily or weekly schedules from your tasks." },
    ],
  }),
  component: Planner,
});

type Task = { name: string; deadline: string; priority: string };
type Item = { day: string; time: string; task: string; priority: string; note: string; done?: boolean };
const field = "rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

function Planner() {
  const [tasks, setTasks] = useState<Task[]>([{ name: "", deadline: "", priority: "Medium" }]);
  const [hours, setHours] = useState("6");
  const [mode, setMode] = useState("daily");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [items, setItems] = useState<Item[]>([]);

  const upd = (i: number, k: keyof Task, v: string) => setTasks(tasks.map((t, j) => (j === i ? { ...t, [k]: v } : t)));

  async function generate() {
    const valid = tasks.filter((t) => t.name.trim());
    const h = Number(hours);
    if (!valid.length) return setError("Add at least one task.");
    if (!h || h <= 0 || h > 24) return setError("Available hours must be between 1 and 24.");
    setError(""); setLoading(true);
    const prompt = `Create a ${mode} schedule. Today is ${new Date().toDateString()}. Available hours per day: ${h}.\nTasks:\n${valid
      .map((t, i) => `${i + 1}. ${t.name} | priority: ${t.priority} | deadline: ${t.deadline || "none"}`)
      .join("\n")}`;
    try {
      const res = await askAI({ data: { tool: "planner", messages: [{ role: "user", content: prompt }] } });
      if (!res.ok) return setError(res.error);
      const json = JSON.parse(res.text.replace(/^```(json)?|```$/gm, "").trim());
      if (!Array.isArray(json.items)) throw new Error();
      setSummary(String(json.summary ?? ""));
      setItems(json.items.map((x: any) => ({ day: String(x.day ?? ""), time: String(x.time ?? ""), task: String(x.task ?? ""), priority: String(x.priority ?? ""), note: String(x.note ?? ""), done: false })));
    } catch {
      setError("The AI response couldn't be read as a schedule. Please try again.");
    } finally { setLoading(false); }
  }

  return (
    <div className="space-y-6">
      <PageTitle title="AI Task Planner" sub="Add your tasks, then let AI build a prioritised schedule." />
      <section className="space-y-3 rounded-xl border border-border bg-card p-4 md:p-6">
        {tasks.map((t, i) => (
          <div key={i} className="grid gap-2 md:grid-cols-[1fr_170px_130px_40px]">
            <input aria-label="Task" className={field} placeholder="Task, e.g. Prepare Q3 report" value={t.name} maxLength={200} onChange={(e) => upd(i, "name", e.target.value)} />
            <input aria-label="Deadline" type="date" className={field} value={t.deadline} onChange={(e) => upd(i, "deadline", e.target.value)} />
            <select aria-label="Priority" className={field} value={t.priority} onChange={(e) => upd(i, "priority", e.target.value)}>
              <option>High</option><option>Medium</option><option>Low</option>
            </select>
            <button aria-label="Remove task" disabled={tasks.length === 1} onClick={() => setTasks(tasks.filter((_, j) => j !== i))} className="grid h-10 place-items-center rounded-lg border border-border hover:bg-accent disabled:opacity-30">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button onClick={() => setTasks([...tasks, { name: "", deadline: "", priority: "Medium" }])} className="inline-flex items-center gap-1 text-sm hover:underline">
          <Plus className="h-4 w-4" /> Add task
        </button>
        <div className="flex flex-wrap items-end gap-3 border-t border-border pt-4">
          <label className="text-sm">Hours / day<input type="number" min={1} max={24} className={`${field} mt-1 block w-28`} value={hours} onChange={(e) => setHours(e.target.value)} /></label>
          <label className="text-sm">Schedule<select className={`${field} mt-1 block`} value={mode} onChange={(e) => setMode(e.target.value)}><option value="daily">Daily</option><option value="weekly">Weekly</option></select></label>
          <button onClick={generate} disabled={loading} className="ml-auto inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />} {loading ? "Planning…" : "Generate schedule"}
          </button>
        </div>
      </section>
      {error && <ErrorBox msg={error} />}
      {items.length > 0 && (
        <section className="rounded-xl border border-border bg-card p-4 md:p-6">
          <h2 className="font-semibold">Your schedule</h2>
          {summary && <p className="mt-1 text-sm text-muted-foreground">{summary}</p>}
          <p className="mt-1 text-xs text-muted-foreground">{items.filter((x) => x.done).length}/{items.length} done · edit any field directly</p>
          <ul className="mt-4 space-y-2">
            {items.map((it, i) => {
              const set = (p: Partial<Item>) => setItems(items.map((x, j) => (j === i ? { ...x, ...p } : x)));
              return (
                <li key={i} className={`flex gap-3 rounded-lg border border-border p-3 ${it.done ? "opacity-50" : ""}`}>
                  <input type="checkbox" aria-label="Mark complete" checked={!!it.done} onChange={(e) => set({ done: e.target.checked })} className="mt-1 h-4 w-4 accent-current" />
                  <div className="min-w-0 flex-1 space-y-1">
                    <input aria-label="Task" value={it.task} onChange={(e) => set({ task: e.target.value })} className={`w-full bg-transparent font-medium outline-none ${it.done ? "line-through" : ""}`} />
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <input aria-label="Day" value={it.day} onChange={(e) => set({ day: e.target.value })} className="w-28 bg-transparent outline-none" />
                      <input aria-label="Time" value={it.time} onChange={(e) => set({ time: e.target.value })} className="w-32 bg-transparent outline-none" />
                      <span className="rounded border border-border px-1.5">{it.priority}</span>
                    </div>
                    {it.note && <p className="text-xs text-muted-foreground">{it.note}</p>}
                  </div>
                  <button aria-label="Delete item" onClick={() => setItems(items.filter((_, j) => j !== i))} className="self-start p-1 hover:bg-accent rounded"><Trash2 className="h-4 w-4" /></button>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
