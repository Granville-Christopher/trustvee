# Trustvee Elite

One app: **NestJS serves the React frontend + API** (single Vercel serverless function).

## Structure

- `web/` — React client (Vite). Built into `server/public`
- `server/` — NestJS + MongoDB (serves `/api` and the SPA)
- `api/index.ts` — **only** Vercel serverless entry (avoids the 12-function Hobby limit)

## Setup

```bash
# MongoDB
# set MONGODB_URI in server/.env

npm run install:all
```

### Local (API + built frontend together)

```bash
npm run build
npm run start
# http://localhost:3000
# http://localhost:3000/api/health
```

### Local frontend hot-reload

```bash
npm run start:dev   # Nest on :3000
npm run dev:web     # Vite on :5173 (proxies /api → :3000)
```

## Packages

| Package  | Entry    | Month-end | Daily (÷30) |
|----------|----------|-----------|-------------|
| Spark    | ₦3,000   | ₦15,000   | ₦500        |
| Rise     | ₦5,000   | ₦20,000   | ₦666        |
| Pulse    | ₦10,000  | ₦40,000   | ₦1,333      |
| Elite    | ₦25,000  | ₦100,000  | ₦3,333      |
| Prestige | ₦50,000  | ₦250,000  | ₦8,333      |
| Apex     | ₦100,000 | ₦600,000  | ₦20,000     |
