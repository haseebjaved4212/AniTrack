# AniTrack Backend API

The AniTrack backend is a high-performance, asynchronous REST API built with FastAPI, PostgreSQL, and Redis. It acts as the engine for tracking anime, pulling metadata directly from the Jikan API (MyAnimeList), and managing user accounts with JWT-based authentication.

## 🚀 Tech Stack
- **Framework**: FastAPI (Python 3.9+)
- **Database**: PostgreSQL (via asyncpg & SQLAlchemy)
- **Migrations**: Alembic
- **Caching**: Redis
- **Security**: JWT (python-jose), Password Hashing (bcrypt)
- **External Data**: [Jikan API v4](https://jikan.moe/)

---

## 🛠️ Local Setup Instructions

### 1. Prerequisites
You must have the following installed on your machine:
- Python 3.9+
- PostgreSQL server (running locally)
- Redis server (running locally on default port 6379)

### 2. Environment Variables
Create a `.env` file in the `Backend` directory with the following keys:
```ini
DATABASE_URL="postgresql+asyncpg://postgres:password@localhost:5432/anitrack"
REDIS_URL="redis://localhost:6379/0"
SECRET_KEY="your-super-secret-jwt-key"
```

### 3. Installation
Navigate into the `Backend` directory and set up your virtual environment:
```bash
cd Backend
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate
# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 4. Database Migrations
Initialize your PostgreSQL database tables using Alembic:
```bash
alembic upgrade head
```

### 5. Run the Server
Start the FastAPI development server:
```bash
uvicorn app.main:app --reload
```
The server will start at `http://127.0.0.1:8000`. You can view the interactive documentation at `http://127.0.0.1:8000/docs`.

---

## 📚 API Endpoints

### Health & Polish
- `GET /health` - Check database and Redis connection status.

### Authentication (`/auth`)
- `POST /auth/register` - Create a new user account.
  - **Payload**: `{"email": "user@example.com", "username": "user1", "password": "password123"}`
- `POST /auth/login` - Authenticate and receive a JWT token.
  - **Payload**: `username=user1&password=password123` (Form Data)
- `GET /auth/me` - (Protected) Get current logged-in user profile.

### Anime Search (`/anime`)
*(Responses are cached in Redis to prevent Jikan rate-limiting)*
- `GET /anime/search?q={query}&page={page}` - Search for anime.
- `GET /anime/{mal_id}` - Get specific anime details.

### User Entries (`/entries`)
*(All endpoints are Protected)*
- `POST /entries/{mal_id}` - Add an anime to your list.
  - **Payload**: `{"status": "Watching", "rating": 9, "progress": 12, "notes": "Great so far!"}`
- `GET /entries?status=Completed&skip=0&limit=50` - Get your anime list with optional pagination/filtering.
- `PATCH /entries/{mal_id}` - Update your progress/rating/status.
  - **Payload**: `{"progress": 13}`
- `DELETE /entries/{mal_id}` - Remove an anime from your list.

### User Stats (`/users`)
*(Protected)*
- `GET /users/me/stats` - Get your aggregated statistics (total anime, episodes watched, average rating, status breakdown).
