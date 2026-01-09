# Car Management System - Backend API

The backend API for the Car Management System, built with Node.js, Express, and PostgreSQL. It handles car model management, image uploads, and commission calculations.

## 🛠 Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Knex.js
- **File Uploads**: Multer
- **Validation**: express-validator

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- PostgreSQL 14 or higher

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the `backend` directory. You can copy the structure below:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=car_management
   DB_USER=postgres
   DB_PASSWORD=your_password
   ENCRYPTION_KEY=your-32-character-encryption-key!
   ```

3. **Database Setup**
   Ensure PostgreSQL is running, then run the following commands to set up the schema and sample data:
   ```bash
   # Run database migrations
   npm run migrate

   # Seed database with sample data
   npm run seed
   ```

### Running the Server

- **Development Mode** (with hot-reload):
  ```bash
  npm run dev
  ```
  The server will start at `http://localhost:5000` (or the port specified in `.env`).

## 📂 Project Structure

```
backend/
├── src/
│   ├── config/          # Database and app configuration
│   ├── controllers/     # Request handlers
│   ├── database/        # Knex migrations and seeds
│   ├── dto/             # Data Transfer Objects & Encryption
│   ├── middleware/      # Error handling, logging, upload logic
│   ├── repositories/    # Data access layer (Knex queries)
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic
│   └── utils/           # Logger and helpers
├── uploads/             # Storage for uploaded car images
├── index.js             # Application entry point
└── knexfile.js          # Database connection configuration
```

## 🔌 API Endpoints

### Car Models
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/car-models` | List all car models (supports `page`, `limit`, `search`, `sortBy`) |
| `GET` | `/api/car-models/:id` | Get details of a specific car model |
| `POST` | `/api/car-models` | Create a new car model (multipart/form-data) |
| `PUT` | `/api/car-models/:id` | Update a car model |
| `DELETE` | `/api/car-models/:id` | Delete a car model |
| `PATCH` | `/api/car-models/:id/default-image/:imageId` | Set the default image for a model |

### Commission Report
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/commission/report` | Get calculated commission report |
| `GET` | `/api/commission/export` | Export report as CSV |
| `GET` | `/api/commission/salesmen` | Get list of salesmen |
| `GET` | `/api/commission/rules` | Get commission rules |

### System
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Check API health status |

## 🛡 Security & Validation
- **Image Uploads**: Restricted to images (JPEG, PNG, GIF, WebP) with a max size of 5MB per file.
- **Encryption**: Sensitive data fields are encrypted at rest using AES-256.
