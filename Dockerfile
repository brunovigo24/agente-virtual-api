FROM node:24-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm install -g typescript
RUN npm run build 

EXPOSE 3000

CMD ["node", "dist/index.js"]
