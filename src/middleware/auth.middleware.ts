import { Request, Response, NextFunction } from 'express'
import { HttpException } from './error.middleware'

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    throw new HttpException(401, '未提供認證令牌')
  }

  try {
    // 這裡實作你的認證邏輯
    // 例如: JWT 驗證
    next()
  } catch (error) {
    next(new HttpException(401, '無效的認證令牌'))
  }
}
