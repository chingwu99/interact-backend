import express from 'express'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import { apiRouter } from './routes/index'
import { errorMiddleware } from './middleware/error.middleware'
import passport from './config/passport'
import helmet from 'helmet'

const app = express()

app.use(
  cors({
    origin: ['http://localhost:8080', 'http://localhost:3000', 'https://interact.up.railway.app/'],
    credentials: true,
  })
)

app.use(compression())
app.use(cookieParser())
app.use(express.json())

app.use(passport.initialize())

app.use(helmet())
// app.use(
//   helmet({
//     // 內容安全政策（Content Security Policy, CSP）
//     contentSecurityPolicy: {
//       directives: {
//         // 只允許從同源載入資源
//         defaultSrc: ["'self'"],
//         // 允許從同源和內聯腳本執行 JavaScript
//         scriptSrc: ["'self'", "'unsafe-inline'"],
//         // 允許從同源和內聯樣式載入 CSS
//         styleSrc: ["'self'", "'unsafe-inline'"],
//         // 允許圖片來源：
//         // - 同源（'self'）
//         // - Data URLs（如 base64 編碼的圖片）
//         // - 任何 HTTPS 來源
//         imgSrc: ["'self'", 'data:', 'https:'],
//       },
//     },

//     // 關閉跨源嵌入器政策
//     // 這允許您的網站能夠嵌入來自其他來源的資源
//     crossOriginEmbedderPolicy: false,

//     // 設定跨源資源政策為 "cross-origin"
//     // 允許其他網站引用您的資源
//     crossOriginResourcePolicy: { policy: 'cross-origin' },
//   })
// )

app.use(apiRouter)

app.use(errorMiddleware)

export default app
