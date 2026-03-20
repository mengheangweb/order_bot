import { findOrCreateUser } from "../services/userService.js"
import { orderService } from "../services/orderService.js"
import { productService } from "../services/productService.js"

export async function checkout(ctx) {

  await ctx.answerCbQuery()

  if (!ctx.session?.orderBuilder?.items) {
    return ctx.reply("🛒 Your cart is empty.")
  }

  const items = ctx.session.orderBuilder.items
  const user = await findOrCreateUser(ctx)

  const order = await orderService.createOrder(user.id, items)

  const products = await productService.getProducts()

  let message = `✅ *Order Confirmed!*\n\n`
  message += `Order #${order.id}\n\n`

  let total = 0

  products.forEach(product => {

    const qty = items[product.id]
    if (!qty) return

    const subtotal = qty * product.price
    total += subtotal

    const name = product.name.padEnd(18, " ")

    message += `🦐 ${name} x${qty}   $${subtotal}\n`
  })

  message += "\n━━━━━━━━━━━━━━\n"
  message += `💰 *Total: $${total}*\n\n`
  message += "🚚 Our team will contact you soon for delivery."

  ctx.session.orderBuilder = null

  await ctx.reply(message, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "📦 My Orders", callback_data: "my_orders" }],
        [{ text: "☎️ Support", callback_data: "support" }]
      ]
    }
  })

}