# FROM node:18-alpine3.20 as build
# ENV PATH /app/node_modules/.bin:$PATH
# ENV WORKDIR /app
# WORKDIR $WORKDIR
# COPY ../package.json $WORKDIR
# COPY ../package-lock.json $WORKDIR
# COPY .. $WORKDIR
# RUN npm install -g npm
# RUN npm install --legacy-peer-deps
# RUN npm run build

# FROM nginx:1.17.8-alpine AS package
# COPY --from=build /app/build /usr/share/nginx/html
# RUN rm -f /etc/nginx/config.d/default.conf
# COPY ../nginx/nginx.conf /etc/nginx/conf.d/
# EXPOSE 4500
# CMD ["nginx","-g","daemon off;"]


# Step 1: Build the React app
FROM node:18-alpine3.20 as build

ENV PATH /app/node_modules/.bin:$PATH
ENV WORKDIR /app

WORKDIR $WORKDIR

COPY ../package.json $WORKDIR
COPY ../package-lock.json $WORKDIR
COPY .. $WORKDIR

RUN npm install -g npm
RUN npm install --legacy-peer-deps
RUN npm run build

# Step 2: Set up the production environment with PM2 and Node.js to serve the React build
FROM node:18-alpine3.20 as production

WORKDIR /app

# Install PM2 globally
RUN npm install -g pm2

# Install express and other dependencies
RUN npm install express

# Copy the build from the previous stage
COPY --from=build /app/build /app/build

# Create a basic Express server to serve static files
COPY ./server.js /app

EXPOSE 4500

# Use PM2 to run the server
CMD ["pm2-runtime", "server.js"]

