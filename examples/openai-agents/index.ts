/**
 * Hook techkern into an OpenAI Agents SDK workflow.
 *
 * The agent gets every techkern MCP tool as a native function automatically.
 */
import { Agent, MCPServerSse, run } from "@openai/agents";

const techkern = new MCPServerSse({
  name: "techkern",
  url: "https://api.techkern.xyz/mcp",
});

const agent = new Agent({
  name: "solana-analyst",
  instructions:
    "You answer Solana on-chain questions using the techkern MCP tools. " +
    "Prefer query_solana_swaps for DEX activity, mint_authority_check before " +
    "saying any token is 'safe', and dev_token_history before vouching for a dev.",
  mcpServers: [techkern],
});

async function main() {
  await techkern.connect();
  const result = await run(
    agent,
    "What pump.fun launches in the last 30 minutes already crossed 50% bonding?"
  );
  // eslint-disable-next-line no-console
  console.log(result.finalOutput);
  await techkern.close();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
