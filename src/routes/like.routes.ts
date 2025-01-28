import { Router } from 'express'
import * as LikeController from '../controllers/like.controller'
import { authenticate } from '../middleware/auth.middleware'
import { validatePostId } from '../middleware/validators/like.validator'

const router = Router()

router.post('/', authenticate, validatePostId, LikeController.likePost)
router.delete('/', authenticate, validatePostId, LikeController.unlikePost)

export { router as likeRouter }
