# Farmaid Backend (Initial Implementation)

## What is implemented

- MVC-style layering with `routes` -> `controllers` -> `services`
- Mongoose `models` for all core domain entities
- Auth endpoints: register, login, refresh-token, logout
- Farmer/admin current user profile endpoint
- Crop recommendation endpoint: POST /api/predict
- Disease detection endpoint: POST /api/detect-disease (multipart image)
- Admin endpoints: farmers, logs, dashboard, admin settings
- User settings endpoints
- Health endpoint

If `MONGO_URI` is configured, data is persisted using MongoDB and Mongoose models.
If `MONGO_URI` is not configured, backend runs with in-memory fallback store for quick local development.

## Run locally

1. Copy .env.example to .env
2. Optionally set `MONGO_URI` and `MONGO_DB_NAME` for MongoDB persistence
3. Install dependencies:
   npm install
4. Start server:
   npm run dev

Backend runs on port 5001 by default.

## Default admin credentials

- Email: admin@farmaid.ai
- Password: admin12345
