# AMS_26967 — ATM Management System

A full-stack ATM simulation built with **.NET 10** (Web API) and **React 19** (Vite). It supports card insertion, PIN authentication with lockout, deposits, withdrawals, transfers, receipts, and reporting — all secured with JWT.

> Built as part of the AMS_26967 coursework project.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | ASP.NET Core 10 Web API, C# |
| ORM | Entity Framework Core 9 + Pomelo (MySQL) |
| Auth | JWT Bearer tokens, BCrypt PIN hashing |
| Frontend | React 19, React Router v7, Vite 8 |
| API Docs | Swagger / OpenAPI |
| Database | MySQL |
| Port (API) | `http://localhost:5236` |
| Port (UI) | `http://localhost:5173` |

---

## Project Structure

```
ams/
├── Controllers/
│   ├── AuthController.cs        # PIN login, lockout
│   ├── AccountController.cs     # Balance, details, lookup
│   ├── TransactionController.cs # Deposit, withdraw, transfer
│   ├── AdminController.cs       # Account management (no auth)
│   └── ReportController.cs      # History, totals
├── Models/
│   ├── Account.cs
│   └── Transaction.cs
├── DTOs/
│   └── DTOs.cs
├── data/
│   └── AppDbContext.cs
├── Helpers/
│   └── JwtHelper.cs
├── Properties/
│   └── launchSettings.json
├── appsettings.json
├── Program.cs
└── ams-ui/                      # React frontend
    └── src/
        ├── pages/
        │   ├── Login.jsx
        │   ├── Dashboard.jsx
        │   ├── Deposit.jsx
        │   ├── Withdraw.jsx
        │   ├── Transfer.jsx
        │   ├── Pay.jsx
        │   ├── History.jsx
        │   └── Reports.jsx
        ├── components/
        │   └── Receipt.jsx
        ├── api.js
        ├── App.jsx
        ├── AuthContext.jsx
        └── Layout.jsx
```

---

## Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org)
- MySQL running locally on port `3306`
- Git (to clone the repository)

### 1. Configure the database

Open `appsettings.json` and update the connection string:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Port=3306;Database=ams_db;User=root;Password=yourpassword;"
}
```

The database and tables are created automatically on first run via `EnsureCreated()`. Two seed accounts are also inserted:

| Name | Account Number | PIN | Balance |
|---|---|---|---|
| Mugisha Julien | 26967 | 1234 | 5000 |
| Harerimana Pacific | 26937 | 1234 | 3000 |

### 2. Run the backend

```bash
cd ams
dotnet run
```

API runs at `http://localhost:5236`  
Swagger UI at `http://localhost:5236/swagger`

### 3. Run the frontend

```bash
cd ams-ui
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## API Endpoints

### Auth — `POST /api/auth/insert-card`
No authentication required.

```json
{ "accountNumber": "26967", "pin": "1234" }
```

Returns a JWT token on success. Tracks failed PIN attempts — account is **blocked after 3 wrong attempts**.

---

### Account *(requires JWT)*

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/account/details` | Get logged-in account info |
| GET | `/api/account/lookup/{accountNumber}` | Look up another account by number |

---

### Transactions *(requires JWT)*

| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/api/transaction/deposit` | `{ "amount": 500 }` | Deposit cash |
| POST | `/api/transaction/withdraw` | `{ "amount": 200 }` | Withdraw cash |
| POST | `/api/transaction/transfer` | `{ "receiverAccountNumber": "26937", "amount": 100 }` | Transfer to another account |

All transaction responses include a receipt object and updated balance.  
Failed transactions (e.g. insufficient funds) are recorded in the DB with a `Failed` status and reason.

---

### Reports *(requires JWT)*

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/report/history` | Full transaction history |
| GET | `/api/report/totals` | Sum of deposits, withdrawals, transfers and failed count |

---

### Admin *(no authentication)*

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/accounts` | List all accounts |
| POST | `/api/admin/accounts` | Create a new account |
| GET | `/api/admin/accounts/{id}/balance` | Get balance by account ID |
| GET | `/api/admin/accounts/{id}/history` | Get transaction history by account ID |

---

## PIN Lockout System

1. Wrong PIN → `"Invalid PIN. 2 attempt(s) remaining."`
2. Wrong PIN again → `"Invalid PIN. 1 attempt(s) remaining."`
3. Wrong PIN a third time → account is blocked → `"Account blocked after 3 failed PIN attempts."`
4. Any further attempt → `"Account is blocked. Please contact the bank."`
5. Correct PIN at any point → resets `FailedLoginAttempts` to `0`

To unblock an account, use the Admin panel in Swagger to reset the account.

---

## JWT Configuration

Configured in `appsettings.json`:

```json
"Jwt": {
  "Key": "AMS26967SuperSecretKey_ChangeInProd_32chars!",
  "Issuer": "AMS_26967",
  "Audience": "AMS_26967_Client"
}
```

> Change the `Key` before deploying to production.

---

## Frontend Pages

| Page | Route | Description |
|---|---|---|
| Login | `/` | Insert card — enter account number and PIN |
| Dashboard | `/dashboard` | Account overview, balance, card number |
| Deposit | `/deposit` | Deposit funds |
| Withdraw | `/withdraw` | Withdraw funds |
| Transfer | `/transfer` | Transfer to another account with live lookup |
| Pay | `/pay` | Make a payment |
| History | `/history` | Full transaction history table |
| Reports | `/reports` | Totals summary and failed transactions |

All pages except Login are protected — unauthenticated users are redirected to `/`.

---

## Author

**Mugisha Julien** — AMS_26967
