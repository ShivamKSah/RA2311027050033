# Notification System Design

## Stage 1

### Priority Inbox Design

#### Problem
Users lose track of important notifications due to high volume. We need to always display the top 'n' most important unread notifications.

#### Priority Scoring
- **Type Weight**: Placement (3) > Result (2) > Event (1)
- **Recency**: Unix timestamp of the notification
- **Score Formula**: `score = (typeWeight × 1,000,000) + unixTimestamp`
- Type always dominates. Recency breaks ties within same type.

#### Data Structure: Min-Heap
- We maintain a **Min-Heap of size n**
- For each incoming notification, compute its score
- If heap size < n: push it directly
- If new score > heap minimum: pop min, push new notification
- Otherwise: discard — it doesn't belong in the top n
- **Time Complexity**: O(m log k) where m = total notifications, k = top n size
- **Space Complexity**: O(k)

#### Handling Continuous Incoming Notifications
- The `addNotification()` function handles live updates in **O(log k)** time
- No need to re-sort the entire list on every new arrival
- The heap always maintains exactly the top n highest priority notifications

#### Implementation Details

##### MinHeap Class
```
Methods:
- push(item)    → Insert scored notification, bubble up
- pop()         → Remove min, bubble down, return it
- peek()        → View min without removal
- size()        → Current heap count
- toSortedArray() → Extract all items sorted by score descending
```

##### Score Examples
| Type      | Weight | Timestamp           | Unix     | Score          |
|-----------|--------|---------------------|----------|----------------|
| Placement | 3      | 2026-05-02 10:00:00 | 17806962 | 3000000+17806962 |
| Result    | 2      | 2026-05-02 09:00:00 | 17806926 | 2000000+17806926 |
| Event     | 1      | 2026-05-02 07:00:00 | 17806854 | 1000000+17806854 |

##### Test Results
- 18 mock notifications (6 Placement, 5 Result, 7 Event)
- Top 10 correctly returns all 6 Placements followed by top 4 Results
- `addNotification()` correctly adds high-priority items and discards low-priority ones
- All tests pass ✅
