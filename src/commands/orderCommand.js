import { productService } from "../services/productService.js"

export async function renderOrderBuilder(ctx) {

  ensureOrderSession(ctx)

  const products = await productService.getProducts()
  const items = ctx.session.orderBuilder.items

  let message = "🦐 *Build Your Order*\n\n"

  const keyboard = []
  let totalItems = 0

  products.forEach(product => {

    const qty = items[product.id] || 0
    totalItems += qty

    const dots = ".".repeat(Math.max(1, 15 - product.name.length))

    message += `${product.name} ${dots} ${qty}\n`

    keyboard.push([
      { text: `${product.name} ➕`, callback_data: `builder_inc_${product.id}` },
      { text: `${product.name} ➖`, callback_data: `builder_dec_${product.id}` }
    ])

  })

  keyboard.push([{ text: `🛒 Review (${totalItems})`, callback_data: "builder_review" }])
  keyboard.push([{ text: "❌ Cancel", callback_data: "cancel_order" }])

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

  // Only create cart if it doesn't exist
  if (!ctx.session.orderBuilder) {
    ctx.session.orderBuilder = { items: {} }
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
      await ctx.answerCbQuery("➖ Item quantity decreased")
    }
  } else {
    await ctx.answerCbQuery("⚠️ Item not in cart")
  }

  return renderOrderBuilder(ctx)

}

export async function builderIncrease(ctx) {

  ensureOrderSession(ctx)

  const productId = Number(ctx.match[1])
  const items = ctx.session.orderBuilder.items

  items[productId] = (items[productId] || 0) + 1

  await ctx.answerCbQuery("✅ Item added to cart")

  return renderOrderBuilder(ctx)

}

function ensureOrderSession(ctx) {

  if (!ctx.session) {
    ctx.session = {}
  }

  if (!ctx.session.orderBuilder) {
    ctx.session.orderBuilder = { items: {} }
  }

}

