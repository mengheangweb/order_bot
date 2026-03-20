import { productService } from "../services/productService.js"

export async function renderOrderBuilder(ctx) {

  ensureOrderSession(ctx)

  const products = await productService.getProducts()
  const { items, lastChanged } = ctx.session.orderBuilder

  let message = "🦐 *Build Your Seafood Order*\n\n"
  message += "```\n"
  message += "Product           Price   Qty\n"
  message += "--------------------------------\n"

  const keyboard = []

  let totalItems = 0
  let totalPrice = 0

  for (const product of products) {

    const qty = items[product.id] || 0
    const subtotal = qty * product.price

    totalItems += qty
    totalPrice += subtotal

    const name = product.name.padEnd(16, " ")
    const price = `$${product.price}`.padEnd(7, " ")

    const highlight = product.id === lastChanged ? " ✅" : ""

    message += `${name}${price}x${qty}${highlight}\n`

    keyboard.push([
      { text: "➖", callback_data: `builder_dec_${product.id}` },
      { text: `${product.name} (${qty})`, callback_data: "noop" },
      { text: "➕", callback_data: `builder_inc_${product.id}` }
    ])
  }

  message += "--------------------------------\n"
  message += `Items: ${totalItems}\n`
  message += `Total: $${totalPrice}\n`
  message += "```"

  keyboard.push([{ text: "🛒 Review Order", callback_data: "builder_review" }])
  keyboard.push([{ text: "❌ Cancel Order", callback_data: "cancel_order" }])

  const extra = {
    parse_mode: "Markdown",
    reply_markup: { inline_keyboard: keyboard }
  }

  if (ctx.updateType === "callback_query") {
    return safeEditMessage(ctx, message, extra)
  }

  return ctx.reply(message, extra)
}

async function safeEditMessage(ctx, message, extra) {

  try {
    await ctx.editMessageText(message, extra)
  } catch (err) {

    if (err.description?.includes("message is not modified")) {
      return
    }

    throw err
  }
}

export async function startOrderBuilder(ctx) {

  if (!ctx.session) ctx.session = {}

  if (!ctx.session.orderBuilder) {
    ctx.session.orderBuilder = {
      items: {},
      lastChanged: null
    }
  }

  return renderOrderBuilder(ctx)
}

export async function builderDecrease(ctx) {

  ensureOrderSession(ctx)

  const productId = Number(ctx.match[1])
  const items = ctx.session.orderBuilder.items

  if (items[productId]) {

    items[productId]--

    if (items[productId] <= 0) {
      delete items[productId]
      await ctx.answerCbQuery("❌ Item removed from cart")
    } else {
      await ctx.answerCbQuery("➖ Quantity decreased")
    }

  } else {
    await ctx.answerCbQuery("⚠️ Item not in cart")
  }

  ctx.session.orderBuilder.lastChanged = productId

  return renderOrderBuilder(ctx)
}

export async function builderIncrease(ctx) {

  ensureOrderSession(ctx)

  const productId = Number(ctx.match[1])
  const items = ctx.session.orderBuilder.items

  items[productId] = (items[productId] || 0) + 1

  ctx.session.orderBuilder.lastChanged = productId

  await ctx.answerCbQuery("✅ Item added to cart")

  return renderOrderBuilder(ctx)
}

function ensureOrderSession(ctx) {

  if (!ctx.session) ctx.session = {}

  if (!ctx.session.orderBuilder) {
    ctx.session.orderBuilder = {
      items: {},
      lastChanged: null
    }
  }
}