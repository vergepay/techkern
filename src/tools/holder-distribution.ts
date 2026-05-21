/**
 * MCP tool: holder_distribution
 *
 * Gini coefficient, top-N concentration %, holder-count history.
 */
import { z } from "zod";
import { query } from "../clickhouse/client";

export const inputSchema = z.object({
  mint: z.string().describe("SPL token mint address"),
  topN: z.array(z.number().int()).default([10, 50, 100]),
  historyDays: z.number().int().min(1).max(90).default(30),
});

export type Input = z.infer<typeof inputSchema>;

export interface DistributionResult {
  mint: string;
  gini: number;
  topNPct: Record<string, number>;
  uniqueHolders: number;
  history: { day: string; uniqueHolders: number }[];
}

async function handler(input: Input): Promise<DistributionResult> {
  const topNRows = await query<{ n: number; pct: number }>(
    `
    SELECT n, sum(pct) AS pct
    FROM solana.token_holders_latest
    ARRAY JOIN arrayMap(x -> x, [${input.topN.join(",")}]) AS n
    WHERE mint = {mint:String} AND rank <= n
    GROUP BY n
    `,
    { mint: input.mint }
  );

  const stats = await query<{ gini: number; uniqueHolders: number }>(
    `
    SELECT gini, unique_holders AS uniqueHolders
    FROM solana.token_distribution_stats
    WHERE mint = {mint:String}
    ORDER BY computed_at DESC LIMIT 1
    `,
    { mint: input.mint }
  );

  const history = await query<{ day: string; uniqueHolders: number }>(
    `
    SELECT toDate(computed_at) AS day, unique_holders AS uniqueHolders
    FROM solana.token_distribution_stats
    WHERE mint = {mint:String}
      AND computed_at >= now() - INTERVAL {d:UInt32} DAY
    ORDER BY day ASC
    `,
    { mint: input.mint, d: input.historyDays }
  );

  return {
    mint: input.mint,
    gini: stats[0]?.gini ?? 0,
    uniqueHolders: stats[0]?.uniqueHolders ?? 0,
    topNPct: Object.fromEntries(topNRows.map((r) => [String(r.n), r.pct])),
    history,
  };
}

export const holderDistribution = {
  name: "holder_distribution",
  description: "Gini coefficient + top-N concentration + holder history for an SPL token.",
  inputSchema,
  handler,
};
