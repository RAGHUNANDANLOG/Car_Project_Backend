Car Management System – Backend
Backend service for Car Model Management and Salesman Commission Reporting, built using Node.js, Express, PostgreSQL, and Knex.js, following a clean Layered (N-Tier) Architecture.

🚀 Features


Car model CRUD with image uploads


Salesman commission calculation & reporting


AES-256 encryption for sensitive fields


Pagination, search, sorting


Centralized error handling & logging


Secure file uploads


SQL-injection safe queries


Scalable layered architecture



🏗 Architecture Overview
This backend follows:


Layered (N-Tier) Architecture


Repository Pattern


Service Layer Pattern


DTO Pattern


Middleware Pattern


Controller → Service → Repository → Database

Each layer has a single responsibility and is fully decoupled from others.

🧠 Folder Structure
backend/
├── src/
│   ├── config/              # Environment & DB configuration
│   ├── controllers/         # HTTP request handlers
│   ├── database/
│   │   ├── migrations/      # DB schema
│   │   └── seeds/           # Seed data
│   ├── dto/                 # Data Transfer Objects
│   ├── middleware/          # Validation, errors, uploads, logging
│   ├── repositories/        # Database queries (Knex)
│   ├── routes/              # Express routes
│   ├── services/            # Business logic
│   ├── utils/               # Logger, encryption, helpers
│   └── index.js             # App entry point
│
├── uploads/                 # Uploaded images
├── logs/                    # Application logs
├── knexfile.js              # Knex configuration
├── package.json
└── README.md


🧪 Tech Stack
CategoryTechRuntimeNode.jsFrameworkExpress.js (ES Modules)DatabasePostgreSQLQuery BuilderKnex.jsValidationexpress-validatorEncryptioncrypto-js (AES-256)File UploadsMulterLoggingWinstonHTTP ClientAxios

🔐 Security Practices


SQL Injection Prevention via parameterized Knex queries


AES-256 Encryption for sensitive DB fields


Request Validation using express-validator


Safe File Uploads (type, size, count limits)


Global Error Handling


No stack traces in production



🔑 Encrypted Fields


car_models.description


car_models.features


Encryption handled centrally in utils/encryption.js.

⚙️ Environment Variables
Create a .env file in the backend/ directory:
PORT=6000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=car_management
DB_USER=postgres
DB_PASSWORD=postgres

ENCRYPTION_KEY=your_secure_key_here
NODE_ENV=development


🗄 Database Setup
1️⃣ Install Dependencies
npm install

2️⃣ Run Migrations
npx knex migrate:latest

3️⃣ Seed Data (Optional)
npx knex seed:run


▶️ Running the Server
npm run dev

Server starts at:
http://localhost:6000


📡 API Examples
Create Car Model
POST /api/car-models
Content-Type: multipart/form-data

Get Car Models
GET /api/car-models?search=swift&page=1&limit=10

Commission Report
GET /api/commission/report


🧩 Design Principles


Thin controllers


Fat services


Zero business logic in routes


Repository as single DB access point


DTOs isolate API from DB schema


Middleware for cross-cutting concerns



🧪 Testing Strategy (Optional Extension)


Unit tests for services


Repository mocking


Integration tests with test DB



📄 License
MIT License

👨‍💻 Author
Raghunandan Das
Full-Stack / MERN Developer

If you want, I can:


Split this into interviewer-friendly and GitHub-friendly versions


Add API docs (Swagger)


Add Docker setup


Or generate the frontend README so both repos look like they belong to the same adult project


For now, this README won’t get you judged silently. That’s a win.
