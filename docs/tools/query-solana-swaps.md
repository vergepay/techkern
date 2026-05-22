# query_solana_swaps

DEX swaps across Jupiter, Raydium, Orca, Meteora.

## Recipes

### Largest SOL -> USDC swaps in the last hour
```json
{ "mint": "So11111111111111111111111111111111111111112",
  "minUsd": 10000, "from": "now-1h", "limit": 25 }
```

### All swaps for a wallet today
```json
{ "wallet": "<wallet>", "from": "now-24h", "limit": 500 }
```

### Raydium-only flow for one token
```json
{ "mint": "<mint>", "dex": "raydium", "limit": 200 }
```

## Notes
- Indexer lag ~800ms — calls land near real-time
- `usdValue` uses the swap's mid-market price at `blockTime`
- For live streaming, subscribe to `subscribe.solana.swaps.large`
