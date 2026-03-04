# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json files first for better caching
COPY backend/package*.json ./backend/

# Install backend dependencies
RUN cd backend && npm install --production

# Copy backend source code
COPY backend/ ./backend/

# Expose port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000
ENV HOST=0.0.0.0

# Change to backend directory and start the app
WORKDIR /app/backend
CMD ["npm", "start"]
