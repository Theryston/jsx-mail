FROM node:20-slim

WORKDIR /app
COPY . .

RUN apt-get update -y && apt-get install -y openssl build-essential libjpeg-dev
RUN wget -q -O /tmp/libpng12.deb http://mirrors.kernel.org/ubuntu/pool/main/libp/libpng/libpng12-0_1.2.54-1ubuntu1_amd64.deb && dpkg -i /tmp/libpng12.deb && rm /tmp/libpng12.deb

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm jsxm login
RUN pnpm run prepare:db:prod
RUN pnpm build

EXPOSE 3331

CMD ["pnpm", "start"]