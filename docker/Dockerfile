FROM node:18-alpine3.20 AS build
ENV PATH=/app/node_modules/.bin:$PATH
ENV WORKDIR=/app
WORKDIR $WORKDIR
COPY ../package.json $WORKDIR
COPY ../package-lock.json $WORKDIR
COPY .. $WORKDIR
RUN npm install -g npm
RUN npm install --legacy-peer-deps
RUN npm run build

FROM nginx:1.17.8-alpine AS package
COPY --from=build /app/build /usr/share/nginx/html
RUN rm -f /etc/nginx/config.d/default.conf
COPY ./nginx/default.conf /etc/nginx/conf.d/
EXPOSE 80
CMD ["nginx","-g","daemon off;"]