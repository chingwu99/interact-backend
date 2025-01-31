import { Request, Response } from 'express'
import * as PostService from '../services/post.service'

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await PostService.getPosts({ userId: req.query.userId as string | undefined })
    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' })
  }
}

export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    // 確保用戶已認證
    if (!req.user) {
      res.status(401).json({ error: '未授權的操作' })
      return
    }

    const requestBody = req.body
    const { body } = requestBody

    const post = await PostService.createPost({
      body,
      // @ts-ignore
      userId: req.user.id,
    })

    res.status(201).json(post)
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' })
  }
}

export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await PostService.getPostById({ postId: req.params.postId })
    res.status(200).json(post)
  } catch (error) {
    res
      .status(error instanceof Error && error.message === 'Post not found' ? 404 : 500)
      .json({ error: error instanceof Error ? error.message : 'Unknown error' })
  }
}
