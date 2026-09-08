// Expert de exemplo. Todo conteúdo abaixo é fictício, escrito com o método do Chrys
// (pilha → matriz → peças), pra alimentar o protótipo. Nada aqui vem de IA em tempo real.

export const expert = {
  nome: 'Renata',
  area: 'psicóloga clínica, 12 anos',
  tipo: 'B',
  historia:
    'Atende adultos que passaram a vida dizendo sim pra todo mundo. Agenda cheia por indicação; o perfil não traz paciente novo; trava na hora de reajustar o valor.',
  crenca: 'O sofrimento das minhas pacientes é o que sobra depois de anos dizendo sim pra todo mundo.',
  metodo: 'Protocolo próprio de 6 sessões, sem nome.',
  ativos: { seguidores: '3,2 mil', lista: 640, jaLancou: false, ticket: 'R$ 280/sessão' },
}

export const camadas = [
  ['Tá, mas por que esse problema acontece?', 'Porque ela aprendeu cedo que ser aceita dependia de agradar. Dizer não virou risco.'],
  ['E o que está por trás disso?', 'Ela nunca recebeu permissão pra ter vontade própria. Então toda vontade parece pedir autorização de alguém.'],
  ['E por que ela não resolve sozinha?', 'Porque ela tenta resolver o sintoma: organiza a agenda, faz terapia de limites. Mas a permissão não vem de fora, e ninguém ensinou ela a dar pra si mesma.'],
]

export const conta = [
  'Por que acontece: a aceitação foi condicionada a agradar',
  'Por que não resolve sozinha: trata o sintoma (limites), não a permissão',
  'Como se resolve: reconstruindo a permissão interna em etapas',
]

export const proposta =
  'A cliente sofre porque, ao longo da vida, aceitação virou sinônimo de agradar. Sem permissão interna pra ter vontade própria, ela vive pedindo autorização. Tentativas de "impor limites" falham porque atacam o sintoma. O que resolve é reconstruir a permissão de dentro, em etapas. É isso?'

export const candidatos = [
  { nome: 'Déficit de Autorização', som: false, curiosidade: 2, vocab: true, veredito: 'Difícil de falar. Sonoridade veta.' },
  { nome: 'Autonegação Crônica', som: true, curiosidade: 1, vocab: true, veredito: 'Só descreve; ela já sabe que tem.' },
  { nome: 'Dívida de Si', som: true, curiosidade: 3, vocab: false, veredito: 'Ninguém usa "si" numa conversa.' },
  { nome: 'Síndrome do Sim', som: true, curiosidade: 3, vocab: true, veredito: 'Passa nos três, mas é raso e copiável.' },
  { nome: 'Falta de Permissão', som: true, curiosidade: 3, vocab: true, veredito: 'Passa nos três e exige a explicação. Vence.' },
]

export const pilha = {
  problema: 'Falta de Permissão',
  causa: 'Aceitação condicionada a agradar: a criança aprende que ser aceita depende de não contrariar. A vontade própria vira risco.',
  causaFonte: 'Teoria do apego (Bowlby), emprestada com autoridade pronta',
  solucao: 'Permissão Restaurada',
  solucaoDesc: 'A pessoa passa a ter vontade própria sem pedir autorização antes.',
  raiz: 'Protocolo de Permissão',
  raizDesc: 'As 6 sessões que ela já faz, nomeadas dentro da teoria.',
  mecanismo: 'Permissão: não é o problema nem a solução, é a teoria inteira. O problema é a falta dela.',
  traducoes: [
    ['Sessão 1 · "mapa de sins"', 'Inventário de permissões cedidas'],
    ['Sessão 2 · "linha do tempo"', 'Onde a permissão foi negada pela primeira vez'],
    ['Sessão 3 · "o corpo avisa"', 'Sinais de que a vontade nasceu e foi calada'],
    ['Sessão 4 · "carta ao pai"', 'Devolução da autorização'],
    ['Sessão 5 · "ensaio"', 'Primeira vontade exercida sem pedir'],
    ['Sessão 6 · "contrato"', 'Permissão assinada por ela mesma'],
  ],
  manifesto:
    'Existe um tipo de sofrimento que não aparece nos exames e não cabe em diagnóstico: o de quem aprendeu que ser aceita custa a própria vontade. Eu chamo isso de Falta de Permissão. Não se resolve com agenda, com limite ou com coragem emprestada. Se resolve devolvendo à pessoa o direito que ela nunca soube que tinha. É isso que o Protocolo de Permissão faz, em seis etapas, uma vontade de cada vez.',
}

export const matriz = {
  formato: 'Live única com aplicação',
  porque: [
    'Ticket alto (programa de R$ 4.900) vendido por conversa',
    'Operação enxuta: ela sozinha, sem time',
    'Nunca lançou: um evento, uma régua',
    'Tem lista quente (640) pra testar a tese barato',
  ],
  descartado: 'Série de CPLs: pede ~700 disparos e moderação; fica pra 2ª rodada.',
  mecanica: [
    ['Conversão', 'aplicação → call 1-a-1 (45-60 min)'],
    ['CTA', 'o botão nasce no pitch (~min 70) com countdown de 24h'],
    ['Replay', '24h, com a mesma escassez'],
    ['Tiers', 'A quente = agenda na hora · B morno = revisão · C frio = downsell'],
  ],
}

export const oferta = {
  produto: 'Permissão Restaurada · programa de 8 semanas',
  preco: 'R$ 4.900',
  ancora: 'R$ 7.800',
  garantia: '7 dias incondicional',
  urgencia: '12 vagas por aplicação · janela de 24h',
  bonus: ['Diagnóstico individual em call de 45 min', 'Kit de sessão: as 6 etapas em cartas'],
  segmento: 'psicóloga',
  travado: ['paciente', 'consultório', 'abordagem'],
  banidos: ['cliente', 'captação', 'ansiedade', 'depressão', 'transtorno', 'jaula'],
}

export const calendario = [
  ['D-15', 'Aquecimento', 'Aula gravada 12-15 min + diagnóstico interativo'],
  ['D-10', 'Aquecimento', 'Régua A: 1 dor/objeção por dia'],
  ['D-7', 'Antecipação', 'Os 3 motivos pra estar ao vivo'],
  ['D-3', 'Tiro de alerta', 'Calendário + "faltam 3 dias"'],
  ['D-1', 'Lembrete', 'Régua B começa'],
  ['D0', 'LIVE', '20h · 90-120 min · botão nasce no pitch', true],
  ['D+1', 'Aplicação', 'Pesquisa 9 perguntas → tiers A/B/C'],
  ['D+2', 'Calls', 'Tier A agenda na hora'],
  ['D+3', 'Replay', '24h, mesma escassez'],
  ['D+5', 'Fechamento', 'Última chamada + garantia'],
]

export const anuncios = [
  { id: 'R01-A1', angulo: 'erro invisível', formato: 'thead + b-roll', nivel: 'problema', objecao: '"meu marketing é ruim"', prova: 'autodiagnóstico', headline: 'o erro que a sua agenda esconde', hook: 'Se a sua agenda está cheia, você provavelmente está cometendo um erro que ninguém te conta.', corpo: 'Agenda cheia por indicação parece sucesso. Só que indicação não escala: ela depende de alguém lembrar de você numa conversa que você não controla.', cta: 'Toca no Saiba Mais e assiste ao vídeo onde eu mostro o que substitui a indicação.' },
  { id: 'R01-A2', angulo: 'sintoma → causa raiz', formato: 'caixinha de perguntas', nivel: 'problema', objecao: '"é falta de constância"', prova: 'estatística', headline: 'os 3 sinais de que o problema não é o seu marketing', hook: 'Se a sua agenda só cresce quando alguém te indica, se os seus posts recebem elogio de colega mas não trazem paciente novo, e se você trava na hora de reajustar o seu valor…', corpo: '…esses três sinais têm uma única causa. Quando uma paciente sua fala de você pra uma amiga, ela completa a frase "vai nela, porque ela…" com alguma coisa que viveu com você. É isso que o seu perfil não mostra.', cta: 'Toca no Saiba Mais e assiste ao vídeo onde eu mostro como transformar essa frase no centro do seu posicionamento.' },
  { id: 'R01-A3', angulo: 'mecanismo único', formato: 'micro-aula', nivel: 'solução', objecao: '"já tentei de tudo"', prova: 'demonstração', headline: 'por que a paciente fala de você e o mercado não vê', hook: 'Faz um teste mental comigo. Pensa na última paciente que te indicou.', corpo: 'O que ela disse não foi "ela é boa". Foi um jeito único de você enxergar o problema dela. Isso tem nome: é a sua tese. Ela já existe. Só está aparecendo numa conversa de cada vez.', cta: 'Toca no Saiba Mais e assiste ao vídeo onde eu mostro como tirar a tese da conversa e colocar no seu perfil.' },
  { id: 'R01-A4', angulo: 'antes / depois', formato: 'diálogo', nivel: 'solução', objecao: '"vai parecer propaganda"', prova: 'analogia', headline: 'a diferença entre ser boa e ser lembrada', hook: 'Duas psicólogas. Mesma formação, mesma técnica.', corpo: 'Uma responde "trabalho com adultos". A outra responde "trabalho com quem passou a vida dizendo sim". Adivinha de qual a amiga lembra.', cta: 'Toca no Saiba Mais e assiste ao vídeo.' },
  { id: 'R01-A5', angulo: 'anti-venda', formato: 'UGC', nivel: 'produto', objecao: '"é pra quem está começando"', prova: 'credencial', headline: 'isso não é pra toda psicóloga', hook: 'Se você ainda está montando o consultório, esse vídeo não é pra você.', corpo: 'É pra quem já é boa, já tem indicação, e cansou de ser comparada por preço com quem faz menos.', cta: 'Se é você, toca no Saiba Mais.' },
  { id: 'R01-A6', angulo: 'objeção respondida', formato: 'tela verde', nivel: 'produto', objecao: '"não tenho tempo"', prova: 'caso em paráfrase', headline: '"não tenho tempo pra marketing"', hook: 'Eu ouço isso toda semana. E concordo.', corpo: 'Você não tem tempo pra marketing. Tem 40 minutos pra descobrir o que a sua paciente já diz de você. O resto é consequência.', cta: 'Toca no Saiba Mais e vê como.' },
  { id: 'R01-A7', angulo: 'reason why', formato: 'entrevista', nivel: 'oferta', objecao: '"por que agora"', prova: 'autoridade', headline: 'por que só 12 vagas', hook: 'Me perguntaram por que eu não abro mais vagas.', corpo: 'Porque cada tese é uma conversa de 45 minutos comigo, e eu ainda atendo. Doze é o que cabe sem eu virar o que eu critico.', cta: 'Toca no Saiba Mais e assiste à aula.' },
  { id: 'R01-A8', angulo: 'risco invertido', formato: 'estático (quente)', nivel: 'oferta', objecao: '"e se não funcionar pra mim"', prova: 'garantia real', headline: '7 dias. Sem formulário.', hook: 'Se em 7 dias você não enxergar a sua tese, devolvo.', corpo: 'Sem conversa de retenção.', cta: 'Aplicar agora.' },
  { id: 'R01-A9', angulo: 'loop aberto', formato: 'pattern interrupt', nivel: 'genérico', objecao: '—', prova: 'curiosidade', headline: 'a frase que a sua paciente completa', hook: '"Vai nela, porque ela…"', corpo: 'Como a sua paciente completa essa frase? A resposta é o seu posicionamento inteiro. E você nunca ouviu.', cta: 'Toca no Saiba Mais e descobre.' },
  { id: 'R01-A10', angulo: 'analogia', formato: 'podcast fake', nivel: 'genérico', objecao: '—', prova: 'analogia', headline: 'marketing é amplificador', hook: 'Marketing é um amplificador.', corpo: 'Ele mostra pra mais gente o que você já comunica. Quando o que você comunica é igual ao da colega, você paga pra amplificar a própria igualdade.', cta: 'Toca no Saiba Mais.' },
]

export const pagina = {
  diagnostico: [
    ['Tipo', 'long-form de aplicação'],
    ['Público', 'psicóloga experiente · morno (veio da leva R01)'],
    ['Consciência', 'do problema: alta · da solução: baixa'],
    ['Meta única', 'preencher a aplicação'],
    ['Preço', 'R$ 4.900 · âncora R$ 7.800'],
    ['Emoção', 'a injustiça de ser comparada por preço sendo melhor que a comparação'],
    ['Voz', 'consultora que senta do lado · zero jargão · 1 frase de efeito no máximo'],
  ],
  secoes: [
    { n: 1, nome: 'Herói', eyebrow: 'Pra psicólogas que vivem de indicação', h1: 'Você é boa. O mercado enxerga mais uma.', sub: 'Um programa de 8 semanas pra descobrir a tese que a sua paciente já conta e transformar em posicionamento.', cta: 'Quero aplicar' },
    { n: 2, nome: 'A cena', texto: 'Segunda-feira, 7h40. Você abre o Instagram antes da primeira paciente e vê que a colega postou de novo. Aí vem aquele aperto conhecido: a sua semana começou e o seu perfil está parado desde quinta.' },
    { n: 3, nome: 'O mecanismo', texto: 'Quando todos os perfis da sua área falam dos mesmos temas com as mesmas palavras, o mercado enxerga uma coisa só. Isso tem nome: Equivalência Percebida. E entre equivalentes, a escolha desce pra preço e conveniência.', destaque: 'o nome do problema entra aqui e só aqui' },
    { n: 4, nome: 'O produto', texto: 'Oito semanas, em três fases: a escuta (o que a sua paciente já diz), a pilha (problema, causa, solução, produto com nome) e a voz (o manifesto que você defende sem ler).' },
    { n: 5, nome: 'Objeção central', sub: '"Eu não quero parecer vendedora."', texto: 'Você tem razão. A maioria do marketing de psicóloga parece vendedora porque vende técnica. Tese não vende técnica; ela explica um problema de um jeito que só você explica. Ninguém chama isso de propaganda. Chama de clareza.' },
    { n: 6, nome: 'Encaixe honesto', texto: 'Se você atende por convênio e o seu volume vem de tabela, uma tese muda pouco a sua situação, e eu te digo isso na primeira call, antes de você gastar oito semanas.' },
    { n: 7, nome: 'Preço', texto: 'R$ 4.900 em até 12x. Âncora: R$ 7.800 (mentoria individual).' },
    { n: 8, nome: 'Garantia', texto: '7 dias. Sem formulário e sem conversa de retenção.' },
    { n: 9, nome: 'Quem criou', texto: 'Renata, psicóloga clínica há 12 anos. Credencial real no lugar de depoimento inventado.' },
    { n: 10, nome: 'FAQ', texto: 'Quanto tempo até resultado? · Preciso aparecer? · Posso cancelar? · Sou coach, serve pra mim? (roteamento)' },
    { n: 11, nome: 'P.S.', texto: 'A aplicação fecha quinta às 20h. Leva 4 minutos e não compromete com nada.' },
  ],
  cub: { confuso: 0, unbelievable: 1, boring: 0, nota: 'Unbelievable: "todas as pacientes" virou "a última paciente que te indicou".' },
}

export const roteiro = [
  { n: 1, nome: 'Abertura e promessa', min: '0-5', texto: 'No final eu faço um convite pra poucas. Mas antes você vai sair daqui sabendo por que a sua paciente te indica e o seu perfil não.', chat: 'Me responde no chat, com sinceridade: quantas pacientes novas vieram do Instagram esse mês?' },
  { n: 2, nome: 'Quem sou eu', min: '5-10', texto: 'Doze anos de consultório. Agenda cheia. E três anos travada no mesmo valor porque eu não sabia dizer o que me diferenciava.' },
  { n: 3, nome: 'O inimigo', min: '10-18', texto: 'O inimigo não é a colega. É uma ideia: a de que ser boa basta. Chama Equivalência Percebida.', slide: 'gráfico: 40 perfis, mesmas 6 palavras' },
  { n: 4, nome: 'Mecanismo do problema', min: '18-30', texto: 'O cérebro de quem escolhe funciona por assimilação: te encaixa numa caixa que já existe e segue. Entre iguais, a escolha desce pra preço.' },
  { n: 5, nome: 'Mecanismo da solução', min: '30-45', texto: 'A tese força o contrário: acomodação. Uma caixa nova, com um nome só. E ela já existe, na frase que a sua paciente completa.' },
  { n: 6, nome: 'O mapa', min: '45-58', texto: 'Escuta → Pilha → Voz. Três fases, oito semanas.', slide: 'o mapa em 3 passos' },
  { n: 7, nome: 'Prova', min: '58-66', texto: 'Caso em paráfrase (sem depoimento, por ética): a psicóloga que reajustou 40% sem perder ninguém.' },
  { n: 8, nome: 'A oferta', min: '66-78', texto: 'Permissão Restaurada, 8 semanas, R$ 4.900. Bônus que resolvem as objeções. Garantia de 7 dias.', lint: 'Linha 3: "quem chega com sofrimento emocional e sai com…" (termo banido trocado)' },
  { n: 9, nome: 'As 3 objeções', min: '78-86', texto: 'Tempo (40 min por semana). Dinheiro (uma paciente a mais paga). Capacidade ("será que funciona pra mim": se você tem indicação, a tese já existe).' },
  { n: 10, nome: 'CTA de aplicação + urgência', min: '86-90', texto: 'As vagas são por aplicação. Não é pra todo mundo. Quem quer ser considerada preenche agora. A janela fecha em 24h pra todas ao mesmo tempo.', slide: 'botão nasce agora + countdown 24h' },
]

export const reguas = {
  A: [
    ['D-7', 'oi 🙂 uma coisa que eu vejo toda semana no consultório: a psicóloga que é boa e fica presa no mesmo valor por anos.\n\namanhã eu te conto por que isso acontece. não é o que você imagina.'],
    ['D-6', 'lembra do que eu falei ontem?\n\nnão é falta de marketing. é que o mercado te enxerga como mais uma, mesmo você sendo melhor.\n\nisso tem nome. te conto na quinta.'],
    ['D-5', 'muita gente me diz "não quero parecer vendedora"\n\neu também não. e a tese não é propaganda, é clareza. na quinta eu mostro a diferença.'],
    ['D-4', 'uma pergunta pra você pensar até quinta:\n\ncomo a sua paciente completa a frase "vai nela, porque ela…"?'],
    ['D-3', 'faltam 3 dias. quinta, 20h.\n\nentra 10 minutos antes, com fone. a parte que mais muda o seu posicionamento vem no final.'],
    ['D-2', 'quem estiver ao vivo recebe o diagnóstico da própria tese, comentado na hora.\n\nno replay você vê o das outras. ao vivo, pode ser o seu.'],
    ['D-1', 'oi, é amanhã 🙂\n\nàs 20h eu vou te mostrar onde mora essa falta de permissão que faz você pedir desculpa antes de ter vontade.\n\nconsigo contar contigo?'],
  ],
  B: [
    ['manhã', 'bom dia! é hoje, 20h.\n\nseparei uma coisa que só vou mostrar ao vivo. te espero.'],
    ['-3h', 'daqui a 3 horas.\n\nfone de ouvido e um lugar sem interrupção, tá?'],
    ['-1h', 'falta 1 hora. o link vai chegar aqui.'],
    ['-15min', 'estamos quase. já pode entrar: [link]'],
    ['ao vivo', 'estamos AO VIVO 🙂 entra aqui: [link]'],
    ['ping 1', 'não sai agora. daqui a 10 min eu mostro a frase que a sua paciente completa.'],
    ['ping 2', 'chegou a parte que eu falei. quem está aí?'],
  ],
}

export const lint = [
  ['Anúncio R01-A4', '"não é X, é Y" de efeito removida', 'ok'],
  ['Página · O mecanismo', 'o nome do problema entra só aqui', 'ok'],
  ['Régua A · D-5', 'travessão trocado por vírgula', 'ok'],
  ['Roteiro · bloco 8', '"ansiedade" (banido no segmento) → "sofrimento emocional"', 'warn'],
  ['Régua B · -1h', '2 perguntas na mesma mensagem → 1', 'ok'],
]

export const execucao = {
  hoje: 'D-15',
  checklist: [
    ['Conectar o WhatsApp oficial', true],
    ['Subir a leva R01 (10 anúncios, R$ 60/dia, 35+ travado, Advantage+ off)', false],
    ['Publicar a página de aplicação', false],
    ['Disparo régua A · D-15 pra turma 1 e 2', false],
    ['Gravar a aula de aquecimento (12-15 min)', false],
  ],
  turmas: [
    ['Turma 1', '500 contatos', 'número dedicado, aquecido'],
    ['Turma 2', '140 contatos', 'mesmo número'],
    ['E-mail', '640', 'redundância da régua B'],
  ],
}

export const rastreamento = {
  utm: [
    ['utm_content', 'renata-r01--a3-mecanismo-unico'],
    ['Página', '/aplicar · obrigado com pesquisa de 9 perguntas'],
    ['Pixel + CAPI', 'Lead · Schedule · InitiateCheckout'],
    ['Player', 'CTA por tempo do player · botões off'],
  ],
  reguas: [
    ['Hook rate · campanha', '≥ 40%'],
    ['CTR · campanha', '2,9–4,5%'],
    ['CPL', 'R$ 6–12'],
    ['Presença na live', '≥ 35%'],
    ['Aplicações · tier A', '≥ 20%'],
  ],
}

export const campanha = {
  dia: 3,
  resumo: [
    ['Hook rate · campanha', '41%', '≥ 40%', 'good'],
    ['CTR · campanha', '3,4%', '2,9–4,5%', 'good'],
    ['CPL', 'R$ 9,80', 'R$ 6–12', 'good'],
    ['Presença na live', '41%', '≥ 35%', 'good'],
    ['Aplicações · tier A', '9 de 31', '≥ 20%', 'good'],
  ],
  porAnuncio: [
    ['R01-A3', '43%', '4,1%', 'vencedor'],
    ['R01-A2', '40%', '3,2%', 'ok'],
    ['R01-A7', '38%', '3,0%', 'ok'],
    ['R01-A9', '31%', '2,3%', 'observar'],
    ['R01-A4', '22%', '1,9%', 'matar'],
  ],
  correcoes: [
    ['R01-A4 abaixo da régua', 'hook 22% (< 40%): problema de gancho ou formato. Matar sem apego; não substituir dentro da campanha.', 'warn'],
    ['Campanha performando', 'CPL R$ 9,80 dentro da régua. Única alavanca permitida: verba. Sugestão: +30% no conjunto.', 'ok'],
    ['R01-A3 é a matriz', '43% de hook, 4,1% CTR. Base da leva R02 (3 estruturas × 2 formatos).', 'ok'],
  ],
  cortes: [
    ['00:14:20 → 00:15:05', 'a diferença entre ser boa e ser lembrada', true],
    ['00:31:40 → 00:32:30', 'por que a indicação não escala', true],
    ['00:52:10 → 00:52:48', 'o erro de tratar o sintoma', true],
    ['00:08:00 → 00:08:40', '"se posicione" (sem virada)', false],
  ],
  r02: [
    'Matriz: R01-A3 (mecanismo único, micro-aula)',
    '3 estruturas × 2 formatos = 6 variações, mudando 2-3 coisas cada',
    'Campanha separada: R02 nunca entra na R01',
    'Briefing atualizado com as métricas da R01',
  ],
}
