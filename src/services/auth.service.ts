import { User } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import * as AuthRepository from '../repositories/auth.repository'

interface RegisterParams {
  email: string
  password: string
  name: string
  username: string // 添加必要的欄位
}

interface LoginResponse {
  user: Omit<User, 'hashedPassword'>
  token: string
}

export const register = async (params: RegisterParams): Promise<User> => {
  try {
    const existingUser = await AuthRepository.findByEmail(params.email)
    if (existingUser) {
      throw new Error('此信箱已被註冊')
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
    throw new Error(`註冊失敗: ${error instanceof Error ? error.message : '未知錯誤'}`)
  }
}

export const generateToken = (user: User): string =>
  jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '24h' })

export const formatUserResponse = (user: User): LoginResponse => {
  // eslint-disable-next-line no-unused-vars
  const { hashedPassword, ...userWithoutPassword } = user
  return {
    user: userWithoutPassword,
    token: generateToken(user),
  }
}
