/*
 * GROKKER, a Grok Discord bot
 * Copyright (c) 2025 Prism and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { SENTRY_RELEASE_REGEX } from "@utils/constants";
import { databaseService } from "@utils/db";
import { logger } from "@utils/logger";
import fetch from "node-fetch";

export class ReleaseChecker {
    constructor(private readonly targetUrl: string) {}

    async checkForUpdate(): Promise<string | null> {
        logger.debug({ targetUrl: this.targetUrl }, "Starting release check");
        const previousVersion = databaseService.getLastVersion();
        logger.debug({ previousVersion }, "Previous stored version");

        let bundleUrl: string;
        let foundRelease: string | null = null;

        try {
            const indexRes = await fetch(this.targetUrl);
            if (!indexRes.ok) {
                logger.error(
                    {
                        status: indexRes.status,
                        statusText: indexRes.statusText,
                    },
                    "Failed to fetch index page"
                );
                return null;
            }
            const indexHtml = await indexRes.text();
            logger.debug(
                { length: indexHtml.length },
                "Fetched index.html length"
            );

            const scriptSrcs: string[] = [];
            for (const match of indexHtml.matchAll(
                /<script[^>]+src=['"]([^'"]+)['"]/gi
            )) {
                const src = match[1];
                if (src) {
                    scriptSrcs.push(src);
                }
            }
            logger.debug({ scriptSrcs }, "Discovered <script> tags");

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
            logger.debug({ bundleUrl }, "Resolved main JS bundle URL");

            const bundleRes = await fetch(bundleUrl);
            if (!bundleRes.ok) {
                logger.error(
                    {
                        status: bundleRes.status,
                        statusText: bundleRes.statusText,
                    },
                    "Failed to fetch main JS bundle"
                );
                return null;
            }
            const bundleText = await bundleRes.text();
            logger.debug({ length: bundleText.length }, "Fetched bundle text");

            const idx = bundleText.search(/release/i);
            if (idx >= 0) {
                const snippet = bundleText.slice(
                    Math.max(0, idx - 100),
                    idx + 100
                );
                logger.trace({ snippet }, "Bundle snippet around “release”");
            }

            const match = bundleText.match(SENTRY_RELEASE_REGEX);
            foundRelease = match ? match[1] ?? match[2] ?? null : null;
            logger.debug({ foundRelease }, "Extracted Sentry release ID");
        } catch (err) {
            logger.error({ err }, "Unexpected error during fetch/parsing");
            return null;
        }

        if (!foundRelease) {
            logger.info("No Sentry release ID found in bundle");
            return null;
        }
        if (foundRelease === previousVersion) {
            logger.info({ previousVersion }, "Version unchanged");
            return null;
        }

        databaseService.setLastVersion(foundRelease);
        logger.info(
            { oldVersion: previousVersion, newVersion: foundRelease },
            "New version detected"
        );
        return foundRelease;
    }
}
