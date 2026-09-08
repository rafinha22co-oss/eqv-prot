// A cena. Portada do renderer orgânico do nold-prot v3 (js/v3.js):
//
//   · canvas por baixo desenha o que é vivo: brilho do núcleo, as ligações em
//     curva, os filamentos que crescem em volta de cada ligação, as partículas
//     que correm por ela e as membranas do núcleo;
//   · os nós são HTML posicionados pelo renderer (left/top/opacity), então
//     seguem acessíveis, focáveis e podem ter conteúdo de verdade.
//
// A transição é a mesma do v3: cada nó guarda de-onde/para-onde, ganha um
// atraso próprio (hash do id) e percorre um caminho levemente curvo, o que dá
// a impressão de ramo que acompanha o movimento em vez de tudo deslizar junto.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { targetsFor, center, mix, smooth, phaseOf } from './scene.js'
import { ITEMS, FRAME_BY_ID } from './model.js'
import { Preview } from './Cards.jsx'

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches
const DUR = 1450

export function Scene({ s, selected, open, onOpen, onSelect, sparks, boot }) {
  const stage = useRef(null), cvRef = useRef(null), layerRef = useRef(null)
  const sc = useRef(new Map())          // id -> { from, to, now, delay, phase, type, parent, data, el }
  const size = useRef({ w: 0, h: 0 })
  const t0 = useRef(0)
  const live = useRef({ s, open, selected, sparks, boot })
  live.current = { s, open, selected, sparks, boot }
  const booted = useRef(false)
  const [nodes, setNodes] = useState([])
  const [, bump] = useState(0)

  /* ---------- diff: calcula alvos e prepara a transição ---------- */
  const relayout = useCallback(() => {
    const { w, h } = size.current; if (!w) return
    const { s, open, boot } = live.current, c = center(w, h)
    if (!boot) return                      // a rede só nasce quando a marca sai
    const first = !booted.current; booted.current = true
    const targets = targetsFor(open, s, w, h)
    const ids = new Set(targets.map(t => t.id))
    sc.current.forEach((n, id) => {
      if (ids.has(id) || n.exiting) return
      n.from = { ...n.now }
      n.to = { x: n.now.x + (n.now.x - c.x) * .16, y: n.now.y + (n.now.y - c.y) * .16, opacity: 0 }
      n.delay = 0; n.exiting = true
    })
    targets.forEach(t => {
      let n = sc.current.get(t.id)
      if (!n) {
        const p = sc.current.get(t.parent)?.now || { x: c.x, y: c.y }
        const seed = first ? { x: c.x, y: c.y } : { x: mix(p.x, t.x, .45), y: mix(p.y, t.y, .45) }
        n = { now: { ...seed, opacity: 0 }, phase: phaseOf(t.id) }
        sc.current.set(t.id, n)
      }
      n.from = { ...n.now }
      n.delay = first
        ? (t.type === 'core' ? 0 : 320 + (t.ord ?? 0) * 90)
        : t.type === 'core' || t.type === 'nucleus' ? 0 : t.type === 'card' ? 130 : t.type === 'syn' ? 30 + n.phase % 90 : 40 + n.phase % 120
      n.to = { x: t.x, y: t.y, opacity: 1 }
      n.parent = t.parent; n.type = t.type; n.data = t; n.exiting = false
    })
    t0.current = performance.now()
    setNodes([...sc.current.values()].map(n => n.data))
  }, [])

  useLayoutEffect(() => { relayout() }, [s, open, boot, relayout])

  useEffect(() => {
    const el = stage.current
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect(); size.current = { w: r.width, h: r.height }
      const cv = cvRef.current, d = Math.min(devicePixelRatio || 1, 2)
      cv.width = r.width * d; cv.height = r.height * d; cv.getContext('2d').setTransform(d, 0, 0, d, 0, 0)
      relayout()
    })
    ro.observe(el); return () => ro.disconnect()
  }, [relayout])

  /* ---------- render por quadro ---------- */
  useEffect(() => {
    const cv = cvRef.current, ctx = cv.getContext('2d')
    let raf = 0, last = 0, pruneAt = 0

    const draw = t => {
      const { w, h } = size.current; if (!w) return
      const { s, open } = live.current, c = center(w, h)
      ctx.clearRect(0, 0, w, h)

      // posição de cada nó
      let dead = false
      sc.current.forEach((n, id) => {
        const u = Math.min(1, Math.max(0, (t - t0.current - (n.delay || 0)) / DUR)), e = smooth(u)
        const dx = n.to.x - n.from.x, dy = n.to.y - n.from.y
        const bend = Math.sin(Math.PI * e) * .16 * ((n.phase || 0) % 2 ? 1 : -1)
        n.now = { x: mix(n.from.x, n.to.x, e) - dy * bend, y: mix(n.from.y, n.to.y, e) + dx * bend, opacity: mix(n.from.opacity, n.to.opacity, smooth(Math.min(1, u * 1.5))) }
        if (n.el) { n.el.style.left = n.now.x + 'px'; n.el.style.top = n.now.y + 'px'; n.el.style.opacity = n.now.opacity }
        if (u === 1 && n.to.opacity === 0) { sc.current.delete(id); dead = true }
      })

      // brilho do centro
      const lit = s.on.has('pilha')
      const g = ctx.createRadialGradient(c.x, c.y, 15, c.x, c.y, w * .55)
      g.addColorStop(0, lit ? 'rgba(196,154,60,.13)' : 'rgba(196,154,60,.05)'); g.addColorStop(1, 'rgba(9,9,12,0)')
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h)

      // ligações: curva + filamentos + partículas correndo
      sc.current.forEach(n => {
        const p = n.parent === 'core' ? sc.current.get('core') : sc.current.get(n.parent)
        const a = p ? p.now : (n.parent ? c : null); if (!a) return
        const b = n.now, alpha = Math.min(p ? p.now.opacity : 1, b.opacity); if (alpha < .02) return
        const on = n.data?.cls === 'on' || n.data?.cls === 'flag' || (n.type === 'branch' && n.data?.n > 0) || n.type === 'card' || n.type === 'nucleus'
        const dx = b.x - a.x, dy = b.y - a.y
        const breath = REDUCED ? 0 : Math.sin(t * .00065 + (n.phase || 0)) * .045
        const cx = a.x + dx * .6 - dy * (.12 + breath), cy = a.y + dy * .4 + dx * (.12 + breath)
        ctx.globalAlpha = alpha
        ctx.strokeStyle = on ? 'rgba(196,154,60,.34)' : 'rgba(214,214,206,.10)'
        ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.quadraticCurveTo(cx, cy, b.x, b.y); ctx.stroke()
        // filamentos: crescem em volta da ligação e dão profundidade de ramo
        const len = Math.hypot(dx, dy) || 1, spreadK = (n.type === 'syn' ? 16 : open ? 46 : 40) * (on ? 1 : .55)
        const F = n.type === 'syn' ? 12 : 30
        for (let k = 0; k < F; k++) {
          const u = k / F, v = 1 - u
          const x = v * v * a.x + 2 * v * u * cx + u * u * b.x, y = v * v * a.y + 2 * v * u * cy + u * u * b.y
          const spread = (Math.sin(k * 7.31 + t * .00042 + (n.phase || 0)) * .8 + Math.sin(k * .6 - t * .0008) * .2) * Math.sin(u * Math.PI) * spreadK
          const ex = x - dy / len * spread, ey = y + dx / len * spread
          ctx.strokeStyle = `rgba(${on ? '214,180,104' : '190,190,182'},${(on ? .075 : .04) + .035 * Math.sin(t * .0009 - k * .32)})`
          ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(ex - dx * .07, ey - dy * .07, ex, ey); ctx.stroke()
          ctx.fillStyle = `rgba(240,225,180,${(on ? .2 : .1) + .16 * (.5 + .5 * Math.sin(t * .001 - k * .5))})`
          ctx.fillRect(ex, ey, 1.4, 1.4)
        }
        if (on) for (let k = 0; k < 2; k++) {
          const u = (t * .000075 + k * .5 + (n.phase || 0) * .017) % 1, v = 1 - u
          ctx.fillStyle = '#f6e2a3'; ctx.shadowColor = '#f6e2a3'; ctx.shadowBlur = 5
          ctx.beginPath(); ctx.arc(v * v * a.x + 2 * v * u * cx + u * u * b.x, v * v * a.y + 2 * v * u * cy + u * u * b.y, 1.2, 0, 7); ctx.fill()
        }
        ctx.shadowBlur = 0; ctx.globalAlpha = 1
      })

      // faíscas do cérebro ligando um ramo (disparadas pela conversa)
      for (const sp of live.current.sparks) {
        const a = sc.current.get('core')?.now || c, b = sc.current.get(sp.to)?.now; if (!b) continue
        const k = Math.min(1, (t - sp.t) / 1000), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2
        const dx = b.x - a.x, dy = b.y - a.y, cx = a.x + dx * .6 - dy * .12, cy = a.y + dy * .4 + dx * .12
        for (let i = 0; i < 6; i++) {
          const u = Math.max(0, e - i * .035), v = 1 - u
          ctx.fillStyle = `rgba(246,226,163,${(1 - i * .16) * (1 - k * .3)})`; ctx.shadowColor = '#f6e2a3'; ctx.shadowBlur = 12
          ctx.beginPath(); ctx.arc(v * v * a.x + 2 * v * u * cx + u * u * b.x, v * v * a.y + 2 * v * u * cy + u * u * b.y, 3.4 - i * .45, 0, 7); ctx.fill()
        }
        ctx.shadowBlur = 0
      }

      // núcleo: membranas em contrarrotação + poeira de partículas
      const focus = open ? sc.current.get(open) : sc.current.get('core')
      const orb = focus ? focus.now : c, r = open ? 74 : (w < 760 ? 74 : 96)
      ctx.save(); ctx.shadowBlur = 0
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath(); const dir = layer % 2 ? -1 : 1
        for (let j = 0; j <= 160; j++) {
          const ang = j / 160 * Math.PI * 2
          const ripple = Math.sin(ang * 3 + t * .00065 * dir + layer) * 5 + Math.sin(ang * 7 - t * .0004 + layer) * 2
          const rad = r * (1.1 + layer * .12) + ripple
          const x = orb.x + Math.cos(ang) * rad, y = orb.y + Math.sin(ang) * rad * .9
          j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.closePath(); ctx.lineWidth = .65
        ctx.strokeStyle = `rgba(${lit || open ? '223,196,133' : '186,186,178'},${.15 - layer * .03})`; ctx.stroke()
      }
      ctx.restore()
      const N = REDUCED ? 0 : 640
      for (let i = 0; i < N; i++) {
        const ang = i * 2.39996 + t * (i % 2 ? .000055 : -.000035)
        const rr = r * (.83 + .14 * Math.sin(i * 43.12) + .045 * Math.sin(t * .001 + i * .05))
        ctx.fillStyle = `rgba(${lit || open ? '240,214,152' : '176,176,170'},${.1 + (Math.sin(i * 15.1) + 1) * (lit || open ? .2 : .1)})`
        ctx.fillRect(orb.x + Math.cos(ang) * rr, orb.y + Math.sin(ang) * rr * .9, 1, 1)
      }

      if (dead && t - pruneAt > 300) { pruneAt = t; setNodes([...sc.current.values()].map(n => n.data)) }
    }

    const loop = t => { if (!document.hidden && t - last > 15) { draw(t); last = t } raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop); return () => cancelAnimationFrame(raf)
  }, [])

  /* ---------- nós (HTML) ---------- */
  const bindEl = (id, el) => { const n = sc.current.get(id); if (n) n.el = el }
  const openBranch = id => { onSelect({ frame: id }); onOpen(id) }
  const openF = open ? FRAME_BY_ID[open] : null

  return (
    <div className="stage scene" ref={stage}>
      <canvas ref={cvRef} className="bg" aria-hidden="true" />
      <div className="nodes" ref={layerRef}>
        {nodes.map(t => {
          if (!t) return null
          const k = t.id
          if (t.type === 'core') return (
            <button key={k} ref={e => bindEl(k, e)} className={'node core' + (s.on.has('pilha') ? ' lit' : '')} onClick={() => onSelect({ item: 'pilha' })}>
              <b>{s.on.has('pilha') ? (s.nome || 'Falta de Permissão') : s.on.has('expert') ? 'Renata' : 'a tese'}</b>
              <small>{s.on.has('pilha') ? 'A TESE · FECHADA' : s.on.has('expert') ? 'EM CONSTRUÇÃO' : 'NÚCLEO · VAZIO'}</small>
            </button>
          )
          if (t.type === 'branch') return (
            <button key={k} ref={e => bindEl(k, e)} className={'node branch ' + t.cls + (selected?.frame === t.id ? ' sel' : '')} onClick={() => t.cls !== 'off' && openBranch(t.id)} disabled={t.cls === 'off'}>
              <span className="ttl">{FRAME_BY_ID[t.id].title}{t.cls !== 'off' && <i className="chev">›</i>}</span>
              <small>{t.cls === 'off' ? 'vazio' : t.n === t.total ? `${t.total} peças · pronta` : `${t.n} de ${t.total}`}</small>
              {t.cls !== 'off' && <span className="meter"><i style={{ width: (t.n / t.total * 100) + '%' }} /></span>}
            </button>
          )
          if (t.type === 'syn') return <span key={k} ref={e => bindEl(k, e)} className={'node syn ' + t.cls} aria-hidden="true" />
          if (t.type === 'nucleus') return (
            <div key={k} ref={e => bindEl(k, e)} className="node nucleus">
              <b>{FRAME_BY_ID[t.id].title}</b><small>{t.n} DE {t.total} GERADAS</small>
            </div>
          )
          if (t.type === 'return') return (
            <button key={k} ref={e => bindEl(k, e)} className="node back" onClick={() => { onOpen(null); onSelect(null) }}>← rede<small>visão geral</small></button>
          )
          const it = ITEMS[t.item]
          return (
            <button key={k} ref={e => bindEl(k, e)} className={'node card ' + t.cls + (selected?.item === t.id ? ' sel' : '')} style={{ width: t.w, minHeight: t.h }}
              onClick={() => t.cls !== 'off' && onSelect({ item: t.id })} disabled={t.cls === 'off'}>
              <small>{it.title}{t.cls === 'flag' && <i className="flagdot" />}</small>
              {t.cls === 'off' ? <span className="ph">vazio</span> : <Preview item={it} s={s} />}
            </button>
          )
        })}
      </div>
      <div className="scene-caption">
        <span className="tiny-line" />{open ? `${openF.title.toUpperCase()} · O QUE FOI GERADO` : 'REDE DA CAMPANHA'}
        <span>{open ? 'Clique numa peça para abrir o detalhe. Esc volta.' : 'Cada ramo é uma etapa. Clique para entrar.'}</span>
      </div>
      <div className="scene-legend"><span><i className="on" /> gerado</span><span><i className="pend" /> em conversa</span><span><i /> vazio</span></div>
    </div>
  )
}
