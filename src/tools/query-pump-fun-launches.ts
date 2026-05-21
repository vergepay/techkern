/**
 * MCP tool: query_pump_fun_launches
 *
 * New pump.fun mints with bonding-curve progress.
 */
import { z } from "zod";
import { query } from "../clickhouse/client";
import { PumpLaunch } from "../types";

export const inputSchema = z.object({
  creator: z.string().optional().describe("Filter by dev wallet"),
  minMcapUsd: z.number().optional().default(0),
  minBondingPct: z.number().min(0).max(100).optional().default(0),
  from: z.string().optional(),
  to: z.string().optional(),
  limit: z.number().int().min(1).max(500).default(50),
});

export type Input = z.infer<typeof inputSchema>;

async function handler(input: Input): Promise<PumpLaunch[]> {
  const filters = [
    "market_cap_usd >= {minMcap:Float64}",
    "bonding_progress_pct >= {minBondingPct:Float64}",
  ];
  if (input.creator) filters.push("creator = {creator:String}");
  if (input.from) filters.push("created_at >= parseDateTimeBestEffort({from:String})");
  if (input.to) filters.push("created_at <= parseDateTimeBestEffort({to:String})");

  const sql = `
    SELECT mint, creator, name, symbol,
           toUnixTimestamp(created_at) AS createdAt,
           bonding_progress_pct AS bondingProgressPct,
           market_cap_usd AS marketCapUsd
    FROM solana.pumpfun_launches
    WHERE ${filters.join(" AND ")}
    ORDER BY created_at DESC
    LIMIT {limit:UInt32}
  `;

  return query<PumpLaunch>(sql, {
    minMcap: input.minMcapUsd ?? 0,
    minBondingPct: input.minBondingPct ?? 0,
    creator: input.creator ?? "",
    from: input.from ?? "",
    to: input.to ?? "",
    limit: input.limit,
  });
}

export const queryPumpFunLaunches = {
  name: "query_pump_fun_launches",
  description: "Query pump.fun launches with creator / market-cap / bonding filters.",
  inputSchema,
  handler,
};
