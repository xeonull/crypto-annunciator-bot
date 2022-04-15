import pkg from 'telegraf';
const { Extra } = pkg;

/**
 * Displays menu with a list of movies
 * @param movies - list of movies
 */
/**
 * Returns language keyboard
 */
export function getLanguageKeyboard() {
  return Extra.HTML().markup((markup) =>
    markup.inlineKeyboard(
      [
        markup.callbackButton(
          `English`,
          JSON.stringify({ a: "languageChange", p: "en" }),
          false
        ),
        markup.callbackButton(
          `Русский`,
          JSON.stringify({ a: "languageChange", p: "ru" }),
          false
        ),
      ],
      {}
    )
  );
}

/**
 * Returns button that user has to click to start working with the bot
 */
export function getAccountConfirmKeyboard(ctx) {
  return Extra.HTML().markup((markup) =>
    markup.inlineKeyboard(
      [
        markup.callbackButton(
          "Letssssssssssssssss gog"
          //ctx.i18n.t("scenes.start.lets_go")
          ,
          JSON.stringify({ a: "confirmAccount" }),
          false
        ),
      ],
      {}
    )
  );
}
