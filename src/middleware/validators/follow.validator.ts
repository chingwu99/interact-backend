import { Request, Response, NextFunction } from 'express'
import { HttpException } from '../error.middleware'

export const validateUserId = (req: Request, _res: Response, next: NextFunction) => {
  const { userId } = req.body

  if (!userId || typeof userId !== 'string') {
    return next(new HttpException(400, 'Invalid user ID'))
  }

  next()
}
