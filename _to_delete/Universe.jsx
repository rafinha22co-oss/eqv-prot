// O universo. Dois níveis:
//   visão geral  — o núcleo (a tese) e as galáxias (uma por etapa) ligadas por arcos;
//                  a galáxia acende conforme a conversa gera o que mora nela.
//   galáxia      — clicou/zoom: os cards daquela etapa aparecem em volta do centro.
// Pan por arraste/roda, zoom por ⌘+roda, transições animadas. Luz só aqui: o DS é sem
// sombra em todo o resto; o universo é a exceção deliberada (como no Nold).
import { forwardRef, useEffect, useImperativeHandle, useRef, useState, useCallback } from 'react'
import { FRAMES, ITEMS, FRAME_BY_ID, HUB, LINKS, SPOKES, WORLD } from './model.js'
import { CardBody } from './Cards.jsx'

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const MIN = 0.06, MAX = 2
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches
const pos = id => id === 'hub' ? HUB : FRAME_BY_ID[id]
const arc = (a, b) => { const mx = (a.cx + b.cx) / 2, my = (a.cy + b.cy) / 2, dx = b.cy - a.cy, dy = a.cx - b.cx; return `M${a.cx},${a.cy} Q${mx + dx * .18},${my + dy * .18} ${b.cx},${b.cy}` }

export const Universe = forwardRef(function Universe({ s, selected, open, onOpen, onSelect, onZoom, sparks }, ref) {
  const stageRef = useRef(null), bgRef = useRef(null), svgRef = useRef(null)
  const [t, setT] = useState({ x: 0, y: 0, k: 0.22 })
  const tRef = useRef(t); tRef.current = t
  const drag = useRef(null), anim = useRef(null)

  const apply = useCallback(nt => { setT(nt); onZoom?.(nt.k) }, [onZoom])
  const animateTo = useCallback((target, ms = 560) => {
    if (anim.current) cancelAnimationFrame(anim.current)
    if (REDUCED) return apply(target)
    const from = { ...tRef.current }, t0 = performance.now()
    const ease = x => 1 - Math.pow(1 - x, 3)
    const step = now => { const p = Math.min(1, (now - t0) / ms), e = ease(p); apply({ x: from.x + (target.x - from.x) * e, y: from.y + (target.y - from.y) * e, k: from.k + (target.k - from.k) * e }); if (p < 1) anim.current = requestAnimationFrame(step) }
    anim.current = requestAnimationFrame(step)
  }, [apply])
  const fitRect = useCallback((r, pad = 80, maxK = 1.1, ms) => {
    const el = stageRef.current; if (!el) return
    const vw = el.clientWidth, vh = el.clientHeight
    const k = clamp(Math.min((vw - pad * 2) / r.w, (vh - pad * 2) / r.h), MIN, maxK)
    animateTo({ k, x: vw / 2 - (r.x + r.w / 2) * k, y: vh / 2 - (r.y + r.h / 2) * k }, ms)
  }, [animateTo])

  useImperativeHandle(ref, () => ({
    universe() { onOpen(null); fitRect({ x: WORLD.x + 200, y: WORLD.y + 200, w: WORLD.w - 400, h: WORLD.h - 400 }, 40, 1) },
    galaxy(id) { const f = FRAME_BY_ID[id]; if (!f) return; onOpen(id); fitRect({ x: f.x, y: f.y - 60, w: f.w, h: f.h + 60 }, 60, 0.9) },
    item(id) { const it = ITEMS[id]; if (!it) return; onOpen(it.frame); fitRect({ x: it.ax, y: it.ay, w: it.w, h: it.h }, 140, 1.0) },
    zoomBy(f) { const el = stageRef.current, c = tRef.current, cx = el.clientWidth / 2, cy = el.clientHeight / 2, k = clamp(c.k * f, MIN, MAX); animateTo({ k, x: cx - (cx - c.x) * (k / c.k), y: cy - (cy - c.y) * (k / c.k) }, 220) },
  }), [fitRect, animateTo, onOpen])

  useEffect(() => { ref.current?.universe() }, []) // eslint-disable-line

  // roda: pan; ⌘/ctrl+roda: zoom no cursor
  useEffect(() => {
    const el = stageRef.current
    const onWheel = e => {
      e.preventDefault(); if (anim.current) cancelAnimationFrame(anim.current); const c = tRef.current
      if (e.ctrlKey || e.metaKey) { const r = el.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top, k = clamp(c.k * Math.exp(-e.deltaY * 0.0022), MIN, MAX); apply({ k, x: mx - (mx - c.x) * (k / c.k), y: my - (my - c.y) * (k / c.k) }) }
      else apply({ ...c, x: c.x - e.deltaX, y: c.y - e.deltaY })
    }
    el.addEventListener('wheel', onWheel, { passive: false }); return () => el.removeEventListener('wheel', onWheel)
  }, [apply])
  const onDown = e => { if (e.button !== 0) return; if (anim.current) cancelAnimationFrame(anim.current); drag.current = { x: e.clientX, y: e.clientY, tx: t.x, ty: t.y, moved: false }; stageRef.current.setPointerCapture(e.pointerId); stageRef.current.classList.add('dragging') }
  const onMove = e => { const d = drag.current; if (!d) return; const dx = e.clientX - d.x, dy = e.clientY - d.y; if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true; if (d.moved) apply({ ...tRef.current, x: d.tx + dx, y: d.ty + dy }) }
  const onUp = e => { const d = drag.current; drag.current = null; stageRef.current.classList.remove('dragging'); if (d && !d.moved && (e.target === e.currentTarget || e.target === svgRef.current)) onSelect(null) }
  useEffect(() => {
    const onKey = e => { if (e.target.tagName === 'INPUT') return; if (e.key === '0') ref.current?.universe(); if (e.key === '=' || e.key === '+') ref.current?.zoomBy(1.25); if (e.key === '-') ref.current?.zoomBy(0.8); if (e.key === 'Escape') { if (selected) onSelect(null); else ref.current?.universe() } }
    addEventListener('keydown', onKey); return () => removeEventListener('keydown', onKey)
  }, [ref, onSelect, selected])

  // fundo vivo: névoa ouro que acompanha o núcleo + poeira
  useEffect(() => {
    const cv = bgRef.current, cx2 = cv.getContext('2d'); let dots = [], raf = 0, last = 0, W = 0, H = 0
    const seed = () => { W = stageRef.current.clientWidth; H = stageRef.current.clientHeight; dots = Array.from({ length: Math.round(W * H / 14000) }, () => ({ x: Math.random() * W, y: Math.random() * H, r: .5 + Math.random() * 1.2, a: .06 + Math.random() * .26, vx: (Math.random() - .5) * .07, vy: (Math.random() - .5) * .07, warm: Math.random() < .14, ph: Math.random() * 6.3 })) }
    const draw = now => {
      const dpr = Math.min(devicePixelRatio || 1, 1.5); if (cv.width !== W * dpr || cv.height !== H * dpr) { cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px' }
      cx2.setTransform(dpr, 0, 0, dpr, 0, 0); cx2.clearRect(0, 0, W, H)
      const c = tRef.current, hx = c.x + HUB.cx * c.k, hy = c.y + HUB.cy * c.k
      const lit = s.on.has('pilha')
      let g = cx2.createRadialGradient(hx, hy, 0, hx, hy, Math.max(W, H) * (lit ? .5 : .3)); g.addColorStop(0, `rgba(196,154,60,${lit ? .10 : .045})`); g.addColorStop(.5, 'rgba(196,154,60,.02)'); g.addColorStop(1, 'rgba(196,154,60,0)'); cx2.fillStyle = g; cx2.fillRect(0, 0, W, H)
      for (const d of dots) { if (!REDUCED) { d.x += d.vx; d.y += d.vy; if (d.x < 0) d.x += W; if (d.x > W) d.x -= W; if (d.y < 0) d.y += H; if (d.y > H) d.y -= H } const tw = .75 + .25 * Math.sin(now * .0012 + d.ph); cx2.beginPath(); cx2.arc(d.x, d.y, d.r, 0, 6.3); cx2.fillStyle = d.warm ? `rgba(196,154,60,${d.a * tw})` : `rgba(242,242,240,${d.a * tw})`; cx2.fill() }
    }
    const loop = now => { if (now - last > 33) { last = now; draw(now) } raf = requestAnimationFrame(loop) }
    seed(); raf = requestAnimationFrame(loop); addEventListener('resize', seed)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', seed) }
  }, [s.on])

  const galaxyState = f => { const n = f.items.filter(i => s.on.has(i.id)).length; const p = f.items.some(i => s.pending.has(i.id)); const flag = f.items.some(i => s.flagged.has(i.id)); return { n, total: f.items.length, cls: flag ? 'flag' : n === f.items.length ? 'on' : n > 0 || p ? 'pend' : 'off' } }
  const linkOn = (a, b) => (a === 'hub' ? s.on.has('expert') : galaxyState(FRAME_BY_ID[a]).n > 0) && galaxyState(FRAME_BY_ID[b]).n > 0
  const st = id => s.flagged.has(id) ? 'flag' : s.on.has(id) ? 'on' : s.pending.has(id) ? 'pend' : 'off'
  const openF = open ? FRAME_BY_ID[open] : null
  const hubLit = s.on.has('pilha'), hubPend = s.on.has('expert') && !hubLit

  return (
    <div className="stage universe" ref={stageRef} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
      <canvas ref={bgRef} className="bg" />
      <div className="world" style={{ transform: `translate(${t.x}px, ${t.y}px) scale(${t.k})` }}>
        <svg ref={svgRef} className="net" style={{ left: WORLD.x, top: WORLD.y, width: WORLD.w, height: WORLD.h }} viewBox={`${WORLD.x} ${WORLD.y} ${WORLD.w} ${WORLD.h}`}>
          <defs>
            <radialGradient id="orb" cx="38%" cy="32%" r="72%"><stop offset="0" stopColor="#fff2cc" /><stop offset=".34" stopColor="#e2b85a" /><stop offset=".74" stopColor="#8a6a22" /><stop offset="1" stopColor="#2a2210" /></radialGradient>
            <radialGradient id="halo"><stop offset="0" stopColor="#c49a3c" stopOpacity=".4" /><stop offset=".55" stopColor="#c49a3c" stopOpacity=".08" /><stop offset="1" stopColor="#c49a3c" stopOpacity="0" /></radialGradient>
          </defs>
          {SPOKES.map(([a, b]) => <path key={'s' + a + b} className={'arc dendrite' + (galaxyState(FRAME_BY_ID[b]).n > 0 ? ' on' : '') + (open ? ' hidden' : '')} d={arc(pos(a), pos(b))} />)}
          {LINKS.map(([a, b]) => <path key={a + b} className={'arc axon' + (linkOn(a, b) ? ' on' : '') + (open ? ' hidden' : '')} d={arc(pos(a), pos(b))} />)}
          {sparks.map(sp => <Spark key={sp.id} d={arc(pos(sp.from), pos(sp.to))} />)}
          {/* núcleo */}
          <g className={'hub' + (hubLit ? ' on' : hubPend ? ' pend' : '')} transform={`translate(${HUB.cx},${HUB.cy})`} onPointerDown={e => e.stopPropagation()} onClick={() => { onSelect({ item: 'pilha' }); if (s.on.has('pilha')) ref.current?.item('pilha') }}>
            <circle className="halo" r="460" fill="url(#halo)" /><circle className="ring r1" r="190" /><circle className="ring r2" r="240" /><circle className={"core" + (hubLit ? " lit" : "")} r="135" fill="url(#orb)" />
            <text className="name" y="330">{hubLit ? (s.nome || 'Permissão') : s.on.has('expert') ? 'Renata' : 'a tese'}</text>
            <text className="sub" y="392">{hubLit ? 'tese fechada' : s.on.has('expert') ? 'tese em construção' : 'núcleo · vazio'}</text>
          </g>
          {/* galáxias */}
          {FRAMES.map(f => { const g = galaxyState(f); const isOpen = open === f.id
            return (
              <g key={f.id} className={`galaxy ${g.cls}${isOpen ? ' open' : ''}${open && !isOpen ? ' far' : ''}`} transform={`translate(${f.cx},${f.cy})`} onPointerDown={e => e.stopPropagation()} onClick={() => { if (g.cls === 'off') return; if (isOpen) return; onSelect({ frame: f.id }); ref.current?.galaxy(f.id) }}>
                {!isOpen && <>
                  {f.items.map(it => <path key={'l' + it.id} className={'syn-link' + (s.on.has(it.id) ? ' on' : '')} d={`M0,0 Q${it.sx * .55},${it.sy * .55} ${it.sx},${it.sy}`} />)}
                  <circle className="halo" r="420" fill="url(#halo)" /><circle className="ring" r="168" /><circle className={'core' + (g.n > 0 ? ' lit' : '')} r="118" fill={g.cls === 'off' ? 'none' : 'url(#orb)'} />
                  {f.items.map(it => <circle key={'d' + it.id} className={'syn ' + st(it.id)} cx={it.sx} cy={it.sy} r={s.on.has(it.id) ? 22 : 14} />)}
                  <text className="name" y={f.angle > 15 && f.angle < 165 ? -215 : 262}>{f.title}</text>
                  <text className="sub" y={f.angle > 15 && f.angle < 165 ? -275 : 322}>{g.cls === 'off' ? 'vazio' : `${g.n} de ${g.total}`}</text>
                  {g.cls !== 'off' && <path className="progress" d={ring(168, g.n / g.total)} />}
                </>}
                {isOpen && <><rect className="field" x={-f.w / 2 - 40} y={-f.h / 2 - 90} width={f.w + 80} height={f.h + 130} rx="40" /><text className="name" y={-f.h / 2 - 40}>{f.title}</text><text className="sub back" y={-f.h / 2 - 12} onClick={e => { e.stopPropagation(); ref.current?.universe() }}>← voltar ao universo · {g.n} de {g.total}</text></>}
              </g>)
          })}
        </svg>
        {/* cards da galáxia aberta (HTML, em cima do SVG) */}
        {openF && openF.items.map(it => { const state = st(it.id), sel = selected?.item === it.id
          return (
            <div key={it.id} className={`card ${state}${sel ? ' sel' : ''}`} style={{ left: openF.x + it.x, top: openF.y + it.y, width: it.w, height: it.h }}
              onPointerDown={e => { if (state === 'off') return; e.stopPropagation() }}
              onClick={e => { e.stopPropagation(); if (state === 'off') return; onSelect({ item: it.id }) }}
              onDoubleClick={e => { e.stopPropagation(); if (state !== 'off') ref.current?.item(it.id) }}>
              <div className="card-head"><span className="card-title">{it.title}</span>{state === 'flag' ? <span className="status warn">linter</span> : state === 'pend' ? <span className="status pend">em conversa</span> : null}</div>
              <div className="card-body">{state === 'off' ? <span>vazio</span> : <CardBody item={ITEMS[it.id]} s={s} flagged={state === 'flag'} />}</div>
            </div>)
        })}
      </div>
      <div className="hint">{open ? <><kbd>Esc</kbd> volta ao universo · duplo clique foca o card</> : <>clique numa galáxia pra entrar · arraste pra mover · <kbd>⌘</kbd>+roda dá zoom · <kbd>0</kbd> mostra tudo</>}</div>
      <div className="maptools">
        <span className="zoom">{Math.round(t.k * 100)}%</span>
        <button className="btn round" onClick={() => ref.current?.zoomBy(0.8)} aria-label="Afastar">−</button>
        <button className="btn round" onClick={() => ref.current?.zoomBy(1.25)} aria-label="Aproximar">+</button>
        <button className="btn" onClick={() => ref.current?.universe()}>Universo</button>
      </div>
    </div>
  )
})

function ring(r, frac) { if (frac >= 1) return `M0,${-r} A${r},${r} 0 1 1 -0.01,${-r}`; const a = frac * 2 * Math.PI - Math.PI / 2, x = r * Math.cos(a), y = r * Math.sin(a); return `M0,${-r} A${r},${r} 0 ${frac > .5 ? 1 : 0} 1 ${x},${y}` }

function Spark({ d }) {
  const ref = useRef(null)
  useEffect(() => { const g = ref.current, dots = [...g.children], path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); path.setAttribute('d', d); const len = path.getTotalLength(), t0 = performance.now(); let raf
    const ease = x => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2
    const f = now => { const k = Math.min(1, (now - t0) / 1000); dots.forEach((el, i) => { const kk = Math.max(0, ease(k) - i * .035); const p = path.getPointAtLength(len * kk); el.setAttribute('cx', p.x); el.setAttribute('cy', p.y) }); if (k < 1) raf = requestAnimationFrame(f) }
    raf = requestAnimationFrame(f); return () => cancelAnimationFrame(raf) }, [d])
  return <g ref={ref} className="spark">{[0, 1, 2, 3, 4, 5].map(i => <circle key={i} r={11 - i * 1.6} style={{ opacity: 1 - i * .16 }} />)}</g>
}
