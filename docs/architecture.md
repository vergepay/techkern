# Architecture

```
AI Agent (Claude / Cursor / ChatGPT / OpenAI Agents)
        |  MCP protocol (stdio or SSE)
        v
  techkern MCP gateway  (this repo, TypeScript)
        |  ClickHouse-native + Helius RPC
        v
  ClickHouse query layer
   |       |       |       |
   v       v       v       v
 swaps  pumpfun holders   kol      <-- 4 indexer shards
   ^       ^       ^       ^
   |       |       |       |
        Helius RPC + Jito MEV bundles (upstream)
```

## Components

### MCP gateway
Stateless TypeScript process. Receives MCP tool calls from any compatible client, validates input against per-tool Zod schemas, dispatches to the ClickHouse layer or Helius RPC, returns shaped JSON.

### Indexer shards
Independent Rust workers. Each shard owns a domain:

- **swaps** — ingests every Jupiter/Raydium/Orca/Meteora trade. ~110M rows/day.
- **pumpfun** — pump.fun mints, bonding-curve checkpoints, graduation events.
- **holders** — SPL token balance deltas; materialized into `token_holders_latest`.
- **kol** — curated wallet list with 30-day rolling PnL recompute.

Shards write ProtoBuf records to ClickHouse over the native protocol.

### ClickHouse
ReplacingMergeTree on all hot tables. Projections precompute the 6 most common query shapes — keeps p95 < 50ms on swap lookups even at 247B rows. See [RFC-0002](../spec/RFC-0002-clickhouse-projection-strategy.md).

### Helius upstream
- Geyser plugin -> indexer shards for live writes
- JSON-RPC for ad-hoc account lookups (`mint_authority_check`)
- Failover to a secondary RPC after 3 consecutive errors

### WebSocket gateway
Separate process. Subscribes to ClickHouse `INSERT` materialized views and fans out to client subscriptions. Wire format in [RFC-0003](../spec/RFC-0003-websocket-stream-format.md).

## SLOs

| Metric | Target | Current |
|---|---|---|
| Tool call p95 | < 50ms | 42ms |
| Tool call p99 | < 150ms | 118ms |
| Indexer lag (swaps) | < 2s | ~800ms |
| Uptime | 99.9% | live status at techkern.xyz/status |
