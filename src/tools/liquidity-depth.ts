/**
 * MCP tool: liquidity_depth
 *
 * Aggregates Jupiter / Raydium / Orca / Meteora pool reserves into a
 * synthetic depth curve at +/- N bps from mid.
 */
import { z } from "zod";
import { query } from "../clickhouse/client";
import { SOL_MINT, USDC_MINT } from "../types";

export const inputSchema = z.object({
  baseMint: z.string().default(SOL_MINT),
  quoteMint: z.string().default(USDC_MINT),
  bpsLevels: z.array(z.number()).default([5, 10, 25, 50, 100, 250]),
});

export type Input = z.infer<typeof inputSchema>;

export interface DepthLevel {
  bps: number;
  bidUsd: number;
  askUsd: number;
}

async function handler(input: Input): Promise<DepthLevel[]> {
  const bpsList = input.bpsLevels.join(",");
  const sql = `
    WITH pools AS (
      SELECT dex, base_reserve, quote_reserve, mid_price
      FROM solana.pools_latest
      WHERE base_mint = {base:String} AND quote_mint = {quote:String}
    )
    SELECT bps,
           sum(bid_usd_at(base_reserve, quote_reserve, mid_price, bps)) AS bidUsd,
           sum(ask_usd_at(base_reserve, quote_reserve, mid_price, bps)) AS askUsd
    FROM pools
    ARRAY JOIN arrayMap(x -> x, [${bpsList}]) AS bps
    GROUP BY bps
    ORDER BY bps ASC
  `;
  return query<DepthLevel>(sql, { base: input.baseMint, quote: input.quoteMint });
}

export const liquidityDepth = {
  name: "liquidity_depth",
  description: "Aggregated DEX depth curve at +/- N bps from mid across Solana AMMs.",
  inputSchema,
  handler,
};
