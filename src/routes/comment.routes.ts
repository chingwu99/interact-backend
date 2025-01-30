import { Router } from 'express'
import * as CommentController from '../controllers/comment.controller'
import { validateComment } from '../middleware/validators/comment.validator'

const router = Router()

router.post('/', validateComment, CommentController.createComment)

export { router as commentRouter }
