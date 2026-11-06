# M.GH.AL AI platform foundation

This directory contains the provider-neutral contracts and the first Cloudflare Workers AI text adapter.

## Current status

- Provider contract and bounded Workers AI adapter are implemented.
- This module is intentionally **not connected to the production Worker routes yet**.
- No D1 schema or production binding is changed by these files.
- No API key is required for the Workers AI binding; the binding must be configured explicitly in a separate Worker environment before runtime use.
- The adapter does not silently fail over to a paid provider.

## Integration contract

Create a Workers AI binding named `AI` only in a dedicated development/preview Worker first. Keep its D1 binding pointed at a separate development database. Do not add the binding to the production Worker until the route, quota enforcement, abuse controls, privacy review, and tests are complete and approved.

Example Wrangler binding for a development-only environment:

```toml
[ai]
binding = "AI"
```

Instantiate `WorkersAITextProvider` with the environment binding and an explicitly selected model. The default model is configurable in code; verify model availability and current pricing/quota before enabling it. Free allocations are capped and are not unlimited.

## Safety requirements for the next integration phase

1. Expose only published, approved public content to visitor-facing retrieval.
2. Never pass session tokens, passwords, bootstrap secrets, private admin data, or unpublished drafts to a model.
3. Add per-IP and per-visitor quotas, request size limits, timeout handling, and usage accounting before exposing a public route.
4. Do not allow model output to execute tools, SQL, shell commands, or content publication.
5. Admin actions must go through existing authentication and permission checks, with explicit approval for writes.
6. Do not add paid-provider fallback or automatic billing activation.
7. Add unit tests and run the backend quality pipeline before deployment.

## Validation limitation

The current execution environment is not available for running Node.js, TypeScript, Vitest, or Wrangler. These files are therefore committed as an isolated foundation, not represented as build-verified or production-ready.
