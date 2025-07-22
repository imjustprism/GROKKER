/*
 * GROKKER, a Grok Discord bot
 * Copyright (c) 2025 Prism and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { config } from "@utils/config";
import { logger } from "@utils/logger";
import { Database } from "bun:sqlite";

export class DatabaseService {
    private db: Database;

    constructor(dbPath: string) {
        this.db = new Database(dbPath, { create: true });
        try {
            this.db.run(`
      CREATE TABLE IF NOT EXISTS version_history (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        last_version TEXT NOT NULL
      );
    `);
        } catch (err) {
            logger.error({ err }, "Failed to initialize database table");
        }
    }

    getLastVersion(): string | null {
        try {
            const [row] = this.db
                .query<{ last_version: string; }>(
                    "SELECT last_version FROM version_history WHERE id = 1"
                )
                .all();
            return row?.last_version ?? null;
        } catch (err) {
            logger.error({ err }, "Failed to get last version from database");
            return null;
        }
    }

    setLastVersion(version: string): void {
        try {
            this.db.run(
                "REPLACE INTO version_history (id, last_version) VALUES (1, ?)",
                version
            );
        } catch (err) {
            logger.error({ err }, "Failed to set last version in database");
        }
    }
}

export const databaseService = new DatabaseService(config.dbPath);
