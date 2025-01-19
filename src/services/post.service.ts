import * as PostRepository from '../repositories/post.repository'
import { Post } from '@prisma/client'

interface GetPostsParams {
  userId?: string
}

export const getPosts = async (params: GetPostsParams): Promise<Post[]> => {
  try {
    return await PostRepository.findMany(params.userId)
  } catch (error) {
    throw new Error(`Failed to fetch posts: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export const createPost = async (postData: Omit<Post, 'id' | 'createdAt' | 'updateAt'>): Promise<Post> => {
  try {
    return await PostRepository.create(postData)
  } catch (error) {
    throw new Error(`Failed to create post: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
