# test_curl_cffi.py
from curl_cffi import requests as curl_requests
import time

start = time.time()
try:
    response = curl_requests.get(
        "https://api.jikan.moe/v4/anime?q=naruto",
        timeout=10.0,
        impersonate="chrome"
    )
    print(f"Status: {response.status_code}")
    print(f"Took: {time.time() - start:.2f}s")
except Exception as e:
    print(f"Failed after {time.time() - start:.2f}s: {e}")