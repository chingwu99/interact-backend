import app from './app'
import dotenv from 'dotenv'
import http from 'http'

dotenv.config()

const port = process.env.PORT || 3000
const server = http.createServer(app)

// 根據環境設定網域
const isDevelopment = process.env.NODE_ENV === 'development'
const domain = isDevelopment ? process.env.DEV_DOMAIN : process.env.PROD_DOMAIN

server.listen(port, () => {
  if (isDevelopment) {
    console.log(`Server is running on ${domain}:${port}`)
  } else {
    console.log(`Production server is running`)
  }
})

// 處理未捕獲的錯誤
process.on('uncaughtException', (error: Error) => {
  console.error('未捕獲的異常:', error)
  process.exit(1)
})

// 處理未處理的 Promise 拒絕
process.on('unhandledRejection', (reason: any) => {
  console.error('未處理的 Promise 拒絕:', reason)
  process.exit(1)
})

// 優雅關閉
const shutdown = () => {
  console.log('正在關閉伺服器...')
  server.close(() => {
    console.log('伺服器已關閉')
    process.exit(0)
  })

  // 如果 10 秒內無法正常關閉，則強制關閉
  setTimeout(() => {
    console.error('無法正常關閉伺服器，強制關閉')
    process.exit(1)
  }, 10000)
}

// 監聽關閉信號
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
