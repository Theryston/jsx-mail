FROM node:20-slim

WORKDIR /app
COPY . .

RUN apt-get update -y && apt-get install -y openssl build-essential libjpeg-dev libpng-dev

RUN yarn install
RUN yarn jsxm login
RUN yarn run prepare:prod
RUN yarn build

EXPOSE 3331

CMD ["yarn", "start"]