/**
 * Демо-каталоги магазинов.
 * В проде каждый адаптер заменяется на официальный/партнёрский API
 * или согласованный фид — публичного открытого API у сетей нет.
 */

export const STORES = {
  pyaterochka: {
    id: 'pyaterochka',
    name: 'Пятёрочка',
    short: 'Пятёрочка',
    color: '#e11d48',
  },
  auchan: {
    id: 'auchan',
    name: 'Ашан',
    short: 'Ашан',
    color: '#dc2626',
  },
  magnit: {
    id: 'magnit',
    name: 'Магнит',
    short: 'Магнит',
    color: '#e11d48',
  },
}

/** @typedef {{ storeId: string, sku: string, name: string, manufacturer: string, category: string, price: number, unit: string }} StoreOffer */

/** @type {StoreOffer[]} */
export const RAW_OFFERS = [
  // Молоко
  {
    storeId: 'pyaterochka',
    sku: 'p-milk-1',
    name: 'Молоко Простоквашино 3,2%',
    manufacturer: 'Простоквашино',
    category: 'Молочные продукты',
    price: 89.9,
    unit: '930 мл',
  },
  {
    storeId: 'auchan',
    sku: 'a-milk-1',
    name: 'Молоко «Простоквашино» 3.2%',
    manufacturer: 'Простоквашино',
    category: 'Молочные продукты',
    price: 92.5,
    unit: '930 мл',
  },
  {
    storeId: 'magnit',
    sku: 'm-milk-1',
    name: 'Молоко Простоквашино 3,2% 930мл',
    manufacturer: 'Простоквашино',
    category: 'Молочные продукты',
    price: 84.99,
    unit: '930 мл',
  },

  // Хлеб
  {
    storeId: 'pyaterochka',
    sku: 'p-bread-1',
    name: 'Хлеб Бородинский нарезка',
    manufacturer: 'Хлебный дом',
    category: 'Хлеб и выпечка',
    price: 54.9,
    unit: '400 г',
  },
  {
    storeId: 'auchan',
    sku: 'a-bread-1',
    name: 'Хлеб бородинский, нарезка',
    manufacturer: 'Хлебный Дом',
    category: 'Хлеб и выпечка',
    price: 49.9,
    unit: '400 г',
  },
  {
    storeId: 'magnit',
    sku: 'm-bread-1',
    name: 'Хлеб Бородинский нарезанный',
    manufacturer: 'Хлебный дом',
    category: 'Хлеб и выпечка',
    price: 52.0,
    unit: '400 г',
  },

  // Гречка
  {
    storeId: 'pyaterochka',
    sku: 'p-buck-1',
    name: 'Крупа гречневая Увелка',
    manufacturer: 'Увелка',
    category: 'Бакалея',
    price: 119.0,
    unit: '800 г',
  },
  {
    storeId: 'auchan',
    sku: 'a-buck-1',
    name: 'Гречка Увелка ядрица',
    manufacturer: 'Увелка',
    category: 'Бакалея',
    price: 109.9,
    unit: '800 г',
  },
  {
    storeId: 'magnit',
    sku: 'm-buck-1',
    name: 'Крупа гречневая «Увелка»',
    manufacturer: 'Увелка',
    category: 'Бакалея',
    price: 124.5,
    unit: '800 г',
  },

  // Масло
  {
    storeId: 'pyaterochka',
    sku: 'p-oil-1',
    name: 'Масло подсолнечное Слобода',
    manufacturer: 'Слобода',
    category: 'Бакалея',
    price: 149.9,
    unit: '1 л',
  },
  {
    storeId: 'auchan',
    sku: 'a-oil-1',
    name: 'Масло подсолнечное «Слобода» рафинированное',
    manufacturer: 'Слобода',
    category: 'Бакалея',
    price: 139.0,
    unit: '1 л',
  },
  {
    storeId: 'magnit',
    sku: 'm-oil-1',
    name: 'Масло Слобода подсолнечное',
    manufacturer: 'Слобода',
    category: 'Бакалея',
    price: 144.9,
    unit: '1 л',
  },

  // Яйца
  {
    storeId: 'pyaterochka',
    sku: 'p-egg-1',
    name: 'Яйцо куриное С1 Село Зелёное',
    manufacturer: 'Село Зелёное',
    category: 'Яйца',
    price: 99.9,
    unit: '10 шт',
  },
  {
    storeId: 'auchan',
    sku: 'a-egg-1',
    name: 'Яйца куриные С1 «Село Зелёное»',
    manufacturer: 'Село Зелёное',
    category: 'Яйца',
    price: 94.9,
    unit: '10 шт',
  },
  {
    storeId: 'magnit',
    sku: 'm-egg-1',
    name: 'Яйцо С1 Село Зеленое',
    manufacturer: 'Село Зеленое',
    category: 'Яйца',
    price: 102.0,
    unit: '10 шт',
  },

  // Чай
  {
    storeId: 'pyaterochka',
    sku: 'p-tea-1',
    name: 'Чай Ahmad English Breakfast',
    manufacturer: 'Ahmad Tea',
    category: 'Чай и кофе',
    price: 289.0,
    unit: '100 пак.',
  },
  {
    storeId: 'auchan',
    sku: 'a-tea-1',
    name: 'Чай Ahmad Tea English Breakfast',
    manufacturer: 'Ahmad Tea',
    category: 'Чай и кофе',
    price: 279.9,
    unit: '100 пак.',
  },
  {
    storeId: 'magnit',
    sku: 'm-tea-1',
    name: 'Чай Ahmad English Breakfast пакетированный',
    manufacturer: 'Ahmad Tea',
    category: 'Чай и кофе',
    price: 299.0,
    unit: '100 пак.',
  },

  // Кофе
  {
    storeId: 'pyaterochka',
    sku: 'p-coffee-1',
    name: 'Кофе Jacobs Monarch растворимый',
    manufacturer: 'Jacobs',
    category: 'Чай и кофе',
    price: 459.0,
    unit: '95 г',
  },
  {
    storeId: 'auchan',
    sku: 'a-coffee-1',
    name: 'Кофе растворимый Jacobs Monarch',
    manufacturer: 'Jacobs',
    category: 'Чай и кофе',
    price: 449.0,
    unit: '95 г',
  },
  {
    storeId: 'magnit',
    sku: 'm-coffee-1',
    name: 'Jacobs Monarch кофе растворимый',
    manufacturer: 'Jacobs',
    category: 'Чай и кофе',
    price: 469.9,
    unit: '95 г',
  },

  // Паста
  {
    storeId: 'pyaterochka',
    sku: 'p-pasta-1',
    name: 'Макароны Barilla Spaghetti №5',
    manufacturer: 'Barilla',
    category: 'Бакалея',
    price: 129.9,
    unit: '450 г',
  },
  {
    storeId: 'auchan',
    sku: 'a-pasta-1',
    name: 'Spaghetti Barilla №5',
    manufacturer: 'Barilla',
    category: 'Бакалея',
    price: 134.0,
    unit: '450 г',
  },
  {
    storeId: 'magnit',
    sku: 'm-pasta-1',
    name: 'Макаронные изделия Barilla Spaghetti 5',
    manufacturer: 'Barilla',
    category: 'Бакалея',
    price: 119.9,
    unit: '450 г',
  },

  // Сыр
  {
    storeId: 'pyaterochka',
    sku: 'p-cheese-1',
    name: 'Сыр Российский Брест-Литовск',
    manufacturer: 'Брест-Литовск',
    category: 'Молочные продукты',
    price: 349.0,
    unit: '200 г',
  },
  {
    storeId: 'auchan',
    sku: 'a-cheese-1',
    name: 'Сыр «Российский» Брест-Литовск',
    manufacturer: 'Брест-Литовск',
    category: 'Молочные продукты',
    price: 329.9,
    unit: '200 г',
  },
  {
    storeId: 'magnit',
    sku: 'm-cheese-1',
    name: 'Сыр Российский Брест Литовск',
    manufacturer: 'Брест Литовск',
    category: 'Молочные продукты',
    price: 359.0,
    unit: '200 г',
  },

  // Йогурт — только в двух магазинах
  {
    storeId: 'pyaterochka',
    sku: 'p-yog-1',
    name: 'Йогурт Активиа натуральный',
    manufacturer: 'Активиа',
    category: 'Молочные продукты',
    price: 64.9,
    unit: '150 г',
  },
  {
    storeId: 'magnit',
    sku: 'm-yog-1',
    name: 'Йогурт Activia натуральный',
    manufacturer: 'Activia',
    category: 'Молочные продукты',
    price: 59.9,
    unit: '150 г',
  },

  // Уникальный товар только в Ашане
  {
    storeId: 'auchan',
    sku: 'a-unique-1',
    name: 'Оливковое масло Borges Extra Virgin',
    manufacturer: 'Borges',
    category: 'Бакалея',
    price: 699.0,
    unit: '500 мл',
  },
]
