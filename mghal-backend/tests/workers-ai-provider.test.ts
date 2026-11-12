import { describe, expect, it, vi } from "vitest";
import { AIPlatformError, type AITextRequest } from "../src/ai/contracts";
import { WorkersAITextProvider } from "../src/ai/workers-ai-provider";

function createProvider(response: unknown = { response: "Hello from Workers AI." }) {
  const run = vi.fn(async (_model: string, _input: Record<string, unknown>): Promise<unknown> => response);
  return { provider: new WorkersAITextProvider({ run }), run };
}

const validRequest: AITextRequest = {
  messages: [{ role: "user", content: "Hello" }],
};

describe("WorkersAITextProvider", () => {
  it("sends bounded messages and returns normalized provider output", async () => {
    const { provider, run } = createProvider();
    const result = await provider.generate(validRequest);

    expect(result).toEqual({
      text: "Hello from Workers AI.",
      provider: "cloudflare-workers-ai",
      model: "@cf/google/gemma-4-26b-a4b-it",
    });
    expect(run).toHaveBeenCalledOnce();
    expect(run).toHaveBeenCalledWith(
      "@cf/google/gemma-4-26b-a4b-it",
      expect.objectContaining({
        messages: validRequest.messages,
        max_tokens: 512,
        temperature: 0.2,
      }),
    );
  });

  it("accepts supported response text shapes", async () => {
    const { provider } = createProvider({ choices: [{ message: { content: "  Choice output  " } }] });
    await expect(provider.generate(validRequest)).resolves.toMatchObject({ text: "Choice output" });
  });

  it("rejects an empty conversation before calling the provider", async () => {
    const { provider, run } = createProvider();
    await expect(provider.generate({ messages: [] })).rejects.toMatchObject({
      code: "AI_INVALID_REQUEST",
    });
    expect(run).not.toHaveBeenCalled();
  });

  it("rejects messages that exceed the per-message limit", async () => {
    const { provider, run } = createProvider();
    await expect(provider.generate({
      messages: [{ role: "user", content: "x".repeat(4_001) }],
    })).rejects.toBeInstanceOf(AIPlatformError);
    expect(run).not.toHaveBeenCalled();
  });

  it("rejects conversations that exceed the total input limit", async () => {
    const { provider, run } = createProvider();
    await expect(provider.generate({
      messages: [
        { role: "user", content: "a".repeat(4_000) },
        { role: "assistant", content: "b".repeat(4_000) },
        { role: "user", content: "c".repeat(4_000) },
        { role: "assistant", content: "d".repeat(4_000) },
      ],
    })).rejects.toMatchObject({ code: "AI_INVALID_REQUEST" });
    expect(run).not.toHaveBeenCalled();
  });

  it("normalizes provider failures without leaking provider details", async () => {
    const { provider } = createProvider(Promise.reject(new Error("internal provider detail")));
    await expect(provider.generate(validRequest)).rejects.toMatchObject({
      code: "AI_PROVIDER_ERROR",
      message: "The AI provider could not complete the request.",
    });
  });

  it("clamps output tokens and temperature to safe bounds", async () => {
    const { provider, run } = createProvider();
    await provider.generate({ ...validRequest, maxTokens: 10_000, temperature: 3 });
    expect(run).toHaveBeenCalledWith(
      "@cf/google/gemma-4-26b-a4b-it",
      expect.objectContaining({ max_tokens: 512, temperature: 1 }),
    );
  });
});
