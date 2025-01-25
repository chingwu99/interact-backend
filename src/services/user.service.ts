import * as UserRepository from '../repositories/user.repository'
import { User } from '@prisma/client'

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

interface GetNotificationsParams {
  userId: string
}

export const getNotifications = async (params: GetNotificationsParams) => {
  try {
    const notifications = await UserRepository.findNotificationsAndUpdate(params.userId)
    return notifications
  } catch (error) {
    throw new Error(`Failed to fetch notifications: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
