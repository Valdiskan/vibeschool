FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Копируем файлы зависимостей
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force


FROM node:20-alpine AS builder
WORKDIR /app

# Копируем зависимости из предыдущей стадии
COPY --from=deps /app/node_modules ./node_modules

# Копируем исходный код
COPY . .

# Если у вас есть dev-зависимости, установите их для сборки
RUN npm ci && npm cache clean --force

# Собираем Next.js приложение
RUN npm run build



FROM node:18-alpine AS runner
WORKDIR /app

# Создаём непривилегированного пользователя
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Копируем только необходимые файлы из сборки
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Настройка прав (если используете static)
COPY --from=builder /app/.next/static ./.next/static

# Переключаемся на непривилегированного пользователя
USER nextjs

# Порт, который будет слушать приложение
EXPOSE 3001

# Переменные окружения (можно передавать через -e или .env)
ENV PORT=3001
ENV NODE_ENV=production

# Запуск приложения
CMD ["node", "server.js"]
