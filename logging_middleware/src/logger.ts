/**
 * Core logging function that sends structured log entries
 * to the evaluation service API endpoint.
 *
 * Reads the Bearer token from NEXT_PUBLIC_BEARER_TOKEN environment variable.
 * All log failures are caught silently to prevent app crashes.
 */

import { Stack, Level, Package } from "./types";

/** Evaluation service log endpoint */
const LOG_ENDPOINT = "/api/proxy/evaluation-service/logs";

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
    console.log("Logger debugging:", { token: token ? "exists" : "missing", endpoint: LOG_ENDPOINT });

    if (!token) {
      console.warn("Logger: No token found in environment");
      return;
    }

    const payload = {
      stack,
      level,
      package: pkg,
      message: message.length > 48 ? message.substring(0, 45) + "..." : message,
    };
    console.log("Logger payload:", payload);

    const response = await fetch(LOG_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Log failed with status ${response.status}: ${errorText}`);
    }
  } catch (err) {
    console.error("Logger encountered a network error:", err);
  }
}
