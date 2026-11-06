/** Shared contracts for the M.GH.AL AI platform. No secrets or provider SDKs belong here. */
export type AIMessage = { role: "system" | "user" | "assistant"; content: string };
export type AITextRequest = {
  messages: AIMessage[];
  maxTokens?: number;
  temperature?: number;
};
export type AITextResult = { text: string; provider: "cloudflare-workers-ai"; model: string };
export interface AITextProvider {
  generate(request: AITextRequest): Promise<AITextResult>;
}
export type AIPlatformConfig = {
  enabled: boolean;
  model?: string;
  maxInputCharacters?: number;
  maxOutputTokens?: number;
  timeoutMs?: number;
};
export class AIPlatformError extends Error {
  constructor(
    public readonly code: "AI_DISABLED" | "AI_INVALID_REQUEST" | "AI_PROVIDER_UNAVAILABLE" | "AI_PROVIDER_ERROR",
    message: string,
  ) {
    super(message);
    this.name = "AIPlatformError";
  }
}
