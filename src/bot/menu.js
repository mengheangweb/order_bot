export async function setupBotMenu(bot) {

  await bot.telegram.setMyCommands([
    { command: "products", description: "🦐 View seafood products" },
    { command: "cart", description: "🛒 View your cart" },
    { command: "orders", description: "📦 Your orders" },
    { command: "delivery", description: "🚚 Delivery information" },
    { command: "support", description: "☎️ Contact support" }
  ])

}