import "dotenv/config"
import bot from "./bot/bot.js"

async function start() {

  await bot.launch()

  console.log("🤖 Bot started")

}

start()