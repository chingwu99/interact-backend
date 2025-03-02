import { Comment } from '@prisma/client'
import * as CommentRepository from '../repositories/comment.repository'

interface CreateCommentParams {
  body: string
  userId: string
  postId: string
}

export const createComment = async (params: CreateCommentParams): Promise<Comment> => {
  try {
    const post = await CommentRepository.findPostById(params.postId)
    if (!post) {
      throw new Error('Post not found')
    }

    const comment = await CommentRepository.create(params)

    // 建立通知
    await CommentRepository.createNotification({
      body: 'Someone replied on your interact!',
      userId: post.userId,
    })

    return comment
  } catch (error) {
    throw new Error(`Failed to create comment: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
