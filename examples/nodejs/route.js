import { Techkern } from "@techkern/sdk";
const k = new Techkern({ apiKey: process.env.TECHKERN_KEY });
const r = await k.route({ model: "auto", messages: [{ role: "user", content: "Hi" }] });
console.log(r.text, r.routedTo);
