# AniTrack

AniTrack is a full-stack web application designed for tracking your anime journey. It allows users to search for anime, add them to their personal list, track progress, rate them, and view their statistics with beautiful visual charts.

This project uses the [Jikan API](https://jikan.moe/) to fetch up-to-date anime metadata.

## Tech Stack

### Frontend
- **Framework**: Next.js 14/15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching**: TanStack React Query
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL (via SQLAlchemy & asyncpg)
- **Caching**: Redis
- **Authentication**: JWT (JSON Web Tokens) with HTTP-Only Cookies

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- PostgreSQL installed and running
- Redis installed and running

---

### Backend Setup

1. **Navigate to the Backend directory:**
   ```bash
   cd Backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables:**
   Create a `.env` file in the `Backend` folder with your database/redis credentials and JWT secret:
   ```env
   DATABASE_URL=postgresql+asyncpg://user:password@localhost/anitrack
   REDIS_URL=redis://localhost:6379/0
   SECRET_KEY=your_super_secret_key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=10080
   ```

5. **Run Database Migrations:**
   ```bash
   alembic upgrade head
   ```

6. **Start the FastAPI Server:**
   ```bash
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```

---

### Frontend Setup

1. **Navigate to the Frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the `frontend` folder:
   ```env
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
   ```

4. **Start the Next.js Development Server:**
   ```bash
   npm run dev
   ```

5. **Open the App:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Features & Highlights

- **HTTP-Only Cookie Authentication**: JWTs are securely handled by the Next.js proxy route, ensuring tokens are never exposed to client-side JavaScript.
- **Optimistic UI Updates**: Marking an anime as completed instantly updates the UI before the server even responds, creating a blazing fast experience.
- **CORS Bypass**: The Next.js API proxy (`/api/proxy/[...path]`) seamlessly bridges the gap between the frontend and FastAPI backend, eliminating CORS issues entirely.
- **Debounced Search**: Typing in the search bar utilizes a custom debounce hook to avoid rate-limiting the Jikan API.
- **Beautiful Skeletons & Toasts**: High quality UX elements built-in!
