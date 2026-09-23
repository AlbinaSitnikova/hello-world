/**
 * Нормализация и сопоставление товаров по названию + производителю.
 */

const STOP_WORDS = new Set([
  'и',
  'с',
  'в',
  'на',
  'из',
  'для',
  'г',
  'гр',
  'кг',
  'мл',
  'л',
  'шт',
  'уп',
  'пак',
  'пакетированный',
  'рафинированное',
  'растворимый',
  'нарезанный',
  'нарезка',
  'куриное',
  'куриные',
  'изделия',
  'макаронные',
  'ядрица',
  'экстра',
  'virgin',
  'extra',
])

const BRAND_ALIASES = {
  activia: 'активиа',
  'брест литовск': 'брест-литовск',
  'брест-литовск': 'брест-литовск',
  ahmad: 'ahmad tea',
  'ahmad tea': 'ahmad tea',
}

const WORD_ALIASES = {
  гречка: 'гречневая',
  гречневая: 'гречневая',
  spaghetti: 'спагетти',
  спагетти: 'спагетти',
  макароны: 'спагетти',
  яйцо: 'яйца',
  яйца: 'яйца',
  n5: 'номер5',
  '5': 'номер5',
}

export function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[«»"'`]/g, '')
    .replace(/[–—−]/g, '-')
    .replace(/№\s*/g, 'n')
    .replace(/(\d),(\d)/g, '$1.$2')
    .replace(/\b\d+([.]\d+)?\s*(мл|л|г|гр|кг|шт|пак)\b\.?/gi, ' ')
    .replace(/[^a-zа-я0-9.\-\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function normalizeBrand(value) {
  let brand = normalizeText(value).replace(/-/g, ' ').replace(/\s+/g, ' ').trim()
  brand = BRAND_ALIASES[brand] || brand
  if (brand === 'брест литовск') brand = 'брест-литовск'
  return brand
}

function aliasToken(token) {
  return WORD_ALIASES[token] || BRAND_ALIASES[token] || token
}

export function tokenize(name) {
  return normalizeText(name)
    .replace(/-/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(aliasToken)
    .flatMap((token) => String(token).split(' '))
    .map(aliasToken)
    .filter((token) => {
      if (!token || STOP_WORDS.has(token)) return false
      if (/^\d+\.\d+$/.test(token)) return true
      if (/^номер\d+$/.test(token)) return true
      if (/^\d+$/.test(token)) return false
      return true
    })
}

export function matchKey(offer) {
  const brand = normalizeBrand(offer.manufacturer)
  const brandTokenSet = new Set(
    brand
      .replace(/-/g, ' ')
      .split(' ')
      .flatMap((t) => {
        const aliased = aliasToken(t)
        return [t, aliased, ...String(aliased).split(' ')]
      }),
  )

  const tokens = [...new Set(tokenize(offer.name))]
    .filter((t) => !brandTokenSet.has(t))
    .sort()

  return `${brand}::${tokens.join('|')}`
}

export function tokenSimilarity(a, b) {
  const setA = new Set(tokenize(a))
  const setB = new Set(tokenize(b))
  if (!setA.size || !setB.size) return 0
  let intersection = 0
  for (const t of setA) if (setB.has(t)) intersection += 1
  return intersection / (setA.size + setB.size - intersection)
}

export function matchOffers(offers) {
  /** @type {Map<string, typeof offers>} */
  const hardGroups = new Map()

  for (const offer of offers) {
    const key = matchKey(offer)
    if (!hardGroups.has(key)) hardGroups.set(key, [])
    hardGroups.get(key).push(offer)
  }

  const softGroups = mergeSimilarGroups([...hardGroups.values()])

  return softGroups.map((groupOffers, index) => {
    const sorted = [...groupOffers].sort((a, b) => a.price - b.price)
    const best = sorted[0]

    return {
      id: `product-${index + 1}`,
      matchKey: matchKey(best),
      name: pickDisplayName(groupOffers),
      manufacturer: pickManufacturer(groupOffers),
      category: best.category,
      unit: best.unit,
      best,
      offers: sorted,
      storeCount: new Set(groupOffers.map((o) => o.storeId)).size,
      savings:
        sorted.length > 1
          ? Math.max(...sorted.map((o) => o.price)) - best.price
          : 0,
    }
  })
}

function mergeSimilarGroups(groups) {
  const result = groups.map((g) => [...g])
  let merged = true

  while (merged) {
    merged = false
    outer: for (let i = 0; i < result.length; i += 1) {
      for (let j = i + 1; j < result.length; j += 1) {
        if (canMerge(result[i], result[j])) {
          result[i] = [...result[i], ...result[j]]
          result.splice(j, 1)
          merged = true
          break outer
        }
      }
    }
  }

  return result
}

function canMerge(groupA, groupB) {
  const brandA = normalizeBrand(groupA[0].manufacturer)
  const brandB = normalizeBrand(groupB[0].manufacturer)
  if (brandA !== brandB) return false

  const storesA = new Set(groupA.map((o) => o.storeId))
  for (const offer of groupB) {
    if (storesA.has(offer.storeId)) return false
  }

  let best = 0
  for (const a of groupA) {
    for (const b of groupB) {
      best = Math.max(best, tokenSimilarity(a.name, b.name))
    }
  }
  return best >= 0.45
}

function pickDisplayName(offers) {
  return [...offers]
    .map((o) => o.name.replace(/[«»]/g, '').trim())
    .sort((a, b) => a.length - b.length)[0]
}

function pickManufacturer(offers) {
  return offers.find((o) => /[а-я]/i.test(o.manufacturer))?.manufacturer || offers[0].manufacturer
}
