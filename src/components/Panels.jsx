import { useEffect, useRef, useState } from 'react'
import { FRAMES, ITEMS, FRAME_BY_ID } from '../canvas/model.js'
import { Wordmark } from './Brand.jsx'
import { CardBody } from '../canvas/Cards.jsx'
import { PHASES, NOTES } from '../journey/journey.js'

/* ---------- barra superior ---------- */
export function Topbar({ phase, open, onHome, onAuto, onReset, onTheme, auto }) {
  const etapa = open ? FRAME_BY_ID[open].title : null
  return (
    <header className="topbar">
      <button className="brand-btn" onClick={onHome} aria-label="Início"><Wordmark /></button>
      <span className="rule" />
      <nav className="crumbs" aria-label="Onde você está">
        <button onClick={onHome}>Seu estúdio</button>
        <span className="sep">/</span>
        {etapa
          ? <><button onClick={onHome}>Campanha de lançamento</button><span className="sep">/</span><span className="cur">{etapa}</span></>
          : <span className="cur">Campanha de lançamento</span>}
      </nav>
      <div className="right">
        <button className="icon-btn" onClick={onTheme} title="Tema" aria-label="Alternar tema"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" /></svg></button>
        <button className="icon-btn" onClick={onReset} title="Recomeçar" aria-label="Recomeçar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></svg></button>
        <button className="btn ghost sm" onClick={onAuto} disabled={auto}><i className="led" />{auto ? 'Reproduzindo' : 'Reproduzir jornada'}</button>
      </div>
      <span className="progress-rail" style={{ width: (phase / PHASES.length * 100) + '%' }} aria-hidden="true" />
    </header>
  )
}

/* ---------- conversa ---------- */
export function Chat({ s, messages, choices, status, onSay, onChoice, listening, busy }) {
  const tr = useRef(null), input = useRef(null)
  const [live, setLive] = useState(false)
  useEffect(() => { tr.current && (tr.current.scrollTop = 1e6) }, [messages, choices])
  const [title, text] = NOTES[s.phase]
  const submit = e => { e.preventDefault(); const v = input.current.value.trim(); if (!v || busy) return; input.current.value = ''; onSay(v) }
  const mic = () => {
    if (busy) return
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SR) {
      const rec = new SR(); rec.lang = 'pt-BR'; setLive(true)
      rec.onresult = e => onSay(e.results[0][0].transcript); rec.onend = () => setLive(false); rec.onerror = () => setLive(false); rec.start()
    } else { setLive(true); setTimeout(() => { setLive(false); const g = choices.find(c => c[2]); if (g) onChoice(g) }, 900) }
  }
  return (
    <>
      <div className="note"><b>{title}.</b> {text}</div>
      <div className="transcript" ref={tr}>
        {messages.map((m, i) => <div key={i} className={'msg ' + m.cls} dangerouslySetInnerHTML={{ __html: m.html }} />)}
      </div>
      <div className="dock">
        {choices.length > 0 && <div className="choices">{choices.map(c => <button key={c[0]} className={'pill' + (c[2] ? ' gold' : '')} onClick={() => onChoice(c)}>{c[0]}</button>)}</div>}
        <form className="bar" onSubmit={submit}>
          <input ref={input} placeholder="Fale ou escreva" aria-label="Sua mensagem" />
          <button type="submit" className="send">Enviar</button>
          <button type="button" className={'mic' + (live ? ' live' : '')} onClick={mic} aria-label="Falar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" stroke="none" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>
          </button>
        </form>
        <div className="state" dangerouslySetInnerHTML={{ __html: listening ? '<b>Ouvindo</b> · fale ou escreva' : status }} />
      </div>
    </>
  )
}

/* ---------- camadas ---------- */
export function Layers({ s, selected, onSelect, onOpen }) {
  const st = id => s.flagged.has(id) ? 'flag' : s.on.has(id) ? 'on' : s.pending.has(id) ? 'pend' : ''
  return (
    <div className="layers">
      {FRAMES.map(f => (
        <div key={f.id}>
          <div className="layer-frame" onClick={() => { onSelect({ frame: f.id }); onOpen(f.id) }}><span>▾</span>{f.title}</div>
          {f.items.map(it => (
            <div key={it.id} className={`layer-item ${st(it.id)} ${selected?.item === it.id ? 'sel' : ''}`} onClick={() => { if (!s.on.has(it.id) && !s.pending.has(it.id)) return; onSelect({ item: it.id }); onOpen(f.id) }}>
              <span className={'dot ' + st(it.id)} />{it.title}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

/* ---------- inspetor ---------- */
const META = {
  expert: ['Movimento 1', 'Ouvir a história. A crença aparece quando ela redefine o problema como fato.'],
  conta: ['Movimento 2', 'Duas perguntas em loop. Para quando responde as três.'],
  candidatos: ['Movimento 3', 'Sonoridade veta · curiosidade · vocabulário. Desempate: o menos copiável. Quem escolhe é o expert.'],
  pilha: ['Movimentos 4-5', 'A solução é o espelho do problema. O produto é a raiz da solução.'],
  mecanismo: ['Movimento 5-6', 'A teoria que amarra as quatro peças. Entrega: texto PCS + manifesto.'],
  traducoes: ['Movimento 6', 'Traduzir cada ferramenta antiga pra dentro da teoria nova, senão o expert volta pra fonte original.'],
  formato: ['Matriz de formato', 'Decisão determinística. O expert pode forçar; fica registrado.'],
  oferta: ['Oferta', 'Preço depois do valor. Garantia só a real. Urgência com razão real.'],
  segmento: ['Segmento', 'Vocabulário travado + banidos conferidos por busca automática (zero ocorrências).'],
  calendario: ['Calendário', 'Gerado do formato. Vira o checklist da execução.'],
  anuncio: ['Leva R01', 'Arco HOOK → micro-aula → DESEJO → CTA. Um anúncio quebra UMA objeção e usa UMA prova.'],
  'pagina-diag': ['Bloco Diagnóstico', 'Regra de 3 antes de escrever: emoção certa, voz certa, estrutura certa.'],
  secao: ['Página · seção', 'Copy do zero. Sintomas antes do nome; o nome entra só no Mecanismo. Review CUB antes de liberar.'],
  bloco: ['Roteiro · bloco', 'Os blocos 4-6 são escorregador. O botão nasce no pitch.'],
  msg: ['Régua', '11 regras: ≤12 palavras por frase, ≤3 parágrafos, uma pergunta por mensagem, sem travessão. Convida, não confirma.'],
  checklist: ['Execução', 'Gerado do calendário. Marcável.'],
  turmas: ['Turmas', 'Lista de transmissão, não grupo. Link de convite, teto 500, intervalo 3-8s.'],
  utm: ['Rastreamento', 'utm_content único por instância. Nunca reaproveitar.'],
  metricas: ['Réguas', 'Ler a campanha antes do anúncio. Métrica ruim aponta a peça errada.'],
  porAnuncio: ['Por anúncio', 'Mínimo 3 dias e ~100 cliques antes de concluir.'],
  correcoes: ['Monitor', 'Régua → diagnóstico → passo. Campanha performando: única alavanca é verba.'],
  cortes: ['Trava da Virada', 'Só vale se carrega um reframe. 40-70s, uma ideia por corte, sem card de venda.'],
  r02: ['Memória viva', 'As métricas do lote atual são o briefing do próximo.'],
}
export function Inspector({ s, selected, onChoice, choices }) {
  if (!selected) return <aside className="inspector"><div className="insp-head"><div className="eyebrow">Inspetor</div><h2 className="insp-title">Nada selecionado</h2><div className="insp-sub">Clique numa peça da rede ou numa camada.</div></div><div className="insp-body"><div className="empty">O detalhe de cada peça gerada aparece aqui: conteúdo completo, a regra do método que a gerou e o que você pode fazer com ela.</div></div></aside>
  if (selected.frame) {
    const f = FRAME_BY_ID[selected.frame]; const on = f.items.filter(i => s.on.has(i.id)).length
    return <aside className="inspector"><div className="insp-head"><div className="eyebrow">Etapa</div><h2 className="insp-title">{f.title}</h2><div className="insp-sub">{on} de {f.items.length} peças geradas</div></div><div className="insp-body"><div className="rows">{f.items.map(i => <div className="row" key={i.id}><span className={'dot ' + (s.on.has(i.id) ? 'on' : s.pending.has(i.id) ? 'pend' : '')} /><span className="t">{i.title}</span></div>)}</div></div></aside>
  }
  const it = ITEMS[selected.item]; const [eyebrow, rule] = META[it.kind] || META[it.id] || ['', '']
  const state = s.flagged.has(it.id) ? 'warn' : s.on.has(it.id) ? 'ok' : 'pend'
  const gate = choices.find(c => c[2]) // ação pendente da conversa, quando existe
  return (
    <aside className="inspector">
      <div className="insp-head">
        <div className="eyebrow">{eyebrow || FRAME_BY_ID[it.frame].title}</div>
        <h2 className="insp-title">{it.title}</h2>
        <div className="insp-sub"><span className={'status ' + state}>{state === 'ok' ? 'aprovado' : state === 'warn' ? 'linter · pede confirmação' : 'em conversa'}</span></div>
      </div>
      <div className="insp-body">
        <div className="card-body"><CardBody item={it} s={s} full flagged={s.flagged.has(it.id)} /></div>
        {rule && <div className="sec"><h4>Regra do método</h4><div className="why">{rule}</div></div>}
        {(state !== 'ok' && gate) && <div className="sec"><h4>Ação</h4><div className="actions">{choices.map(c => <button key={c[0]} className={'btn' + (c[2] ? ' primary' : '')} onClick={() => onChoice(c)}>{c[0]}</button>)}</div></div>}
        {state === 'ok' && <div className="sec"><h4>Ações</h4><div className="actions"><button className="btn">Editar</button><button className="btn">Regenerar</button><button className="btn">Copiar</button></div></div>}
      </div>
    </aside>
  )
}
