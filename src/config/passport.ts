import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import bcrypt from 'bcrypt'
import * as AuthRepository from '../repositories/auth.repository'

// 本地策略配置
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await AuthRepository.findByEmail(email)

        if (!user) {
          return done(null, false, { message: '找不到使用者' })
        }

        if (!user.hashedPassword) {
          return done(null, false, { message: '使用者密碼未設置' })
        }

        const isMatch = await bcrypt.compare(password, user.hashedPassword)
        if (!isMatch) {
          return done(null, false, { message: '密碼錯誤' })
        }

        return done(null, user)
      } catch (error) {
        return done(error)
      }
    }
  )
)

// JWT 策略配置
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
    },
    async (jwtPayload, done) => {
      try {
        const user = await AuthRepository.findByEmail(jwtPayload.email)
        if (user) {
          return done(null, user)
        }
        return done(null, false)
      } catch (error) {
        return done(error, false)
      }
    }
  )
)

export default passport
