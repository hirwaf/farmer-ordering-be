FROM node:20-alpine AS builder
LABEL authors="hirwaf"
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
LABEL authors="hirwaf"
WORKDIR /app
COPY package.json .
RUN npm install --production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["npm", "start"]