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

export { router as userRouter }
