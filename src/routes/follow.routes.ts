import { Router } from 'express'
import * as FollowController from '../controllers/follow.controller'
import { validateUserId } from '../middleware/validators/follow.validator'

const router = Router()

router.post('/add', validateUserId, FollowController.followUser)
router.delete('/remove', validateUserId, FollowController.unfollowUser)

export { router as followRouter }
