import { getProductsWithCart } from "../services/productService.js"
import { findOrCreateUser } from "../services/userService.js"

export async function showProducts(ctx) {

  const user = await findOrCreateUser(ctx)

  const products = await getProductsWithCart(user.id)

  if (products.length === 0) {
    return ctx.reply("No products available.")
  }

  let message = "🦐 *Seafood Menu*\n\n"

  const keyboard = []
  let cartTotal = 0

  products.forEach(product => {

    const qty = product.cartQty
    cartTotal += qty

    message += `${product.name} - $${product.price}\n`

    if (qty === 0) {

      keyboard.push([
        {
          text: "➕ Add",
          callback_data: `qty_inc_${product.id}`
        }
      ])

    } else {

      keyboard.push([
        {
          text: "➖",
          callback_data: `qty_dec_${product.id}`
        },
        {
          text: `${qty}`,
          callback_data: "noop"
        },
        {
          text: "➕",
          callback_data: `qty_inc_${product.id}`
        }
      ])

    }

  })

  keyboard.push([
    {
      text: `🛒 View Cart (${cartTotal})`,
      callback_data: "view_cart"
    }
  ])

  const extra = {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: keyboard
    }
  }

  if (ctx.updateType === "callback_query") {
    return ctx.editMessageText(message, extra)
  }

  return ctx.reply(message, extra)
}