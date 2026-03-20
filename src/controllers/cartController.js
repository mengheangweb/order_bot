import { 
    addToCart as addCartService,
    getCartItems,
} from "../services/cartService.js"

import { 
    findOrCreateUser,
   
} from "../services/userService.js"

import { productService
} from "../services/productService.js"


export async function addToCart(ctx) {

  const productId = Number(ctx.match[1])
  const quantity = Number(ctx.match[2])

  const user = await findOrCreateUser(ctx)

  await addCartService(user.id, productId, quantity)

  await ctx.answerCbQuery(`🛒 Added ${quantity}`)

}

export async function viewCart(ctx) {

  await ctx.answerCbQuery()

  if (!ctx.session?.orderBuilder?.items) {
    return ctx.reply("🛒 Your cart is empty.")
  }

  const items = ctx.session.orderBuilder.items

  const products = await productService.getProducts()

  let message = "🧾 *Order Summary*\n\n"
  let total = 0
  let totalItems = 0

  products.forEach(product => {

    const qty = items[product.id]

    if (!qty) return

    const subtotal = qty * product.price

    total += subtotal
    totalItems += qty

    const name = product.name.padEnd(18, " ")

    message += `${name} x${qty}   $${subtotal}\n`

  })

  if (totalItems === 0) {
    return ctx.reply("🛒 Your cart is empty.")
  }

  message += "\n━━━━━━━━━━━━━━\n"
  message += `💰 *Total: $${total}*`

  const keyboard = [
    [{ text: "✅ Checkout", callback_data: "checkout" }],
    [{ text: "✏ Edit Order", callback_data: "start_order_builder" }],
    [{ text: "❌ Cancel", callback_data: "cancel_order" }]
  ]

  await ctx.reply(message, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: keyboard
    }
  })

}