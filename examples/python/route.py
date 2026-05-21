import asyncio, os
from techkern_sdk import Techkern

async def main():
    k = Techkern(api_key=os.environ["TECHKERN_KEY"])
    r = await k.route(model="auto", messages=[{"role":"user","content":"Hi"}])
    print(r)

asyncio.run(main())
