import { Post } from '@prisma/client'
import prisma from '@/libs/prismadb'

export const findPostById = async (postId: string): Promise<Post | null> => {
  try {
    return await prisma.post.findUnique({
      where: { id: postId },
    })
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

export const addLike = async (postId: string, userId: string): Promise<Post> => {
  try {
    const post = await findPostById(postId)
    if (!post) {
      throw new Error('Post not found')
    }

    const updatedLikedIds = [...(post.likedIds || []), userId]

    return await prisma.post.update({
      where: { id: postId },
      data: { likedIds: updatedLikedIds },
    })
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

export const removeLike = async (postId: string, userId: string): Promise<Post> => {
  try {
    const post = await findPostById(postId)
    if (!post) {
      throw new Error('Post not found')
    }

    const updatedLikedIds = (post.likedIds || []).filter((id) => id !== userId)

    return await prisma.post.update({
      where: { id: postId },
      data: { likedIds: updatedLikedIds },
    })
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

interface CreateNotificationData {
  body: string
  userId: string
}

export const createNotification = async (data: CreateNotificationData): Promise<void> => {
  try {
    await prisma.notification.create({
      data,
    })

    await prisma.user.update({
      where: { id: data.userId },
      data: { hasNotification: true },
    })
  } catch (error) {
    console.error('Failed to create notification:', error)
  }
}
