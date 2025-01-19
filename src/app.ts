import express from 'express'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import { apiRouter } from './routes/index'
import { errorMiddleware } from './middleware/error.middleware'
import passport from './config/passport'

const app = express()

app.use(
  cors()
  //   {
  //   origin: 'http://localhost:8080',
  //   credentials: true,
  // }
)

app.use(compression())
app.use(cookieParser())
app.use(express.json())

app.use(passport.initialize())

app.use(apiRouter)

app.use(errorMiddleware)

export default app
