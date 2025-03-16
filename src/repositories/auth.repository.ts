import { User, RefreshToken } from '@prisma/client'
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

export const findById = async (id: string): Promise<User | null> => {
  try {
    return await prisma.user.findUnique({ where: { id } })
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

// RefreshToken 相關操作
export const createRefreshToken = async (userId: string, token: string, expiresAt: Date): Promise<RefreshToken> => {
  try {
    return await prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    })
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to create refresh token')
  }
}

export const findRefreshToken = async (token: string): Promise<RefreshToken | null> => {
  try {
    return await prisma.refreshToken.findUnique({
      where: { token },
    })
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to find refresh token')
  }
}

export const revokeRefreshToken = async (token: string): Promise<RefreshToken> => {
  try {
    return await prisma.refreshToken.update({
      where: { token },
      data: { isRevoked: true },
    })
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to revoke refresh token')
  }
}

export const revokeAllUserRefreshTokens = async (userId: string): Promise<void> => {
  try {
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { isRevoked: true },
    })
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to revoke user refresh tokens')
  }
}

export const deleteExpiredRefreshTokens = async (): Promise<void> => {
  try {
    await prisma.refreshToken.deleteMany({
      where: {
        OR: [{ expiresAt: { lt: new Date() } }, { isRevoked: true }],
      },
    })
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to delete expired refresh tokens')
  }
}
