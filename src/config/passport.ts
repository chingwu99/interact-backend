import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy } from 'passport-jwt'
import bcrypt from 'bcrypt'
import * as AuthRepository from '../repositories/auth.repository'
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

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

// // Google 策略配置
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       callbackURL: `${process.env.BASE_URL}/api/v1/auth/google/callback`,
//       scope: ['email', 'profile'],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const existingUser = await AuthRepository.findByEmail(profile.emails![0].value)

//         if (existingUser) {
//           return done(null, existingUser)
//         }

//         // 如果用戶不存在，創建新用戶
//         const newUser = await AuthRepository.create({
//           email: profile.emails![0].value,
//           name: profile.displayName,
//           username: profile.displayName.toLowerCase().replace(/\s/g, ''),
//           hashedPassword: null, // Google 登入不需要密碼
//           followingIds: [],
//           hasNotification: false,
//           bio: null,
//           emailVerified: new Date(),
//           image: profile.photos?.[0].value || null,
//           coverImage: null,
//           profileImage: profile.photos?.[0].value || null,
//         })

//         return done(null, newUser)
//       } catch (error) {
//         return done(error)
//       }
//     }
//   )
// )

export default passport
