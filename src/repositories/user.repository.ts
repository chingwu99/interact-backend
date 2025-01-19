import { User } from '@prisma/client'
import prisma from '../libs/prismadb'

export const create = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
  try {
    return await prisma.user.create({ data: userData })
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

export const findAll = async (): Promise<User[]> => {
  try {
    return await prisma.user.findMany()
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

export const findByEmail = async (email: string): Promise<User | null> => {
  try {
    return await prisma.user.findUnique({ where: { email } })
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
