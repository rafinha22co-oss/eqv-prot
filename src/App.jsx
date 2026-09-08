import { useCallback, useEffect, useRef, useState } from 'react'
import { Scene } from './canvas/Scene.jsx'
import { ITEMS } from './canvas/model.js'
import { Splash } from './components/Brand.jsx'
import { Topbar, Chat, Layers, Inspector } from './components/Panels.jsx'
import { STEPS } from './journey/journey.js'

const sleep = ms => new Promise(r => setTimeout(r, ms))
const FRAMES_IDS = ['diag', 'estrat', 'exec', 'rastro', 'anuncios', 'pagina', 'roteiro', 'reguas', 'pos']

export default function App() {
  const [s, setS] = useState({ on: new Set(), pending: new Set(), flagged: new Set(), phase: 1, conta: 0, nome: null })
  const [messages, setMessages] = useState([])
  const [choices, setChoices] = useState([])
  const [status, setStatus] = useState('<b>Pronto</b> · toque no microfone ou escreva')
  const [listening, setListening] = useState(false)
  const [busy, setBusy] = useState(false)
  const [selected, setSelected] = useState(null)
  const [tab, setTab] = useState('chat')
  const [collapsed, setCollapsed] = useState(false)
  const [auto, setAuto] = useState(false)
  const [open, setOpen] = useState(null)
  const [sparks, setSparks] = useState([])
  const [splash, setSplash] = useState(true)
  const [entered, setEntered] = useState(false)
  const spark = to => { const id = Math.random(); setSparks(x => [...x, { id, to, t: performance.now() }]); setTimeout(() => setSparks(x => x.filter(z => z.id !== id)), 1100) }
  const step = useRef(0), scratch = useRef({}), choicesRef = useRef([]); choicesRef.current = choices

  const mut = fn => setS(prev => { const n = { ...prev, on: new Set(prev.on), pending: new Set(prev.pending), flagged: new Set(prev.flagged) }; fn(n); return n })

  // ações que os passos da jornada usam
  const actions = useRef({
    ai: async html => { setStatus('<b>Respondendo</b>'); const id = Math.random(); setMessages(m => [...m, { cls: 'ai', html: '', id }]); for (let i = 1; i <= html.length; i += 3) { const slice = html.slice(0, i); setMessages(m => m.map(x => x.id === id ? { ...x, html: slice + '<span style="opacity:.5">▍</span>' } : x)); await sleep(12) } setMessages(m => m.map(x => x.id === id ? { ...x, html } : x)) },
    sys: html => setMessages(m => [...m, { cls: 'sys', html }]),
    choices: list => setChoices(list),
    status: t => setStatus(t.replace(/^([^·]+)/, '<b>$1</b>')),
    listen: v => setListening(v),
    busy: v => setBusy(v),
    unlock: id => { const g = ITEMS[id]?.frame; setS(prev => { if (g && ![...prev.on].some(x => ITEMS[x]?.frame === g)) spark(g); return prev }); mut(n => { n.pending.delete(id); n.on.add(id) }) },
    pend: id => mut(n => n.pending.add(id)),
    flag: id => mut(n => n.flagged.add(id)),
    unflag: id => mut(n => n.flagged.delete(id)),
    conta: k => mut(n => { n.conta = k }),
    phase: p => mut(n => { n.phase = p }),
    // A conversa NÃO entra na etapa: ela só aponta (inspetor + destaque no ramo).
    // Trocar de módulo a cada resposta desorienta; quem entra é a pessoa.
    focus: id => setSelected(FRAMES_IDS.includes(id) ? { frame: id } : { item: id }),
    fit: () => { setSelected(null); setOpen(null) },
  }).current

  const say = useCallback(async text => {
    if (busy) return
    if (text === '__fit__') { actions.fit(); return }
    setMessages(m => [...m, { cls: 'me', html: text }]); setChoices([])
    const fn = STEPS[step.current]
    if (!fn) { await actions.ai('O ciclo está completo. Navegue pelo canvas ou recomece.'); return }
    const r = await fn(text, actions, scratch.current)
    if (r !== 'stay') step.current++
    if (scratch.current.nome) mut(n => { n.nome = scratch.current.nome })
  }, [busy, actions])

  useEffect(() => { STEPS[0](null, actions, scratch.current) }, []) // eslint-disable-line

  const onChoice = c => say(c[1])
  const runAuto = async () => {
    if (auto) return; setAuto(true)
    while (step.current < STEPS.length) {
      let g = null, w = 0
      while (!(g = choicesRef.current.find(c => c[2])) && w < 20000) { await sleep(200); w += 200 }
      if (!g) break; await sleep(500); await say(g[1]); await sleep(600)
    }
    setAuto(false)
  }
  useEffect(() => { const k = e => { if (e.key === 'Escape' && e.target.tagName !== 'INPUT') { setSelected(null); setOpen(null) } }; addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, [])
  const theme = () => { const r = document.documentElement; const cur = r.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); r.dataset.theme = cur === 'dark' ? 'light' : 'dark' }

  return (
    <>
    {splash && <Splash onDone={() => { setSplash(false); setEntered(true) }} />}
    <div className={'app' + (collapsed ? ' chat-collapsed' : '') + (entered ? ' entered' : '')}>
      <Topbar phase={s.phase} open={open} onHome={() => { setOpen(null); setSelected(null) }} onAuto={runAuto} onReset={() => location.reload()} onTheme={theme} auto={auto} />
      <section className="side" aria-label="Conversa e camadas">
        <div className="tabs">
          <button className={tab === 'chat' ? 'on' : ''} onClick={() => setTab('chat')}>Conversa</button>
          <button className={tab === 'layers' ? 'on' : ''} onClick={() => setTab('layers')}>Camadas</button>
          <button className="collapse" onClick={() => setCollapsed(v => !v)} aria-label="Recolher">{collapsed ? '»' : '«'}</button>
        </div>
        {tab === 'chat'
          ? <Chat s={s} messages={messages} choices={choices} status={status} onSay={say} onChoice={onChoice} listening={listening} busy={busy} />
          : <Layers s={s} selected={selected} onSelect={setSelected} onOpen={setOpen} />}
      </section>
      <Scene s={s} selected={selected} open={open} onOpen={setOpen} onSelect={setSelected} sparks={sparks} boot={entered} />
      <Inspector s={s} selected={selected} choices={choices} onChoice={onChoice} />
    </div>
    </>
  )
}
