import { orderRepository } from "../repositories/orderRepository.js"

export const orderService = {

  async getOrdersByUser(userId) {
    return orderRepository.findByUser(userId)
  },

  async getOrderById(orderId) {
    return orderRepository.findById(orderId)
  },

  async createOrder(userId, items) {
    return orderRepository.createOrder(userId, items)
  }

}