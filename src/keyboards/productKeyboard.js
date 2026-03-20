export function productKeyboard(products) {

  const buttons = products.map(p => [
    {
      text: `${p.name} - $${p.price}`,
      callback_data: `product_${p.id}`
    }
  ])

  return {
    reply_markup: {
      inline_keyboard: buttons
    }
  }

}