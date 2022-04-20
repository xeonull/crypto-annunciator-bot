import pkg from "telegraf";
const { Extra } = pkg;

/* Displays menu with a list of coins */
export function getCoinMenu(coins) {
  return Extra.HTML().markup((m) =>
    m.inlineKeyboard(
      coins.map((c) => [m.callbackButton(`${c.name} (${c.symbol})`, JSON.stringify({ a: "coin", p: c.id }), false)]),
      {}
    )
  );
}

/* Displays menu with a list of object with name and id fields */
export function getObjectMenu(obj, action, is_back_button = false, back_button_text = "back") {
  return Extra.HTML().markup((m) =>
    m.inlineKeyboard(
      [
        obj.map((o) => m.callbackButton(`${o.name}`, JSON.stringify({ a: action, p: o.id }), false)),
        is_back_button ? [m.callbackButton(back_button_text, JSON.stringify({ a: "back", p: "id" }), false)] : [],
      ],
      {}
    )
  );
}

export function getObjectMenuComplex(obj, action, is_back_button = false, back_button_text = "back", col_count = 3) {
  return Extra.HTML().markup((m) => {
    const matrix = [];

    let prev = 0;
    for (let index = 1; index <= obj.length; index++) {
      if (index % col_count === 0 || index === obj.length) {
        matrix.push(obj.slice(prev, index).map((o) => m.callbackButton(`${o.name}`, JSON.stringify({ a: action, p: o.id }), false)));
        prev = index;
      }
    }
    if (is_back_button) matrix.push([m.callbackButton(back_button_text, JSON.stringify({ a: "back", p: "id" }), false)]);

    return m.inlineKeyboard(matrix, {});
  });
}
