import { User } from '@prisma/client'
import bcrypt from 'bcrypt'
import * as AuthRepository from '../repositories/auth.repository'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

interface RegisterParams {
  email: string
  password: string
  name: string
  username: string
}

interface LoginResponse {
  user: Omit<User, 'hashedPassword'>
}

interface TokenValidationResult {
  valid: boolean
  reason?: string
  userId?: string
}

export const register = async (params: RegisterParams): Promise<User> => {
  try {
    const existingUser = await AuthRepository.findByEmail(params.email)
    if (existingUser) {
      throw new Error('Email already registered')
    }

    const { password, ...userParams } = params
    const hashedPassword = await bcrypt.hash(password, 12)

    return await AuthRepository.create({
      ...userParams,
      hashedPassword,
      followingIds: [],
      hasNotification: false,
      bio: null,
      emailVerified: null,
      image: null,
      coverImage: null,
      profileImage: null,
    })
  } catch (error) {
    throw new Error(`Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export const formatUserResponse = (user: User): LoginResponse => {
  // eslint-disable-next-line no-unused-vars
  const { hashedPassword, ...userWithoutPassword } = user
  return { user: userWithoutPassword }
}

// 生成 access token 和 refresh token
export const generateTokens = async (userId: string) => {
  try {
    // 生成 access token 使用 JWT
    const accessToken = jwt.sign(
      { id: userId },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: '15m' } // Access Token 15分鐘
    )

    // 使用加密安全的隨機字符串作為 refresh token
    const refreshToken = crypto.randomBytes(64).toString('hex')

    // 計算過期時間 (3天)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 3)

    // 將 refresh token 存入資料庫
    await AuthRepository.createRefreshToken(userId, refreshToken, expiresAt)

    return { accessToken, refreshToken }
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to generate tokens')
  }
}

// 驗證 refresh token 是否有效
export const validateRefreshToken = async (token: string): Promise<TokenValidationResult> => {
  try {
    // 從資料庫查詢 refresh token
    const storedToken = await AuthRepository.findRefreshToken(token)

    // 檢查 token 是否存在
    if (!storedToken) {
      return { valid: false, reason: 'token_not_found' }
    }

    // 檢查 token 是否過期
    if (storedToken.expiresAt < new Date()) {
      await AuthRepository.revokeRefreshToken(token)
      return { valid: false, reason: 'token_expired' }
    }

    // 檢查 token 是否已被撤銷
    if (storedToken.isRevoked) {
      return { valid: false, reason: 'token_revoked' }
    }

    // Token 有效
    return { valid: true, userId: storedToken.userId }
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to validate refresh token')
  }
}

// 撤銷單個 refresh token
export const revokeRefreshToken = async (token: string): Promise<void> => {
  try {
    await AuthRepository.revokeRefreshToken(token)
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to revoke refresh token')
  }
}

// 撤銷用戶的所有 refresh tokens
export const revokeAllUserRefreshTokens = async (userId: string): Promise<void> => {
  try {
    await AuthRepository.revokeAllUserRefreshTokens(userId)
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to revoke all user refresh tokens')
  }
}

// 清理過期的 refresh tokens
export const cleanupExpiredTokens = async (): Promise<void> => {
  try {
    await AuthRepository.deleteExpiredRefreshTokens()
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to cleanup expired tokens')
  }
}
