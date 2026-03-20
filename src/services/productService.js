import { 
  productRepository,
  getAllProducts,
} from "../repositories/productRepository.js"
import { getCartItemsByUser } from "../repositories/cartRepository.js"

export const productService = {

  async getProducts() {
    return productRepository.findAll()
  },

  async getProduct(id) {
    return productRepository.findById(id)
  }

}

export async function getProductsWithCart(userId) {

  const products = await getAllProducts()
  const cartItems = await getCartItemsByUser(userId)

  const cartMap = {}

  cartItems.forEach(item => {
    cartMap[item.productId] = item.quantity
  })

  return products.map(product => ({
    ...product,
    cartQty: cartMap[product.id] || 0
  }))
}