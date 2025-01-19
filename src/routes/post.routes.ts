import { Router } from 'express'
import * as PostController from '../controllers/post.controller'
// import { validatePost } from '../middleware/validators/post.validator'

const router = Router()

// 暫時移除身份驗證
// router.use(authenticate)

// 基本的貼文操作
router.get('/', PostController.getPosts)
router.get('/:postId', PostController.getPostById)
// router.post('/', validatePost, PostController.createPost)

export { router as postRouter }
