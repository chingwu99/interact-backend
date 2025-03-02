# 使用 Node.js 22 作為基礎鏡像
FROM node:22-alpine

# 設置工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製源代碼
COPY . .

# 建立 prisma client
RUN npx prisma generate

# 構建應用
RUN npm run build

# 暴露端口
EXPOSE 8080

# 啟動應用
CMD ["npm", "run", "start"] 