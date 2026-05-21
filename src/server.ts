/**
 * MCP gateway server. Registers tool handlers with the MCP runtime.
 *
 * Tools are exposed over stdio (for `npx @techkern/mcp` local install)
 * and over SSE at https://api.techkern.xyz/mcp for hosted clients.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { querySolanaSwaps } from "./tools/query-solana-swaps";
import { queryPumpFunLaunches } from "./tools/query-pump-fun-launches";
import { queryTokenHolders } from "./tools/query-token-holders";
import { queryKolWallets } from "./tools/query-kol-wallets";
import { mintAuthorityCheck } from "./tools/mint-authority-check";
import { devTokenHistory } from "./tools/dev-token-history";
import { whaleTracker } from "./tools/whale-tracker";
import { newTokenAlerts } from "./tools/new-token-alerts";
import { liquidityDepth } from "./tools/liquidity-depth";
import { holderDistribution } from "./tools/holder-distribution";

const TOOLS = [
  querySolanaSwaps,
  queryPumpFunLaunches,
  queryTokenHolders,
  queryKolWallets,
  mintAuthorityCheck,
  devTokenHistory,
  whaleTracker,
  newTokenAlerts,
  liquidityDepth,
  holderDistribution,
];

export async function startServer(): Promise<void> {
  const server = new Server(
    { name: "techkern", version: "0.4.0" },
    { capabilities: { tools: {} } }
  );

  for (const tool of TOOLS) {
    server.setRequestHandler(
      { method: `tools/call/${tool.name}` } as never,
      async (req: { params: { arguments: unknown } }) => {
        const result = await tool.handler(req.params.arguments as never);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
      }
    );
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  // eslint-disable-next-line no-console
  console.error(`[techkern] MCP server up — ${TOOLS.length} tools registered`);
}
