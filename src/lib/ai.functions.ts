import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SYSTEMS = {
  chat: "You are Workly, a concise, professional workplace productivity assistant. Give practical, well-structured answers in markdown. Use the conversation history for context. If unsure, say so. Remind users to review important outputs.",
  planner:
    "You are an expert work planner. Build a realistic schedule from the user's tasks, deadlines, priorities and available hours. Put urgent / high-priority / near-deadline tasks first and never exceed available hours per day. Respond with ONLY a JSON object, no markdown fences, of shape {\"summary\": string, \"items\": [{\"day\": string, \"time\": string, \"task\": string, \"priority\": \"High\"|\"Medium\"|\"Low\", \"note\": string}]}.",
  research:
    "You are a research assistant. You have NO internet access: work only from the provided text or your general training knowledge, and say so explicitly. Never claim to have consulted external sources or invent citations. Respond in markdown with sections: ## Summary, ## Key Findings, ## Insights, ## Actionable Recommendations, ## Limitations.",
} as const;

const Input = z.object({
  tool: z.enum(["chat", "planner", "research"]),
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(20000) }))
    .min(1)
    .max(40),
});

export const askAI = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) return { ok: false as const, error: "AI is not configured (missing key)." };
    const { createOpenAI } = await import("@ai-sdk/openai");
    const { streamText } = await import("ai");
    const provider = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });
    try {
      let streamError: unknown;
      const result = streamText({
        model: provider.responses("openai/gpt-6-astra"),
        system: SYSTEMS[data.tool],
        messages: data.messages,
        maxRetries: 0,
        onError: ({ error }) => {
          streamError = error;
        },
        providerOptions: {
          openai: {
            store: false,
            forceReasoning: true,
            reasoningEffort: "low",
            reasoningSummary: "auto",
            include: ["reasoning.encrypted_content"],
          },
        },
      });
      const text = await result.text;
      if (streamError) throw streamError;
      if (!text.trim()) return { ok: false as const, error: "The AI returned an empty response. Please try again." };
      return { ok: true as const, text };
    } catch (e: any) {
      const status = e?.statusCode ?? e?.status;
      console.error("AI error", status, e?.message);
      if (status === 429) return { ok: false as const, error: "Too many requests — please wait a moment and try again." };
      if (status === 402) return { ok: false as const, error: "AI credits are exhausted for this workspace." };
      if (status === 403) return { ok: false as const, error: "AI access was denied for this request." };
      return { ok: false as const, error: "The AI service failed to respond. Please try again." };
    }
  });
