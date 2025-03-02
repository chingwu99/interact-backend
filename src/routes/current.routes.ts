import { Router } from 'express'
import * as CurrentController from '../controllers/current.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.get('/', authenticate, CurrentController.getCurrentUser)

export { router as currentRouter }
