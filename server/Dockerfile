# Stage 1: Development environment
FROM node:18-alpine AS development

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Start app in development mode
CMD ["npm", "run", "dev"]

# Stage 2: Production environment
FROM node:18-alpine AS production

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Create logs directory
RUN mkdir -p logs

# Set environment to production
ENV NODE_ENV=production

# Expose port
EXPOSE 5000

# Start app
CMD ["npm", "start"]