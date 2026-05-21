import { RouteRequest, BackendInfo } from "../types";
export async function call_fireworks(req: RouteRequest): Promise<{ text: string; info: BackendInfo }> {
  // fireworks backend — TODO real HTTP client
  throw new Error("fireworks: not yet implemented");
}
