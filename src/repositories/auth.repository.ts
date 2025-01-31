import { User } from '@prisma/client'
import prisma from '../libs/prismadb'

export const create = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
  try {
    return await prisma.user.create({ data: userData })
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
