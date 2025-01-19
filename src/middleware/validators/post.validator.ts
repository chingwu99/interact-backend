import { Request, Response, NextFunction } from 'express'
import { HttpException } from '../error.middleware'

export const validatePost = (req: Request, _res: Response, next: NextFunction) => {
  const { body, userId } = req.body

  if (!body || !userId) {
    throw new HttpException(400, '缺少必要欄位')
  }

  if (typeof body !== 'string' || body.length === 0) {
    throw new HttpException(400, '貼文內容不能為空')
  }

  next()
}
