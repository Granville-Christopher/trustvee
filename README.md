# Trustvee Elite

Membership platform: packages, daily tasks, claims, referrals, Paystack.

## Structure

- `web/` — mobile-first React app (max 768px)
- `api/` — NestJS + **MongoDB** (Mongoose)

## Database (MongoDB)

Default local URI: `mongodb://127.0.0.1:27017/trustvee`

```bash
cd api
cp .env.example .env
# edit MONGODB_URI if using Atlas
npm install
npm run start:dev
```

Health: `GET http://localhost:3000/api/health`  
Packages: `GET http://localhost:3000/api/packages`

## Run homepage

```bash
cd web
npm install
npm run dev
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
