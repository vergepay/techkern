export type Provider = "groq" | "together" | "lambda" | "fireworks" | "anyscale" | "openai" | "anthropic";

export interface RouteRequest {
  model: "auto" | string;
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  qualityFloor?: number;
  region?: "us" | "eu" | "auto";
}

export interface BackendInfo {
  provider: Provider;
  model: string;
  cost: number;
  latencyMs: number;
}

export interface RouteResponse {
  text: string;
  routedTo: BackendInfo;
  totalCostUsd: number;
}
