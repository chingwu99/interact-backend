import { Request, Response, NextFunction } from 'express'
import { HttpException } from '../error.middleware'

export const validateUser = (req: Request, _res: Response, next: NextFunction) => {
  const { email, username, password } = req.body

  if (!email || !username || !password) {
    return next(new HttpException(400, 'Missing required fields'))
  }

  if (!email.includes('@')) {
    return next(new HttpException(400, 'Invalid email format'))
  }

  if (password.length < 8) {
    return next(new HttpException(400, 'Password must be at least 8 characters long'))
  }

  next()
}
