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

const PLATFORM_ICONS = { instagram: "📷", facebook: "📘", tiktok: "🎵" };
const PLATFORM_LABELS = { instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok" };

const SECTIONS = [
  { key: "resumen", label: "Resumen", icon: "📊" },
  { key: "calendario", label: "Calendario", icon: "🗓️" },
  { key: "contenido", label: "Contenido", icon: "🗂️" },
  { key: "ideas", label: "Ideas", icon: "💡" },
  { key: "guiones", label: "Guiones", icon: "✍️" },
  { key: "carruseles", label: "Carruseles", icon: "🎠" },
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

const DIACRITICS_RE = new RegExp("[\\u0300-\\u036f]", "g");

function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFD").replace(DIACRITICS_RE, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
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
  if (item.status) return item.status; // fijado a mano (creado o editado en el panel del día)
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

function renderMiniChart(history, big) {
  if (!history || history.length === 0) return "";
  const width = 560, height = big ? 220 : 120, pad = 10;
  const max = Math.max(1, ...history.map((d) => d.views || 0));
  const pts = history.map((d, i) => {
    const x = history.length === 1 ? width / 2 : pad + (i / (history.length - 1)) * (width - pad * 2);
    const y = height - pad - ((d.views || 0) / max) * (height - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const area = `M${pad},${height - pad} L${pts.join(" L")} L${width - pad},${height - pad} Z`;
  const dots = big
    ? history.map((d, i) => {
        const [x, y] = pts[i].split(",");
        return `<circle cx="${x}" cy="${y}" r="3.5" class="mini-chart__dot"><title>${d.date}: ${(d.views || 0).toLocaleString("es-AR")} vistas</title></circle>`;
      }).join("")
    : "";
  return `
    <div class="mini-chart${big ? " mini-chart--big" : ""}">
      <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        <path d="${area}" class="mini-chart__area"></path>
        <polyline points="${pts.join(" ")}" class="mini-chart__line" data-animate-line></polyline>
        ${dots}
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

const MONTH_TO_ABBR = { junio: "jun", julio: "jul", agosto: "ago", septiembre: "sep" };

function overlayKey(unitId) {
  return `gala-social-studio:posts-overlay:${unitId}`;
}

function loadOverlay(unitId) {
  try {
    const raw = JSON.parse(localStorage.getItem(overlayKey(unitId)) || "null");
    if (raw && Array.isArray(raw.extra) && raw.overrides) return raw;
  } catch { /* ignore */ }
  return { extra: [], overrides: {} };
}

function saveOverlay(unitId, overlay) {
  localStorage.setItem(overlayKey(unitId), JSON.stringify(overlay));
}

function postKeyFor(item) {
  return slugify(`${item.title}-${item.meta || ""}`);
}

function getDayPosts(unit, monthKey, monthIdx, day) {
  const overlay = loadOverlay(unit.id);
  const basePosts = (unit.months[monthKey] || [])
    .map((item) => {
      const date = parseMetaDate(item.meta);
      if (!date || date.getMonth() !== monthIdx || date.getDate() !== day) return null;
      const key = postKeyFor(item);
      const override = overlay.overrides[key] || {};
      return {
        ...item,
        ...override,
        platform: override.platform || item.platform || "instagram",
        _key: key,
        _source: "base"
      };
    })
    .filter(Boolean);
  const extraPosts = overlay.extra
    .filter((p) => p.monthKey === monthKey && p.day === day)
    .map((p) => ({ ...p, _key: p.id, _source: "extra" }));
  return [...basePosts, ...extraPosts];
}

function isDayComplete(dayPosts) {
  return dayPosts.length > 0 && dayPosts.every((p) => deriveStatus(p) === "programado" || deriveStatus(p) === "publicado");
}

function renderCalendario(unit) {
  const monthIdx = MONTH_NUM[MONTH_TO_ABBR[currentCalMonth]];
  const firstDay = new Date(2026, monthIdx, 1);
  const daysInMonth = new Date(2026, monthIdx + 1, 0).getDate();
  const leadingBlanks = (firstDay.getDay() + 6) % 7; // lunes=0
  const totalCells = leadingBlanks + daysInMonth;
  const weekRows = Math.ceil(totalCells / 7);

  let cells = "";
  for (let i = 0; i < leadingBlanks; i++) cells += `<div class="cal-cell cal-cell--blank"></div>`;
  for (let day = 1; day <= daysInMonth; day++) {
    const dayPosts = getDayPosts(unit, currentCalMonth, monthIdx, day);
    const isToday = (() => {
      const t = new Date();
      return t.getFullYear() === 2026 && t.getMonth() === monthIdx && t.getDate() === day;
    })();
    const isEmpty = dayPosts.length === 0;
    const isComplete = isDayComplete(dayPosts);
    const cls = [
      "cal-cell",
      isToday ? "cal-cell--today" : "",
      isEmpty ? "cal-cell--empty" : "",
      isComplete ? "cal-cell--complete" : ""
    ].filter(Boolean).join(" ");
    cells += `
      <button type="button" class="${cls}" data-cal-day="${day}">
        <span class="cal-cell__day">${day}</span>
        <div class="cal-cell__posts">
          ${dayPosts.slice(0, 3).map((p) => `
            <span class="cal-post-chip" title="${p.title}">
              <span class="cal-post-chip__thumb" style="background:${thumbFor(p).gradient}">${thumbFor(p).icon}</span>
              <span class="cal-post-chip__title">${p.title}</span>
              <span class="cal-post-chip__platform">${PLATFORM_ICONS[p.platform] || PLATFORM_ICONS.instagram}</span>
            </span>
          `).join("")}
          ${dayPosts.length > 3 ? `<span class="cal-chip cal-chip--more">+${dayPosts.length - 3} más</span>` : ""}
        </div>
      </button>
    `;
  }

  return `
    <div class="cal-fullscreen">
      <div class="cal-month-nav">
        <button type="button" class="cal-nav-arrow" id="cal-prev-month" ${currentCalMonth === MONTH_ORDER[0] ? "disabled" : ""}>‹</button>
        <h3 class="cal-month-nav__label">${MONTH_LABELS[currentCalMonth]} <span class="cal-month-nav__year">2026</span></h3>
        <button type="button" class="cal-nav-arrow" id="cal-next-month" ${currentCalMonth === MONTH_ORDER[MONTH_ORDER.length - 1] ? "disabled" : ""}>›</button>
      </div>
      <div class="cal-grid" style="grid-template-rows: auto repeat(${weekRows}, 1fr)">
        ${WEEKDAY_LABELS.map((w) => `<div class="cal-weekday">${w}</div>`).join("")}
        ${cells}
      </div>
    </div>
  `;
}

// ---------- Panel lateral del día (crear/editar posts) ----------

let dayPanelState = null; // { unitId, monthKey, monthIdx, day, editingKey, creating }

function dayLabelFor(day, monthKey) {
  return `${day} de ${MONTH_LABELS[monthKey].toLowerCase()}`;
}

function closeDayPanel() {
  dayPanelState = null;
  const root = document.getElementById("day-panel-root");
  if (root) root.innerHTML = "";
}

function renderDayPanelForm(existingPost) {
  const p = existingPost || {};
  const format = ["reel", "flyer", "carrusel"].find((k) => (p.tags || []).includes(k)) || "flyer";
  const status = existingPost ? deriveStatus(existingPost) : "borrador";
  const canDelete = existingPost && existingPost._source === "extra";
  return `
    <form class="day-panel__form" id="day-panel-form">
      <label class="day-panel__field">
        <span>Título</span>
        <input type="text" id="dp-title" value="${(p.title || "").replace(/"/g, "&quot;")}" required />
      </label>
      <label class="day-panel__field">
        <span>Descripción</span>
        <textarea id="dp-desc" rows="3">${p.desc || ""}</textarea>
      </label>
      <div class="day-panel__field-row">
        <label class="day-panel__field">
          <span>Red social</span>
          <select id="dp-platform">
            ${Object.keys(PLATFORM_LABELS).map((k) => `<option value="${k}"${p.platform === k ? " selected" : ""}>${PLATFORM_LABELS[k]}</option>`).join("")}
          </select>
        </label>
        <label class="day-panel__field">
          <span>Formato</span>
          <select id="dp-format">
            ${["reel", "flyer", "carrusel"].map((f) => `<option value="${f}"${format === f ? " selected" : ""}>${THUMB_STYLES[f].icon} ${f}</option>`).join("")}
          </select>
        </label>
      </div>
      <label class="day-panel__field">
        <span>Estado</span>
        <select id="dp-status">
          ${Object.keys(STATUS_LABELS).map((s) => `<option value="${s}"${status === s ? " selected" : ""}>${STATUS_LABELS[s]}</option>`).join("")}
        </select>
      </label>
      <div class="day-panel__form-actions">
        ${canDelete ? `<button type="button" class="day-panel__delete" id="dp-delete">Eliminar</button>` : "<span></span>"}
        <div class="day-panel__form-actions-right">
          <button type="button" class="day-panel__cancel" id="dp-cancel">Cancelar</button>
          <button type="submit" class="day-panel__save">Guardar</button>
        </div>
      </div>
    </form>
  `;
}

function renderDayPanel() {
  const root = document.getElementById("day-panel-root");
  if (!dayPanelState) { root.innerHTML = ""; return; }
  const { unitId, monthKey, monthIdx, day, editingKey, creating } = dayPanelState;
  const unit = UNITS.find((u) => u.id === unitId);
  const posts = getDayPosts(unit, monthKey, monthIdx, day);
  const editingPost = editingKey ? posts.find((p) => p._key === editingKey) : null;
  const showForm = creating || Boolean(editingPost);

  root.innerHTML = `
    <div class="day-panel-backdrop" id="day-panel-backdrop"></div>
    <aside class="day-panel">
      <div class="day-panel__header">
        <h3>${dayLabelFor(day, monthKey)}</h3>
        <button type="button" class="day-panel__close" id="day-panel-close" aria-label="Cerrar">✕</button>
      </div>
      ${showForm ? renderDayPanelForm(editingPost) : `
        <div class="day-panel__posts">
          ${posts.length ? posts.map((p) => `
            <div class="day-panel__post-row">
              <span class="day-panel__post-thumb" style="background:${thumbFor(p).gradient}">${thumbFor(p).icon}</span>
              <div class="day-panel__post-body">
                <span class="day-panel__post-title">${p.title}</span>
                <span class="day-panel__post-meta">${PLATFORM_ICONS[p.platform] || "📷"} ${PLATFORM_LABELS[p.platform] || "Instagram"} · ${STATUS_LABELS[deriveStatus(p)]}</span>
              </div>
              <button type="button" class="day-panel__edit-btn" data-edit-key="${p._key}">Editar</button>
            </div>
          `).join("") : `<p class="empty-note">Todavía no hay posts este día.</p>`}
        </div>
        <button type="button" class="day-panel__new-btn" id="day-panel-new">+ Nuevo post</button>
      `}
    </aside>
  `;
}

function openDayPanel(unitId, monthKey, monthIdx, day) {
  dayPanelState = { unitId, monthKey, monthIdx, day, editingKey: null, creating: false };
  renderDayPanel();
}

function initDayPanelEvents() {
  const root = document.getElementById("day-panel-root");

  root.addEventListener("click", (e) => {
    if (!dayPanelState) return;
    if (e.target.id === "day-panel-backdrop" || e.target.id === "day-panel-close") {
      closeDayPanel();
      return;
    }
    if (e.target.id === "day-panel-new") {
      dayPanelState.creating = true;
      dayPanelState.editingKey = null;
      renderDayPanel();
      return;
    }
    if (e.target.id === "dp-cancel") {
      dayPanelState.creating = false;
      dayPanelState.editingKey = null;
      renderDayPanel();
      return;
    }
    if (e.target.id === "dp-delete") {
      const overlay = loadOverlay(dayPanelState.unitId);
      overlay.extra = overlay.extra.filter((p) => p.id !== dayPanelState.editingKey);
      saveOverlay(dayPanelState.unitId, overlay);
      dayPanelState.creating = false;
      dayPanelState.editingKey = null;
      renderDayPanel();
      refreshCalendarBehindPanel();
      return;
    }
    const editBtn = e.target.closest(".day-panel__edit-btn");
    if (editBtn) {
      dayPanelState.editingKey = editBtn.dataset.editKey;
      dayPanelState.creating = false;
      renderDayPanel();
    }
  });

  root.addEventListener("submit", (e) => {
    if (e.target.id !== "day-panel-form" || !dayPanelState) return;
    e.preventDefault();
    const { unitId, monthKey, day, editingKey, creating } = dayPanelState;
    const title = document.getElementById("dp-title").value.trim();
    if (!title) return;
    const desc = document.getElementById("dp-desc").value.trim();
    const platform = document.getElementById("dp-platform").value;
    const format = document.getElementById("dp-format").value;
    const status = document.getElementById("dp-status").value;
    const overlay = loadOverlay(unitId);

    if (creating) {
      overlay.extra.push({
        id: `extra-${Date.now()}`,
        monthKey,
        day,
        title,
        desc,
        platform,
        tags: [format],
        meta: `${day} ${MONTH_TO_ABBR[monthKey]}`,
        status
      });
    } else if (editingKey) {
      const extraIdx = overlay.extra.findIndex((p) => p.id === editingKey);
      if (extraIdx > -1) {
        overlay.extra[extraIdx] = { ...overlay.extra[extraIdx], title, desc, platform, tags: [format], status };
      } else {
        overlay.overrides[editingKey] = { title, desc, platform, tags: [format], status };
      }
    }
    saveOverlay(unitId, overlay);
    dayPanelState.creating = false;
    dayPanelState.editingKey = null;
    renderDayPanel();
    refreshCalendarBehindPanel();
  });
}

function refreshCalendarBehindPanel() {
  const unit = UNITS.find((u) => u.id === currentUnitId);
  if (unit && currentSection === "calendario") renderUnit(unit);
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

// ---------- Sección: Guiones (generador con IA) ----------

const ANTHROPIC_KEY_STORAGE = "gala-social-studio:anthropic-key";
const ANTHROPIC_MODEL = "claude-haiku-4-5-20251001";

function loadApiKey() {
  return localStorage.getItem(ANTHROPIC_KEY_STORAGE) || "";
}

function saveApiKey(key) {
  if (key) localStorage.setItem(ANTHROPIC_KEY_STORAGE, key);
  else localStorage.removeItem(ANTHROPIC_KEY_STORAGE);
}

function guionesLibraryKey(unitId) {
  return `gala-social-studio:guiones:${unitId}`;
}

function loadGuiones(unitId) {
  try {
    return JSON.parse(localStorage.getItem(guionesLibraryKey(unitId)) || "[]");
  } catch {
    return [];
  }
}

function saveGuiones(unitId, list) {
  localStorage.setItem(guionesLibraryKey(unitId), JSON.stringify(list));
}

let guionState = { generating: false, result: null, error: null, topic: "" };
let guionExpandedId = null;

const GUION_SYSTEM_PROMPT = `Sos un guionista experto en contenido para redes sociales (Instagram, Facebook, TikTok) de negocios de hotelería, gastronomía y entretenimiento en Argentina.
Te dan un tema y el contexto de una unidad de negocio específica. Generá un guion completo para un video corto de esa unidad.

Tono: profesional pero cercano, como si le hablaras a un amigo. Nada de lenguaje corporativo, acartonado o genérico. Usá "vos" (español rioplatense).

Devolvé SOLO un JSON válido (sin texto antes ni después, sin bloques de código markdown, sin backticks), con exactamente esta forma:
{
  "gancho": "las primeras 1-2 frases que enganchan en los primeros 3 segundos",
  "puntosClave": ["punto 1 a desarrollar", "punto 2", "punto 3"],
  "cierre": "cierre con llamada a la acción clara y específica",
  "duracionSugerida": "ej. 15-30 segundos",
  "formatoSugerido": "reel corto | video largo | historia",
  "justificacionFormato": "por qué ese formato es el más indicado para este tema, en una frase"
}`;

async function callAnthropic(unit, topic) {
  const apiKey = loadApiKey();
  const userContent = `Unidad de negocio: ${unit.name}
Objetivo estratégico: ${unit.objective || ""}
Pilares de contenido: ${unit.pilares || ""}

Tema del video: ${topic}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1024,
      system: GUION_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }]
    })
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => null);
    const msg = (errBody && errBody.error && errBody.error.message) || `Error ${response.status}`;
    throw new Error(msg);
  }

  const data = await response.json();
  const text = data.content && data.content[0] && data.content[0].text;
  if (!text) throw new Error("Respuesta vacía de la API.");

  let cleaned = text.trim().replace(/^```(json)?/i, "").replace(/```$/, "").trim();
  return JSON.parse(cleaned);
}

async function handleGenerateScript(unit) {
  const input = document.getElementById("guion-topic-input");
  const topic = input ? input.value.trim() : "";
  if (!topic) return;

  guionState.topic = topic;
  guionState.generating = true;
  guionState.error = null;
  guionState.result = null;
  renderUnit(unit);

  try {
    const result = await callAnthropic(unit, topic);
    guionState.result = { ...result, topic };
  } catch (err) {
    guionState.error = err.message || "No se pudo generar el guion. Revisá tu clave de API y probá de nuevo.";
  }
  guionState.generating = false;
  renderUnit(unit);
}

function renderGuionBlock(icon, label, content) {
  return `
    <div class="guion-block">
      <span class="guion-block__label">${icon} ${label}</span>
      ${content}
    </div>
  `;
}

function renderGuionResult(result) {
  return `
    <div class="panel guion-result">
      <div class="guion-result__format-row">
        <span class="guion-result__format-badge">${result.formatoSugerido}</span>
        <span class="guion-result__duration">⏱ ${result.duracionSugerida}</span>
      </div>
      ${result.justificacionFormato ? `<p class="guion-result__justification">${result.justificacionFormato}</p>` : ""}
      ${renderGuionBlock("🪝", "Gancho", `<p class="guion-block__text">${result.gancho}</p>`)}
      ${renderGuionBlock("📋", "Puntos clave", `<ul class="guion-block__list">${(result.puntosClave || []).map((p) => `<li>${p}</li>`).join("")}</ul>`)}
      ${renderGuionBlock("🎯", "Cierre / llamada a la acción", `<p class="guion-block__text">${result.cierre}</p>`)}
      <button type="button" class="guion-save-btn" id="guion-save-btn">+ Guardar en biblioteca</button>
    </div>
  `;
}

function renderApiKeyPanel(apiKey) {
  return `
    <div class="panel guion-apikey-panel">
      ${apiKey ? `
        <div class="guion-apikey-status">
          <span>🔑 Clave de Anthropic configurada</span>
          <button type="button" class="guion-apikey-change" id="guion-apikey-change">Cambiar</button>
        </div>
      ` : `
        <h3 class="panel__title">Conectar tu clave de Anthropic</h3>
        <p class="empty-note">Se guarda solo en este navegador, nunca se sube al repositorio. Conseguila en console.anthropic.com.</p>
        <div class="guion-apikey-form">
          <input type="password" id="guion-apikey-input" placeholder="sk-ant-..." />
          <button type="button" class="guion-save-btn" id="guion-apikey-save">Guardar clave</button>
        </div>
      `}
    </div>
  `;
}

function renderGuiones(unit) {
  const apiKey = loadApiKey();
  const library = loadGuiones(unit.id);

  return `
    <div class="section-block">
      ${renderApiKeyPanel(apiKey)}

      <div class="panel">
        <h3 class="panel__title">Generar guion nuevo</h3>
        <textarea id="guion-topic-input" class="idea-input" rows="2" placeholder="¿De qué tema querés que hable el video?">${guionState.topic}</textarea>
        <button type="button" class="guion-generate-btn" id="guion-generate-btn" ${guionState.generating || !apiKey ? "disabled" : ""}>
          ${guionState.generating ? "Generando..." : "✨ Generar guion"}
        </button>
        ${!apiKey ? `<p class="empty-note">Configurá tu clave de Anthropic arriba para poder generar guiones.</p>` : ""}
        ${guionState.error ? `<p class="guion-error">${guionState.error}</p>` : ""}
      </div>

      ${guionState.result ? renderGuionResult(guionState.result) : ""}

      <div class="panel">
        <h3 class="panel__title">Biblioteca de guiones</h3>
        ${library.length ? `
          <ul class="guion-library">
            ${library.map((g) => `
              <li class="guion-library__item">
                <div class="guion-library__header" data-toggle-guion="${g.id}">
                  <div class="guion-library__header-text">
                    <span class="guion-library__topic">${g.topic}</span>
                    <span class="guion-library__meta">${g.formatoSugerido} · ${g.duracionSugerida}</span>
                  </div>
                  <button type="button" class="guion-library__delete" data-delete-guion="${g.id}" aria-label="Eliminar">✕</button>
                </div>
                ${guionExpandedId === g.id ? `
                  <div class="guion-library__body">
                    ${renderGuionBlock("🪝", "Gancho", `<p class="guion-block__text">${g.gancho}</p>`)}
                    ${renderGuionBlock("📋", "Puntos clave", `<ul class="guion-block__list">${(g.puntosClave || []).map((p) => `<li>${p}</li>`).join("")}</ul>`)}
                    ${renderGuionBlock("🎯", "Cierre", `<p class="guion-block__text">${g.cierre}</p>`)}
                  </div>
                ` : ""}
              </li>
            `).join("")}
          </ul>
        ` : `<p class="empty-note">Todavía no guardaste ningún guion para ${unit.name}.</p>`}
      </div>
    </div>
  `;
}

// ---------- Sección: Carruseles (generador visual con IA) ----------

const CAROUSEL_STYLES = [
  { key: "clasico", label: "Gala Clásico", swatch: "linear-gradient(135deg, #1c1712, #ff7a1a)" },
  { key: "editorial", label: "Claro Editorial", swatch: "linear-gradient(135deg, #f5eee3, #c4571a)" },
  { key: "vibrante", label: "Vibrante", swatch: "linear-gradient(135deg, #ff7a1a, #6c1f8f)" }
];

let carruselState = { generating: false, error: null, topic: "", slides: null, style: "clasico" };

const CARRUSEL_SYSTEM_PROMPT = `Sos un experto en contenido para carruseles de Instagram de negocios de hotelería, gastronomía y entretenimiento en Argentina.
Te dan un tema y el contexto de una unidad de negocio. Generá el texto completo para un carrusel de Instagram de entre 5 y 7 filminas sobre ese tema.

Tono: profesional pero cercano, como si le hablaras a un amigo. Usá "vos" (español rioplatense). Los textos deben ser CORTOS y de alto impacto visual (no párrafos largos): pensalos para que se lean en 2-3 segundos por filmina.

Estructura:
- Filmina 1: el gancho que detiene el scroll.
- Filminas del medio: desarrollo del contenido, una idea por filmina.
- Última filmina: cierre con llamada a la acción clara.

Devolvé SOLO un JSON válido (sin texto antes ni después, sin bloques de código markdown, sin backticks), con exactamente esta forma:
{
  "slides": [
    { "type": "gancho", "title": "título corto de la filmina 1", "body": "texto de apoyo breve, puede ser vacío" },
    { "type": "desarrollo", "title": "...", "body": "..." },
    { "type": "cierre", "title": "...", "body": "llamada a la acción" }
  ]
}`;

async function callAnthropicCarrusel(unit, topic) {
  const apiKey = loadApiKey();
  const userContent = `Unidad de negocio: ${unit.name}
Objetivo estratégico: ${unit.objective || ""}
Pilares de contenido: ${unit.pilares || ""}

Tema del carrusel: ${topic}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1536,
      system: CARRUSEL_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }]
    })
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => null);
    const msg = (errBody && errBody.error && errBody.error.message) || `Error ${response.status}`;
    throw new Error(msg);
  }

  const data = await response.json();
  const text = data.content && data.content[0] && data.content[0].text;
  if (!text) throw new Error("Respuesta vacía de la API.");

  const cleaned = text.trim().replace(/^```(json)?/i, "").replace(/```$/, "").trim();
  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed.slides) || !parsed.slides.length) throw new Error("La respuesta no trajo filminas.");
  return parsed.slides.map((s, i) => ({ id: `slide-${i}`, type: s.type || "desarrollo", title: s.title || "", body: s.body || "" }));
}

async function handleGenerateCarrusel(unit) {
  const input = document.getElementById("carrusel-topic-input");
  const topic = input ? input.value.trim() : "";
  if (!topic) return;

  carruselState.topic = topic;
  carruselState.generating = true;
  carruselState.error = null;
  carruselState.slides = null;
  renderUnit(unit);

  try {
    carruselState.slides = await callAnthropicCarrusel(unit, topic);
  } catch (err) {
    carruselState.error = err.message || "No se pudo generar el carrusel. Revisá tu clave de API y probá de nuevo.";
  }
  carruselState.generating = false;
  renderUnit(unit);
}

async function handleDownloadCarrusel() {
  const btn = document.getElementById("carrusel-download-btn");
  if (!btn || typeof html2canvas === "undefined" || typeof JSZip === "undefined") return;
  const slideEls = Array.from(document.querySelectorAll(".carousel-slide"));
  if (!slideEls.length) return;

  btn.disabled = true;
  btn.textContent = "Generando imágenes...";
  try {
    const zip = new JSZip();
    for (let i = 0; i < slideEls.length; i++) {
      const canvas = await html2canvas(slideEls[i], { scale: 2, backgroundColor: null });
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
      zip.file(`filmina-${i + 1}.png`, blob);
    }
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `carrusel-${slugify(carruselState.topic || "sin-titulo")}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    carruselState.error = "No se pudieron generar las imágenes para descargar.";
    const unit = UNITS.find((u) => u.id === currentUnitId);
    if (unit) renderUnit(unit);
    return;
  }
  btn.disabled = false;
  btn.textContent = "⬇ Descargar todo (.zip)";
}

function renderCarouselSlide(slide, index, total, style) {
  return `
    <div class="carousel-slide carousel-slide--${style} carousel-slide--${slide.type}" data-slide-id="${slide.id}">
      <span class="carousel-slide__index">${index + 1}/${total}</span>
      <div class="carousel-slide__content">
        <h4 class="carousel-slide__title" contenteditable="true" data-slide-field="title" data-slide-id="${slide.id}">${slide.title}</h4>
        ${slide.body ? `<p class="carousel-slide__body" contenteditable="true" data-slide-field="body" data-slide-id="${slide.id}">${slide.body}</p>` : ""}
      </div>
    </div>
  `;
}

function renderCarruseles(unit) {
  const apiKey = loadApiKey();

  return `
    <div class="section-block">
      ${renderApiKeyPanel(apiKey)}

      <div class="panel">
        <h3 class="panel__title">Generar carrusel nuevo</h3>
        <textarea id="carrusel-topic-input" class="idea-input" rows="2" placeholder="¿De qué tema querés que hable el carrusel?">${carruselState.topic}</textarea>
        <button type="button" class="guion-generate-btn" id="carrusel-generate-btn" ${carruselState.generating || !apiKey ? "disabled" : ""}>
          ${carruselState.generating ? "Generando..." : "✨ Generar carrusel"}
        </button>
        ${!apiKey ? `<p class="empty-note">Configurá tu clave de Anthropic arriba para poder generar carruseles.</p>` : ""}
        ${carruselState.error ? `<p class="guion-error">${carruselState.error}</p>` : ""}
      </div>

      ${carruselState.slides ? `
        <div class="panel">
          <div class="panel__title-row">
            <h3 class="panel__title">Estilo visual</h3>
          </div>
          <div class="carousel-style-picker">
            ${CAROUSEL_STYLES.map((s) => `
              <button type="button" class="carousel-style-btn${carruselState.style === s.key ? " carousel-style-btn--active" : ""}" data-carrusel-style="${s.key}">
                <span class="carousel-style-btn__swatch" style="background:${s.swatch}"></span>
                ${s.label}
              </button>
            `).join("")}
          </div>

          <div class="carousel-preview">
            ${carruselState.slides.map((s, i) => renderCarouselSlide(s, i, carruselState.slides.length, carruselState.style)).join("")}
          </div>

          <p class="empty-note">Tocá cualquier texto de las filminas para editarlo antes de descargar.</p>
          <button type="button" class="guion-save-btn" id="carrusel-download-btn">⬇ Descargar todo (.zip)</button>
        </div>
      ` : ""}
    </div>
  `;
}

// ---------- Sección: Métricas ----------

function computeTrend(current, previous) {
  if (previous === null || previous === undefined) return { dir: null, pct: null };
  if (previous === 0) {
    if (current === 0) return { dir: null, pct: null };
    return { dir: "up", pct: null };
  }
  const pct = ((current - previous) / Math.abs(previous)) * 100;
  if (Math.abs(pct) < 0.5) return { dir: null, pct: 0 };
  return { dir: pct > 0 ? "up" : "down", pct };
}

function renderTrendBadge(trend) {
  if (!trend || trend.dir === null) {
    return `<span class="trend-badge trend-badge--flat">— sin datos previos</span>`;
  }
  const arrow = trend.dir === "up" ? "▲" : "▼";
  const cls = trend.dir === "up" ? "trend-badge--up" : "trend-badge--down";
  const pctLabel = trend.pct !== null ? ` ${Math.abs(trend.pct).toFixed(0)}%` : "";
  return `<span class="trend-badge ${cls}">${arrow}${pctLabel}</span>`;
}

function heroCard(label, rawValue, trend, delayMs) {
  return `
    <div class="hero-card" style="animation-delay:${delayMs}ms">
      <span class="hero-card__label">${label}</span>
      <span class="hero-card__value" data-countup data-target="${rawValue}">0</span>
      ${renderTrendBadge(trend)}
    </div>
  `;
}

function renderBarChart(bars) {
  const max = Math.max(1, ...bars.map((b) => b.value));
  return `
    <div class="bar-chart">
      ${bars.map((b, i) => `
        <div class="bar-chart__col">
          <span class="bar-chart__value">${b.connected ? fmtNum(b.value) : "No conectado"}</span>
          <div class="bar-chart__track">
            <div class="bar-chart__fill${b.connected ? "" : " bar-chart__fill--disconnected"}" data-bar-target="${b.connected ? (b.value / max) * 100 : 6}" style="transition-delay:${i * 120 + 200}ms"></div>
          </div>
          <span class="bar-chart__label">${b.icon} ${b.label}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function renderMetricas(unit) {
  const history = (unit.performance && unit.performance.history) || [];
  const items = getAllItems(unit);

  if (!history.length) {
    return `<div class="section-block"><p class="empty-note">Todavía no hay métricas acumuladas de cuenta para esta unidad — se van a ir completando con la sincronización diaria.</p></div>`;
  }

  const last = history[history.length - 1];
  const half = Math.floor(history.length / 2);
  const firstHalf = history.slice(0, half);
  const secondHalf = history.slice(half);
  const avgOf = (arr, key) => (arr.length ? arr.reduce((a, d) => a + (d[key] || 0), 0) / arr.length : null);

  // Seguidores totales (IG + FB) — tendencia: suma de altas/bajas diarias reales.
  const totalFollowers = (last.followers || 0) + (last.fbFollowers || 0);
  const followersDelta = history.reduce((a, d) => a + (d.followersDelta || 0), 0);
  const followersTrend = followersDelta === 0 ? { dir: null, pct: null } : { dir: followersDelta > 0 ? "up" : "down", pct: null };

  // Interacción promedio por día.
  const avgInteractions = Math.round(avgOf(history, "interactions") || 0);
  const interactionsTrend = history.length >= 4
    ? computeTrend(avgOf(secondHalf, "interactions"), avgOf(firstHalf, "interactions"))
    : { dir: null, pct: null };

  // Visualizaciones del mes en curso vs. mes anterior.
  const now = new Date();
  const sameMonth = (d, ref) => d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
  const prevMonthRef = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  let viewsThisMonth = 0, viewsPrevMonth = 0;
  history.forEach((d) => {
    const dt = new Date(d.date + "T00:00:00");
    if (sameMonth(dt, now)) viewsThisMonth += d.views || 0;
    else if (sameMonth(dt, prevMonthRef)) viewsPrevMonth += d.views || 0;
  });
  const viewsTrend = computeTrend(viewsThisMonth, viewsPrevMonth || null);

  // Mejor post: preferentemente de los últimos 7 días; si no hay, el mejor histórico.
  const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);
  const published = items.filter((i) => typeof i.likes === "number");
  const recentPublished = published.filter((i) => { const d = parseMetaDate(i.meta); return d && d >= weekAgo; });
  const pool = recentPublished.length ? recentPublished : published;
  const bestPost = [...pool].sort((a, b) => (b.views || b.likes || 0) - (a.views || a.likes || 0))[0];
  const bestPostLabel = recentPublished.length ? "Mejor post de la semana" : "Mejor post (histórico)";

  const heroCards = [
    heroCard("Seguidores totales", totalFollowers, followersTrend, 0),
    heroCard("Interacción promedio / día", avgInteractions, interactionsTrend, 70),
    heroCard("Visualizaciones del mes", viewsThisMonth, viewsTrend, 140)
  ].join("");

  const bestPostCard = bestPost ? `
    <div class="hero-card hero-card--post" style="animation-delay:210ms">
      <span class="hero-card__label">${bestPostLabel}</span>
      <span class="hero-card__value" data-countup data-target="${bestPost.views || bestPost.likes}">0</span>
      <span class="hero-card__post-title">${thumbFor(bestPost).icon} ${bestPost.title}</span>
    </div>
  ` : `
    <div class="hero-card hero-card--post" style="animation-delay:210ms">
      <span class="hero-card__label">${bestPostLabel}</span>
      <span class="hero-card__post-title">Todavía no hay publicaciones con datos reales.</span>
    </div>
  `;

  const bars = [
    { label: "Instagram", icon: "📷", value: avgOf(history, "interactions") ? Math.round(history.reduce((a, d) => a + (d.interactions || 0), 0)) : 0, connected: true },
    { label: "Facebook", icon: "📘", value: 0, connected: false },
    { label: "TikTok", icon: "🎵", value: 0, connected: false }
  ];
  // Facebook está vinculado pero todavía no traemos interacciones nativas de la página (solo seguidores);
  // se muestra sin datos en vez de inventar un número.

  return `
    <div class="section-block">
      <div class="hero-grid">
        ${heroCards}
        ${bestPostCard}
      </div>

      <div class="panel">
        <h3 class="panel__title">Crecimiento — últimos ${history.length} día${history.length === 1 ? "" : "s"}</h3>
        ${renderMiniChart(history, true)}
      </div>

      <div class="panel">
        <h3 class="panel__title">Rendimiento por red</h3>
        ${renderBarChart(bars)}
      </div>
    </div>
  `;
}

// Se usa setTimeout (no requestAnimationFrame) para programar los pasos de
// la animación: rAF se pausa por completo en pestañas en segundo plano o sin
// foco, lo que dejaría los números/gráficos "trabados" en su estado inicial
// en esos casos. setTimeout a ~60fps se ve igual de fluido y es más robusto.
function animateMetricas() {
  const FRAME_MS = 16;

  // Números: cuentan desde 0 hasta el valor real.
  document.querySelectorAll("[data-countup]").forEach((el) => {
    const target = parseFloat(el.dataset.target) || 0;
    const duration = 900;
    const start = Date.now();
    function tick() {
      const progress = Math.min(1, (Date.now() - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = fmtNum(Math.round(target * eased));
      if (progress < 1) setTimeout(tick, FRAME_MS);
    }
    tick();
  });

  // Línea del gráfico: se dibuja de izquierda a derecha.
  const line = document.querySelector("[data-animate-line]");
  if (line) {
    const length = line.getTotalLength();
    line.style.transition = "none";
    line.style.strokeDasharray = String(length);
    line.style.strokeDashoffset = String(length);
    setTimeout(() => {
      line.style.transition = "stroke-dashoffset 1.1s ease";
      line.style.strokeDashoffset = "0";
    }, FRAME_MS);
  }

  // Barras: crecen desde 0 hasta su altura real.
  document.querySelectorAll("[data-bar-target]").forEach((el) => {
    const target = parseFloat(el.dataset.barTarget) || 0;
    setTimeout(() => {
      el.style.height = `${target}%`;
    }, FRAME_MS);
  });
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
  else if (currentSection === "guiones") sectionHtml = renderGuiones(unit);
  else if (currentSection === "carruseles") sectionHtml = renderCarruseles(unit);
  else if (currentSection === "metricas") sectionHtml = renderMetricas(unit);

  content.classList.toggle("main--full", currentSection === "calendario");

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

  if (currentSection === "metricas" || currentSection === "resumen") {
    setTimeout(animateMetricas, 16);
  }
}

function setSection(section) {
  currentSection = section;
  currentContentFilter = "todos";
  guionState = { generating: false, result: null, error: null, topic: "" };
  guionExpandedId = null;
  carruselState = { generating: false, error: null, topic: "", slides: null, style: carruselState.style };
  closeDayPanel();
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
  guionState = { generating: false, result: null, error: null, topic: "" };
  guionExpandedId = null;
  carruselState = { generating: false, error: null, topic: "", slides: null, style: carruselState.style };
  closeDayPanel();
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
    if (e.target.id === "cal-prev-month" || e.target.id === "cal-next-month") {
      const idx = MONTH_ORDER.indexOf(currentCalMonth);
      const nextIdx = e.target.id === "cal-prev-month" ? idx - 1 : idx + 1;
      if (nextIdx >= 0 && nextIdx < MONTH_ORDER.length) {
        currentCalMonth = MONTH_ORDER[nextIdx];
        const unit = UNITS.find((u) => u.id === currentUnitId);
        if (unit) renderUnit(unit);
      }
      return;
    }
    const calDayBtn = e.target.closest("[data-cal-day]");
    if (calDayBtn) {
      const monthIdx = MONTH_NUM[MONTH_TO_ABBR[currentCalMonth]];
      openDayPanel(currentUnitId, currentCalMonth, monthIdx, parseInt(calDayBtn.dataset.calDay, 10));
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
      return;
    }
    if (e.target.id === "guion-apikey-save") {
      const input = document.getElementById("guion-apikey-input");
      const key = input ? input.value.trim() : "";
      if (!key) return;
      saveApiKey(key);
      const unit = UNITS.find((u) => u.id === currentUnitId);
      if (unit) renderUnit(unit);
      return;
    }
    if (e.target.id === "guion-apikey-change") {
      saveApiKey("");
      const unit = UNITS.find((u) => u.id === currentUnitId);
      if (unit) renderUnit(unit);
      return;
    }
    if (e.target.id === "guion-generate-btn") {
      const unit = UNITS.find((u) => u.id === currentUnitId);
      if (unit) handleGenerateScript(unit);
      return;
    }
    if (e.target.id === "guion-save-btn") {
      const list = loadGuiones(currentUnitId);
      list.unshift({ ...guionState.result, id: `guion-${Date.now()}` });
      saveGuiones(currentUnitId, list);
      guionState = { generating: false, result: null, error: null, topic: "" };
      const unit = UNITS.find((u) => u.id === currentUnitId);
      if (unit) renderUnit(unit);
      return;
    }
    const deleteGuionBtn = e.target.closest("[data-delete-guion]");
    if (deleteGuionBtn) {
      const list = loadGuiones(currentUnitId).filter((g) => g.id !== deleteGuionBtn.dataset.deleteGuion);
      saveGuiones(currentUnitId, list);
      const unit = UNITS.find((u) => u.id === currentUnitId);
      if (unit) renderUnit(unit);
      return;
    }
    const toggleGuionBtn = e.target.closest("[data-toggle-guion]");
    if (toggleGuionBtn) {
      const id = toggleGuionBtn.dataset.toggleGuion;
      guionExpandedId = guionExpandedId === id ? null : id;
      const unit = UNITS.find((u) => u.id === currentUnitId);
      if (unit) renderUnit(unit);
      return;
    }
    if (e.target.id === "carrusel-generate-btn") {
      const unit = UNITS.find((u) => u.id === currentUnitId);
      if (unit) handleGenerateCarrusel(unit);
      return;
    }
    const styleBtn = e.target.closest("[data-carrusel-style]");
    if (styleBtn) {
      carruselState.style = styleBtn.dataset.carruselStyle;
      const unit = UNITS.find((u) => u.id === currentUnitId);
      if (unit) renderUnit(unit);
      return;
    }
    if (e.target.id === "carrusel-download-btn") {
      handleDownloadCarrusel();
    }
  });

  document.getElementById("content").addEventListener("input", (e) => {
    if (e.target.id === "guion-topic-input") {
      guionState.topic = e.target.value;
      return;
    }
    if (e.target.id === "carrusel-topic-input") {
      carruselState.topic = e.target.value;
      return;
    }
    const slideField = e.target.closest("[data-slide-field]");
    if (slideField && carruselState.slides) {
      const slide = carruselState.slides.find((s) => s.id === slideField.dataset.slideId);
      if (slide) slide[slideField.dataset.slideField] = e.target.textContent;
    }
  });
}

function init() {
  renderTabs();
  initContentEvents();
  initDayPanelEvents();
  const fromHash = window.location.hash.replace("#", "");
  const validIds = UNITS.map((u) => u.id);
  const initialUnit = validIds.includes(fromHash) ? fromHash : validIds[0];
  setActiveTab(initialUnit);
}

init();
