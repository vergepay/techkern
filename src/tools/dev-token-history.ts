/**
 * MCP tool: dev_token_history
 *
 * Every SPL mint ever created by a wallet — used to surface serial ruggers.
 */
import { z } from "zod";
import { query } from "../clickhouse/client";

export const inputSchema = z.object({
  wallet: z.string().describe("Creator / deployer wallet"),
  includeDead: z.boolean().default(true),
  limit: z.number().int().min(1).max(500).default(200),
});

export type Input = z.infer<typeof inputSchema>;

export interface DevToken {
  mint: string;
  symbol: string;
  name: string;
  deployedAt: number;
  peakMcapUsd: number;
  currentMcapUsd: number;
  rugged: boolean;
}

async function handler(input: Input): Promise<DevToken[]> {
  const sql = `
    SELECT mint, symbol, name,
           toUnixTimestamp(deployed_at) AS deployedAt,
           peak_mcap_usd AS peakMcapUsd,
           current_mcap_usd AS currentMcapUsd,
           rugged
    FROM solana.dev_token_history
    WHERE creator = {wallet:String}
      ${input.includeDead ? "" : "AND rugged = 0"}
    ORDER BY deployed_at DESC
    LIMIT {limit:UInt32}
  `;
  return query<DevToken>(sql, { wallet: input.wallet, limit: input.limit });
}

export const devTokenHistory = {
  name: "dev_token_history",
  description: "List every SPL mint ever deployed by a wallet (with rug flag).",
  inputSchema,
  handler,
};
