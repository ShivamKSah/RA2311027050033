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

    const response = await fetch(LOG_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Prevent console spam if session is expired
        if (!(globalThis as any)._authErrorLogged) {
          console.warn("Logger: Remote session expired (401). Logs will be redirected to console only.");
          (globalThis as any)._authErrorLogged = true;
        }
        console.log(`[Remote Log Suppressed] ${level.toUpperCase()} [${pkg}]: ${message}`);
        return;
      }
      
      const errorText = await response.text();
      console.error(`Log failed with status ${response.status}: ${errorText}`);
    }
  } catch (err) {
    if (!(globalThis as any)._networkErrorLogged) {
       console.error("Logger: Remote logging unavailable (Network Error). Logs redirected to console.");
       (globalThis as any)._networkErrorLogged = true;
    }
    console.log(`[Remote Log Suppressed] ${level.toUpperCase()} [${pkg}]: ${message}`);
  }
}
