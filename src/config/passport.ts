import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy } from 'passport-jwt'
import bcrypt from 'bcrypt'
import * as AuthRepository from '../repositories/auth.repository'

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
          return done(null, false, { message: 'User not found' })
        }

        if (!user.hashedPassword) {
          return done(null, false, { message: 'Password not set for user' })
        }

        const isMatch = await bcrypt.compare(password, user.hashedPassword)
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password' })
        }

        return done(null, user)
      } catch (error) {
        return done(error)
      }
    }
  )
)

// JWT
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: (req) => req.cookies.accessToken,
      secretOrKey: process.env.JWT_ACCESS_SECRET!,
    },
    async (jwtPayload, done) => {
      try {
        const user = await AuthRepository.findById(jwtPayload.userId)
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
