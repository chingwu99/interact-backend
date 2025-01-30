import { Comment, Post } from '@prisma/client'
import prisma from '@/libs/prismadb'

interface CreateCommentData {
  body: string
  userId: string
  postId: string
}

export const create = async (data: CreateCommentData): Promise<Comment> => {
  try {
    return await prisma.comment.create({
      data,
    })
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

export const findPostById = async (postId: string): Promise<Post | null> => {
  try {
    return await prisma.post.findUnique({
      where: { id: postId },
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
