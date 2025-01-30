import { Request, Response, NextFunction } from 'express'
import { HttpException } from '../error.middleware'

export const validateComment = (req: Request, _res: Response, next: NextFunction) => {
  const { body } = req.body

  if (!body || typeof body !== 'string') {
    throw new HttpException(400, '評論內容不能為空')
  }

  if (body.length > 300) {
    throw new HttpException(400, '評論內容不能超過 300 字')
  }

  next()
}
