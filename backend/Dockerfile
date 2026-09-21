FROM node:22-bookworm

WORKDIR /app/backend

COPY backend/package.json backend/yarn.lock backend/.yarnrc.yml ./

RUN corepack enable && yarn install --immutable

COPY backend/ ./

EXPOSE 3333

CMD ["sh", "-c", "yarn prisma db init --db \"$DATABASE_URL\" && yarn tsx src/server.ts"]
