import { getCoinMenuPagination } from '../../utils/menus.js'

const COLUMNS = 3
const ROWS = 3

export const CoinPagination = (collection, page) => {
  const info = collection.length > COLUMNS * ROWS ? `\n${page} / ${Math.ceil(collection.length / (COLUMNS * ROWS))}` : ''
  return {
    info,
    menu: getCoinMenuPagination(collection, COLUMNS, ROWS, page),
  }
}
