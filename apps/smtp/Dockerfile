FROM node:20-alpine

WORKDIR /app
COPY . .

RUN yarn install
RUN yarn run build

CMD ["node", "index.js"]
