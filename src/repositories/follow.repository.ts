import { User } from '@prisma/client'
import prisma from '@/libs/prismadb'

export const findById = async (userId: string): Promise<User | null> => {
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
    })
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

export const addFollower = async (targetUserId: string, followerId: string): Promise<User> => {
  try {
    const follower = await findById(followerId)
    if (!follower) {
      throw new Error('追蹤者不存在')
    }

    const updatedFollowingIds = [...(follower.followingIds || []), targetUserId]

    return await prisma.user.update({
      where: { id: followerId },
      data: { followingIds: updatedFollowingIds },
    })
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

export const removeFollower = async (targetUserId: string, followerId: string): Promise<User> => {
  try {
    const follower = await findById(followerId)
    if (!follower) {
      throw new Error('追蹤者不存在')
    }

    const updatedFollowingIds = (follower.followingIds || []).filter((id) => id !== targetUserId)

    return await prisma.user.update({
      where: { id: followerId },
      data: { followingIds: updatedFollowingIds },
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
