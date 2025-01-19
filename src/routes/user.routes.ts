import { Router } from 'express'
import * as UserController from '../controllers/user.controller'
import { validateUser } from '../middleware/validators/user.validator'

const router = Router()

// Public routes
router.post('/register', validateUser, UserController.createUser)
router.get('/', UserController.getUsers)
router.get('/:userId', UserController.getUserById)

// // Protected routes - 暫時註解
// router.use(authenticate)
// router.get('/profile', UserController.getProfile)
// router.put('/profile', validateUser, UserController.updateProfile)
// router.get('/following', UserController.getFollowing)
// router.post('/:id/follow', UserController.followUser)
// router.delete('/:id/follow', UserController.unfollowUser)

export { router as userRouter }
