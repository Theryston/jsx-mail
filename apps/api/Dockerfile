FROM oven/bun

RUN mkdir -p app
WORKDIR /app

COPY . /app

RUN bun install -g @nestjs/cli

EXPOSE 3331

CMD ["bun", "run", "start"]