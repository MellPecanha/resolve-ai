FROM node:22-bookworm AS build

WORKDIR /app/frontend

COPY frontend/package.json frontend/yarn.lock ./

RUN corepack enable && yarn install --frozen-lockfile

COPY frontend/ ./

ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN yarn build

FROM nginx:1.27-alpine

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/frontend/dist /usr/share/nginx/html

EXPOSE 80
