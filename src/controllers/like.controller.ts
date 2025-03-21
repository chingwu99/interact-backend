import { Request, Response } from 'express'
import * as LikeService from '../services/like.service'
import { RequestUser } from '../types/request.type'

export const likePost = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized operation' })
      return
    }

    const { postId } = req.body
    const post = await LikeService.likePost({
      postId,
      userId: (req.user as RequestUser).id,
    })

    res.status(200).json(post)
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' })
  }
}

export const unlikePost = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized operation' })
      return
    }

    const { postId } = req.body
    const post = await LikeService.unlikePost({
      postId,
      userId: (req.user as RequestUser).id,
    })

    res.status(200).json(post)
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' })
  }
}
