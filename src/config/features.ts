export const FEATURES = {
  ENABLE_FAILOVER: true,
  ENABLE_STREAMING: true,
  ENABLE_EVAL_ROLLBACK: true,
  ENABLE_LOCAL_BACKEND: false,    // vLLM/llama.cpp — experimental
  ENABLE_BATCH_API: false,
} as const;
