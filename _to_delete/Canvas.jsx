// Canvas infinito estilo Figma: pan (arrastar / roda), zoom (⌘+roda, botões, atalhos),
// zoom-to-fit num item ou frame, seleção por clique.
import { forwardRef, useEffect, useImperativeHandle, useRef, useState, useCallback } from 'react'
import { FRAMES, ITEMS, FRAME_BY_ID, WORLD } from './model.js'
import { CardBody } from './Cards.jsx'

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const MIN = 0.12, MAX = 2.5

export const Canvas = forwardRef(function Canvas({ s, selected, onSelect, onZoom }, ref) {
  const stageRef = useRef(null)
  const [t, setT] = useState({ x: 40, y: 60, k: 0.5 })
  const tRef = useRef(t); tRef.current = t
  const drag = useRef(null)

  const apply = useCallback(nt => { setT(nt); onZoom?.(nt.k) }, [onZoom])

  const fitRect = useCallback((r, pad = 80, maxK = 1.1) => {
    const el = stageRef.current; if (!el) return
    const vw = el.clientWidth, vh = el.clientHeight
    const k = clamp(Math.min((vw - pad * 2) / r.w, (vh - pad * 2) / r.h), MIN, maxK)
    apply({ k, x: vw / 2 - (r.x + r.w / 2) * k, y: vh / 2 - (r.y + r.h / 2) * k })
  }, [apply])

  useImperativeHandle(ref, () => ({
    focusItem(id) { const it = ITEMS[id]; if (!it) return; fitRect({ x: it.ax, y: it.ay, w: it.w, h: it.h }, 160, 1.0) },
    focusFrame(id) { const f = FRAME_BY_ID[id]; if (!f) return; fitRect({ x: f.x, y: f.y - 30, w: f.w, h: f.h + 30 }, 60, 1.0) },
    fit() { fitRect({ x: 0, y: -30, w: WORLD.w - 200, h: WORLD.h - 200 }, 40, 1.0) },
    zoomBy(f) { const el = stageRef.current; const c = tRef.current; const cx = el.clientWidth / 2, cy = el.clientHeight / 2; const k = clamp(c.k * f, MIN, MAX); apply({ k, x: cx - (cx - c.x) * (k / c.k), y: cy - (cy - c.y) * (k / c.k) }) },
  }), [fitRect, apply])

  useEffect(() => { onZoom?.(t.k) }, []) // eslint-disable-line

  // roda: pan por padrão; ⌘/ctrl + roda = zoom no cursor (igual ao Figma)
  useEffect(() => {
    const el = stageRef.current
    const onWheel = e => {
      e.preventDefault(); const c = tRef.current
      if (e.ctrlKey || e.metaKey) {
        const rect = el.getBoundingClientRect(); const mx = e.clientX - rect.left, my = e.clientY - rect.top
        const k = clamp(c.k * Math.exp(-e.deltaY * 0.0022), MIN, MAX)
        apply({ k, x: mx - (mx - c.x) * (k / c.k), y: my - (my - c.y) * (k / c.k) })
      } else apply({ ...c, x: c.x - e.deltaX, y: c.y - e.deltaY })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [apply])

  const onDown = e => { if (e.button !== 0) return; drag.current = { x: e.clientX, y: e.clientY, tx: t.x, ty: t.y, moved: false }; stageRef.current.setPointerCapture(e.pointerId); stageRef.current.classList.add('dragging') }
  const onMove = e => { const d = drag.current; if (!d) return; const dx = e.clientX - d.x, dy = e.clientY - d.y; if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true; if (d.moved) apply({ ...tRef.current, x: d.tx + dx, y: d.ty + dy }) }
  const onUp = e => { const d = drag.current; drag.current = null; stageRef.current.classList.remove('dragging'); if (d && !d.moved && e.target === e.currentTarget) onSelect(null) }

  // atalhos: 0 = fit · +/- zoom · esc = limpar seleção
  useEffect(() => {
    const onKey = e => { if (e.target.tagName === 'INPUT') return; if (e.key === '0') ref.current?.fit(); if (e.key === '=' || e.key === '+') ref.current?.zoomBy(1.2); if (e.key === '-') ref.current?.zoomBy(1 / 1.2); if (e.key === 'Escape') onSelect(null) }
    addEventListener('keydown', onKey); return () => removeEventListener('keydown', onKey)
  }, [ref, onSelect])

  const st = id => s.flagged.has(id) ? 'flag' : s.on.has(id) ? 'on' : s.pending.has(id) ? 'pend' : 'off'

  return (
    <div className="stage" ref={stageRef} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
      <div className="world" style={{ transform: `translate(${t.x}px, ${t.y}px) scale(${t.k})` }}>
        {FRAMES.map(f => {
          const hasOn = f.items.some(i => s.on.has(i.id))
          return (
            <div key={f.id} className={'frame' + (hasOn ? ' hasOn' : '')} style={{ left: f.x, top: f.y, width: f.w, height: f.h }}>
              <div className="frame-title" onPointerDown={e => e.stopPropagation()} onClick={() => { onSelect({ frame: f.id }); ref.current?.focusFrame(f.id) }}>{f.title}</div>
              {f.items.map(it => {
                const state = st(it.id); const sel = selected?.item === it.id
                return (
                  <div key={it.id} className={`card ${state}${sel ? ' sel' : ''}`} style={{ left: it.x, top: it.y, width: it.w, height: it.h }}
                    onPointerDown={e => { if (state === 'off') return; e.stopPropagation() }}
                    onClick={e => { e.stopPropagation(); if (state === 'off') return; onSelect({ item: it.id }) }}
                    onDoubleClick={e => { e.stopPropagation(); if (state !== 'off') ref.current?.focusItem(it.id) }}>
                    <div className="card-head"><span className="card-title">{it.title}</span>{state === 'flag' ? <span className="status warn">linter</span> : state === 'pend' ? <span className="status pend">em conversa</span> : null}</div>
                    <div className="card-body">{state === 'off' ? <span>vazio</span> : <CardBody item={ITEMS[it.id]} s={s} flagged={state === 'flag'} />}</div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
      <div className="hint">arraste pra mover · <kbd>⌘</kbd>+roda dá zoom · duplo clique foca · <kbd>0</kbd> mostra tudo</div>
      <div className="maptools">
        <button className="btn round" onClick={() => ref.current?.zoomBy(1 / 1.2)} aria-label="Afastar">−</button>
        <button className="btn round" onClick={() => ref.current?.zoomBy(1.2)} aria-label="Aproximar">+</button>
        <button className="btn" onClick={() => ref.current?.fit()}>Tudo</button>
      </div>
    </div>
  )
})
