# query_kol_wallets

KOL wallet tracker — 1,400+ curated Solana wallets.

## Recipes

### Top earners over 30 days
```json
{ "minPnl30d": 100000, "limit": 25 }
```

### KOLs who just bought $TOKEN
```json
{ "recentBuyMint": "<mint>", "minWinRate": 0.55 }
```

## Wallet list
The curated KOL list is maintained in `indexer/kol/wallets.toml` and refreshed daily. Add a wallet by opening a PR.

## Methodology
- PnL is realized + unrealized (mark-to-market at last trade)
- Win rate is `closed_winning_trades / closed_trades` over the 30-day window
- Wallets that haven't traded in 30 days fall off the active list
