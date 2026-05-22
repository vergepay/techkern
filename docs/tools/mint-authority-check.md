# mint_authority_check

Mint + freeze authority for any SPL token. Live RPC read — never cached.

## Recipes
```json
{ "mint": "<mint>" }
```

Returns:
```json
{
  "mint": "<mint>",
  "mintAuthority": null,
  "freezeAuthority": null,
  "decimals": 6,
  "supply": "1000000000000000",
  "isRenounced": true
}
```

`isRenounced: true` means both authorities are `null` and the dev cannot mint more or freeze accounts. Required for most exchange listings and a common sanity check before any buy.
