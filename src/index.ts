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
    logger.debug("Initiating performCheck");
    const newVersion = await checker.checkForUpdate();
    if (newVersion) {
        await notifier.notify(
            channel,
            `🔄 **Grok** has been updated to a new version.`
        );
    }
}

notifier.onReady(async (channel: TextChannel) => {
    logger.info("Bot ready, performing initial check");
    await performCheck(channel);
    logger.info(`Scheduling checks every ${config.checkIntervalMs / 1000}s`);
    setInterval(async () => {
        logger.debug("Scheduled check triggered");
        await performCheck(channel);
    }, config.checkIntervalMs);
});

process.on("unhandledRejection", (reason) => {
    logger.error({ reason }, "Unhandled Rejection");
});
