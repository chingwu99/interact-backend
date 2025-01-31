import { Request, Response } from 'express'
import * as FollowService from '../services/follow.service'

export const followUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '未授權的操作' })
      return
    }

    const { userId } = req.body
    const user = await FollowService.followUser({
      userId,
      // @ts-ignore
      followerId: req.user.id,
    })

    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' })
  }
}

export const unfollowUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '未授權的操作' })
      return
    }

    const { userId } = req.body
    const user = await FollowService.unfollowUser({
      userId,
      // @ts-ignore
      followerId: req.user.id,
    })

    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' })
  }
}
