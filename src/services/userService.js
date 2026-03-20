import { prisma } from "../config/prisma.js"

export async function findOrCreateUser(ctx) {

  const telegramId = BigInt(ctx.from.id)

  let user = await prisma.user.findUnique({
    where: { telegramId }
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        telegramId,
        name: ctx.from.first_name
      }
    })
  }

  return user
}