import { Router } from 'express'
import { userRouter } from './user.routes'
import { postRouter } from './post.routes'
import { authRouter } from './auth.routes'

import { authenticate } from '../middleware/auth.middleware'

const router = Router()

// API 版本控制
const API_VERSION = '/api/v1'

// 各模組的路由
router.use(`${API_VERSION}/users`, userRouter)
router.use(`${API_VERSION}/auth`, authRouter)
router.use(`${API_VERSION}/posts`, authenticate, postRouter)

export { router as apiRouter }
