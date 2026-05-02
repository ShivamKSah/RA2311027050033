/**
 * Core logging function that sends structured log entries
 * to the evaluation service API endpoint.
 *
 * Reads the Bearer token from NEXT_PUBLIC_BEARER_TOKEN environment variable.
 * All log failures are caught silently to prevent app crashes.
 */

import { Stack, Level, Package } from "./types";

/** Evaluation service log endpoint */
const LOG_ENDPOINT = "http://20.207.122.201/evaluation-service/logs";

/**
 * Sends a structured log entry to the remote logging service.
 *
 * @param stack   - The application stack layer ("frontend" | "backend")
 * @param level   - The severity level of the log
 * @param pkg     - The package/module originating the log
 * @param message - Human-readable log message
 *
 * @returns Promise<void> - Resolves when the log is sent (or silently fails)
 */
export async function Log(
  stack: Stack,
  level: Level,
  pkg: Package,
  message: string
): Promise<void> {
  try {
    const token = process.env.NEXT_PUBLIC_BEARER_TOKEN;

    if (!token) {
      // Cannot log without a token — fail silently
      return;
    }

    await fetch(LOG_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message,
      }),
    });
  } catch {
    // Silently catch all errors — logging must never crash the application
  }
}
