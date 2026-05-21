/**
 * techkern — MCP server for Solana
 *
 * Entry point. Wires the MCP gateway and registers all tool handlers.
 */
import { startServer } from "./server";

export { startServer };
export * from "./types";

if (require.main === module) {
  startServer().catch((err) => {
    // eslint-disable-next-line no-console
    console.error("[techkern] fatal:", err);
    process.exit(1);
  });
}
