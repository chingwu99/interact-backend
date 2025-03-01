import { Request, Response } from 'express'
import passport from 'passport'
import * as AuthService from '../services/auth.service'
import { User } from '@prisma/client'
import jwt from 'jsonwebtoken'

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: '15m' } // Access Token 15m
  )

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' } // Refresh Token 7days
  )

  return { accessToken, refreshToken }
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await AuthService.register(req.body)
    const response = AuthService.formatUserResponse(user)
    res.status(201).json(response)
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Registration failed',
    })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  passport.authenticate(
    'local',
    { session: false },
    (err: Error | null, user: User | false, info: { message: string } | undefined) => {
      if (err) {
        return res.status(500).json({ error: 'Login process error' })
      }

      if (!user) {
        return res.status(401).json({ error: info?.message || 'Login failed' })
      }

      const { accessToken, refreshToken } = generateTokens(user.id)

      // 設置 cookies
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15分鐘
      })

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        // 移除 path 限制，讓所有 API 都能讀取到 refreshToken
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
      })

      const response = AuthService.formatUserResponse(user)

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: response,
      })
    }
  )(req, res)
}

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.cookie('accessToken', '', {
    httpOnly: true,
    expires: new Date(0),
  })

  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0),
  })

  res.status(200).json({
    success: true,
    message: 'Logout successful',
  })
}
