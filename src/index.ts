/*
 * GROKKER, a Grok Discord bot
 * Copyright (c) 2025 Prism and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { DiscordNotifier } from "@services/DiscordNotifier";
import { ReleaseChecker } from "@services/ReleaseChecker";
import { config } from "@utils/config";
import { logger } from "@utils/logger";
import type { TextChannel } from "discord.js";

const checker = new ReleaseChecker(config.targetUrl);
const notifier = new DiscordNotifier(
    config.discordToken,
    config.guildId,
    config.channelId
);

async function performCheck(channel: TextChannel): Promise<void> {
    const newVersion = await checker.checkForUpdate();
    if (newVersion) {
        try {
            await notifier.notify(
                channel,
                `🔄 **Grok** has been updated to a new version.`
            );
        } catch (err) {
            logger.error({ err }, "Failed to send notification");
        }
    }
}

notifier.onReady(async (channel: TextChannel) => {
    await performCheck(channel);
    setInterval(async () => {
        try {
            await performCheck(channel);
        } catch (err) {
            logger.error({ err }, "Error in scheduled check");
        }
    }, config.checkIntervalMs);
});

process.on("unhandledRejection", (reason) => {
    logger.error({ reason }, "Unhandled Rejection");
});

process.on("uncaughtException", (err, origin) => {
    logger.error({ err, origin }, "Uncaught Exception");
});
