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
      throw new Error('User not found')
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

interface UpdateUserParams {
  userId: string
  name: string
  username: string
  bio?: string | null
  profileImage?: string | null
  coverImage?: string | null
}

export const updateUser = async (params: UpdateUserParams): Promise<User> => {
  try {
    const { userId, ...updateData } = params

    if (!updateData.name || !updateData.username) {
      throw new Error('Name and username are required fields')
    }

    return await UserRepository.updateById(userId, updateData)
  } catch (error) {
    throw new Error(`Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
