import { EventAdd } from './model.js'
import { PRICE_LIMIT_UP, PRICE_LIMIT_DOWN } from './event.js'

const events = [
  {
    /* Growth price limit */
    name: PRICE_LIMIT_UP,
  },
  {
    /* Fall price limit */
    name: PRICE_LIMIT_DOWN,
  },
]

async function main() {
  for (const e of events) {
    await EventAdd(e.name)
  }
}

main()
