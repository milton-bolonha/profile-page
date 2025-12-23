# Neon Flight Game

Um jogo de voo 3D minimalista construído com React e Three.js. Navegue pelo espaço, evite obstáculos, colete pontos e use boosts para uma experiência imersiva.

## Funcionalidades

- **Controles Intuitivos**: Use mouse e WASD para voar, espaço para turbo, F para giro, C para loop.
- **Gráficos Neon**: Efeitos visuais com Three.js, incluindo partículas, trilhas e efeitos de turbo.
- **Sistema de Pontuação**: Ganhe pontos voando e destruindo obstáculos.
- **UI Responsiva**: HUD com velocidade, pontuação e energia.

## Como Rodar

1. Instale as dependências:

   ```
   npm install
   ```

2. Inicie o servidor de desenvolvimento:

   ```
   npm start
   ```

3. Abra o navegador em `http://localhost:3000`.

## Estrutura do Projeto

- `src/`: Código fonte
  - `components/`: Componentes React (NeonFlightGame)
  - `lib/`: Bibliotecas utilitárias (SimpleNoise)
  - `utils/`: Utilitários (vazio)
  - `config/`: Configurações (vazio)
  - `App.js`: Componente principal
  - `index.js`: Ponto de entrada

## Controles

- **Mouse/WASD**: Voar
- **Espaço**: Turbo
- **F**: Giro
- **C**: Loop
- **P**: Pausar
- **Z**: Atirar (clique no canvas)

## Tecnologias

- React
- Three.js
- JavaScript/TypeScript

## Licença

Este projeto é um protótipo e não possui licença específica.
