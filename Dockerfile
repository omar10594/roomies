FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy workspace files for pnpm
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY webapp/package.json ./webapp/
COPY landing/package.json ./landing/

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install all dependencies (including dev)
RUN pnpm fetch --ignore-scripts && pnpm install --ignore-scripts

# Rebuild source only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/webapp/node_modules ./webapp/node_modules
COPY --from=deps /app/landing/node_modules ./landing/node_modules
COPY webapp ./webapp
COPY landing ./landing

# Build Next.js app
WORKDIR /app/webapp
RUN pnpm build

# Build Astro landing page
WORKDIR /app/landing
RUN pnpm build

# Production image for Next.js
FROM node:20-alpine AS webapp-prod
WORKDIR /app/webapp
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/webapp/.next/standalone ./

# Copy public directory for static file serving
COPY --from=builder --chown=nextjs:nodejs /app/webapp/public ./public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]

# Production image for Astro landing page
FROM nginx:alpine AS landing-prod
COPY --from=builder /app/landing/dist /usr/share/nginx/html
COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name roomies.app www.roomies.app;
    root /usr/share/nginx/html;
    index index.html;

    # Security headers
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options DENY always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Cache-Control "public, max-age=31536000, immutable" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
    gzip_min_length 256;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets with long cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

EXPOSE 80
