import { User } from '@prisma/client'
import prisma from '../libs/prismadb'

export const findAll = async (): Promise<User[]> => {
  try {
    return await prisma.user.findMany()
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

export const findManyWithOrder = async (): Promise<User[]> => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return users || []
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

interface UserWithFollowers extends User {
  followersCount: number
}

export const findByIdWithFollowers = async (userId: string): Promise<UserWithFollowers | null> => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!existingUser) {
      return null
    }

    const followersCount = await prisma.user.count({
      where: {
        followingIds: {
          has: userId,
        },
      },
    })

    return {
      ...existingUser,
      followersCount,
    }
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

export const findNotificationsAndUpdate = async (userId: string) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hasNotification: false,
      },
    })

    return notifications
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

interface UpdateUserData {
  name: string
  username: string
  bio?: string | null
  profileImage?: string | null
  coverImage?: string | null
}

export const updateById = async (userId: string, data: UpdateUserData): Promise<User> => {
  try {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data,
    })
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}
