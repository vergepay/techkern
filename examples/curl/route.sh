#!/bin/bash
curl -X POST https://api.techkern.xyz/v1/route \
  -H "Authorization: Bearer $TECHKERN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"auto","messages":[{"role":"user","content":"Hi"}]}'
