# eCO₂nomy

**eCO₂nomy** is a gamified, eco-conscious activity tracking app designed to encourage sustainable habits while making the experience fun and engaging. 

Customers deposit their eco-friendly actions such as walking, cycling, climbing stairs, or attending walking meetings and earn points based on the CO₂ saved and health benefits. The app combines movement, gamification, and a banking-inspired theme to visualize the impact of daily activities.

---

## Local Development Setup

### Database Emulator

**Google Cloud Datastore (Current):**
```bash
gcloud beta emulators datastore start --host-port=localhost:8081
```

**DynamoDB Local (Alternative):**
```bash
docker run -d --name dynamodb-local -p 8000:8000 instructure/dynamo-local-admin
```

---

## Database Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | ✓ | Unique customer identifier |
| `username` | String | ✓ | Customer username |
| `password` | String | ✓ | Customer password (plaintext for sandbox) |
| `settings_json` | Object | | Optional user settings (e.g., dark mode) |

### Deposits Table

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | ✓ | Unique deposit identifier |
| `customer_id` | UUID | ✓ | Foreign key to Customers table |
| `timestamp` | String (ISO Date) | ✓ | Timestamp when deposit was saved |
| `deposit_date` | String (ISO Date) | ✓ | Date of the activity |
| `deposit_type` | String | ✓ | Type of activity: `"steps"`, `"cycling"`, `"meeting"`, or `"stairs"` |
| `raw_value` | Number | ✓ | Activity value (e.g., 1000 steps, 4 km cycling) |
| `estimated_co2_g` | Number | ✓ | Estimated CO₂ saved in grams (calculated client-side) |
| `points_eco` | Number | ✓ | Eco points earned (calculated client-side) |
| `points_health` | Number | ✓ | Health points earned (calculated client-side) |
| `points_total` | Number | ✓ | Total points for this deposit (calculated client-side) |

---

## Features

### Leaderboard
- Displays aggregated totals from the Deposits table
- Groups deposits by `customer_id` and sums:
  - Total eco points
  - Total health points
  - Total CO₂ saved
  - Total points
- Implemented in `leaderBoardController.js` → `getTotalLeaderboard()`

---

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: AWS DynamoDB
- **Frontend**: HTML, CSS, JavaScript
- **Infrastructure**: Terraform (for AWS resources)

---

## API Testing with Postman

### Customers Endpoints

#### Create Customer
```
POST http://localhost:3000/customers/
```
**Body (JSON):**
```json
{
  "username": "Fred",
  "password": "Fred",
  "settings_json": {"dark_mode": false}
}
```

#### Read All Customers
```
GET http://localhost:3000/customers
```

#### Update Customer
```
PUT http://localhost:3000/customers/{id}
```
**Body (JSON):**
```json
{
  "username": "Fred",
  "password": "Fred",
  "settings_json": {"dark_mode": true}
}
```

#### Delete Customer
```
DELETE http://localhost:3000/customers/{id}
```
*Replace `{id}` with the customer UUID*

---

### Deposits Endpoints

#### Create Deposit
```
POST http://localhost:3000/deposits
```
**Body (JSON):**
```json
{
  "customer_id": "4ed158cd-2562-4ca4-9545-b8e757927e60",
  "timestamp": "2025-11-18T10:00:00.000Z",
  "deposit_date": "2025-11-19",
  "deposit_type": "meeting",
  "raw_value": 15.50,
  "estimated_co2_g": 12.75,
  "points_eco": 10.00,
  "points_health": 10.00,
  "points_total": 20.00
}
```

#### Read All Deposits
```
GET http://localhost:3000/deposits
```

#### Update Deposit
```
PUT http://localhost:3000/deposits/{id}
```
**Body (JSON):**
```json
{
  "customer_id": "4ed158cd-2562-4ca4-9545-b8e757927e60",
  "timestamp": "2025-11-18T10:00:00.000Z",
  "deposit_date": "2025-11-19",
  "deposit_type": "meeting",
  "raw_value": 15.50,
  "estimated_co2_g": 12.75,
  "points_eco": 11.00,
  "points_health": 11.00,
  "points_total": 22.00
}
```
*Replace `{id}` with the deposit UUID*

#### Delete Deposit
```
DELETE http://localhost:3000/deposits/{id}
```
*Replace `{id}` with the deposit UUID* 

<img width="2818" height="2126" alt="a56e4060-cce8-488d-a041-f2d34a9b7ed0" src="https://github.com/user-attachments/assets/b954c8e3-d9c2-4256-9bc1-930a4ce88584" />

<img width="1212" height="1762" alt="e0fa3f0f-d5ad-4a8d-8c5d-28101ca7362c" src="https://github.com/user-attachments/assets/0b23329c-60b9-4d26-9913-12443969d051" />

<img width="2146" height="926" alt="5f3a7c8f-b0f8-4a32-8210-df615631d83e" src="https://github.com/user-attachments/assets/87c1a1a0-3d38-4458-836a-0d1fafe1ced5" />

