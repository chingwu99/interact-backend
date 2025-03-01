import { Request, Response } from 'express'
import * as CurrentService from '../services/current.service'

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized operation' })
      return
    }

    const currentUser = await CurrentService.getCurrentUser({
      // @ts-ignore
      userId: req.user.id,
    })

    res.status(200).json(currentUser)
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' })
  }
}
