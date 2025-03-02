import { User } from '@prisma/client'
import * as FollowRepository from '../repositories/follow.repository'

interface FollowUserParams {
  userId: string
  followerId: string
}

export const followUser = async (params: FollowUserParams): Promise<User> => {
  try {
    const user = await FollowRepository.findById(params.userId)
    if (!user) {
      throw new Error('User not found')
    }

    const updatedUser = await FollowRepository.addFollower(params.userId, params.followerId)

    // 建立通知
    await FollowRepository.createNotification({
      body: 'Someone followed you!',
      userId: params.userId,
    })

    return updatedUser
  } catch (error) {
    throw new Error(`Failed to follow user: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export const unfollowUser = async (params: FollowUserParams): Promise<User> => {
  try {
    const user = await FollowRepository.findById(params.userId)
    if (!user) {
      throw new Error('User not found')
    }

    return await FollowRepository.removeFollower(params.userId, params.followerId)
  } catch (error) {
    throw new Error(`Failed to unfollow user: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
