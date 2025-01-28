import { Router } from 'express'
import * as UserController from '../controllers/user.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

// Public routes
router.get('/', UserController.getUsers)
router.get('/:userId', UserController.getUserById)
router.get('/:userId/notifications', authenticate, UserController.getNotifications)

// Protected routes
router.patch('/update', authenticate, UserController.updateUser)

// // Protected routes - 暫時註解
// router.use(authenticate)
// router.get('/profile', UserController.getProfile)
// router.put('/profile', validateUser, UserController.updateProfile)
// router.get('/following', UserController.getFollowing)
// router.post('/:id/follow', UserController.followUser)
// router.delete('/:id/follow', UserController.unfollowUser)

export { router as userRouter }
