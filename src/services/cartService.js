import { prisma } from "../config/prisma.js"

export async function addToCart(userId, productId, quantity) {

  const existing = await prisma.cartItem.findUnique({
    where: {
      userId_productId: {
        userId,
        productId
      }
    }
  })

  if (existing) {
    return prisma.cartItem.update({
      where: { id: existing.id },
      data: {
        quantity: existing.quantity + quantity
      }
    })
  }

  return prisma.cartItem.create({
    data: {
      userId,
      productId,
      quantity
    }
  })

}

export async function getCartItems(userId) {

  return prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: true
    }
  })

}

export async function updateCartItem(userId, productId, change) {

  const item = await prisma.cartItem.findUnique({
    where: {
      userId_productId: { userId, productId }
    }
  })

  if (!item) return null

  const newQty = item.quantity + change

  if (newQty <= 0) {
    return prisma.cartItem.delete({
      where: { id: item.id }
    })
  }

  return prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity: newQty }
  })

}

export async function removeCartItem(userId, productId) {

  return prisma.cartItem.deleteMany({
    where: {
      userId,
      productId
    }
  })

}