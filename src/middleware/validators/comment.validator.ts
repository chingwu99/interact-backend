import { Request, Response, NextFunction } from 'express'
import { HttpException } from '../error.middleware'

export const validateComment = (req: Request, _res: Response, next: NextFunction) => {
  const { body } = req.body

  if (!body || typeof body !== 'string') {
    return next(new HttpException(400, 'Reply content cannot be empty'))
  }

  if (body.length > 300) {
    return next(new HttpException(400, 'Reply content cannot exceed 300 characters'))
  }

  next()
}
