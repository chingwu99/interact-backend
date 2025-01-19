import { Request, Response, NextFunction } from 'express'
import { HttpException } from '../error.middleware'

export const validateUser = (req: Request, _res: Response, next: NextFunction) => {
  const { email, username, password } = req.body

  if (!email || !username || !password) {
    throw new HttpException(400, '缺少必要欄位')
  }

  if (!email.includes('@')) {
    throw new HttpException(400, '無效的電子郵件格式')
  }

  if (password.length < 6) {
    throw new HttpException(400, '密碼長度必須至少為 6 個字元')
  }

  next()
}
