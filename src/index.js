import "dotenv/config"
import bot from "./bot/bot.js"

async function start() {
  try {

    console.log("Starting bot...")

    await bot.launch()

    console.log("Telegram bot running 🚀")

  } catch (err) {

    console.error("Launch error:", err)

  }
}

start()
