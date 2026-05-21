import { RouteRequest, BackendInfo } from "../types";
export async function call_anyscale(req: RouteRequest): Promise<{ text: string; info: BackendInfo }> {
  // anyscale backend — TODO real HTTP client
  throw new Error("anyscale: not yet implemented");
}
