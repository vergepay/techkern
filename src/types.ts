/**
 * Common types shared across MCP tool handlers.
 */

export type SolanaAddress = string;

export interface MCPToolDefinition<I, O> {
  name: string;
  description: string;
  inputSchema: unknown; // JSON Schema or Zod
  handler: (input: I) => Promise<O>;
}

export interface QueryWindow {
  /** ISO timestamp or "now-1h", "now-24h", etc. */
  from?: string;
  to?: string;
  limit?: number;
}

export interface Swap {
  signature: string;
  slot: number;
  blockTime: number;
  dex: "jupiter" | "raydium" | "orca" | "meteora";
  inputMint: SolanaAddress;
  outputMint: SolanaAddress;
  inputAmount: string;
  outputAmount: string;
  usdValue: number;
  wallet: SolanaAddress;
}

export interface TokenHolder {
  wallet: SolanaAddress;
  amount: string;
  pct: number;
  rank: number;
}

export interface KOLWallet {
  wallet: SolanaAddress;
  handle?: string;
  pnl30dUsd: number;
  winRate: number;
  lastTradeAt: number;
}

export interface MintAuthority {
  mint: SolanaAddress;
  mintAuthority: SolanaAddress | null;
  freezeAuthority: SolanaAddress | null;
  decimals: number;
  supply: string;
  isRenounced: boolean;
}

export interface PumpLaunch {
  mint: SolanaAddress;
  creator: SolanaAddress;
  name: string;
  symbol: string;
  createdAt: number;
  bondingProgressPct: number;
  marketCapUsd: number;
}

// Well-known mints used as defaults / examples
export const SOL_MINT: SolanaAddress = "So11111111111111111111111111111111111111112";
export const USDC_MINT: SolanaAddress = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
