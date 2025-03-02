import { Request, Response } from 'express'
import * as FollowService from '../services/follow.service'
import { RequestUser } from '../types/request.type'

export const followUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized operation' })
      return
    }

    const { userId } = req.body
    const user = await FollowService.followUser({
      userId,
      followerId: (req.user as RequestUser).id,
    })

    res.status(200).json(user)
  } catch (error) {
    // 區分不同類型的錯誤
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized operation' })
    } else if (error instanceof Error) {
      res.status(400).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Server error' })
    }
  }
}

export const unfollowUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized operation' })
      return
    }

    const { userId } = req.body
    const user = await FollowService.unfollowUser({
      userId,
      followerId: (req.user as RequestUser).id,
    })

    res.status(200).json(user)
  } catch (error) {
    // 區分不同類型的錯誤
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized operation' })
    } else if (error instanceof Error) {
      res.status(400).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Server error' })
    }
  }
}
