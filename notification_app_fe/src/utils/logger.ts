
import { Stack, Level, Package } from "logging-middleware/src/types";

const LOG_ENDPOINT = "/api/proxy/evaluation-service/logs";

export async function InternalLog(
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
      const errorText = await response.text();
      console.error(`InternalLog failed with status ${response.status}: ${errorText}`, payload);
    } else {
      console.log(`InternalLog success for: ${message.substring(0, 20)}...`);
    }
  } catch (err) {
    console.error("InternalLog network error:", err);
  }
}
