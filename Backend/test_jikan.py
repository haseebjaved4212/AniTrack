# test_jikan.py
import httpx
import time

start = time.time()
try:
    response = httpx.get(
        "https://api.jikan.moe/v4/anime?q=naruto",
        timeout=10.0,
        headers={"User-Agent": "Mozilla/5.0 (AniTrack-Dev/1.0)"}
    )
    print(f"Status: {response.status_code}")
    print(f"Took: {time.time() - start:.2f}s")
except Exception as e:
    print(f"Failed after {time.time() - start:.2f}s: {e}")