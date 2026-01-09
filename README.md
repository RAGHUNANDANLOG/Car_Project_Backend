Car Management System – Backend

Backend service for managing car models and generating salesman commission reports.
Built with Node.js, Express, PostgreSQL, and Knex.js using a Layered (N-Tier) Architecture.

FEATURES
- Car model CRUD operations
- Image upload support
- Salesman commission reporting
- AES-256 encryption for sensitive fields
- Pagination, search, and sorting
- SQL injection safe queries
- Centralized error handling

ARCHITECTURE
Controller → Service → Repository → Database

TECH STACK
- Node.js
- Express.js
- PostgreSQL
- Knex.js
- Multer
- crypto-js
- Winston

ENVIRONMENT VARIABLES
PORT=6000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=car_management
DB_USER=postgres
DB_PASSWORD=postgres
ENCRYPTION_KEY=your_secure_key

RUNNING THE SERVER
npm install
npx knex migrate:latest
npm run dev

Server runs on http://localhost:6000

AUTHOR
Raghunandan Das
