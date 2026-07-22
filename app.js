// Gala Social Studio — prototipo de rediseño (panel de contenido).
// Usa el mismo data.js del dashboard actual, solo cambia la presentación.
// El "estado" (borrador/listo/programado) y las recomendaciones de la
// sección Ideas se DERIVAN/SIMULAN para esta demo visual — todavía no
// existe un campo de estado real ni un análisis automático conectado.

const MONTH_ORDER = ["junio", "julio", "agosto", "septiembre"];
const MONTH_NUM = { ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5, jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11 };
const MONTH_LABELS = { junio: "Junio", julio: "Julio", agosto: "Agosto", septiembre: "Septiembre" };
const WEEKDAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const THUMB_STYLES = {
  reel: { gradient: "linear-gradient(135deg, #3a2a5c, #1c1030)", icon: "🎬" },
  flyer: { gradient: "linear-gradient(135deg, #3a332a, #1c1712)", icon: "🖼️" },
  carrusel: { gradient: "linear-gradient(135deg, #12403a, #0d211d)", icon: "📑" },
  default: { gradient: "linear-gradient(135deg, #5c3414, #2a1608)", icon: "✨" }
};

const STATUS_LABELS = { borrador: "Borrador", listo: "Listo", programado: "Programado", publicado: "Publicado" };

const SECTIONS = [
  { key: "resumen", label: "Resumen", icon: "📊" },
  { key: "calendario", label: "Calendario", icon: "🗓️" },
  { key: "contenido", label: "Contenido", icon: "🗂️" },
  { key: "ideas", label: "Ideas", icon: "💡" },
  { key: "metricas", label: "Métricas", icon: "📈" }
];

// ---------- Utilidades de fecha ----------

function parseMetaDate(meta) {
  const match = /^(\d{1,2})\s+(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)/i.exec(meta || "");
  if (!match) return null;
  const month = MONTH_NUM[match[2].toLowerCase()];
  if (month === undefined) return null;
  return new Date(2026, month, parseInt(match[1], 10));
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // lunes = 0
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function fmtNum(n) {
  return (n || 0).toLocaleString("es-AR");
}

// ---------- Datos derivados ----------

function getAllItems(unit) {
  const items = [];
  for (const monthKey of MONTH_ORDER) {
    for (const item of unit.months[monthKey] || []) items.push({ ...item, monthKey });
  }
  return items;
}

function deriveStatus(item) {
  if (typeof item.likes === "number") return "publicado";
  const tags = (item.tags || []).map((t) => t.toLowerCase());
  const hasDate = Boolean(parseMetaDate(item.meta));
  const isPautar = tags.some((t) => t.startsWith("pautar"));
  const isPendiente = tags.includes("pendiente") || !item.desc;
  if (isPendiente) return "borrador";
  if (hasDate && isPautar) return "programado";
  if (hasDate) return "listo";
  return "borrador";
}

function thumbFor(item) {
  const tags = item.tags || [];
  const key = ["reel", "flyer", "carrusel"].find((k) => tags.includes(k));
  return THUMB_STYLES[key] || THUMB_STYLES.default;
}

// ---------- Estado global ----------

let currentUnitId = null;
let currentSection = "resumen";
let currentContentFilter = "todos";
let currentCalMonth = "julio";

// ---------- Sección: Resumen ----------

function renderMiniChart(history) {
  if (!history || history.length === 0) return "";
  const width = 560, height = 120, pad = 8;
  const max = Math.max(1, ...history.map((d) => d.views || 0));
  const pts = history.map((d, i) => {
    const x = history.length === 1 ? width / 2 : pad + (i / (history.length - 1)) * (width - pad * 2);
    const y = height - pad - ((d.views || 0) / max) * (height - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const area = `M${pad},${height - pad} L${pts.join(" L")} L${width - pad},${height - pad} Z`;
  return `
    <div class="mini-chart">
      <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        <path d="${area}" class="mini-chart__area"></path>
        <polyline points="${pts.join(" ")}" class="mini-chart__line"></polyline>
      </svg>
    </div>
  `;
}

function renderResumen(unit) {
  const items = getAllItems(unit);
  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const thisWeek = items.filter((i) => {
    const d = parseMetaDate(i.meta);
    return d && d >= weekStart && d <= weekEnd;
  });

  const published = items.filter((i) => typeof i.likes === "number");
  const best = [...published]
    .sort((a, b) => (b.views || b.likes || 0) - (a.views || a.likes || 0))
    .slice(0, 3);

  const history = (unit.performance && unit.performance.history) || [];
  const totalViews = history.reduce((a, d) => a + (d.views || 0), 0);
  const totalFollowers = history.length ? history[history.length - 1].followers : null;

  return `
    <div class="section-block">
      <div class="kpi-row">
        <div class="kpi-card">
          <span class="kpi-card__value">${thisWeek.length}</span>
          <span class="kpi-card__label">Posts esta semana</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-card__value">${published.length}</span>
          <span class="kpi-card__label">Publicados (total)</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-card__value">${totalViews ? fmtNum(totalViews) : "—"}</span>
          <span class="kpi-card__label">Visualizaciones (30 días)</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-card__value">${totalFollowers !== null ? fmtNum(totalFollowers) : "—"}</span>
          <span class="kpi-card__label">Seguidores Instagram</span>
        </div>
      </div>

      <div class="panel">
        <h3 class="panel__title">Crecimiento y visualizaciones</h3>
        ${history.length
          ? renderMiniChart(history)
          : `<p class="empty-note">Todavía no hay historial de rendimiento acumulado para esta unidad.</p>`
        }
      </div>

      <div class="panel">
        <h3 class="panel__title">Mejores publicaciones</h3>
        ${best.length
          ? `<ul class="best-list">${best.map((item) => `
              <li class="best-list__item">
                <span class="best-list__icon">${thumbFor(item).icon}</span>
                <div class="best-list__body">
                  <span class="best-list__title">${item.title}</span>
                  <span class="best-list__meta">${item.meta || ""}</span>
                </div>
                <div class="best-list__stats">
                  ${typeof item.views === "number" ? `<span>▶ ${fmtNum(item.views)}</span>` : ""}
                  <span>❤ ${fmtNum(item.likes)}</span>
                </div>
              </li>
            `).join("")}</ul>`
          : `<p class="empty-note">Todavía no hay publicaciones con datos reales para esta unidad.</p>`
        }
      </div>
    </div>
  `;
}

// ---------- Sección: Calendario ----------

function renderCalendario(unit) {
  const monthIdx = MONTH_NUM[{ junio: "jun", julio: "jul", agosto: "ago", septiembre: "sep" }[currentCalMonth]];
  const items = (unit.months[currentCalMonth] || []).map((i) => ({ ...i, date: parseMetaDate(i.meta) }));
  const byDay = {};
  const noDate = [];
  items.forEach((i) => {
    if (i.date) {
      const key = i.date.getDate();
      (byDay[key] = byDay[key] || []).push(i);
    } else {
      noDate.push(i);
    }
  });

  const firstDay = new Date(2026, monthIdx, 1);
  const daysInMonth = new Date(2026, monthIdx + 1, 0).getDate();
  const leadingBlanks = (firstDay.getDay() + 6) % 7; // lunes=0

  let cells = "";
  for (let i = 0; i < leadingBlanks; i++) cells += `<div class="cal-cell cal-cell--blank"></div>`;
  for (let day = 1; day <= daysInMonth; day++) {
    const dayItems = byDay[day] || [];
    const isToday = (() => {
      const t = new Date();
      return t.getFullYear() === 2026 && t.getMonth() === monthIdx && t.getDate() === day;
    })();
    cells += `
      <div class="cal-cell${isToday ? " cal-cell--today" : ""}">
        <span class="cal-cell__day">${day}</span>
        <div class="cal-cell__posts">
          ${dayItems.slice(0, 3).map((i) => `<span class="cal-chip" title="${i.title}">${thumbFor(i).icon} ${i.title}</span>`).join("")}
          ${dayItems.length > 3 ? `<span class="cal-chip cal-chip--more">+${dayItems.length - 3} más</span>` : ""}
        </div>
      </div>
    `;
  }

  return `
    <div class="section-block">
      <div class="cal-month-tabs">
        ${MONTH_ORDER.map((m) => `<button type="button" class="cal-month-tab${m === currentCalMonth ? " cal-month-tab--active" : ""}" data-cal-month="${m}">${MONTH_LABELS[m]}</button>`).join("")}
      </div>
      <div class="cal-grid">
        ${WEEKDAY_LABELS.map((w) => `<div class="cal-weekday">${w}</div>`).join("")}
        ${cells}
      </div>
      ${noDate.length ? `
        <div class="panel">
          <h3 class="panel__title">Sin fecha específica este mes</h3>
          <ul class="best-list">
            ${noDate.map((i) => `<li class="best-list__item"><span class="best-list__icon">${thumbFor(i).icon}</span><div class="best-list__body"><span class="best-list__title">${i.title}</span><span class="best-list__meta">${i.meta}</span></div></li>`).join("")}
          </ul>
        </div>
      ` : ""}
    </div>
  `;
}

// ---------- Sección: Contenido ----------

const CONTENT_FILTERS = [
  { key: "todos", label: "Todos" },
  { key: "borrador", label: "Borrador", color: "var(--status-borrador)" },
  { key: "listo", label: "Listo", color: "var(--status-listo)" },
  { key: "programado", label: "Programado", color: "var(--status-programado)" },
  { key: "publicado", label: "Publicado", color: "var(--status-publicado)" }
];

function renderCard(item) {
  const status = deriveStatus(item);
  const thumb = thumbFor(item);
  const dateLabel = item.meta || "Sin fecha";
  const descHtml = item.desc ? `<p class="post-card__desc">${item.desc}</p>` : "";
  return `
    <li class="post-card">
      <div class="post-card__thumb" style="background:${thumb.gradient}">
        <span class="post-card__thumb-icon">${thumb.icon}</span>
        <span class="post-card__badge post-card__platform">📷 Instagram</span>
        <span class="post-card__badge post-card__status" style="background:var(--status-${status})">${STATUS_LABELS[status]}</span>
      </div>
      <div class="post-card__body" style="border-top-color:var(--status-${status})">
        <h3 class="post-card__title">${item.title}</h3>
        <div class="post-card__meta">📅 ${dateLabel}</div>
        ${descHtml}
      </div>
    </li>
  `;
}

function renderContenido(unit) {
  const allItems = getAllItems(unit);
  const counts = { todos: allItems.length };
  allItems.forEach((i) => { const s = deriveStatus(i); counts[s] = (counts[s] || 0) + 1; });

  let items = currentContentFilter === "todos" ? allItems : allItems.filter((i) => deriveStatus(i) === currentContentFilter);
  items = [...items].sort((a, b) => {
    const da = parseMetaDate(a.meta), db = parseMetaDate(b.meta);
    if (da && db) return da - db;
    if (da) return -1;
    if (db) return 1;
    return 0;
  });

  return `
    <div class="section-block">
      <div class="filters">
        ${CONTENT_FILTERS.map((f) => `
          <button type="button" class="filter-chip${f.key === currentContentFilter ? " filter-chip--active" : ""}" data-filter="${f.key}">
            ${f.color ? `<span class="filter-chip__dot" style="background:${f.color}"></span>` : ""}
            ${f.label} · ${counts[f.key] || 0}
          </button>
        `).join("")}
      </div>
      ${items.length ? `<ul class="card-grid">${items.map(renderCard).join("")}</ul>` : `<p class="cards-empty">No hay publicaciones con este filtro.</p>`}
    </div>
  `;
}

// ---------- Sección: Ideas ----------

const MOCK_RECOMMENDATIONS = {
  "casino-gala": {
    insights: [
      "Los reels superan ampliamente a los flyers en visualizaciones (595–624 vs. bajo alcance en imágenes fijas) — el video se lleva la atención.",
      "\"¡Qué partido, Argentina!\" (gancho futbolero, no un anuncio de marca directo) fue el mejor post del mes — el contenido que conecta con algo que la gente ya está viviendo funciona mejor que el mensaje comercial."
    ],
    contentIdeas: [
      "Reel de la reacción real de un ganador en el momento exacto en que se entera que ganó — cámara en mano, sin guion, buscando la emoción genuina en vez de una recreación prolija.",
      "Serie \"Así se arma un sorteo\": 15-20 segundos detrás de escena de cómo se preparan los premios en sala antes del evento, para generar expectativa los días previos.",
      "Aprovechar el folclore del Mundial (como funcionó con la Selección): micro-contenido de \"pronósticos\" o \"quiniela entre jugadores de sala\" que mezcle el clima futbolero con el casino sin vender directamente."
    ]
  },
  "valentino-restaurant": {
    insights: [
      "Los carruseles de \"Cena Temática\" acumulan más likes que las piezas de \"Sugerencia del Chef\" — el formato evento/experiencia rinde mejor que mostrar un plato suelto.",
      "El recap de un evento publicado días después (no el mismo día) sigue generando buen engagement — no hace falta apurar la publicación el día exacto del evento."
    ],
    contentIdeas: [
      "Reel del momento del maridaje en vivo durante una Cena Temática: el sommelier explicando el vino en la mesa, con los comensales de fondo.",
      "Serie \"De dónde viene\": mini-historia de un ingrediente destacado del menú (ej. la trucha patagónica) antes de mostrar el plato terminado — genera curiosidad antes de la venta.",
      "Testimonios cortos (10-15 seg) de comensales reales al salir de una cena temática, contando en sus palabras qué les pareció la experiencia."
    ]
  },
  "resto-ruta-11": {
    insights: [
      "Todavía no hay suficiente historial de rendimiento acumulado para esta unidad — estas ideas parten de los pilares de contenido definidos, no de datos de performance todavía."
    ],
    contentIdeas: [
      "Reel del cara a cara entre los dos sommeliers del Desafío de Sommelier, mostrando la cata a ciegas en tiempo real — generar expectativa antes de revelar el ganador.",
      "Serie \"Plato del día\" en formato historia: el chef mostrando el plato recién salido de cocina, sin producción, todos los días a la misma hora.",
      "Detrás de escena de cocina en hora pico — el ritmo real de un servicio, transmite el volumen y la energía del lugar sin necesidad de un guion armado."
    ]
  },
  "amerian-hotel": {
    insights: [
      "Todavía no hay suficiente historial de rendimiento acumulado para esta unidad — estas ideas parten de los pilares de contenido definidos, no de datos de performance todavía."
    ],
    contentIdeas: [
      "Recorrido en un solo plano (walk-through) desde el check-in hasta una habitación, mostrando el trayecto real que hace un huésped — más efectivo que fotos sueltas de cada ambiente.",
      "Reel \"un día en Amerian\": desayuno, piscina, Valentino, spa, en cortes rápidos con música — pensado para alguien que está decidiendo dónde alojarse en Resistencia.",
      "Colaboración cruzada con Valentino: mostrar la cena en el restaurante como parte de la experiencia de hospedaje, no como una pieza separada."
    ]
  },
  "gala-hotel-convenciones": {
    insights: [
      "Todavía no hay suficiente historial de rendimiento acumulado para esta unidad — estas ideas parten de los pilares de contenido definidos, no de datos de performance todavía."
    ],
    contentIdeas: [
      "Time-lapse del montaje de un salón, desde vacío hasta listo para el evento — el \"antes y después\" suele funcionar bien para vender espacios de eventos.",
      "Testimonio corto de un organizador de evento real contando por qué eligió Gala Hotel para su convención o celebración.",
      "Reel mostrando la capacidad real de un salón con gente adentro (no vacío) para que quien busca un lugar para su evento pueda imaginarse el tamaño real."
    ]
  },
  "gala-recepciones": {
    insights: [
      "Todavía no hay suficiente historial de rendimiento acumulado para esta unidad — estas ideas parten de los pilares de contenido definidos, no de datos de performance todavía."
    ],
    contentIdeas: [
      "Reel de detrás de escena de una recepción real, desde el salón vacío por la mañana hasta el evento en marcha por la noche.",
      "Presentación del BOX de comida (producto nuevo) mostrando el unboxing real, no solo fotos del packaging — generar curiosidad antes del lanzamiento de septiembre.",
      "Testimonios de familias que ya vivieron una recepción en Gala, contando un detalle específico que recuerdan (no un elogio genérico)."
    ]
  }
};

function ideasKey(unitId) {
  return `gala-social-studio:ideas:${unitId}`;
}

function loadIdeas(unitId) {
  try {
    return JSON.parse(localStorage.getItem(ideasKey(unitId)) || "[]");
  } catch {
    return [];
  }
}

function saveIdeas(unitId, ideas) {
  localStorage.setItem(ideasKey(unitId), JSON.stringify(ideas));
}

function renderIdeas(unit) {
  const ideas = loadIdeas(unit.id);
  const recs = MOCK_RECOMMENDATIONS[unit.id] || { insights: [], contentIdeas: [] };

  return `
    <div class="section-block">
      <div class="panel">
        <div class="panel__title-row">
          <h3 class="panel__title">Especialista automático de RRSS</h3>
          <span class="preview-badge">Vista previa · análisis manual, no automatizado todavía</span>
        </div>
        <h4 class="rec-group__title">📊 Qué está funcionando</h4>
        <ul class="rec-list">
          ${recs.insights.map((r) => `<li class="rec-list__item"><span class="rec-list__icon">🤖</span><span>${r}</span></li>`).join("")}
        </ul>
        <h4 class="rec-group__title">💡 Ideas de contenido para probar</h4>
        <ul class="rec-list">
          ${recs.contentIdeas.map((r) => `<li class="rec-list__item rec-list__item--idea"><span class="rec-list__icon">✏️</span><span>${r}</span></li>`).join("")}
        </ul>
      </div>

      <div class="panel">
        <h3 class="panel__title">Ideas rápidas</h3>
        <div class="idea-form">
          <textarea id="idea-input" class="idea-input" rows="2" placeholder="Anotá una idea para un futuro posteo..."></textarea>
          <button type="button" id="idea-add" class="idea-add-btn">+ Guardar idea</button>
        </div>
        <ul class="idea-list">
          ${ideas.length
            ? ideas.map((idea) => `
                <li class="idea-list__item" data-idea-id="${idea.id}">
                  <span>${idea.text}</span>
                  <button type="button" class="idea-delete" data-idea-id="${idea.id}" aria-label="Eliminar idea">✕</button>
                </li>
              `).join("")
            : `<li class="empty-note">Todavía no guardaste ninguna idea para ${unit.name}.</li>`
          }
        </ul>
      </div>
    </div>
  `;
}

// ---------- Sección: Métricas ----------

function renderMetricas(unit) {
  const history = (unit.performance && unit.performance.history) || [];
  if (!history.length) {
    return `<div class="section-block"><p class="empty-note">Todavía no hay métricas acumuladas de cuenta para esta unidad.</p></div>`;
  }
  const last = history[history.length - 1];
  const totalViews = history.reduce((a, d) => a + (d.views || 0), 0);
  const totalInteractions = history.reduce((a, d) => a + (d.interactions || 0), 0);
  const totalReach = history.reduce((a, d) => a + (d.reach || 0), 0);

  const tiles = [
    { icon: "▶", value: fmtNum(totalViews), label: "Visualizaciones" },
    { icon: "💬", value: fmtNum(totalInteractions), label: "Interacciones" },
    { icon: "👁", value: fmtNum(totalReach), label: "Alcance" },
    { icon: "📷", value: last.followers != null ? fmtNum(last.followers) : "—", label: "Seguidores Instagram" },
    { icon: "📘", value: last.fbFollowers != null ? fmtNum(last.fbFollowers) : "—", label: "Seguidores Facebook" },
    { icon: "👤", value: fmtNum(history.reduce((a, d) => a + (d.profileViews || 0), 0)), label: "Visitas al perfil" }
  ];

  return `
    <div class="section-block">
      <div class="metric-tiles">
        ${tiles.map((t) => `
          <div class="metric-tile">
            <span class="metric-tile__icon">${t.icon}</span>
            <span class="metric-tile__value">${t.value}</span>
            <span class="metric-tile__label">${t.label}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

// ---------- Render principal ----------

function renderSectionNav() {
  return `
    <div class="section-nav" role="tablist" aria-label="Secciones">
      ${SECTIONS.map((s) => `
        <button type="button" class="section-tab${s.key === currentSection ? " section-tab--active" : ""}" data-section="${s.key}">
          <span>${s.icon}</span> ${s.label}
        </button>
      `).join("")}
    </div>
  `;
}

function renderUnit(unit) {
  const content = document.getElementById("content");
  const logoHtml = unit.logo ? `<img src="${unit.logo}" alt="${unit.name}" class="unit-header__logo" />` : "";

  let sectionHtml = "";
  if (currentSection === "resumen") sectionHtml = renderResumen(unit);
  else if (currentSection === "calendario") sectionHtml = renderCalendario(unit);
  else if (currentSection === "contenido") sectionHtml = renderContenido(unit);
  else if (currentSection === "ideas") sectionHtml = renderIdeas(unit);
  else if (currentSection === "metricas") sectionHtml = renderMetricas(unit);

  content.innerHTML = `
    <div class="unit-header">
      ${logoHtml}
      <div>
        <h2 class="unit-header__name">${unit.name}</h2>
        <div class="unit-header__sub">Instagram · Facebook</div>
      </div>
    </div>
    ${renderSectionNav()}
    ${sectionHtml}
  `;
}

function setSection(section) {
  currentSection = section;
  currentContentFilter = "todos";
  const unit = UNITS.find((u) => u.id === currentUnitId);
  if (unit) renderUnit(unit);
}

function setActiveTab(unitId) {
  document.querySelectorAll(".tab").forEach((btn) => {
    const active = btn.dataset.unit === unitId;
    btn.classList.toggle("tab--active", active);
    btn.setAttribute("aria-selected", active ? "true" : "false");
  });
  currentUnitId = unitId;
  currentSection = "resumen";
  const unit = UNITS.find((u) => u.id === unitId);
  if (unit) {
    renderUnit(unit);
    history.replaceState(null, "", `#${unitId}`);
  }
}

function renderTabs() {
  const tabs = document.getElementById("tabs");
  tabs.innerHTML = UNITS.map((unit) => `<button class="tab" role="tab" data-unit="${unit.id}">${unit.name}</button>`).join("");
  tabs.querySelectorAll(".tab").forEach((btn) => btn.addEventListener("click", () => setActiveTab(btn.dataset.unit)));
}

function initContentEvents() {
  document.getElementById("content").addEventListener("click", (e) => {
    const sectionBtn = e.target.closest(".section-tab");
    if (sectionBtn) {
      setSection(sectionBtn.dataset.section);
      return;
    }
    const filterChip = e.target.closest(".filter-chip");
    if (filterChip) {
      currentContentFilter = filterChip.dataset.filter;
      const unit = UNITS.find((u) => u.id === currentUnitId);
      if (unit) renderUnit(unit);
      return;
    }
    const calMonthBtn = e.target.closest(".cal-month-tab");
    if (calMonthBtn) {
      currentCalMonth = calMonthBtn.dataset.calMonth;
      const unit = UNITS.find((u) => u.id === currentUnitId);
      if (unit) renderUnit(unit);
      return;
    }
    const ideaAddBtn = e.target.closest("#idea-add");
    if (ideaAddBtn) {
      const input = document.getElementById("idea-input");
      const text = input.value.trim();
      if (!text) return;
      const ideas = loadIdeas(currentUnitId);
      ideas.unshift({ id: String(Date.now()), text });
      saveIdeas(currentUnitId, ideas);
      const unit = UNITS.find((u) => u.id === currentUnitId);
      if (unit) renderUnit(unit);
      return;
    }
    const ideaDeleteBtn = e.target.closest(".idea-delete");
    if (ideaDeleteBtn) {
      const ideas = loadIdeas(currentUnitId).filter((i) => i.id !== ideaDeleteBtn.dataset.ideaId);
      saveIdeas(currentUnitId, ideas);
      const unit = UNITS.find((u) => u.id === currentUnitId);
      if (unit) renderUnit(unit);
    }
  });
}

function init() {
  renderTabs();
  initContentEvents();
  const fromHash = window.location.hash.replace("#", "");
  const validIds = UNITS.map((u) => u.id);
  const initialUnit = validIds.includes(fromHash) ? fromHash : validIds[0];
  setActiveTab(initialUnit);
}

init();
