# EthLink Setup Guide

This guide will help you set up and run the EthLink project with frontend and backend properly connected.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or pnpm

## Setup Instructions

### 1. Backend Setup

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `Backend` directory with the following content:
```env
# Server Configuration
PORT=3000

# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/ethlink?schema=public"
# Replace user, password, and database name with your PostgreSQL credentials

# JWT Configuration
ACCESS_TOKEN_PASSWORD=your_access_token_secret_key_change_this_in_production
REFRESH_TOKEN_PASSWORD=your_refresh_token_secret_key_change_this_in_production
# Generate strong random strings for these in production

# Encryption Configuration
CRYPTO_KEY=your_crypto_key_for_encryption_change_this_in_production
# Generate a strong random string for this in production

# Alchemy API Configuration
ALCHEMY_API_KEY=your_alchemy_api_key_here
# Get your API key from https://www.alchemy.com/
```

4. Set up the database:
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

5. Start the backend server:
```bash
npm run dev
```

The backend server will run on `http://localhost:3000`

### 2. Frontend Setup

1. Navigate to the Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Create a `.env` file in the `Frontend` directory with the following content:
```env
# Backend API URL
VITE_BACKEND_URL=http://localhost:3000
VITE_BACKEND_URL_DEV=http://localhost:3000

# Alchemy API Key (if needed in frontend)
VITE_ALCHEMY_API_KEY=your_alchemy_api_key_here
```

4. Start the frontend development server:
```bash
npm run dev
# or
pnpm dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is taken)

## Running the Application

1. **Start the Backend:**
   - Open a terminal in the `Backend` directory
   - Run `npm run dev`
   - The server should start on port 3000

2. **Start the Frontend:**
   - Open another terminal in the `Frontend` directory
   - Run `npm run dev` or `pnpm dev`
   - The frontend will be available at `http://localhost:5173`

## Important Notes

- Make sure PostgreSQL is running before starting the backend
- Update the `DATABASE_URL` in the backend `.env` file with your actual PostgreSQL credentials
- Replace all placeholder values in `.env` files with actual values
- The frontend is configured to proxy API requests to the backend during development
- All hardcoded API keys have been replaced with environment variables

## Troubleshooting

### Backend won't start
- Check if PostgreSQL is running
- Verify the `DATABASE_URL` in `.env` is correct
- Ensure all required environment variables are set
- Run `npm run prisma:generate` if you see Prisma client errors

### Frontend can't connect to backend
- Verify the backend is running on port 3000
- Check that `VITE_BACKEND_URL` in frontend `.env` matches the backend URL
- Check browser console for CORS errors (CORS is enabled in the backend)

### Database connection errors
- Verify PostgreSQL is installed and running
- Check database credentials in `DATABASE_URL`
- Ensure the database exists (or let Prisma create it via migrations)

