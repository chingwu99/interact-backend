import { Request, Response, NextFunction } from 'express'
import { HttpException } from './error.middleware'
import jwt from 'jsonwebtoken'
import * as AuthService from '../services/auth.service'

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken

  // 如果沒有 access token
  if (!accessToken) {
    return next(new HttpException(401, 'Access token not provided'))
  }

  // 驗證 access token
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET!) as { id: string }
    // eslint-disable-next-line no-param-reassign
    req.user = decoded
    return next()
  } catch (error) {
    return next(new HttpException(401, 'Invalid or expired access token'))
  }
}

// 定期清理過期的 refresh tokens
export const cleanupExpiredTokens = async () => {
  try {
    await AuthService.cleanupExpiredTokens()
    console.log('Expired refresh tokens cleaned up')
  } catch (error) {
    console.error('Failed to clean up expired tokens:', error)
  }
}
