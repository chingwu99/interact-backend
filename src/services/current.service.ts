import * as CurrentRepository from '../repositories/current.repository'

interface GetCurrentUserParams {
  userId: string
}

export const getCurrentUser = async (params: GetCurrentUserParams) => {
  try {
    const currentUser = await CurrentRepository.findById(params.userId)
    if (!currentUser) {
      throw new Error('使用者不存在')
    }
    return currentUser
  } catch (error) {
    throw new Error(`Failed to fetch current user: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
