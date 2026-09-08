// Renderizadores de card por tipo. `full` = versão do inspetor (sem cortes).
import * as D from '../data/renata.js'

const V = ({ ok }) => <span className={'v ' + (ok ? 'y' : 'n')}>{ok ? '✓' : '✕'}</span>

const R = {
  expert: () => (
    <>
      <div className="big">{D.expert.nome}</div>
      <div className="muted">{D.expert.area} · Tipo B, crença formada</div>
      <p className="quote" style={{ marginTop: 8 }}>“{D.expert.crenca}”</p>
      <div className="muted" style={{ marginTop: 8 }}>{D.expert.ativos.seguidores} seguidores · lista de {D.expert.ativos.lista} · nunca lançou · {D.expert.ativos.ticket}</div>
    </>
  ),
  conta: ({ s }) => (
    <div className="check">{D.conta.map((t, i) => <div key={i} className={s.conta > i ? 'on' : ''}><i />{t}</div>)}</div>
  ),
  candidatos: ({ s }) => (
    <table className="table"><thead><tr><th>Nome · veredito</th><th>Som</th><th>Cur.</th><th>Voc.</th></tr></thead><tbody>
      {D.candidatos.map(c => (
        <tr key={c.nome} className={s.nome === c.nome ? 'win' : ''}>
          <td><b>{c.nome}</b><div className="muted" style={{ fontSize: 11 }}>{c.veredito}</div></td>
          <td><V ok={c.som} /></td><td style={{ whiteSpace: 'nowrap' }}>{'●'.repeat(c.curiosidade)}<span className="muted">{'●'.repeat(3 - c.curiosidade)}</span></td><td><V ok={c.vocab} /></td>
        </tr>))}
    </tbody></table>
  ),
  pilha: ({ s, full }) => (
    <>
      <dl className="kv">
        <dt>Problema</dt><dd><span className="hl">{s.nome || D.pilha.problema}</span></dd>
        <dt>Causa</dt><dd>{full ? D.pilha.causa : 'aceitação condicionada a agradar'}{full && <div className="muted">{D.pilha.causaFonte}</div>}</dd>
        <dt>Solução</dt><dd><b>{D.pilha.solucao}</b>{full && <div className="muted">{D.pilha.solucaoDesc}</div>}</dd>
        <dt>Raiz</dt><dd><b>{D.pilha.raiz}</b>{full && <div className="muted">{D.pilha.raizDesc}</div>}</dd>
      </dl>
      <div className="why" style={{ marginTop: 8 }}><b>Mecanismo:</b> {D.pilha.mecanismo}</div>
    </>
  ),
  mecanismo: ({ full }) => (
    <>
      <div className="display">Permissão</div>
      <div className="muted">A teoria inteira. Pende pro lado da solução.</div>
      <p style={{ marginTop: 8 }} className={full ? '' : 'muted'}>{full ? D.pilha.manifesto : D.pilha.manifesto.slice(0, 180) + '…'}</p>
    </>
  ),
  traducoes: () => (
    <div className="rows">{D.pilha.traducoes.map(([a, b]) => <div className="row" key={a}><span className="t">{a}</span><span className="m">{b}</span></div>)}</div>
  ),
  formato: ({ full }) => (
    <>
      <div className="big">{D.matriz.formato}</div>
      <div className="check" style={{ marginTop: 8 }}>{D.matriz.porque.map(t => <div className="on" key={t}><i />{t}</div>)}</div>
      {full && <><div className="why" style={{ marginTop: 8 }}><b>Descartado:</b> {D.matriz.descartado}</div><dl className="kv" style={{ marginTop: 8 }}>{D.matriz.mecanica.map(([k, v]) => [<dt key={k}>{k}</dt>, <dd key={k + 'v'}>{v}</dd>])}</dl></>}
    </>
  ),
  oferta: () => (
    <dl className="kv">
      <dt>Produto</dt><dd><b>{D.oferta.produto}</b></dd>
      <dt>Preço</dt><dd><b>{D.oferta.preco}</b> <span className="muted">âncora {D.oferta.ancora}</span></dd>
      <dt>Garantia</dt><dd>{D.oferta.garantia}</dd>
      <dt>Urgência</dt><dd>{D.oferta.urgencia}</dd>
      <dt>Bônus</dt><dd>{D.oferta.bonus.map(b => <div key={b}>{b}</div>)}</dd>
    </dl>
  ),
  segmento: () => (
    <>
      <div className="big" style={{ textTransform: 'capitalize' }}>{D.oferta.segmento}</div>
      <div className="muted" style={{ margin: '6px 0 4px' }}>Vocabulário travado</div>
      <div className="tags">{D.oferta.travado.map(t => <span className="tag g" key={t}>{t}</span>)}</div>
      <div className="muted" style={{ margin: '8px 0 4px' }}>Banidos (o linter confere, zero ocorrências)</div>
      <div className="tags">{D.oferta.banidos.map(t => <span className="tag" key={t}>{t}</span>)}</div>
    </>
  ),
  calendario: ({ full }) => (
    <div className="cal" style={full ? { gridTemplateColumns: '1fr 1fr' } : undefined}>
      {D.calendario.map(([d, t, desc, ev]) => <div className={ev ? 'ev' : ''} key={d}><b>{d}</b>{t}{full && <div style={{ marginTop: 2 }}>{desc}</div>}</div>)}
    </div>
  ),
  checklist: () => (
    <>
      <div className="muted">Hoje: <b style={{ color: 'var(--text-default)' }}>{D.execucao.hoje}</b></div>
      <div className="check" style={{ marginTop: 6 }}>{D.execucao.checklist.map(([t, ok]) => <div className={ok ? 'on' : ''} key={t}><i />{t}</div>)}</div>
    </>
  ),
  turmas: () => (
    <div className="rows">{D.execucao.turmas.map(([a, b, c]) => <div className="row" key={a}><span className="t">{a}</span><span className="m">{b} · {c}</span></div>)}</div>
  ),
  utm: () => <div className="rows">{D.rastreamento.utm.map(([a, b]) => <div className="row" key={a}><span className="t">{a}</span><span className="m">{b}</span></div>)}</div>,
  metricas: ({ s }) => (
    <div className="metric">
      {(s.phase >= 5 ? D.campanha.resumo : D.rastreamento.reguas.map(([n, r]) => [n, '—', r, ''])).map(([n, v, r, c]) => [<span key={n}>{n}</span>, <b key={n + 'v'} className={c}>{v}</b>, <em key={n + 'r'}>{r}</em>])}
    </div>
  ),
  porAnuncio: () => (
    <table className="table"><thead><tr><th>Anúncio</th><th>Hook</th><th>CTR</th><th></th></tr></thead><tbody>
      {D.campanha.porAnuncio.map(([a, h, c, st]) => <tr key={a}><td><b>{a}</b></td><td>{h}</td><td>{c}</td><td><span className={'status ' + (st === 'matar' ? 'warn' : st === 'vencedor' ? 'ok' : 'off')}>{st}</span></td></tr>)}
    </tbody></table>
  ),
  correcoes: () => (
    <div className="rows">{D.campanha.correcoes.map(([t, d, st]) => <div className={'row ' + (st === 'warn' ? 'warn' : 'good')} key={t} style={{ flexDirection: 'column', alignItems: 'stretch', gap: 2 }}><span className="t">{t}</span><span className="muted" style={{ fontSize: 12, whiteSpace: 'normal' }}>{d}</span></div>)}</div>
  ),
  cortes: () => (
    <div className="rows">{D.campanha.cortes.map(([t, q, ok]) => <div className={'row ' + (ok ? 'good' : 'warn')} key={t}><span className="t"><span className="muted" style={{ fontSize: 11, display: 'block', fontVariantNumeric: 'tabular-nums' }}>{t}</span>{q}</span><span className="m">{ok ? 'virada ✓' : 'rejeitado'}</span></div>)}</div>
  ),
  r02: () => <div className="check">{D.campanha.r02.map(t => <div className="on" key={t}><i />{t}</div>)}</div>,
  anuncio: ({ item, full }) => {
    const a = item.data
    return (
      <div className="ad">
        <div className="frame9"><span>{a.headline}</span></div>
        <div className="tags"><span className="tag g">{a.angulo}</span><span className="tag">{a.formato}</span><span className="tag">{a.nivel}</span></div>
        {full ? (
          <><p><b>Hook.</b> {a.hook}</p><p><b>Desenvolvimento.</b> {a.corpo}</p><p><b>CTA.</b> {a.cta}</p>
            <dl className="kv" style={{ marginTop: 8 }}><dt>Objeção</dt><dd>{a.objecao}</dd><dt>Prova</dt><dd>{a.prova}</dd><dt>Duração</dt><dd>75-90s · headline na tela obrigatória</dd><dt>UTM</dt><dd className="mono">renata-r01--{a.id.toLowerCase().slice(4)}-{a.angulo.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\W+/g, '-')}</dd></dl></>
        ) : <div className="script">{a.hook} {a.corpo}</div>}
      </div>
    )
  },
  'pagina-diag': () => <dl className="kv">{D.pagina.diagnostico.map(([k, v]) => [<dt key={k}>{k}</dt>, <dd key={k + 'v'}>{v}</dd>])}</dl>,
  secao: ({ item, full }) => {
    const sct = item.data
    if (sct.n === 1) return <><div className="muted" style={{ fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' }}>{sct.eyebrow}</div><div className="big" style={{ margin: '4px 0' }}>{sct.h1}</div><p className="muted">{sct.sub}</p><div style={{ marginTop: 8 }}><span className="btn primary sm" style={{ pointerEvents: 'none' }}>{sct.cta}</span></div></>
    return <>{sct.sub && <div className="quote" style={{ marginBottom: 4 }}>{sct.sub}</div>}<p className={full ? '' : ''}>{sct.texto}</p>{sct.destaque && <div className="accent" style={{ marginTop: 6, fontSize: 12 }}>{sct.destaque}</div>}</>
  },
  bloco: ({ item, full, flagged }) => {
    const b = item.data
    return <><div className="muted">min {b.min}</div><p style={{ marginTop: 4 }}>{b.texto}</p>{b.chat && <div className="tag" style={{ marginTop: 6 }}>[CHAT] {full ? b.chat : 'micro-compromisso'}</div>}{b.slide && <div className="tag g" style={{ marginTop: 6 }}>[SLIDE] {b.slide}</div>}{flagged && b.lint && <div className="why" style={{ marginTop: 8, borderLeftColor: 'var(--bad)' }}><b>Linter:</b> {b.lint}</div>}</>
  },
  msg: ({ item }) => <div className="bubble">{item.data.t}</div>,
}

export function CardBody({ item, s, full = false, flagged = false }) {
  const Comp = R[item.kind]
  return Comp ? <Comp item={item} s={s} full={full} flagged={flagged} /> : null
}

/* Versão compacta, para o nó na rede: uma linha que diz o que aquilo virou. */
const P = {
  expert: () => <b>{D.expert.nome} · Tipo B</b>,
  conta: ({ s }) => <b>{s.conta} de 3 respondidas</b>,
  candidatos: ({ s }) => <b>{s.nome || '5 candidatos'}</b>,
  pilha: ({ s }) => <b>{s.nome || D.pilha.problema}</b>,
  mecanismo: () => <b>Permissão</b>,
  traducoes: () => <span>6 sessões traduzidas</span>,
  formato: () => <b>{D.matriz.formato}</b>,
  oferta: () => <b>{D.oferta.preco} · 12 vagas</b>,
  segmento: () => <span>psicóloga · 6 banidos</span>,
  calendario: () => <span>D-15 → D+5 · live no D0</span>,
  checklist: () => <span>hoje: D-15 · 4 abertos</span>,
  turmas: () => <span>2 turmas · 640 contatos</span>,
  utm: () => <span>1 UTM por anúncio</span>,
  metricas: ({ s }) => s.phase >= 5 ? <b>5 de 5 na régua</b> : <span>5 réguas armadas</span>,
  porAnuncio: () => <span>A3 vencedor · A4 matar</span>,
  correcoes: () => <b>verba +30%</b>,
  cortes: () => <span>3 cortes · 1 rejeitado</span>,
  r02: () => <span>A3 vira matriz</span>,
  anuncio: ({ item }) => <><span className="chip">{item.data.headline}</span><em>{item.data.angulo}</em></>,
  'pagina-diag': () => <span>8 campos · long-form</span>,
  secao: ({ item }) => <span>{item.data.h1 || item.data.sub || item.data.texto}</span>,
  bloco: ({ item }) => <span>min {item.data.min} · {item.data.texto}</span>,
  msg: ({ item }) => <span>{item.data.t.split('\n')[0]}</span>,
}
export function Preview({ item, s }) {
  const C = P[item.kind]
  return <span className="prev">{C ? <C item={item} s={s} /> : null}</span>
}
