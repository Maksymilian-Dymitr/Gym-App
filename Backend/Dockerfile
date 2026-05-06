FROM oven/bun:latest
WORKDIR /app
COPY package.json bun.lock
RUN bun install --frozen-lockfile
COPY . .
EXPOSE 3001
RUN bunx prisma generate
ENV NODE_ENV=production
CMD [ "bun", "run", "start" ]