import fetch from "node-fetch";
//https://www.coingecko.com/en/api/documentation
export const coingeckoApiPrice = async (cryptoCurrency, vsCurrency) => {
   try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoCurrency}&vs_currencies=${vsCurrency}&include_market_cap=true`
    );
    if (response.status >= 400) {
      throw new Error("Bad response from server");
    }
    const data = await response.json();
    console.log(`Response data price: ${JSON.stringify(data)}`);
    return data
  } catch (e) {
    console.error("[coingeckoApiPrice Error]:", e);
  }
};
//https://api.coingecko.com/api/v3/coins/list
//https://api.coingecko.com/api/v3/search?query=yearn
export const coingeckoApiSearch = async (searchString) => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/search?query=${searchString}`
    );
    if (response.status >= 400) {
      throw new Error("Bad response from server");
    }
    const data = await response.json();
    console.log(`Response data coins: ${JSON.stringify(data.coins)}`);
    return data.coins.filter((t) => t?.market_cap_rank != null);
  } catch (e) {
    console.error("[coingeckoApiSearch Error]:", e);
  }
};
