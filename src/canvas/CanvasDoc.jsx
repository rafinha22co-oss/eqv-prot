// A campanha como documento: a tese no topo e as colunas descendo dela.
// Serve pra ler de relance o que foi entregue; o Cérebro serve pra sentir o
// estado. Frame grande (leva, página, roteiro, réguas) entra como um card de
// resumo — o detalhe abre no inspetor ou na etapa.
import { useState } from 'react'
import { COLUMNS, FRAME_BY_ID, SUMMARY, ITEMS } from './model.js'
import { CardBody } from './Cards.jsx'

const STEPS = [.4, .5, .65, .8, 1]

export function CanvasDoc({ s, selected, onSelect, onOpen, onView }) {
  const [zi, setZi] = useState(2)
  const z = STEPS[zi]
  const feito = COLUMNS.flatMap(c => c.frames).flatMap(f => FRAME_BY_ID[f].items).filter(i => s.on.has(i.id)).length
  const pend = [...s.flagged].length
  const st = id => s.flagged.has(id) ? 'flag' : s.on.has(id) ? 'on' : s.pending.has(id) ? 'pend' : 'off'

  return (
    <div className="doc">
      <header className="doc-head">
        <div>
          <div className="eyebrow">Sua campanha · entregável</div>
          <h1 className="doc-title">{s.on.has('pilha') ? (s.nome || 'Falta de Permissão') : 'Campanha em construção'}</h1>
          <div className="doc-chips">
            {COLUMNS.map((c, i) => (
              <button key={c.id} className="chip" onClick={() => document.getElementById('col-' + c.id)?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })}>
                <i>{String(i + 1).padStart(2, '0')}</i>{c.title}
              </button>
            ))}
          </div>
        </div>
        <div className="doc-actions">
          <span className={'status ' + (pend ? 'warn' : 'ok')}>{pend ? `${pend} condição a confirmar` : `${feito} peças aprovadas`}</span>
          <button className="btn">Exportar campanha</button>
        </div>
      </header>

      <div className="doc-board-wrap">
        <div className="doc-board" style={{ transform: `scale(${z})` }}>
          <div className="doc-root">
            <span className="doc-root-eyebrow">Uma tese conduz toda a campanha</span>
            <b>{s.on.has('pilha') ? (s.nome || 'Falta de Permissão') : 'a tese'}</b>
          </div>
          <div className="doc-cols">
            {COLUMNS.map(c => {
              const items = c.frames.flatMap(f => FRAME_BY_ID[f].items)
              const on = items.filter(i => s.on.has(i.id)).length
              return (
                <section className="col" id={'col-' + c.id} key={c.id}>
                  <div className="col-head"><span className="n">{c.title}</span><span className="m">{on} de {items.length}</span></div>
                  <div className="col-body">
                    {c.frames.map(fid => {
                      const f = FRAME_BY_ID[fid], sum = SUMMARY[fid]
                      if (sum) {
                        // frame grande: um card de resumo com o primeiro item como amostra
                        const first = f.items[0], state = st(first.id)
                        const nOn = f.items.filter(i => s.on.has(i.id)).length
                        return (
                          <button key={fid} className={'dcard sum ' + (nOn ? 'on' : 'off')} disabled={!nOn}
                            onClick={() => { onSelect({ frame: fid }); onOpen(fid); onView('cerebro') }}>
                            <div className="sample">{nOn ? <CardBody item={ITEMS[first.id]} s={s} /> : <span className="ph">a gerar</span>}</div>
                            <div className="dcard-foot">
                              <div><b>{f.title}</b><small>{sum}</small></div>
                              <span className="go">↗</span>
                            </div>
                            {nOn > 0 && <span className={'status ' + (f.items.some(i => s.flagged.has(i.id)) ? 'warn' : 'ok')}>{f.items.some(i => s.flagged.has(i.id)) ? 'revisar' : 'revisado'} · {nOn}</span>}
                          </button>
                        )
                      }
                      return f.items.map(it => {
                        const state = st(it.id)
                        return (
                          <button key={it.id} className={'dcard ' + state + (selected?.item === it.id ? ' sel' : '')} disabled={state === 'off'}
                            onClick={() => onSelect({ item: it.id })}>
                            <small>{it.title}</small>
                            <div className="dcard-body">{state === 'off' ? <span className="ph">a gerar</span> : <CardBody item={ITEMS[it.id]} s={s} />}</div>
                          </button>
                        )
                      })
                    })}
                  </div>
                </section>
              )
            })}
          </div>
        </div>
      </div>

      <div className="doc-foot">
        <span>Cada entrega conserva sua origem. Clique para abrir.</span>
        <div className="zoomer">
          <button onClick={() => setZi(i => Math.max(0, i - 1))} aria-label="Afastar">−</button>
          <span>{Math.round(z * 100)}%</span>
          <button onClick={() => setZi(i => Math.min(STEPS.length - 1, i + 1))} aria-label="Aproximar">+</button>
          <button className="fit" onClick={() => setZi(2)}>Enquadrar</button>
        </div>
      </div>
    </div>
  )
}
