/*
 * GROKKER, a Grok Discord bot
 * Copyright (c) 2025 Prism and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { config } from "@utils/config";
import { Database } from "bun:sqlite";

export class DatabaseService {
    private db: Database;

    constructor(dbPath: string) {
        this.db = new Database(dbPath, { create: true });
        this.db.run(`
      CREATE TABLE IF NOT EXISTS version_history (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        last_version TEXT NOT NULL
      );
    `);
    }

    getLastVersion(): string | null {
        const [row] = this.db
            .query<{ last_version: string; }>(
                "SELECT last_version FROM version_history WHERE id = 1"
            )
            .all();
        return row?.last_version ?? null;
    }

    setLastVersion(version: string): void {
        this.db.run(
            "REPLACE INTO version_history (id, last_version) VALUES (1, ?)",
            version
        );
    }
}

export const databaseService = new DatabaseService(config.dbPath);
