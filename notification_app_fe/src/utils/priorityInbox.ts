/**
 * Priority Inbox Algorithm
 *
 * Implements a MinHeap-based priority system for campus notifications.
 * Prioritises notifications by type weight (Placement > Result > Event)
 * and uses recency (Unix timestamp) as a tiebreaker within the same type.
 *
 * Score Formula: score = (typeWeight × 1,000,000) + unixTimestamp
 */

import { Log } from "logging-middleware/src";

/* ─── Types ──────────────────────────────────────────────────────────── */

/** Shape of a notification returned by the evaluation service API */
export interface Notification {
  ID: string;
  Type: "Placement" | "Result" | "Event";
  Message: string;
  Timestamp: string; // format: "2026-04-22 17:51:30"
}

/** Internal representation with precomputed priority score */
interface ScoredNotification {
  notification: Notification;
  score: number;
}

/* ─── Constants ──────────────────────────────────────────────────────── */

/** Type weights — higher means more important */
const TYPE_WEIGHTS: Record<Notification["Type"], number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

/** Multiplier to ensure type always dominates over timestamp */
const TYPE_MULTIPLIER = 1_000_000;

/* ─── Score Computation ──────────────────────────────────────────────── */

/**
 * Computes a priority score for a notification.
 * Type always dominates; recency breaks ties within the same type.
 */
export function computeScore(notification: Notification): number {
  const typeWeight = TYPE_WEIGHTS[notification.Type] ?? 1;
  const unixTimestamp = Math.floor(
    new Date(notification.Timestamp).getTime() / 1000
  );
  return typeWeight * TYPE_MULTIPLIER + unixTimestamp;
}

/* ─── MinHeap ────────────────────────────────────────────────────────── */

/**
 * A Min-Heap implementation that keeps the lowest-scored notification
 * at the top. Used to efficiently maintain a sliding window of the
 * top N highest-priority notifications.
 */
export class MinHeap {
  private heap: ScoredNotification[] = [];

  /** Returns the number of items in the heap */
  size(): number {
    return this.heap.length;
  }

  /** Returns the minimum-scored item without removing it */
  peek(): ScoredNotification | undefined {
    return this.heap[0];
  }

  /** Inserts a scored notification into the heap */
  push(item: ScoredNotification): void {
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

  /** Removes and returns the minimum-scored item */
  pop(): ScoredNotification | undefined {
    if (this.heap.length === 0) return undefined;

    const min = this.heap[0];
    const last = this.heap.pop()!;

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }

    return min;
  }

  /** Returns all items sorted by score descending (highest first) */
  toSortedArray(): ScoredNotification[] {
    return [...this.heap].sort((a, b) => b.score - a.score);
  }

  /* ── Internal heap operations ────────────────────────────────────── */

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex].score <= this.heap[index].score) break;
      this.swap(index, parentIndex);
      index = parentIndex;
    }
  }

  private bubbleDown(index: number): void {
    const length = this.heap.length;

    while (true) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (left < length && this.heap[left].score < this.heap[smallest].score) {
        smallest = left;
      }
      if (
        right < length &&
        this.heap[right].score < this.heap[smallest].score
      ) {
        smallest = right;
      }

      if (smallest === index) break;
      this.swap(index, smallest);
      index = smallest;
    }
  }

  private swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
}

/* ─── Core Functions ─────────────────────────────────────────────────── */

/**
 * Returns the top N highest-priority notifications using a MinHeap.
 *
 * Algorithm:
 * 1. Iterate through all notifications
 * 2. Maintain a MinHeap of size n (the top n highest-scored items)
 * 3. For each notification:
 *    - If heap has room (< n): push directly
 *    - Else if score > heap minimum: pop min, push new item
 *    - Otherwise: discard (not in top n)
 * 4. Extract and return sorted results (highest score first)
 *
 * Time complexity: O(m log n) where m = total notifications, n = desired top count
 * Space complexity: O(n)
 */
export async function getTopNNotifications(
  notifications: Notification[],
  n: number
): Promise<Notification[]> {
  try {
    await Log(
      "frontend",
      "info",
      "utils",
      `Computing top N priority notifications, n=${n}`
    );

    const heap = new MinHeap();

    for (const notification of notifications) {
      const score = computeScore(notification);
      const scored: ScoredNotification = { notification, score };

      if (heap.size() < n) {
        heap.push(scored);
      } else {
        const min = heap.peek();
        if (min && score > min.score) {
          heap.pop();
          heap.push(scored);
        }
      }
    }

    // Extract results sorted by highest score first
    const sorted = heap.toSortedArray();
    return sorted.map((item) => item.notification);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    await Log(
      "frontend",
      "error",
      "utils",
      `Error in priority inbox computation: ${errorMessage}`
    );
    return [];
  }
}

/**
 * Adds a single notification to a live MinHeap, maintaining exactly
 * the top N highest-priority items at all times.
 *
 * - If heap size < n: push directly
 * - If new score > heap minimum: pop min, push new notification
 * - Otherwise: discard
 *
 * Time complexity: O(log n)
 */
export async function addNotification(
  heap: MinHeap,
  notification: Notification,
  n: number
): Promise<void> {
  try {
    const score = computeScore(notification);
    const scored: ScoredNotification = { notification, score };

    if (heap.size() < n) {
      heap.push(scored);
    } else {
      const min = heap.peek();
      if (min && score > min.score) {
        heap.pop();
        heap.push(scored);
      }
      // Otherwise discard — it doesn't belong in top n
    }

    await Log(
      "frontend",
      "debug",
      "utils",
      `New notification added to priority heap, ID=${notification.ID}`
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    await Log(
      "frontend",
      "error",
      "utils",
      `Error in priority inbox computation: ${errorMessage}`
    );
  }
}
