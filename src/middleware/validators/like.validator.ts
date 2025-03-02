import { Request, Response, NextFunction } from 'express'
import { HttpException } from '../error.middleware'

export const validatePostId = (req: Request, _res: Response, next: NextFunction) => {
  const { postId } = req.body

  if (!postId || typeof postId !== 'string') {
    throw new HttpException(400, 'Invalid post ID')
  }

  next()
}
