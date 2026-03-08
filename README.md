# GPT Defence

A tower defence game where towers are generated from natural language prompts.
Describe the tower you want and the LLM creates a balanced unit with stats,
abilities, and flavour text — all validated against strict Zod schemas before
entering the game.

---

## Architecture

```
gpt-defence/
├── client/        Phaser 3 browser game
├── server/        Node.js + Express API + LLM orchestration
├── schemas/       Zod schemas for LLM outputs (shared validation)
├── shared/        TypeScript types shared between client and server
├── simulation/    Headless combat simulator for balancing
├── prompts/       Versioned prompt templates sent to the LLM
├── .env.example   Environment variable reference
└── package.json   Root workspace config
```

### Data flow

```
Browser  →  POST /generate-tower  →  Server loads prompt template
                                   →  Calls LLM with prompt + user input
                                   →  Validates JSON response with Zod
                                   →  Returns TowerDefinition to client
Client spawns tower in Phaser scene using the returned definition.
```

---

## Getting Started

### Prerequisites

- Node.js >= 20
- npm >= 10

### Install

```bash
git clone https://github.com/your-username/gpt-defence.git
cd gpt-defence
npm install
```

### Configure environment

```bash
cp .env.example .env
# Edit .env — set LLM_PROVIDER=mock for zero-config local dev
```

### Run (development)

Start both server and client dev servers in one terminal:

```bash
npm run dev
```

Or individually:

```bash
# API server  (http://localhost:3000)
npm run dev --workspace=server

# Phaser client  (http://localhost:5173)
npm run dev --workspace=client
```

### Run the headless simulator

```bash
npm run simulate
```

### Build for production

```bash
npm run build
```

---

## Packages

| Package | Description |
|---------|-------------|
| `client` | Phaser 3 game — scenes, entities, assets |
| `server` | Express API, LLM client, prompt loader |
| `schemas` | Zod schemas — the single source of truth for all game data shapes |
| `shared` | Plain TypeScript types inferred from schemas |
| `simulation` | Headless time-step simulator — runs `simulateTowerVsWave` |
| `prompts` | Markdown prompt templates versioned alongside the code |

---

## API Reference

### `POST /generate-tower`

**Body**
```json
{ "prompt": "A slow but devastating frost cannon" }
```

**Response**
```json
{
  "name": "Frost Cannon",
  "damage": 120,
  "range": 180,
  "fireRate": 0.4,
  "cost": 350,
  "effect": "slow"
}
```

### `POST /generate-wave`

**Body**
```json
{ "prompt": "A swarm of fast but fragile insects, wave 3" }
```

**Response** — array of `EnemyDefinition` objects.

---

## License

MIT
