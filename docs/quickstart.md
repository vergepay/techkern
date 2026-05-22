# Quickstart

Get live Solana context into your AI agent in 3 minutes.

## 1. Pick your client

### Claude Desktop
```bash
# macOS
open ~/Library/Application\ Support/Claude/claude_desktop_config.json
```
Paste:
```json
{
  "mcpServers": {
    "techkern": {
      "command": "npx",
      "args": ["@techkern/mcp"]
    }
  }
}
```
Restart Claude.

### Cursor
Edit `~/.cursor/mcp.json` (or `<project>/.cursor/mcp.json`) — same shape.

### Cline (VS Code)
Add to settings:
```jsonc
"cline.mcpServers": {
  "techkern": { "command": "npx", "args": ["@techkern/mcp"] }
}
```

### Zed
Add to `~/.config/zed/settings.json`:
```jsonc
"context_servers": {
  "techkern": { "command": "npx", "args": ["@techkern/mcp"] }
}
```

### OpenAI Agents SDK
```ts
import { MCPServerSse } from "@openai/agents";
const techkern = new MCPServerSse({ url: "https://api.techkern.xyz/mcp" });
```

## 2. Ask your agent something

> "Largest 10 SOL -> USDC swaps on Raydium in the last 30 minutes."
>
> "Has the dev for mint `7xK...pump` ever rugged before?"
>
> "Which KOL wallets bought $BONK in the last 24 hours?"

The agent picks the right tool automatically. No prompt engineering required.

## 3. Next steps

- [API reference](./api-reference.md) - every tool with input schema
- [Architecture](./architecture.md) - ClickHouse + Helius topology
- [Recipes per tool](./tools/) - detailed examples
