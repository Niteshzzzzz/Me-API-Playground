# Profile Playground

A minimal candidate-profile playground with a MongoDB-backed API, JWT cookie auth, and a React UI to create, query, and export your profile.

Resume: https://drive.google.com/file/d/1oNVL3zU6vb5FBUGrB8x9k9W_JyxR7Zr3/view?usp=sharing

## Architecture

- Frontend: React + Vite + Tailwind (client UI)
- Backend: Express + Mongoose (API)
- Auth: JWT stored in an httpOnly cookie
- Database: MongoDB

Data flow:

1. User registers/logs in
2. Backend issues JWT cookie
3. Frontend sends requests with credentials
4. Backend validates cookie and serves profile data

## Local setup

### Prerequisites

- Node.js 18+ (recommended)
- MongoDB running locally or a hosted MongoDB URI

### Backend

1. Create a .env file in backend:

   PORT=4000
   MONGO_URL=mongodb://127.0.0.1:27017/profile_playground
   JWT_SECRET=change_me
   JWT_EXPIRES_IN=7d
   COOKIE_NAME=token
   CORS_ORIGIN=http://localhost:5173

2. Install and run:

   cd backend
   npm install
   npm run dev

### Frontend

1. Install and run:

   cd frontend
   npm install
   npm run dev

2. Open http://localhost:5173

## Production setup

### Backend

- Set environment variables in your hosting provider
- Use NODE_ENV=production
- Set CORS_ORIGIN to your frontend URL
- Start the server:

  cd backend
  npm install
  npm run start

### Frontend

- Build static assets:

  cd frontend
  npm install
  npm run build

- Serve the dist/ folder with your hosting provider

## API endpoints

Auth:
- POST /auth/register
- POST /auth/login
- POST /auth/logout
- GET /auth/me

Profile:
- GET /profile
- POST /profile
- PUT /profile
- DELETE /profile
- GET /profile/export (download JSON)

Queries:
- GET /query/projects?skill=python
- GET /query/skills/top
- GET /query/search?q=react

Health:
- GET /health

## Schema

User:
- name: string
- email: string
- passwordHash: string

Profile:
- owner: ObjectId (User)
- name: string
- email: string
- education: string[]
- skills: string[]
- projects: [{ title, description, links[] }]
- work: [{ company, role, start, end, description }]
- links: { github, linkedin, portfolio }

## Sample curl

Register:

curl -i -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada Lovelace","email":"ada@example.com","password":"secret123"}'

Login (saves cookie):

curl -i -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"ada@example.com","password":"secret123"}'

Get profile (uses cookie):

curl -i http://localhost:4000/profile \
  -b cookies.txt

Export profile JSON (download):

curl -L http://localhost:4000/profile/export \
  -b cookies.txt \
  -o profile.json

## Postman

A sample Postman collection is included:

- Profile.postman_collection.json

Import it into Postman and set the base URL to http://localhost:4000

## Known limitations

- Single profile per user (one-to-one with owner)
- No refresh tokens or session invalidation beyond cookie clearing
- No role-based access control
- Query endpoints are simple text contains matching
- No file upload for profile JSON import (download only)
