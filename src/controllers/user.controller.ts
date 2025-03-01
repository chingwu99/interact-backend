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
      .status(error instanceof Error && error.message === 'User not found' ? 404 : 500)
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

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // 確保用戶已認證
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized operation' })
      return
    }

    const { name, username, bio, profileImage, coverImage } = req.body

    const updatedUser = await UserService.updateUser({
      // @ts-ignore
      userId: req.user.id,
      name,
      username,
      bio,
      profileImage,
      coverImage,
    })

    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' })
  }
}
