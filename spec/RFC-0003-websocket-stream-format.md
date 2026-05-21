# RFC-0003: WebSocket stream wire format

- **Status:** Accepted (shipped v0.3.0, 2026-05-08)
- **Author:** @kern-tech
- **Created:** 2026-04-28

## Summary

Defines the wire format for live subscriptions over `wss://api.techkern.xyz/mcp/stream`. The MCP spec does not yet standardize streaming, so we ship our own minimal layer that any client (Claude Desktop via a thin shim, or a custom OpenAI Agents loop) can consume.

## Connect

```
GET wss://api.techkern.xyz/mcp/stream
Authorization: Bearer <api_key>
Sec-WebSocket-Protocol: techkern.v1
```

Server replies with a `hello` frame:

```json
{ "type": "hello", "version": "1.0", "serverTime": 1748000000 }
```

## Subscribe

Client sends:

```json
{ "type": "subscribe", "id": "sub-1", "topic": "subscribe.solana.swaps.large",
  "filter": { "minUsd": 50000, "mint": null } }
```

Server replies once:

```json
{ "type": "subscribed", "id": "sub-1" }
```

Then streams events tagged with the same `id`:

```json
{ "type": "event", "id": "sub-1", "ts": 1748000123,
  "data": { "signature": "...", "usdValue": 72400, "dex": "raydium", ... } }
```

## Topics

| Topic | Filter shape | Payload shape |
|---|---|---|
| `subscribe.solana.new_mint` | `{ source?, minLpUsd? }` | `NewMint` |
| `subscribe.solana.swaps.large` | `{ minUsd, mint? }` | `Swap` |
| `subscribe.pumpfun.bonding_complete` | `{ minMcap? }` | `{ mint, finalMcap, bondingClosedAt }` |
| `subscribe.kol.recent_buy` | `{ wallet?, minUsd? }` | `{ wallet, mint, usdValue, signature }` |

## Heartbeat

Server emits `{ "type": "ping", "ts": ... }` every 20s. Client must reply `{ "type": "pong" }` within 30s or the connection drops.

## Unsubscribe

```json
{ "type": "unsubscribe", "id": "sub-1" }
```

## Backpressure

If a client falls > 200 events behind, the server emits one `{ "type": "lag", "id": "sub-1", "dropped": N }` frame and resumes from current. Catch-up reads are explicitly out of scope — use the matching `query_*` tool with `from` instead.
