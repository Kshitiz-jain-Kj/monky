# M.O.N.K.Y Backend Setup Guide

## Prerequisites

1. MongoDB Atlas account (or local MongoDB installation)
2. Auth0 account
3. Judge0 API key (for code execution)

## Setup Instructions

### 1. MongoDB Setup

1. Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Click "Connect" and choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Add the connection string to your `.env.local` file

### 2. Auth0 Setup

1. Create a free Auth0 account at https://auth0.com
2. Create a new Application (Single Page Application)
3. Note your Domain, Client ID, and Client Secret
4. Set Allowed Callback URLs to: `http://localhost:3000/callback, https://your-domain.vercel.app/callback`
5. Set Allowed Logout URLs to: `http://localhost:3000, https://your-domain.vercel.app`
6. Set Allowed Web Origins to: `http://localhost:3000, https://your-domain.vercel.app`
7. Create an API in Auth0 with an identifier (e.g., `https://monky-api`)
8. Add all Auth0 credentials to your `.env.local` file

### 3. Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

\`\`\`env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/monky-os?retryWrites=true&w=majority

# Auth0
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=https://monky-api

# Auth0 Public (for frontend)
NEXT_PUBLIC_AUTH0_DOMAIN=your-domain.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id
NEXT_PUBLIC_AUTH0_AUDIENCE=https://monky-api

# Judge0 (already configured)
RAPIDAPI_KEY=your-rapidapi-key
\`\`\`

### 4. Vercel Deployment

When deploying to Vercel:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add all the environment variables from your `.env.local` file
4. Redeploy your application

## Testing

1. Run `npm install` to install dependencies (mongoose and jose are already added)
2. Run `npm run dev` to start the development server
3. Navigate to http://localhost:3000
4. Try signing up and logging in
5. Test saving code snippets from the Code Editor
6. Test the Debug History feature

## Features Implemented

- ✅ Auth0 authentication integration
- ✅ MongoDB database with Mongoose models
- ✅ Protected API routes
- ✅ User profile management
- ✅ Code snippets workspace
- ✅ Debug history tracking
- ✅ Activity logging
- ✅ Chat repositioned to bottom-right corner

## Notes

- The current implementation uses localStorage for basic auth as a fallback
- Full Auth0 integration requires environment variables to be set
- All API routes are protected and require authentication tokens
- MongoDB models will be created automatically on first connection
