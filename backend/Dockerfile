FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache wget
COPY package.json ./
RUN npm install --omit=dev
COPY src ./src
COPY tests ./tests
RUN mkdir -p /app/uploads
EXPOSE 8080
CMD ["node", "src/index.js"]
