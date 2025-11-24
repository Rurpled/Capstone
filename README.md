# eCO₂nomy

**eCO₂nomy** is a gamified, eco-conscious activity tracking app designed to encourage sustainable habits while making the experience fun and engaging. 

Customers deposit their eco-friendly actions such as walking, cycling, climbing stairs, or attending walking meetings and earn points based on the CO₂ saved and health benefits. The app combines movement, gamification, and a banking-inspired theme to visualize the impact of daily activities.

---

## Getting Started

### Prerequisites

- Node.js (v14+)
- Google Cloud SDK
- GCP account with billing enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rurpled/Capstone.git
   cd Capstone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Authenticate with Google Cloud**
   ```bash
   gcloud auth application-default login
   ```
   This creates credentials that your local app will use to access Google Cloud Datastore.

4. **Configure database connection** (in `services/database.js`)
   
   **For Cloud (Production):**
   ```javascript
   const datastore = new Datastore({
     projectId: 'solid-solstice-477012-c9',
     // No apiEndpoint needed - uses production GCP
   });
   ```
   
   **For Local Emulator:**
   ```javascript
   const datastore = new Datastore({
     projectId: 'local-dev-project',
     apiEndpoint: 'localhost:8081'
   });
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:3000`

6. **Start the frontend** (in a separate terminal)
   ```bash
   cd frontend
   python3 -m http.server 8080
   ```
   Frontend runs on `http://localhost:8080`

### GCP Permissions Required

To run this project, you need the following IAM roles on the GCP project:
- **Datastore User** (`roles/datastore.user`) - Read/write access to Datastore
- **Datastore Viewer** (`roles/datastore.viewer`) - Optional, for viewing data in console

---

## Local Development Setup

### Database Options

**Google Cloud Datastore Emulator (Local Testing):**
```bash
gcloud beta emulators datastore start --host-port=localhost:8081
```
Then update `database.js` to include `apiEndpoint: 'localhost:8081'`

**DynamoDB Local (Legacy - Alternative):**
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
- **Database**: Google Cloud Datastore
- **Frontend**: HTML, CSS, JavaScript
- **Infrastructure**: Terraform (for GCP resources)
- **Authentication**: Google Cloud Application Default Credentials

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

