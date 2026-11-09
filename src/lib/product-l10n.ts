export interface ProductL10n {
  titles: Record<string, string>;
  summaries: Record<string, string>;
  labels: Record<string, string>;
  cats: Record<string, string>;
}

// Product UI localization. Non-EN languages fall back to the English pool
// catalog unless a per-language entry exists here. Technical terms such as
// "Drop Stitch" are intentionally kept untranslated (project rule).
// Languages covered = the product localization standard set (15 locales).
export const PRODUCT_L10N: Record<string, ProductL10n> = {
  fr: {
    titles: {
      'rectangular-drop-stitch-pool': 'Piscine gonflable rectangulaire Drop Stitch',
      'round-blue-drop-stitch-pool': 'Piscine gonflable ronde bleue Drop Stitch',
      'round-grey-drop-stitch-pool': 'Piscine gonflable ronde grise Drop Stitch',
      'hot-tub-square-rect': 'Piscine de trempage Drop Stitch carrée/rectangulaire',
      'hot-tub-round': 'Piscine de trempage Drop Stitch ronde',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'Piscine gonflable rectangulaire familiale Drop Stitch — gonflage rapide, parois rigides, rangement compact.',
      'round-blue-drop-stitch-pool':
        'Piscine gonflable ronde bleue Drop Stitch — la piscine familiale classique aux parois rigides haute pression.',
      'round-grey-drop-stitch-pool':
        'Piscine gonflable ronde grise premium Drop Stitch — look moderne, parois rigides, couverture assortie en option.',
      'hot-tub-square-rect':
        'Piscine de trempage Drop Stitch isolée avec sièges intégrés et fond isolant de 5 mm — modèles carrés et rectangulaires de 1,5 × 1,5 × 0,8 m à 3 × 2 × 1 m. Se raccorde à un chauffage externe (non inclus).',
      'hot-tub-round':
        'Piscine de trempage gonflable ronde compacte avec sièges intégrés et fond isolant de 5 mm — modèles Drop Stitch de 1,8 m, 2,0 m et 2,3 m pour cours et terrasses à charge certifiée. S’utilise avec un chauffage externe (chauffage non inclus).',
    },
    labels: {},
    cats: { pool: 'Piscines gonflables' },
  },
  de: {
    titles: {
      'rectangular-drop-stitch-pool': 'Rechteckiges Drop Stitch Aufblaspool',
      'round-blue-drop-stitch-pool': 'Rundes blaues Drop Stitch Aufblaspool',
      'round-grey-drop-stitch-pool': 'Rundes graues Drop Stitch Aufblaspool',
      'hot-tub-square-rect': 'Quadratisches und rechteckiges Drop-Stitch-Tauchbecken',
      'hot-tub-round': 'Rundes Drop-Stitch-Tauchbecken',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'Rechteckiges Aufblas-Schwimmbecken in Familiengröße mit Drop Stitch — schnell aufgeblasen, steife Wände, platzsparend verstaubar.',
      'round-blue-drop-stitch-pool':
        'Rundes blaues Aufblas-Schwimmbecken mit Drop Stitch — der klassische Familienpool mit steifen Wänden unter hohem Druck.',
      'round-grey-drop-stitch-pool':
        'Premium Aufblas-Schwimmbecken, rund und grau, mit Drop Stitch — modernes Erscheinungsbild, steife Wände, optionale passgenaue Abdeckung.',
      'hot-tub-square-rect':
        'Isoliertes Drop-Stitch-Tauchbecken mit integrierten Sitzen und 5 mm isoliertem Boden — quadratische und rechteckige Modelle von 1,5 × 1,5 × 0,8 m bis 3 × 2 × 1 m. Anschluss an ein externes Heizgerät (Heizgerät nicht im Lieferumfang).',
      'hot-tub-round':
        'Kompaktes rundes Aufblas-Tauchbecken mit integrierten Sitzen und 5 mm isoliertem Boden — Drop-Stitch-Modelle mit 1,8 m, 2,0 m und 2,3 m Durchmesser für Höfe und belastbare Terrassen. Kombinierbar mit einem externen Heizgerät (Heizgerät nicht im Lieferumfang).',
    },
    labels: {},
    cats: { pool: 'Aufblasbare Pools' },
  },
  es: {
    titles: {
      'rectangular-drop-stitch-pool': 'Piscina hinchable rectangular Drop Stitch',
      'round-blue-drop-stitch-pool': 'Piscina hinchable redonda azul Drop Stitch',
      'round-grey-drop-stitch-pool': 'Piscina hinchable redonda gris Drop Stitch',
      'hot-tub-square-rect': 'Piscina de inmersión Drop Stitch cuadrada/rectangular',
      'hot-tub-round': 'Piscina de inmersión Drop Stitch redonda',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'Piscina hinchable rectangular familiar Drop Stitch — inflado rápido, paredes rígidas, se guarda en poco espacio.',
      'round-blue-drop-stitch-pool':
        'Piscina hinchable redonda azul Drop Stitch — la piscina familiar clásica con paredes rígidas de alta presión.',
      'round-grey-drop-stitch-pool':
        'Piscina hinchable redonda gris premium Drop Stitch — aspecto moderno, paredes rígidas, cubierta a juego opcional.',
      'hot-tub-square-rect':
        'Piscina de inmersión Drop Stitch aislada con asientos integrados y fondo aislado de 5 mm — modelos cuadrados y rectangulares de 1,5 × 1,5 × 0,8 m a 3 × 2 × 1 m. Se conecta a un calentador externo (no incluido).',
      'hot-tub-round':
        'Piscina de inmersión hinchable redonda compacta con asientos integrados y fondo aislado de 5 mm — modelos Drop Stitch de 1,8 m, 2,0 m y 2,3 m para patios y terrazas con carga certificada. Se usa con un calentador externo (calentador no incluido).',
    },
    labels: {},
    cats: { pool: 'Piscinas hinchables' },
  },
  pt: {
    titles: {
      'rectangular-drop-stitch-pool': 'Piscina insuflável retangular Drop Stitch',
      'round-blue-drop-stitch-pool': 'Piscina insuflável redonda azul Drop Stitch',
      'round-grey-drop-stitch-pool': 'Piscina insuflável redonda cinzenta Drop Stitch',
      'hot-tub-square-rect': 'Piscina de imersão Drop Stitch quadrada e retangular',
      'hot-tub-round': 'Piscina de imersão Drop Stitch redonda',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'Piscina insuflável retangular familiar Drop Stitch — insuflação rápida, paredes rígidas, arrumação compacta.',
      'round-blue-drop-stitch-pool':
        'Piscina insuflável redonda azul Drop Stitch — a piscina familiar clássica com paredes rígidas de alta pressão.',
      'round-grey-drop-stitch-pool':
        'Piscina insuflável redonda cinzenta premium Drop Stitch — visual moderno, paredes rígidas, cobertura à medida opcional.',
      'hot-tub-square-rect':
        'Piscina de imersão Drop Stitch isolada com assentos integrados e fundo isolado de 5 mm — modelos quadrados e retangulares de 1,5 × 1,5 × 0,8 m a 3 × 2 × 1 m. Liga-se a um aquecedor externo (não incluído).',
      'hot-tub-round':
        'Piscina de imersão insuflável redonda compacta com assentos integrados e fundo isolado de 5 mm — modelos Drop Stitch de 1,8 m, 2,0 m e 2,3 m para pátios e terraços com carga certificada. Utiliza-se com um aquecedor externo (aquecedor não incluído).',
    },
    labels: {},
    cats: { pool: 'Piscinas infláveis' },
  },
  it: {
    titles: {
      'rectangular-drop-stitch-pool': 'Piscina gonfiabile rettangolare Drop Stitch',
      'round-blue-drop-stitch-pool': 'Piscina gonfiabile rotonda blu Drop Stitch',
      'round-grey-drop-stitch-pool': 'Piscina gonfiabile rotonda grigia Drop Stitch',
      'hot-tub-square-rect': 'Vasca di immersione Drop Stitch quadrata/rettangolare',
      'hot-tub-round': 'Piscina di immersione Drop Stitch rotonda',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'Piscina gonfiabile rettangolare per famiglie Drop Stitch — gonfiaggio rapido, pareti rigide, si ripone in poco spazio.',
      'round-blue-drop-stitch-pool':
        'Piscina gonfiabile rotonda blu Drop Stitch — la piscina familiare classica con pareti rigide ad alta pressione.',
      'round-grey-drop-stitch-pool':
        'Piscina gonfiabile rotonda grigia premium Drop Stitch — look moderno, pareti rigide, copertura su misura opzionale.',
      'hot-tub-square-rect':
        'Piscina di immersione Drop Stitch isolata con sedili integrati e fondo isolato da 5 mm — modelli quadrati e rettangolari da 1,5 × 1,5 × 0,8 m a 3 × 2 × 1 m. Si collega a un riscaldatore esterno (non incluso).',
      'hot-tub-round':
        'Piscina di immersione gonfiabile rotonda compatta con sedili integrati e fondo isolato da 5 mm — modelli Drop Stitch da 1,8 m, 2,0 m e 2,3 m per cortili e terrazze a carico certificato. Si usa con un riscaldatore esterno (riscaldatore non incluso).',
    },
    labels: {},
    cats: { pool: 'Piscine gonfiabili' },
  },
  ru: {
    titles: {
      'rectangular-drop-stitch-pool': 'Прямоугольный надувной бассейн Drop Stitch',
      'round-blue-drop-stitch-pool': 'Круглый синий надувной бассейн Drop Stitch',
      'round-grey-drop-stitch-pool': 'Круглый серый надувной бассейн Drop Stitch',
      'hot-tub-square-rect': 'Квадратная и прямоугольная купель Drop Stitch',
      'hot-tub-round': 'Круглая купель Drop Stitch',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'Семейный прямоугольный надувной бассейн Drop Stitch — быстрое накачивание, жёсткие стенки, компактное хранение.',
      'round-blue-drop-stitch-pool':
        'Круглый синий надувной бассейн Drop Stitch — классический семейный бассейн с жёсткими стенками высокого давления.',
      'round-grey-drop-stitch-pool':
        'Премиальный круглый серый надувной бассейн Drop Stitch — современный дизайн, жёсткие стенки, опциональная крышка в тон.',
      'hot-tub-square-rect':
        'Утеплённая купель Drop Stitch со встроенными сиденьями и утеплённым дном 5 мм — квадратные и прямоугольные модели от 1,5 × 1,5 × 0,8 м до 3 × 2 × 1 м. Подключается к внешнему нагревателю (нагреватель не входит в комплект).',
      'hot-tub-round':
        'Компактная круглая надувная купель со встроенными сиденьями и утеплённым дном 5 мм — модели Drop Stitch диаметром 1,8, 2,0 и 2,3 м для дворов и террас с подтверждённой несущей способностью. Работает с внешним нагревателем (нагреватель не входит в комплект).',
    },
    labels: {},
    cats: { pool: 'Надувные бассейны' },
  },
  pl: {
    titles: {
      'rectangular-drop-stitch-pool': 'Prostokątny dmuchany basen Drop Stitch',
      'round-blue-drop-stitch-pool': 'Okrągły niebieski dmuchany basen Drop Stitch',
      'round-grey-drop-stitch-pool': 'Okrągły szary dmuchany basen Drop Stitch',
      'hot-tub-square-rect': 'Kwadratowa/prostokątna wanna do zanurzania Drop Stitch',
      'hot-tub-round': 'Okrągła wanna do zanurzania Drop Stitch',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'Rodzinny prostokątny dmuchany basen Drop Stitch — szybkie napompowanie, sztywne ściany, kompaktowe przechowywanie.',
      'round-blue-drop-stitch-pool':
        'Okrągły niebieski dmuchany basen Drop Stitch — klasyczny basen rodzinny ze sztywnymi ścianami wysokiego ciśnienia.',
      'round-grey-drop-stitch-pool':
        'Dmuchany basen okrągły w kolorze szarym premium Drop Stitch — nowoczesny wygląd, sztywne ściany, opcjonalny dopasowany pokrowiec.',
      'hot-tub-square-rect':
        'Izolowana wanna do zanurzania Drop Stitch z wbudowanymi siedziskami i izolowanym dnem 5 mm — modele kwadratowe i prostokątne od 1,5 × 1,5 × 0,8 m do 3 × 2 × 1 m. Podłącza się do zewnętrznego podgrzewacza (nie w zestawie).',
      'hot-tub-round':
        'Kompaktowa okrągła dmuchana wanna do zanurzania z wbudowanymi siedziskami i izolowanym dnem 5 mm — modele Drop Stitch o średnicy 1,8 m, 2,0 m i 2,3 m na podwórka i tarasy o potwierdzonej nośności. Współpracuje z zewnętrznym podgrzewaczem (podgrzewacz nie w zestawie).',
    },
    labels: {},
    cats: { pool: 'Baseny nadmuchiwane' },
  },
  ar: {
    titles: {
      'rectangular-drop-stitch-pool': 'مسبح قابل للنفخ مستطيل Drop Stitch',
      'round-blue-drop-stitch-pool': 'مسبح أزرق قابل للنفخ دائري Drop Stitch',
      'round-grey-drop-stitch-pool': 'مسبح رمادي قابل للنفخ دائري Drop Stitch',
      'hot-tub-square-rect': 'حوض نقع مربع ومستطيل Drop Stitch',
      'hot-tub-round': 'حوض نقع دائري Drop Stitch',
    },
    summaries: {
      'rectangular-drop-stitch-pool': 'مسبح عائلي مستطيل قابل للنفخ Drop Stitch — نفخ سريع، جدران صلبة، تخزين مدمج.',
      'round-blue-drop-stitch-pool':
        'مسبح أزرق دائري قابل للنفخ Drop Stitch — مسبح عائلي كلاسيكي بجدران صلبة عالية الضغط.',
      'round-grey-drop-stitch-pool':
        'مسبح رمادي دائري فاخر قابل للنفخ Drop Stitch — مظهر عصري، جدران صلبة، غطاء مخصص اختياري.',
      'hot-tub-square-rect':
        'حوض نقع Drop Stitch معزول بمقاعد مدمجة وقاع معزول بسماكة 5 مم — نماذج مربعة ومستطيلة من 1.5 × 1.5 × 0.8 م إلى 3 × 2 × 1 م. يتصل بمدفأة خارجية (غير مضمّنة).',
      'hot-tub-round':
        'حوض نقع دائري مدمج قابل للنفخ بمقاعد مدمجة وقاع معزول بسماكة 5 مم — طرز Drop Stitch بأقطار 1.8 و2.0 و2.3 م للأفنية والأسطح ذات الحمل المعتمد. يعمل مع مدفأة خارجية (المدفأة غير مضمّنة).',
    },
    labels: {},
    cats: { pool: 'مسابح قابلة للنفخ' },
  },
  nl: {
    titles: {
      'rectangular-drop-stitch-pool': 'Rechthoekig opblaasbaar Drop Stitch zwembad',
      'round-blue-drop-stitch-pool': 'Rond blauw opblaasbaar Drop Stitch zwembad',
      'round-grey-drop-stitch-pool': 'Rond grijs opblaasbaar Drop Stitch zwembad',
      'hot-tub-square-rect': 'Vierkant en rechthoekig Drop Stitch dompelbad',
      'hot-tub-round': 'Rond Drop Stitch dompelbad met ingebouwde zitplaatsen',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'Rechthoekig opblaasbaar Drop Stitch zwembad voor het hele gezin — snel opgeblazen, stijve wanden, compact op te bergen.',
      'round-blue-drop-stitch-pool':
        'Rond blauw opblaasbaar Drop Stitch zwembad — het klassieke gezinszwembad met stijve wanden onder hoge druk.',
      'round-grey-drop-stitch-pool':
        'Premium rond grijs opblaasbaar Drop Stitch zwembad — moderne uitstraling, stijve wanden, optionele passende afdekking.',
      'hot-tub-square-rect':
        'Geïsoleerd Drop Stitch dompelbad met ingebouwde zitplaatsen en 5 mm geïsoleerde bodem — vierkante en rechthoekige modellen van 1,5 × 1,5 × 0,8 m tot 3 × 2 × 1 m. Aansluitbaar op een externe verwarming (niet inbegrepen).',
      'hot-tub-round':
        'Compact rond opblaasbaar dompelbad met ingebouwde zitplaatsen en 5 mm geïsoleerde bodem — Drop Stitch modellen van 1,8 m, 2,0 m en 2,3 m voor binnenplaatsen en draagkrachtige terrassen. Te combineren met een externe verwarming (verwarming niet inbegrepen).',
    },
    labels: {},
    cats: { pool: 'Opblaasbare zwembaden' },
  },
  sv: {
    titles: {
      'rectangular-drop-stitch-pool': 'Rektangulär uppblåsbar Drop Stitch-pool',
      'round-blue-drop-stitch-pool': 'Rund blå uppblåsbar Drop Stitch-pool',
      'round-grey-drop-stitch-pool': 'Rund grå uppblåsbar Drop Stitch-pool',
      'hot-tub-square-rect': 'Fyrkantigt och rektangulärt Drop Stitch-spabad',
      'hot-tub-round': 'Runt Drop Stitch-spabad med inbyggda sittplatser',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'Rektangulär uppblåsbar Drop Stitch-pool i familjestorlek — snabb att blåsa upp, styva väggar, förvaras kompakt.',
      'round-blue-drop-stitch-pool':
        'Rund blå uppblåsbar Drop Stitch-pool — den klassiska familjepoolen med styva väggar under högt tryck.',
      'round-grey-drop-stitch-pool':
        'Premium rund grå uppblåsbar Drop Stitch-pool — modern look, styva väggar, valfri anpassad skyddstäckning.',
      'hot-tub-square-rect':
        'Isolerat Drop Stitch-spabad med inbyggda sittplatser och 5 mm isolerad botten — fyrkantiga och rektangulära modeller från 1,5 × 1,5 × 0,8 m till 3 × 2 × 1 m. Ansluts till en extern värmare (värmaren ingår ej).',
      'hot-tub-round':
        'Kompakt runt uppblåsbart spabad med inbyggda sittplatser och 5 mm isolerad botten — Drop Stitch-modeller på 1,8 m, 2,0 m och 2,3 m för gårdar och belastningsgodkända terrasser. Kombineras med en extern värmare (värmaren ingår ej).',
    },
    labels: {},
    cats: { pool: 'Uppblåsbara pooler' },
  },
  no: {
    titles: {
      'rectangular-drop-stitch-pool': 'Rektangulær oppblåsbar Drop Stitch-basseng',
      'round-blue-drop-stitch-pool': 'Rund blå oppblåsbar Drop Stitch-basseng',
      'round-grey-drop-stitch-pool': 'Rund grå oppblåsbar Drop Stitch-basseng',
      'hot-tub-square-rect': 'Firkantet og rektangulært Drop Stitch-spabad',
      'hot-tub-round': 'Rundt Drop Stitch-spabad med innebygde seter',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'Rektangulær oppblåsbar Drop Stitch-basseng i familiestørrelse — rask å blåse opp, stive vegger, pakkes kompakt sammen.',
      'round-blue-drop-stitch-pool':
        'Rund blå oppblåsbar Drop Stitch-basseng — det klassiske familiebassenget med stive vegger under høyt tryk.',
      'round-grey-drop-stitch-pool':
        'Premium rund grå oppblåsbar Drop Stitch-basseng — moderne uttrykk, stive vegger, valgfri tilpasset overtrekk.',
      'hot-tub-square-rect':
        'Isolert Drop Stitch-spabad med innebygde seter og 5 mm isolert bunn — firkantede og rektangulære modeller fra 1,5 × 1,5 × 0,8 m til 3 × 2 × 1 m. Kobles til en ekstern varmer (varmer er ikke inkludert).',
      'hot-tub-round':
        'Kompakt rundt oppblåsbart spabad med innebygde seter og 5 mm isolert bunn — Drop Stitch-modeller på 1,8 m, 2,0 m og 2,3 m for gårdsrom og terrasser med dokumentert bæreevne. Kombineres med en ekstern varmer (varmeren er ikke inkludert).',
    },
    labels: {},
    cats: { pool: 'Oppblåsbare bassenger' },
  },
  da: {
    titles: {
      'rectangular-drop-stitch-pool': 'Rektangulær oppustelig Drop Stitch-pool',
      'round-blue-drop-stitch-pool': 'Rund blå oppustelig Drop Stitch-pool',
      'round-grey-drop-stitch-pool': 'Rund grå oppustelig Drop Stitch-pool',
      'hot-tub-square-rect': 'Firkantet og rektangulært Drop Stitch-spabad',
      'hot-tub-round': 'Rundt Drop Stitch-spabad med indbyggede sæder',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'Rektangulær oppustelig Drop Stitch-pool i familiestørrelse — hurtig at puste op, stive vægge, pladsbesparende opbevaring.',
      'round-blue-drop-stitch-pool':
        'Rund blå oppustelig Drop Stitch-pool — den klassiske familiepool med stive vægge under højt tryk.',
      'round-grey-drop-stitch-pool':
        'Premium rund grå oppustelig Drop Stitch-pool — moderne look, stive vægge, valgfrit tilpasset overtræk.',
      'hot-tub-square-rect':
        'Isoleret Drop Stitch-spabad med indbyggede sæder og 5 mm isoleret bund — firkantede og rektangulære modeller fra 1,5 × 1,5 × 0,8 m til 3 × 2 × 1 m. Tilsluttes et eksternt varmelegeme (varmelegeme er ikke inkluderet).',
      'hot-tub-round':
        'Kompakt rundt oppusteligt spabad med indbyggede sæder og 5 mm isoleret bund — Drop Stitch-modeller på 1,8 m, 2,0 m og 2,3 m til gårdspladser og terrasser med godkendt bæreevne. Kombineres med et eksternt varmelegeme (varmelegemet er ikke inkluderet).',
    },
    labels: {},
    cats: { pool: 'Oppustelige pools' },
  },
  fi: {
    titles: {
      'rectangular-drop-stitch-pool': 'Suorakulmainen ilmatäytteinen Drop Stitch -allas',
      'round-blue-drop-stitch-pool': 'Pyöreä sininen ilmatäytteinen Drop Stitch -allas',
      'round-grey-drop-stitch-pool': 'Pyöreä harmaa ilmatäytteinen Drop Stitch -allas',
      'hot-tub-square-rect': 'Neliö- ja suorakulmainen Drop Stitch -kylpyallas',
      'hot-tub-round': 'Pyöreä Drop Stitch -kylpyallas',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'Perheen kokoinen suorakulmainen ilmatäytteinen Drop Stitch -uima-allas — nopeasti ilmattava, jäykät seinät, pieni pakkaus.',
      'round-blue-drop-stitch-pool':
        'Pyöreä sininen ilmatäytteinen Drop Stitch -uima-allas — klassinen perheallas jäykillä korkeapaineisilla seinillä.',
      'round-grey-drop-stitch-pool':
        'Premium-pyöreä harmaa ilmatäytteinen Drop Stitch -uima-allas — moderni ilme, jäykät seinät, valinnainen tarkkaan sopiva suojapeite.',
      'hot-tub-square-rect':
        'Eristetty Drop Stitch -kylpyallas sisäänrakennetuilla istuimilla ja 5 mm:n eristetyllä pohjalla — neliö- ja suorakulmaiset mallit mitoista 1,5 × 1,5 × 0,8 m mittoon 3 × 2 × 1 m. Liitetään erilliseen lämmittimeen (lämmitin ei sisälly).',
      'hot-tub-round':
        'Kompakti pyöreä ilmatäytteinen kylpyallas sisäänrakennetuilla istuimilla ja 5 mm:n eristetyllä pohjalla — 1,8 m, 2,0 m ja 2,3 m Drop Stitch -mallit pihoille ja sallitun kuorman kestäville terasseille. Toimii yhdessä erillisen lämmittimen kanssa (lämmitin ei sisälly toimitukseen).',
    },
    labels: {},
    cats: { pool: 'Ilmatäytteiset altaat' },
  },
  el: {
    titles: {
      'rectangular-drop-stitch-pool': 'Ορθογώνια φουσκωτή πισίνα Drop Stitch',
      'round-blue-drop-stitch-pool': 'Στρογγυλή μπλε φουσκωτή πισίνα Drop Stitch',
      'round-grey-drop-stitch-pool': 'Στρογγυλή γκρι φουσκωτή πισίνα Drop Stitch',
      'hot-tub-square-rect': 'Τετράγωνη και ορθογώνια πισίνα εμβάπτισης Drop Stitch',
      'hot-tub-round': 'Στρογγυλή πισίνα εμβάπτισης Drop Stitch',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'Οικογενειακή ορθογώνια φουσκωτή πισίνα Drop Stitch — γρήγορο φούσκωμα, άκαμπτοι τοίχοι, συσκευάζεται σε μικρό όγκο.',
      'round-blue-drop-stitch-pool':
        'Στρογγυλή μπλε φουσκωτή πισίνα Drop Stitch — η κλασική οικογενειακή πισίνα με άκαμπτους τοίχους υψηλής πίεσης.',
      'round-grey-drop-stitch-pool':
        'Premium στρογγυλή γκρι φουσκωτή πισίνα Drop Stitch — μοντέρνα εμφάνιση, άκαμπτοι τοίχοι, προαιρετικό καλύμμα.',
      'hot-tub-square-rect':
        'Μονωμένη πισίνα εμβάπτισης Drop Stitch με ενσωματωμένα καθίσματα και μονωμένο πάτο 5 mm — τετράγωνα και ορθογώνια μοντέλα από 1,5 × 1,5 × 0,8 m έως 3 × 2 × 1 m. Συνδέεται με εξωτερικό θερμαντήρα (δεν περιλαμβάνεται).',
      'hot-tub-round':
        'Συμπαγής στρογγυλή φουσκωτή πισίνα εμβάπτισης με ενσωματωμένα καθίσματα και μονωμένο πάτο 5 mm — μοντέλα Drop Stitch διαμέτρου 1,8 m, 2,0 m και 2,3 m για αυλές και βεράντες με πιστοποιημένη αντοχή. Συνδυάζεται με εξωτερικό θερμαντήρα (δεν περιλαμβάνεται).',
    },
    labels: {},
    cats: { pool: 'Φουσκωτές πισίνες' },
  },
  cs: {
    titles: {
      'rectangular-drop-stitch-pool': 'Obdélníkový nafukovací bazén Drop Stitch',
      'round-blue-drop-stitch-pool': 'Kulatý modrý nafukovací bazén Drop Stitch',
      'round-grey-drop-stitch-pool': 'Kulatý šedý nafukovací bazén Drop Stitch',
      'hot-tub-square-rect': 'Čtvercová a obdélníková koupací vana Drop Stitch',
      'hot-tub-round': 'Kulatá koupací vana Drop Stitch s vestavěnými sedátky',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'Rodinný obdélníkový nafukovací bazén Drop Stitch — rychlé nafouknutí, tuhé stěny, skladné uložení.',
      'round-blue-drop-stitch-pool':
        'Kulatý modrý nafukovací bazén Drop Stitch — klasický rodinný bazén s tuhými stěnami pod vysokým tlakem.',
      'round-grey-drop-stitch-pool':
        'Prémiový kulatý šedý nafukovací bazén Drop Stitch — moderní vzhled, tuhé stěny, volitelná krycí plachta na míru.',
      'hot-tub-square-rect':
        'Tepelně izolovaná koupací vana Drop Stitch s vestavěnými sedátky a 5 mm izolovaným dnem — čtvercové a obdélníkové modely od 1,5 × 1,5 × 0,8 m do 3 × 2 × 1 m. Připojuje se k externímu topení (topení není součástí).',
      'hot-tub-round':
        'Kompaktní kulatá nafukovací koupací vana s vestavěnými sedátky a 5 mm izolovaným dnem — modely Drop Stitch o průměru 1,8 m, 2,0 m a 2,3 m pro dvorky a terasy s ověřenou únosností. Používá se s externím topením (topení není součástí dodávky).',
    },
    labels: {},
    cats: { pool: 'Nafukovací bazény' },
  },
  az: {
    titles: {
      'rectangular-drop-stitch-pool': 'Düzbucaqlı Şişmə Drop Stitch Üzgüçülük Hovuzu',
      'round-blue-drop-stitch-pool': 'Dəyirmi Mavi Şişmə Drop Stitch Üzgüçülük Hovuzu',
      'round-grey-drop-stitch-pool': 'Dəyirmi Boz Şişmə Drop Stitch Üzgüçülük Hovuzu',
      'hot-tub-square-rect': 'Quraşdırılmış Oturacaqlarla Kvadrat və Düzbucaqlı Düşmə Hovuzu',
      'hot-tub-round': 'Quraşdırılmış Oturacaqlarla Dairəvi Düşmə Hovuzu',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'Ailə ölçülü düzbucaqlı şişmə damcılı üzgüçülük hovuzu - tez şişirilir, sərt divarlar, kiçik paketlər.',
      'round-blue-drop-stitch-pool':
        'Dairəvi mavi şişmə damcılı üzgüçülük hovuzu - sərt yüksək təzyiqli divarları olan klassik ailə hovuzu.',
      'round-grey-drop-stitch-pool':
        'Premium dəyirmi boz rəngli şişmə damcılı üzgüçülük hovuzu — müasir görünüş, sərt divarlar, isteğe uyğun uyğun örtük.',
      'hot-tub-square-rect':
        'Quraşdırılmış oturacaqları və 5 mm izolyasiya edilmiş dibi olan izolyasiya edilmiş damcı tikişli islatma hovuzu - 1,5 × 1,5 × 0,8 m-dən 3 × 2 × 1 m-ə qədər kvadrat və düzbucaqlı modellər. Xarici qızdırıcıya qoşulur (daxil deyil).',
      'hot-tub-round':
        'Quraşdırılmış oturacaqları və 5 mm izolyasiya edilmiş dibi olan yığcam yuvarlaq şişmə hovuz - onlayn dəst sabit Ø 2 × 0,8 m modeldir (zavod məhsulu RS2018, divar 10 sm). Xarici qızdırıcı ilə cütləşir (qızdırıcı daxil deyil).',
    },
    labels: {},
    cats: { pool: 'Şişmə hovuzlar' },
  },
  bg: {
    titles: {
      'rectangular-drop-stitch-pool': 'Правоъгълен надуваем плувен басейн с падащ шев',
      'round-blue-drop-stitch-pool': 'Кръгъл син надуваем плувен басейн с падащ шев',
      'round-grey-drop-stitch-pool': 'Кръгъл сив надуваем плувен басейн с падащ шев',
      'hot-tub-square-rect': 'Квадратни и правоъгълни хидравлични басейни с вградени седалки',
      'hot-tub-round': 'Кръгъл падащ шев басейн за накисване с вградени седалки',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'Правоъгълен надуваем плувен басейн със семеен размер — бърз за надуване, твърди стени, малки опаковки.',
      'round-blue-drop-stitch-pool':
        'Кръгъл син надуваем плувен басейн с падащ шев — класически семеен басейн с твърди стени с високо налягане.',
      'round-grey-drop-stitch-pool':
        'Първокласен кръгъл сив надуваем плувен басейн с капачки — модерен външен вид, твърди стени, подходящо покривало по избор.',
      'hot-tub-square-rect':
        'Изолиран падащ шев басейн за накисване с вградени седалки и 5 mm изолирано дъно — квадратни и правоъгълни модели от 1,5 × 1,5 × 0,8 m до 3 × 2 × 1 m. Свързва се към външен нагревател (не е включен).',
      'hot-tub-round':
        'Компактен кръгъл надуваем басейн с вградени седалки и 5 mm изолирано дъно — онлайн комплектът е фиксираният модел Ø 2 × 0,8 m (фабричен артикул RS2018, 10 cm стена). Сдвоява се с външен нагревател (нагревателят не е включен).',
    },
    labels: {},
    cats: { pool: 'Надуваеми басейни' },
  },
  et: {
    titles: {
      'rectangular-drop-stitch-pool': 'Ristkülikukujuline täispuhutav Drop Stitch bassein',
      'round-blue-drop-stitch-pool': 'Ümmargune sinine täispuhutav Drop Stitch bassein',
      'round-grey-drop-stitch-pool': 'Ümmargune hall täispuhutav Drop Stitch bassein',
      'hot-tub-square-rect': 'Ruudukujuline ja ristkülikukujuline sisseehitatud istmetega leotusbassein',
      'hot-tub-round': 'Ümmargune sisseehitatud istmetega leotusbassein',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'Peresuuruses ristkülikukujuline täispuhutav tilkpistega bassein – kiiresti täispuhutav, jäigad seinad, pakitakse väikeseks.',
      'round-blue-drop-stitch-pool':
        'Ümmargune sinine täispuhutav tilkpistega bassein — klassikaline jäikade kõrgsurveseintega perebassein.',
      'round-grey-drop-stitch-pool':
        'Esmaklassiline ümmargune hall täispuhutav tilkpistega bassein – kaasaegne välimus, jäigad seinad, valikuline sobiv kate.',
      'hot-tub-square-rect':
        'Isoleeritud tilkpistega leotusbassein sisseehitatud istmete ja 5 mm isoleeritud põhjaga — ruudu- ja ristkülikukujulised mudelid 1,5 × 1,5 × 0,8 m kuni 3 × 2 × 1 m. Ühendab välise küttekehaga (ei kuulu komplekti).',
      'hot-tub-round':
        'Kompaktne ümmargune täispuhutav ujumisbassein sisseehitatud istmete ja 5 mm isolatsiooniga põhjaga — online komplekt on fikseeritud Ø 2 × 0,8 m mudel (tehasetoode RS2018, 10 cm sein). Paarib välise küttekehaga (küttekeha ei kuulu komplekti).',
    },
    labels: {},
    cats: { pool: 'Täispuhutavad basseinid' },
  },
  fa: {
    titles: {
      'rectangular-drop-stitch-pool': 'استخر بادی قطره ای مستطیل شکل',
      'round-blue-drop-stitch-pool': 'استخر بادی قطره ای گرد آبی',
      'round-grey-drop-stitch-pool': 'استخر بادی قطره ای گرد خاکستری',
      'hot-tub-square-rect': 'استخر قطره‌ای مربع و مستطیل شکل با صندلی‌های توکار',
      'hot-tub-round': 'استخر خیساندن قطره ای گرد با صندلی های توکار',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'استخر بادی مستطیلی با دوخت قطره ای در اندازه خانوادگی - دیوارهای سفت و محکم برای باد کردن سریع، بسته های کوچک.',
      'round-blue-drop-stitch-pool':
        'استخر بادی قطره ای گرد آبی - یک استخر کلاسیک خانوادگی با دیوارهای سفت و سخت با فشار بالا.',
      'round-grey-drop-stitch-pool':
        'استخر بادی بادی بادی خاکستری خاکستری - ظاهری مدرن، دیوارهای سفت و سخت، پوشش همسان اختیاری.',
      'hot-tub-square-rect':
        'استخر خیساندن قطره دوخت عایق با صندلی های توکار و کف 5 میلی متری عایق - مدل های مربع و مستطیل از 1.5 × 1.5 × 0.8 متر تا 3 × 2 × 1 متر. به بخاری خارجی متصل می شود (شامل نمی شود).',
      'hot-tub-round':
        'استخر بادی گرد جمع و جور با صندلی های توکار و کف 5 میلی متری عایق - مجموعه آنلاین مدل ثابت Ø 2 × 0.8 متر است (کالای کارخانه RS2018، دیوار 10 سانتی متری). جفت با بخاری خارجی (بخاری شامل نمی شود).',
    },
    labels: {},
    cats: { pool: 'استخرهای بادی' },
  },
  he: {
    titles: {
      'rectangular-drop-stitch-pool': 'בריכת שחייה מלבנית מתנפחת Drop Stitch',
      'round-blue-drop-stitch-pool': 'בריכת שחייה עגולה כחולה מתנפחת Drop Stitch',
      'round-grey-drop-stitch-pool': 'בריכת שחייה מתנפחת מתנפחת אפור עגולה',
      'hot-tub-square-rect': 'בריכת טבילה מרובעת ומלבנית עם מושבים מובנים',
      'hot-tub-round': 'בריכת טבילה עגולה עם מושבים מובנים',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'בריכת שחייה מלבנית מתנפחת מתנפחת בגודל משפחתי - מהירה לניפוח, קירות קשיחים, לארוז בקטנה.',
      'round-blue-drop-stitch-pool':
        'בריכת שחיה מתנפחת כחולה עגולה מתנפחת - בריכה משפחתית קלאסית עם קירות קשיחים בלחץ גבוה.',
      'round-grey-drop-stitch-pool':
        'בריכת שחיה מתנפחת אפורה עגולה פרימיום מתנפחת - מראה מודרני, קירות קשיחים, כיסוי תואם אופציונלי.',
      'hot-tub-square-rect':
        "בריכת טבילה מבודדת עם מושבים מובנים ותחתית מבודדת 5 מ\"מ - דגמים מרובעים ומלבניים מ-1.5 × 1.5 × 0.8 מ' עד 3 × 2 × 1 מ'. מתחבר למחמם חיצוני (לא כלול).",
      'hot-tub-round':
        'בריכת טבילה עגולה ומתנפחת קומפקטית עם מושבים מובנים ותחתית מבודדת 5 מ"מ - הסט המקוון הוא הדגם הקבוע Ø 2 × 0.8 מ\' (פריט מפעל RS2018, קיר 10 ס"מ). שילוב עם תנור חימום חיצוני (מחמם לא כלול).',
    },
    labels: {},
    cats: { pool: 'בריכות מתנפחות' },
  },
  hr: {
    titles: {
      'rectangular-drop-stitch-pool': 'Pravokutni bazen za plivanje na napuhavanje',
      'round-blue-drop-stitch-pool': 'Okrugli plavi bazen za plivanje na napuhavanje',
      'round-grey-drop-stitch-pool': 'Okrugli sivi bazen za plivanje na napuhavanje',
      'hot-tub-square-rect': 'Kvadratni i pravokutni bazen za kupanje s ugrađenim sjedalima',
      'hot-tub-round': 'Okrugli bazen za kupanje s ugrađenim sjedalima',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'Pravokutni bazen za kupanje na napuhavanje obiteljske veličine — brzo se napuhava, krutih stijenki, pakiranja su mala.',
      'round-blue-drop-stitch-pool':
        'Okrugli plavi bazen za plivanje na napuhavanje — klasični obiteljski bazen s krutim visokotlačnim stijenama.',
      'round-grey-drop-stitch-pool':
        'Vrhunski okrugli sivi bazen za plivanje s šavovima na napuhavanje — moderan izgled, krute stijenke, izborna odgovarajuća navlaka.',
      'hot-tub-square-rect':
        'Izolirani bazen za kupanje s ugrađenim sjedalima i 5 mm izoliranim dnom — kvadratni i pravokutni modeli od 1,5 × 1,5 × 0,8 m do 3 × 2 × 1 m. Spaja se na vanjski grijač (nije uključen).',
      'hot-tub-round':
        'Kompaktni okrugli bazen za kupanje na napuhavanje s ugrađenim sjedalima i dnom s izolacijom od 5 mm — online set je fiksni model Ø 2 × 0,8 m (tvornička stavka RS2018, 10 cm stijenke). Spaja se s vanjskim grijačem (grijač nije uključen).',
    },
    labels: {},
    cats: { pool: 'Bazeni na napuhavanje' },
  },
  hu: {
    titles: {
      'rectangular-drop-stitch-pool': 'Téglalap alakú felfújható cseppöltésű úszómedence',
      'round-blue-drop-stitch-pool': 'Kerek kék felfújható cseppöltésű úszómedence',
      'round-grey-drop-stitch-pool': 'Kerek szürke felfújható cseppöltésű úszómedence',
      'hot-tub-square-rect': 'Négyzet alakú és téglalap alakú cseppöltésű áztatómedence beépített ülésekkel',
      'hot-tub-round': 'Kerek cseppöltésű áztatómedence beépített ülésekkel',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'Családi méretű, téglalap alakú, felfújható, öltéses úszómedence – gyorsan felfújható, merev falakkal, kicsiben elfér.',
      'round-blue-drop-stitch-pool':
        'Kerek, kék, felfújható öltéses úszómedence — klasszikus családi medence merev, nagynyomású falakkal.',
      'round-grey-drop-stitch-pool':
        'Prémium kerek, szürke, felfújható öltéses úszómedence – modern megjelenés, merev falak, opcionálisan hozzáillő huzat.',
      'hot-tub-square-rect':
        'Szigetelt varrással ellátott áztatómedence beépített ülésekkel és 5 mm-es szigetelt fenékkel – négyzet és téglalap alakú modellek 1,5 × 1,5 × 0,8 m-től 3 × 2 × 1 m-ig. Külső fűtőtesthez csatlakoztatható (nem tartozék).',
      'hot-tub-round':
        'Kompakt kerek, felfújható áztatómedence beépített ülőfelületekkel és 5 mm-es szigetelt fenékkel – az online készlet a fix Ø 2 × 0,8 m-es modell (RS2018 gyári cikk, 10 cm-es fal). Külső fűtéssel párosítható (a fűtőelem nem tartozék).',
    },
    labels: {},
    cats: { pool: 'Felfújható medencék' },
  },
  id: {
    titles: {
      'rectangular-drop-stitch-pool': 'Kolam Renang Drop Stitch Tiup Persegi Panjang',
      'round-blue-drop-stitch-pool': 'Kolam Renang Drop Stitch Tiup Biru Bulat',
      'round-grey-drop-stitch-pool': 'Kolam Renang Drop Stitch Tiup Bulat Abu-abu',
      'hot-tub-square-rect': 'Kolam Perendaman Drop-Stitch Persegi dan Persegi Panjang dengan Kursi Bawaan',
      'hot-tub-round': 'Kolam Perendaman Jahitan Bulat dengan Kursi Bawaan',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'Kolam renang tiup berbentuk persegi panjang ukuran keluarga — cepat mengembang, dinding kaku, dikemas kecil.',
      'round-blue-drop-stitch-pool':
        'Kolam renang tiup drop stitch bulat berwarna biru — kolam keluarga klasik dengan dinding bertekanan tinggi yang kaku.',
      'round-grey-drop-stitch-pool':
        'Kolam renang tiup drop stitch abu-abu bulat premium — tampilan modern, dinding kaku, penutup opsional yang serasi.',
      'hot-tub-square-rect':
        'Kolam rendam jahitan lepas berinsulasi dengan tempat duduk internal dan dasar berinsulasi 5 mm — model persegi dan persegi panjang dari 1,5 × 1,5 × 0,8 m hingga 3 × 2 × 1 m. Terhubung ke pemanas eksternal (tidak termasuk).',
      'hot-tub-round':
        'Kolam rendam tiup bundar kompak dengan tempat duduk internal dan alas berinsulasi 5 mm — perangkat online adalah model tetap Ø 2 × 0,8 m (item pabrik RS2018, dinding 10 cm). Pasangkan dengan pemanas eksternal (pemanas tidak termasuk).',
    },
    labels: {},
    cats: { pool: 'Kolam Tiup' },
  },
  kk: {
    titles: {
      'rectangular-drop-stitch-pool': 'Тік бұрышты үрлемелі тігісті жүзу бассейні',
      'round-blue-drop-stitch-pool': 'Дөңгелек көк үрленетін тігісті жүзу бассейні',
      'round-grey-drop-stitch-pool': 'Дөңгелек сұр үрленетін тігісті жүзу бассейні',
      'hot-tub-square-rect': 'Кірістірілген орындықтары бар төртбұрышты және тікбұрышты суға арналған бассейн',
      'hot-tub-round': 'Кірістірілген орындықтары бар дөңгелек тігілген суға арналған бассейн',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'Отбасылық өлшемді тікбұрышты үрленетін тігісті жүзу бассейні - тез үрленетін, қатты қабырғалар, шағын пакеттер.',
      'round-blue-drop-stitch-pool':
        'Дөңгелек көк үрленетін тігісті жүзу бассейні - қатты жоғары қысымды қабырғалары бар классикалық отбасылық бассейн.',
      'round-grey-drop-stitch-pool':
        'Премиум дөңгелек сұр үрленетін тігілген жүзу бассейні — заманауи көрініс, қатты қабырғалар, қосымша сәйкес келетін қақпақ.',
      'hot-tub-square-rect':
        'Кірістірілген отырғыштары және 5 мм оқшауланған түбі бар оқшауланған тігісті суға арналған бассейн - 1,5 × 1,5 × 0,8 м-ден 3 × 2 × 1 м-ге дейін шаршы және тікбұрышты модельдер. Сыртқы жылытқышқа қосылады (жинаққа кірмейді).',
      'hot-tub-round':
        'Кірістірілген орындықтары және 5 мм оқшауланған түбі бар ықшам дөңгелек үрленетін суға арналған бассейн — желілік жиынтық бекітілген Ø 2 × 0,8 м моделі (RS2018 зауыттық позициясы, қабырғасы 10 см). Сыртқы жылытқышпен жұпталады (жылытқыш кірмейді).',
    },
    labels: {},
    cats: { pool: 'Үрлемелі бассейндер' },
  },
  lt: {
    titles: {
      'rectangular-drop-stitch-pool': 'Stačiakampis pripučiamas Drop Stitch baseinas',
      'round-blue-drop-stitch-pool': 'Apvalus mėlynas pripučiamas Drop Stitch baseinas',
      'round-grey-drop-stitch-pool': 'Apvalus pilkas pripučiamas Drop Stitch baseinas',
      'hot-tub-square-rect': 'Kvadratinis ir stačiakampis „drop-stitch“ baseinas su įmontuotomis sėdynėmis',
      'hot-tub-round': 'Apvalus „drop-stitch“ baseinas su įmontuotomis sėdynėmis',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'Šeimos dydžio stačiakampis pripučiamas dygsnio baseinas – greitai pripučiamas, standžios sienos, mažos pakuotės.',
      'round-blue-drop-stitch-pool':
        'Apvalus mėlynas pripučiamas dygsnio baseinas – klasikinis šeimos baseinas su standžiomis aukšto slėgio sienelėmis.',
      'round-grey-drop-stitch-pool':
        'Aukščiausios kokybės apvalios pilkos spalvos pripučiamas dygsnio baseinas – šiuolaikiška išvaizda, tvirtos sienos, pasirinktinai tinkamas užvalkalas.',
      'hot-tub-square-rect':
        'Izoliuotas dygsnio mirkymo baseinas su įmontuotomis sėdynėmis ir 5 mm izoliuotu dugnu – kvadratiniai ir stačiakampiai modeliai nuo 1,5 × 1,5 × 0,8 m iki 3 × 2 × 1 m. Jungiamas prie išorinio šildytuvo (į komplektą neįeina).',
      'hot-tub-round':
        'Kompaktiškas apvalus pripučiamas baseinas su įmontuotomis sėdynėmis ir 5 mm izoliuotu dugnu – internetinis rinkinys yra fiksuotas Ø 2 × 0,8 m modelis (gamyklinė prekė RS2018, 10 cm sienelė). Poros su išoriniu šildytuvu (šildytuvas neįeina).',
    },
    labels: {},
    cats: { pool: 'Pripučiami baseinai' },
  },
  lv: {
    titles: {
      'rectangular-drop-stitch-pool': 'Taisnstūra formas piepūšamais peldbaseins',
      'round-blue-drop-stitch-pool': 'Apaļš zils piepūšamais pilināms peldbaseins',
      'round-grey-drop-stitch-pool': 'Apaļš pelēks piepūšamais peldbaseins',
      'hot-tub-square-rect': 'Kvadrātveida un taisnstūrveida izšūšanas baseins ar iebūvētiem sēdekļiem',
      'hot-tub-round': 'Apaļš izšūšanas baseins ar iebūvētiem sēdekļiem',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'Ģimenes izmēra taisnstūrveida piepūšamais peldbaseins ar nolaižamo dūrienu — ātri piepūšams, stingras sienas, kas ir mazas.',
      'round-blue-drop-stitch-pool':
        'Apaļš zils piepūšamais pilināmais peldbaseins — klasisks ģimenes baseins ar stingrām augstspiediena sienām.',
      'round-grey-drop-stitch-pool':
        'Augstākās kvalitātes apaļš pelēks piepūšamais peldbaseins ar nolaižamo dūrienu — moderns izskats, stingras sienas, pēc izvēles pieskaņots segums.',
      'hot-tub-square-rect':
        'Izolēts pilināmais baseins ar iebūvētiem sēdekļiem un 5 mm izolētu dibenu — kvadrātveida un taisnstūrveida modeļi no 1,5 × 1,5 × 0,8 m līdz 3 × 2 × 1 m. Savieno ar ārējo sildītāju (nav iekļauts).',
      'hot-tub-round':
        'Kompakts apaļš piepūšamais baseins ar iebūvētiem sēdekļiem un 5 mm izolētu dibenu — tiešsaistes komplektā ir fiksēts Ø 2 × 0,8 m modelis (rūpnīcas prece RS2018, 10 cm siena). Pārī ar ārējo sildītāju (sildītājs nav iekļauts komplektā).',
    },
    labels: {},
    cats: { pool: 'Piepūšamie baseini' },
  },
  ms: {
    titles: {
      'rectangular-drop-stitch-pool': 'Kolam Renang Jahitan Jahitan Kembung Segiempat',
      'round-blue-drop-stitch-pool': 'Kolam Renang Jahitan Jahitan Kembung Biru Bulat',
      'round-grey-drop-stitch-pool': 'Kolam Renang Jahitan Jahitan Kembung Kelabu Bulat',
      'hot-tub-square-rect': 'Kolam Rendaman Jahitan Jahitan Persegi dan Segi Empat dengan Tempat Duduk Terbina Dalam',
      'hot-tub-round': 'Kolam Rendaman Jahitan Jahitan Bulat dengan Tempat Duduk Terbina Dalam',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'Kolam renang jahitan jatuh kembung segi empat tepat bersaiz keluarga — cepat mengembang, dinding tegar, dibungkus kecil.',
      'round-blue-drop-stitch-pool':
        'Kolam renang jahitan jatuh kembung biru bulat — kolam keluarga klasik dengan dinding tekanan tinggi yang tegar.',
      'round-grey-drop-stitch-pool':
        'Kolam renang jahitan jatuh kembung bulat premium berwarna kelabu — rupa moden, dinding tegar, penutup padanan pilihan.',
      'hot-tub-square-rect':
        'Kolam rendaman titisan jatuh terlindung dengan tempat duduk terbina dalam dan bahagian bawah berpenebat 5 mm — model segi empat sama dan segi empat tepat daripada 1.5 × 1.5 × 0.8 m hingga 3 × 2 × 1 m. Menyambung kepada pemanas luaran (tidak termasuk).',
      'hot-tub-round':
        'Kolam rendaman kembung bulat padat dengan tempat duduk terbina dalam dan bahagian bawah penebat 5 mm — set dalam talian ialah model tetap Ø 2 × 0.8 m (item kilang RS2018, dinding 10 cm). Pasangkan dengan pemanas luaran (tidak termasuk pemanas).',
    },
    labels: {},
    cats: { pool: 'Kolam Kembung' },
  },
  ro: {
    titles: {
      'rectangular-drop-stitch-pool': 'Piscină gonflabilă dreptunghiulară Drop Stitch',
      'round-blue-drop-stitch-pool': 'Piscina Gonflabila Rotunda Albastra Drop Stitch',
      'round-grey-drop-stitch-pool': 'Piscină gonflabilă, rotundă, cu cusătură de picătură, gri',
      'hot-tub-square-rect':
        'Piscină de înmuiere pătrată și dreptunghiulară cu cusătură picătură cu scaune încorporate',
      'hot-tub-round': 'Piscină de înmuiere rotundă cu cusături încorporate cu scaune încorporate',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'Piscină gonflabilă dreptunghiulară cu cusături de picătură de dimensiunea unei familii — rapid de umflat, pereți rigizi, se împachetează mici.',
      'round-blue-drop-stitch-pool':
        'Piscina gonflabilă, rotundă, albastră, cu cusături, o piscină clasică de familie, cu pereți rigizi de înaltă presiune.',
      'round-grey-drop-stitch-pool':
        'Piscina gonflabilă premium rotundă gri cu cusături de picătură — aspect modern, pereți rigizi, capac opțional asortat.',
      'hot-tub-square-rect':
        'Piscină izolată cu cusătură, cu scaune încorporate și fund izolat de 5 mm — modele pătrate și dreptunghiulare de la 1,5 × 1,5 × 0,8 m până la 3 × 2 × 1 m. Se conectează la un încălzitor extern (nu este inclus).',
      'hot-tub-round':
        'Piscina gonflabilă rotundă compactă cu scaune încorporate și fund izolat de 5 mm — setul online este modelul fix Ø 2 × 0,8 m (articol din fabrică RS2018, perete de 10 cm). Perechi cu un încălzitor extern (încălzitor nu este inclus).',
    },
    labels: {},
    cats: { pool: 'Piscine gonflabile' },
  },
  sk: {
    titles: {
      'rectangular-drop-stitch-pool': 'Obdĺžnikový nafukovací bazén typu drop Stitch',
      'round-blue-drop-stitch-pool': 'Okrúhly modrý nafukovací bazén typu drop Stitch',
      'round-grey-drop-stitch-pool': 'Okrúhly sivý nafukovací bazén typu drop Stitch',
      'hot-tub-square-rect': 'Štvorcový a obdĺžnikový bazén so vstavanými sedadlami',
      'hot-tub-round': 'Okrúhly bazén so vstavanými sedadlami',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'Obdĺžnikový nafukovací bazén s prešívaním pre rodinu – rýchlo sa nafúkne, pevné steny, zbaliteľné v malom množstve.',
      'round-blue-drop-stitch-pool':
        'Okrúhly modrý nafukovací bazén s prešívaným stehom — klasický rodinný bazén s pevnými vysokotlakovými stenami.',
      'round-grey-drop-stitch-pool':
        'Prémiový okrúhly sivý nafukovací bazén s prešívaným stehom – moderný vzhľad, pevné steny, voliteľný zodpovedajúci kryt.',
      'hot-tub-square-rect':
        'Izolovaný ponorný bazén so zabudovanými sedadlami a 5 mm izolovaným dnom – štvorcové a obdĺžnikové modely od 1,5 × 1,5 × 0,8 m do 3 × 2 × 1 m. Pripája sa k externému ohrievaču (nie je súčasťou dodávky).',
      'hot-tub-round':
        'Kompaktný okrúhly nafukovací bazénik so zabudovanými sedadlami a 5 mm izolovaným dnom — online set je pevný model Ø 2 × 0,8 m (výrobná položka RS2018, 10 cm stena). Pár s externým ohrievačom (ohrievač nie je súčasťou dodávky).',
    },
    labels: {},
    cats: { pool: 'Nafukovacie bazény' },
  },
  sl: {
    titles: {
      'rectangular-drop-stitch-pool': 'Pravokotni napihljivi plavalni bazen',
      'round-blue-drop-stitch-pool': 'Okrogel, moder napihljiv plavalni bazen',
      'round-grey-drop-stitch-pool': 'Okrogel siv napihljiv plavalni bazen s padajočim šivom',
      'hot-tub-square-rect': 'Kvadratni in pravokotni bazen za namakanje z vgrajenimi sedeži',
      'hot-tub-round': 'Okrogel padajoči bazen z vgrajenimi sedeži',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'Pravokoten napihljiv plavalni bazen družinske velikosti - hitro napihovanje, toge stene, pakiranje je majhno.',
      'round-blue-drop-stitch-pool':
        'Okrogel moder napihljiv plavalni bazen s kapljivim šivom — klasičen družinski bazen s trdimi visokotlačnimi stenami.',
      'round-grey-drop-stitch-pool':
        'Vrhunski okrogel siv napihljiv plavalni bazen s kapljivim šivom — moderen videz, toge stene, izbirna ujemajoča se prevleka.',
      'hot-tub-square-rect':
        'Izoliran bazen za namakanje s padajočim šivom z vgrajenimi sedeži in 5 mm izoliranim dnom — kvadratni in pravokotni modeli od 1,5 × 1,5 × 0,8 m do 3 × 2 × 1 m. Povezuje se z zunanjim grelcem (ni priložen).',
      'hot-tub-round':
        'Kompakten okrogel napihljiv bazen za namakanje z vgrajenimi sedeži in 5 mm izoliranim dnom — spletni set je fiksni model Ø 2 × 0,8 m (tovarniški artikel RS2018, 10 cm stene). Kombinira se z zunanjim grelcem (grelec ni priložen).',
    },
    labels: {},
    cats: { pool: 'Napihljivi bazeni' },
  },
  sr: {
    titles: {
      'rectangular-drop-stitch-pool': 'Правоугаони базен на надувавање Дроп Ститцх',
      'round-blue-drop-stitch-pool': 'Округли плави базен за пливање на надувавање',
      'round-grey-drop-stitch-pool': 'Округли сиви базен на надувавање',
      'hot-tub-square-rect': 'Квадратни и правоугаони базен за намакање са убодним шавовима са уграђеним седиштима',
      'hot-tub-round': 'Округли базен за намакање са убодним шавовима са уграђеним седиштима',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'Правоугаони базен на надувавање породичне величине — брзо се надувава, чврсти зидови, мали пакети.',
      'round-blue-drop-stitch-pool':
        'Округли плави базен за пливање на надувавање — класичан породични базен са чврстим зидовима под високим притиском.',
      'round-grey-drop-stitch-pool':
        'Премиум округли сиви базен за пливање на надувавање — модеран изглед, чврсти зидови, опциони одговарајући поклопац.',
      'hot-tub-square-rect':
        'Изоловани базен за намакање са уграђеним седиштима и изолованим дном од 5 мм — квадратни и правоугаони модели од 1,5 × 1,5 × 0,8 м до 3 × 2 × 1 м. Повезује се на спољни грејач (није укључен).',
      'hot-tub-round':
        'Kompaktni okrugli bazen na naduvavanje sa ugrađenim sedištima i izolovanim dnom od 5 mm — onlajn set je fiksni model Ø 2 × 0,8 m (fabrički artikal RS2018, zid 10 cm). Uparuje se sa spoljnim grejačem (grejač nije uključen).',
    },
    labels: {},
    cats: { pool: 'Базени на надувавање' },
  },
  th: {
    titles: {
      'rectangular-drop-stitch-pool': 'สระว่ายน้ำแบบวางตะเข็บทรงสี่เหลี่ยม',
      'round-blue-drop-stitch-pool': 'สระว่ายน้ำทรงหยดน้ำสีน้ำเงินทรงกลม',
      'round-grey-drop-stitch-pool': 'สระว่ายน้ำทรงหยดน้ำสีเทาทรงกลม',
      'hot-tub-square-rect': 'สระแช่ตัวทรงสี่เหลี่ยมและสี่เหลี่ยมพร้อมที่นั่งในตัว',
      'hot-tub-round': 'สระแช่ตัวแบบเย็บแบบกลมพร้อมที่นั่งในตัว',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'สระว่ายน้ำแบบเป่าลมทรงสี่เหลี่ยมขนาดครอบครัว ขนาดครอบครัว ผนังแข็งแรง พองตัวได้รวดเร็ว และมีขนาดเล็กลง',
      'round-blue-drop-stitch-pool':
        'สระว่ายน้ำทรงหยดน้ำทรงกลมสีน้ำเงิน — สระน้ำสำหรับครอบครัวแบบคลาสสิกพร้อมผนังแรงดันสูงที่แข็งแกร่ง',
      'round-grey-drop-stitch-pool':
        'สระว่ายน้ำแบบเป่าลมทรงกลมสีเทาระดับพรีเมี่ยม — รูปลักษณ์ทันสมัย ผนังแข็งแรง เลือกฝาครอบที่เข้าชุดได้',
      'hot-tub-square-rect':
        'สระแช่ตัวแบบปักหล่นหุ้มฉนวนพร้อมที่นั่งในตัวและก้นหุ้มฉนวน 5 มม. — รุ่นสี่เหลี่ยมจัตุรัสและสี่เหลี่ยมผืนผ้าตั้งแต่ 1.5 × 1.5 × 0.8 ม. ถึง 3 × 2 × 1 ม. เชื่อมต่อกับเครื่องทำความร้อนภายนอก (ไม่รวม)',
      'hot-tub-round':
        'สระน้ำเป่าลมทรงกลมขนาดกะทัดรัดพร้อมที่นั่งในตัวและก้นหุ้มฉนวน 5 มม. — ชุดออนไลน์เป็นรุ่นคงที่ Ø 2 × 0.8 ม. (สินค้าจากโรงงาน RS2018 ผนัง 10 ซม.) จับคู่กับเครื่องทำความร้อนภายนอก (ไม่รวมเครื่องทำความร้อน)',
    },
    labels: {},
    cats: { pool: 'สระน้ำเป่าลม' },
  },
  tl: {
    titles: {
      'rectangular-drop-stitch-pool': 'Parihabang Inflatable Drop Stitch Swimming Pool',
      'round-blue-drop-stitch-pool': 'Pag - ikot ng Blue Inflatable Drop Stitch Swimming Pool',
      'round-grey-drop-stitch-pool': 'Round Gray Inflatable Drop Stitch Swimming Pool',
      'hot-tub-square-rect': 'Square at Rectangular Drop-Stitch Soaking Pool na may Mga Built-In na Upuan',
      'hot-tub-round': 'Round Drop-Stitch Soaking Pool na may Mga Built-In na Upuan',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'Family-size rectangular inflatable drop stitch swimming pool — mabilis na pumutok, matigas na pader, maliit na nakaimpake.',
      'round-blue-drop-stitch-pool':
        'Round blue inflatable drop stitch swimming pool — isang klasikong pool ng pamilya na may matibay na high-pressure na pader.',
      'round-grey-drop-stitch-pool':
        'Premium round gray inflatable drop stitch swimming pool — modernong hitsura, matibay na pader, opsyonal na katugmang takip.',
      'hot-tub-square-rect':
        'Insulated drop-stitch soaking pool na may built-in na upuan at 5 mm insulated bottom — parisukat at hugis-parihaba na mga modelo mula 1.5 × 1.5 × 0.8 m hanggang 3 × 2 × 1 m. Kumokonekta sa isang panlabas na pampainit (hindi kasama).',
      'hot-tub-round':
        'Compact round inflatable soaking pool na may built-in na upuan at 5 mm insulated bottom — ang online set ay ang fixed Ø 2 × 0.8 m na modelo (factory item RS2018, 10 cm wall). Mga pares sa isang panlabas na pampainit (hindi kasama ang pampainit).',
    },
    labels: {},
    cats: { pool: 'Mga Inflatable Pool' },
  },
  tr: {
    titles: {
      'rectangular-drop-stitch-pool': 'Dikdörtgen Şişme Damla Dikiş Yüzme Havuzu',
      'round-blue-drop-stitch-pool': 'Yuvarlak Mavi Şişme Damla Dikiş Yüzme Havuzu',
      'round-grey-drop-stitch-pool': 'Yuvarlak Gri Şişme Damla Dikiş Yüzme Havuzu',
      'hot-tub-square-rect': 'Yerleşik Koltuklu Kare ve Dikdörtgen Damla Dikiş Islatma Havuzu',
      'hot-tub-round': 'Yerleşik Koltuklu Yuvarlak Damla Dikişli Havuz',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'Aile boyutunda dikdörtgen şişirilebilir damla dikişli yüzme havuzu - hızlı şişer, sert duvarlar, küçük bir şekilde toplanır.',
      'round-blue-drop-stitch-pool':
        'Yuvarlak mavi şişme damla dikişli yüzme havuzu — sert, yüksek basınçlı duvarlara sahip klasik bir aile havuzu.',
      'round-grey-drop-stitch-pool':
        'Birinci sınıf yuvarlak gri şişme damla dikişli yüzme havuzu — modern görünüm, sert duvarlar, isteğe bağlı uyumlu kapak.',
      'hot-tub-square-rect':
        "Yerleşik koltuklara ve 5 mm yalıtımlı tabana sahip yalıtımlı damla dikişli ıslatma havuzu — 1,5 × 1,5 × 0,8 m'den 3 × 2 × 1 m'ye kadar kare ve dikdörtgen modeller. Harici bir ısıtıcıya bağlanır (dahil değildir).",
      'hot-tub-round':
        'Yerleşik koltuklara ve 5 mm yalıtımlı tabana sahip kompakt yuvarlak şişme havuz — çevrimiçi set, sabit Ø 2 × 0,8 m modelidir (fabrika ürünü RS2018, 10 cm duvar). Harici bir ısıtıcıyla eşleşir (ısıtıcı dahil değildir).',
    },
    labels: {},
    cats: { pool: 'Şişme Havuzlar' },
  },
  uk: {
    titles: {
      'rectangular-drop-stitch-pool': 'Прямокутний надувний плавальний басейн',
      'round-blue-drop-stitch-pool': 'Круглий блакитний надувний плавальний басейн',
      'round-grey-drop-stitch-pool': 'Круглий сірий надувний плавальний басейн',
      'hot-tub-square-rect': 'Квадратний і прямокутний басейн із вбудованими сидіннями',
      'hot-tub-round': 'Круглий басейн із вбудованими сидіннями',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        'Прямокутний надувний плавальний басейн сімейного розміру — швидко надувається, жорсткі стінки, компактна упаковка.',
      'round-blue-drop-stitch-pool':
        'Круглий синій надувний басейн з крапельним стічком — класичний сімейний басейн з жорсткими стінками високого тиску.',
      'round-grey-drop-stitch-pool':
        'Круглий сірий надувний плавальний басейн преміум-класу — сучасний вигляд, жорсткі стінки, додаткове покриття в тон.',
      'hot-tub-square-rect':
        'Утеплений басейн із вбудованими сидіннями та ізольованим дном 5 мм — квадратні та прямокутні моделі від 1,5 × 1,5 × 0,8 м до 3 × 2 × 1 м. Підключається до зовнішнього обігрівача (не входить в комплект).',
      'hot-tub-round':
        'Компактний круглий надувний басейн з вбудованими сидіннями та утепленим дном 5 мм — онлайн набір фіксована модель Ø 2 × 0,8 м (заводська арт. RS2018, стінка 10 см). Поєднується із зовнішнім обігрівачем (обігрівач в комплект не входить).',
    },
    labels: {},
    cats: { pool: 'Надувні басейни' },
  },
  uz: {
    titles: {
      'rectangular-drop-stitch-pool': "To'rtburchaklar shishiriladigan tomchi tikuvli suzish havzasi",
      'round-blue-drop-stitch-pool': 'Dumaloq moviy shishiriladigan tomchi tikuvli suzish havzasi',
      'round-grey-drop-stitch-pool': 'Dumaloq kulrang shishiriladigan tomchi tikuvli suzish havzasi',
      'hot-tub-square-rect': "O'rnatilgan o'rindiqli kvadrat va to'rtburchaklar cho'zilgan cho'milish havzasi",
      'hot-tub-round': 'Oʻrnatilgan oʻrindiqli dumaloq choʻzilgan suv havzasi',
    },
    summaries: {
      'rectangular-drop-stitch-pool':
        "Oilaviy o'lchamdagi to'rtburchaklar shaklidagi shishiriladigan tikilgan suzish havzasi - tez shishiradi, qattiq devorlar, kichik paketlar.",
      'round-blue-drop-stitch-pool':
        "Dumaloq ko'k shishiriladigan suzish havzasi - qattiq yuqori bosimli devorlarga ega klassik oilaviy basseyn.",
      'round-grey-drop-stitch-pool':
        "Premium dumaloq kulrang shishiriladigan tikilgan suzish havzasi - zamonaviy ko'rinish, qattiq devorlar, ixtiyoriy mos keladigan qopqoq.",
      'hot-tub-square-rect':
        "O'rnatilgan o'rindiqli va 5 mm izolyatsiyalangan pastki qismli izolyatsiyalangan tomchi tikish ho'llash hovuzi - 1,5 × 1,5 × 0,8 m dan 3 × 2 × 1 m gacha bo'lgan kvadrat va to'rtburchaklar modellar. Tashqi isitgichga ulanadi (qo'shilmaydi).",
      'hot-tub-round':
        "O'rnatilgan o'rindiqlari va 5 mm izolyatsiyalangan pastki qismi bo'lgan ixcham dumaloq shishiriladigan suv havzasi - onlayn to'plam Ø 2 × 0,8 m o'lchamdagi fiksatsiyalangan modeldir (RS2018 zavod elementi, devori 10 sm). Tashqi isitgich bilan juftlik (isitgich qo'shilmaydi).",
    },
    labels: {},
    cats: { pool: 'Puflanadigan basseynlar' },
  },
};

const SKILL_L10N: Record<string, Record<string, string>> = {};

export function localizeProductData<
  T extends {
    slug: string;
    title: string;
    summary?: string;
    category?: string;
    categoryLabel?: string;
    specs?: Array<{ label: string; value: string }>;
    skill?: string;
    metadata?: { title?: string; description?: string };
  },
>(p: T, lang: string): T {
  if (lang === 'en') return p;
  const l = PRODUCT_L10N[lang];
  if (!l) return p;
  const out: T = { ...p };
  if (l.titles[out.slug]) {
    out.title = l.titles[out.slug];
  }
  if (out.metadata) {
    out.metadata = { ...out.metadata, description: undefined };
    if (l.titles[out.slug]) {
      out.metadata = { ...out.metadata, title: undefined };
    }
  }
  if (l.summaries[out.slug]) out.summary = l.summaries[out.slug];
  if (out.category && l.cats[out.category]) out.categoryLabel = l.cats[out.category];
  if (Array.isArray(out.specs)) {
    out.specs = out.specs.map((sp) => ({ ...sp, label: l.labels[sp.label] ?? sp.label }));
  }
  if (out.skill && SKILL_L10N[lang]?.[out.skill]) out.skill = SKILL_L10N[lang][out.skill];
  return out;
}
