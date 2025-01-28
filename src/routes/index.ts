import { Router } from 'express'
import { userRouter } from './user.routes'
import { postRouter } from './post.routes'
import { authRouter } from './auth.routes'
import { likeRouter } from './like.routes'
import { followRouter } from './follow.routes'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

// API version
const API_VERSION = '/api/v1'

// Public routes
router.use(`${API_VERSION}/users`, userRouter)
router.use(`${API_VERSION}/auth`, authRouter)
router.use(`${API_VERSION}/posts`, postRouter)

// Protected routes
router.use(`${API_VERSION}/likes`, authenticate, likeRouter)
router.use(`${API_VERSION}/follows`, authenticate, followRouter)

export { router as apiRouter }
