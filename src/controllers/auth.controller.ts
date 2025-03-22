import { Request, Response } from 'express'
import passport from 'passport'
import * as AuthService from '../services/auth.service'
import { User } from '@prisma/client'
import jwt from 'jsonwebtoken'

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
    async (err: Error | null, user: User | false, info: { message: string } | undefined) => {
      if (err) {
        return res.status(500).json({ error: 'Login process error' })
      }

      if (!user) {
        return res.status(401).json({ error: info?.message || 'Login failed' })
      }

      try {
        // 使用服務層生成 tokens
        const { accessToken, refreshToken } = await AuthService.generateTokens(user.id)

        // 設置 cookies
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'none',
          maxAge: 15 * 60 * 1000, // 15分鐘
          domain: '.up.railway.app',
        })

        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'none',
          maxAge: 3 * 24 * 60 * 60 * 1000, // 3天
          domain: '.up.railway.app',
        })

        const response = AuthService.formatUserResponse(user)

        res.status(200).json({
          success: true,
          message: 'Login successful',
          data: response,
        })
      } catch (error) {
        return res.status(500).json({
          error: error instanceof Error ? error.message : 'Login process error',
        })
      }
    }
  )(req, res)
}

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // 從 cookie 中獲取 refresh token
    const refreshToken = req.cookies.refreshToken

    // 如果有 refresh token，使用服務層撤銷它
    if (refreshToken) {
      await AuthService.revokeRefreshToken(refreshToken)
    }

    // 清除 cookies
    res.cookie('accessToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      expires: new Date(0),
      domain: '.up.railway.app',
    })

    res.cookie('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      expires: new Date(0),
      domain: '.up.railway.app',
    })

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Logout failed',
    })
  }
}

// refresh token 端點
export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
      console.log('Refresh token not provided')
      res.status(401).json({ error: 'Refresh token not provided' })
      return
    }

    // 使用服務層驗證 refresh token
    const validationResult = await AuthService.validateRefreshToken(refreshToken)

    if (!validationResult.valid) {
      console.log(`Refresh token invalid: ${validationResult.reason}`)
      res.status(401).json({ error: `Invalid refresh token: ${validationResult.reason}` })
      return
    }

    // 生成新的 access token
    const newAccessToken = jwt.sign({ id: validationResult.userId }, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: '15m',
    })

    // 設置新的 access token cookie
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 15 * 60 * 1000, // 15分鐘
      domain: '.up.railway.app',
    })

    res.status(200).json({
      success: true,
      message: 'Access token refreshed successfully',
    })
  } catch (error) {
    console.error('Token refresh failed:', error)
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Token refresh failed',
    })
  }
}

// 登出所有裝置端點
export const logoutAllDevices = async (req: Request, res: Response): Promise<void> => {
  try {
    // 從 req.user 中獲取用戶 ID（需要先通過 authenticate 中間件）
    const userId = (req.user as { id: string }).id

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    // 使用服務層撤銷所有 refresh tokens
    await AuthService.revokeAllUserRefreshTokens(userId)

    // 清除當前裝置的 cookies
    res.cookie('accessToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      expires: new Date(0),
      domain: '.up.railway.app',
    })

    res.cookie('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      expires: new Date(0),
      domain: '.up.railway.app',
    })

    res.status(200).json({
      success: true,
      message: 'Logged out from all devices successfully',
    })
  } catch (error) {
    console.error('Logout all devices failed:', error)
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Logout from all devices failed',
    })
  }
}
