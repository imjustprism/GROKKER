/*
 * GROKKER, a Grok Discord bot
 * Copyright (c) 2025 Prism and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { SENTRY_RELEASE_REGEX } from "@utils/constants";
import { databaseService } from "@utils/db";
import { logger } from "@utils/logger";

async function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string, retries: number = 3, initialDelay: number = 1000): Promise<Response> {
    let delay = initialDelay;
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(url);
            if (res.ok) {
                return res;
            } else {
                throw new Error(`Fetch failed with status ${res.status}`);
            }
        } catch (err) {
            if (i === retries - 1) {
                throw err;
            }
            logger.warn({ err, url, attempt: i + 1 }, "Fetch attempt failed, retrying");
            await sleep(delay);
            delay *= 2; // Exponential backoff
        }
    }
    throw new Error("Unreachable code");
}

export class ReleaseChecker {
    constructor(private readonly targetUrl: string) { }

    async checkForUpdate(): Promise<string | null> {
        const previousVersion = databaseService.getLastVersion();

        let bundleUrl: string;
        let foundRelease: string | null = null;

        try {
            const indexRes = await fetchWithRetry(this.targetUrl);
            const indexHtml = await indexRes.text();

            const scriptSrcs: string[] = [];
            for (const match of indexHtml.matchAll(
                /<script[^>]+src=['"]([^'"]+)['"]/gi
            )) {
                const src = match[1];
                if (src) {
                    scriptSrcs.push(src);
                }
            }

            const mainScript = scriptSrcs.find((src) =>
                /main.*\.js$/i.test(src)
            );
            if (!mainScript) {
                logger.error(
                    { scriptSrcs },
                    "No <script> tag with “main…js” found"
                );
                return null;
            }
            bundleUrl = new URL(mainScript, this.targetUrl).toString();

            const bundleRes = await fetchWithRetry(bundleUrl);
            const bundleText = await bundleRes.text();

            const match = bundleText.match(SENTRY_RELEASE_REGEX);
            foundRelease = match ? match[1] ?? match[2] ?? null : null;
        } catch (err) {
            logger.error({ err }, "Unexpected error during fetch/parsing");
            return null;
        }

        if (!foundRelease) {
            return null;
        }
        if (foundRelease === previousVersion) {
            return null;
        }

        databaseService.setLastVersion(foundRelease);
        return foundRelease;
    }
}
