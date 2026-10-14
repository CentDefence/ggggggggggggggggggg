# TRS CIS League

Classic Discord sign-in, a verified member directory, and public member profiles. The earlier league pages remain at /league.html.

## Deploy

1. Upload the contents of this directory to the root of the GitHub repository. Keep api/ at the repository root. Connect the repository to Vercel; GitHub Pages cannot run the API routes.
2. Create an Upstash Redis database. Add the variables from .env.example in Vercel Project Settings → Environment Variables.
3. Create a Discord application. In OAuth2 Redirects add https://YOUR-PROJECT.vercel.app/api/auth/discord/callback. The only requested OAuth scope is identify.
4. Set PUBLIC_SITE_URL, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, Redis URL/token, and a unique random SESSION_SECRET of at least 32 characters.
5. Redeploy after saving the environment variables.

## Features

- Discord OAuth sign-in; passwords are entered only on Discord.
- Member profile created after successful Discord sign-in.
- Public member directory and profile tabs: Overview, Registration, Achievements, Integrations.
- Optional Discord interactions endpoint at /api/discord/interactions.

Routes: /, /profile.html, /profile.html?u=DISCORD_USER_ID, and /league.html.
