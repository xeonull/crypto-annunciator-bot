import tgf from 'telegraf'
const { Extra } = tgf

/* Displays menu with a list of coins */
export function getCoinMenu(coins) {
  return Extra.HTML().markup((m) =>
    m.inlineKeyboard(
      coins.map((c) => [m.callbackButton(`${c.name} (${c.symbol})`, JSON.stringify({ a: 'coin', p: c.id }), false)]),
      {}
    )
  )
}

/* Displays menu with a list of coins by columns */
export function getCoinMenuComplex(obj, col_count = 3) {
  return Extra.HTML().markup((m) => {
    const matrix = []

    let prev = 0
    for (let index = 1; index <= obj.length; index++) {
      if (index % col_count === 0 || index === obj.length) {
        matrix.push(obj.slice(prev, index).map((o) => m.callbackButton(`${o.coin.name} (${o.coin.symbol})`, JSON.stringify({ a: 'coin', p: o.id }), false)))
        prev = index
      }
    }

    return m.inlineKeyboard(matrix, {})
  })
}

/* Displays menu with a list of object with name and id fields */
export function getObjectMenu(obj, action, is_back_button = false, back_button_text = 'back') {
  return Extra.HTML().markup((m) =>
    m.inlineKeyboard(
      [
        obj.map((o) => m.callbackButton(`${o.name}`, JSON.stringify({ a: action, p: o.id }), false)),
        is_back_button ? [m.callbackButton(back_button_text, JSON.stringify({ a: 'back', p: 'id' }), false)] : [],
      ],
      {}
    )
  )
}

/* Displays menu with a list of object by columns with name and id fields */
export function getObjectMenuComplex(obj, action, col_count = 3, is_back_button = false, back_button_text = 'back') {
  return Extra.HTML().markup((m) => {
    const matrix = []

    let prev = 0
    for (let index = 1; index <= obj.length; index++) {
      if (index % col_count === 0 || index === obj.length) {
        matrix.push(obj.slice(prev, index).map((o) => m.callbackButton(`${o.name}`, JSON.stringify({ a: action, p: o.id }), false)))
        prev = index
      }
    }
    if (is_back_button) matrix.push([m.callbackButton(back_button_text, JSON.stringify({ a: 'back', p: 'id' }), false)])

    return m.inlineKeyboard(matrix, {})
  })
}

/* Displays menu with a list of coins with pagination */
export function getCoinMenuPagination(obj, col_count = 2, row_count = 5, page = 1) {
  return Extra.HTML().markup((m) => {
    const matrix = []

    const cutted = obj.slice((page - 1) * col_count * row_count, page * col_count * row_count)

    let prev = 0
    for (let index = 1; index <= cutted.length; index++) {
      if (index % col_count === 0 || index === cutted.length) {
        matrix.push(
          cutted
            .slice(prev, index)
            .map((o) => m.callbackButton(`${o.coin ? o.coin.name : o.name} (${o.coin ? o.coin.symbol : o.symbol})`, JSON.stringify({ a: 'coin', p: o.id }), false))
        )
        prev = index
      }
    }
    const nav_buttons = []
    if (page > 1) {
      nav_buttons.push(m.callbackButton('<<<', JSON.stringify({ a: 'coin_prev', p: page }), false))
    }
    if (page * col_count * row_count < obj.length) {
      nav_buttons.push(m.callbackButton('>>>', JSON.stringify({ a: 'coin_next', p: page }), false))
    }
    matrix.push(nav_buttons)
    return m.inlineKeyboard(matrix, {})
  })
}
