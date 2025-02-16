import { Request, Response, NextFunction } from 'express'
import { HttpException } from './error.middleware'
import jwt from 'jsonwebtoken'

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken
  const refreshToken = req.cookies.refreshToken

  // 如果完全沒有 token
  if (!accessToken && !refreshToken) {
    throw new HttpException(401, '請重新登入')
  }

  // 如果有 access token，先驗證
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET!) as { id: string }
      // eslint-disable-next-line no-param-reassign
      req.user = decoded
      return next()
    } catch (error) {
      // access token 無效，繼續檢查 refresh token
    }
  }

  // 驗證 refresh token
  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: string }

      // 生成新的 access token
      const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_ACCESS_SECRET!, { expiresIn: '15m' })

      // 設置新的 access token
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
      })

      // eslint-disable-next-line no-param-reassign
      req.user = decoded
      return next()
    } catch (error) {
      // refresh token 也無效
      throw new HttpException(401, 'Token 無效或已過期，請重新登入')
    }
  }

  // 如果都沒有有效的 token
  throw new HttpException(401, '請重新登入')
}
