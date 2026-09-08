import { useEffect } from 'react'
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches

/* A marca.
   Símbolo: um asterisco fino de oito braços — o ponto que se abre em direções.
   A tese em forma de sinal: um centro, e o campo que nasce dele.
   Lockup: nome em caixa baixa com "que vende" em caps tracked embaixo.
   O nome ainda não fechou: troque as constantes e o resto acompanha. */
export const BRAND = 'Expertise que Vende'
export const BRAND_SHORT = 'expertise'
export const BRAND_TAIL = 'que vende'

// um "brilho" de 4 braços; o de 8 é este mais uma cópia girada e menor
const spark = (L, k = .055, m = .24) =>
  `M0,${-L} C${k * L},${-m * L} ${m * L},${-k * L} ${L},0 C${m * L},${k * L} ${k * L},${m * L} 0,${L}` +
  ` C${-k * L},${m * L} ${-m * L},${k * L} ${-L},0 C${-m * L},${-k * L} ${-k * L},${-m * L} 0,${-L}Z`

export function Mark({ size = 30 }) {
  return (
    <svg className="mark" width={size} height={size} viewBox="-12 -12 24 24" aria-hidden="true">
      <path d={spark(11)} />
      <path d={spark(6.6)} transform="rotate(45)" opacity=".72" />
    </svg>
  )
}

/** Lockup: nome em caixa baixa, "que vende" em caps tracked embaixo. */
export function Wordmark({ size = 30 }) {
  return (
    <span className="brandmark">
      <Mark size={size} />
      <span className="lockup">{BRAND_SHORT}<em>{BRAND_TAIL}</em></span>
    </span>
  )
}

export function Splash({ onDone }) {
  // sai sozinha; o fio embaixo do lockup é o próprio tempo correndo
  useEffect(() => {
    const t = setTimeout(onDone, REDUCED ? 900 : 5000)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div className="splash" onClick={onDone}>
      <div className="splash-field" aria-hidden="true"><i /><i /><i /></div>
      <div className="splash-in">
        <div className="splash-eyebrow">MÉTODO CHRYSTIAN BORGES</div>
        <div className="splash-logo"><Mark size={104} /><span className="lockup">{BRAND_SHORT}<em>{BRAND_TAIL}</em></span></div>
        <p>A tese que já existe dentro de você, materializada em campanha.</p>
        <span className="splash-line" />
      </div>
      <button className="splash-skip" onClick={onDone}>Entrar ↗</button>
    </div>
  )
}
