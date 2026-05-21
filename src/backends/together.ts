import { RouteRequest, BackendInfo } from "../types";
export async function call_together(req: RouteRequest): Promise<{ text: string; info: BackendInfo }> {
  // together backend — TODO real HTTP client
  throw new Error("together: not yet implemented");
}
