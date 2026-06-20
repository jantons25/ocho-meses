/**
 * Exportación del mapa de aventuras a JPG — sin dependencias externas.
 *
 * Estrategia (robusta y compatible con Chrome, Edge, Firefox y Safari):
 *
 *  1. El mapa ya es un <svg> con las fotos como <image> recortadas por
 *     <clipPath>. Se serializa ese SVG directamente —con las imágenes
 *     convertidas a data-URL y los estilos calculados (que resuelven las
 *     variables CSS) incrustados— y se rasteriza dibujándolo en un <canvas>.
 *     Es la vía nativa para <image>+<clipPath>; html-to-image fallaba aquí
 *     (rasterizaba esas regiones en negro vía <foreignObject>).
 *
 *  2. Las tipografías de las etiquetas se incrustan como @font-face base64
 *     dentro del SVG, de modo que el texto conserva la fuente real.
 *
 *  3. La placa "Nuestras Aventuras" se dibuja con la API 2D del canvas
 *     (usando las fuentes ya cargadas en la página). Se evita <foreignObject>
 *     a propósito: en Firefox/Safari puede "contaminar" el canvas e impedir
 *     toDataURL().
 *
 * Todo ocurre bajo demanda y este módulo se importa de forma diferida desde
 * el componente, por lo que no afecta al bundle inicial.
 */

const SVGNS = 'http://www.w3.org/2000/svg';
const XLINK = 'http://www.w3.org/1999/xlink';

const PAINT_PROPS = [
  'fill',
  'stroke',
  'stroke-width',
  'opacity',
  'paint-order',
  'stroke-linejoin',
  'stroke-linecap',
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'letter-spacing',
];

const GOOGLE_FONTS_CSS =
  'https://fonts.googleapis.com/css2?family=Great+Vibes&family=Dancing+Script:wght@500;600&family=Poppins:ital,wght@0,300;0,400;0,500;1,300&display=swap';

function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

async function resourceToDataURL(url: string): Promise<string> {
  const res = await fetch(url, { mode: 'cors' });
  const blob = await res.blob();
  return await new Promise((resolve) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.readAsDataURL(blob);
  });
}

/** @font-face con los .woff2 incrustados en base64 (best-effort). */
async function buildFontEmbedCSS(): Promise<string> {
  try {
    let css = await (await fetch(GOOGLE_FONTS_CSS)).text();
    const urls = [
      ...new Set([...css.matchAll(/url\((https:\/\/[^)]+\.woff2)\)/g)].map((m) => m[1])),
    ];
    const map: Record<string, string> = {};
    await Promise.all(urls.map(async (u) => (map[u] = await resourceToDataURL(u))));
    css = css.replace(/url\((https:\/\/[^)]+\.woff2)\)/g, (_m, u) => `url(${map[u]})`);
    return css;
  } catch {
    // Si falla la descarga de fuentes, el texto usa una fuente de respaldo;
    // la exportación sigue funcionando.
    return '';
  }
}

/** Copia los estilos calculados (resuelve var()) sobre el clon. */
function inlineComputedStyles(orig: Element, clone: Element): void {
  const o = [orig, ...orig.querySelectorAll('*')];
  const c = [clone, ...clone.querySelectorAll('*')];
  o.forEach((oe, i) => {
    const ce = c[i] as SVGElement | undefined;
    if (!ce || !ce.style) return;
    const cs = getComputedStyle(oe);
    for (const p of PAINT_PROPS) {
      const v = cs.getPropertyValue(p);
      if (p === 'fill' || p === 'stroke' || (v && v !== 'normal' && v !== 'none')) {
        ce.style.setProperty(p, v);
      }
    }
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('No se pudo rasterizar el SVG'));
    img.src = src;
  });
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

interface Bounds {
  minX: number;
  minY: number;
  W: number;
  H: number;
}

/** Construye el SVG con mapa + decoraciones + fuentes y lo devuelve como Image. */
async function buildLayerImage(stage: HTMLElement, b: Bounds): Promise<HTMLImageElement> {
  const rel = (el: Element) => {
    const r = el.getBoundingClientRect();
    return { x: r.left - b.minX, y: r.top - b.minY, w: r.width, h: r.height };
  };

  const master = document.createElementNS(SVGNS, 'svg');
  master.setAttribute('xmlns', SVGNS);
  master.setAttribute('xmlns:xlink', XLINK);
  master.setAttribute('width', String(b.W));
  master.setAttribute('height', String(b.H));
  master.setAttribute('viewBox', `0 0 ${b.W} ${b.H}`);

  const fontCSS = await buildFontEmbedCSS();
  if (fontCSS) {
    const style = document.createElementNS(SVGNS, 'style');
    style.textContent = fontCSS;
    master.appendChild(style);
  }

  const bg = document.createElementNS(SVGNS, 'rect');
  bg.setAttribute('width', String(b.W));
  bg.setAttribute('height', String(b.H));
  bg.setAttribute('fill', cssVar('--paper') || '#f7f2ed');
  master.appendChild(bg);

  // ---- mapa ----
  const mapEl = stage.querySelector('.tm-map') as SVGSVGElement | null;
  if (mapEl) {
    const mp = rel(mapEl);
    const clone = mapEl.cloneNode(true) as SVGSVGElement;
    const oImgs = [...mapEl.querySelectorAll('image')];
    const cImgs = [...clone.querySelectorAll('image')];
    await Promise.all(
      oImgs.map(async (im, i) => {
        const href = im.getAttribute('href') || im.getAttributeNS(XLINK, 'href');
        if (!href) return;
        const du = await resourceToDataURL(href);
        cImgs[i].setAttribute('href', du);
        cImgs[i].setAttributeNS(XLINK, 'href', du);
      }),
    );
    inlineComputedStyles(mapEl, clone);
    // los <stop> del degradado no heredan las variables: se fijan explícitos
    const oStops = [...mapEl.querySelectorAll('stop')];
    const cStops = [...clone.querySelectorAll('stop')];
    oStops.forEach((o, i) => cStops[i]?.setAttribute('stop-color', getComputedStyle(o).stopColor));
    clone.setAttribute('x', String(mp.x));
    clone.setAttribute('y', String(mp.y));
    clone.setAttribute('width', String(mp.w));
    clone.setAttribute('height', String(mp.h));
    clone.removeAttribute('class');
    master.appendChild(clone);
  }

  // ---- decoraciones ----
  stage.querySelectorAll('.tm-deco').forEach((de) => {
    const p = rel(de);
    const dc = de.cloneNode(true) as SVGElement;
    inlineComputedStyles(de, dc);
    dc.setAttribute('x', String(p.x));
    dc.setAttribute('y', String(p.y));
    dc.setAttribute('width', String(p.w));
    dc.setAttribute('height', String(p.h));
    dc.style.opacity = getComputedStyle(de).opacity;
    dc.removeAttribute('class');
    master.appendChild(dc);
  });

  const xml = new XMLSerializer().serializeToString(master);
  const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);
  await loadFontsReady();
  return await loadImage(url);
}

async function loadFontsReady(): Promise<void> {
  try {
    await (document as Document & { fonts?: FontFaceSet }).fonts?.ready;
  } catch {
    /* noop */
  }
}

/** Dibuja la placa "Nuestras Aventuras" con la API 2D (sin foreignObject). */
function drawPlaque(ctx: CanvasRenderingContext2D, stage: HTMLElement, b: Bounds): void {
  const plaque = stage.querySelector('.tm-plaque') as HTMLElement | null;
  if (!plaque) return;
  const pr = plaque.getBoundingClientRect();
  const pcs = getComputedStyle(plaque);
  const x = pr.left - b.minX;
  const y = pr.top - b.minY;
  const w = pr.width;
  const h = pr.height;
  const radius = parseFloat(pcs.borderTopLeftRadius) || 8;

  // sombra + tarjeta
  ctx.save();
  ctx.shadowColor = 'rgba(110, 15, 44, 0.18)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 10;
  roundRectPath(ctx, x, y, w, h, radius);
  ctx.fillStyle = pcs.backgroundColor || cssVar('--paper-alt');
  ctx.fill();
  ctx.restore();

  // borde interior
  roundRectPath(ctx, x, y, w, h, radius);
  ctx.strokeStyle = pcs.borderTopColor || cssVar('--rose');
  ctx.lineWidth = parseFloat(pcs.borderTopWidth) || 1;
  ctx.stroke();

  // contorno exterior (outline con offset)
  const off = parseFloat(pcs.outlineOffset) || 4;
  roundRectPath(ctx, x - off, y - off, w + off * 2, h + off * 2, radius + off);
  ctx.strokeStyle = pcs.outlineColor || cssVar('--burgundy');
  ctx.lineWidth = parseFloat(pcs.outlineWidth) || 1;
  ctx.stroke();

  // textos: cada hijo (.tm-plaque-title / .tm-plaque-sub) según su posición real
  ctx.textBaseline = 'top';
  [...plaque.children].forEach((span) => {
    const scs = getComputedStyle(span as Element);
    const sr = (span as Element).getBoundingClientRect();
    const fontSize = parseFloat(scs.fontSize);
    const lineHeight = parseFloat(scs.lineHeight) || fontSize * 1.2;
    ctx.font = `${scs.fontStyle} ${scs.fontWeight} ${fontSize}px ${scs.fontFamily}`;
    ctx.fillStyle = scs.color;
    const startX = sr.left - b.minX;
    let startY = sr.top - b.minY;
    // ajuste de línea por palabras dentro del ancho del span
    const maxW = Math.max(sr.width, w - 24);
    const words = (span.textContent || '').split(/\s+/).filter(Boolean);
    let line = '';
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line, startX, startY);
        line = word;
        startY += lineHeight;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, startX, startY);
  });
}

function triggerDownload(dataUrl: string, fileName: string): void {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * Captura el área del mapa (mapa + fotos + nombres + decoraciones + placa)
 * y descarga un JPG de alta calidad. Excluye cualquier elemento ajeno
 * (header, footer, botón de descarga…) porque solo se serializan los nodos
 * del propio escenario del mapa.
 */
export async function exportTravelMapToJpeg(
  stage: HTMLElement,
  fileName: string,
): Promise<void> {
  const sr = stage.getBoundingClientRect();
  // caja de unión: incluye lo que desborda el escenario (decoraciones y placa)
  let minX = sr.left;
  let minY = sr.top;
  let maxX = sr.right;
  let maxY = sr.bottom;
  stage.querySelectorAll('.tm-deco, .tm-plaque').forEach((el) => {
    const r = el.getBoundingClientRect();
    minX = Math.min(minX, r.left);
    minY = Math.min(minY, r.top);
    maxX = Math.max(maxX, r.right);
    maxY = Math.max(maxY, r.bottom);
  });
  const PAD = 8;
  minX -= PAD;
  minY -= PAD;
  maxX += PAD;
  maxY += PAD;
  const bounds: Bounds = { minX, minY, W: maxX - minX, H: maxY - minY };

  const layer = await buildLayerImage(stage, bounds);

  // alta resolución para redes/impresión básica, con tope para no exceder
  // límites de canvas en móviles.
  const ratio = Math.min(2, Math.max(1, window.devicePixelRatio || 1.5));
  const scale = Math.max(2, ratio);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bounds.W * scale);
  canvas.height = Math.round(bounds.H * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas no disponible');
  ctx.scale(scale, scale);
  // fondo opaco: evita transparencias en el JPG
  ctx.fillStyle = cssVar('--paper') || '#f7f2ed';
  ctx.fillRect(0, 0, bounds.W, bounds.H);
  ctx.drawImage(layer, 0, 0, bounds.W, bounds.H);

  await loadFontsReady();
  drawPlaque(ctx, stage, bounds);

  const jpeg = canvas.toDataURL('image/jpeg', 0.95);
  triggerDownload(jpeg, fileName);
}
