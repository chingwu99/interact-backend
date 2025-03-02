import { Router } from 'express'
import * as LikeController from '../controllers/like.controller'
import { validatePostId } from '../middleware/validators/like.validator'

const router = Router()

router.post('/add', validatePostId, LikeController.likePost)
router.delete('/remove', validatePostId, LikeController.unlikePost)

export { router as likeRouter }
