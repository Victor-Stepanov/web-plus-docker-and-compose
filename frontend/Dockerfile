FROM node:16-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . ./

RUN npm run build \ && rm -rf ./scr \ && rm -rf node ./node_modules

FROM nginx:1.23.1-alpine AS frontend

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]