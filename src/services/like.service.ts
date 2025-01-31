import { Post } from '@prisma/client'
import * as LikeRepository from '../repositories/like.repository'

interface LikePostParams {
  postId: string
  userId: string
}

export const likePost = async (params: LikePostParams): Promise<Post> => {
  try {
    const post = await LikeRepository.findPostById(params.postId)
    if (!post) {
      throw new Error('貼文不存在')
    }

    const updatedPost = await LikeRepository.addLike(params.postId, params.userId)

    // 建立通知
    await LikeRepository.createNotification({
      body: 'Someone liked your interact!',
      userId: post.userId,
    })

    return updatedPost
  } catch (error) {
    throw new Error(`Failed to like post: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export const unlikePost = async (params: LikePostParams): Promise<Post> => {
  try {
    const post = await LikeRepository.findPostById(params.postId)
    if (!post) {
      throw new Error('貼文不存在')
    }

    return await LikeRepository.removeLike(params.postId, params.userId)
  } catch (error) {
    throw new Error(`Failed to unlike post: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
