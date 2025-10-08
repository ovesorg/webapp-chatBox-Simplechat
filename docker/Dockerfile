FROM node:22-alpine AS build
ENV PATH=/app/node_modules/.bin:$PATH
WORKDIR /app
RUN npm install -g pnpm@latest
COPY ../package.json ./
RUN pnpm install
COPY .. .
RUN pnpm build

FROM nginx:1.25-alpine AS production
COPY --from=build /app/build /usr/share/nginx/html
RUN rm -f /etc/nginx/conf.d/default.conf || true
COPY ../nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx","-g","daemon off;"]