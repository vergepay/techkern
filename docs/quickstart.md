# Quickstart
Drop-in replacement for your existing OpenAI / Anthropic / Groq SDK.

## 5-minute setup
1. `npm i @techkern/sdk`
2. Set `TECHKERN_KEY` env var
3. Replace your client init with `new Techkern({ apiKey })`
4. Call `.route()` instead of `.chat.completions.create()`
5. Watch the bill go down

See [API reference](./api-reference.md) for full options.
