FROM oven/bun
WORKDIR /app
COPY package.json package-lock.json* bun.lockb* ./
RUN bun install
COPY . .
RUN bun run build
EXPOSE 3000
CMD ["bun", "run", "dev"]