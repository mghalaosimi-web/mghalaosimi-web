# Social engagement and mobile navigation hardening — 2026-11-07

## Scope
- Add a keyboard-operable responsive navigation menu to the bilingual Next.js shell. The menu exposes expanded state, closes on Escape and on navigation, and respects reduced-motion preferences.
- Clarify the purpose of Like/Applaud, public-name consent, and unfollow actions. Add accessible descriptions, pressed/busy states, pending/success/error feedback, and server-derived counters.
- Preserve anonymous guest-follow behavior: a random browser token is used; no mailbox or identity is inferred from browser APIs. Public display names still require an explicit name and consent.
- No production D1 migration, database record, Worker secret, OAuth credential, owner bootstrap token, or production deployment was changed.
- Google identity linking remains controlled by the existing server-side configuration.
