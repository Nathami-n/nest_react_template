FROM node:20-alpine AS base

# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Prune the workspace for the web app
FROM base AS prune
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune web --docker

# Install dependencies and build
FROM base AS build
WORKDIR /app

# Build argument for Vite environment variable
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY --from=prune /app/out/json/ .
COPY --from=prune /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

COPY --from=prune /app/out/full/ .
# Build the web app
RUN pnpm run build --filter=web...

# Production image
FROM base AS runner
WORKDIR /app

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 reactjs
USER reactjs

# Copy the entire built workspace to ensure all dependencies are available
COPY --from=build --chown=reactjs:nodejs /app .

# Expose Web port
EXPOSE 3000

# Start the application  
ENV NODE_ENV=production
WORKDIR /app/apps/web
CMD ["pnpm", "run", "start"]