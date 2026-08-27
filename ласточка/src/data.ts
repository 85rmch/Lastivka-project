import { Product, CategoryKey, CategoryInfo } from './types';

export const CATEGORIES: CategoryInfo[] = [
  { key: 'all', labelRu: 'Все товары', labelUa: 'Всі товари', icon: 'Sparkles' },
  { key: 'new', labelRu: 'Новинки', labelUa: 'Новинки', icon: 'Star' },
  { key: 'bras', labelRu: 'Бюстгальтеры', labelUa: 'БЮСТГАЛЬТЕРИ', icon: 'Heart' },
  { key: 'panties', labelRu: 'Трусики', labelUa: 'ТРУСИКИ', icon: 'Heart' },
  { key: 'home', labelRu: 'Одежда для дома', labelUa: 'ОДЯГ ДЛЯ ДОМУ', icon: 'Shirt' },
  { key: 'swimwear', labelRu: 'Купальники', labelUa: 'КУПАЛЬНИКИ', icon: 'Sun' },
  { key: 'sets', labelRu: 'Комплекты белья', labelUa: 'КОМПЛЕКТИ БІЛИЗНИ', icon: 'Layers' },
  { key: 'thermals', labelRu: 'Термобелье', labelUa: 'ТЕРМОБІЛИЗНА', icon: 'Flame' },
  { key: 'erotic', labelRu: 'Эротическое белье', labelUa: 'ЕРОТИЧНА БІЛИЗНА', icon: 'Zap' },
  { key: 'toys_accessories', labelRu: 'Игрушки и аксессуары', labelUa: 'ІГРАШКИ ТА АКСЕСУАРИ', icon: 'Gamepad2' },
  { key: 'socks', labelRu: 'Носки', labelUa: 'ШКАРПЕТКИ', icon: 'Footprints' },
];

export const COLOR_OPTIONS: string[] = [
  "Червоно-бежевий",
  "Чорно-бежевий",
  "Леопард",
  "Пудра",
  "Сливовий",
  "Фіолетовий",
  "Бузковий",
  "Синій",
  "Світло-сірий",
  "Темно-сірий",
  "Бежевий",
  "Мікс кольорів",
  "Бірюзовий",
  "Бордо",
  "Блакитний",
  "Гірчичний",
  "Жовтий",
  "Зелений",
  "Кораловий",
  "Коричневий",
  "Червоний",
  "Малиновий",
  "Молочний",
  "Памаранчевий",
  "Рожевий",
  "Срібний",
  "Золотий",
  "Чорний",
  "Білий",
  "Салатовий",
  "Капучіно",
  "Мокка",
  "Персиковий",
  "Марсал",
  "Коричнево-бежевий",
  "Чорно-білий",
  "Фуксія",
  "Молочно-бежевий",
  "Оливковий",
  "Камуфляж"
];

export const CUP_TYPE_OPTIONS: string[] = [
  "Тонкий поролон",
  "Гладкі",
  "На поролоні",
  "Анжеліка",
  "Мереживні",
  "Безшовні",
  "Пуш-ап/коректор",
  "Без поролону на кісточках",
  "Без поролону і без кісточок",
  "На поролоні без кісточок",
  "Корсети",
  "Для годуючих",
  "Силіконові бра",
  "Топи"
];

export const RAW_PRODUCTS_DATA = [
  {
    id: 1,
    product_code: "Д99",
    name: "Махрова піжама з коміром кольору фуксія, р.44. Код: Д99",
    vendor_code: "#2165",
    color: "фуксія",
    purchase_price: 550,
    price: 1100,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/4%20-%20pajamas/51-100/99_2.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/4%20-%20pajamas/51-100/99_0.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/4%20-%20pajamas/51-100/99_1.jpg"],
    sizes: "44-46",
    stock: 1
  },
  {
    id: 2,
    product_code: "Д100",
    name: "Жіноча махрова піжама з манжетами \"Сніговий барс\", р. 42, 46, 50. Код: Д100",
    vendor_code: "#2087",
    color: "біло-сірий",
    purchase_price: 558,
    price: 1100,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/4%20-%20pajamas/51-100/100_0.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/4%20-%20pajamas/51-100/100_1.jpg"],
    sizes: "42, 46, 50",
    stock: 1
  },
  {
    id: 3,
    product_code: "Д117",
    name: "Стильна махрова піжама для дому, р.S. Код: Д117",
    vendor_code: "#810",
    color: "жовтий",
    purchase_price: 390,
    price: 780,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/4%20-%20pajamas/101-150/117_0.jpg"],
    sizes: "S",
    stock: 1
  },
  {
    id: 4,
    product_code: "Д120",
    name: "Чорна піжамка з віскози, р.м. Код: Д120",
    vendor_code: "#904",
    color: "чорний",
    purchase_price: 250,
    price: 520,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/4%20-%20pajamas/101-150/120_1.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/4%20-%20pajamas/101-150/120_0.jpg"],
    sizes: "M",
    stock: 1
  },
  {
    id: 5,
    product_code: "Д125",
    name: "Трикотажна піжама з кофти та штанів, р.S. Код: Д125",
    vendor_code: "#590",
    color: "синя в червоне сердце",
    purchase_price: 370,
    price: 740,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/4%20-%20pajamas/101-150/125.jpg"],
    sizes: "S",
    stock: 1
  },
  {
    id: 6,
    product_code: "A156",
    name: "Настільна гра \"Ті + Я\" для двох 18+. Код: А156",
    vendor_code: "",
    color: "мікс",
    purchase_price: 400,
    price: 420,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/6%20-%20erotic/151-200/156_1.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/6%20-%20erotic/151-200/156_2.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/6%20-%20erotic/151-200/156_0.jpg"],
    sizes: "1 шт",
    stock: 1
  },
  {
    id: 7,
    product_code: "Б385",
    name: "Бюстик з пушапом чашка В, два кольори. Код: Б385",
    vendor_code: "#6102",
    color: "білий, чорний",
    purchase_price: 155.63,
    cup_type: "Пуш-ап",
    price: 420,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/2%20-%20bras_bralets/Б351-400/385.jpg"],
    sizes: "85В білий, 85В чорний",
    stock: 5
  },
  {
    id: 8,
    product_code: "Б387",
    name: "Білий бюстик чашка поролон. Код: Б387",
    vendor_code: "#6020",
    color: "білий",
    purchase_price: 149.4,
    cup_type: "Поролон",
    price: 420,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/2%20-%20bras_bralets/Б351-400/387.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/2%20-%20bras_bralets/Б351-400/387_1.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/2%20-%20bras_bralets/Б351-400/387_0.jpg"],
    sizes: "85В білий",
    stock: 2
  },
  {
    id: 9,
    product_code: "A20",
    name: "Трусики еротичні \"Лілія\", різні кольори. Код: А20",
    vendor_code: "",
    color: "рожевий, бордо, білий",
    purchase_price: 80,
    price: 210,
    photo: [],
    sizes: "розовий, бордо, білий",
    stock: 3
  },
  {
    id: 901,
    product_code: "A21",
    name: "Мереживні стрінги жіночі, чорні",
    vendor_code: "P-STR-01",
    color: "чорний",
    purchase_price: 50,
    price: 150,
    photo: [],
    sizes: "S, M, L",
    stock: 10
  },
  {
    id: 902,
    product_code: "A22",
    name: "Бавовняні трусики сліпи на кожен день",
    vendor_code: "P-SLP-01",
    color: "білий, бежевий",
    purchase_price: 40,
    price: 120,
    photo: [],
    sizes: "M, L, XL",
    stock: 15
  },
  {
    id: 903,
    product_code: "A23",
    name: "Елегантні бразиліани з вишивкою",
    vendor_code: "P-BRZ-01",
    color: "червоний",
    purchase_price: 60,
    price: 180,
    photo: [],
    sizes: "S, M",
    stock: 5
  },
  {
    id: 904,
    product_code: "A24",
    name: "Чоловічі боксери бавовна",
    vendor_code: "M-BOX-01",
    color: "синій, сірий",
    purchase_price: 70,
    price: 190,
    photo: [],
    sizes: "L, XL, XXL",
    stock: 20
  },
  {
    id: 10,
    product_code: "A69",
    name: "Еротичний набір бордо, S, M, L, XL. Код: А69",
    vendor_code: "#27/13",
    color: "бордо",
    purchase_price: 285,
    price: 699,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/6%20-%20erotic/51-100/A69_1.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/6%20-%20erotic/51-100/A69_0.jpg"],
    sizes: "S, M, L, XL",
    stock: 1
  },
  {
    id: 11,
    product_code: "A166",
    name: "Сексуальний комплект з вишивкою, S. Код: А166",
    vendor_code: "",
    color: "мікс кольорів",
    purchase_price: 412,
    price: 980,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/6%20-%20erotic/151-200/166_0.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/6%20-%20erotic/151-200/166_1.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/6%20-%20erotic/151-200/166_2.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/6%20-%20erotic/151-200/166_3.jpg"],
    sizes: "S",
    stock: 1
  },
  {
    id: 12,
    product_code: "A195",
    name: "Червоні еротичні колготки з доступом. Код: А195",
    vendor_code: "#5024",
    color: "червоний",
    purchase_price: 270,
    price: 680,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/6%20-%20erotic/151-200/195_2.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/6%20-%20erotic/151-200/195_1.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/6%20-%20erotic/151-200/195_0.jpg"],
    sizes: "універсальний",
    stock: 1
  },
  {
    id: 13,
    product_code: "A170",
    name: "Еротичний комплект кольору ізумруд, L. Код: А170",
    vendor_code: "",
    color: "зелений",
    purchase_price: 240,
    price: 700,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/6%20-%20erotic/151-200/170_1.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/6%20-%20erotic/151-200/170_2.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/6%20-%20erotic/151-200/170_0.jpg"],
    sizes: "L",
    stock: 1
  },
  {
    id: 14,
    product_code: "Д23",
    name: "Комплект зимової термобілизни Columbia батал. Код: Д23",
    vendor_code: "",
    color: "чорний",
    purchase_price: 310,
    price: 800,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/4%20-%20pajamas/Д1-50/Д23_0.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/4%20-%20pajamas/Д1-50/Д23_1.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/4%20-%20pajamas/Д1-50/Д23_3.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/4%20-%20pajamas/Д1-50/Д23_4.jpg"],
    sizes: "3XL, 4XL, 5XL, 6XL",
    stock: 4
  },
  {
    id: 15,
    product_code: "Д50",
    name: "Жіноча термобілизна Smartov, розмір S. Код: Д50",
    vendor_code: "",
    color: "чорний",
    purchase_price: 300,
    price: 850,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/4%20-%20pajamas/Д1-50/50_0.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/4%20-%20pajamas/Д1-50/50_1.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/4%20-%20pajamas/Д1-50/50_2.jpg"],
    sizes: "S",
    stock: 1
  },
  {
    id: 16,
    product_code: "Д77",
    name: "Чоловічий комплект термобілізні з додаванням вовни. Код: Д77",
    vendor_code: "#Ч784_темно-сірий",
    color: "темно-сірий",
    purchase_price: 324.9,
    price: 750,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/4%20-%20pajamas/51-100/77_0.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/4%20-%20pajamas/51-100/77_3.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/4%20-%20pajamas/51-100/77_4.jpg"],
    sizes: "L(46), XL(48), 2XL(50), 3XL(52)",
    stock: 4
  },
  {
    id: 17,
    product_code: "Д79",
    name: "Жіночий комплект термобілизни з додаванням вовни. Код: Д79",
    vendor_code: "#Ж794_рожевий",
    color: "бузковий, рожевий",
    purchase_price: 291.7,
    price: 750,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/4%20-%20pajamas/51-100/79_0.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/4%20-%20pajamas/51-100/79_1.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/4%20-%20pajamas/51-100/79_2.jpg"],
    sizes: "L(46) бузковий, M(44) рожевий",
    stock: 2
  },
  {
    id: 18,
    product_code: "Д80",
    name: "Жіночий комплект термобілізни на мікрофлісі. Код: Д80",
    vendor_code: "#Ж784_фіолетовий",
    color: "бузковий",
    purchase_price: 276,
    price: 750,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/4%20-%20pajamas/51-100/80_0.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/4%20-%20pajamas/51-100/80_1.jpg"],
    sizes: "2XL(50), L",
    stock: 1
  },
  {
    id: 19,
    product_code: "Д129",
    name: "Термобілизна тактична олива, розмір L. Код: Д129",
    vendor_code: "#JA-09-3 Green",
    color: "оливковий",
    purchase_price: 474.05,
    price: 1100,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/4%20-%20pajamas/101-150/129.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/4%20-%20pajamas/101-150/129_1.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/4%20-%20pajamas/101-150/129_2.jpg"],
    sizes: "L",
    stock: 1
  },
  {
    id: 20,
    product_code: "Д131",
    name: "Термобілизна чоловіча камуфляж, L, XL. Код: Д131",
    vendor_code: "",
    color: "камуфляж",
    purchase_price: 370,
    price: 900,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/4%20-%20pajamas/101-150/131_0.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/4%20-%20pajamas/101-150/131_1.jpg"],
    sizes: "L, XL",
    stock: 2
  },
  {
    id: 21,
    product_code: "Н4",
    name: "Шкарпетки чоловічі Житомир сітка Класик, розмір 29-31",
    vendor_code: "---",
    color: "бежевий",
    purchase_price: 6,
    price: 15,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/Н4.png"],
    sizes: "29-31",
    stock: 3
  },
  {
    id: 22,
    product_code: "Н8",
    name: "Шкарпетки підліток BFL 32-35 розмір BFL B253",
    vendor_code: "#08939",
    color: "чорний",
    purchase_price: 8,
    price: 15,
    photo: [],
    sizes: "32-35",
    stock: 4
  },
  {
    id: 23,
    product_code: "Н12",
    name: "Шкарпетки підліткові веселі кольори",
    vendor_code: "---",
    color: "різні кольори",
    purchase_price: 6,
    price: 15,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/Н12.jpg"],
    sizes: "універсальний",
    stock: 6
  },
  {
    id: 24,
    product_code: "Н15",
    name: "Шкарпетки вовняні з махрою \"Ангора\" 34-38р.",
    vendor_code: "#Adpec D 103 Z",
    color: "різні кольори",
    purchase_price: 8,
    price: 17,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/Н15.jpg"],
    sizes: "34-38",
    stock: 10
  },
  {
    id: 25,
    product_code: "Н16",
    name: "Шкарпетки дитячі з ангори з махрою, р.16-20см",
    vendor_code: "#Honest 001 Z",
    color: "різні кольори",
    purchase_price: 9,
    price: 17,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/Н16.jpg"],
    sizes: "16-20 см",
    stock: 7
  },
  {
    id: 26,
    product_code: "Н17",
    name: "Шкарпетки дитячі махрові, р.17-22 см",
    vendor_code: "#Jujube Y 108A S",
    color: "різні кольори",
    purchase_price: 11,
    price: 20,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/Н17.jpg"],
    sizes: "17-22 см",
    stock: 3
  },
  {
    id: 27,
    product_code: "Н18",
    name: "Шкарпетки лайкра Elizabeth 30DEN, Чорний (2 пари в уп.)",
    vendor_code: "#NL30D",
    color: "чорний",
    purchase_price: 4,
    price: 8,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/Н18.png"],
    sizes: "35-40",
    stock: 3
  },
  {
    id: 28,
    product_code: "Н20",
    name: "Капронові шкарпетки з візерунком, р. 38-42 (2 пари)",
    vendor_code: "#NK801",
    color: "чорний / бежевий",
    purchase_price: 3.4,
    price: 7,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/Н20.png"],
    sizes: "38-42",
    stock: 4
  },
  {
    id: 29,
    product_code: "Н21",
    name: "Капронові шкарпетки Soli 20DEN без лайкри",
    vendor_code: "#N30",
    color: "бежевий",
    purchase_price: 2.6,
    price: 6.5,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/Н21.jpg"],
    sizes: "універсальний",
    stock: 4
  },
  {
    id: 30,
    product_code: "Н22",
    name: "Гольфи Elizabeth 30DEN лайкра, бежеві",
    vendor_code: "#GL30D",
    color: "бежевий",
    purchase_price: 5.1,
    price: 12,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/Н22.jpg"],
    sizes: "універсальний",
    stock: 5
  },
  {
    id: 31,
    product_code: "Н26",
    name: "Дитячі зимові махрові шкарпетки для дівчаток",
    vendor_code: "#834 А",
    color: "різні кольори",
    purchase_price: 10.5,
    price: 23,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/Н26.jpg"],
    sizes: "дитячий",
    stock: 11
  },
  {
    id: 32,
    product_code: "Н27",
    name: "Дитячі махрові шкарпетки \"Котики\" з 3 до 6 років, р.32-37",
    vendor_code: "#Д 55",
    color: "різні кольори",
    purchase_price: 10,
    price: 23,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/Н27.jpg"],
    sizes: "32-37",
    stock: 3
  },
  {
    id: 33,
    product_code: "Н28",
    name: "Махрові жіночі шкарпетки на зиму \"Бантики\", \"Олені\"",
    vendor_code: "#80977",
    color: "різні кольори",
    purchase_price: 11,
    price: 25,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/Н28.jpg"],
    sizes: "35-40",
    stock: 8
  },
  {
    id: 34,
    product_code: "Н29",
    name: "Шкарпетки короткі стрейчові, спортивні, р.27-29",
    vendor_code: "#Т 021",
    color: "різні кольори",
    purchase_price: 7,
    price: 17,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/Н29.jpg"],
    sizes: "27-29",
    stock: 3
  },
  {
    id: 35,
    product_code: "Н30",
    name: "Шикарні жіночі гольфи, розмір 35/40",
    vendor_code: "---",
    color: "різні кольори",
    purchase_price: 5.81,
    price: 17,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/Н30_1.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/Н30_2.jpg"],
    sizes: "35-40",
    stock: 6
  },
  {
    id: 36,
    product_code: "K23",
    name: "Купальник \"Загадкова міс\", червоний, S-XL. Код: КУ23",
    vendor_code: "#208",
    color: "червоний",
    purchase_price: 215,
    price: 650,
    photo: [],
    sizes: "S, M, L, XL",
    stock: 2
  },
  {
    id: 37,
    product_code: "Н31",
    name: "Якісні гольфи на дівчинку 5-7 років",
    vendor_code: "---",
    color: "різні кольори",
    purchase_price: 5.81,
    price: 17,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/Н31.jpg"],
    sizes: "5-7 років",
    stock: 6
  },
  {
    id: 38,
    product_code: "Н32",
    name: "Яскраві жіночі шкарпетки в смужку (бамбук) розмір 37-42",
    vendor_code: "---",
    color: "різні кольори",
    purchase_price: 7.13,
    price: 17,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/Н32.jpg"],
    sizes: "37-42",
    stock: 3
  },
  {
    id: 39,
    product_code: "Н34",
    name: "Махрові шкарпетки жіночі \"Bony\"",
    vendor_code: "#листочки",
    color: "різні кольори",
    purchase_price: 10.8,
    price: 25,
    photo: [],
    sizes: "36-40",
    stock: 6
  },
  {
    id: 40,
    product_code: "Н36",
    name: "Шкарпетки чоловічі класика бавовна",
    vendor_code: "#015н",
    color: "чорний",
    purchase_price: 6,
    price: 17,
    photo: [],
    sizes: "універсальний",
    stock: 3
  },
  {
    id: 41,
    product_code: "Н37",
    name: "Жіночі трикотажні шкарпетки \"Мода Women\", р.36-42",
    vendor_code: "#полоска",
    color: "різні кольори",
    purchase_price: 5.8,
    price: 17,
    photo: [],
    sizes: "36-42",
    stock: 3
  },
  {
    id: 42,
    product_code: "Н38",
    name: "Махрові жіночі шкарпетки \"Олені-ялинки\", р.36-40",
    vendor_code: "",
    color: "різні кольори",
    purchase_price: 11,
    price: 25,
    photo: [],
    sizes: "36-40",
    stock: 8
  },
  {
    id: 43,
    product_code: "A182",
    name: "Наручники для рольових ігор. Код: А182",
    vendor_code: "#5404-1",
    color: "чорний",
    purchase_price: 87.7,
    price: 220,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/6%20-%20erotic/151-200/182_0.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/6%20-%20erotic/151-200/182_1.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/6%20-%20erotic/151-200/182_2.jpg"],
    sizes: "універсальний",
    stock: 1
  },
  {
    id: 44,
    product_code: "Н39",
    name: "Короткі жіночі шкарпетки, р.36-42, різнокольорові",
    vendor_code: "#016ж",
    color: "різні кольори",
    purchase_price: 5.5,
    price: 17,
    photo: [],
    sizes: "36-42",
    stock: 3
  },
  {
    id: 45,
    product_code: "Н40",
    name: "Махрові дитячі шкарпетки \"Мішутка\", р.16-34",
    vendor_code: "---",
    color: "різні кольори",
    purchase_price: 10.8,
    price: 23,
    photo: [],
    sizes: "16-22, 22-28, 28-34",
    stock: 10
  },
  {
    id: 46,
    product_code: "Н41",
    name: "Жіночі шкарпетки \"Наталі\", р.37-42",
    vendor_code: "---",
    color: "різні кольори",
    purchase_price: 5.8,
    price: 18,
    photo: [],
    sizes: "37-42",
    stock: 27
  },
  {
    id: 47,
    product_code: "Н42",
    name: "Білі чоловічі шкарпетки \"Укорочені\" р.27, р.29",
    vendor_code: "---",
    color: "білий",
    purchase_price: 7.5,
    price: 20,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/Н42.jpg"],
    sizes: "р.27, р.29",
    stock: 7
  },
  {
    id: 48,
    product_code: "Н43",
    name: "Бежеві чоловічі шкарпетки гладкі \"Класик\" р.29",
    vendor_code: "---",
    color: "бежевий",
    purchase_price: 7.5,
    price: 20,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/Н43.jpg"],
    sizes: "р.29",
    stock: 6
  },
  {
    id: 49,
    product_code: "Н44",
    name: "Темно-сірі чоловічі шкарпетки \"Класик\" р.27",
    vendor_code: "---",
    color: "темно-сірий",
    purchase_price: 7.5,
    price: 20,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/Н44.jpg"],
    sizes: "р.27",
    stock: 5
  },
  {
    id: 50,
    product_code: "Н45",
    name: "Світло-сірі чоловічі шкарпетки \"Класик\" р.29",
    vendor_code: "---",
    color: "сірий",
    purchase_price: 7.5,
    price: 20,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/Н45.jpg"],
    sizes: "р.29",
    stock: 5
  },
  {
    id: 51,
    product_code: "Н46",
    name: "Чорні чоловічі шкарпетки гладкі \"Класик\" р.25-31",
    vendor_code: "---",
    color: "чорний",
    purchase_price: 7.5,
    price: 20,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/Н46.jpg"],
    sizes: "р.25, 27, 29, 31",
    stock: 10
  },
  {
    id: 52,
    product_code: "Н50",
    name: "Сірі чоловічі шкарпетки сітка \"Класик\" р.27",
    vendor_code: "---",
    color: "сірий",
    purchase_price: 6.5,
    price: 20,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/Н50_1.jpg"],
    sizes: "р.27",
    stock: 4
  },
  {
    id: 53,
    product_code: "Н51",
    name: "Чорні чоловічі шкарпетки \"Спорт\" р.25, 29, 31",
    vendor_code: "---",
    color: "чорний",
    purchase_price: 7.5,
    price: 20,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/Н51_1.jpg"],
    sizes: "р.25, 29, 31",
    stock: 5
  },
  {
    id: 54,
    product_code: "Н52",
    name: "Шкарпетки \"Трекінгові\" р.25, 29",
    vendor_code: "---",
    color: "мікс",
    purchase_price: 35,
    price: 58,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/Н52_1.jpg"],
    sizes: "р.25, р.29",
    stock: 6
  },
  {
    id: 55,
    product_code: "Н53",
    name: "Чорні жіночі шкарпетки укорочені \"Класик\", р.23-25",
    vendor_code: "---",
    color: "чорний",
    purchase_price: 7.5,
    price: 20,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/Н53.jpg"],
    sizes: "р.23-25",
    stock: 5
  },
  {
    id: 56,
    product_code: "Н54",
    name: "Шкарпетки жіночі серії \"Панда\", р.23-25",
    vendor_code: "---",
    color: "різні кольори",
    purchase_price: 7.5,
    price: 20,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/Н54_1.jpg"],
    sizes: "р.23-25",
    stock: 3
  },
  {
    id: 57,
    product_code: "К6",
    name: "Колготки дитячі Конте-Кідз: Class, Bravo, Tip-Top",
    vendor_code: "---",
    color: "різнокольорові",
    purchase_price: 53.1,
    price: 85,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/К6_conte_kids.png"],
    sizes: "80-86, 104-110, 116-122",
    stock: 5
  },
  {
    id: 58,
    product_code: "К7",
    name: "Дитячі колготки Gatta Happy School",
    vendor_code: "---",
    color: "чорний в зірочку",
    purchase_price: 45,
    price: 85,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/К7_gatta_happySсhool.png"],
    sizes: "116-122",
    stock: 3
  },
  {
    id: 59,
    product_code: "К8",
    name: "Колготки Elizabeth 100DEN MICROFIBRE, Чорні",
    vendor_code: "#EL100MF",
    color: "чорний",
    purchase_price: 28.2,
    price: 50,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/K8.png"],
    sizes: "р.2, р.3, р.4, р.5",
    stock: 5
  },
  {
    id: 60,
    product_code: "К11",
    name: "Колготки 20 den бікіні 004EL",
    vendor_code: "#05883",
    color: "чорний",
    purchase_price: 16.3,
    price: 29,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/K11.png"],
    sizes: "р.2, р.3, р.4",
    stock: 3
  },
  {
    id: 61,
    product_code: "К17",
    name: "Колготки Elizabeth 40 den BIKINI CHARM, Чорні",
    vendor_code: "#EL40BC",
    color: "чорний",
    purchase_price: 16.6,
    price: 35,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/K17.png"],
    sizes: "р.2, р.3, р.4",
    stock: 3
  },
  {
    id: 62,
    product_code: "К18",
    name: "Колготки жіночі теплі 1600 den 2022KOL (термо)",
    vendor_code: "#09680",
    color: "чорний",
    purchase_price: 20,
    price: 100,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/К18.jpg"],
    sizes: "р.2-3",
    stock: 4
  },
  {
    id: 63,
    product_code: "К19",
    name: "Колготки дитячі \"Ластівка\". Код: К19",
    vendor_code: "#Nailali T2-1 92-98",
    color: "різні кольори",
    purchase_price: 33.4,
    price: 65,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/К19.jpg"],
    sizes: "92-98 см",
    stock: 4
  },
  {
    id: 64,
    product_code: "K20",
    name: "Лосини дитячі теплі, вік 3-7 років",
    vendor_code: "#395",
    color: "чорний в кольорову смужку",
    purchase_price: 15,
    price: 30,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/5%20-%20swim/КУ1-50/20_0.jpg"],
    sizes: "3-7 років",
    stock: 7
  },
  {
    id: 65,
    product_code: "K24",
    name: "Колготки жіночі Gabriella Julia 366 (20 den) темно-сірі, бежеві",
    vendor_code: "---",
    color: "темно-сірий, бежевий",
    purchase_price: 24,
    price: 90,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/5%20-%20swim/КУ1-50/24_0.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/5%20-%20swim/КУ1-50/24_1.jpg"],
    sizes: "р.4",
    stock: 4
  },
  {
    id: 66,
    product_code: "К26",
    name: "Колготки жіночі Gabriella Reni 286, чорні, р. 1/2",
    vendor_code: "---",
    color: "чорний",
    purchase_price: 32,
    price: 90,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/К26_gabriella-reni.jpg"],
    sizes: "р.1/2",
    stock: 3
  },
  {
    id: 67,
    product_code: "K27",
    name: "Колготки жіночі Gabriella Puntina TRE (20 den) темно-сірі, р. 2",
    vendor_code: "---",
    color: "темно-сірий",
    purchase_price: 24,
    price: 90,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/5%20-%20swim/КУ1-50/27_1.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/5%20-%20swim/КУ1-50/27_0.jpg"],
    sizes: "р.2",
    stock: 3
  },
  {
    id: 68,
    product_code: "К29",
    name: "Колготки жіночі Gabriella Miss 105 (20 den) білі",
    vendor_code: "---",
    color: "білий",
    purchase_price: 160,
    price: 480,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/К29_miss.png"],
    sizes: "р.2, р.3, р.4",
    stock: 3
  },
  {
    id: 69,
    product_code: "К31",
    name: "Колготки жіночі Gatta Gabby №6 (20 den) чорні, р. 3",
    vendor_code: "---",
    color: "чорний",
    purchase_price: 28,
    price: 90,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/К31_gatta-gabby.jpg"],
    sizes: "р.3",
    stock: 3
  },
  {
    id: 70,
    product_code: "K35",
    name: "Колготки жіночі Gabriella Bacara 477 (20 den), чорні",
    vendor_code: "---",
    color: "чорний",
    purchase_price: 266,
    price: 840,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/5%20-%20swim/КУ1-50/35_1.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/5%20-%20swim/КУ1-50/35_0.jpg"],
    sizes: "р.2, р.3, р.4",
    stock: 3
  },
  {
    id: 71,
    product_code: "K39",
    name: "Колготки жіночі Conte Verticale, чорні, р. 4",
    vendor_code: "---",
    color: "чорний",
    purchase_price: 48.47,
    price: 150,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/5%20-%20swim/КУ1-50/39_0.jpg"],
    sizes: "р.4",
    stock: 3
  },
  {
    id: 72,
    product_code: "К41",
    name: "Дитячі колготки Gatta Alice, білі",
    vendor_code: "---",
    color: "білий",
    purchase_price: 24,
    price: 85,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/К41_gatta_alice.jpg"],
    sizes: "116-122",
    stock: 3
  },
  {
    id: 73,
    product_code: "K42",
    name: "Дитячі штани Mona Nikola leggins, рожеві",
    vendor_code: "---",
    color: "рожевий",
    purchase_price: 24,
    price: 70,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/5%20-%20swim/КУ1-50/42_0.jpg"],
    sizes: "128-134",
    stock: 3
  },
  {
    id: 74,
    product_code: "K44",
    name: "Колготки дитячі Gabriella Melange 751, графіт",
    vendor_code: "---",
    color: "графіт, сірий",
    purchase_price: 20.4,
    price: 85,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/5%20-%20swim/КУ1-50/44_9.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/5%20-%20swim/КУ1-50/44_8.jpg"],
    sizes: "110-122",
    stock: 3
  },
  {
    id: 75,
    product_code: "K48",
    name: "Дитячі колготки Bravo, р. 116-122, 150-152",
    vendor_code: "---",
    color: "мікс",
    purchase_price: 62.4,
    price: 95,
    photo: [],
    sizes: "116-122, 150-152",
    stock: 4
  },
  {
    id: 76,
    product_code: "К50",
    name: "Легінси дитячі Viva з декором",
    vendor_code: "---",
    color: "чорний",
    purchase_price: 36.48,
    price: 80,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/К50_leggins_viva.jpg"],
    sizes: "116-122, 128-134",
    stock: 3
  },
  {
    id: 77,
    product_code: "K51",
    name: "Дитячі легінси Gatta, яскраві кольори",
    vendor_code: "---",
    color: "фіолетовий, рожевий",
    purchase_price: 16.58,
    price: 40,
    photo: [],
    sizes: "92-98, 128-134, 152-158",
    stock: 5
  },
  {
    id: 78,
    product_code: "К52",
    name: "Колготки Elizabeth 40DEN Classic, Чорні",
    vendor_code: "#EL40CL",
    color: "чорний",
    purchase_price: 14.6,
    price: 35,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/K54.jpg"],
    sizes: "р.4, р.5, р.6",
    stock: 4
  },
  {
    id: 79,
    product_code: "К54",
    name: "Колготки Elizabeth 40DEN T-BAND, Чорні",
    vendor_code: "#EL40TB",
    color: "чорний",
    purchase_price: 15.6,
    price: 35,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/K54.jpg"],
    sizes: "р.5",
    stock: 3
  },
  {
    id: 80,
    product_code: "К56",
    name: "Колготки Elizabeth 40DEN BIKINI CHARM, Бежеві",
    vendor_code: "#EL40BC",
    color: "бежевий",
    purchase_price: 16.6,
    price: 35,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/K56.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/K56_2.jpg"],
    sizes: "р.2, р.3, р.4",
    stock: 7
  },
  {
    id: 81,
    product_code: "К53",
    name: "Колготки Elizabeth 40DEN HIPSTER WAIST, Бежеві",
    vendor_code: "#EL40HW",
    color: "бежевий",
    purchase_price: 14.6,
    price: 35,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/K56.jpg"],
    sizes: "р.2, р.3, р.4",
    stock: 6
  },
  {
    id: 82,
    product_code: "К58",
    name: "Колготки Руслана 30DEN, Чорні, 52-56 розмір",
    vendor_code: "#K305",
    color: "чорний",
    purchase_price: 10.4,
    price: 23,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/K58.png"],
    sizes: "52-56",
    stock: 4
  },
  {
    id: 83,
    product_code: "К60",
    name: "Колготки Elizabeth 80DEN MICROFIBRE, Бежеві",
    vendor_code: "#EL80MF",
    color: "бежевий",
    purchase_price: 26.5,
    price: 48,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/K60.jpg"],
    sizes: "р.4, р.5",
    stock: 5
  },
  {
    id: 84,
    product_code: "K61",
    name: "Гамаші під джинс на хутрі р.46-50",
    vendor_code: "#A428",
    color: "джинс",
    purchase_price: 85.8,
    price: 190,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/jeggings/К61.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/jeggings/К61_1.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/jeggings/К61_2.jpg"],
    sizes: "р.46-50",
    stock: 3
  },
  {
    id: 85,
    product_code: "K64",
    name: "Модні джегінси р.46-54",
    vendor_code: "#A421",
    color: "джинс",
    purchase_price: 61.9,
    price: 170,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/jeggings/К64.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/jeggings/К64_1.png", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/jeggings/К64_2.jpg"],
    sizes: "р.46-54",
    stock: 5
  },
  {
    id: 86,
    product_code: "K65",
    name: "Гамаші під джинс \"Махра зі стразами\" р.48-52",
    vendor_code: "#A431-1",
    color: "джинс",
    purchase_price: 92.8,
    price: 200,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/jeggings/К65.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/jeggings/К65_1.jpg"],
    sizes: "р.48-52",
    stock: 4
  },
  {
    id: 87,
    product_code: "K66",
    name: "Круті гамаші під джинс \"Махра\" р.46-50",
    vendor_code: "#A431",
    color: "джинс",
    purchase_price: 92.8,
    price: 200,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/jeggings/К66_0.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/jeggings/К66_1.jpg"],
    sizes: "р.46-50",
    stock: 3
  },
  {
    id: 88,
    product_code: "K67",
    name: "Жіночі гамаші під джинс \"Махра\"",
    vendor_code: "#A424",
    color: "джинс",
    purchase_price: 82.2,
    price: 190,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/jeggings/К67.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/jeggings/К67_1.jpg"],
    sizes: "універсальний",
    stock: 3
  },
  {
    id: 89,
    product_code: "К71",
    name: "Колготки Elizabeth Prestige 40 den Classic, Капучіно",
    vendor_code: "#00316",
    color: "капучино",
    purchase_price: 26.9,
    price: 50,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/K71.jpg"],
    sizes: "р.3, р.4, р.5",
    stock: 3
  },
  {
    id: 90,
    product_code: "К72",
    name: "Колготки Elizabeth Prestige 40 den Classic, Бежеві",
    vendor_code: "#00316",
    color: "бежевий",
    purchase_price: 26.9,
    price: 50,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/K72.jpg"],
    sizes: "р.4",
    stock: 3
  },
  {
    id: 91,
    product_code: "K75",
    name: "Джегінси з кишенями. Код: К75.",
    vendor_code: "#SL30964",
    color: "синій, чорний",
    purchase_price: 175,
    price: 370,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/jeggings/K75.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/jeggings/K75_2.jpg"],
    sizes: "S/M, M/L",
    stock: 6
  },
  {
    id: 92,
    product_code: "K78",
    name: "Штани жіночі з кишенями бамбук",
    vendor_code: "#NA467-3",
    color: "синій, чорний",
    purchase_price: 119.9,
    price: 230,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/jeggings/K78.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/jeggings/K78_2.jpg"],
    sizes: "S/M",
    stock: 3
  },
  {
    id: 93,
    product_code: "K79",
    name: "Безшовні джегінси великих розмірів 50-58",
    vendor_code: "#LG1947",
    color: "джинс",
    purchase_price: 77.8,
    price: 180,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/jeggings/K79.jpg"],
    sizes: "р.50-58",
    stock: 4
  },
  {
    id: 94,
    product_code: "K80",
    name: "Джеггінси зі стразами, р.46-52",
    vendor_code: "#LG26",
    color: "джинс",
    purchase_price: 62,
    price: 180,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/jeggings/K80.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/jeggings/K80_2.jpg"],
    sizes: "р.46-52",
    stock: 5
  },
  {
    id: 95,
    product_code: "K81",
    name: "Безшовні джегінси в горошок з простроченням",
    vendor_code: "#LG1960",
    color: "джинс",
    purchase_price: 83.5,
    price: 190,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/jeggings/K81.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/jeggings/K81_2.jpg"],
    sizes: "р.46-52",
    stock: 3
  },
  {
    id: 96,
    product_code: "K82",
    name: "Безшовні лосини під джинс із рядком",
    vendor_code: "#LG909",
    color: "синій, чорний",
    purchase_price: 63.7,
    price: 190,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/jeggings/K82.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/jeggings/K82_2.jpg"],
    sizes: "р.44-50",
    stock: 6
  },
  {
    id: 97,
    product_code: "K83",
    name: "Безшовні однотонні лосини, широкий пояс",
    vendor_code: "#LG726",
    color: "синій, чорний",
    purchase_price: 58.8,
    price: 170,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/jeggings/K83.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/jeggings/K83_2.jpg"],
    sizes: "р.46-52",
    stock: 4
  },
  {
    id: 98,
    product_code: "K84",
    name: "Жіночі джинси 98% бавовна",
    vendor_code: "#G302-61159",
    color: "чорний",
    purchase_price: 68.2,
    price: 170,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/jeggings/K84.jpg", "https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/jeggings/K84_2.jpg"],
    sizes: "р.40-48",
    stock: 4
  },
  {
    id: 99,
    product_code: "К85",
    name: "Жіночі панчохи \"Für DICH\" (15 den)",
    vendor_code: "---",
    color: "чорний, бежевий",
    purchase_price: 53,
    price: 110,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/K85.jpg"],
    sizes: "р.1/2, р.3/4",
    stock: 5
  },
  {
    id: 100,
    product_code: "К86",
    name: "Упаковка (2 пари) шовковистих шкарпеток з лайкрою \"Інтуїція\"",
    vendor_code: "---",
    color: "бежевий",
    purchase_price: 19.2,
    price: 40,
    photo: ["https://cdn.jsdelivr.net/gh/85rmch/lastivka-photo@main/tights_socks/K86.jpg"],
    sizes: "універсальний",
    stock: 3
  }
];

export function isProductInCategory(product: { name: string; product_code: string; category?: string; photo?: string[]; vendor_code?: string; description?: string }, categoryKey: string): boolean {
  if (!categoryKey || categoryKey === 'all') return true;
  if (categoryKey === 'new') return true;

  const catLower = (product.category || '').toLowerCase();
  const nameLower = (product.name || '').toLowerCase();
  const codeLower = (product.product_code || '').toLowerCase();
  const vendorLower = (product.vendor_code || '').toLowerCase();
  const photoPathsJoined = Array.isArray(product.photo) ? product.photo.join(' ').toLowerCase() : '';
  const firstLetter = product.product_code ? product.product_code.trim().charAt(0).toUpperCase() : '';

  // Direct category string match from DB
  if (catLower === categoryKey.toLowerCase()) return true;

  // Negative checks to prevent cross-category false positives
  const isLegwearOrSocks = nameLower.includes('колготки') || nameLower.includes('шкарпетки') || nameLower.includes('панчохи') || nameLower.includes('гольфи') || nameLower.includes('гамаші') || nameLower.includes('джегінси') || nameLower.includes('джеггінси') || nameLower.includes('лосини') || nameLower.includes('легінси') || nameLower.includes('джинси');
  const isThermal = nameLower.includes('термо') || nameLower.includes('термобілиз');
  const isToyOrGame = nameLower.includes('гра ') || nameLower.includes('настільна гра') || nameLower.includes('вібратор') || nameLower.includes('ділдо') || nameLower.includes('мастурбатор') || nameLower.includes('лубрикант') || nameLower.includes('смазка');
  const isSwim = nameLower.includes('купальник') || codeLower.startsWith('ку') || codeLower.startsWith('ky') || codeLower.startsWith('kу');

  switch (categoryKey) {
    case 'bras':
      if (catLower === 'bras' || catLower === 'bra' || catLower === 'бюстгальтеры' || catLower === 'бюстгальтери') return true;
      if (isLegwearOrSocks || isThermal || isToyOrGame || isSwim) return false;
      if (photoPathsJoined.includes('bras_bralets') || photoPathsJoined.includes('%20-%20bras_bralets')) return true;
      if (nameLower.includes('бюст') || nameLower.includes('бюстик') || nameLower.includes('ліф') || nameLower.includes('лиф') || nameLower.includes('бралет') || nameLower.includes('бралетт') || (nameLower.includes('топ') && !nameLower.includes('піжам') && !nameLower.includes('пижам'))) return true;
      if ((firstLetter === 'Б' || firstLetter === 'B') && !nameLower.includes('боді')) return true;
      return false;

    case 'panties':
      if (catLower === 'panties' || catLower === 'трусики' || catLower === 'трусы') return true;
      if (isLegwearOrSocks || isThermal || isToyOrGame) return false;
      if (photoPathsJoined.includes('panties') || photoPathsJoined.includes('%20-%20panties')) return true;
      if (nameLower.includes('трусики') || nameLower.includes('труси') || nameLower.includes('стрінги') || nameLower.includes('стринги') || nameLower.includes('бразиліани') || nameLower.includes('бразилианы') || nameLower.includes('шортики') || nameLower.includes('сліпи') || nameLower.includes('слипы') || nameLower.includes('танга') || nameLower.includes('панталони') || nameLower.includes('боксери') || nameLower.includes('сімейні') || nameLower.includes('семейные')) return true;
      if ((firstLetter === 'Т' || firstLetter === 'T') && !nameLower.includes('топ') && !nameLower.includes('термо')) return true;
      return false;

    case 'home':
    case 'pajamas':
      if (catLower === 'home' || catLower === 'pajamas' || catLower === 'одежда для дома' || catLower === 'одяг для дому' || catLower === 'пижамы') return true;
      if (isThermal || isLegwearOrSocks || isToyOrGame || isSwim) return false;
      if (photoPathsJoined.includes('pajamas') || photoPathsJoined.includes('%20-%20pajamas') || photoPathsJoined.includes('shubki') || photoPathsJoined.includes('%20-%20shubki')) return true;
      if (nameLower.includes('піжама') || nameLower.includes('пижама') || nameLower.includes('халат') || nameLower.includes('сороч') || nameLower.includes('ніч') || nameLower.includes('дому') || (nameLower.includes('костюм') && !nameLower.includes('ігровий') && !nameLower.includes('еротич'))) return true;
      return false;

    case 'swimwear':
      if (catLower === 'swimwear' || catLower === 'swim' || catLower === 'купальники') return true;
      if (isLegwearOrSocks || isThermal || isToyOrGame) return false;
      if (nameLower.includes('купальник') || (nameLower.includes('плавки') && (nameLower.includes('дитяч') || nameLower.includes('чоловіч') || nameLower.includes('жіноч') || nameLower.includes('пляжн')))) return true;
      if (codeLower.startsWith('ку') || codeLower.startsWith('ky') || codeLower.startsWith('kу')) return true;
      return false;

    case 'sets':
      if (catLower === 'sets' || catLower === 'комплекты' || catLower === 'комплекти') return true;
      if (isThermal || isSwim || isToyOrGame || isLegwearOrSocks) return false;
      if (photoPathsJoined.includes('sets') || photoPathsJoined.includes('%20-%20sets')) return true;
      if ((nameLower.includes('комплект') || nameLower.includes('набір') || nameLower.includes('набор')) && !nameLower.includes('еротичн') && !nameLower.includes('сексуальн') && !nameLower.includes('ігровий')) return true;
      return false;

    case 'thermals':
      if (catLower === 'thermals' || catLower === 'thermal' || catLower === 'термобелье' || catLower === 'термобілизна') return true;
      if (isThermal) return true;
      return false;

    case 'erotic':
      if (catLower === 'erotic' || catLower === 'эротическое' || catLower === 'еротична') return true;
      if (isToyOrGame || isThermal) return false;
      if (photoPathsJoined.includes('erotic') || photoPathsJoined.includes('%20-%20erotic') || photoPathsJoined.includes('lingerie') || photoPathsJoined.includes('%20-%20lingerie')) return true;
      if (nameLower.includes('еротичн') || nameLower.includes('еротика') || nameLower.includes('сексуальн') || nameLower.includes('сексі') || nameLower.includes('боді') || nameLower.includes('игровой') || nameLower.includes('ігровий') || nameLower.includes('корсет') || nameLower.includes('пестіси') || nameLower.includes('пестисы') || nameLower.includes('пеньюар')) return true;
      return false;

    case 'toys_accessories':
    case 'games':
      if (catLower === 'toys_accessories' || catLower === 'games' || catLower === 'игрушки' || catLower === 'іграшки') return true;
      if (isToyOrGame || photoPathsJoined.includes('game') || photoPathsJoined.includes('toy') || photoPathsJoined.includes('accessory')) return true;
      if (nameLower.includes('іграшки') || nameLower.includes('аксесуари') || nameLower.includes('маска') || nameLower.includes('стреп') || nameLower.includes('бретель') || nameLower.includes('подовжувач') || nameLower.includes('контейнер') || nameLower.includes('наручники') || nameLower.includes('кляп') || nameLower.includes('бандаж') || nameLower.includes('пестіси') || nameLower.includes('затискачі') || nameLower.includes('bdsm') || nameLower.includes('бдсм')) return true;
      return false;

    case 'socks':
      if (catLower === 'socks' || catLower === 'носки' || catLower === 'шкарпетки') return true;
      if (nameLower.includes('шкарпетки') || nameLower.includes('гольфи') || nameLower.includes('колготки') || nameLower.includes('панчохи')) return true;
      return false;

    case 'jeggings':
      if (catLower === 'jeggings' || catLower === 'лосины' || catLower === 'легінси') return true;
      if (nameLower.includes('гамаші') || nameLower.includes('джегінси') || nameLower.includes('джеггінси') || nameLower.includes('штани') || nameLower.includes('лосини') || nameLower.includes('легінси') || nameLower.includes('джинси')) return true;
      return false;

    default:
      return catLower === categoryKey.toLowerCase();
  }
}

export function getProductCategory(p: { name: string; product_code: string; category?: string; photo?: string[]; vendor_code?: string; description?: string }): CategoryKey {
  if (p.category && p.category !== 'all' && p.category !== 'other') {
    return p.category as CategoryKey;
  }
  if (isProductInCategory(p, 'toys_accessories')) return 'toys_accessories';
  if (isProductInCategory(p, 'erotic')) return 'erotic';
  if (isProductInCategory(p, 'home')) return 'home';
  if (isProductInCategory(p, 'thermals')) return 'thermals';
  if (isProductInCategory(p, 'swimwear')) return 'swimwear';
  if (isProductInCategory(p, 'sets')) return 'sets';
  if (isProductInCategory(p, 'bras')) return 'bras';
  if (isProductInCategory(p, 'panties')) return 'panties';
  if (isProductInCategory(p, 'socks')) return 'socks';
  if (isProductInCategory(p, 'jeggings')) return 'jeggings';
  return 'other';
}

export const PRODUCTS: Product[] = RAW_PRODUCTS_DATA.map(p => ({
  ...p,
  category: getProductCategory(p)
}));

// Helper to trim whitespace, quotes (single, double), backslashes, and brackets from URL strings
export function cleanImageUrl(src?: string): string {
  if (!src) return '';
  let cleaned = src.trim().replace(/^["'\\\[\s]+|["'\\\]\s]+$/g, '').trim();

  // If it is a base64 Data URL, return directly without URI encoding
  if (cleaned.startsWith('data:')) {
    return cleaned;
  }
  
  // Convert raw.githubusercontent.com URLs to jsDelivr CDN URLs for faster loading and high availability
  cleaned = cleaned.replace(
    /https?:\/\/raw\.githubusercontent\.com\/([^\/]+)\/([^\/]+)\/([^\/]+)\/(.+)/g,
    'https://cdn.jsdelivr.net/gh/$1/$2@$3/$4'
  );

  // Replace old repository owner / repo name with current GitHub repository
  cleaned = cleaned.replace(/Richy5959\/lastochka_phono/g, '85rmch/lastivka-photo');
  cleaned = cleaned.replace(/Richy5959\/lastochka_photo/g, '85rmch/lastivka-photo');

  // Fix catalog_photos/data path issue (since 85rmch/lastivka-photo has folders directly at root)
  cleaned = cleaned.replace('85rmch/lastivka-photo@main/catalog_photos/data/', '85rmch/lastivka-photo@main/');
  cleaned = cleaned.replace('85rmch/lastivka-photo/catalog_photos/data/', '85rmch/lastivka-photo/');
  cleaned = cleaned.replace('/catalog_photos/data/', '/');

  // Normalize and fix GitHub repository folder names which have spaces on GitHub
  cleaned = cleaned
    .replace(/\/(1-sets|1 - sets|1%20-%20sets)\//g, '/1%20-%20sets/')
    .replace(/\/(2-bras_bralets|2 - bras_bralets|2%20-%20bras_bralets)\//g, '/2%20-%20bras_bralets/')
    .replace(/\/(3-panties|3 - panties|3%20-%20panties)\//g, '/3%20-%20panties/')
    .replace(/\/(4-pajamas|4 - pajamas|4%20-%20pajamas)\//g, '/4%20-%20pajamas/')
    .replace(/\/(5-swim|5 - swim|5%20-%20swim)\//g, '/5%20-%20swim/')
    .replace(/\/(6-erotic|6 - erotic|6%20-%20erotic)\//g, '/6%20-%20erotic/')
    .replace(/\/(8-shubki|8 - shubki|8%20-%20shubki)\//g, '/8%20-%20shubki/')
    .replace(/\/(9-lingerie|9 - lingerie|9%20-%20lingerie)\//g, '/9%20-%20lingerie/')
    .replace(/\/(10-chulki|10 - chulki|10%20-%20chulki)\//g, '/10%20-%20chulki/');

  try {
    cleaned = encodeURI(decodeURI(cleaned));
  } catch {
    cleaned = encodeURI(cleaned);
  }

  return cleaned;
}

// Client-side image compression to ensure uploaded/edited product photos are lightweight & display perfectly on all devices
export async function compressImageFile(file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(e.target?.result as string || '');
        }
      };
      img.onerror = () => resolve(e.target?.result as string || '');
      img.src = e.target?.result as string || '';
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

// Helper to check if a string is a valid image source (absolute, relative, or data URL)
function isValidImageSrc(src?: string): boolean {
  if (!src) return false;
  const clean = cleanImageUrl(src);
  return clean.startsWith('http') || clean.startsWith('/') || clean.startsWith('data:') || clean.startsWith('.');
}

// Placeholder generation for missing photos
export function getProductImage(product: Product, index = 0): string {
  return getCleanImage(product, index);
}

export function getCleanImage(product: Product, index: number = 0): string {
  if (product && Array.isArray(product.photo) && product.photo.length > 0) {
    const rawUrl = product.photo[index] || product.photo[0];
    if (rawUrl && typeof rawUrl === 'string') {
      const cleaned = cleanImageUrl(rawUrl);
      if (isValidImageSrc(cleaned)) {
        return cleaned;
      }
    }
  }
  
  // High quality Unsplash placeholder matching the category
  const unsplashCategories: Record<string, string[]> = {
    pajamas: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=600&auto=format&fit=crop'
    ],
    underwear: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=600&auto=format&fit=crop'
    ],
    panties: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop'
    ],
    thermals: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop'
    ],
    socks: [
      'https://images.unsplash.com/photo-1582966772680-860e372bb558?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=600&auto=format&fit=crop'
    ],
    jeggings: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop'
    ],
    games: [
      'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1585504198199-20277593b94f?q=80&w=600&auto=format&fit=crop'
    ],
    other: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop'
    ]
  };
  
  const categoryKey = product?.category ? String(product.category).toLowerCase() : 'other';
  const list = unsplashCategories[categoryKey] || unsplashCategories.underwear || unsplashCategories.other;
  return list[Math.abs(index) % list.length];
}

export interface ColorOption {
  ua: string;
  ru: string;
  keys: string[];
}

export const OFFICIAL_COLORS: ColorOption[] = [
  { ua: 'Червоно-бежевий', ru: 'Красно-бежевый', keys: ['червоно-бежевий', 'красно-бежевый', 'красно бежевый'] },
  { ua: 'Чорно-бежевий', ru: 'Черно-бежевый', keys: ['чорно-бежевий', 'черно-бежевый', 'черно бежевый'] },
  { ua: 'Леопард', ru: 'Леопард', keys: ['леопард', 'леопардовый', 'леопардовий'] },
  { ua: 'Пудра', ru: 'Пудра', keys: ['пудра', 'пудровый', 'пудровий'] },
  { ua: 'Сливовий', ru: 'Сливовый', keys: ['сливовий', 'сливовый', 'слива'] },
  { ua: 'Фіолетовий', ru: 'Фиолетовый', keys: ['фіолетивний', 'фіолетовий', 'фиолетовый', 'фиолет'] },
  { ua: 'Бузковий', ru: 'Сиреневый', keys: ['бузковий', 'сиреневый', 'сирень'] },
  { ua: 'Синій', ru: 'Синий', keys: ['синій', 'синий', 'синяя', 'синее'] },
  { ua: 'Світло-сірий', ru: 'Светло-серый', keys: ['світло-сірий', 'светло-серый', 'светло серый'] },
  { ua: 'Темно-сірий', ru: 'Темно-серый', keys: ['темно-сірий', 'темно-серый', 'темно серый', 'графіт', 'графит'] },
  { ua: 'Бежевий', ru: 'Бежевый', keys: ['бежевий', 'бежевый', 'беж', 'тілесний', 'телесный'] },
  { ua: 'Мікс кольорів', ru: 'Микс цветов', keys: ['мікс кольорів', 'микс цветов', 'мікс', 'микс', 'різні кольори', 'разные цвета', 'разноцветный'] },
  { ua: 'Бірюзовий', ru: 'Бирюзовый', keys: ['бірюзовий', 'бирюзовый', 'бирюза'] },
  { ua: 'Бордо', ru: 'Бордо', keys: ['бордо', 'бордовый', 'бордовий'] },
  { ua: 'Блакитний', ru: 'Голубой', keys: ['блакитний', 'голубой', 'голубая'] },
  { ua: 'Гірчичний', ru: 'Горчичный', keys: ['гірчичний', 'горчичный', 'горчица'] },
  { ua: 'Жовтий', ru: 'Желтый', keys: ['жовтий', 'желтый', 'жёлтый'] },
  { ua: 'Зелений', ru: 'Зеленый', keys: ['зелений', 'зеленый', 'зелёный', 'хаки', 'хакі'] },
  { ua: 'Кораловий', ru: 'Коралловый', keys: ['кораловий', 'коралл', 'коралловый'] },
  { ua: 'Коричневий', ru: 'Коричневый', keys: ['коричневий', 'коричневый', 'шоколад'] },
  { ua: 'Червоний', ru: 'Красный', keys: ['червоний', 'красный', 'красная'] },
  { ua: 'Малиновий', ru: 'Малиновый', keys: ['малиновий', 'малиновый', 'малина'] },
  { ua: 'Молочний', ru: 'Молочный', keys: ['молочний', 'молочный', 'молоко'] },
  { ua: 'Памаранчевий', ru: 'Оранжевый', keys: ['памаранчевий', 'помаранчевий', 'оранжевый', 'оранж'] },
  { ua: 'Рожевий', ru: 'Розовый', keys: ['рожевий', 'розовый', 'розовая'] },
  { ua: 'Срібний', ru: 'Серебряный', keys: ['срібний', 'серебряный', 'серебро'] },
  { ua: 'Золотий', ru: 'Золотой', keys: ['золотий', 'золотой', 'золото'] },
  { ua: 'Чорний', ru: 'Черный', keys: ['чорний', 'черный', 'чёрный', 'черная'] },
  { ua: 'Білий', ru: 'Белый', keys: ['білий', 'белый', 'белая'] },
  { ua: 'Салатовий', ru: 'Салатовый', keys: ['салатовий', 'салатовый'] },
  { ua: 'Капучіно', ru: 'Капучино', keys: ['капучіно', 'капучино'] },
  { ua: 'Мокка', ru: 'Мокка', keys: ['мокка', 'мокко'] },
  { ua: 'Персиковий', ru: 'Персиковый', keys: ['персиковий', 'персиковый', 'персик'] },
  { ua: 'Марсал', ru: 'Марсала', keys: ['марсал', 'марсала'] },
  { ua: 'Коричнево-бежевий', ru: 'Коричнево-бежевый', keys: ['коричнево-бежевий', 'коричнево-бежевый', 'коричнево бежевый'] },
  { ua: 'Чорно-білий', ru: 'Черно-белый', keys: ['чорно-білий', 'черно-белый', 'черно белый'] },
  { ua: 'Фуксія', ru: 'Фуксия', keys: ['фуксія', 'фуксия'] },
  { ua: 'Молочно-бежевий', ru: 'Молочно-бежевый', keys: ['молочно-бежевий', 'молочно-бежевый', 'молочно бежевый'] },
  { ua: 'Оливковий', ru: 'Оливковый', keys: ['оливковий', 'оливковый', 'олива'] },
  { ua: 'Камуфляж', ru: 'Камуфляж', keys: ['камуфляж', 'камуфляжный'] },
];

export function matchProductColor(productColorStr: string | undefined | null, selectedColorVal: string): boolean {
  if (!selectedColorVal || selectedColorVal === 'all') return true;
  if (!productColorStr) return false;
  
  const targetLower = selectedColorVal.toLowerCase();
  const prodLower = productColorStr.toLowerCase();

  const matchedConfig = OFFICIAL_COLORS.find(
    c => c.ua.toLowerCase() === targetLower || c.ru.toLowerCase() === targetLower
  );

  if (matchedConfig) {
    return matchedConfig.keys.some(k => prodLower.includes(k)) || prodLower.includes(matchedConfig.ua.toLowerCase()) || prodLower.includes(matchedConfig.ru.toLowerCase());
  }

  return prodLower.includes(targetLower);
}

