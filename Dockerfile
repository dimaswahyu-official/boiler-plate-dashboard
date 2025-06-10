# Tahap build
FROM node:18 AS build
WORKDIR /app

# Copy dan install dependency
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY tailwind.config.cjs ./
COPY postcss.config.js ./
RUN npm install

# Salin semua source code
COPY . .

# Build project
RUN npm run build

# Tahap serve dengan nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
