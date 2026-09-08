// Modelo: as etapas (ramos da rede) e os cards que moram em cada uma.
// Posição é responsabilidade da cena (scene.js), não daqui.

import * as D from '../data/renata.js'

function mk(id, title, items) {
  return { id, title, items }
}

export const FRAMES = [
  mk('diag', 'Diagnóstico', [
    { id: 'expert', kind: 'expert', title: 'A expert' },
    { id: 'conta', kind: 'conta', title: 'A conta fecha quando' },
    { id: 'candidatos', kind: 'candidatos', title: 'Candidatos de nome' },
    { id: 'pilha', kind: 'pilha', title: 'A pilha' },
    { id: 'mecanismo', kind: 'mecanismo', title: 'Mecanismo + manifesto' },
    { id: 'traducoes', kind: 'traducoes', title: 'Ferramentas antigas, traduzidas' },
  ]),

  mk('estrat', 'Estratégia', [
    { id: 'formato', kind: 'formato', title: 'Formato' },
    { id: 'oferta', kind: 'oferta', title: 'Oferta' },
    { id: 'segmento', kind: 'segmento', title: 'Segmento e banidos' },
    { id: 'calendario', kind: 'calendario', title: 'Calendário D-15 → D+5' },
  ]),

  mk('anuncios', 'Leva de anúncios', D.anuncios.map(a => ({ id: a.id, kind: 'anuncio', title: a.id, data: a }))),

  mk('pagina', 'Página', [
    { id: 'pagina-diag', kind: 'pagina-diag', title: 'Diagnóstico da página' },
    ...D.pagina.secoes.map(s => ({ id: 'sec-' + s.n, kind: 'secao', title: `${String(s.n).padStart(2, '0')} · ${s.nome}`, data: s })),
  ]),

  mk('roteiro', 'Roteiro da live', D.roteiro.map(b => ({ id: 'blk-' + b.n, kind: 'bloco', title: `${String(b.n).padStart(2, '0')} · ${b.nome}`, data: b }))),

  mk('reguas', 'Réguas WhatsApp', [
    ...D.reguas.A.map(([d, t], i) => ({ id: 'A-' + i, kind: 'msg', title: 'Régua A · ' + d, data: { d, t, r: 'A' } })),
    ...D.reguas.B.map(([d, t], i) => ({ id: 'B-' + i, kind: 'msg', title: 'Régua B · ' + d, data: { d, t, r: 'B' } })),
  ]),

  mk('exec', 'Execução', [
    { id: 'checklist', kind: 'checklist', title: 'Checklist de hoje' },
    { id: 'turmas', kind: 'turmas', title: 'Turmas de transmissão' },
  ]),

  mk('rastro', 'Rastreamento', [
    { id: 'utm', kind: 'utm', title: 'UTM + pixel' },
    { id: 'metricas', kind: 'metricas', title: 'Métricas × réguas' },
    { id: 'correcoes', kind: 'correcoes', title: 'Correções sugeridas' },
    { id: 'porAnuncio', kind: 'porAnuncio', title: 'Por anúncio · dia 3' },
  ]),

  mk('pos', 'Pós-live', [
    { id: 'cortes', kind: 'cortes', title: 'Cortes com virada' },
    { id: 'r02', kind: 'r02', title: 'Leva R02 · briefing' },
  ]),
]

export const ITEMS = Object.fromEntries(FRAMES.flatMap(f => f.items.map(i => [i.id, { ...i, frame: f.id }])))
export const FRAME_BY_ID = Object.fromEntries(FRAMES.map(f => [f.id, f]))


// grupos de desbloqueio usados pela jornada
export const GROUPS = {
  diag: ['expert', 'conta', 'candidatos', 'pilha', 'mecanismo', 'traducoes'],
  estrat: ['formato', 'oferta', 'segmento', 'calendario'],
  anuncios: D.anuncios.map(a => a.id),
  pagina: ['pagina-diag', ...D.pagina.secoes.map(s => 'sec-' + s.n)],
  roteiro: D.roteiro.map(b => 'blk-' + b.n),
  reguas: [...D.reguas.A.map((_, i) => 'A-' + i), ...D.reguas.B.map((_, i) => 'B-' + i)],
  exec: ['checklist', 'turmas'],
  rastro: ['utm', 'metricas'],
  campanha: ['correcoes', 'porAnuncio'],
  pos: ['cortes', 'r02'],
}
