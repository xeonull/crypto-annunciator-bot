import fetch from 'node-fetch'
import logger from './logger.js'

const request_api = async (link) => {
  const response = await fetch(link)
  if (response.status >= 400) {
    throw new Error('Bad response from server')
  }
  const data = await response.json()
  // console.log(`Response data: ${JSON.stringify(data)}`);
  return data
}

/*
https://www.coingecko.com/en/api/documentation
https://api.coingecko.com/api/v3/coins/list
https://api.coingecko.com/api/v3/search?query=yearn
*/

export const coingeckoApiPriceData = async (cryptoCurrency, vsCurrency) => {
  try {
    return await request_api(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoCurrency}&vs_currencies=${vsCurrency}&include_market_cap=true`)
  } catch (e) {
    logger.error(ctx, '[coingeckoApiPrice Error]: %O', e)
  }
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
  try {
    const data = await request_api(`https://api.coingecko.com/api/v3/search?query=${searchString}`)
    return data.coins.filter((t) => t?.market_cap_rank != null)
  } catch (e) {
    logger.error(ctx, '[coingeckoApiSearch Error]: %O', e)
  }
}
