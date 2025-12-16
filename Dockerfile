# Base image for building
FROM node:20-alpine AS builder

# Install dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files from blog directory
COPY blog/package.json blog/package-lock.json* ./
RUN npm ci

# Copy blog source and build
COPY blog/ .

# Next.js collects completely anonymous telemetry data about general usage.
# Uncomment the following line to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Production image - serve static files with nginx
FROM nginx:alpine AS runner

# Copy the static export from builder
COPY --from=builder /app/out /usr/share/nginx/html

# Copy nginx configuration for SPA routing
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ $uri.html /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
