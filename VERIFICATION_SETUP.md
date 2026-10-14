# Discord sign-in setup

1. Create a Discord application in the Discord Developer Portal.
2. Under OAuth2, add the exact redirect: https://YOUR-PROJECT.vercel.app/api/auth/discord/callback.
3. The website requests only the identify scope.
4. Configure Vercel environment variables: PUBLIC_SITE_URL, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, SESSION_SECRET, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN.
5. Redeploy, open the site, and choose Continue with Discord.

Upstash Redis stores the sign-in session and public member profile. Discord sign-in confirms the visitor’s Discord identity; no Roblox linking is required.
