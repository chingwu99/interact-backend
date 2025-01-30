import { Request, Response } from 'express'
import * as CommentService from '../services/comment.service'

export const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '未授權的操作' })
      return
    }

    const requestBody = req.body
    const { body, postId } = requestBody

    const comment = await CommentService.createComment({
      body,
      postId,
      // @ts-ignore
      userId: req.user.id,
    })

    res.status(201).json(comment)
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' })
  }
}
