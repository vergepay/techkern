# Cline

Cline reads MCP servers from VS Code settings under `cline.mcpServers`. Add:

```jsonc
{
  "cline.mcpServers": {
    "techkern": {
      "command": "npx",
      "args": ["@techkern/mcp"]
    }
  }
}
```

Then open the Cline panel → Tools → confirm `techkern.*` is listed.
