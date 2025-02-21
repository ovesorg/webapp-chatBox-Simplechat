# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code into the container
COPY . .

# Build the React application
RUN npm run build

# Expose the port the app will run on
EXPOSE 3000

# Serve the application using a static file server (for example, serve)
CMD ["npx", "serve", "build", "-s", "-l", "3000"]
