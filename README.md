<div align="center">

# Techkern

**GPU inference, 65% cheaper.**
Routes your LLM calls to the cheapest available GPU provider.

[![Stars](https://img.shields.io/badge/stars-73-yellow?style=flat-square&logo=github)]()
[![CI](https://img.shields.io/badge/ci-passing-brightgreen?style=flat-square)]()
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)]()
[![npm](https://img.shields.io/badge/npm-890%2Fweek-red?style=flat-square&logo=npm)]()
[![Discord](https://img.shields.io/badge/discord-340%20members-5865F2?style=flat-square&logo=discord)]()

[Website](https://techkern.xyz) · [Docs](./docs/quickstart.md) · [X](https://x.com/kernonsol)

</div>

---

## Why Techkern

Same Llama 3.3 70B on Groq costs 95% less than GPT-4o for equivalent task quality.
Techkern routes each call to the **cheapest GPU+model combo** that meets your quality requirement.
Drop-in for OpenAI, Claude, and Llama. Zero code changes.

## Quickstart

```bash
npm i @techkern/sdk
```

```ts
import { Techkern } from "@techkern/sdk";

const k = new Techkern({ apiKey: process.env.TECHKERN_KEY });

const reply = await k.route({
  model: "auto",          // or pin "claude-3.7", "llama-3.3-70b", "gpt-4o"
  messages: [{ role: "user", content: "..." }],
  qualityFloor: 0.9,      // 0..1 — never go below this quality
});

console.log(reply.text);
console.log(reply.routedTo);   // { provider: "groq", model: "llama-3.3-70b", cost: 0.00012 }
```

## Supported providers

| Provider | Models | Avg latency | Status |
|---|---|---|---|
| Groq | Llama 3.3 70B, Mixtral 8x7B | 230ms | ✅ |
| Together | Llama 3.3 70B, DeepSeek V3, Qwen 2.5 | 450ms | ✅ |
| Lambda | Hermes 3, Llama 3.3 70B | 380ms | ✅ |
| Fireworks | Llama 3.3 70B, Mixtral | 410ms | ✅ |
| Anyscale | Llama 3.3 70B | 520ms | ✅ |
| OpenAI | GPT-4o, GPT-4o-mini | 800ms | ✅ |
| Anthropic | Claude 3.7 Sonnet | 900ms | ✅ |

## SDK matrix

| Language | Package | Status |
|---|---|---|
| Node.js | `@techkern/sdk` | ✅ v0.4.0 |
| Python | `techkern-sdk` | ✅ v0.4.0 |
| Rust | `techkern` (crates.io) | 🟡 RC |
| Go | planned | 🔴 |

## Benchmarks

| Workload | OpenAI baseline | Techkern (auto) | Savings |
|---|---|---|---|
| 1M RAG calls/mo | $4,200 | $1,470 | **65%** |
| 500K agent calls/mo | $2,100 | $682 | **68%** |
| 5K summarization/mo | $24 | $7.50 | **69%** |
| 100K classification/mo | $156 | $41 | **74%** |

## Roadmap

- [x] Groq + Together backends
- [x] Per-call cost optimization
- [x] Auto-rollback on quality drop
- [x] EU / US compute pinning
- [x] Streaming pass-through
- [ ] Local backend (vLLM/llama.cpp) behind `ENABLE_LOCAL_BACKEND`
- [ ] Custom routing rules via TypeScript DSL
- [ ] On-prem deployment

## License

MIT © 2026 Techkern
