FROM oven/bun:latest
WORKDIR /gym-app
COPY package.json bun.lock
RUN bun install --frozen-lockfile
COPY . .
EXPOSE 3001
ENV NODE_ENV=production
CMD [ "bun", "run", "start" ]