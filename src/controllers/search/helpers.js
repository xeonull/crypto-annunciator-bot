import { getCoinMenuPagination } from '../../utils/menus.js'

const COLUMNS = 1
const ROWS = 5

export const SearchPagination = (collection, page) => {
  const info = collection.length > COLUMNS * ROWS ? ` (${page}/${Math.ceil(collection.length / (COLUMNS * ROWS))})` : ''
  return {
    info,
    menu: getCoinMenuPagination(collection, COLUMNS, ROWS, page),
  }
}
