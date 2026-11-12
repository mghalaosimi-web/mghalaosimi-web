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

## Optional Google identity linking

- Google sign-in is user-initiated; opening the site never triggers OAuth.
- The Worker uses Authorization Code flow with PKCE, a random single-use state value, a ten-minute transaction lifetime, and server-side token exchange. The browser never receives the Google client secret or access token.
- The callback reads the Google UserInfo endpoint over HTTPS and accepts only an identity with a verified email and stable subject identifier.
- The verified email and Google profile name remain private in `follower_identities`. They are not automatically copied into the public follower name. Public display still requires the existing explicit name + consent action.
- A signed-in identity can be linked across browsers to one follower record. Existing reactions/comments are transferred when a guest browser is linked to an already-known Google identity; duplicate reactions are ignored.
- Apply the migration first, then set `GOOGLE_AUTH_ENABLED=true`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (server-side secret), `GOOGLE_REDIRECT_URI`, and `PUBLIC_SITE_URL`. The explicit enable flag keeps the feature off until the schema is ready. Redirect URI must exactly match the URI registered in Google Cloud Console and point to `/api/public/auth/google/callback` on the Worker.
- Apply migration `0006_google_follower_identity.sql` before enabling the OAuth endpoints. No credentials, migration, or deployment are included in this source change.
- Disable/withdraw access in Google account settings to revoke Google consent; account deletion/unlinking should be implemented as a separate explicit privacy workflow before public launch.
