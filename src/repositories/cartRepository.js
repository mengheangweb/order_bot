import { prisma } from "../config/prisma.js"

export async function getCartItemsByUser(userId) {
  return prisma.cartItem.findMany({
    where: { userId }
  })
}