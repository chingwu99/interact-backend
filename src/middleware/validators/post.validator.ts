import { Request, Response, NextFunction } from 'express'
import { HttpException } from '../error.middleware'

export const validatePost = (req: Request, _res: Response, next: NextFunction) => {
  const { body } = req.body

  if (!body || typeof body !== 'string') {
    throw new HttpException(400, 'Post content cannot be empty')
  }

  if (body.length > 500) {
    throw new HttpException(400, 'Post content cannot exceed 500 characters')
  }

  next()
}
