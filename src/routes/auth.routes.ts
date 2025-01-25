import { Router } from 'express'
import * as AuthController from '../controllers/auth.controller'
import { validateUser } from '../middleware/validators/user.validator'

const router = Router()

router.post('/register', validateUser, AuthController.register)
router.post('/login', AuthController.login)

export { router as authRouter }
