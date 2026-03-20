import { Telegraf } from "telegraf"
import { session } from "telegraf"

import { startCommand } from "../commands/startCommand.js"
import { showProducts } from "../commands/productCommand.js"
import { startOrderBuilder, builderIncrease, builderDecrease } from "../commands/orderCommand.js"
import { handleProductClick } from "../controllers/productController.js"
import { viewCart} from "../controllers/cartController.js"
import { checkout } from "../controllers/checkoutController.js"
import { myOrders, viewOrder, cancelOrder } from "../controllers/orderController.js"
import { support } from "../controllers/supportController.js"
import { deliveryInfo } from "../controllers/deliveryInfoController.js"

const bot = new Telegraf(process.env.BOT_TOKEN)

console.log("BOT TOKEN:", process.env.BOT_TOKEN)

bot.use(session())

bot.start(startCommand)

bot.command("products", showProducts)
bot.command("support", support)
bot.command("delivery_info", deliveryInfo)

bot.action(/product_(.+)/, handleProductClick)
bot.action(/builder_inc_(\d+)/, builderIncrease)
bot.action(/builder_dec_(\d+)/, builderDecrease)

bot.action("builder_review", viewCart)
bot.action("checkout", checkout)
bot.action("my_orders", myOrders)
bot.action(/order_(\d+)/, viewOrder)

bot.action("cancel_order", cancelOrder)
bot.action("start_order_builder", startOrderBuilder)

bot.hears("🦐 Order Seafood", startOrderBuilder)
bot.hears("📦 My Orders", myOrders)
bot.hears("☎️ Support", support)
bot.hears("🚚 Delivery Info", deliveryInfo)

bot.catch((err, ctx) => {
  console.error("Bot error:", err)
})

export default bot