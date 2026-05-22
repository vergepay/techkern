# API Reference

Every techkern MCP tool, input schema, and a sample response.

## `query_solana_swaps`
DEX swaps across Jupiter, Raydium, Orca, Meteora.

```ts
{
  mint?:    string,                             // filter on either side
  wallet?:  string,
  dex?:     "jupiter" | "raydium" | "orca" | "meteora",
  minUsd?:  number,
  from?:    string,  // ISO or "now-1h"
  to?:      string,
  limit?:   number   // 1..1000, default 100
}
```
Returns array of `Swap { signature, slot, blockTime, dex, inputMint, outputMint, inputAmount, outputAmount, usdValue, wallet }`.

## `query_pump_fun_launches`
New pump.fun mints and bonding-curve progress.
```ts
{ creator?: string, minMcapUsd?: number, minBondingPct?: number, from?: string, to?: string, limit?: number }
```

## `query_token_holders`
Top-N holder distribution.
```ts
{ mint: string, topN?: number }
```

## `query_kol_wallets`
KOL wallet tracker (1,400+ wallets).
```ts
{ minPnl30d?: number, minWinRate?: number, recentBuyMint?: string, limit?: number }
```

## `mint_authority_check`
Mint + freeze authority status (live RPC read).
```ts
{ mint: string }
```
Returns `{ mintAuthority, freezeAuthority, decimals, supply, isRenounced }`.

## `dev_token_history`
Every SPL mint ever deployed by a wallet.
```ts
{ wallet: string, includeDead?: boolean, limit?: number }
```

## `whale_tracker`
Large swaps above a USD threshold, with KOL attribution.
```ts
{ minUsd?: number, mint?: string, from?: string, to?: string, limit?: number }
```

## `new_token_alerts`
One-shot poll of new mints in the last N minutes.
```ts
{ source?: "pumpfun" | "raydium-clmm" | "any", minLpUsd?: number, symbolRegex?: string, windowMinutes?: number }
```
For live streaming, subscribe to `subscribe.solana.new_mint` over WS (see [RFC-0003](../spec/RFC-0003-websocket-stream-format.md)).

## `liquidity_depth`
Aggregated DEX depth curve at +/- N bps from mid.
```ts
{ baseMint?: string, quoteMint?: string, bpsLevels?: number[] }
```

## `holder_distribution`
Gini coefficient, top-N concentration %, holder-count history.
```ts
{ mint: string, topN?: number[], historyDays?: number }
```

## WebSocket subscriptions

Connect to `wss://api.techkern.xyz/mcp/stream`:

| Topic | Payload |
|---|---|
| `subscribe.solana.new_mint` | `{ mint, symbol, creator, lpUsd }` |
| `subscribe.solana.swaps.large` | full `Swap` with `minUsd` filter |
| `subscribe.pumpfun.bonding_complete` | `{ mint, bondingClosedAt, finalMcap }` |
| `subscribe.kol.recent_buy` | `{ wallet, mint, usdValue }` |
