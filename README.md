# Invenia AI App

A full-stack job application tracking system with AI-powered features.

## Tech Stack

**Frontend:**
- React Native with Expo
- TypeScript
- Expo Router for navigation

**Backend:**
- Node.js with Express
- MongoDB
- JWT Authentication
- RESTful APIs

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm start
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## Deployment

### Vercel (Frontend)
1. Connect your GitHub repository to Vercel
2. Vercel will auto-detect the Expo/React Native web build
3. Deploy automatically

### Railway (Backend)
1. Connect your GitHub repository to Railway
2. Set environment variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `PORT`: 5000

### Environment Variables
Copy `.env.example` to `.env` and configure:
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
```

## Features

- User authentication (Google OAuth, Email/Password)
- Job posting and management
- Application tracking
- Analytics dashboard
- Real-time notifications

## License

MIT
