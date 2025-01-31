import { Request, Response, NextFunction } from 'express'
import passport from 'passport'
import { HttpException } from './error.middleware'

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
    if (err) {
      return next(new HttpException(401, '認證過程發生錯誤'))
    }

    if (!user) {
      return next(new HttpException(401, '未授權的訪問'))
    }
    // eslint-disable-next-line no-param-reassign
    req.user = user
    next()
  })(req, res, next)
}
