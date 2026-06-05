# Logging Middleware

This folder contains the logging middleware implementation for the AffordMed Backend.

## 📁 Structure

```
logging_middleware/
├── index.js               # Main logging middleware export
├── logger.js              # Logger service
├── config.js              # Logging configuration
└── README.md              # Documentation
```

## 🎯 Purpose

The logging middleware provides centralized request/response logging functionality for the Express.js backend.

## 🚀 Features

- HTTP request logging
- Response status tracking
- Error logging
- Centralized log output to test server
- Multiple log levels (debug, info, warn, error, fatal)
- Multiple log packages support

## 📝 Implementation

The logging middleware is already implemented in:
- `../src/services/logger.js` - Main logging service
- `../src/middleware/loggingMiddleware.js` - Express middleware

This folder serves as documentation and organizational reference for the logging system.

## 📊 Log Levels

- **debug** - Detailed debugging information
- **info** - General informational messages
- **warn** - Warning messages
- **error** - Error messages
- **fatal** - Critical/fatal errors

## 🔄 Usage

```javascript
import { Log, info, error } from '../services/logger.js';

// Send log to server
await Log("backend", "info", "service", "Message");

// Use convenience functions
await info("service", "Processing request");
await error("service", "Request failed");
```

## 🌐 Integration

Logs are sent to: `http://4.224.186.213/evaluation-service/logs`

Each log includes:
- stack: "backend" or "frontend"
- level: Log level (debug, info, warn, error, fatal)
- package: Package name (service, middleware, controller, etc.)
- message: Log message

## ✅ Checklist

- [x] Logging middleware implemented
- [x] Multiple log levels supported
- [x] Server integration working
- [x] Error handling in place
- [x] Bearer token authentication

---

**Status:** ✅ Complete and tested
