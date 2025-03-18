FROM node:18-alpine
WORKDIR /the/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["npm","run","start"]