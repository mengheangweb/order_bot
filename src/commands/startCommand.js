import { mainMenuKeyboard } from "../keyboards/mainMenu.js"

export async function startCommand(ctx) {

  await ctx.reply(
`Welcome to Seafood Shop 🦐

Please choose an option below.`,
    mainMenuKeyboard
  )

}