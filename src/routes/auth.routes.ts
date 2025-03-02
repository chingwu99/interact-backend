import { Router } from 'express'
// import passport from 'passport'
import * as AuthController from '../controllers/auth.controller'
import { validateUser } from '../middleware/validators/user.validator'

const router = Router()

router.post('/register', validateUser, AuthController.register)
router.post('/login', AuthController.login)
router.post('/logout', AuthController.logout)

export { router as authRouter }
