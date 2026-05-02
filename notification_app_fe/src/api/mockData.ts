import { ApiNotification } from "./notificationsApi";

export const MOCK_NOTIFICATIONS: ApiNotification[] = [
  { "ID": "p001", "Type": "Placement", "Message": "Google LLC hiring for SDE-1", "Timestamp": "2026-05-02 10:00:00" },
  { "ID": "p002", "Type": "Placement", "Message": "Microsoft Corporation hiring", "Timestamp": "2026-05-02 08:30:00" },
  { "ID": "p003", "Type": "Placement", "Message": "Apple Inc. hiring for iOS Dev", "Timestamp": "2026-05-01 22:15:00" },
  { "ID": "p004", "Type": "Placement", "Message": "Amazon hiring for Cloud Eng", "Timestamp": "2026-05-01 14:00:00" },
  { "ID": "p005", "Type": "Placement", "Message": "Netflix hiring for Backend", "Timestamp": "2026-05-01 09:45:00" },
  { "ID": "p006", "Type": "Placement", "Message": "Meta Platforms hiring", "Timestamp": "2026-04-30 18:00:00" },
  { "ID": "r001", "Type": "Result", "Message": "End-semester results published", "Timestamp": "2026-05-02 09:00:00" },
  { "ID": "r002", "Type": "Result", "Message": "Mid-semester grades available", "Timestamp": "2026-05-01 20:00:00" },
  { "ID": "r003", "Type": "Result", "Message": "Project review scores out", "Timestamp": "2026-05-01 15:30:00" },
  { "ID": "r004", "Type": "Result", "Message": "Internal assessment results", "Timestamp": "2026-05-01 11:00:00" },
  { "ID": "r005", "Type": "Result", "Message": "Lab exam marks released", "Timestamp": "2026-04-30 16:00:00" },
  { "ID": "e001", "Type": "Event", "Message": "Tech-fest registration open", "Timestamp": "2026-05-02 07:00:00" },
  { "ID": "e002", "Type": "Event", "Message": "Cultural fest tomorrow", "Timestamp": "2026-05-01 19:00:00" },
  { "ID": "e003", "Type": "Event", "Message": "Workshop on AI/ML", "Timestamp": "2026-05-01 12:00:00" },
  { "ID": "e004", "Type": "Event", "Message": "Sports day celebration", "Timestamp": "2026-05-01 06:00:00" },
  { "ID": "e005", "Type": "Event", "Message": "Traditional day event", "Timestamp": "2026-04-30 10:00:00" },
  { "ID": "e006", "Type": "Event", "Message": "Hackathon registration deadline", "Timestamp": "2026-04-29 23:59:00" },
  { "ID": "e007", "Type": "Event", "Message": "Alumni meet next week", "Timestamp": "2026-04-29 08:00:00" }
];
