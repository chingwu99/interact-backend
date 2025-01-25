import { Request, Response } from 'express'
import * as UserService from '../services/user.service'

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await UserService.getUsers()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' })
  }
}

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await UserService.getUserById({ userId: req.params.userId })
    res.status(200).json(user)
  } catch (error) {
    res
      .status(error instanceof Error && error.message === '使用者不存在' ? 404 : 500)
      .json({ error: error instanceof Error ? error.message : 'Unknown error' })
  }
}

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const notifications = await UserService.getNotifications({ userId: req.params.userId })
    res.status(200).json(notifications)
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' })
  }
}
