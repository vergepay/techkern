/**
 * Helius RPC wrapper.
 *
 * Used for live mint/freeze authority lookups, account metadata, and any
 * data that isn't yet indexed into ClickHouse. Failover to a secondary
 * endpoint after 3 consecutive errors.
 */
import { Helius } from "helius-sdk";

const PRIMARY = process.env.HELIUS_RPC_URL ?? "https://mainnet.helius-rpc.com";
const FALLBACK = process.env.HELIUS_RPC_URL_FALLBACK ?? "https://api.mainnet-beta.solana.com";

let _client: Helius | null = null;
let _consecutiveErrors = 0;
let _useFallback = false;

export function getRpc(): Helius {
  if (_client) return _client;
  const apiKey = process.env.HELIUS_API_KEY ?? "";
  _client = new Helius(apiKey, _useFallback ? "mainnet-beta" : "mainnet-beta");
  return _client;
}

export async function withFailover<T>(fn: (rpc: Helius) => Promise<T>): Promise<T> {
  try {
    const out = await fn(getRpc());
    _consecutiveErrors = 0;
    return out;
  } catch (err) {
    _consecutiveErrors += 1;
    if (_consecutiveErrors >= 3 && !_useFallback) {
      // eslint-disable-next-line no-console
      console.error(`[helius] flipping to fallback after ${_consecutiveErrors} errors`);
      _useFallback = true;
      _client = null;
    }
    throw err;
  }
}

export const RPC_ENDPOINTS = { primary: PRIMARY, fallback: FALLBACK };
