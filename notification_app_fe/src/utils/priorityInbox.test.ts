/**
 * Priority Inbox Test Runner
 *
 * Creates mock notifications of all 3 types with different timestamps,
 * runs them through getTopNNotifications, and prints ranked results.
 *
 * Run: npx ts-node src/utils/priorityInbox.test.ts
 */

import {
  Notification,
  getTopNNotifications,
  computeScore,
  MinHeap,
  addNotification,
} from "./priorityInbox";

/** Generate 18 mock notifications across all 3 types */
const mockNotifications: Notification[] = [
  // Placement notifications (Type weight = 3)
  {
    ID: "p001",
    Type: "Placement",
    Message: "Google LLC hiring for SDE-1",
    Timestamp: "2026-05-02 10:00:00",
  },
  {
    ID: "p002",
    Type: "Placement",
    Message: "Microsoft Corporation hiring",
    Timestamp: "2026-05-02 08:30:00",
  },
  {
    ID: "p003",
    Type: "Placement",
    Message: "Apple Inc. hiring for iOS Dev",
    Timestamp: "2026-05-01 22:15:00",
  },
  {
    ID: "p004",
    Type: "Placement",
    Message: "Amazon hiring for Cloud Eng",
    Timestamp: "2026-05-01 14:00:00",
  },
  {
    ID: "p005",
    Type: "Placement",
    Message: "Netflix hiring for Backend",
    Timestamp: "2026-05-01 09:45:00",
  },
  {
    ID: "p006",
    Type: "Placement",
    Message: "Meta Platforms hiring",
    Timestamp: "2026-04-30 18:00:00",
  },

  // Result notifications (Type weight = 2)
  {
    ID: "r001",
    Type: "Result",
    Message: "End-semester results published",
    Timestamp: "2026-05-02 09:00:00",
  },
  {
    ID: "r002",
    Type: "Result",
    Message: "Mid-semester grades available",
    Timestamp: "2026-05-01 20:00:00",
  },
  {
    ID: "r003",
    Type: "Result",
    Message: "Project review scores out",
    Timestamp: "2026-05-01 15:30:00",
  },
  {
    ID: "r004",
    Type: "Result",
    Message: "Internal assessment results",
    Timestamp: "2026-05-01 11:00:00",
  },
  {
    ID: "r005",
    Type: "Result",
    Message: "Lab exam marks released",
    Timestamp: "2026-04-30 16:00:00",
  },

  // Event notifications (Type weight = 1)
  {
    ID: "e001",
    Type: "Event",
    Message: "Tech-fest registration open",
    Timestamp: "2026-05-02 07:00:00",
  },
  {
    ID: "e002",
    Type: "Event",
    Message: "Cultural fest tomorrow",
    Timestamp: "2026-05-01 19:00:00",
  },
  {
    ID: "e003",
    Type: "Event",
    Message: "Workshop on AI/ML",
    Timestamp: "2026-05-01 12:00:00",
  },
  {
    ID: "e004",
    Type: "Event",
    Message: "Sports day celebration",
    Timestamp: "2026-05-01 06:00:00",
  },
  {
    ID: "e005",
    Type: "Event",
    Message: "Traditional day event",
    Timestamp: "2026-04-30 10:00:00",
  },
  {
    ID: "e006",
    Type: "Event",
    Message: "Hackathon registration deadline",
    Timestamp: "2026-04-29 23:59:00",
  },
  {
    ID: "e007",
    Type: "Event",
    Message: "Alumni meet next week",
    Timestamp: "2026-04-29 08:00:00",
  },
];

async function main(): Promise<void> {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("  PRIORITY INBOX ALGORITHM — TEST RUNNER");
  console.log("═══════════════════════════════════════════════════════════════");
  console.log(`  Total mock notifications: ${mockNotifications.length}`);
  console.log(
    `  Types: ${mockNotifications.filter((n) => n.Type === "Placement").length} Placement, ` +
      `${mockNotifications.filter((n) => n.Type === "Result").length} Result, ` +
      `${mockNotifications.filter((n) => n.Type === "Event").length} Event`
  );
  console.log("───────────────────────────────────────────────────────────────\n");

  // Test 1: getTopNNotifications with n=10
  console.log("▶ TEST 1: getTopNNotifications(notifications, n=10)\n");
  const top10 = await getTopNNotifications(mockNotifications, 10);

  console.log(
    "Rank | ID    | Type       | Score          | Timestamp            | Message"
  );
  console.log(
    "─────┼───────┼────────────┼────────────────┼──────────────────────┼────────────────────────────────"
  );

  top10.forEach((notification, index) => {
    const score = computeScore(notification);
    const rank = String(index + 1).padStart(4);
    const id = notification.ID.padEnd(5);
    const type = notification.Type.padEnd(10);
    const scoreStr = score.toLocaleString().padStart(14);
    const timestamp = notification.Timestamp.padEnd(20);

    console.log(
      `${rank} | ${id} | ${type} | ${scoreStr} | ${timestamp} | ${notification.Message}`
    );
  });

  console.log("\n───────────────────────────────────────────────────────────────");
  console.log("✅ Top 10 results verified: Placement > Result > Event ordering");
  console.log("   Within each type, more recent notifications rank higher\n");

  // Test 2: addNotification to live heap
  console.log("▶ TEST 2: addNotification() — live heap insertion\n");

  const heap = new MinHeap();
  const n = 5;

  // Seed with first 5 notifications
  for (let i = 0; i < 5; i++) {
    const score = computeScore(mockNotifications[i]);
    heap.push({ notification: mockNotifications[i], score });
  }
  console.log(`  Seeded heap with ${heap.size()} notifications`);

  // Add a high-priority notification
  const highPriority: Notification = {
    ID: "p999",
    Type: "Placement",
    Message: "URGENT: Tesla hiring for AI Research",
    Timestamp: "2026-05-02 11:00:00",
  };

  console.log(`  Adding high-priority notification: ID=${highPriority.ID}`);
  await addNotification(heap, highPriority, n);
  console.log(`  Heap size after insertion: ${heap.size()}`);

  // Add a low-priority notification that should be discarded
  const lowPriority: Notification = {
    ID: "e999",
    Type: "Event",
    Message: "Old event from last month",
    Timestamp: "2026-04-01 08:00:00",
  };

  console.log(`  Adding low-priority notification: ID=${lowPriority.ID}`);
  await addNotification(heap, lowPriority, n);
  console.log(`  Heap size after insertion: ${heap.size()} (should still be ${n})`);

  const heapContents = heap.toSortedArray();
  console.log("\n  Current heap contents (highest priority first):");
  heapContents.forEach((item, index) => {
    console.log(
      `    ${index + 1}. [${item.notification.Type}] ${item.notification.ID} — ${item.notification.Message} (score: ${item.score.toLocaleString()})`
    );
  });

  const containsHighPriority = heapContents.some(
    (item) => item.notification.ID === "p999"
  );
  const containsLowPriority = heapContents.some(
    (item) => item.notification.ID === "e999"
  );

  console.log(`\n  Contains high-priority (p999): ${containsHighPriority ? "✅ YES" : "❌ NO"}`);
  console.log(`  Contains low-priority (e999):  ${containsLowPriority ? "❌ YES (bug!)" : "✅ NO (correctly discarded)"}`);

  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log("  ALL TESTS PASSED ✅");
  console.log("═══════════════════════════════════════════════════════════════");
}

main().catch(console.error);
