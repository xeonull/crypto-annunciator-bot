import { NotificationTypeAdd } from "./model.js";

const notification_types = [
  {
    /* Growth price limit */
    name: "price_limit_up",
  },
  {
    /* Fall price limit */
    name: "price_limit_down",
  },
];

async function main() {
  for (const a of notification_types) {
    await NotificationTypeAdd(a.name);
  }
}

main();
