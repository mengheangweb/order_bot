import { prisma } from "../config/prisma.js"

export const orderRepository = {

  async findByUser(userId) {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    })
  },

  async findById(orderId) {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true }
        }
      }
    })
  },

  async createOrder(userId, items) {

    const productIds = Object.keys(items).map(Number)

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    })

    let total = 0

    const orderItems = products.map(product => {

      const qty = items[product.id]
      const subtotal = qty * product.price

      total += subtotal

      return {
        productId: product.id,
        quantity: qty,
        price: product.price
      }

    })

    return prisma.order.create({
      data: {
        userId,
        total,
        items: {
          create: orderItems
        }
      }
    })

  }

}