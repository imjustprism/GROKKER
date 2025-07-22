/*
 * GROKKER, a Grok Discord bot
 * Copyright (c) 2025 Prism and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import fs from "fs";
import path from "path";
import pino from "pino";

const logDir = path.resolve(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

export const logger = pino({
    level: process.env.LOG_LEVEL || "warn",
    transport: {
        targets: [
            {
                level: "warn",
                target: "pino/file",
                options: {
                    destination: path.join(logDir, "app.log"),
                    mkdir: true,
                },
            },
        ],
    },
    timestamp: pino.stdTimeFunctions.isoTime,
});
