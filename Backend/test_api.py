import asyncio
import httpx
import uuid

BASE_URL = "http://127.0.0.1:8000"

async def test_api():
    print("Starting End-to-End API Test...")
    
    async with httpx.AsyncClient(base_url=BASE_URL, timeout=30.0) as client:
        # 1. Health Check
        print("\n--- 1. Testing Health Check ---")
        res = await client.get("/health")
        print(f"Status: {res.status_code}, Body: {res.json()}")
        assert res.status_code == 200, "Health check failed"

        # 2. Register User
        print("\n--- 2. Testing Registration ---")
        random_suffix = str(uuid.uuid4())[:8]
        user_data = {
            "email": f"testuser_{random_suffix}@example.com",
            "username": f"testuser_{random_suffix}",
            "password": "strongpassword123"
        }
        res = await client.post("/auth/register", json=user_data)
        print(f"Status: {res.status_code}, Body: {res.json()}")
        assert res.status_code == 201, "Registration failed"

        # 3. Login
        print("\n--- 3. Testing Login ---")
        login_data = {
            "username": user_data["username"],
            "password": user_data["password"]
        }
        res = await client.post("/auth/login", data=login_data)
        print(f"Status: {res.status_code}, Body: {res.json()}")
        assert res.status_code == 200, "Login failed"
        token = res.json()["access_token"]
        
        headers = {"Authorization": f"Bearer {token}"}

        # 4. Get Current User
        print("\n--- 4. Testing /auth/me ---")
        res = await client.get("/auth/me", headers=headers)
        print(f"Status: {res.status_code}, Body: {res.json()}")
        assert res.status_code == 200, "/auth/me failed"

        # 5. Search Anime
        print("\n--- 5. Testing Anime Search ---")
        res = await client.get("/anime/search?q=naruto&page=1")
        print(f"Status: {res.status_code}")
        assert res.status_code == 200, "Anime search failed"
        anime_id = res.json()["data"][0]["mal_id"]
        print(f"Found Anime ID: {anime_id} ({res.json()['data'][0]['title']})")

        # 6. Add Anime to List
        print(f"\n--- 6. Testing Add to List (Anime ID: {anime_id}) ---")
        entry_data = {
            "status": "Watching",
            "rating": 8,
            "progress": 5,
            "notes": "Testing the API!"
        }
        res = await client.post(f"/entries/{anime_id}", json=entry_data, headers=headers)
        print(f"Status: {res.status_code}, Body: {res.json()}")
        assert res.status_code == 201, "Add to list failed"

        # 7. Get User Entries
        print("\n--- 7. Testing Get User List ---")
        res = await client.get("/entries", headers=headers)
        print(f"Status: {res.status_code}, Entries Count: {len(res.json())}")
        assert res.status_code == 200, "Get entries failed"
        
        # 8. Update Entry
        print("\n--- 8. Testing Update Entry ---")
        update_data = {"progress": 10, "rating": 9}
        res = await client.patch(f"/entries/{anime_id}", json=update_data, headers=headers)
        print(f"Status: {res.status_code}, Body: {res.json()}")
        assert res.status_code == 200, "Update entry failed"

        # 9. Get User Stats
        print("\n--- 9. Testing User Stats ---")
        res = await client.get("/users/me/stats", headers=headers)
        print(f"Status: {res.status_code}, Body: {res.json()}")
        assert res.status_code == 200, "User stats failed"

        # 10. Delete Entry
        print("\n--- 10. Testing Delete Entry ---")
        res = await client.delete(f"/entries/{anime_id}", headers=headers)
        print(f"Status: {res.status_code}")
        assert res.status_code == 204, "Delete entry failed"
        
        print("\nAll tests passed successfully! The API is rock solid.")

if __name__ == "__main__":
    asyncio.run(test_api())
