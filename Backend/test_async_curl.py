# test_async_curl.py
from curl_cffi.requests import AsyncSession
import asyncio
import time

async def main():
    start = time.time()
    async with AsyncSession() as session:
        try:
            response = await session.get(
                "https://api.jikan.moe/v4/anime?q=naruto",
                timeout=10.0,
                impersonate="chrome"
            )
            print(f"Status: {response.status_code}")
            print(f"Took: {time.time() - start:.2f}s")
        except Exception as e:
            print(f"Failed after {time.time() - start:.2f}s: {type(e).__name__}: {e}")

asyncio.run(main())