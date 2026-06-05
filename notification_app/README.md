# Notification App

This service demonstrates a campus notification system that fetches, prioritizes, and displays notifications based on a multi-factor scoring algorithm.

## Features

- ✅ Priority scoring algorithm
- ✅ Multi-factor ranking (type weight + recency)
- ✅ Top 10 notification filtering
- ✅ Type-based grouping (Placement/Result/Event)
- ✅ O(n log n) complexity

## Quick Start

```bash
npm install
npm start
```

## Environment Variables

Create a `.env` file with:

```
EMAIL=your_email@example.com
NAME=Your Name
ROLL_NO=Your Roll Number
MOBILE_NO=9876543210
GITHUB_USERNAME=your_github
ACCESS_CODE=your_access_code
CLIENT_ID=
CLIENT_SECRET=
```

## What It Does

1. **Authenticates** with AffordMed test server
2. **Fetches Notifications** - All campus notifications
3. **Calculates Priority** - Using type weight and recency
4. **Filters Top 10** - Most important notifications
5. **Groups by Type** - Placement, Result, Event
6. **Displays Results** - With priority indicators

## Algorithm

Priority Score = (Type Weight × 100) + Recency Score

- Placement: 3 (highest priority)
- Result: 2 (medium priority)
- Event: 1 (low priority)
- Recency: 0-99 (based on 7-day window)

## Files

- `src/services/auth.js` - Authentication
- `src/services/notifications.js` - Fetch notifications
- `src/algorithms/priorityInbox.js` - Priority scoring
- `src/index.js` - Main entry point

## Testing

```bash
npm start
```

You'll see output like:

```
TOP 10 NOTIFICATIONS:
1. [Placement] Interview Scheduled
   Priority: 🔴 HIGH (Score: 350)
2. [Result] Exam Results Released
   Priority: 🟡 MEDIUM (Score: 180)
```
