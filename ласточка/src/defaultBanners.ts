import { Banner } from './types';
import LingerieHeroImg from './assets/images/lingerie_hero_1786439566796.jpg';
import PajamasHeroImg from './assets/images/pajamas_hero_1786439580625.jpg';
import StockingsGroupHeroImg from './assets/images/stockings_group_hero_1786439594045.jpg';

export const DEFAULT_BANNERS: Banner[] = [
  {
    id: 'banner_1',
    image: LingerieHeroImg,
    titleRu: "Новая Коллекция Белья",
    titleUa: "Нова Колекція Білизни",
    subtitleRu: "Изысканное кружево и премиальное качество комплектов WeiyeSi",
    subtitleUa: "Вишукане мереживо та преміальна якість комплектів WeiyeSi",
    accentText: "WeiyeSi Premium",
    linkCategory: "bras"
  },
  {
    id: 'banner_2',
    image: PajamasHeroImg,
    titleRu: "Пижамы и Одежда для Дома",
    titleUa: "Піжами та Одяг для Дому",
    subtitleRu: "Уютные, мягкие махровые комплекты и нежный шелк",
    subtitleUa: "Затишні, м'які махрові комплекти та ніжний шовк",
    accentText: "Lastochka Home",
    linkCategory: "home"
  },
  {
    id: 'banner_3',
    image: StockingsGroupHeroImg,
    titleRu: "Колготки, Чулки и Носочки",
    titleUa: "Колготки, Панчохи та Шкарпетки",
    subtitleRu: "Широкий выбор итальянских брендов и фантазийных узоров",
    subtitleUa: "Широкий вибір італійських брендів та фантазійних візерунків",
    accentText: "Gatta & Gabriella",
    linkCategory: "socks"
  }
];
