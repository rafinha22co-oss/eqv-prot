# Expertise que Vende — protótipo

Protótipo navegável do "cérebro de campanhas": a conversa (voz ou texto) fecha a tese com o método do Chrys,
a matriz escolhe o formato, cada etapa vira uma galáxia do universo (o cérebro vai ligando as galáxias
conforme gera), e o expert clica numa galáxia pra entrar e ver o que foi gerado nela, card a card.

## Rodar
```
npm install
npm run dev      # http://localhost:5190
```

## Estrutura
- `src/styles/tokens.css` — DS extraído do Figma (Instagram UI Kit 4.0) + acento ouro. Fonte: SF Pro via `-apple-system`.
- `src/data/renata.js` — expert de exemplo e todo o conteúdo gerado (fictício, escrito com o método).
- `src/journey/journey.js` — a jornada roteirizada (passos, gates, linter, monitor).
- `src/canvas/model.js` — frames e cards do canvas (layout automático).
- `src/canvas/scene.js` — o layout da cena: onde cada nó fica em cada estado (rede / etapa aberta).
- `src/canvas/Scene.jsx` — o renderer, portado da lógica do `nold-prot` v3: canvas por baixo (ligações em curva, filamentos, partículas correndo, membranas do núcleo) e nós HTML por cima, posicionados quadro a quadro com atraso e curva próprios.
- `src/components/Brand.jsx` — marca (símbolo + wordmark) e a entrada de marca.
- `src/canvas/Cards.jsx` — renderizador de cada tipo de card (compacto no canvas, completo no inspetor).
- `src/components/Panels.jsx` — barra superior, conversa, camadas, inspetor.

## Como navegar
Clique num ramo = entrar na etapa · clique numa peça = abrir o detalhe no inspetor · `Esc` = voltar para a rede.
A cena se reorganiza sozinha (sem pan/zoom): quem sai é empurrado pra fora e some, quem entra vem do pai com atraso próprio.

## De onde veio o renderer
A lógica é a do `../nold-prot` **v3** (`js/v3.js`): uma cena de nós com `from`/`to`/`delay`, caminho levemente curvo,
canvas 2D desenhando as ligações com filamentos e partículas. Vale registrar: o v3 **não usa d3** — o `d3.min.js`
do `vendor/` é do `net.js` (v1). Aqui é canvas 2D puro também, sem dependência nova.
# eqv-prot
