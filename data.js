// Contenido del dashboard de Campaña Q3 2026 — Gala SA
// Todo el contenido está hardcodeado acá, tal como lo define el brief.

const UNITS = [
  {
    id: "casino-gala",
    name: "Casino Gala",
    subtitle: "7 salas · cuenta única centralizada · Mundial de la Suerte → La Experiencia (Sala Central)",
    accent: "#C9A84C",
    logo: "assets/logos/casino-gala.png",
    objective: "Posicionar a Casino Gala como la principal experiencia de entretenimiento de la región, aumentando tráfico a salas, recurrencia de juego y fidelización mediante beneficios exclusivos.",
    pilares: "Sorteos y activaciones · Pozos activos · Ganadores reales · Experiencia en sala · Beneficios Boxie · Comunidad de jugadores",
    months: {
      junio: [
        { tags: ["contenido", "pautar"], meta: "1 jun", title: "Anuncio Sorteo Sala Castelli", desc: "El Mundial de la Suerte arranca en Sala Castelli · 11 de junio · Smart TV, celular, auriculares", likes: 7 },
        { tags: ["contenido"], meta: "2 jun", title: "Cupones BOXIE acumulados", desc: "No canjees tus cupones, sumalos para el Mundial de la Suerte · motos, Smart TV, celular, camiseta", likes: 20 },
        { tags: ["contenido", "pautar"], meta: "4 jun", title: "Anuncio Sorteo Sala Ruta 11", desc: "\"No alcanza con entrar a la cancha\" · próxima parada Sala Ruta 11 · 17 de junio", likes: 22 },
        { tags: ["contenido"], meta: "5 jun", title: "Sorteo Sala Ruta 11 — premios", desc: "Smart TV 43\", celular, auriculares · 17 de junio", likes: 9 },
        { tags: ["contenido", "pautar"], meta: "10 jun", title: "Anuncio Sorteo Sala Güemes", desc: "Moto 110cc, Smart TV, $300.000 en Boxie · 26 de junio", likes: 7 },
        { tags: ["contenido"], meta: "21 jun", title: "Promo BOXIE previa del partido", desc: "Lunes 22, de 12 a 18 hs: duplicás puntos y baja el precio de canje", likes: 6 },
        { tags: ["contenido"], meta: "24 jun", title: "Argentina ya sumó 2 victorias", desc: "Anticipo Sala Barranqueras · 7 de julio · Smart TV, celular, auriculares", likes: 3 },
        { tags: ["contenido"], meta: "30 jun", title: "Ganadores de Castelli y Ruta 11", desc: "Resumen de ganadores · anticipo próxima fecha en Sala Barranqueras · 7 de julio", likes: 14 }
      ],
      julio: [
        { tags: ["auto-detectado", "contenido"], meta: "2 jul", title: "Argentina ya está en 16avos", desc: "Anticipo Sala Sáenz Peña · 14 de julio · Moto 110, Smart TV, $300.000 en créditos Boxie", likes: 2, shares: 0, igId: "DaSoOAQE2Qw" },
        { tags: ["auto-detectado", "contenido", "pautar"], meta: "3 jul", title: "Carrusel ganadores Sala Güemes", desc: "Resultados y ganadores del sorteo del 26 de junio", likes: 8, shares: 2, igId: "DaVcNQ3jOI_" },
        { tags: ["contenido", "pautar"], meta: "6 jul · lunes", title: "Reel — lo que vamos viviendo", desc: "Clima y ambiente de campaña del Mundial de la Suerte" },
        { tags: ["reel", "auto-detectado"], meta: "7 jul", title: "EL PRIMER GANADOR YA HIZO HISTORIA.", desc: "🏆 EL PRIMER GANADOR YA HIZO HISTORIA. Así se vivió el debut de El Mundial de la Suerte en Sala Castelli. La emoción ya empezó a recorrer...", likes: 6, views: 595, shares: 2, igId: "DafpzyhiREF" },
        { tags: ["sorteo"], meta: "7 jul · Sala Barranqueras", title: "Sorteo Mundial", desc: "Premios propios de sala · BOXIE · feed publicado, resta solo historia" },
        { tags: ["flyer", "auto-detectado"], meta: "8 jul", title: "EL MOMENTO QUE TODOS ESTABAN ESPERANDO ESTÁ CADA VEZ MÁS CERCA.", desc: "🏆 EL MOMENTO QUE TODOS ESTABAN ESPERANDO ESTÁ CADA VEZ MÁS CERCA. Durante semanas recorrimos nuestras salas, vivimos noches inolvidables...", likes: 4, shares: 0, igId: "DaifIR7HNt5" },
        { tags: ["sorteo", "campaña", "pautar"], meta: "8 jul · martes", title: "Anuncio Sorteo Final", desc: "Comunicación del Gran Sorteo Final en Sala Central" },
        { tags: ["sorteo", "pautar"], meta: "9 jul · jueves", title: "Ganadores Sala Barranqueras", desc: "Publicación de los ganadores del sorteo del 7 de julio" },
        { tags: ["reel", "auto-detectado"], meta: "10 jul", title: "¡QUÉ PARTIDO, ARGENTINA!", desc: "🇦🇷🔥 ¡QUÉ PARTIDO, ARGENTINA! 🔥🇦🇷 Cuando parecía imposible, apareció el corazón de un equipo que nunca dejó de creer. Del 0-2 al 3-2. Una...", likes: 11, views: 624, shares: 4, igId: "Dan2IALCj91" },
        { tags: ["sorteo"], meta: "14 jul · Sala Sáenz Peña", title: "Sorteo Mundial", desc: "Premios propios de sala · BOXIE · feed publicado, resta solo historia" },
        { tags: ["sorteo", "campaña", "pautar"], highlight: true, meta: "19 jul · Sala Central 21:00 hs", title: "Gran Sorteo Final", desc: "Cierre Mundial de la Suerte · anuncio sorpresa La Experiencia al final de la noche" },
        { tags: ["sorteo", "campaña", "pautar"], meta: "21 jul", title: "Resumen Sorteo Final", desc: "Recap del Gran Sorteo Final en Sala Central" },
        { tags: ["La Experiencia", "contenido", "pautar"], meta: "22 jul · miércoles", title: "Recordamos el primer día de La Experiencia", desc: "Recap de la primera noche · recordatorio: La Experiencia es todos los miércoles" },
        { tags: ["contenido"], meta: "Todo julio", title: "Publicación casi diaria", desc: "Sala → premios → ganadores al día siguiente → próximo sorteo → BOXIE" },
        { tags: ["planificado, no publicado", "lanzamiento", "pautar"], meta: "12 jul", title: "Lanzamiento La Experiencia", desc: "Imagen ruleta EGT · crédito promo en ruleta · tragos en blackjack con dealer" }
      ],
      agosto: [
        { tags: ["La Experiencia", "contenido", "pautar"], meta: "1–7 ago", title: "Reel ruleta EGT en acción", desc: "Mostrar la máquina funcionando · ambiente · jugadores" },
        { tags: ["La Experiencia", "contenido"], meta: "Agosto", title: "Blackjack con dealer", desc: "Contenido del dealer en mesa · ambiente social · tragos incluidos" },
        { tags: ["La Experiencia", "acción"], meta: "Agosto", title: "BOXIE + ruleta electrónica", desc: "Vincular puntos BOXIE al juego en ruleta EGT · crédito promocional" },
        { tags: ["contenido", "pautar selectivo"], meta: "Todo agosto", title: "BOXIE · Hora BOXIE · Premium Martes", desc: "Pozos activos · reels de pozos · fidelización" }
      ],
      septiembre: [
        { tags: ["La Experiencia", "contenido", "pautar"], meta: "Septiembre", title: "Contenido de ambiente y jugadores", desc: "Testimonios · noche en sala · dealer en acción" },
        { tags: ["La Experiencia", "acción", "pautar"], meta: "Septiembre", title: "Noche especial La Experiencia", desc: "Evento puntual en Sala Central · reforzar concepto de noche diferente" },
        { tags: ["contenido"], meta: "Todo septiembre", title: "BOXIE · pozos · Premium Martes", desc: "Contenido de fidelización permanente" },
        { tags: ["pendiente"], meta: "", title: "Nueva campaña masiva Q4", desc: "Diseñar en septiembre para lanzar en octubre" }
      ]
    },
    performance: { history: [
        { date: "2026-07-12", views: 94, likes: 0, comments: 0, shares: 0, saves: 0, interactions: 0, reach: 19, profileViews: 10, followers: 3625, followersDelta: 0, fbFollowers: 3088 }
      ] }
  },
  {
    id: "valentino-restaurant",
    name: "Valentino Restaurant",
    subtitle: "Amerian Hotel Casino Gala · cenas temáticas mensuales · delivery · reservas Riservi",
    accent: "#8B2635",
    logo: "assets/logos/valentino.png",
    objective: "Que Valentino sea percibido como el restaurante premium de referencia en Resistencia para vivir experiencias gastronómicas memorables.",
    pilares: "Platos destacados · Chef y cocina · Maridajes · Eventos especiales · Experiencia gourmet",
    channels: "Pedidos Ya · FUDO · Riservi · Teléfono · Recepción hotel · Paquete fidelización (en desarrollo)",
    months: {
      junio: [
        { tags: ["contenido"], meta: "1 jun", title: "Sugerencia del Chef", desc: "Solomillo glaseado a la barbacoa con chips de boniato frito · $20.000", likes: 8 },
        { tags: ["reel", "auto-detectado"], meta: "4 jun", title: "Así se vivió 𝑺𝒂𝒑𝒐𝒓𝒊 𝒆 𝑽𝒊𝒏𝒐 en Valentino Restaurant", desc: "🇮🇹🍷 Así se vivió 𝑺𝒂𝒑𝒐𝒓𝒊 𝒆 𝑽𝒊𝒏𝒐 en Valentino Restaurant 🇮🇹🍷 . Vivimos una experiencia gastronómica única donde los sabores más auténticos...", likes: 51, igId: "DZKrWGDgkHd", shares: 20, views: 1918 },
        { tags: ["colaboración", "contenido"], meta: "8 jun", title: "Sapori e Vino — agradecimiento", desc: "Recap de la cena maridaje italiana junto a Bodega Séptima (evento del 3 de junio)", likes: 24 },
        { tags: ["promoción"], meta: "11 jun", title: "Promo Día del Padre", desc: "2x1 en botellas de Terrazas de los Andes Reserva Malbec", likes: 4 },
        { tags: ["contenido"], meta: "12 jun", title: "Sugerencia del Chef", desc: "Lomo braseado con risotto de hongos y nueces · $28.700", likes: 5 },
        { tags: ["promoción"], meta: "19 jun", title: "Día del Padre", desc: "Papá recibe una copa de vino de regalo con su almuerzo o cena", likes: 4 },
        { tags: ["carrusel", "auto-detectado"], meta: "27 jun", title: "CENA TEMÁTICA ARGENTINA | Una noche para celebrar nuestros sabores...", desc: "🍷🇦🇷 CENA TEMÁTICA ARGENTINA | Una noche para celebrar nuestros sabores 🇦🇷⁣⁣⁣⁣ ⁣⁣⁣⁣ Te invitamos a vivir una Cena de Maridaje con Temática...", likes: 17, igId: "DaGa54UH5OC", shares: 8 }
      ],
      julio: [
        { tags: ["contenido", "pautar"], meta: "28 jun–7 jul", title: "Lanzamiento Cena Temática Argentina", desc: "Flyer feed · historia · copy WhatsApp · carga Riservi · Humand" },
        { tags: ["flyer", "auto-detectado"], meta: "6 jul", title: "𝐒𝐮𝐠𝐞𝐫𝐞𝐧𝐜𝐢𝐚 𝐝𝐞𝐥 𝐂𝐡𝐞𝐟 ‍", desc: "✨𝐒𝐮𝐠𝐞𝐫𝐞𝐧𝐜𝐢𝐚 𝐝𝐞𝐥 𝐂𝐡𝐞𝐟 ✨👨‍🍳 . Una propuesta que invita a disfrutar: Trucha Patagónica, sobre cremoso de calabaza, acompañada de papines dor...", likes: 3, comments: 1, igId: "DadEtton1Yn", shares: 1 },
        { tags: ["carrusel", "auto-detectado"], meta: "6 jul", title: "CENA TEMÁTICA ARGENTINA | Una noche para celebrar nuestros sabores...", desc: "🍷🇦🇷 CENA TEMÁTICA ARGENTINA | Una noche para celebrar nuestros sabores 🇦🇷⁣⁣⁣⁣ ⁣⁣⁣⁣. Te invitamos a vivir una Cena de Maridaje con Temátic...", likes: 6, igId: "DadSZYgn3Yn", shares: 3 },
        { tags: ["cena temática", "pautar", "auto-detectado"], highlight: true, meta: "11 jul", title: "Cena Temática Argentina", desc: "Bodega Terrazas de los Andes · Sommelier Carlos Daownie · menú por pasos · maridaje (evento 8 jul, recap publicado 11 jul)", likes: 26, comments: 1, shares: 2, igId: "DaqBcqRH-aF" },
        { tags: ["contenido"], meta: "Todo julio", title: "Menú ejecutivo · sugerencia del chef", desc: "2–3 piezas semanales · feed e historias" },
        { tags: ["canales", "pautar"], meta: "Julio", title: "Lanzamiento Pedidos Ya · FUDO · Riservi", desc: "Comunicar canales digitales en redes y WhatsApp" }
      ],
      agosto: [
        { tags: ["pendiente"], meta: "", title: "Cena temática agosto", desc: "Fecha y concepto a confirmar 10 días antes" },
        { tags: ["contenido"], meta: "Agosto", title: "Menú ejecutivo · sugerencia del chef", desc: "2–3 piezas semanales" },
        { tags: ["canales"], meta: "Agosto", title: "Recordatorio canales digitales", desc: "Pedidos Ya · FUDO · Riservi" },
        { tags: ["fidelización"], meta: "Agosto", title: "Paquete de fidelización", desc: "Diseño del concepto · definir beneficios · canal de activación" }
      ],
      septiembre: [
        { tags: ["pendiente"], meta: "", title: "Cena temática septiembre", desc: "Fecha y concepto a confirmar 10 días antes" },
        { tags: ["contenido"], meta: "Septiembre", title: "Menú ejecutivo · sugerencia del chef", desc: "2–3 piezas semanales" },
        { tags: ["canales"], meta: "Septiembre", title: "Recordatorio canales digitales", desc: "" },
        { tags: ["fidelización", "pautar"], meta: "Septiembre", title: "Lanzamiento paquete fidelización", desc: "Si diseño listo en agosto · comunicación a base de clientes" }
      ]
    },
    performance: { history: [
        { date: "2026-07-12", views: 365, likes: 4, comments: 0, shares: 0, saves: 0, interactions: 4, reach: 113, profileViews: 15, followers: 6447, followersDelta: 0, fbFollowers: 7096 }
      ] }
  },
  {
    id: "resto-ruta-11",
    name: "Resto Ruta 11",
    subtitle: "Gala Hotel & Convenciones · Desafío de Sommelier · FUDO · Riservi",
    accent: "#C4621A",
    logo: "assets/logos/resto-ruta-11.png",
    objective: "Que Ruta 11 sea la parada gastronómica elegida para disfrutar buena comida en un entorno relajado y diferencial.",
    pilares: "Menú diario · Platos estrella · Promociones · Eventos especiales · Experiencia del lugar",
    channels: "FUDO · Riservi · Teléfono / recepción",
    months: {
      junio: [
        { tags: ["contenido", "pautar"], meta: "9 jun", title: "Anuncio Cena Maridaje Ruca Malén", desc: "19 de junio · Sommelier Carlos Downie · menú de 3 pasos", likes: 14 },
        { tags: ["contenido", "pautar"], meta: "12 jun", title: "Anuncio Cena Maridaje Ruca Malén", desc: "Segunda pieza de la campaña · 19 de junio · $40.000 por persona", likes: 61, comments: 2 },
        { tags: ["promoción"], meta: "19 jun", title: "Día del Padre", desc: "Copa de vino de regalo para acompañar el almuerzo o cena", likes: 1 },
        { tags: ["contenido"], meta: "22 jun", title: "Cena Maridaje Ruca Malén — recap", desc: "Reel de la experiencia junto a Bodega Ruca Malén", likes: 23 },
        { tags: ["contenido"], meta: "24 jun", title: "Cena Maridaje Ruca Malén — fotos", desc: "Agradecimiento a los asistentes de la cena maridaje", likes: 21, comments: 3 },
        { tags: ["contenido"], meta: "25 jun", title: "Sugerencia del Chef", desc: "Suprema a la Riojana con papas cuñas · $19.000", likes: 13, comments: 1 }
      ],
      julio: [
        { tags: ["reel", "auto-detectado"], meta: "7 jul", title: "️𝐖𝐈𝐍𝐄 𝐎𝐅𝐅 – La Batalla de Copas en Restó Ruta 11 ️", desc: "🍷⚔️𝐖𝐈𝐍𝐄 𝐎𝐅𝐅 – La Batalla de Copas en Restó Ruta 11 ⚔️🍷 . Una experiencia donde cada plato tiene dos historias y vos decidís cuál se lleva...", likes: 19, views: 1084, shares: 7, igId: "DagOAQWibPv" },
        { tags: ["flyer", "auto-detectado"], meta: "11 jul", title: "️𝐒𝐔𝐆𝐄𝐑𝐄𝐍𝐂𝐈𝐀 𝐃𝐄𝐋 𝐂𝐇𝐄𝐅 ️", desc: "🍽️✨𝐒𝐔𝐆𝐄𝐑𝐄𝐍𝐂𝐈𝐀 𝐃𝐄𝐋 𝐂𝐇𝐄𝐅 ✨🍽️ . Descubrí la nueva sugerencia de nuestro chef, una propuesta que combina tradición y calidad desde el primer...", likes: 5, shares: 5, igId: "Dap5zchH0dA" },
        { tags: ["carrusel", "auto-detectado"], meta: "11 jul", title: "️ 𝐖𝐈𝐍𝐄 𝐎𝐅𝐅 – La Batalla de Copas en Restó Ruta 11 ️", desc: "🍷⚔️ 𝐖𝐈𝐍𝐄 𝐎𝐅𝐅 – La Batalla de Copas en Restó Ruta 11 ⚔️🍷 . Una experiencia donde cada plato tiene dos historias... y vos decidís cuál se l...", likes: 27, shares: 12, igId: "DaqDGp0Hz-6" },
        { tags: ["cena maridaje", "evento especial", "pautar"], meta: "Fecha a confirmar · julio", title: "Desafío de Sommelier", desc: "2 sommeliers (Juan Chichizola y El Tano) · 2 vinos · cata a ciegas · los clientes votan al ganador" },
        { tags: ["contenido"], meta: "10 días antes del evento", title: "Presentación Juan Chichizola", desc: "Quién es · su propuesta · generar expectativa" },
        { tags: ["contenido"], meta: "10 días antes del evento", title: "Presentación El Tano", desc: "Quién es · su propuesta · el duelo está servido" },
        { tags: ["contenido", "pautar"], meta: "Días previos", title: "Recordatorio + reservas", desc: "Copy WhatsApp · historia · carga Riservi · Humand" },
        { tags: ["contenido"], meta: "Post-evento", title: "Revelación del ganador", desc: "Foto de la noche · sommelier ganador · vino elegido" },
        { tags: ["contenido"], meta: "Todo julio", title: "Sugerencia del chef", desc: "2 piezas semanales · feed e historias" },
        { tags: ["canales", "pautar"], meta: "Julio", title: "Lanzamiento FUDO + Riservi", desc: "" }
      ],
      agosto: [
        { tags: ["pendiente"], meta: "", title: "Cena especial agosto", desc: "Slot reservado, formato y fecha a confirmar" },
        { tags: ["contenido"], meta: "Agosto", title: "Sugerencia del chef", desc: "2 piezas semanales" },
        { tags: ["canales"], meta: "Agosto", title: "Recordatorio FUDO + Riservi", desc: "" },
        { tags: ["a evaluar"], meta: "Agosto", title: "¿Desafío de Sommelier Ronda 2?", desc: "Si el evento de julio funciona, evaluar repetir" }
      ],
      septiembre: [
        { tags: ["pendiente"], meta: "", title: "Cena especial septiembre", desc: "Slot reservado, formato y fecha a confirmar" },
        { tags: ["contenido"], meta: "Septiembre", title: "Sugerencia del chef", desc: "2 piezas semanales" },
        { tags: ["canales"], meta: "Septiembre", title: "Recordatorio FUDO + Riservi", desc: "" },
        { tags: ["contenido", "pautar selectivo"], meta: "Septiembre", title: "Contenido behind the scenes", desc: "Cocina · chef en acción · reels cortos" }
      ]
    },
    performance: { history: [
        { date: "2026-07-12", views: 322, likes: 0, comments: 0, shares: 0, saves: 0, interactions: 0, reach: 137, profileViews: 7, followers: 1184, followersDelta: 0, fbFollowers: 134 }
      ] }
  },
  {
    id: "amerian-hotel",
    name: "Amerian Hotel Casino Gala",
    subtitle: "Posicionamiento de marca · colaboración con Valentino Restaurant · generación de banco visual",
    accent: "#0C447C",
    logo: "assets/logos/amerian.png",
    objective: "Que cuando alguien decida venir a Resistencia, Amerian sea la primera opción que tenga en la cabeza.",
    pilares: "Habitaciones · Servicios (spa, piscina, gimnasio, bar) · Gastronomía (Valentino) · Ubicación estratégica · Experiencia premium",
    months: {
      junio: [
        { tags: ["contenido"], meta: "7 jun", title: "Testimonio de Carmen Barbieri", desc: "Video agradeciendo su estadía junto a su equipo de trabajo (mención de una figura pública)", likes: 275 },
        { tags: ["colaboración"], meta: "9 jun", title: "Evento privado — CPCE Chaco", desc: "Fiesta del Consejo Profesional de Ciencias Económicas del Chaco, mencionada por el proveedor de barra", likes: 57 },
        { tags: ["colaboración"], meta: "12 jun", title: "Evento \"Geral\"", desc: "Presentación registrada por Magina Films en el hotel", likes: 120 }
      ],
      julio: [
        { tags: ["producción"], meta: "Todo julio", title: "Sesión de fotos y video", desc: "Habitaciones · piscina · spa · bar · lobby · Valentino · exteriores. Banco para los 3 meses." },
        { tags: ["contenido", "pautar"], meta: "Julio", title: "Presentación del hotel", desc: "Serie de piezas por espacio. Con fotos existentes mientras llega el material nuevo." },
        { tags: ["contenido", "pautar"], meta: "Julio", title: "¿Por qué Resistencia?", desc: "Ciudad + hotel como base ideal. Atractivos locales, conectividad, centro." },
        { tags: ["Humand"], meta: "Julio", title: "Novedades del hotel para colaboradores Gala SA", desc: "" },
        { tags: ["planificado, no publicado", "colaboración", "pautar"], meta: "8 jul", title: "Cena Temática Argentina · Valentino", desc: "Post en colaboración desde cuenta del hotel." }
      ],
      agosto: [
        { tags: ["contenido", "pautar"], meta: "Agosto", title: "Reels de espacios", desc: "Habitación · piscina · spa · bar. Un reel por espacio, aspiracionales." },
        { tags: ["contenido", "pautar"], meta: "Agosto", title: "Experiencia completa", desc: "Check-in → habitación → Valentino → piscina → check-out." },
        { tags: ["posicionamiento", "pautar"], meta: "Agosto", title: "El mejor hotel de Resistencia", desc: "Mensaje directo. Para quien viene por negocios, turismo o eventos." },
        { tags: ["colaboración"], meta: "Agosto", title: "Cena temática agosto · Valentino", desc: "Post en colaboración cuando se confirme." },
        { tags: ["Humand"], meta: "Agosto", title: "Novedades del hotel para colaboradores Gala SA", desc: "" }
      ],
      septiembre: [
        { tags: ["posicionamiento", "pautar"], meta: "Septiembre", title: "Campaña de posicionamiento", desc: "“Si venís a Resistencia, acá es.”" },
        { tags: ["contenido", "pautar selectivo"], meta: "Septiembre", title: "Corporativo y eventos", desc: "Salones, reuniones, servicios para grupos." },
        { tags: ["colaboración"], meta: "Septiembre", title: "Cena temática septiembre · Valentino", desc: "Post en colaboración cuando se confirme." },
        { tags: ["contenido"], meta: "Septiembre", title: "Valentino + hotel", desc: "Cruce gastronómico como parte de la estadía." },
        { tags: ["Humand"], meta: "Septiembre", title: "Novedades del hotel para colaboradores Gala SA", desc: "" }
      ]
    },
    performance: { history: [
        { date: "2026-07-12", views: 164, likes: 0, comments: 0, shares: 0, saves: 0, interactions: 0, reach: 7, profileViews: 12, followers: 8799, followersDelta: 0, fbFollowers: 15650 }
      ] }
  },
  {
    id: "gala-hotel-convenciones",
    name: "Gala Hotel & Convenciones",
    subtitle: "Posicionamiento · eventos y convenciones · colaboración con Resto Ruta 11 · generación de banco visual",
    accent: "#3B6D11",
    logo: "assets/logos/gala-hotel-convenciones.png",
    objective: "Posicionar a Gala Hotel como el espacio ideal para hospedaje, eventos y experiencias de alto nivel en la región.",
    pilares: "Habitaciones · Servicios · Salones y eventos · Gastronomía · Experiencias corporativas y sociales",
    months: {
      junio: [
        { tags: ["colaboración"], meta: "17 jun", title: "Mención en Ciudad TV Chaco", desc: "Nota sobre la Cena Maridaje de Resto Ruta 11 con el sommelier Carlos Downie", likes: 18 },
        { tags: ["colaboración"], meta: "18 jun", title: "Evento — boda", desc: "Fotógrafo de bodas etiqueta al hotel como sede del evento", likes: 59 },
        { tags: ["pendiente"], meta: "", title: "Cuenta propia con poca publicación directa", desc: "En junio casi todo el contenido llegó por etiquetas de proveedores/prensa, no publicaciones propias" }
      ],
      julio: [
        { tags: ["producción"], meta: "Todo julio", title: "Sesión de fotos y video", desc: "Salones · habitaciones · exteriores · Ruta 11 · lobby." },
        { tags: ["contenido", "pautar"], meta: "Julio", title: "Presentación del hotel", desc: "Serie de piezas por espacio con fotos existentes." },
        { tags: ["posicionamiento", "pautar"], meta: "Julio", title: "El espacio para tu evento", desc: "Capacidad de salones, servicios integrales, respaldo profesional." },
        { tags: ["colaboración", "pautar"], meta: "Julio", title: "Desafío de Sommelier · Ruta 11", desc: "Post en colaboración desde cuenta del hotel." },
        { tags: ["Humand"], meta: "Julio", title: "Novedades del hotel para colaboradores Gala SA", desc: "" }
      ],
      agosto: [
        { tags: ["contenido", "pautar"], meta: "Agosto", title: "Reels de salones y espacios", desc: "Salón montado · detalles · capacidad. Para organizadores de eventos." },
        { tags: ["contenido", "pautar"], meta: "Agosto", title: "Experiencia de estadía", desc: "Habitaciones · servicios · confort." },
        { tags: ["colaboración"], meta: "Agosto", title: "Cena especial agosto · Ruta 11", desc: "Post en colaboración cuando se confirme." },
        { tags: ["Humand"], meta: "Agosto", title: "Novedades del hotel para colaboradores Gala SA", desc: "" }
      ],
      septiembre: [
        { tags: ["posicionamiento", "pautar"], meta: "Septiembre", title: "Campaña de posicionamiento", desc: "“El lugar de Resistencia donde pasan los eventos que importan.”" },
        { tags: ["contenido", "pautar selectivo"], meta: "Septiembre", title: "Corporativo y convenciones", desc: "Empresas, instituciones, servicios para grupos." },
        { tags: ["colaboración"], meta: "Septiembre", title: "Cena especial septiembre · Ruta 11", desc: "Post en colaboración cuando se confirme." },
        { tags: ["contenido", "pautar"], meta: "Septiembre", title: "Anticipo temporada alta", desc: "Disponibilidad de salones para recepciones nov–dic." },
        { tags: ["Humand"], meta: "Septiembre", title: "Novedades del hotel para colaboradores Gala SA", desc: "" }
      ]
    },
    performance: { history: [
        { date: "2026-07-12", views: 624, likes: 6, comments: 0, shares: 1, saves: 2, interactions: 10, reach: 9, profileViews: 43, followers: 19533, followersDelta: 0, fbFollowers: 17824 }
      ] }
  },
  {
    id: "gala-recepciones",
    name: "Gala Recepciones",
    subtitle: "17 noches nov–dic · educación ecommerce · acciones mensuales · BOX de comida en septiembre",
    accent: "#72243E",
    logo: "assets/logos/gala-recepciones.png",
    objective: "Posicionar a Gala como el lugar de referencia para eventos sociales y corporativos, ofreciendo experiencias memorables de principio a fin.",
    pilares: "Eventos realizados · Salones · Montajes y ambientación · Testimonios · Producción integral · Experiencias memorables",
    channels: "WhatsApp (principal) · Redes sociales (novedades) · Ecommerce (eventosgala.com.ar)",
    months: {
      junio: [],
      julio: [
        { tags: ["promoción", "pautar"], meta: "1–17 jul", title: "5% de descuento en ecommerce", desc: "Para padres que paguen online hasta el 17 de julio." },
        { tags: ["promoción", "WhatsApp"], meta: "17 jul", title: "Extensión una semana más", desc: "“Extendemos el descuento hasta el 24 de julio.” Comunicar ese mismo día." },
        { tags: ["ecommerce", "contenido"], meta: "Julio", title: "¿Cómo usar la plataforma?", desc: "Paso a paso: contraseña · ingresar · pagar · descargar factura." },
        { tags: ["ecommerce", "WhatsApp"], meta: "Julio", title: "Beneficios de pagar online", desc: "Comodidad · desde casa · facturas disponibles · sin filas." }
      ],
      agosto: [
        { tags: ["pendiente"], meta: "", title: "Acción de agosto", desc: "Incentivo mensual a confirmar. Puede ser sorteo, beneficio o nuevo descuento." },
        { tags: ["ecommerce", "WhatsApp"], meta: "Agosto", title: "Recordatorio plataforma", desc: "Para padres que no ingresaron. “Todavía estás a tiempo.”" },
        { tags: ["contenido", "pautar selectivo"], meta: "Agosto", title: "Novedades en redes", desc: "Detrás de escena de una recepción Gala." },
        { tags: ["contenido"], meta: "Agosto", title: "Anticipo BOX de comida", desc: "“Algo nuevo llega en septiembre.” Generar intriga." }
      ],
      septiembre: [
        { tags: ["BOX de comida", "pautar"], meta: "Septiembre", title: "Lanzamiento BOX Clásico y BOX Gourmet", desc: "Nuevo producto de Gala Recepciones. “Tenés todo con nosotros.”" },
        { tags: ["contenido", "WhatsApp"], meta: "Septiembre", title: "17 noches · nov–dic", desc: "Recordar a padres que completen pagos antes de la temporada." },
        { tags: ["promoción"], meta: "Septiembre", title: "Acción del mes", desc: "A definir. Puede vincularse al BOX o al cierre de pagos." },
        { tags: ["contenido", "pautar"], meta: "Septiembre", title: "Redes · detrás de escena", desc: "Preparativos, salones, detalles de una recepción Gala." }
      ]
    },
    performance: { history: [
        { date: "2026-07-12", views: 32, likes: 0, comments: 0, shares: 0, saves: 0, interactions: 0, reach: 3, profileViews: 1, followers: 506, followersDelta: 0, fbFollowers: 1 }
      ] }
  }
];

// Tareas de desarrollo interno (no son publicaciones de redes, comparten el mismo panel colaborativo)
const DEV_TASKS = [
  { tags: [], meta: "", title: "CRM Valentino", desc: "Implementación del CRM para Valentino Restaurant." },
  { tags: [], meta: "", title: "CRM Ruta 11", desc: "Implementación del CRM para Resto Ruta 11." },
  { tags: [], meta: "", title: "Página web Casino", desc: "Desarrollo de la página web de Casino Gala." }
];
