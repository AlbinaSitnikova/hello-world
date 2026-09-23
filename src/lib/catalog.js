import { RAW_OFFERS, STORES } from '../data/offers.js'
import { matchOffers } from './match.js'

/**
 * Имитация загрузки каталогов сетей.
 * Позже сюда подключаются адаптеры магазинов.
 */
export async function fetchAllOffers({ signal } = {}) {
  await delay(650, signal)
  return RAW_OFFERS.map((offer) => ({ ...offer }))
}

export async function loadCatalog({ signal } = {}) {
  const offers = await fetchAllOffers({ signal })
  const products = matchOffers(offers).sort((a, b) => a.name.localeCompare(b.name, 'ru'))

  const byStore = Object.fromEntries(
    Object.keys(STORES).map((id) => [id, offers.filter((o) => o.storeId === id).length]),
  )

  return {
    products,
    stats: {
      offers: offers.length,
      products: products.length,
      matched: products.filter((p) => p.storeCount > 1).length,
      byStore,
    },
  }
}

function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms)
    if (!signal) return
    if (signal.aborted) {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        reject(new DOMException('Aborted', 'AbortError'))
      },
      { once: true },
    )
  })
}

export { STORES }
