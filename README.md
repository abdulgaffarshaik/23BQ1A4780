# AffordMed Assessment - Backend Track

This repository contains three independent backend services for the AffordMed backend track assessment.

## 📁 Project Structure

```
affordmed-assessment/
├── logging_middleware/
│   ├── src/
│   ├── package.json
│   ├── .env
│   └── README.md
│
├── vehicle_maintenance_scheduler/
│   ├── src/
│   ├── package.json
│   ├── .env
│   ├── screenshots/
│   └── README.md
│
├── notification_app/
│   ├── src/
│   ├── package.json
│   ├── .env
│   ├── screenshots/
│   └── README.md
│
├── notification_system_design.md
├── .gitignore
└── README.md
```

## 🚀 Getting Started

Each service is independent and can be run separately.

### 1. Logging Middleware

```bash
cd logging_middleware
npm install
npm start
```

**What it does:**
- Registration with AffordMed test server
- Authentication with Bearer tokens
- Logs all HTTP requests to centralized server
- Express middleware for request logging

### 2. Vehicle Maintenance Scheduler

```bash
cd vehicle_maintenance_scheduler
npm install
npm start
```

**What it does:**
- Fetches depots and vehicles from server
- Solves 0/1 Knapsack optimization problem
- Selects optimal maintenance tasks
- O(n × capacity) dynamic programming solution

### 3. Notification App

```bash
cd notification_app
npm install
npm start
```

**What it does:**
- Fetches campus notifications
- Calculates priority scores (type weight + recency)
- Filters top 10 notifications
- Groups by type (Placement/Result/Event)

## ⚙️ Configuration

Each service needs a `.env` file with:

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

## 📚 Documentation

- [notification_system_design.md](notification_system_design.md) - 5-stage scalability architecture
- [logging_middleware/README.md](logging_middleware/README.md) - Logging service details
- [vehicle_maintenance_scheduler/README.md](vehicle_maintenance_scheduler/README.md) - Scheduler details
- [notification_app/README.md](notification_app/README.md) - Notification system details

## 🔗 API Endpoints

### Logging Middleware
- `GET /api/health` - Health check

### Common Endpoints (AffordMed Test Server)
- `POST /register` - Register new user
- `POST /auth` - Authenticate and get token
- `GET /depots` - Fetch depots
- `GET /vehicles` - Fetch vehicles
- `GET /notifications` - Fetch notifications
- `POST /logs` - Send logs

## 📸 Screenshots

Screenshots for each service should be placed in:
- `logging_middleware/` (if applicable)
- `vehicle_maintenance_scheduler/screenshots/`
- `notification_app/screenshots/`

## 📋 Technologies

- **Runtime:** Node.js with ES Modules
- **HTTP:** Native Fetch API
- **Server:** Express.js
- **Configuration:** dotenv
- **Security:** Bearer tokens, helmet.js, CORS

## ✅ Requirements Met

- [x] logging_middleware folder with src/, package.json, .env, README.md
- [x] vehicle_maintenance_scheduler folder with src/, package.json, .env, screenshots/, README.md
- [x] notification_app folder with src/, package.json, .env, screenshots/, README.md
- [x] notification_system_design.md file
- [x] .gitignore with node_modules

## 🎯 Next Steps

1. Configure `.env` files in each service with your credentials
2. Run `npm install` in each service
3. Run `npm start` to execute each service
4. Capture screenshots of the output
5. Push to GitHub

## 📝 License

Assessment project for AffordMed backend track
