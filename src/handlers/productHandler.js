import { getProductById } from "../services/productService.js"

export async function handleProductClick(ctx) {

  await ctx.answerCbQuery()

  const productId = ctx.match[1]

  const product = await getProductById(productId)

  if (!product) {
    return ctx.reply("❌ Product not found")
  }

  await ctx.reply(
`🦐 ${product.name}
💲 Price: $${product.price}
📦 Stock: ${product.stock}`
  )

}