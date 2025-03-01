import { Request, Response, NextFunction } from 'express'

export class HttpException extends Error {
  status: number
  message: string

  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.message = message
  }
}
// eslint-disable-next-line
export const errorMiddleware = (error: HttpException, _req: Request, res: Response, _next: NextFunction) => {
  const status = error.status || 500
  const message = error.message || 'Something went wrong'

  res.status(status).json({
    status,
    message,
  })
}
