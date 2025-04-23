FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install --production

COPY . .

CMD ["bun", "run", "index.ts"]
