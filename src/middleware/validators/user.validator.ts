import { Request, Response, NextFunction } from 'express'
import { HttpException } from '../error.middleware'

export const validateUser = (req: Request, _res: Response, next: NextFunction) => {
  const { email, username, password } = req.body

  if (!email || !username || !password) {
    throw new HttpException(400, 'Missing required fields')
  }

  if (!email.includes('@')) {
    throw new HttpException(400, 'Invalid email format')
  }

  if (password.length < 8) {
    throw new HttpException(400, 'Password must be at least 8 characters long')
  }

  next()
}
