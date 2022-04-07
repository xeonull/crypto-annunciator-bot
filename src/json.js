import fs from "fs";

function read(file) {
  let data = fs.readFileSync(file, "utf8");
  return JSON.parse(data);
}

function save(obj, file) {
  let json = JSON.stringify(obj);

  fs.writeFileSync(file, json);
}

export const init_coins = () => {
  const coins = [
    { cg_id: "avalanche-2", name: "Avalanche", symbol: "AVAX" },
    { cg_id: "cosmos", name: "Cosmos", symbol: "ATOM" },
    { cg_id: "near", name: "NEAR", symbol: "NEAR" },
  ];
  save(coins, "res/coins.json");
};

export const get_coins = () => {
  return read("res/coins.json") 
};
