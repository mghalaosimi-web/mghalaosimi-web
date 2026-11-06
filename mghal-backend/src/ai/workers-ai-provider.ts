import { AIPlatformError, type AITextProvider, type AITextRequest, type AITextResult } from "./contracts";

type WorkersAI = {
  run(model: string, input: Record<string, unknown>): Promise<unknown>;
};

const DEFAULT_MODEL = "@cf/google/gemma-4-26b-a4b-it";
const MAX_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 4_000;
const MAX_TOTAL_CHARS = 12_000;

function extractText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.response === "string") return record.response.trim();
    if (typeof record.text === "string") return record.text.trim();
    if (Array.isArray(record.choices)) {
      const first = record.choices[0];
      if (first && typeof first === "object") {
        const message = (first as Record<string, unknown>).message;
        if (message && typeof message === "object") {
          const content = (message as Record<string, unknown>).content;
          if (typeof content === "string") return content.trim();
        }
      }
    }
  }
  return "";
}

export class WorkersAITextProvider implements AITextProvider {
  constructor(
    private readonly ai: WorkersAI,
    private readonly model = DEFAULT_MODEL,
    private readonly maxOutputTokens = 512,
  ) {}

  async generate(request: AITextRequest): Promise<AITextResult> {
    if (!Array.isArray(request.messages) || request.messages.length === 0 || request.messages.length > MAX_MESSAGES) {
      throw new AIPlatformError("AI_INVALID_REQUEST", "The conversation must contain between 1 and 12 messages.");
    }
    let total = 0;
    for (const message of request.messages) {
      if (!message || !["system", "user", "assistant"].includes(message.role) || typeof message.content !== "string") {
        throw new AIPlatformError("AI_INVALID_REQUEST", "A message has an invalid role or content.");
      }
      const content = message.content.trim();
      if (!content || content.length > MAX_MESSAGE_CHARS) {
        throw new AIPlatformError("AI_INVALID_REQUEST", "Each message must contain 1 to 4000 characters.");
      }
      total += content.length;
    }
    if (total > MAX_TOTAL_CHARS) {
      throw new AIPlatformError("AI_INVALID_REQUEST", "The conversation exceeds the input character limit.");
    }

    const maxTokens = Math.max(64, Math.min(
      this.maxOutputTokens,
      Number.isInteger(request.maxTokens) ? Number(request.maxTokens) : this.maxOutputTokens,
    ));
    const temperature = typeof request.temperature === "number"
      ? Math.max(0, Math.min(1, request.temperature))
      : 0.2;

    try {
      const result = await this.ai.run(this.model, {
        messages: request.messages,
        max_tokens: maxTokens,
        temperature,
      });
      const text = extractText(result);
      if (!text) throw new Error("The model returned an empty or unsupported response.");
      return { text, provider: "cloudflare-workers-ai", model: this.model };
    } catch (error) {
      if (error instanceof AIPlatformError) throw error;
      throw new AIPlatformError("AI_PROVIDER_ERROR", "The AI provider could not complete the request.");
    }
  }
}
