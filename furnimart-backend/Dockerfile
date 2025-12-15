FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm install --production
COPY src ./src
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/package*.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
EXPOSE 5000
CMD ["node", "dist/main.js"]
