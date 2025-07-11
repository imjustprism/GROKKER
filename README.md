# GROKKER

A minimalistic bot that monitors updates to [grok.com](https://grok.com) and notifies a Discord channel when a new version is released.

## Features

-   Periodically checks grok.com for new releases
-   Notifies a Discord channel of updates
-   Stores version history locally
-   Simple configuration via environment variables

## Quick Start

1. **Install dependencies:**

    ```bash
    bun install
    ```

2. **Configure environment variables:**
   Create a `.env` file in the project root with the following:

    ```env
    DISCORD_TOKEN=your_discord_bot_token
    GUILD_ID=your_discord_server_id
    CHANNEL_ID=your_discord_channel_id
    GROK_URL=https://grok.com/
    # Optional:
    # CHECK_INTERVAL_MS=60000
    # DB_PATH=grok.db
    # LOG_LEVEL=info
    ```

3. **Run the bot:**
    ```bash
    bun run start
    # or
    bun run src/index.ts
    ```

## Scripts

-   `bun run start` — Start the bot
-   `bun run src/index.ts` — Start the bot (direct entry)
-   `bun run lint` — Lint the codebase
-   `bun run lint:fix` — Auto-fix lint issues

## Tech Stack

-   [Bun](https://bun.sh) — Fast all-in-one JavaScript runtime
-   [Discord.js](https://discord.js.org/)
-   [node-fetch](https://www.npmjs.com/package/node-fetch)
-   [Pino](https://getpino.io/) for logging

---

Licensed under the [GNU GPL v3 License](LICENSE).
