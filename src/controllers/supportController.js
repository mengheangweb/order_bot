export async function support(ctx) {

  if (ctx.callbackQuery) {
    await ctx.answerCbQuery()
  }

  const message = `
☎️ *Customer Support*

If you need help with your order, please contact us:

📱 Telegram: @SeafoodSupport
📞 Phone: +855 12 345 678

Our team will assist you as soon as possible.
`

  await ctx.reply(message, {
    parse_mode: "Markdown"
  })

}