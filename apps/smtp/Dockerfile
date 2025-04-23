FROM oven/bun:1

WORKDIR /app

COPY . .

RUN bun install --production

CMD ["bun", "run", "index.ts"]
