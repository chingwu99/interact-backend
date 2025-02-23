import { Post } from '@prisma/client'
import prisma from '@/libs/prismadb'

export const findMany = async (userId?: string): Promise<Post[]> => {
  try {
    const whereClause = userId ? { userId } : {}

    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        user: true,
        comments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return posts
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

interface CreatePostData {
  body: string
  userId: string
}

export const create = async (data: CreatePostData): Promise<Post> => {
  try {
    return await prisma.post.create({
      data,
    })
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

export const findById = async (postId: string) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        user: true,
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    return post
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}
