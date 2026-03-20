import { prisma } from "../config/prisma.js"

export const productRepository = {

  findAll() {
    return prisma.product.findMany()
  },

  findById(id) {
    return prisma.product.findUnique({
      where: { id: Number(id) }
    })
  }

}

export async function getAllProducts() {
  return prisma.product.findMany()
}