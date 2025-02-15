FROM node:20-slim

WORKDIR /app
COPY . .

RUN apt-get update -y && apt-get install -y openssl build-essential libjpeg-dev libpng-dev

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm jsxm login
RUN pnpm run prepare:prod
RUN pnpm build

EXPOSE 3331

CMD ["pnpm", "start"]