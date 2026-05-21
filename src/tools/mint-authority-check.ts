/**
 * MCP tool: mint_authority_check
 *
 * Returns mint authority, freeze authority, and dev-renounced status.
 * Live read via Helius RPC — not cached.
 */
import { z } from "zod";
import { PublicKey } from "@solana/web3.js";
import { withFailover } from "../helius/rpc";
import { MintAuthority } from "../types";

export const inputSchema = z.object({
  mint: z.string().describe("SPL token mint address"),
});

export type Input = z.infer<typeof inputSchema>;

async function handler(input: Input): Promise<MintAuthority> {
  // Validate base58 up-front so we return a clean error to the agent.
  // eslint-disable-next-line no-new
  new PublicKey(input.mint);

  return withFailover(async (rpc) => {
    // helius-sdk exposes a thin wrapper around getAccountInfo + parsed data.
    const info = await rpc.rpc.getAccountInfo(new PublicKey(input.mint), "confirmed");
    const parsed = (info?.value as unknown as {
      data?: { parsed?: { info?: Record<string, unknown> } };
    })?.data?.parsed?.info;

    const mintAuthority = (parsed?.mintAuthority as string | null) ?? null;
    const freezeAuthority = (parsed?.freezeAuthority as string | null) ?? null;

    return {
      mint: input.mint,
      mintAuthority,
      freezeAuthority,
      decimals: Number(parsed?.decimals ?? 0),
      supply: String(parsed?.supply ?? "0"),
      isRenounced: mintAuthority === null && freezeAuthority === null,
    } satisfies MintAuthority;
  });
}

export const mintAuthorityCheck = {
  name: "mint_authority_check",
  description: "Get mint + freeze authority for an SPL token; flags dev-renounced.",
  inputSchema,
  handler,
};
