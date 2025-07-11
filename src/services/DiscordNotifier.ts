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
        this.client.login(this.token).catch((err) => {
            logger.fatal({ err }, "Discord login failed");
        });
    }

    onReady(callback: (channel: TextChannel) => Promise<void>): void {
        this.client.once("ready", async () => {
            logger.info(
                { user: this.client.user?.tag },
                "Discord client ready"
            );
            const guild = await this.client.guilds.fetch(this.guildId);
            const channel = (await guild.channels.fetch(
                this.channelId
            )) as TextChannel;

            await this.client.user?.setActivity("Grok updates", {
                type: ActivityType.Watching,
            } as ActivitiesOptions);

            try {
                await callback(channel);
            } catch (err) {
                logger.error({ err }, "Error in onReady callback");
            }
        });
    }

    notify(channel: TextChannel, message: string) {
        return channel.send(message);
    }
}
