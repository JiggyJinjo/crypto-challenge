FROM oven/bun:1.0
WORKDIR /app
COPY . /app/
RUN bun install
WORKDIR /app/packages/server
EXPOSE 5000 4040
ENTRYPOINT ["bun", "run", "start"]


