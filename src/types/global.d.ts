/*
 * GROKKER, a Grok Discord bot
 * Copyright (c) 2025 Prism and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

declare module "bun:sqlite" {
    export interface Database {
        run(sql: string, ...params: unknown[]): void;
        query<T = unknown>(
            sql: string,
            ...params: unknown[]
        ): {
            all(params?: Record<string, unknown>): T[];
            get(params?: Record<string, unknown>): T;
        };
        close(): void;
    }

    export const Database: {
        new (
            path?: string,
            options?: { create?: boolean; readonly?: boolean; strict?: boolean }
        ): Database;
    };
}
