# Use official Node.js LTS image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY backend/package*.json ./
RUN npm install

# Copy source code
COPY backend/ .

# Set environment variables
ENV NODE_ENV=production

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
