import dotenv from 'dotenv'

// 根據 NODE_ENV 載入對應的配置
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' })
} else {
  dotenv.config({ path: '.env.development' })
}

export const isProduction = process.env.NODE_ENV === 'production'
