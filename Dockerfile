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


# Build Stage
FROM node:18-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production Stage
FROM node:18-slim
WORKDIR /app
COPY --from=builder /app/build ./build
COPY server.js .  # Assuming server.js is in the project root
RUN npm install express
RUN npm install -g pm2
EXPOSE 3000
CMD ["pm2-runtime", "start", "server.js"]
