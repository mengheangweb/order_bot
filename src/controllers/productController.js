import { productService } from "../services/productService.js"
import { updateCartItem } from "../services/cartService.js"
import { findOrCreateUser } from "../services/userService.js"
import { showProducts } from "../commands/productCommand.js"

export async function handleProductClick(ctx) {

  await ctx.answerCbQuery()

  const productId = ctx.match[1]

  const product = await productService.getProduct(productId)

  await ctx.reply(
`🦐 ${product.name}
💲 Price: $${product.price}`
  )

}

export async function increaseQty(ctx) {

  const productId = Number(ctx.match[1])
  const user = await findOrCreateUser(ctx)

  await updateCartItem(user.id, productId, 1)

  await ctx.answerCbQuery()

  return showProducts(ctx)
}

export async function decreaseQty(ctx) {

  const productId = Number(ctx.match[1])
  const user = await findOrCreateUser(ctx)

  await updateCartItem(user.id, productId, -1)

  await ctx.answerCbQuery()

  return showProducts(ctx)
}