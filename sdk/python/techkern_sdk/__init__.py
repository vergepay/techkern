"""Techkern Python SDK — GPU inference routing."""
import httpx

class Techkern:
    def __init__(self, api_key: str, base_url: str = "https://api.techkern.xyz"):
        self.api_key = api_key
        self.base_url = base_url
        self._client = httpx.AsyncClient()

    async def route(self, **kwargs):
        r = await self._client.post(
            f"{self.base_url}/v1/route",
            headers={"Authorization": f"Bearer {self.api_key}"},
            json=kwargs,
        )
        r.raise_for_status()
        return r.json()
