import { useEffect, useMemo, useState } from 'react'
import { loadCatalog, STORES } from './lib/catalog.js'
import { formatPrice } from './lib/format.js'

export default function App() {
  const [status, setStatus] = useState('loading')
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState(null)
  const [sources, setSources] = useState(null)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')

    loadCatalog({ signal: controller.signal })
      .then((data) => {
        setProducts(data.products)
        setStats(data.stats)
        setSources(data.sources)
        setStatus('ready')
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(err.message || 'Не удалось загрузить каталог')
        setStatus('error')
      })

    return () => controller.abort()
  }, [])

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category))
    return ['all', ...[...set].sort((a, b) => a.localeCompare(b, 'ru'))]
  }, [products])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((product) => {
      if (category !== 'all' && product.category !== category) return false
      if (!q) return true
      return (
        product.name.toLowerCase().includes(q) ||
        product.manufacturer.toLowerCase().includes(q)
      )
    })
  }, [products, query, category])

  return (
    <div className="page">
      <header className="hero">
        <div className="hero__media" aria-hidden="true" />
        <div className="hero__grain" aria-hidden="true" />
        <nav className="hero__nav">
          <a className="brand" href="#catalog">
            Opti<span>.</span>
          </a>
          <div className="hero__stores" aria-label="Магазины">
            {Object.values(STORES).map((store) => (
              <span key={store.id} className="store-pill">
                {store.name}
              </span>
            ))}
          </div>
        </nav>
        <div className="hero__content">
          <h1 className="hero__title">Одна корзина. Лучшая цена.</h1>
          <p className="hero__lead">
            Opti собирает товары из Пятёрочки, Ашана и Магнита, сопоставляет одинаковые позиции и
            показывает, где сейчас дешевле.
          </p>
          <a className="hero__cta" href="#catalog">
            Смотреть сравнение
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </header>

      <main id="catalog" className="catalog">
        <div className="catalog__head">
          <h2 className="catalog__title">Сравнение цен</h2>
          <p className="catalog__note">
            Одинаковые товары сведены по названию и производителю. Крупно — минимальная цена, мелким
            шрифтом — цены в остальных магазинах.
          </p>
        </div>

        <div className="toolbar">
          <input
            className="search"
            type="search"
            placeholder="Поиск по названию или производителю"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Поиск товаров"
          />
          <select
            className="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Категория"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === 'all' ? 'Все категории' : item}
              </option>
            ))}
          </select>
          {stats && (
            <div className="stats" aria-live="polite">
              <span className="stat">{stats.offers} офферов</span>
              <span className="stat">{stats.products} товаров</span>
              <span className="stat">{stats.matched} сопоставлено</span>
            </div>
          )}
        </div>

        {status === 'loading' && (
          <div className="loading">
            <div className="spinner" aria-hidden="true" />
            <p>Загружаем каталоги Пятёрочки, Ашана и Магнита…</p>
          </div>
        )}

        {status === 'error' && <p className="error">{error}</p>}

        {status === 'ready' && filtered.length === 0 && (
          <p className="empty">Ничего не найдено. Попробуйте другой запрос.</p>
        )}

        {status === 'ready' && filtered.length > 0 && (
          <ul className="product-list">
            {filtered.map((product, index) => (
              <ProductRow key={product.id} product={product} index={index} />
            ))}
          </ul>
        )}
      </main>

      <section id="sources" className="sources" aria-labelledby="sources-title">
        <div className="sources__inner">
          <h2 id="sources-title" className="sources__title">
            Статус API магазинов
          </h2>
          <p className="sources__lead">
            Проверили официальные и публичные источники. Открытого API каталога цен у розничных
            сетей нет — Opti сейчас работает на демо-данных. Подробности: docs/STORE_APIS.md.
          </p>
          <ul className="sources__list">
            {(sources?.stores || []).map((store) => (
              <li key={store.id} className="source-row">
                <div>
                  <h3>{store.name}</h3>
                  <p>{store.note}</p>
                </div>
                <div className="source-row__meta">
                  <span className="source-badge source-badge--demo">демо</span>
                  {store.official && (
                    <a href={store.official} target="_blank" rel="noreferrer">
                      Официальный канал
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="footer">
        <p>
          <strong>Opti</strong> — демо-агрегатор. Публичного API цен нет; легальный путь — партнёрский
          фид или data-провайдер. Неофициальные scrapers сайтов сетей в продукт не подключаем.
        </p>
      </footer>
    </div>
  )
}

function ProductRow({ product, index }) {
  const bestStore = STORES[product.best.storeId]
  const others = product.offers.filter((offer) => offer.storeId !== product.best.storeId)

  return (
    <li className="product" style={{ animationDelay: `${Math.min(index, 10) * 0.04}s` }}>
      <div className="product__meta">
        <h3>{product.name}</h3>
        <p>
          {product.manufacturer}
          {product.unit ? ` · ${product.unit}` : ''}
        </p>
        <div className="product__tags">
          <span className="tag">{product.category}</span>
          <span className="tag">в {product.storeCount} {storeWord(product.storeCount)}</span>
          {product.savings > 0 && (
            <span className="savings">экономия до {formatPrice(product.savings)}</span>
          )}
        </div>
      </div>

      <div className="pricing">
        <div className="best-price">
          <span className="best-price__label">Лучшая цена</span>
          <span className="best-price__value">{formatPrice(product.best.price)}</span>
          <span className="best-price__store">{bestStore?.name}</span>
        </div>

        {others.length > 0 ? (
          <ul className="other-prices">
            {others.map((offer) => (
              <li key={`${product.id}-${offer.storeId}`}>
                {STORES[offer.storeId]?.name}: <strong>{formatPrice(offer.price)}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p className="other-prices">Пока только в одном магазине</p>
        )}
      </div>
    </li>
  )
}

function storeWord(n) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'магазине'
  return 'магазинах'
}
