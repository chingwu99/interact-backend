import { Request, Response } from 'express'
import passport from 'passport'
import * as AuthService from '../services/auth.service'
import { User } from '@prisma/client'

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await AuthService.register(req.body)
    const response = AuthService.formatUserResponse(user)
    res.status(201).json(response)
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : '註冊失敗',
    })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  passport.authenticate(
    'local',
    { session: false },
    (err: Error | null, user: User | false, info: { message: string } | undefined) => {
      if (err) {
        return res.status(500).json({ error: '登入過程發生錯誤' })
      }

      if (!user) {
        return res.status(401).json({ error: info?.message || '登入失敗' })
      }

      const response = AuthService.formatUserResponse(user)
      res.status(200).json(response)
    }
  )(req, res)
}
