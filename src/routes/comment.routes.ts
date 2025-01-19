import { Router } from 'express'
// import * as CommentController from '../controllers/comment.controller'
// import { validateComment } from '../middleware/validators/comment.validator'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.use(authenticate)

// router.post('/', validateComment, CommentController.createComment)
// router.get('/post/:postId', CommentController.getPostComments)
// router.put('/:id', validateComment, CommentController.updateComment)
// router.delete('/:id', CommentController.deleteComment)

export { router as commentRouter }
