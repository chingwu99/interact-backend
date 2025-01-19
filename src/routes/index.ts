import { Router } from 'express'
// import { userRouter } from './user.routes'
import { postRouter } from './post.routes'

const router = Router()

// API 版本控制
const API_VERSION = '/api/v1'

// 各模組的路由
// router.use(`${API_VERSION}/users`, userRouter)
router.use(`${API_VERSION}/posts`, postRouter)

export { router as apiRouter }
