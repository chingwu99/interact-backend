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

interface GetPostByIdParams {
  postId: string
}

export const getPostById = async (params: GetPostByIdParams) => {
  try {
    const post = await PostRepository.findById(params.postId)
    if (!post) {
      throw new Error('Post not found')
    }
    return post
  } catch (error) {
    throw new Error(`Failed to fetch post: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// export const createPost = async (postData: Omit<Post, 'id' | 'createdAt' | 'updateAt'>): Promise<Post> => {
//   try {
//     return await PostRepository.create(postData)
//   } catch (error) {
//     throw new Error(`Failed to create post: ${error instanceof Error ? error.message : 'Unknown error'}`)
//   }
// }
