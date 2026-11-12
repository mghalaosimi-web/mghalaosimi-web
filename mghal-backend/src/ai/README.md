# AI provider foundation

The AI contracts and provider adapter are isolated application modules. They are not currently wired to a public or administrator production API route and must not be represented as an active user-facing AI feature.

The optional Workers AI provider accepts an injected provider interface; it does not require a Cloudflare Worker runtime or deployment. Production AI integration remains disabled until a supported provider, credentials, authorization policy, quotas, and end-to-end tests are configured.

No AI credentials are required for the Vercel + Neon deployment. When credentials are unavailable, the current production API does not claim to offer AI generation.
