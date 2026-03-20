import { findOrCreateUser } from "../services/userService.js"
import { orderService } from "../services/orderService.js"

export async function myOrders(ctx) {

  if (ctx.callbackQuery) {
    await ctx.answerCbQuery()
  }

  const user = await findOrCreateUser(ctx)

  const orders = await orderService.getOrdersByUser(user.id)

  if (orders.length === 0) {
    return ctx.reply("📦 You don't have any orders yet.")
  }

  let message = "📦 *Your Orders*\n\n"
  const keyboard = []

  orders.forEach(order => {

    message += `#${order.id}  💰 $${order.total}\n`

    keyboard.push([
      { text: `View Order #${order.id}`, callback_data: `order_${order.id}` }
    ])

  })

  await ctx.reply(message, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: keyboard
    }
  })

}

export async function viewOrder(ctx) {

  await ctx.answerCbQuery()

  const orderId = Number(ctx.match[1])

  const order = await orderService.getOrderById(orderId)

  let message = `📦 *Order #${order.id}*\n\n`

  order.items.forEach(item => {

    const subtotal = item.quantity * item.price

    message += `${item.product.name} x${item.quantity} - $${subtotal}\n`

  })

  message += "\n━━━━━━━━━━━━━━\n"
  message += `💰 *Total: $${order.total}*`

  await ctx.reply(message, {
    parse_mode: "Markdown"
  })
}

export async function cancelOrder(ctx) {

  if (!ctx.session) ctx.session = {}

  ctx.session.orderBuilder = null

  await ctx.answerCbQuery("❌ Order cancelled")

  await ctx.reply("🛒 Your order has been cancelled.")
}