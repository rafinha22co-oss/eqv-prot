// Layout da cena. Portado da lógica do nold-prot v3 (js/v3.js):
// posições em pixels calculadas a partir do tamanho do palco, um alvo por nó,
// e o renderer interpola de onde o nó está pra onde ele deve ir.
import { FRAMES, FRAME_BY_ID, ITEMS } from './model.js'

export const mix = (a, b, t) => a + (b - a) * t
export const smooth = u => u * u * u * (u * (u * 6 - 15) + 10)
export const phaseOf = id => [...id].reduce((n, c) => n + c.charCodeAt(0), 0)

// alturas por tipo de card na visão de etapa
const cardSize = kind => kind === 'anuncio' ? [186, 104] : kind === 'msg' ? [186, 92] : [186, 78]

// anéis: no máximo 6 no primeiro, 8 nos seguintes
function rings(n) {
  const out = []
  let left = n, i = 0
  while (left > 0) { const cap = Math.min(left, i === 0 ? 6 : 8); out.push(cap); left -= cap; i++ }
  return out
}

export function center(w, h) { return { x: w * .5, y: h * .47 } }

/**
 * Alvos da cena para o estado atual.
 * @param open  id da etapa aberta (ou null = visão geral)
 * @param s     estado da jornada (on / pending / flagged)
 */
export function targetsFor(open, s, w, h) {
  const c = center(w, h), out = []
  const stateOf = id => s.flagged.has(id) ? 'flag' : s.on.has(id) ? 'on' : s.pending.has(id) ? 'pend' : 'off'
  const countOf = f => f.items.filter(i => s.on.has(i.id)).length

  if (!open) {
    // núcleo + uma etapa por ramo, em volta, com raio alternado (rede, não relógio)
    out.push({ id: 'core', x: c.x, y: c.y, type: 'core', parent: null })
    const R = Math.min(w * .35, 420), RY = Math.min(h * .30, 280)
    FRAMES.forEach((f, i) => {
      const a = -Math.PI / 2 + i * 2 * Math.PI / FRAMES.length
      const k = i % 2 ? .80 : 1
      const n = countOf(f), total = f.items.length
      const cls = f.items.some(x => s.flagged.has(x.id)) ? 'flag' : n === total ? 'on' : n > 0 || f.items.some(x => s.pending.has(x.id)) ? 'pend' : 'off'
      const x = c.x + Math.cos(a) * R * k, y = c.y + Math.sin(a) * RY * k
      out.push({ id: f.id, x, y, type: 'branch', parent: 'core', frame: f.id, cls, n, total })
      // sinapses: um ponto por card já gerado, num arco por fora do ramo
      if (n > 0) {
        const list = f.items.slice(0, 12), m = list.length
        const spread = Math.min(1.25, .18 * m)
        list.forEach((it, j) => {
          const b = a + (m === 1 ? 0 : (j / (m - 1) - .5) * spread)
          const rr = 106 + (j % 2) * 16
          out.push({ id: 'syn-' + it.id, x: x + Math.cos(b) * rr, y: y + Math.sin(b) * rr * .9, type: 'syn', parent: f.id, item: it.id, cls: stateOf(it.id) })
        })
      }
    })
    return out
  }

  // etapa aberta: ela vira o centro, os cards em anéis à volta
  const f = FRAME_BY_ID[open]
  out.push({ id: f.id, x: c.x, y: c.y, type: 'nucleus', parent: null, frame: f.id, n: countOf(f), total: f.items.length })
  const list = f.items
  const r0 = Math.min(w, h) * .30, step = Math.min(w, h) * .175
  let idx = 0
  rings(list.length).forEach((cap, ri) => {
    const rad = r0 + ri * step, off = ri % 2 ? Math.PI / cap : 0
    for (let j = 0; j < cap; j++, idx++) {
      const it = list[idx]
      const a = -Math.PI / 2 + off + j * 2 * Math.PI / cap
      const [cw, ch] = cardSize(it.kind)
      out.push({ id: it.id, x: c.x + Math.cos(a) * rad, y: c.y + Math.sin(a) * rad * .86, type: 'card', parent: f.id, item: it.id, cls: stateOf(it.id), w: cw, h: ch })
    }
  })
  out.push({ id: 'return', x: 92, y: h * .1, type: 'return', parent: f.id })
  return out
}

export { ITEMS, FRAME_BY_ID, FRAMES }
