import { RAW_OFFERS, STORES } from '../data/offers.js'
import { matchOffers } from './match.js'

/**
 * Статус источников данных по итогам исследования API (см. docs/STORE_APIS.md).
 * Публичного открытого каталожного API у розничных сетей нет.
 */
export const DATA_SOURCES = {
  mode: 'demo',
  checkedAt: '2026-09-23',
  stores: [
    {
      id: 'pyaterochka',
      name: 'Пятёрочка',
      publicCatalogApi: false,
      status: 'demo',
      note: 'Официально — кабинет поставщика X5 (partner.x5.ru). Публичного API цен нет; 5ka.ru закрыт антиботом (403).',
      official: 'https://partner.x5.ru/',
    },
    {
      id: 'auchan',
      name: 'Ашан',
      publicCatalogApi: false,
      status: 'demo',
      note: 'Публичного API нет. Сайт за QRATOR; данные обычно через коммерческие фиды.',
      official: 'https://www.auchan.ru/',
    },
    {
      id: 'magnit',
      name: 'Магнит',
      publicCatalogApi: false,
      status: 'demo',
      note: 'Розничного публичного API нет. Есть Seller API Магнит Маркета для продавцов, не для сравнения цен сетей.',
      official: 'https://magnit-tech.github.io/market-partner-api/',
    },
  ],
}

/**
 * Загрузка офферов. Сейчас — демо.
 * Сюда подключаются партнёрские фиды после договора с сетью / data-провайдером.
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
    sources: DATA_SOURCES,
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
