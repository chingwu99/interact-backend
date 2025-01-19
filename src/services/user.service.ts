import * as UserRepository from '../repositories/user.repository'
import { User } from '@prisma/client'

const validateEmail = (email: string): void => {
  if (!email.includes('@')) {
    throw new Error('無效的電子郵件')
  }
}

export const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
  try {
    // 1. 驗證電子郵件
    validateEmail(userData.email)

    // 2. 檢查用戶是否已存在
    const existingUser = await UserRepository.findByEmail(userData.email)
    if (existingUser) {
      throw new Error('用戶已存在')
    }

    // 3. 創建用戶
    return await UserRepository.create(userData)
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

export const getUsers = async (): Promise<User[]> => {
  try {
    return await UserRepository.findManyWithOrder()
  } catch (error) {
    throw new Error(`Failed to fetch users: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

interface GetUserByIdParams {
  userId: string
}

export const getUserById = async (params: GetUserByIdParams) => {
  try {
    const user = await UserRepository.findByIdWithFollowers(params.userId)
    if (!user) {
      throw new Error('使用者不存在')
    }
    return user
  } catch (error) {
    throw new Error(`Failed to fetch user: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
