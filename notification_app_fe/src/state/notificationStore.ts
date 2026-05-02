/**
 * Notification Store
 *
 * Manages read/unread status of notifications using localStorage.
 * All notifications start as unread on first load.
 */

import { Log } from "logging-middleware/src";

/** localStorage key for viewed notification IDs */
const STORAGE_KEY = "viewedNotificationIds";

/**
 * Marks a notification as viewed by storing its ID in localStorage.
 */
export function markAsViewed(id: string): void {
  try {
    const viewed = getViewedIds();
    if (!viewed.includes(id)) {
      viewed.push(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(viewed));
      Log("frontend", "info", "state", `Notification marked as viewed: ${id}`);
    }
  } catch {
    // localStorage may not be available (SSR)
  }
}

/**
 * Checks if a notification has been viewed.
 */
export function isViewed(id: string): boolean {
  try {
    const viewed = getViewedIds();
    return viewed.includes(id);
  } catch {
    return false;
  }
}

/**
 * Returns all viewed notification IDs from localStorage.
 */
export function getViewedIds(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as string[];
    }
  } catch {
    // localStorage may not be available (SSR) or parse error
  }
  return [];
}
