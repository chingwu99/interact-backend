import { Router } from 'express'
import * as PostController from '../controllers/post.controller'
import { validatePost } from '../middleware/validators/post.validator'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.get('/', PostController.getPosts)
router.get('/:postId', PostController.getPostById)
router.post('/create', authenticate, validatePost, PostController.createPost)

export { router as postRouter }
