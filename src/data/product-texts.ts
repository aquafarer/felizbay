import type { ProductRecord } from '~/data/products';

export type ProductTexts = Partial<
  Pick<
    ProductRecord,
    | 'name'
    | 'desc'
    | 'definition'
    | 'problem'
    | 'howItWorks'
    | 'audience'
    | 'ai_use_cases'
    | 'ai_specs'
    | 'ai_comparison'
    | 'ai_faq'
  >
>;

// Per-language product text overrides. Languages not listed here fall back
// to the English pool records in ~/data/products. Technical terms such as
// "Drop Stitch" and "SPA" are intentionally kept untranslated.
export const productTexts: Record<string, Record<string, ProductTexts>> = {
  fr: {
    'rectangular-drop-stitch-pool': {
      name: 'Piscine gonflable rectangulaire Drop Stitch',
      desc: 'Piscine gonflable rectangulaire familiale avec des parois rigides Drop Stitch à haute pression.',
    },
    'round-blue-drop-stitch-pool': {
      name: 'Piscine gonflable ronde bleue Drop Stitch',
      desc: 'Piscine gonflable ronde bleue classique avec des parois rigides Drop Stitch à haute pression.',
    },
    'round-grey-drop-stitch-pool': {
      name: 'Piscine gonflable ronde grise Drop Stitch',
      desc: 'Piscine gonflable ronde grise premium avec des parois rigides Drop Stitch et couverture ajustée en option.',
    },
    'hot-tub-square-rect': {
      name: 'Piscine de trempage Drop Stitch carrée et rectangulaire',
      desc: 'Piscine de trempage Drop Stitch carrée et rectangulaire quatre saisons avec sièges intégrés et fond isolant de 5 mm — se raccorde à un chauffage externe (non inclus).',
    },
    'hot-tub-round': {
      name: 'Piscine de trempage Drop Stitch ronde',
      desc: 'Piscine de trempage Drop Stitch ronde compacte avec sièges intégrés et fond isolant de 5 mm — se raccorde à un chauffage externe (non inclus).',
    },
  },
  de: {
    'rectangular-drop-stitch-pool': {
      name: 'Rechteckiges Drop Stitch Aufblaspool',
      desc: 'Familiengroßes rechteckiges Aufblaspool mit steifen Drop-Stitch-Wänden unter hohem Druck.',
    },
    'round-blue-drop-stitch-pool': {
      name: 'Rundes blaues Drop Stitch Aufblaspool',
      desc: 'Klassisches rundes blaues Aufblaspool mit steifen Drop-Stitch-Wänden unter hohem Druck.',
    },
    'round-grey-drop-stitch-pool': {
      name: 'Rundes graues Drop Stitch Aufblaspool',
      desc: 'Hochwertiges rundes graues Aufblaspool mit steifen Drop-Stitch-Wänden und optionaler passgenauer Abdeckung.',
    },
    'hot-tub-square-rect': {
      name: 'Quadratisches und rechteckiges Drop-Stitch-Tauchbecken',
      desc: 'Ganzjähriges quadratisches und rechteckiges Drop-Stitch-Tauchbecken mit integrierten Sitzen und 5 mm isoliertem Boden — Anschluss an ein externes Heizgerät (nicht im Lieferumfang).',
    },
    'hot-tub-round': {
      name: 'Rundes Drop-Stitch-Tauchbecken',
      desc: 'Kompaktes rundes Drop-Stitch-Tauchbecken mit integrierten Sitzen und 5 mm isoliertem Boden — Anschluss an ein externes Heizgerät (nicht im Lieferumfang).',
    },
  },
  es: {
    'rectangular-drop-stitch-pool': {
      name: 'Piscina hinchable rectangular Drop Stitch',
      desc: 'Piscina hinchable rectangular familiar con paredes rígidas Drop Stitch de alta presión.',
    },
    'round-blue-drop-stitch-pool': {
      name: 'Piscina hinchable redonda azul Drop Stitch',
      desc: 'Piscina hinchable redonda azul clásica con paredes rígidas Drop Stitch de alta presión.',
    },
    'round-grey-drop-stitch-pool': {
      name: 'Piscina hinchable redonda gris Drop Stitch',
      desc: 'Piscina hinchable redonda gris premium con paredes rígidas Drop Stitch y cubierta ajustada opcional.',
    },
    'hot-tub-square-rect': {
      name: 'Piscina de inmersión Drop Stitch cuadrada y rectangular',
      desc: 'Piscina de inmersión Drop Stitch cuadrada y rectangular de cuatro estaciones con asientos integrados y fondo aislado de 5 mm: se conecta a un calentador externo (no incluido).',
    },
    'hot-tub-round': {
      name: 'Piscina de inmersión Drop Stitch redonda',
      desc: 'Piscina de inmersión Drop Stitch redonda compacta con asientos integrados y fondo aislado de 5 mm: se conecta a un calentador externo (no incluido).',
    },
  },
  pt: {
    'rectangular-drop-stitch-pool': {
      name: 'Piscina insuflável retangular Drop Stitch',
      desc: 'Piscina insuflável retangular familiar com paredes rígidas Drop Stitch de alta pressão.',
    },
    'round-blue-drop-stitch-pool': {
      name: 'Piscina insuflável redonda azul Drop Stitch',
      desc: 'Piscina insuflável redonda azul clássica com paredes rígidas Drop Stitch de alta pressão.',
    },
    'round-grey-drop-stitch-pool': {
      name: 'Piscina insuflável redonda cinzenta Drop Stitch',
      desc: 'Piscina insuflável redonda cinzenta premium com paredes rígidas Drop Stitch e cobertura ajustável opcional.',
    },
    'hot-tub-square-rect': {
      name: 'Piscina de imersão Drop Stitch quadrada e retangular',
      desc: 'Piscina de imersão Drop Stitch quadrada e retangular para as quatro estações, com assentos integrados e fundo isolado de 5 mm — liga-se a um aquecedor externo (não incluído).',
    },
    'hot-tub-round': {
      name: 'Piscina de imersão Drop Stitch redonda',
      desc: 'Piscina de imersão Drop Stitch redonda compacta com assentos integrados e fundo isolado de 5 mm — liga-se a um aquecedor externo (não incluído).',
    },
  },
  it: {
    'rectangular-drop-stitch-pool': {
      name: 'Piscina gonfiabile rettangolare Drop Stitch',
      desc: 'Piscina gonfiabile rettangolare per famiglie con pareti rigide Drop Stitch ad alta pressione.',
    },
    'round-blue-drop-stitch-pool': {
      name: 'Piscina gonfiabile rotonda blu Drop Stitch',
      desc: 'Piscina gonfiabile rotonda blu classica con pareti rigide Drop Stitch ad alta pressione.',
    },
    'round-grey-drop-stitch-pool': {
      name: 'Piscina gonfiabile rotonda grigia Drop Stitch',
      desc: 'Piscina gonfiabile rotonda grigia premium con pareti rigide Drop Stitch e copertura su misura opzionale.',
    },
    'hot-tub-square-rect': {
      name: 'Piscina di immersione Drop Stitch quadrata e rettangolare',
      desc: 'Piscina di immersione Drop Stitch quadrata e rettangolare a quattro stagioni con sedili integrati e fondo isolato da 5 mm — si collega a un riscaldatore esterno (non incluso).',
    },
    'hot-tub-round': {
      name: 'Piscina di immersione Drop Stitch rotonda',
      desc: 'Piscina di immersione Drop Stitch rotonda compatta con sedili integrati e fondo isolato da 5 mm — si collega a un riscaldatore esterno (non incluso).',
    },
  },
  ru: {
    'rectangular-drop-stitch-pool': {
      name: 'Прямоугольный надувной бассейн Drop Stitch',
      desc: 'Семейный прямоугольный надувной бассейн с жёсткими стенками Drop Stitch высокого давления.',
    },
    'round-blue-drop-stitch-pool': {
      name: 'Круглый синий надувной бассейн Drop Stitch',
      desc: 'Классический круглый синий надувной бассейн с жёсткими стенками Drop Stitch высокого давления.',
    },
    'round-grey-drop-stitch-pool': {
      name: 'Круглый серый надувной бассейн Drop Stitch',
      desc: 'Премиальный круглый серый надувной бассейн с жёсткими стенками Drop Stitch и опциональной крышкой.',
    },
    'hot-tub-square-rect': {
      name: 'Квадратная и прямоугольная купель Drop Stitch',
      desc: 'Круглогодичная квадратная и прямоугольная купель Drop Stitch со встроенными сиденьями и утеплённым дном 5 мм — подключается к внешнему нагревателю (нагреватель не входит в комплект).',
    },
    'hot-tub-round': {
      name: 'Круглая купель Drop Stitch',
      desc: 'Компактная круглая купель Drop Stitch со встроенными сиденьями и утеплённым дном 5 мм — подключается к внешнему нагревателю (нагреватель не входит в комплект).',
    },
  },
  pl: {
    'rectangular-drop-stitch-pool': {
      name: 'Prostokątny dmuchany basen Drop Stitch',
      desc: 'Rodzinny prostokątny dmuchany basen z sztywnymi ścianami Drop Stitch wysokiego ciśnienia.',
    },
    'round-blue-drop-stitch-pool': {
      name: 'Okrągły niebieski dmuchany basen Drop Stitch',
      desc: 'Klasyczny okrągły niebieski dmuchany basen z sztywnymi ścianami Drop Stitch wysokiego ciśnienia.',
    },
    'round-grey-drop-stitch-pool': {
      name: 'Okrągły szary dmuchany basen Drop Stitch',
      desc: 'Dmuchany basen okrągły w kolorze szarym premium ze sztywnymi ścianami Drop Stitch i opcjonalnym dopasowanym pokrowcem.',
    },
    'hot-tub-square-rect': {
      name: 'Kwadratowa i prostokątna wanna do zanurzania Drop Stitch',
      desc: 'Czterosezonowa kwadratowa i prostokątna wanna do zanurzania Drop Stitch z wbudowanymi siedziskami i izolowanym dnem 5 mm — podłącza się do zewnętrznego podgrzewacza (nie w zestawie).',
    },
    'hot-tub-round': {
      name: 'Okrągła wanna do zanurzania Drop Stitch',
      desc: 'Kompaktowa okrągła wanna do zanurzania Drop Stitch z wbudowanymi siedziskami i izolowanym dnem 5 mm — podłącza się do zewnętrznego podgrzewacza (nie w zestawie).',
    },
  },
  ar: {
    'rectangular-drop-stitch-pool': {
      name: 'مسبح قابل للنفخ مستطيل Drop Stitch',
      desc: 'مسبح قابل للنفخ مستطيل بحجم عائلي بجدران صلبة Drop Stitch عالية الضغط.',
    },
    'round-blue-drop-stitch-pool': {
      name: 'مسبح أزرق قابل للنفخ دائري Drop Stitch',
      desc: 'مسبح أزرق دائري كلاسيكي قابل للنفخ بجدران صلبة Drop Stitch عالية الضغط.',
    },
    'round-grey-drop-stitch-pool': {
      name: 'مسبح رمادي قابل للنفخ دائري Drop Stitch',
      desc: 'مسبح رمادي دائري فاخر قابل للنفخ بجدران صلبة Drop Stitch وغطاء مخصص اختياري.',
    },
    'hot-tub-square-rect': {
      name: 'حوض نقع مربع ومستطيل Drop Stitch',
      desc: 'حوض نقع مربع ومستطيل Drop Stitch لجميع الفصول مع مقاعد مدمجة وقاع معزول بسماكة 5 مم — يتصل بمدفأة خارجية (غير مضمّنة).',
    },
    'hot-tub-round': {
      name: 'حوض نقع دائري Drop Stitch',
      desc: 'حوض نقع دائري مدمج Drop Stitch مع مقاعد مدمجة وقاع معزول بسماكة 5 مم — يتصل بمدفأة خارجية (غير مضمّنة).',
    },
  },
};
