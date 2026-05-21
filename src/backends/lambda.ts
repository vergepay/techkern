import { RouteRequest, BackendInfo } from "../types";
export async function call_lambda(req: RouteRequest): Promise<{ text: string; info: BackendInfo }> {
  // lambda backend — TODO real HTTP client
  throw new Error("lambda: not yet implemented");
}
