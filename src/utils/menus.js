import pkg from 'telegraf'
const { Extra } = pkg

/* Displays menu with a list of coins */
export function getCoinMenu(coins) {
  return Extra.HTML().markup((m) =>
    m.inlineKeyboard(
      coins.map((c) => [m.callbackButton(`${c.name} (${c.symbol})`, JSON.stringify({ a: 'coin', p: c.id }), false)]),
      {}
    )
  )
}
