# Changelog

## v0.4.0 — 2026-05-20
- Added KOL wallet tracker shard — 1,400+ tracked wallets, real-time PnL
- `query_kol_wallets` MCP tool with `min_pnl_30d`, `recent_buy` filters

## v0.3.2 — 2026-05-15
- Sub-50ms p95 latency (was 110ms) after ClickHouse projection rewrite
- ProtoBuf wire format for indexer shard RPC

## v0.3.0 — 2026-05-08
- WebSocket streaming: `subscribe.solana.new_mint`, `subscribe.solana.swaps.large`, `subscribe.pumpfun.bonding_complete`, `subscribe.kol.recent_buy`

## v0.2.5 — 2026-05-01
- `mint_authority_check` MCP tool — mint + freeze authority status, dev-renounced flag
- Helius RPC failover added

## v0.2.0 — 2026-04-20
- Cursor + Cline + Zed MCP support (previously Claude-only)
- Per-region indexer shards

## v0.1.0 — 2026-04-05
- Public launch — Solana DEX swaps + pump.fun MCP server
- Anthropic MCP spec compliance
