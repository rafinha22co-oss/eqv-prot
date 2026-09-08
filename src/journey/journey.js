// A jornada roteirizada. Cada passo recebe o que a pessoa disse e um conjunto de
// ações (falar, mostrar escolhas, desbloquear cards no canvas, focar, mudar fase).
// Respostas são roteiro; a mecânica (gates, "é isso?", escolha do nome, matriz,
// linter, monitor) é a que o produto real vai ter.

import * as D from '../data/renata.js'
import { GROUPS } from '../canvas/model.js'

export const PHASES = ['Tese', 'Estratégia', 'Peças', 'Canvas', 'Campanha']

export const NOTES = {
  1: ['Fase 1 · Tese', 'O cérebro ouve a história e desce camadas até a conta fechar. Nada é gerado antes disso.'],
  2: ['Fase 2 · Estratégia', 'A matriz de formato é regra, não opinião: ela mostra a linha que bateu.'],
  3: ['Fase 3 · Peças', 'Cada peça nasce do método e só entra no canvas depois do linter.'],
  4: ['Fase 4 · Canvas', 'A rede está completa. Clique num ramo pra entrar na etapa e ver peça por peça.'],
  5: ['Fase 5 · Campanha', 'Métricas comparadas com as réguas do método. Só se sugere o passo de correção correspondente.'],
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

export const STEPS = [
  // 0 · abertura
  async (_, a) => {
    await a.ai('Oi. Antes de qualquer estratégia, eu preciso te conhecer. Me conta a sua história: o que você faz, pra quem, e o que você acredita sobre o problema que você resolve.')
    a.listen(true)
    a.choices([['Contar a história (exemplo)', 'Sou psicóloga clínica há 12 anos. Atendo adultos que passaram a vida dizendo sim pra todo mundo. Minha agenda é cheia por indicação, mas o perfil não traz paciente novo e eu travo na hora de reajustar meu valor. Pra mim, o sofrimento delas é o que sobra depois de anos dizendo sim.', true]])
  },
  // 1 · classifica e começa a descer
  async (_, a) => {
    a.listen(false); a.unlock('expert'); a.focus('expert'); a.pend('conta')
    await a.ai('Tem uma coisa na sua fala que me chamou atenção. Você não repetiu a descrição que o mercado usa. Você <b>redefiniu</b> o problema como fato: "é o que sobra depois de anos dizendo sim". Isso é crença formada. Então eu não preciso te levar do zero, só descer algumas camadas com você.')
    a.sys('Classificado: <b>Tipo B</b> (crença formada). Descendo até a conta fechar.')
    a.decide('Toda campanha começa com uma história.', D.expert.crenca, 'dito pela expert · classificada Tipo B')
    await a.ai(D.camadas[0][0]); a.choices([['Responder (exemplo)', D.camadas[0][1], true]])
  },
  async (_, a) => { a.conta(1); await a.ai(D.camadas[1][0]); a.choices([['Responder (exemplo)', D.camadas[1][1], true]]) },
  async (_, a) => { a.conta(2); await a.ai(D.camadas[2][0]); a.choices([['Responder (exemplo)', D.camadas[2][1], true]]) },
  // 4 · conta fechou → "é isso?"
  async (_, a) => {
    a.conta(3); a.unlock('conta'); a.focus('conta')
    a.sys('A conta fechou: <b>3 de 3</b>. Por que acontece · por que não resolve sozinha · como se resolve.')
    a.decide('A conta fechou.', 'Por que acontece · por que não resolve sozinha · como se resolve.', 'três camadas da entrevista')
    await a.ai('Deixa eu devolver a explicação inteira, do jeito que eu entendi. ' + D.proposta)
    a.choices([['Sim, é isso', 'Sim, é exatamente isso.', true], ['Mais ou menos', 'Mais ou menos.']])
  },
  // 5 · confirmação (com o desvio do "mais ou menos")
  async (said, a, s) => {
    if (/mais ou menos/i.test(said)) {
      await a.ai('Então me explica com as suas palavras. O que você mantiver está certo; o que você trocar é a peça que eu errei.')
      a.choices([['Explicar (exemplo)', 'É isso, só que não é "impor limites" que falha, é que ela nem chega a tentar. Ela pede desculpa antes de ter vontade.', true]])
      s.retry = true; return 'stay'
    }
    if (s.retry) { await a.ai('Entendi o que mudou: o ponto não é a tentativa que falha, é que a vontade nem nasce sem autorização. Isso deixa a explicação mais forte, não mais fraca.'); s.retry = false }
    a.pend('candidatos'); a.unlock('candidatos'); a.focus('candidatos')
    await a.ai('Fechou. Agora eu posso dar nome. Gerei cinco candidatos e passei cada um pelos três filtros, nessa ordem: sonoridade, curiosidade, o seu vocabulário. Está no inspetor, à direita. Eu tenho um preferido, mas quem escolhe é você.')
    a.status('Aguardando você · escolha o nome')
    a.choices([['Falta de Permissão', 'Falta de Permissão.', true], ['Síndrome do Sim', 'Síndrome do Sim.'], ['Nenhum desses', 'Nenhum desses.']])
  },
  // 6 · nome escolhido → solução e produto
  async (said, a, s) => {
    if (/nenhum/i.test(said)) {
      await a.ai('Sem problema, eu não disputo nome. Três perguntas: como você explicaria esse problema? Que nome você daria? E por quê?')
      a.choices([['Voltar aos candidatos', 'Deixa eu olhar os candidatos de novo.']]); return 'stay'
    }
    s.nome = /síndrome/i.test(said) ? 'Síndrome do Sim' : 'Falta de Permissão'
    a.decide('O problema ganhou nome.', `<b>${s.nome}</b>`, 'escolha da expert entre 5 candidatos · filtros de som, curiosidade e vocabulário')
    a.pend('pilha'); a.focus('pilha')
    if (s.nome === 'Síndrome do Sim') await a.ai('Anotado: <b>Síndrome do Sim</b>. Passa nos três filtros. Só te aviso do risco: ele se explica sozinho, então um concorrente pega e usa amanhã. "Falta de Permissão" fica guardado.')
    else await a.ai('<b>Falta de Permissão</b>. É o que eu escolheria também: passa nos três filtros e exige a explicação pra fazer sentido, então carrega você junto. Quem copiar o nome sem a teoria fica com a casca.')
    await a.ai('A solução é o espelho do problema: <b>Permissão Restaurada</b>, o estado que a pessoa passa a ter. E você já tem um protocolo de 6 sessões sem nome. Eu não jogo ele fora: ele é a raiz da solução. <b>Protocolo de Permissão</b>. Confere?')
    a.choices([['Confere', 'Confere.', true], ['Quero ajustar o nome do produto', 'Quero ajustar o nome do produto.']])
  },
  // 7 · tese fechada → fase 2
  async (_, a) => {
    a.unlock('pilha'); a.unlock('mecanismo'); a.unlock('traducoes'); a.focus('diag'); a.phase(2)
    a.decide('A pilha fechou.', 'Falta de Permissão → aceitação condicionada a agradar → Permissão Restaurada → Protocolo de Permissão.', 'mecanismo: Permissão · 6 sessões traduzidas')
    a.sys('<b>Tese fechada.</b> Mecanismo: Permissão. As 6 sessões foram traduzidas pra dentro da teoria.')
    await a.ai('Agora o lançamento. Três perguntas rápidas. Quanto custa o programa que você quer vender, e como você prefere vender: por conversa ou por checkout direto?')
    a.choices([['R$ 4.900, por conversa', 'É um programa de 8 semanas, R$ 4.900. Prefiro vender conversando.', true], ['R$ 997, checkout', 'R$ 997 no checkout.']])
  },
  async (said, a, s) => { s.alto = /4\.?900|convers/i.test(said); a.pend('formato'); await a.ai('E a operação: você sozinha ou com time? E é a primeira vez lançando?'); a.choices([['Sozinha, primeira vez', 'Sozinha, e é a primeira vez.', true]]) },
  // 9 · matriz
  async (_, a, s) => {
    a.unlock('formato'); a.focus('formato')
    await a.ai(`Formato: <b>${s.alto ? 'Live única com aplicação' : 'Série de 3 CPLs com checkout'}</b>. Não é gosto meu, é a matriz: ${s.alto ? 'ticket alto vendido por conversa, operação enxuta, primeira vez. Um evento, uma régua, e o CTA é de aplicação, não de compra. O botão só nasce no pitch.' : 'ticket médio com checkout e uma crença que precisa mudar em camadas.'} Você pode forçar outro formato; eu registro que foi escolha sua.`)
    a.decide('Formato do lançamento.', `<b>${s.alto ? 'Live única com aplicação' : 'Série de 3 CPLs com checkout'}</b>`, 'matriz de formato · ticket, operação e histórico')
    a.choices([['Manter o formato', 'Mantém.', true], ['Forçar CPLs', 'Quero fazer CPLs mesmo assim.']])
  },
  // 10 · oferta, segmento, calendário → fase 3
  async (said, a) => {
    if (/cpl/i.test(said)) { a.sys('Registrado: formato <b>forçado</b> pelo expert.'); a.decide('Formato forçado.', 'Série de 3 CPLs, contra a matriz.', 'escolha da expert · registrado') }
    a.unlock('oferta'); a.unlock('segmento'); a.unlock('calendario'); a.focus('estrat')
    await a.ai('Montei a oferta e o calendário: aquecimento a partir do D-15, live no D0, aplicação com janela de 24h, replay com a mesma escassez. Segmento travado como <b>psicóloga</b>: vocabulário "paciente, consultório, abordagem" e uma lista de banidos que o linter confere em toda peça.')
    a.phase(3)
    await a.ai('Vou gerar as peças: leva de 10 anúncios (2 por nível de consciência), a página nas 11 seções, o roteiro da live em 10 blocos e as réguas de WhatsApp. Você vai ver os ramos da rede acendendo.')
    a.choices([['Gerar as peças', 'Pode gerar.', true]])
  },
  // 11 · gera as peças (com linter)
  async (_, a) => {
    a.busy(true)
    a.status('Gerando · ângulo × estrutura × formato'); a.focus('anuncios')
    for (const id of GROUPS.anuncios) { a.unlock(id); await sleep(140) }
    a.status('Gerando · beto → emotion → voice → landing → review CUB'); a.focus('pagina')
    for (const id of GROUPS.pagina) { a.unlock(id); await sleep(110) }
    a.status('Gerando · roteiro em 10 blocos'); a.focus('roteiro')
    for (const id of GROUPS.roteiro) { a.unlock(id); await sleep(110) }
    a.status('Gerando · régua A + régua B'); a.focus('reguas')
    for (const id of GROUPS.reguas) { a.unlock(id); await sleep(80) }
    a.status('Linter · regras da casa + compliance + segmento'); await sleep(700)
    a.flag('blk-8'); a.focus('blk-8'); a.busy(false)
    a.sys('Linter: <b>5 ocorrências</b>, 4 corrigidas sozinho, 1 pede a sua confirmação.')
    a.decide('Peças geradas e passadas no linter.', '10 anúncios · 12 seções · 10 blocos · 14 mensagens. 5 ocorrências, 4 corrigidas.', 'regras da casa + compliance + banidos do segmento')
    await a.ai('Peças prontas. O linter pegou uma palavra banida no segmento no bloco 8 do roteiro ("ansiedade") e propôs "sofrimento emocional". Como é roteiro seu, eu não troco sem você ver.')
    a.choices([['Aceitar a troca', 'Aceito a troca.', true], ['Editar eu mesma', 'Vou editar eu mesma.']])
  },
  // 12 · canvas completo
  async (_, a) => {
    a.decide('Termo banido trocado.', '“ansiedade” → “sofrimento emocional” no bloco 8 do roteiro.', 'confirmado pela expert · compliance Meta + segmento')
    a.unflag('blk-8'); GROUPS.exec.forEach(a.unlock); GROUPS.rastro.forEach(a.unlock); a.phase(4); a.fit()
    await a.ai('Canvas publicado. Tudo que a gente decidiu e gerou está aí: a pilha, a estratégia, os 10 anúncios, a página seção por seção, o roteiro, as réguas, o checklist e o rastreamento. Cada ramo da rede é uma etapa: clique pra entrar e ver o que foi gerado nela.')
    await a.ai('Quer ver o que acontece quando a campanha roda? Eu simulo o 3º dia da leva com ~100 cliques por anúncio, que é o mínimo antes de concluir qualquer coisa.')
    a.status('Pronto · navegue no canvas ou simule')
    a.choices([['Simular o 3º dia', 'Simula o 3º dia.', true]])
  },
  // 13 · campanha
  async (_, a) => {
    a.phase(5); a.busy(true); a.status('Lendo · Meta, página, Vturb, presença'); a.pend('metricas'); a.focus('rastro'); await sleep(1100)
    a.unlock('metricas'); a.unlock('porAnuncio'); await sleep(500); a.unlock('correcoes'); a.focus('correcoes'); a.busy(false)
    await a.ai('Campanha lendo bem: hook 41%, CTR 3,4%, CPL R$ 9,80. Tudo dentro da régua, então a <b>única alavanca que eu sugiro é verba</b>: +30% no conjunto. Não mexo em criativo, link nem público.')
    await a.ai('Um anúncio ficou fora: o <b>R01-A4</b>, hook de 22%. É gancho ou formato, não é o ângulo. A regra é matar sem apego, e o substituto vai pra campanha separada, nunca dentro desta.')
    a.choices([['Aprovar verba +30% e matar o A4', 'Aprovo: +30% e mata o A4.', true], ['Só a verba', 'Só a verba por enquanto.']])
  },
  // 14 · pós-live
  async (said, a) => {
    a.sys(/só a verba/i.test(said) ? 'Registrado: verba +30%. A4 segue rodando, marcado pra revisão em 24h.' : 'Registrado: verba +30% · A4 pausado.')
    a.decide('Campanha performando.', /só a verba/i.test(said) ? 'Verba +30%. A4 mantido para revisão.' : 'Verba +30% · R01-A4 pausado (hook 22%).', 'régua do método · única alavanca permitida é verba')
    a.unlock('cortes'); a.focus('cortes')
    await a.ai('Da gravação da live eu tirei <b>3 cortes</b> com a Trava da Virada: cada um carrega um reframe que a pessoa não teria sozinha. Um trecho foi rejeitado porque só dizia "se posicione". Saem sem card de venda, com UTM por corte.')
    a.unlock('r02'); a.focus('r02')
    await a.ai('E o briefing da <b>leva R02</b> já nasceu das métricas desta: o A3 (mecanismo único em micro-aula) vira matriz, 3 estruturas × 2 formatos, em campanha separada. As métricas do lote atual são o briefing do próximo.')
    a.status('Ciclo fechado · navegue no canvas')
    a.choices([['Ver a rede', '__fit__', true]])
  },
]
