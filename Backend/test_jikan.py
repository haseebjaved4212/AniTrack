import httpx
import asyncio

async def test():
    urls = [
        "https://api.jikan.moe/v4/anime?q=One+Piece",
        "https://api.jikan.moe/v4/anime?q=Bleach",
        "https://api.jikan.moe/v4/anime?q=naruto"
    ]
    async with httpx.AsyncClient() as client:
        for url in urls:
            print(f"Testing {url}")
            try:
                response = await client.get(url, timeout=10)
                print("Status code:", response.status_code)
                print("Response:", response.text[:100])
            except Exception as e:
                print("Error:", e)

if __name__ == "__main__":
    asyncio.run(test())
