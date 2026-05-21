/**
 * MCP tool: query_token_holders
 *
 * Top N holders + ranking for any SPL token.
 */
import { z } from "zod";
import { query } from "../clickhouse/client";
import { TokenHolder } from "../types";

export const inputSchema = z.object({
  mint: z.string().describe("SPL token mint address"),
  topN: z.number().int().min(1).max(1000).default(50),
});

export type Input = z.infer<typeof inputSchema>;

async function handler(input: Input): Promise<TokenHolder[]> {
  const sql = `
    SELECT wallet,
           toString(amount) AS amount,
           pct,
           rank
    FROM solana.token_holders_latest
    WHERE mint = {mint:String}
    ORDER BY rank ASC
    LIMIT {topN:UInt32}
  `;
  return query<TokenHolder>(sql, { mint: input.mint, topN: input.topN });
}

export const queryTokenHolders = {
  name: "query_token_holders",
  description: "Top-N holder distribution for an SPL token (current snapshot).",
  inputSchema,
  handler,
};
