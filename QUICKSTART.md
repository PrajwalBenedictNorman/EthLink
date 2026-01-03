# Quick Start Guide

## Quick Setup (5 minutes)

### Step 1: Backend Setup

```bash
cd Backend
npm install

# Create .env file (copy from .env.example and update values)
cp .env.example .env
# Edit .env with your database credentials and API keys

# Generate Prisma client
npm run prisma:generate

# Run migrations (creates database tables)
npm run prisma:migrate

# Start backend server
npm run dev
```

### Step 2: Frontend Setup (in a new terminal)

```bash
cd Frontend
npm install  # or pnpm install

# Create .env file (copy from .env.example)
cp .env.example .env
# Edit .env if needed (defaults should work for local development)

# Start frontend server
npm run dev  # or pnpm dev
```

### Step 3: Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Environment Variables Required

### Backend (.env)
- `PORT` - Server port (default: 3000)
- `DATABASE_URL` - PostgreSQL connection string
- `ACCESS_TOKEN_PASSWORD` - JWT secret for access tokens
- `REFRESH_TOKEN_PASSWORD` - JWT secret for refresh tokens
- `CRYPTO_KEY` - Encryption key for private keys
- `ALCHEMY_API_KEY` - Alchemy API key for Ethereum interactions

### Frontend (.env)
- `VITE_BACKEND_URL` - Backend API URL (default: http://localhost:3000)
- `VITE_BACKEND_URL_DEV` - Backend API URL for development (default: http://localhost:3000)
- `VITE_ALCHEMY_API_KEY` - Alchemy API key (if needed)

## Troubleshooting

**Backend won't start:**
- Check PostgreSQL is running
- Verify DATABASE_URL is correct
- Ensure all env variables are set

**Frontend can't connect:**
- Verify backend is running on port 3000
- Check VITE_BACKEND_URL matches backend URL
- Check browser console for errors

**Database errors:**
- Ensure PostgreSQL is installed and running
- Create database if it doesn't exist
- Run `npm run prisma:migrate` to set up tables

