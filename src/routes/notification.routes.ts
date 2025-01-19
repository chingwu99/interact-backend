import { Router } from 'express'
// import * as NotificationController from '../controllers/notification.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.use(authenticate)

// router.get('/', NotificationController.getNotifications)
// router.put('/:id/read', NotificationController.markAsRead)
// router.put('/read-all', NotificationController.markAllAsRead)

export { router as notificationRouter }
