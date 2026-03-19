FROM node:20-alpine AS base

# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Prune the workspace for the api app
FROM base AS prune
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune @repo/api --docker

# Install dependencies and build
FROM base AS build
WORKDIR /app
COPY --from=prune /app/out/json/ .
COPY --from=prune /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Copy prisma schema before installing dependencies
COPY --from=prune /app/out/full/apps/api/prisma ./apps/api/prisma

RUN pnpm install --frozen-lockfile

COPY --from=prune /app/out/full/ .
RUN pnpm run build --filter=@repo/api...

# Production image
FROM base AS runner
WORKDIR /app

# Don't run as root
RUN  addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

USER nestjs

COPY --from=build --chown=nestjs:nodejs /app .

# Expose API port
EXPOSE 3000

# Start the application
CMD ["sh", "-c", "npx prisma migrate deploy && node apps/api/dist/apps/api/main"]
