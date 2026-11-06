# M.GH.AL public social engagement

## Visitor and guest-follow lifecycle

- The first page visit creates or reuses a random 256-bit visitor token stored in the browser's local storage.
- The API stores only a SHA-256-derived visitor key, not the raw token.
- A new visitor is represented as an anonymous guest follow (status active, display_name NULL, consent_at NULL).
- Anonymous guest follows are private: they are not included in the public named-follower count. The admin followers endpoint may show them as “زائر مجهول” with an is_guest flag, without exposing an email or public display name.
- The follow panel explains that the visitor is anonymous, that the site cannot read the visitor's email account, and that no email notifications are sent.
- A visitor can stop following from the panel. A visitor can optionally publish a display name only by entering it and checking the explicit consent box.
- Explicitly named followers have consent_at set and are counted separately from anonymous guest follows.
- A visitor who has unsubscribed is not silently reactivated by a later page view using the same browser token.

## Email and identity

A normal browser page cannot read a visitor's mailbox address or account profile. Do not infer an email address or a real name from browser data. This implementation deliberately does not collect email. A future Google/OIDC sign-in can supply a verified email only after a user-driven authentication flow and explicit account-linking decision.

## Reactions

- Like and clap actions are persisted server-side and deduplicated by target, visitor, and reaction.
- The public reactions endpoint returns aggregate counts and viewer-specific state when a valid visitor token is supplied.
- The client renders the server's viewer-specific state instead of trusting a local-only likes cache.
- Reactions are limited to published articles and published projects.

## Privacy and operational notes

- navigator.doNotTrack === '1' prevents visitor-session creation in the public scripts.
- Guest-follow records have no display name and no consent timestamp; they are not a marketing mailing list.
- The token is pseudonymous, not anonymous in the strict legal sense. Review retention, cookie/local-storage disclosure, consent requirements, and applicable privacy notices before production release.
- This branch does not apply migrations, alter production D1, configure an email provider, or deploy the Worker.
