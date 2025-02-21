# Build Stage
FROM node:18-slim AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install all dependencies, including devDependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the React application
RUN npm run build

# Production Stage
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy the build output from the builder stage
COPY --from=builder /app/build ./build

# Install serve globally to serve the static files
RUN npm install -g serve

# Expose the port the app will run on
EXPOSE 3000

# Serve the application
CMD ["serve", "build", "-s", "-l", "3000"]