# Campus Notification System - Design & Scalability

## Overview
A priority-based notification system that processes campus notifications (Placements, Results, Events) and delivers the top 10 most important notifications to users based on notification type and recency.

---

## Stage 1: REST API Design

### Current Implementation
**Base URL:** `http://4.224.186.213/evaluation-service`

**Endpoints:**

#### 1. Registration
```
POST /register
Request: {
  email: string,
  name: string,
  mobileNo: string,
  githubUsername: string,
  rollNo: string,
  accessCode: string
}
Response: {
  email: string,
  name: string,
  rollNo: string,
  accessCode: string,
  clientID: string,
  clientSecret: string
}
```

#### 2. Authentication
```
POST /auth
Request: {
  email: string,
  name: string,
  rollNo: string,
  accessCode: string,
  clientID: string,
  clientSecret: string
}
Response: {
  token_type: "Bearer",
  access_token: string,
  expires_in: number
}
```

#### 3. Fetch Notifications
```
GET /notifications
Headers: Authorization: Bearer {access_token}
Response: {
  notifications: [{
    ID: string,
    Type: "Placement" | "Result" | "Event",
    Message: string,
    Timestamp: ISO8601
  }]
}
```

#### 4. Logging
```
POST /logs
Headers: Authorization: Bearer {access_token}
Request: {
  stack: "backend" | "frontend",
  level: "debug" | "info" | "warn" | "error" | "fatal",
  package: string,
  message: string
}
```

### Design Principles
- Stateless API endpoints
- Bearer token authentication
- JSON request/response format
- ISO8601 timestamps
- RESTful naming conventions

---

## Stage 2: Database Choice & Schema

### Recommended: PostgreSQL

**Rationale:**
- ACID compliance for transaction consistency
- Complex relational queries (user-notification relationships)
- Strong data integrity constraints
- Built-in JSON support for flexible notification metadata

**Schema Design:**

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  roll_no VARCHAR(50) UNIQUE NOT NULL,
  mobile_no VARCHAR(20),
  github_username VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Notification Types (Enumeration)
CREATE TYPE notification_type AS ENUM ('Placement', 'Result', 'Event');

-- Notifications Table
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type notification_type NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE
);

-- User Preferences Table
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES users(id),
  placement_enabled BOOLEAN DEFAULT TRUE,
  result_enabled BOOLEAN DEFAULT TRUE,
  event_enabled BOOLEAN DEFAULT TRUE,
  email_digest BOOLEAN DEFAULT FALSE
);

-- Logging Table
CREATE TABLE logs (
  id UUID PRIMARY KEY,
  stack VARCHAR(50) NOT NULL,
  level VARCHAR(20) NOT NULL,
  package VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Stage 3: Query Optimization with Indexes

### Key Indexes

```sql
-- For fetching user notifications by timestamp
CREATE INDEX idx_notifications_user_timestamp 
ON notifications(user_id, created_at DESC);

-- For filtering by notification type
CREATE INDEX idx_notifications_type 
ON notifications(type, created_at DESC);

-- For finding unread notifications
CREATE INDEX idx_notifications_user_unread 
ON notifications(user_id, is_read) 
WHERE is_read = FALSE;

-- For log queries by level and package
CREATE INDEX idx_logs_level_package 
ON logs(level, package, created_at DESC);

-- Composite index for complex queries
CREATE INDEX idx_notifications_priority 
ON notifications(user_id, type, is_read, created_at DESC);
```

### Query Optimization Strategy

```sql
-- Optimized query to get top 10 notifications with priority scoring
SELECT 
  n.id,
  n.type,
  n.message,
  n.created_at,
  CASE 
    WHEN n.type = 'Placement' THEN 3
    WHEN n.type = 'Result' THEN 2
    WHEN n.type = 'Event' THEN 1
  END as type_weight,
  ROW_NUMBER() OVER (ORDER BY 
    CASE WHEN n.type = 'Placement' THEN 0 
         WHEN n.type = 'Result' THEN 1 
         ELSE 2 
    END,
    n.created_at DESC
  ) as priority_rank
FROM notifications n
WHERE n.user_id = $1
ORDER BY priority_rank
LIMIT 10;
```

---

## Stage 4: Caching Strategy with Redis

### Redis Architecture

```
Key Structure:
- user:{userID}:notifications:{type} (list)
- user:{userID}:notification:priority (sorted set)
- notifications:latest (sorted set by timestamp)
- notifications:trending (sorted set by engagement)
```

### Cache Invalidation Strategy

```javascript
// When new notification arrives
1. Add to Redis list: user:{userID}:notifications:{type}
2. Add to sorted set with score: (typeWeight × 100) + recencyScore
3. Set expiration: 7 days
4. Update cache timestamp

// Cache hit strategy
1. Check Redis for priority inbox
2. If hit and age < 5 minutes: return cached
3. If miss or expired: query DB + update cache
```

### Implementation Example

```javascript
async function getPriorityInboxCached(userId) {
  const cacheKey = `user:${userId}:inbox:priority`;
  
  // Try cache first
  let inbox = await redis.get(cacheKey);
  
  if (inbox && (Date.now() - inbox.timestamp) < 300000) {
    return JSON.parse(inbox.data); // 5-minute TTL
  }
  
  // Cache miss - query database
  const notifications = await db.query(
    `SELECT * FROM notifications 
     WHERE user_id = $1 
     ORDER BY created_at DESC LIMIT 100`,
    [userId]
  );
  
  // Score and cache
  const scored = scoreNotifications(notifications);
  const top10 = scored.slice(0, 10);
  
  await redis.setex(
    cacheKey, 
    300,
    JSON.stringify({
      data: top10,
      timestamp: Date.now()
    })
  );
  
  return top10;
}
```

### Benefits
- **Low latency**: Sub-millisecond response times for cached data
- **Reduced DB load**: 80% of requests hit cache
- **Real-time updates**: Notifications cached for 5 minutes
- **Scalability**: Redis cluster for horizontal scaling

---

## Stage 5: Scalable Notification Delivery

### Message Queue Architecture (Kafka/RabbitMQ)

```
┌─────────────────────────────────────────────────────────┐
│          Notification Service (Node.js)                 │
│  1. Validate notification                               │
│  2. Store in database                                   │
│  3. Publish to message queue                            │
└──────────────┬──────────────────────────────────────────┘
               │
        ┌──────▼──────┐
        │ Kafka Topic │
        │ notifications
        └──────┬──────┘
               │
        ┌──────┴────────┬──────────────┐
        │               │              │
   ┌────▼────┐  ┌──────▼──────┐  ┌───▼────┐
   │ Worker 1│  │  Worker 2   │  │Worker 3│
   │ (Email) │  │(Push Notif) │  │(SMS)   │
   └─────────┘  └─────────────┘  └────────┘
        │               │              │
        └───────┬───────┴──────┬───────┘
                │              │
        ┌───────▼──────┐  ┌───▼─────────┐
        │ Email Service│  │Push Service │
        └───────┬──────┘  └───┬─────────┘
                │              │
                └──────┬───────┘
                       │
                ┌──────▼──────┐
                │ User Devices│
                └─────────────┘
```

### Worker Consumer Implementation

```javascript
// Kafka Consumer Example
import kafka from 'kafkajs';

const consumer = kafka.consumer({ groupId: 'notification-workers' });

async function startWorker() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'notifications' });
  
  await consumer.run({
    eachMessage: async ({ partition, message }) => {
      const notification = JSON.parse(message.value);
      
      try {
        // Process based on delivery channel
        if (notification.channel === 'email') {
          await sendEmail(notification);
        } else if (notification.channel === 'push') {
          await sendPushNotification(notification);
        } else if (notification.channel === 'sms') {
          await sendSMS(notification);
        }
        
        // Mark as delivered
        await markNotificationDelivered(notification.id);
        
      } catch (error) {
        // Retry logic
        await retryNotification(notification, error);
      }
    }
  });
}
```

### Scalability Features

1. **Horizontal Scaling**
   - Deploy multiple worker instances
   - Kafka partitions distribute load
   - Each worker processes different partition

2. **Load Balancing**
   - Worker pool manages concurrent processing
   - Auto-scaling based on queue depth
   - Circuit breaker for failing services

3. **Fault Tolerance**
   - Dead letter queue for failed notifications
   - Automatic retry with exponential backoff
   - Message durability (Kafka persistence)

4. **Monitoring & Observability**
   - Track processing latency
   - Monitor worker health
   - Alert on queue depth exceeding threshold

### Performance Expectations

| Stage | Latency | Throughput | Scalability |
|-------|---------|-----------|------------|
| 1-2: REST + DB | 200ms | 1K req/s | Single server |
| 3: With Indexes | 50ms | 5K req/s | DB replication |
| 4: With Cache | 10ms | 50K req/s | Redis cluster |
| 5: With Kafka | 100ms (async) | 100K+ req/s | Multi-worker |

---

## Implementation Timeline

- **Stage 1-2**: Week 1-2 (API + Database)
- **Stage 3**: Week 2-3 (Indexes + Query optimization)
- **Stage 4**: Week 3-4 (Redis caching)
- **Stage 5**: Week 4-5 (Kafka + Workers)

---

## Technology Stack Summary

```
┌─────────────────────────────────────────┐
│ Frontend: React / Vue (if needed)       │
├─────────────────────────────────────────┤
│ Backend: Node.js + Express.js           │
│ - Request handling & routing            │
│ - Business logic                        │
│ - API endpoints                         │
├─────────────────────────────────────────┤
│ Message Queue: Apache Kafka             │
│ - Asynchronous processing               │
│ - Decoupled architecture                │
├─────────────────────────────────────────┤
│ Cache: Redis                            │
│ - In-memory caching layer               │
│ - Session management                    │
├─────────────────────────────────────────┤
│ Database: PostgreSQL                    │
│ - Primary data store                    │
│ - Transaction management                │
├─────────────────────────────────────────┤
│ Monitoring: Prometheus + Grafana        │
│ - Performance metrics                   │
│ - System health                         │
└─────────────────────────────────────────┘
```

---

## Conclusion

The campus notification system can be scaled from a simple REST API (Stage 1) to an enterprise-grade, highly available system (Stage 5) handling hundreds of thousands of notifications per second. Each stage builds upon the previous, maintaining backward compatibility while adding performance, reliability, and scalability improvements.
