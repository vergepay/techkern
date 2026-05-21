/**
 * MCP tool: whale_tracker
 *
 * Large swaps > N USD with wallet attribution + KOL flag.
 */
import { z } from "zod";
import { query, timeWindowSql } from "../clickhouse/client";
import { Swap } from "../types";

export const inputSchema = z.object({
  minUsd: z.number().default(50_000).describe("Min swap notional in USD"),
  mint: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  limit: z.number().int().min(1).max(500).default(100),
});

export type Input = z.infer<typeof inputSchema>;

export interface WhaleSwap extends Swap {
  isKol: boolean;
}

async function handler(input: Input): Promise<WhaleSwap[]> {
  const filters = ["usd_value >= {minUsd:Float64}"];
  if (input.mint) filters.push("(input_mint = {mint:String} OR output_mint = {mint:String})");

  const sql = `
    SELECT s.signature, s.slot, toUnixTimestamp(s.block_time) AS blockTime,
           s.dex, s.input_mint AS inputMint, s.output_mint AS outputMint,
           s.input_amount AS inputAmount, s.output_amount AS outputAmount,
           s.usd_value AS usdValue, s.wallet,
           if(k.wallet != '', 1, 0) AS isKol
    FROM solana.swaps s
    LEFT JOIN solana.kol_wallets k ON k.wallet = s.wallet
    WHERE ${filters.join(" AND ")} ${timeWindowSql(input.from, input.to)}
    ORDER BY s.block_time DESC
    LIMIT {limit:UInt32}
  `;

  return query<WhaleSwap>(sql, {
    minUsd: input.minUsd,
    mint: input.mint ?? "",
    limit: input.limit,
  });
}

export const whaleTracker = {
  name: "whale_tracker",
  description: "Stream of large swaps over a USD threshold, with KOL attribution.",
  inputSchema,
  handler,
};
