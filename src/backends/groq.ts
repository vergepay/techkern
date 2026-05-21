import { RouteRequest, BackendInfo } from "../types";
export async function call_groq(req: RouteRequest): Promise<{ text: string; info: BackendInfo }> {
  // groq backend — TODO real HTTP client
  throw new Error("groq: not yet implemented");
}
