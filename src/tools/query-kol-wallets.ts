/**
 * MCP tool: query_kol_wallets
 *
 * KOL wallet tracker — 1,400+ tracked Solana wallets with 30d PnL.
 */
import { z } from "zod";
import { query } from "../clickhouse/client";
import { KOLWallet } from "../types";

export const inputSchema = z.object({
  minPnl30d: z.number().optional().default(0).describe("Min 30-day realized PnL in USD"),
  minWinRate: z.number().min(0).max(1).optional().default(0),
  recentBuyMint: z.string().optional().describe("Filter to KOLs who bought this mint in last 24h"),
  limit: z.number().int().min(1).max(500).default(100),
});

export type Input = z.infer<typeof inputSchema>;

async function handler(input: Input): Promise<KOLWallet[]> {
  const filters = ["pnl_30d_usd >= {minPnl:Float64}", "win_rate >= {minWin:Float64}"];
  if (input.recentBuyMint) {
    filters.push(
      `wallet IN (
        SELECT wallet FROM solana.swaps
        WHERE output_mint = {recentMint:String}
          AND block_time >= now() - INTERVAL 24 HOUR
      )`
    );
  }

  const sql = `
    SELECT wallet, handle, pnl_30d_usd AS pnl30dUsd,
           win_rate AS winRate,
           toUnixTimestamp(last_trade_at) AS lastTradeAt
    FROM solana.kol_wallets
    WHERE ${filters.join(" AND ")}
    ORDER BY pnl_30d_usd DESC
    LIMIT {limit:UInt32}
  `;

  return query<KOLWallet>(sql, {
    minPnl: input.minPnl30d ?? 0,
    minWin: input.minWinRate ?? 0,
    recentMint: input.recentBuyMint ?? "",
    limit: input.limit,
  });
}

export const queryKolWallets = {
  name: "query_kol_wallets",
  description: "Query KOL wallet tracker with PnL + recent-buy filters.",
  inputSchema,
  handler,
};
