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
