/**
 * MCP tool: new_token_alerts
 *
 * One-shot poll of new mints matching the filter. Live subscriptions are
 * exposed separately as `subscribe.solana.new_mint` over the WS stream.
 */
import { z } from "zod";
import { query } from "../clickhouse/client";

export const inputSchema = z.object({
  source: z.enum(["pumpfun", "raydium-clmm", "any"]).default("any"),
  minLpUsd: z.number().default(0),
  symbolRegex: z.string().optional().describe("PCRE on token symbol — e.g. '^(BABY|MOON)' "),
  windowMinutes: z.number().int().min(1).max(1440).default(15),
  limit: z.number().int().min(1).max(500).default(100),
});

export type Input = z.infer<typeof inputSchema>;

export interface NewMint {
  mint: string;
  symbol: string;
  name: string;
  source: string;
  lpUsd: number;
  createdAt: number;
}

async function handler(input: Input): Promise<NewMint[]> {
  const filters = ["created_at >= now() - INTERVAL {win:UInt32} MINUTE", "lp_usd >= {minLp:Float64}"];
  if (input.source !== "any") filters.push("source = {source:String}");
  if (input.symbolRegex) filters.push("match(symbol, {sx:String})");

  const sql = `
    SELECT mint, symbol, name, source, lp_usd AS lpUsd,
           toUnixTimestamp(created_at) AS createdAt
    FROM solana.new_mints
    WHERE ${filters.join(" AND ")}
    ORDER BY created_at DESC
    LIMIT {limit:UInt32}
  `;

  return query<NewMint>(sql, {
    win: input.windowMinutes,
    minLp: input.minLpUsd,
    source: input.source,
    sx: input.symbolRegex ?? "",
    limit: input.limit,
  });
}

export const newTokenAlerts = {
  name: "new_token_alerts",
  description: "Poll new Solana mints in the last N minutes; pair with WS subscription for live.",
  inputSchema,
  handler,
};
