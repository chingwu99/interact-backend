import { Router } from 'express'
// import passport from 'passport'
import * as AuthController from '../controllers/auth.controller'
import { validateUser } from '../middleware/validators/user.validator'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.post('/register', validateUser, AuthController.register)
router.post('/login', AuthController.login)
router.post('/logout', AuthController.logout)
router.post('/refresh-token', AuthController.refreshAccessToken)
router.post('/logout-all-devices', authenticate, AuthController.logoutAllDevices)

export { router as authRouter }
