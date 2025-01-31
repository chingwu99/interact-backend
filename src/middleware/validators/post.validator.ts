import { Request, Response, NextFunction } from 'express'
import { HttpException } from '../error.middleware'

export const validatePost = (req: Request, _res: Response, next: NextFunction) => {
  const { body } = req.body

  if (!body || typeof body !== 'string') {
    throw new HttpException(400, '貼文內容不能為空')
  }

  if (body.length > 500) {
    throw new HttpException(400, '貼文內容不能超過 500 字')
  }

  next()
}
