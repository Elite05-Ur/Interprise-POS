# syntax=docker/dockerfile:1

ARG NODE_VERSION=26.13.0

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM base AS build
COPY package.json package-lock.json ./
RUN npm ci
# Local package ke tor par serve install kar lein taake global permission ka masla na ho
RUN npm install serve
COPY . .
RUN npm run build

FROM base AS final
ENV NODE_ENV=production
USER node

COPY package.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000
CMD ["npx", "serve", "-s", "dist", "-l", "3000"]