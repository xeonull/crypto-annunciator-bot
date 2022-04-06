import fetch from 'node-fetch'
//https://www.coingecko.com/en/api/documentation
export const coingeckoApiPrice = async (cryptoCurrency) => {
  const vs_currency = 'usd'
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoCurrency}&vs_currencies=${vs_currency}`)
    if (response.status >= 400) {
      throw new Error('Bad response from server')
    }
    const data = await response.json()
    console.log(`Response data: ${JSON.stringify(data)}`)
    return data[cryptoCurrency][vs_currency]
  } catch {
    console.error(err)
  }
}
//https://api.coingecko.com/api/v3/coins/list
//https://api.coingecko.com/api/v3/search?query=polka
