import prisma from '@/libs/prismadb'

export const findById = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return null
    }

    // 移除敏感資訊
    // eslint-disable-next-line
    const { hashedPassword, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}
