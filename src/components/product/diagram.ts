/**
 * External-dimension diagram for the product V2 FitGuide (per2.txt §二十 item 2).
 * Single geometry source shared by SSR (initial render via set:html) and the
 * client-side selector redraw (innerHTML) — the SVG is built as a plain string
 * so it is safe to emit in both contexts.
 *
 * Size strings come from pool-catalog.ts: rect "2 × 2 × 0.8", round "Ø 2 × 0.5".
 */

export interface DiagramInput {
  shape: 'rect' | 'round';
  /** rect only: length (m) */
  l?: number;
  /** rect only: width (m) */
  w?: number;
  /** wall height (m) */
  h?: number;
  /** round only: diameter (m) */
  d?: number;
  labels: { main: string; second?: string; height: string };
  captions: { top: string; side: string };
}

/** "2 × 2 × 0.8" → { l: 2, w: 2, h: 0.8 }; round "Ø …" sizes return null */
export function parseRectSize(size: string): { l: number; w: number; h: number } | null {
  if (size.includes('Ø')) return null;
  const parts = size.split('×').map((p) => parseFloat(p.trim()));
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
  return { l: parts[0], w: parts[1], h: parts[2] };
}

/** "Ø 2 × 0.5" → { d: 2, h: 0.5 }; rectangular sizes return null */
export function parseRoundSize(size: string): { d: number; h: number } | null {
  if (!size.includes('Ø')) return null;
  const parts = size
    .replace('Ø', '')
    .split('×')
    .map((p) => parseFloat(p.trim()));
  if (parts.length !== 2 || parts.some((n) => Number.isNaN(n))) return null;
  return { d: parts[0], h: parts[1] };
}

/**
 * Estimated fill volume in liters, rounded to 10 L.
 *
 * Catalog sizes are EXTERNAL dimensions, so the wall thickness is subtracted
 * twice (both sides) before the floor area is computed — otherwise the walls'
 * own footprint would be counted as water. Fill level is estimated at 80% of
 * the wall height; the actual fill line is marked inside each pool.
 */
export function estLitersFor(size: string, wallCm?: number): number | null {
  const t = wallCm && wallCm > 0 ? wallCm / 100 : 0;
  const rect = parseRectSize(size);
  if (rect) {
    const l = Math.max(0, rect.l - 2 * t);
    const w = Math.max(0, rect.w - 2 * t);
    return Math.round((l * w * (0.8 * rect.h) * 1000) / 10) * 10;
  }
  const round = parseRoundSize(size);
  if (round) {
    const d = Math.max(0, round.d - 2 * t);
    return Math.round((Math.PI * (d / 2) ** 2 * (0.8 * round.h) * 1000) / 10) * 10;
  }
  return null;
}

/**
 * Usable internal dimensions as a display string (walls subtracted):
 * rect "≈ 1.7 × 1.7 m", round "≈ Ø 1.7 m". Returns null for unparseable sizes.
 */
export function internalSizeFor(size: string, wallCm?: number): string | null {
  const t = wallCm && wallCm > 0 ? wallCm / 100 : 0;
  const fmt = (n: number) => Math.round(n * 100) / 100;
  const rect = parseRectSize(size);
  if (rect) {
    const l = Math.max(0, rect.l - 2 * t);
    const w = Math.max(0, rect.w - 2 * t);
    return `≈ ${fmt(l)} × ${fmt(w)} m`;
  }
  const round = parseRoundSize(size);
  if (round) {
    const d = Math.max(0, round.d - 2 * t);
    return `≈ Ø ${fmt(d)} m`;
  }
  return null;
}

/** Build a full DiagramInput (labels included) from a raw catalog size string */
export function diagramInputForSize(size: string, captions: { top: string; side: string }): DiagramInput | null {
  const rect = parseRectSize(size);
  if (rect) {
    return {
      shape: 'rect',
      l: rect.l,
      w: rect.w,
      h: rect.h,
      labels: { main: `${rect.l} m`, second: `${rect.w} m`, height: `${rect.h} m` },
      captions,
    };
  }
  const round = parseRoundSize(size);
  if (round) {
    return {
      shape: 'round',
      d: round.d,
      h: round.h,
      labels: { main: `Ø ${round.d} m`, height: `${round.h} m` },
      captions,
    };
  }
  return null;
}

const STROKE = '#0ea5e9';
const TEXT = '#64748b';
const TOP_CX = 100;
const TOP_CY = 92;
const SIDE_CX = 300;
const GROUND_Y = 150;
const CAPTION_Y = 200;
const FONT = 'system-ui, sans-serif';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const n = (v: number) => Math.round(v * 100) / 100;

/** Horizontal dimension line with double arrows, label centred above */
function hDim(x1: number, x2: number, y: number, label: string): string {
  return (
    `<line x1="${n(x1)}" y1="${n(y)}" x2="${n(x2)}" y2="${n(y)}" stroke="${STROKE}" stroke-width="1" marker-start="url(#darr)" marker-end="url(#darr)"/>` +
    `<text x="${n((x1 + x2) / 2)}" y="${n(y - 5)}" text-anchor="middle" font-family="${FONT}" font-size="10" fill="${TEXT}">${esc(label)}</text>`
  );
}

/** Vertical dimension line with double arrows, label centred above its top end */
function vDim(x: number, y1: number, y2: number, label: string): string {
  const top = Math.min(y1, y2);
  return (
    `<line x1="${n(x)}" y1="${n(y1)}" x2="${n(x)}" y2="${n(y2)}" stroke="${STROKE}" stroke-width="1" marker-start="url(#darr)" marker-end="url(#darr)"/>` +
    `<text x="${n(x)}" y="${n(top - 5)}" text-anchor="middle" font-family="${FONT}" font-size="10" fill="${TEXT}">${esc(label)}</text>`
  );
}

/** Side view: shape sitting on the ground line, width + height dims */
function sideView(widthM: number, heightM: number, labels: { main: string; height: string }, round: boolean): string {
  const s = Math.min(130 / widthM, 55 / heightM);
  const w = widthM * s;
  const h = heightM * s;
  const left = SIDE_CX - w / 2;
  const top = GROUND_Y - h;
  const parts: string[] = [];
  parts.push(
    `<rect x="${n(left)}" y="${n(top)}" width="${n(w)}" height="${n(h)}" rx="${round ? 4 : 2}" fill="${STROKE}" fill-opacity="0.12" stroke="${STROKE}" stroke-width="1.5"/>`
  );
  parts.push(
    `<line x1="${n(left - 15)}" y1="${GROUND_Y}" x2="${n(left + w + 15)}" y2="${GROUND_Y}" stroke="${TEXT}" stroke-width="1" stroke-dasharray="3 3" opacity="0.6"/>`
  );
  parts.push(hDim(left, left + w, GROUND_Y + 14, labels.main));
  parts.push(vDim(left + w + 14, top, GROUND_Y, labels.height));
  return parts.join('');
}

/** Render the two-panel (top + side) dimension diagram as an SVG string */
export function renderSizeDiagramSvg(input: DiagramInput): string {
  const { labels, captions } = input;
  const parts: string[] = [];

  if (input.shape === 'rect' && input.l && input.w && input.h) {
    const s = Math.min(140 / input.l, 110 / input.w);
    const w = input.l * s;
    const h = input.w * s;
    const left = TOP_CX - w / 2;
    const top = TOP_CY - h / 2;
    parts.push(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 230" role="img" aria-label="${esc(`${captions.top} / ${captions.side}`)}" class="w-full h-auto">`
    );
    parts.push(
      `<defs><marker id="darr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" fill="${STROKE}"/></marker></defs>`
    );
    parts.push(
      `<rect x="${n(left)}" y="${n(top)}" width="${n(w)}" height="${n(h)}" rx="3" fill="${STROKE}" fill-opacity="0.12" stroke="${STROKE}" stroke-width="1.5"/>`
    );
    parts.push(hDim(left, left + w, top + h + 12, labels.main));
    if (labels.second) parts.push(vDim(left + w + 12, top, top + h, labels.second));
    parts.push(sideView(input.l, input.h, { main: labels.main, height: labels.height }, false));
  } else if (input.shape === 'round' && input.d && input.h) {
    const r = Math.min(110 / input.d) * (input.d / 2);
    parts.push(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 230" role="img" aria-label="${esc(`${captions.top} / ${captions.side}`)}" class="w-full h-auto">`
    );
    parts.push(
      `<defs><marker id="darr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" fill="${STROKE}"/></marker></defs>`
    );
    parts.push(
      `<circle cx="${TOP_CX}" cy="${TOP_CY}" r="${n(r)}" fill="${STROKE}" fill-opacity="0.12" stroke="${STROKE}" stroke-width="1.5"/>`
    );
    parts.push(hDim(TOP_CX - r, TOP_CX + r, TOP_CY + r + 12, labels.main));
    parts.push(sideView(input.d, input.h, { main: labels.main, height: labels.height }, true));
  } else {
    return '';
  }

  parts.push(
    `<text x="${TOP_CX}" y="${CAPTION_Y}" text-anchor="middle" font-family="${FONT}" font-size="11" fill="${TEXT}">${esc(captions.top)}</text>`
  );
  parts.push(
    `<text x="${SIDE_CX}" y="${CAPTION_Y}" text-anchor="middle" font-family="${FONT}" font-size="11" fill="${TEXT}">${esc(captions.side)}</text>`
  );
  parts.push('</svg>');
  return parts.join('');
}
