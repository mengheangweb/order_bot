import { findOrCreateUser } from "../services/userService.js"
import { orderService } from "../services/orderService.js"

export async function myOrders(ctx) {

  if (ctx.callbackQuery) {
    await ctx.answerCbQuery()
  }

  const user = await findOrCreateUser(ctx)

  const orders = await orderService.getOrdersByUser(user.id)

  if (!orders || orders.length === 0) {
    return ctx.reply("📦 You don't have any orders yet.")
  }

  const keyboard = []

  for (const order of orders) {

    // get full order with items
    const fullOrder = await orderService.getOrderById(order.id)

    const itemCount = fullOrder.items.reduce((sum, item) => {
      return sum + item.quantity
    }, 0)

    keyboard.push([
      {
        text: `🧾 Order #${order.id} • ${itemCount} items • 💰 $${order.total}`,
        callback_data: `order_${order.id}`
      }
    ])
  }

  await ctx.reply(
    "📦 *Your Orders*\nTap an order to view details:",
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: keyboard
      }
    }
  )

}

export async function viewOrder(ctx) {

  await ctx.answerCbQuery()

  const orderId = Number(ctx.match[1])
  const order = await orderService.getOrderById(orderId)

  let message = `📦 *Order #${order.id}*\n\n`

  message += "```\n"
  message += "Product           Qty   Price   Sub\n"
  message += "-----------------------------------\n"

  let totalItems = 0

  order.items.forEach(item => {

    const subtotal = item.quantity * item.price
    totalItems += item.quantity

    const name = item.product.name.padEnd(16, " ")
    const qty = String(item.quantity).padEnd(5, " ")
    const price = `$${item.price}`.padEnd(7, " ")
    const sub = `$${subtotal}`

    message += `${name}${qty}${price}${sub}\n`

  })

  message += "-----------------------------------\n"
  message += `Items: ${totalItems}\n`
  message += `Total: $${order.total}\n`
  message += "```"

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