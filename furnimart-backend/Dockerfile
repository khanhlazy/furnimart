FROM node:20-alpine AS base
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

COPY tsconfig.json ./
COPY src ./src
RUN npm run build
RUN mkdir -p /usr/src/app/uploads

EXPOSE 5000
CMD ["npm", "run", "start:prod"]
