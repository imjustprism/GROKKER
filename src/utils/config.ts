/*
 * GROKKER, a Grok Discord bot
 * Copyright (c) 2025 Prism and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { DEFAULT_CHECK_INTERVAL_MS, DEFAULT_DB_PATH } from "@utils/constants";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

function requireEnv(name: string): string {
    const val = process.env[name];
    if (!val) {
        console.error(`Missing required env var ${name}`);
        process.exit(1);
    }
    return val;
}

export const config = {
    discordToken: requireEnv("DISCORD_TOKEN"),
    guildId: requireEnv("GUILD_ID"),
    channelId: requireEnv("CHANNEL_ID"),
    targetUrl: requireEnv("GROK_URL"),
    checkIntervalMs:
        Number(process.env.CHECK_INTERVAL_MS) || DEFAULT_CHECK_INTERVAL_MS,
    dbPath: process.env.DB_PATH || DEFAULT_DB_PATH,
};
