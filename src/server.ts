import http from 'http'
import { isProduction } from './env'
import app from './app'
import { cleanupExpiredTokens } from './middleware/auth.middleware'

const port = process.env.PORT || 8080
const server = http.createServer(app)

// 根據環境設定網域

server.listen(port, () => {
  if (!isProduction) {
    console.log(`Server is running on ${process.env.DOMAIN}:${port}`)
  } else {
    console.log(`Production server is running`)
  }

  // 啟動時先清理一次過期的 refresh tokens
  cleanupExpiredTokens().catch((err) => console.error('Failed to clean up tokens on startup:', err))

  // 設置定期清理過期的 refresh tokens (每天執行一次)
  setInterval(
    () => {
      cleanupExpiredTokens().catch((err) => console.error('Failed to clean up tokens:', err))
    },
    24 * 60 * 60 * 1000
  ) // 24小時
})

// 處理未捕獲的錯誤
process.on('uncaughtException', (error: Error) => {
  console.error('未捕獲的異常:', error)
  process.exit(1)
})

// 處理未處理的 Promise 拒絕
process.on('unhandledRejection', (reason: any) => {
  console.error('Unhandled Promise Rejection:', reason)
  process.exit(1)
})

// 優雅關閉
const shutdown = () => {
  console.log('Shutting down server...')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })

  // 如果 10 秒內無法正常關閉，則強制關閉
  setTimeout(() => {
    console.error('Could not gracefully shut down the server, forcing shutdown')
    process.exit(1)
  }, 10000)
}

// 監聽關閉信號
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
