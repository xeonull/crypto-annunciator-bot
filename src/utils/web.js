import fetch from 'node-fetch'

const request_api = async (link) => {
  const response = await fetch(link)
  if (response.status >= 400) {
    throw new Error(`Bad response from server. Status: ${response.status}.`)
  }
  const data = await response.json()
  return data
}

export const coingeckoApiPriceData = async (cryptoCurrency, vsCurrency) => {
    return await request_api(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoCurrency}&vs_currencies=${vsCurrency}&include_market_cap=true`)
}

export const coingeckoApiPriceMarketCap = async (cryptoCurrency, vsCurrency) => {
  const data = await coingeckoApiPriceData(cryptoCurrency, vsCurrency)
  const price = data[cryptoCurrency][vsCurrency]
  const market_cap = data[cryptoCurrency][`${vsCurrency}_market_cap`]
  return {
    price,
    market_cap,
  }
}

export const coingeckoApiSearch = async (searchString) => {
    const data = await request_api(`https://api.coingecko.com/api/v3/search?query=${searchString}`)
    return data.coins.filter((t) => t?.market_cap_rank != null)
}
