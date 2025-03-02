# 構建階段
FROM node:20-alpine AS builder

# 設置工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 只安裝生產環境必需的依賴
RUN npm install --production=false

# 複製源代碼
COPY . .

# 生成 Prisma 客戶端和構建
RUN npx prisma generate && npm run build

# 生產環境階段
FROM node:20-alpine

WORKDIR /app

# 安裝必要的系統依賴
RUN apk add --no-cache openssl

# 只複製必要的文件
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# 只安裝生產環境依賴
# 移除 husky prepare 腳本並安裝生產依賴
RUN npm pkg delete scripts.prepare && \
    npm install --omit=dev

# 設置環境變數和啟動命令
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]