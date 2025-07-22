/*
 * GROKKER, a Grok Discord bot
 * Copyright (c) 2025 Prism and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { logger } from "@utils/logger";
import {
    type ActivitiesOptions,
    ActivityType,
    Client,
    GatewayIntentBits,
    type TextChannel,
} from "discord.js";

export class DiscordNotifier {
    private client: Client;

    constructor(
        private readonly token: string,
        private readonly guildId: string,
        private readonly channelId: string
    ) {
        this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
        this.client.on('error', (err) => logger.error({ err }, 'Discord client error'));
        this.client.on('warn', (warning) => logger.warn({ warning }, 'Discord client warning'));
        this.client.rest.on('rateLimited', (info) => logger.warn({ info }, 'Discord REST rate limited'));
        this.loginWithRetry();
    }

    private async loginWithRetry(): Promise<void> {
        let attempts = 0;
        const maxAttempts = 5;
        while (attempts < maxAttempts) {
            try {
                await this.client.login(this.token);
                return;
            } catch (err) {
                attempts++;
                logger.error({ err, attempts }, `Discord login failed, retrying in 10 seconds (attempt ${attempts}/${maxAttempts})`);
                await new Promise(resolve => setTimeout(resolve, 10000));
            }
        }
        logger.fatal("Discord login failed after maximum attempts");
    }

    onReady(callback: (channel: TextChannel) => Promise<void>): void {
        this.client.once("ready", async () => {
            try {
                const guild = await this.client.guilds.fetch(this.guildId);
                const channel = (await guild.channels.fetch(
                    this.channelId
                )) as TextChannel;

                await this.client.user?.setActivity("Grok updates", {
                    type: ActivityType.Watching,
                } as ActivitiesOptions);

                await callback(channel);
            } catch (err) {
                logger.error({ err }, "Error in ready handler");
            }
        });
    }

    notify(channel: TextChannel, message: string) {
        return channel.send(message);
    }
}
