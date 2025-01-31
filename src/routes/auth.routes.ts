import { Router } from 'express'
import passport from 'passport'
import * as AuthController from '../controllers/auth.controller'
import { validateUser } from '../middleware/validators/user.validator'

const router = Router()

router.post('/register', validateUser, AuthController.register)
router.post('/login', AuthController.login)

// Google OAuth 路由
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }))

router.get('/google/callback', passport.authenticate('google', { session: false }), AuthController.googleCallback)

export { router as authRouter }
