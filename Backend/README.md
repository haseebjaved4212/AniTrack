# AniTrack Backend API

The AniTrack backend is a high-performance, asynchronous REST API built with FastAPI, PostgreSQL, and Redis. It acts as the engine for tracking anime, pulling metadata directly from the Jikan API (MyAnimeList), and managing user accounts with JWT-based authentication.

##  Tech Stack
- **Framework**: FastAPI (Python 3.9+)
- **Database**: PostgreSQL (via asyncpg & SQLAlchemy)
- **Migrations**: Alembic
- **Caching**: Redis
- **Security**: JWT (python-jose), Password Hashing (bcrypt)
- **External Data**: [Jikan API v4](https://jikan.moe/)

---

##  Local Setup Instructions

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

##  API Endpoints

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
---

## Backend Folder Structure

```
Backend/
├── alembic/
│   ├── versions/
│   │   └── c5aa472e96e1_initial_migration.py
│   ├── env.py
│   └── script.py.mako
├── app/
│   ├── api/
│   │   ├── __init__.py
│   │   ├── anime.py
│   │   ├── auth.py
│   │   ├── deps.py
│   │   ├── entries.py
│   │   └── users.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   └── security.py
│   ├── db/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── redis.py
│   │   └── session.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── anime.py
│   │   ├── entry.py
│   │   └── user.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── anime.py
│   │   ├── entry.py
│   │   ├── stats.py
│   │   ├── token.py
│   │   └── user.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── entry.py
│   │   ├── jikan.py
│   │   └── user.py
│   ├── __init__.py
│   └── main.py
├── venv/
│   ├── Include/
│   │   └── site/
│   │       └── python3.14/
│   │           └── greenlet/
│   │               └── greenlet.h
│   ├── Lib/
│   │   └── site-packages/
│   │       ├── _yaml/
│   │       │   └── __init__.py
│   │       ├── alembic/
│   │       │   ├── autogenerate/
│   │       │   │   ├── compare/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── comments.py
│   │       │   │   │   ├── constraints.py
│   │       │   │   │   ├── schema.py
│   │       │   │   │   ├── server_defaults.py
│   │       │   │   │   ├── tables.py
│   │       │   │   │   ├── types.py
│   │       │   │   │   └── util.py
│   │       │   │   ├── __init__.py
│   │       │   │   ├── api.py
│   │       │   │   ├── render.py
│   │       │   │   └── rewriter.py
│   │       │   ├── ddl/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── _autogen.py
│   │       │   │   ├── base.py
│   │       │   │   ├── impl.py
│   │       │   │   ├── mssql.py
│   │       │   │   ├── mysql.py
│   │       │   │   ├── oracle.py
│   │       │   │   ├── postgresql.py
│   │       │   │   └── sqlite.py
│   │       │   ├── operations/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── base.py
│   │       │   │   ├── batch.py
│   │       │   │   ├── ops.py
│   │       │   │   ├── schemaobj.py
│   │       │   │   └── toimpl.py
│   │       │   ├── runtime/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── environment.py
│   │       │   │   ├── migration.py
│   │       │   │   └── plugins.py
│   │       │   ├── script/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── base.py
│   │       │   │   ├── revision.py
│   │       │   │   └── write_hooks.py
│   │       │   ├── templates/
│   │       │   │   ├── async/
│   │       │   │   │   ├── alembic.ini.mako
│   │       │   │   │   ├── env.py
│   │       │   │   │   ├── README
│   │       │   │   │   └── script.py.mako
│   │       │   │   ├── generic/
│   │       │   │   │   ├── alembic.ini.mako
│   │       │   │   │   ├── env.py
│   │       │   │   │   ├── README
│   │       │   │   │   └── script.py.mako
│   │       │   │   ├── multidb/
│   │       │   │   │   ├── alembic.ini.mako
│   │       │   │   │   ├── env.py
│   │       │   │   │   ├── README
│   │       │   │   │   └── script.py.mako
│   │       │   │   ├── pyproject/
│   │       │   │   │   ├── alembic.ini.mako
│   │       │   │   │   ├── env.py
│   │       │   │   │   ├── pyproject.toml.mako
│   │       │   │   │   ├── README
│   │       │   │   │   └── script.py.mako
│   │       │   │   └── pyproject_async/
│   │       │   │       ├── alembic.ini.mako
│   │       │   │       ├── env.py
│   │       │   │       ├── pyproject.toml.mako
│   │       │   │       ├── README
│   │       │   │       └── script.py.mako
│   │       │   ├── testing/
│   │       │   │   ├── plugin/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   └── bootstrap.py
│   │       │   │   ├── suite/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── _autogen_fixtures.py
│   │       │   │   │   ├── test_autogen_comments.py
│   │       │   │   │   ├── test_autogen_computed.py
│   │       │   │   │   ├── test_autogen_diffs.py
│   │       │   │   │   ├── test_autogen_fks.py
│   │       │   │   │   ├── test_autogen_identity.py
│   │       │   │   │   ├── test_environment.py
│   │       │   │   │   └── test_op.py
│   │       │   │   ├── __init__.py
│   │       │   │   ├── assertions.py
│   │       │   │   ├── env.py
│   │       │   │   ├── fixtures.py
│   │       │   │   ├── requirements.py
│   │       │   │   ├── schemacompare.py
│   │       │   │   ├── util.py
│   │       │   │   └── warnings.py
│   │       │   ├── util/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── compat.py
│   │       │   │   ├── editor.py
│   │       │   │   ├── exc.py
│   │       │   │   ├── langhelpers.py
│   │       │   │   ├── messaging.py
│   │       │   │   ├── pyfiles.py
│   │       │   │   └── sqla_compat.py
│   │       │   ├── __init__.py
│   │       │   ├── __main__.py
│   │       │   ├── command.py
│   │       │   ├── config.py
│   │       │   ├── context.py
│   │       │   ├── context.pyi
│   │       │   ├── environment.py
│   │       │   ├── migration.py
│   │       │   ├── op.py
│   │       │   ├── op.pyi
│   │       │   └── py.typed
│   │       ├── alembic-1.18.5.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE
│   │       │   ├── entry_points.txt
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   ├── REQUESTED
│   │       │   ├── top_level.txt
│   │       │   └── WHEEL
│   │       ├── annotated_doc/
│   │       │   ├── __init__.py
│   │       │   ├── main.py
│   │       │   └── py.typed
│   │       ├── annotated_doc-0.0.5.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE
│   │       │   ├── entry_points.txt
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   └── WHEEL
│   │       ├── annotated_types/
│   │       │   ├── __init__.py
│   │       │   ├── py.typed
│   │       │   └── test_cases.py
│   │       ├── annotated_types-0.8.0.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   └── WHEEL
│   │       ├── anyio/
│   │       │   ├── _backends/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── _asyncio.py
│   │       │   │   └── _trio.py
│   │       │   ├── _core/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── _asyncio_selector_thread.py
│   │       │   │   ├── _contextmanagers.py
│   │       │   │   ├── _eventloop.py
│   │       │   │   ├── _exceptions.py
│   │       │   │   ├── _fileio.py
│   │       │   │   ├── _resources.py
│   │       │   │   ├── _signals.py
│   │       │   │   ├── _sockets.py
│   │       │   │   ├── _streams.py
│   │       │   │   ├── _subprocesses.py
│   │       │   │   ├── _synchronization.py
│   │       │   │   ├── _tasks.py
│   │       │   │   ├── _tempfile.py
│   │       │   │   ├── _testing.py
│   │       │   │   └── _typedattr.py
│   │       │   ├── abc/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── _eventloop.py
│   │       │   │   ├── _resources.py
│   │       │   │   ├── _sockets.py
│   │       │   │   ├── _streams.py
│   │       │   │   ├── _subprocesses.py
│   │       │   │   ├── _tasks.py
│   │       │   │   └── _testing.py
│   │       │   ├── streams/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── buffered.py
│   │       │   │   ├── file.py
│   │       │   │   ├── memory.py
│   │       │   │   ├── stapled.py
│   │       │   │   ├── text.py
│   │       │   │   └── tls.py
│   │       │   ├── __init__.py
│   │       │   ├── from_thread.py
│   │       │   ├── functools.py
│   │       │   ├── itertools.py
│   │       │   ├── lowlevel.py
│   │       │   ├── py.typed
│   │       │   ├── pytest_plugin.py
│   │       │   ├── to_interpreter.py
│   │       │   ├── to_process.py
│   │       │   └── to_thread.py
│   │       ├── anyio-4.14.2.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE
│   │       │   ├── entry_points.txt
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   ├── scm_file_list.json
│   │       │   ├── scm_version.json
│   │       │   ├── top_level.txt
│   │       │   └── WHEEL
│   │       ├── asyncpg/
│   │       │   ├── _testbase/
│   │       │   │   ├── __init__.py
│   │       │   │   └── fuzzer.py
│   │       │   ├── exceptions/
│   │       │   │   ├── __init__.py
│   │       │   │   └── _base.py
│   │       │   ├── pgproto/
│   │       │   │   ├── codecs/
│   │       │   │   │   ├── __init__.pxd
│   │       │   │   │   ├── bits.pyx
│   │       │   │   │   ├── bytea.pyx
│   │       │   │   │   ├── context.pyx
│   │       │   │   │   ├── datetime.pyx
│   │       │   │   │   ├── float.pyx
│   │       │   │   │   ├── geometry.pyx
│   │       │   │   │   ├── hstore.pyx
│   │       │   │   │   ├── int.pyx
│   │       │   │   │   ├── json.pyx
│   │       │   │   │   ├── jsonpath.pyx
│   │       │   │   │   ├── misc.pyx
│   │       │   │   │   ├── network.pyx
│   │       │   │   │   ├── numeric.pyx
│   │       │   │   │   ├── pg_snapshot.pyx
│   │       │   │   │   ├── text.pyx
│   │       │   │   │   ├── tid.pyx
│   │       │   │   │   └── uuid.pyx
│   │       │   │   ├── __init__.pxd
│   │       │   │   ├── __init__.py
│   │       │   │   ├── buffer.pxd
│   │       │   │   ├── buffer.pxi
│   │       │   │   ├── buffer.pyx
│   │       │   │   ├── consts.pxi
│   │       │   │   ├── cpythonx.pxd
│   │       │   │   ├── debug.pxd
│   │       │   │   ├── frb.pxd
│   │       │   │   ├── frb.pyx
│   │       │   │   ├── hton.pxd
│   │       │   │   ├── pgproto.cp314-win_amd64.pyd
│   │       │   │   ├── pgproto.pxd
│   │       │   │   ├── pgproto.pyi
│   │       │   │   ├── pgproto.pyx
│   │       │   │   ├── tohex.pxd
│   │       │   │   ├── types.py
│   │       │   │   └── uuid.pyx
│   │       │   ├── protocol/
│   │       │   │   ├── codecs/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── array.pyx
│   │       │   │   │   ├── base.pxd
│   │       │   │   │   ├── base.pyx
│   │       │   │   │   ├── pgproto.pyx
│   │       │   │   │   ├── range.pyx
│   │       │   │   │   ├── record.pyx
│   │       │   │   │   └── textutils.pyx
│   │       │   │   ├── __init__.py
│   │       │   │   ├── consts.pxi
│   │       │   │   ├── coreproto.pxd
│   │       │   │   ├── coreproto.pyx
│   │       │   │   ├── cpythonx.pxd
│   │       │   │   ├── encodings.pyx
│   │       │   │   ├── pgtypes.pxi
│   │       │   │   ├── prepared_stmt.pxd
│   │       │   │   ├── prepared_stmt.pyx
│   │       │   │   ├── protocol.cp314-win_amd64.pyd
│   │       │   │   ├── protocol.pxd
│   │       │   │   ├── protocol.pyi
│   │       │   │   ├── protocol.pyx
│   │       │   │   ├── record.cp314-win_amd64.pyd
│   │       │   │   ├── record.pyi
│   │       │   │   ├── recordcapi.pxd
│   │       │   │   ├── scram.pxd
│   │       │   │   ├── scram.pyx
│   │       │   │   ├── settings.pxd
│   │       │   │   └── settings.pyx
│   │       │   ├── __init__.py
│   │       │   ├── _asyncio_compat.py
│   │       │   ├── _version.py
│   │       │   ├── cluster.py
│   │       │   ├── compat.py
│   │       │   ├── connect_utils.py
│   │       │   ├── connection.py
│   │       │   ├── connresource.py
│   │       │   ├── cursor.py
│   │       │   ├── introspection.py
│   │       │   ├── pool.py
│   │       │   ├── prepared_stmt.py
│   │       │   ├── serverversion.py
│   │       │   ├── transaction.py
│   │       │   ├── types.py
│   │       │   └── utils.py
│   │       ├── asyncpg-0.31.0.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   ├── REQUESTED
│   │       │   ├── top_level.txt
│   │       │   └── WHEEL
│   │       ├── bcrypt/
│   │       │   ├── __init__.py
│   │       │   ├── __init__.pyi
│   │       │   ├── _bcrypt.pyd
│   │       │   └── py.typed
│   │       ├── bcrypt-5.0.0.dist-info/
│   │       │   ├── INSTALLER
│   │       │   ├── LICENSE
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   ├── top_level.txt
│   │       │   └── WHEEL
│   │       ├── certifi/
│   │       │   ├── tests/
│   │       │   │   ├── __init__.py
│   │       │   │   └── test_certify.py
│   │       │   ├── __init__.py
│   │       │   ├── __main__.py
│   │       │   ├── cacert.pem
│   │       │   ├── core.py
│   │       │   └── py.typed
│   │       ├── certifi-2026.7.22.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   ├── top_level.txt
│   │       │   └── WHEEL
│   │       ├── cffi/
│   │       │   ├── __init__.py
│   │       │   ├── _cffi_errors.h
│   │       │   ├── _cffi_gen_src.py
│   │       │   ├── _cffi_include.h
│   │       │   ├── _embedding.h
│   │       │   ├── _imp_emulation.py
│   │       │   ├── _shimmed_dist_utils.py
│   │       │   ├── api.py
│   │       │   ├── backend_ctypes.py
│   │       │   ├── cffi_opcode.py
│   │       │   ├── commontypes.py
│   │       │   ├── cparser.py
│   │       │   ├── error.py
│   │       │   ├── ffiplatform.py
│   │       │   ├── gen_src.py
│   │       │   ├── lock.py
│   │       │   ├── model.py
│   │       │   ├── parse_c_type.h
│   │       │   ├── pkgconfig.py
│   │       │   ├── recompiler.py
│   │       │   ├── setuptools_ext.py
│   │       │   ├── vengine_cpy.py
│   │       │   ├── vengine_gen.py
│   │       │   └── verifier.py
│   │       ├── cffi-2.1.0.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE
│   │       │   ├── entry_points.txt
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   ├── top_level.txt
│   │       │   └── WHEEL
│   │       ├── click/
│   │       │   ├── __init__.py
│   │       │   ├── _compat.py
│   │       │   ├── _termui_impl.py
│   │       │   ├── _textwrap.py
│   │       │   ├── _utils.py
│   │       │   ├── _winconsole.py
│   │       │   ├── core.py
│   │       │   ├── decorators.py
│   │       │   ├── exceptions.py
│   │       │   ├── formatting.py
│   │       │   ├── globals.py
│   │       │   ├── parser.py
│   │       │   ├── py.typed
│   │       │   ├── shell_completion.py
│   │       │   ├── termui.py
│   │       │   ├── testing.py
│   │       │   ├── types.py
│   │       │   └── utils.py
│   │       ├── click-8.4.2.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE.txt
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   └── WHEEL
│   │       ├── colorama/
│   │       │   ├── tests/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── ansi_test.py
│   │       │   │   ├── ansitowin32_test.py
│   │       │   │   ├── initialise_test.py
│   │       │   │   ├── isatty_test.py
│   │       │   │   ├── utils.py
│   │       │   │   └── winterm_test.py
│   │       │   ├── __init__.py
│   │       │   ├── ansi.py
│   │       │   ├── ansitowin32.py
│   │       │   ├── initialise.py
│   │       │   ├── win32.py
│   │       │   └── winterm.py
│   │       ├── colorama-0.4.6.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE.txt
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   └── WHEEL
│   │       ├── cryptography/
│   │       │   ├── hazmat/
│   │       │   │   ├── asn1/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   └── asn1.py
│   │       │   │   ├── backends/
│   │       │   │   │   ├── openssl/
│   │       │   │   │   │   ├── __init__.py
│   │       │   │   │   │   └── backend.py
│   │       │   │   │   └── __init__.py
│   │       │   │   ├── bindings/
│   │       │   │   │   ├── _rust/
│   │       │   │   │   │   ├── openssl/
│   │       │   │   │   │   │   ├── __init__.pyi
│   │       │   │   │   │   │   ├── aead.pyi
│   │       │   │   │   │   │   ├── ciphers.pyi
│   │       │   │   │   │   │   ├── cmac.pyi
│   │       │   │   │   │   │   ├── dh.pyi
│   │       │   │   │   │   │   ├── dsa.pyi
│   │       │   │   │   │   │   ├── ec.pyi
│   │       │   │   │   │   │   ├── ed25519.pyi
│   │       │   │   │   │   │   ├── ed448.pyi
│   │       │   │   │   │   │   ├── hashes.pyi
│   │       │   │   │   │   │   ├── hmac.pyi
│   │       │   │   │   │   │   ├── hpke.pyi
│   │       │   │   │   │   │   ├── kdf.pyi
│   │       │   │   │   │   │   ├── keys.pyi
│   │       │   │   │   │   │   ├── keywrap.pyi
│   │       │   │   │   │   │   ├── mldsa.pyi
│   │       │   │   │   │   │   ├── mlkem.pyi
│   │       │   │   │   │   │   ├── poly1305.pyi
│   │       │   │   │   │   │   ├── rsa.pyi
│   │       │   │   │   │   │   ├── x25519.pyi
│   │       │   │   │   │   │   └── x448.pyi
│   │       │   │   │   │   ├── __init__.pyi
│   │       │   │   │   │   ├── _openssl.pyi
│   │       │   │   │   │   ├── asn1.pyi
│   │       │   │   │   │   ├── cobblestone.pyi
│   │       │   │   │   │   ├── declarative_asn1.pyi
│   │       │   │   │   │   ├── exceptions.pyi
│   │       │   │   │   │   ├── ocsp.pyi
│   │       │   │   │   │   ├── pkcs12.pyi
│   │       │   │   │   │   ├── pkcs7.pyi
│   │       │   │   │   │   ├── test_support.pyi
│   │       │   │   │   │   └── x509.pyi
│   │       │   │   │   ├── openssl/
│   │       │   │   │   │   ├── __init__.py
│   │       │   │   │   │   ├── _conditional.py
│   │       │   │   │   │   └── binding.py
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   └── _rust.pyd
│   │       │   │   ├── decrepit/
│   │       │   │   │   ├── ciphers/
│   │       │   │   │   │   ├── __init__.py
│   │       │   │   │   │   ├── algorithms.py
│   │       │   │   │   │   └── modes.py
│   │       │   │   │   └── __init__.py
│   │       │   │   ├── primitives/
│   │       │   │   │   ├── asymmetric/
│   │       │   │   │   │   ├── __init__.py
│   │       │   │   │   │   ├── dh.py
│   │       │   │   │   │   ├── dsa.py
│   │       │   │   │   │   ├── ec.py
│   │       │   │   │   │   ├── ed25519.py
│   │       │   │   │   │   ├── ed448.py
│   │       │   │   │   │   ├── mldsa.py
│   │       │   │   │   │   ├── mlkem.py
│   │       │   │   │   │   ├── padding.py
│   │       │   │   │   │   ├── rsa.py
│   │       │   │   │   │   ├── types.py
│   │       │   │   │   │   ├── utils.py
│   │       │   │   │   │   ├── x25519.py
│   │       │   │   │   │   └── x448.py
│   │       │   │   │   ├── ciphers/
│   │       │   │   │   │   ├── __init__.py
│   │       │   │   │   │   ├── aead.py
│   │       │   │   │   │   ├── algorithms.py
│   │       │   │   │   │   ├── base.py
│   │       │   │   │   │   └── modes.py
│   │       │   │   │   ├── kdf/
│   │       │   │   │   │   ├── __init__.py
│   │       │   │   │   │   ├── argon2.py
│   │       │   │   │   │   ├── concatkdf.py
│   │       │   │   │   │   ├── hkdf.py
│   │       │   │   │   │   ├── kbkdf.py
│   │       │   │   │   │   ├── pbkdf2.py
│   │       │   │   │   │   ├── scrypt.py
│   │       │   │   │   │   └── x963kdf.py
│   │       │   │   │   ├── serialization/
│   │       │   │   │   │   ├── __init__.py
│   │       │   │   │   │   ├── base.py
│   │       │   │   │   │   ├── pkcs12.py
│   │       │   │   │   │   ├── pkcs7.py
│   │       │   │   │   │   └── ssh.py
│   │       │   │   │   ├── twofactor/
│   │       │   │   │   │   ├── __init__.py
│   │       │   │   │   │   ├── hotp.py
│   │       │   │   │   │   └── totp.py
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── _asymmetric.py
│   │       │   │   │   ├── _cipheralgorithm.py
│   │       │   │   │   ├── _modes.py
│   │       │   │   │   ├── _serialization.py
│   │       │   │   │   ├── cmac.py
│   │       │   │   │   ├── constant_time.py
│   │       │   │   │   ├── hashes.py
│   │       │   │   │   ├── hmac.py
│   │       │   │   │   ├── hpke.py
│   │       │   │   │   ├── keywrap.py
│   │       │   │   │   ├── padding.py
│   │       │   │   │   └── poly1305.py
│   │       │   │   ├── __init__.py
│   │       │   │   └── _oid.py
│   │       │   ├── x509/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── base.py
│   │       │   │   ├── certificate_transparency.py
│   │       │   │   ├── extensions.py
│   │       │   │   ├── general_name.py
│   │       │   │   ├── name.py
│   │       │   │   ├── ocsp.py
│   │       │   │   ├── oid.py
│   │       │   │   └── verification.py
│   │       │   ├── __about__.py
│   │       │   ├── __init__.py
│   │       │   ├── cobblestone.py
│   │       │   ├── exceptions.py
│   │       │   ├── fernet.py
│   │       │   ├── py.typed
│   │       │   └── utils.py
│   │       ├── cryptography-50.0.0.dist-info/
│   │       │   ├── licenses/
│   │       │   │   ├── LICENSE
│   │       │   │   ├── LICENSE.APACHE
│   │       │   │   └── LICENSE.BSD
│   │       │   ├── sboms/
│   │       │   │   ├── cryptography-rust.cyclonedx.json
│   │       │   │   └── sbom.json
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   └── WHEEL
│   │       ├── dns/
│   │       │   ├── dnssecalgs/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── base.py
│   │       │   │   ├── cryptography.py
│   │       │   │   ├── dsa.py
│   │       │   │   ├── ecdsa.py
│   │       │   │   ├── eddsa.py
│   │       │   │   └── rsa.py
│   │       │   ├── quic/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── _asyncio.py
│   │       │   │   ├── _common.py
│   │       │   │   ├── _sync.py
│   │       │   │   └── _trio.py
│   │       │   ├── rdtypes/
│   │       │   │   ├── ANY/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── AFSDB.py
│   │       │   │   │   ├── AMTRELAY.py
│   │       │   │   │   ├── AVC.py
│   │       │   │   │   ├── CAA.py
│   │       │   │   │   ├── CDNSKEY.py
│   │       │   │   │   ├── CDS.py
│   │       │   │   │   ├── CERT.py
│   │       │   │   │   ├── CNAME.py
│   │       │   │   │   ├── CSYNC.py
│   │       │   │   │   ├── DLV.py
│   │       │   │   │   ├── DNAME.py
│   │       │   │   │   ├── DNSKEY.py
│   │       │   │   │   ├── DS.py
│   │       │   │   │   ├── DSYNC.py
│   │       │   │   │   ├── EUI48.py
│   │       │   │   │   ├── EUI64.py
│   │       │   │   │   ├── GPOS.py
│   │       │   │   │   ├── HINFO.py
│   │       │   │   │   ├── HIP.py
│   │       │   │   │   ├── ISDN.py
│   │       │   │   │   ├── L32.py
│   │       │   │   │   ├── L64.py
│   │       │   │   │   ├── LOC.py
│   │       │   │   │   ├── LP.py
│   │       │   │   │   ├── MX.py
│   │       │   │   │   ├── NID.py
│   │       │   │   │   ├── NINFO.py
│   │       │   │   │   ├── NS.py
│   │       │   │   │   ├── NSEC.py
│   │       │   │   │   ├── NSEC3.py
│   │       │   │   │   ├── NSEC3PARAM.py
│   │       │   │   │   ├── OPENPGPKEY.py
│   │       │   │   │   ├── OPT.py
│   │       │   │   │   ├── PTR.py
│   │       │   │   │   ├── RESINFO.py
│   │       │   │   │   ├── RP.py
│   │       │   │   │   ├── RRSIG.py
│   │       │   │   │   ├── RT.py
│   │       │   │   │   ├── SMIMEA.py
│   │       │   │   │   ├── SOA.py
│   │       │   │   │   ├── SPF.py
│   │       │   │   │   ├── SSHFP.py
│   │       │   │   │   ├── TKEY.py
│   │       │   │   │   ├── TLSA.py
│   │       │   │   │   ├── TSIG.py
│   │       │   │   │   ├── TXT.py
│   │       │   │   │   ├── URI.py
│   │       │   │   │   ├── WALLET.py
│   │       │   │   │   ├── X25.py
│   │       │   │   │   └── ZONEMD.py
│   │       │   │   ├── CH/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   └── A.py
│   │       │   │   ├── IN/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── A.py
│   │       │   │   │   ├── AAAA.py
│   │       │   │   │   ├── APL.py
│   │       │   │   │   ├── DHCID.py
│   │       │   │   │   ├── HTTPS.py
│   │       │   │   │   ├── IPSECKEY.py
│   │       │   │   │   ├── KX.py
│   │       │   │   │   ├── NAPTR.py
│   │       │   │   │   ├── NSAP_PTR.py
│   │       │   │   │   ├── NSAP.py
│   │       │   │   │   ├── PX.py
│   │       │   │   │   ├── SRV.py
│   │       │   │   │   ├── SVCB.py
│   │       │   │   │   └── WKS.py
│   │       │   │   ├── __init__.py
│   │       │   │   ├── dnskeybase.py
│   │       │   │   ├── dsbase.py
│   │       │   │   ├── euibase.py
│   │       │   │   ├── mxbase.py
│   │       │   │   ├── nsbase.py
│   │       │   │   ├── svcbbase.py
│   │       │   │   ├── tlsabase.py
│   │       │   │   ├── txtbase.py
│   │       │   │   └── util.py
│   │       │   ├── __init__.py
│   │       │   ├── _asyncbackend.py
│   │       │   ├── _asyncio_backend.py
│   │       │   ├── _ddr.py
│   │       │   ├── _features.py
│   │       │   ├── _immutable_ctx.py
│   │       │   ├── _no_ssl.py
│   │       │   ├── _tls_util.py
│   │       │   ├── _trio_backend.py
│   │       │   ├── asyncbackend.py
│   │       │   ├── asyncquery.py
│   │       │   ├── asyncresolver.py
│   │       │   ├── btree.py
│   │       │   ├── btreezone.py
│   │       │   ├── dnssec.py
│   │       │   ├── dnssectypes.py
│   │       │   ├── e164.py
│   │       │   ├── edns.py
│   │       │   ├── entropy.py
│   │       │   ├── enum.py
│   │       │   ├── exception.py
│   │       │   ├── flags.py
│   │       │   ├── grange.py
│   │       │   ├── immutable.py
│   │       │   ├── inet.py
│   │       │   ├── ipv4.py
│   │       │   ├── ipv6.py
│   │       │   ├── message.py
│   │       │   ├── name.py
│   │       │   ├── namedict.py
│   │       │   ├── nameserver.py
│   │       │   ├── node.py
│   │       │   ├── opcode.py
│   │       │   ├── py.typed
│   │       │   ├── query.py
│   │       │   ├── rcode.py
│   │       │   ├── rdata.py
│   │       │   ├── rdataclass.py
│   │       │   ├── rdataset.py
│   │       │   ├── rdatatype.py
│   │       │   ├── renderer.py
│   │       │   ├── resolver.py
│   │       │   ├── reversename.py
│   │       │   ├── rrset.py
│   │       │   ├── serial.py
│   │       │   ├── set.py
│   │       │   ├── tokenizer.py
│   │       │   ├── transaction.py
│   │       │   ├── tsig.py
│   │       │   ├── tsigkeyring.py
│   │       │   ├── ttl.py
│   │       │   ├── update.py
│   │       │   ├── version.py
│   │       │   ├── versioned.py
│   │       │   ├── win32util.py
│   │       │   ├── wire.py
│   │       │   ├── xfr.py
│   │       │   ├── zone.py
│   │       │   ├── zonefile.py
│   │       │   └── zonetypes.py
│   │       ├── dnspython-2.8.0.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   └── WHEEL
│   │       ├── dotenv/
│   │       │   ├── __init__.py
│   │       │   ├── __main__.py
│   │       │   ├── cli.py
│   │       │   ├── ipython.py
│   │       │   ├── main.py
│   │       │   ├── parser.py
│   │       │   ├── py.typed
│   │       │   ├── variables.py
│   │       │   └── version.py
│   │       ├── ecdsa/
│   │       │   ├── __init__.py
│   │       │   ├── _compat.py
│   │       │   ├── _rwlock.py
│   │       │   ├── _sha3.py
│   │       │   ├── _version.py
│   │       │   ├── curves.py
│   │       │   ├── der.py
│   │       │   ├── ecdh.py
│   │       │   ├── ecdsa.py
│   │       │   ├── eddsa.py
│   │       │   ├── ellipticcurve.py
│   │       │   ├── errors.py
│   │       │   ├── keys.py
│   │       │   ├── numbertheory.py
│   │       │   ├── rfc6979.py
│   │       │   ├── ssh.py
│   │       │   ├── test_curves.py
│   │       │   ├── test_der.py
│   │       │   ├── test_ecdh.py
│   │       │   ├── test_ecdsa.py
│   │       │   ├── test_eddsa.py
│   │       │   ├── test_ellipticcurve.py
│   │       │   ├── test_jacobi.py
│   │       │   ├── test_keys.py
│   │       │   ├── test_malformed_sigs.py
│   │       │   ├── test_numbertheory.py
│   │       │   ├── test_pyecdsa.py
│   │       │   ├── test_rw_lock.py
│   │       │   ├── test_sha3.py
│   │       │   └── util.py
│   │       ├── ecdsa-0.19.2.dist-info/
│   │       │   ├── INSTALLER
│   │       │   ├── LICENSE
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   ├── top_level.txt
│   │       │   └── WHEEL
│   │       ├── email_validator/
│   │       │   ├── __init__.py
│   │       │   ├── __main__.py
│   │       │   ├── deliverability.py
│   │       │   ├── exceptions.py
│   │       │   ├── py.typed
│   │       │   ├── rfc_constants.py
│   │       │   ├── syntax.py
│   │       │   ├── types.py
│   │       │   ├── validate_email.py
│   │       │   └── version.py
│   │       ├── email_validator-2.3.0.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE
│   │       │   ├── entry_points.txt
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   ├── REQUESTED
│   │       │   ├── top_level.txt
│   │       │   └── WHEEL
│   │       ├── fastapi/
│   │       │   ├── _compat/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── shared.py
│   │       │   │   └── v2.py
│   │       │   ├── dependencies/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── models.py
│   │       │   │   └── utils.py
│   │       │   ├── middleware/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── asyncexitstack.py
│   │       │   │   ├── cors.py
│   │       │   │   ├── gzip.py
│   │       │   │   ├── httpsredirect.py
│   │       │   │   ├── trustedhost.py
│   │       │   │   └── wsgi.py
│   │       │   ├── openapi/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── constants.py
│   │       │   │   ├── docs.py
│   │       │   │   ├── models.py
│   │       │   │   └── utils.py
│   │       │   ├── security/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── api_key.py
│   │       │   │   ├── base.py
│   │       │   │   ├── http.py
│   │       │   │   ├── oauth2.py
│   │       │   │   ├── open_id_connect_url.py
│   │       │   │   └── utils.py
│   │       │   ├── __init__.py
│   │       │   ├── __main__.py
│   │       │   ├── applications.py
│   │       │   ├── background.py
│   │       │   ├── cli.py
│   │       │   ├── concurrency.py
│   │       │   ├── datastructures.py
│   │       │   ├── encoders.py
│   │       │   ├── exception_handlers.py
│   │       │   ├── exceptions.py
│   │       │   ├── logger.py
│   │       │   ├── param_functions.py
│   │       │   ├── params.py
│   │       │   ├── py.typed
│   │       │   ├── requests.py
│   │       │   ├── responses.py
│   │       │   ├── routing.py
│   │       │   ├── sse.py
│   │       │   ├── staticfiles.py
│   │       │   ├── templating.py
│   │       │   ├── testclient.py
│   │       │   ├── types.py
│   │       │   ├── utils.py
│   │       │   └── websockets.py
│   │       ├── fastapi-0.141.1.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE
│   │       │   ├── entry_points.txt
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   ├── REQUESTED
│   │       │   └── WHEEL
│   │       ├── greenlet/
│   │       │   ├── platform/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── setup_switch_x64_masm.cmd
│   │       │   │   ├── switch_aarch64_gcc.h
│   │       │   │   ├── switch_alpha_unix.h
│   │       │   │   ├── switch_amd64_unix.h
│   │       │   │   ├── switch_arm32_gcc.h
│   │       │   │   ├── switch_arm32_ios.h
│   │       │   │   ├── switch_arm64_masm.asm
│   │       │   │   ├── switch_arm64_masm.obj
│   │       │   │   ├── switch_arm64_msvc.h
│   │       │   │   ├── switch_csky_gcc.h
│   │       │   │   ├── switch_loongarch64_linux.h
│   │       │   │   ├── switch_m68k_gcc.h
│   │       │   │   ├── switch_mips_unix.h
│   │       │   │   ├── switch_ppc_aix.h
│   │       │   │   ├── switch_ppc_linux.h
│   │       │   │   ├── switch_ppc_macosx.h
│   │       │   │   ├── switch_ppc_unix.h
│   │       │   │   ├── switch_ppc64_aix.h
│   │       │   │   ├── switch_ppc64_linux.h
│   │       │   │   ├── switch_riscv_unix.h
│   │       │   │   ├── switch_s390_unix.h
│   │       │   │   ├── switch_sh_gcc.h
│   │       │   │   ├── switch_sparc_sun_gcc.h
│   │       │   │   ├── switch_x32_unix.h
│   │       │   │   ├── switch_x64_masm.asm
│   │       │   │   ├── switch_x64_masm.obj
│   │       │   │   ├── switch_x64_msvc.h
│   │       │   │   ├── switch_x86_msvc.h
│   │       │   │   └── switch_x86_unix.h
│   │       │   ├── tests/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── _test_extension_cpp.cp314-win_amd64.pyd
│   │       │   │   ├── _test_extension_cpp.cpp
│   │       │   │   ├── _test_extension.c
│   │       │   │   ├── _test_extension.cp314-win_amd64.pyd
│   │       │   │   ├── fail_c_stack_refs_suspended_gc.py
│   │       │   │   ├── fail_clearing_run_switches.py
│   │       │   │   ├── fail_cpp_exception.py
│   │       │   │   ├── fail_initialstub_already_started.py
│   │       │   │   ├── fail_issue_515_freethread_gc.py
│   │       │   │   ├── fail_slp_switch.py
│   │       │   │   ├── fail_switch_critical_section.py
│   │       │   │   ├── fail_switch_three_greenlets.py
│   │       │   │   ├── fail_switch_three_greenlets2.py
│   │       │   │   ├── fail_switch_two_greenlets.py
│   │       │   │   ├── leakcheck.py
│   │       │   │   ├── test_contextvars.py
│   │       │   │   ├── test_cpp.py
│   │       │   │   ├── test_extension_interface.py
│   │       │   │   ├── test_gc.py
│   │       │   │   ├── test_generator_nested.py
│   │       │   │   ├── test_generator.py
│   │       │   │   ├── test_greenlet_trash.py
│   │       │   │   ├── test_greenlet.py
│   │       │   │   ├── test_interpreter_shutdown.py
│   │       │   │   ├── test_leaks.py
│   │       │   │   ├── test_stack_saved.py
│   │       │   │   ├── test_throw.py
│   │       │   │   ├── test_tracing.py
│   │       │   │   ├── test_version.py
│   │       │   │   └── test_weakref.py
│   │       │   ├── __init__.py
│   │       │   ├── _greenlet.cp314-win_amd64.pyd
│   │       │   ├── CObjects.cpp
│   │       │   ├── greenlet_allocator.hpp
│   │       │   ├── greenlet_compiler_compat.hpp
│   │       │   ├── greenlet_cpython_compat.hpp
│   │       │   ├── greenlet_exceptions.hpp
│   │       │   ├── greenlet_internal.hpp
│   │       │   ├── greenlet_msvc_compat.hpp
│   │       │   ├── greenlet_refs.hpp
│   │       │   ├── greenlet_slp_switch.hpp
│   │       │   ├── greenlet_thread_support.hpp
│   │       │   ├── greenlet.cpp
│   │       │   ├── greenlet.h
│   │       │   ├── PyGreenlet.cpp
│   │       │   ├── PyGreenlet.hpp
│   │       │   ├── PyGreenletUnswitchable.cpp
│   │       │   ├── PyModule.cpp
│   │       │   ├── slp_platformselect.h
│   │       │   ├── TBrokenGreenlet.cpp
│   │       │   ├── TExceptionState.cpp
│   │       │   ├── TGreenlet.cpp
│   │       │   ├── TGreenlet.hpp
│   │       │   ├── TGreenletGlobals.cpp
│   │       │   ├── TMainGreenlet.cpp
│   │       │   ├── TPythonState.cpp
│   │       │   ├── TStackState.cpp
│   │       │   ├── TThreadState.hpp
│   │       │   ├── TThreadStateCreator.hpp
│   │       │   ├── TThreadStateDestroy.cpp
│   │       │   └── TUserGreenlet.cpp
│   │       ├── greenlet-3.5.4.dist-info/
│   │       │   ├── licenses/
│   │       │   │   ├── LICENSE
│   │       │   │   └── LICENSE.PSF
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   ├── top_level.txt
│   │       │   └── WHEEL
│   │       ├── h11/
│   │       │   ├── __init__.py
│   │       │   ├── _abnf.py
│   │       │   ├── _connection.py
│   │       │   ├── _events.py
│   │       │   ├── _headers.py
│   │       │   ├── _readers.py
│   │       │   ├── _receivebuffer.py
│   │       │   ├── _state.py
│   │       │   ├── _util.py
│   │       │   ├── _version.py
│   │       │   ├── _writers.py
│   │       │   └── py.typed
│   │       ├── h11-0.16.0.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE.txt
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   ├── top_level.txt
│   │       │   └── WHEEL
│   │       ├── httpcore/
│   │       │   ├── _async/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── connection_pool.py
│   │       │   │   ├── connection.py
│   │       │   │   ├── http_proxy.py
│   │       │   │   ├── http11.py
│   │       │   │   ├── http2.py
│   │       │   │   ├── interfaces.py
│   │       │   │   └── socks_proxy.py
│   │       │   ├── _backends/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── anyio.py
│   │       │   │   ├── auto.py
│   │       │   │   ├── base.py
│   │       │   │   ├── mock.py
│   │       │   │   ├── sync.py
│   │       │   │   └── trio.py
│   │       │   ├── _sync/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── connection_pool.py
│   │       │   │   ├── connection.py
│   │       │   │   ├── http_proxy.py
│   │       │   │   ├── http11.py
│   │       │   │   ├── http2.py
│   │       │   │   ├── interfaces.py
│   │       │   │   └── socks_proxy.py
│   │       │   ├── __init__.py
│   │       │   ├── _api.py
│   │       │   ├── _exceptions.py
│   │       │   ├── _models.py
│   │       │   ├── _ssl.py
│   │       │   ├── _synchronization.py
│   │       │   ├── _trace.py
│   │       │   ├── _utils.py
│   │       │   └── py.typed
│   │       ├── httpcore-1.0.9.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE.md
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   └── WHEEL
│   │       ├── httptools/
│   │       │   ├── parser/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── cparser.pxd
│   │       │   │   ├── errors.py
│   │       │   │   ├── parser.cp314-win_amd64.pyd
│   │       │   │   ├── parser.pyi
│   │       │   │   ├── parser.pyx
│   │       │   │   ├── protocol.py
│   │       │   │   ├── python.pxd
│   │       │   │   ├── url_cparser.pxd
│   │       │   │   ├── url_parser.cp314-win_amd64.pyd
│   │       │   │   ├── url_parser.pyi
│   │       │   │   └── url_parser.pyx
│   │       │   ├── __init__.py
│   │       │   ├── _version.py
│   │       │   └── py.typed
│   │       ├── httptools-0.8.0.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   ├── top_level.txt
│   │       │   └── WHEEL
│   │       ├── httpx/
│   │       │   ├── _transports/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── asgi.py
│   │       │   │   ├── base.py
│   │       │   │   ├── default.py
│   │       │   │   ├── mock.py
│   │       │   │   └── wsgi.py
│   │       │   ├── __init__.py
│   │       │   ├── __version__.py
│   │       │   ├── _api.py
│   │       │   ├── _auth.py
│   │       │   ├── _client.py
│   │       │   ├── _config.py
│   │       │   ├── _content.py
│   │       │   ├── _decoders.py
│   │       │   ├── _exceptions.py
│   │       │   ├── _main.py
│   │       │   ├── _models.py
│   │       │   ├── _multipart.py
│   │       │   ├── _status_codes.py
│   │       │   ├── _types.py
│   │       │   ├── _urlparse.py
│   │       │   ├── _urls.py
│   │       │   ├── _utils.py
│   │       │   └── py.typed
│   │       ├── httpx-0.28.1.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE.md
│   │       │   ├── entry_points.txt
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   ├── REQUESTED
│   │       │   └── WHEEL
│   │       ├── idna/
│   │       │   ├── __init__.py
│   │       │   ├── __main__.py
│   │       │   ├── cli.py
│   │       │   ├── codec.py
│   │       │   ├── compat.py
│   │       │   ├── core.py
│   │       │   ├── idnadata.py
│   │       │   ├── intranges.py
│   │       │   ├── package_data.py
│   │       │   ├── py.typed
│   │       │   └── uts46data.py
│   │       ├── idna-3.18.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE.md
│   │       │   ├── entry_points.txt
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   └── WHEEL
│   │       ├── jose/
│   │       │   ├── backends/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── _asn1.py
│   │       │   │   ├── base.py
│   │       │   │   ├── cryptography_backend.py
│   │       │   │   ├── ecdsa_backend.py
│   │       │   │   ├── native.py
│   │       │   │   └── rsa_backend.py
│   │       │   ├── __init__.py
│   │       │   ├── constants.py
│   │       │   ├── exceptions.py
│   │       │   ├── jwe.py
│   │       │   ├── jwk.py
│   │       │   ├── jws.py
│   │       │   ├── jwt.py
│   │       │   └── utils.py
│   │       ├── mako/
│   │       │   ├── ext/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── autohandler.py
│   │       │   │   ├── babelplugin.py
│   │       │   │   ├── beaker_cache.py
│   │       │   │   ├── extract.py
│   │       │   │   ├── linguaplugin.py
│   │       │   │   ├── preprocessors.py
│   │       │   │   ├── pygmentplugin.py
│   │       │   │   └── turbogears.py
│   │       │   ├── testing/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── _config.py
│   │       │   │   ├── assertions.py
│   │       │   │   ├── config.py
│   │       │   │   ├── exclusions.py
│   │       │   │   ├── fixtures.py
│   │       │   │   └── helpers.py
│   │       │   ├── __init__.py
│   │       │   ├── _ast_util.py
│   │       │   ├── ast.py
│   │       │   ├── cache.py
│   │       │   ├── cmd.py
│   │       │   ├── codegen.py
│   │       │   ├── compat.py
│   │       │   ├── exceptions.py
│   │       │   ├── filters.py
│   │       │   ├── lexer.py
│   │       │   ├── lookup.py
│   │       │   ├── parsetree.py
│   │       │   ├── pygen.py
│   │       │   ├── pyparser.py
│   │       │   ├── runtime.py
│   │       │   ├── template.py
│   │       │   └── util.py
│   │       ├── mako-1.3.12.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE
│   │       │   ├── entry_points.txt
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   ├── top_level.txt
│   │       │   └── WHEEL
│   │       ├── markupsafe/
│   │       │   ├── __init__.py
│   │       │   ├── _native.py
│   │       │   ├── _speedups.c
│   │       │   ├── _speedups.cp314-win_amd64.pyd
│   │       │   ├── _speedups.pyi
│   │       │   └── py.typed
│   │       ├── markupsafe-3.0.3.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE.txt
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   ├── top_level.txt
│   │       │   └── WHEEL
│   │       ├── multipart/
│   │       │   ├── __init__.py
│   │       │   ├── decoders.py
│   │       │   ├── exceptions.py
│   │       │   └── multipart.py
│   │       ├── passlib/
│   │       │   ├── _data/
│   │       │   │   └── wordsets/
│   │       │   │       ├── bip39.txt
│   │       │   │       ├── eff_long.txt
│   │       │   │       ├── eff_prefixed.txt
│   │       │   │       └── eff_short.txt
│   │       │   ├── crypto/
│   │       │   │   ├── _blowfish/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── _gen_files.py
│   │       │   │   │   ├── base.py
│   │       │   │   │   └── unrolled.py
│   │       │   │   ├── scrypt/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── _builtin.py
│   │       │   │   │   ├── _gen_files.py
│   │       │   │   │   └── _salsa.py
│   │       │   │   ├── __init__.py
│   │       │   │   ├── _md4.py
│   │       │   │   ├── des.py
│   │       │   │   └── digest.py
│   │       │   ├── ext/
│   │       │   │   ├── django/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── models.py
│   │       │   │   │   └── utils.py
│   │       │   │   └── __init__.py
│   │       │   ├── handlers/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── argon2.py
│   │       │   │   ├── bcrypt.py
│   │       │   │   ├── cisco.py
│   │       │   │   ├── des_crypt.py
│   │       │   │   ├── digests.py
│   │       │   │   ├── django.py
│   │       │   │   ├── fshp.py
│   │       │   │   ├── ldap_digests.py
│   │       │   │   ├── md5_crypt.py
│   │       │   │   ├── misc.py
│   │       │   │   ├── mssql.py
│   │       │   │   ├── mysql.py
│   │       │   │   ├── oracle.py
│   │       │   │   ├── pbkdf2.py
│   │       │   │   ├── phpass.py
│   │       │   │   ├── postgres.py
│   │       │   │   ├── roundup.py
│   │       │   │   ├── scram.py
│   │       │   │   ├── scrypt.py
│   │       │   │   ├── sha1_crypt.py
│   │       │   │   ├── sha2_crypt.py
│   │       │   │   ├── sun_md5_crypt.py
│   │       │   │   └── windows.py
│   │       │   ├── tests/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── __main__.py
│   │       │   │   ├── _test_bad_register.py
│   │       │   │   ├── backports.py
│   │       │   │   ├── sample_config_1s.cfg
│   │       │   │   ├── sample1.cfg
│   │       │   │   ├── sample1b.cfg
│   │       │   │   ├── sample1c.cfg
│   │       │   │   ├── test_apache.py
│   │       │   │   ├── test_apps.py
│   │       │   │   ├── test_context_deprecated.py
│   │       │   │   ├── test_context.py
│   │       │   │   ├── test_crypto_builtin_md4.py
│   │       │   │   ├── test_crypto_des.py
│   │       │   │   ├── test_crypto_digest.py
│   │       │   │   ├── test_crypto_scrypt.py
│   │       │   │   ├── test_ext_django_source.py
│   │       │   │   ├── test_ext_django.py
│   │       │   │   ├── test_handlers_argon2.py
│   │       │   │   ├── test_handlers_bcrypt.py
│   │       │   │   ├── test_handlers_cisco.py
│   │       │   │   ├── test_handlers_django.py
│   │       │   │   ├── test_handlers_pbkdf2.py
│   │       │   │   ├── test_handlers_scrypt.py
│   │       │   │   ├── test_handlers.py
│   │       │   │   ├── test_hosts.py
│   │       │   │   ├── test_pwd.py
│   │       │   │   ├── test_registry.py
│   │       │   │   ├── test_totp.py
│   │       │   │   ├── test_utils_handlers.py
│   │       │   │   ├── test_utils_md4.py
│   │       │   │   ├── test_utils_pbkdf2.py
│   │       │   │   ├── test_utils.py
│   │       │   │   ├── test_win32.py
│   │       │   │   ├── tox_support.py
│   │       │   │   └── utils.py
│   │       │   ├── utils/
│   │       │   │   ├── compat/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   └── _ordered_dict.py
│   │       │   │   ├── __init__.py
│   │       │   │   ├── binary.py
│   │       │   │   ├── decor.py
│   │       │   │   ├── des.py
│   │       │   │   ├── handlers.py
│   │       │   │   ├── md4.py
│   │       │   │   └── pbkdf2.py
│   │       │   ├── __init__.py
│   │       │   ├── apache.py
│   │       │   ├── apps.py
│   │       │   ├── context.py
│   │       │   ├── exc.py
│   │       │   ├── hash.py
│   │       │   ├── hosts.py
│   │       │   ├── ifc.py
│   │       │   ├── pwd.py
│   │       │   ├── registry.py
│   │       │   ├── totp.py
│   │       │   └── win32.py
│   │       ├── passlib-1.7.4.dist-info/
│   │       │   ├── INSTALLER
│   │       │   ├── LICENSE
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   ├── REQUESTED
│   │       │   ├── top_level.txt
│   │       │   ├── WHEEL
│   │       │   └── zip-safe
│   │       ├── pip/
│   │       │   ├── _internal/
│   │       │   │   ├── build_env/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── base.py
│   │       │   │   │   ├── installer.py
│   │       │   │   │   ├── noop.py
│   │       │   │   │   ├── venv.py
│   │       │   │   │   └── virtual.py
│   │       │   │   ├── cli/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── autocompletion.py
│   │       │   │   │   ├── base_command.py
│   │       │   │   │   ├── cmdoptions.py
│   │       │   │   │   ├── command_context.py
│   │       │   │   │   ├── index_command.py
│   │       │   │   │   ├── main_parser.py
│   │       │   │   │   ├── main.py
│   │       │   │   │   ├── parser.py
│   │       │   │   │   ├── progress_bars.py
│   │       │   │   │   ├── req_command.py
│   │       │   │   │   ├── spinners.py
│   │       │   │   │   └── status_codes.py
│   │       │   │   ├── commands/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── cache.py
│   │       │   │   │   ├── check.py
│   │       │   │   │   ├── completion.py
│   │       │   │   │   ├── configuration.py
│   │       │   │   │   ├── debug.py
│   │       │   │   │   ├── download.py
│   │       │   │   │   ├── freeze.py
│   │       │   │   │   ├── hash.py
│   │       │   │   │   ├── help.py
│   │       │   │   │   ├── index.py
│   │       │   │   │   ├── inspect.py
│   │       │   │   │   ├── install.py
│   │       │   │   │   ├── list.py
│   │       │   │   │   ├── lock.py
│   │       │   │   │   ├── search.py
│   │       │   │   │   ├── show.py
│   │       │   │   │   ├── uninstall.py
│   │       │   │   │   └── wheel.py
│   │       │   │   ├── distributions/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── base.py
│   │       │   │   │   ├── installed.py
│   │       │   │   │   ├── sdist.py
│   │       │   │   │   └── wheel.py
│   │       │   │   ├── index/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── collector.py
│   │       │   │   │   ├── package_finder.py
│   │       │   │   │   └── sources.py
│   │       │   │   ├── locations/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── _distutils.py
│   │       │   │   │   ├── _sysconfig.py
│   │       │   │   │   └── base.py
│   │       │   │   ├── metadata/
│   │       │   │   │   ├── importlib/
│   │       │   │   │   │   ├── __init__.py
│   │       │   │   │   │   ├── _compat.py
│   │       │   │   │   │   ├── _dists.py
│   │       │   │   │   │   └── _envs.py
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── _json.py
│   │       │   │   │   ├── base.py
│   │       │   │   │   └── pkg_resources.py
│   │       │   │   ├── models/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── candidate.py
│   │       │   │   │   ├── direct_url.py
│   │       │   │   │   ├── format_control.py
│   │       │   │   │   ├── index.py
│   │       │   │   │   ├── installation_report.py
│   │       │   │   │   ├── link.py
│   │       │   │   │   ├── release_control.py
│   │       │   │   │   ├── scheme.py
│   │       │   │   │   ├── search_scope.py
│   │       │   │   │   ├── selection_prefs.py
│   │       │   │   │   ├── target_python.py
│   │       │   │   │   └── wheel.py
│   │       │   │   ├── network/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── auth.py
│   │       │   │   │   ├── cache.py
│   │       │   │   │   ├── download.py
│   │       │   │   │   ├── lazy_wheel.py
│   │       │   │   │   ├── session.py
│   │       │   │   │   ├── utils.py
│   │       │   │   │   └── xmlrpc.py
│   │       │   │   ├── operations/
│   │       │   │   │   ├── install/
│   │       │   │   │   │   ├── __init__.py
│   │       │   │   │   │   └── wheel.py
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── check.py
│   │       │   │   │   ├── freeze.py
│   │       │   │   │   └── prepare.py
│   │       │   │   ├── req/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── constructors.py
│   │       │   │   │   ├── pep723.py
│   │       │   │   │   ├── req_dependency_group.py
│   │       │   │   │   ├── req_file.py
│   │       │   │   │   ├── req_install.py
│   │       │   │   │   ├── req_set.py
│   │       │   │   │   └── req_uninstall.py
│   │       │   │   ├── resolution/
│   │       │   │   │   ├── legacy/
│   │       │   │   │   │   ├── __init__.py
│   │       │   │   │   │   └── resolver.py
│   │       │   │   │   ├── resolvelib/
│   │       │   │   │   │   ├── __init__.py
│   │       │   │   │   │   ├── base.py
│   │       │   │   │   │   ├── candidates.py
│   │       │   │   │   │   ├── factory.py
│   │       │   │   │   │   ├── found_candidates.py
│   │       │   │   │   │   ├── provider.py
│   │       │   │   │   │   ├── reporter.py
│   │       │   │   │   │   ├── requirements.py
│   │       │   │   │   │   └── resolver.py
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   └── base.py
│   │       │   │   ├── utils/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── _jaraco_text.py
│   │       │   │   │   ├── _log.py
│   │       │   │   │   ├── appdirs.py
│   │       │   │   │   ├── compat.py
│   │       │   │   │   ├── compatibility_tags.py
│   │       │   │   │   ├── datetime.py
│   │       │   │   │   ├── deprecation.py
│   │       │   │   │   ├── direct_url_helpers.py
│   │       │   │   │   ├── egg_link.py
│   │       │   │   │   ├── entrypoints.py
│   │       │   │   │   ├── filesystem.py
│   │       │   │   │   ├── filetypes.py
│   │       │   │   │   ├── glibc.py
│   │       │   │   │   ├── hashes.py
│   │       │   │   │   ├── logging.py
│   │       │   │   │   ├── misc.py
│   │       │   │   │   ├── packaging.py
│   │       │   │   │   ├── pylock.py
│   │       │   │   │   ├── retry.py
│   │       │   │   │   ├── subprocess.py
│   │       │   │   │   ├── temp_dir.py
│   │       │   │   │   ├── unpacking.py
│   │       │   │   │   ├── urls.py
│   │       │   │   │   ├── virtualenv.py
│   │       │   │   │   └── wheel.py
│   │       │   │   ├── vcs/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── bazaar.py
│   │       │   │   │   ├── git.py
│   │       │   │   │   ├── mercurial.py
│   │       │   │   │   ├── subversion.py
│   │       │   │   │   └── versioncontrol.py
│   │       │   │   ├── __init__.py
│   │       │   │   ├── cache.py
│   │       │   │   ├── configuration.py
│   │       │   │   ├── exceptions.py
│   │       │   │   ├── main.py
│   │       │   │   ├── pyproject.py
│   │       │   │   ├── self_outdated_check.py
│   │       │   │   └── wheel_builder.py
│   │       │   ├── _vendor/
│   │       │   │   ├── cachecontrol/
│   │       │   │   │   ├── caches/
│   │       │   │   │   │   ├── __init__.py
│   │       │   │   │   │   ├── file_cache.py
│   │       │   │   │   │   └── redis_cache.py
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── _cmd.py
│   │       │   │   │   ├── adapter.py
│   │       │   │   │   ├── cache.py
│   │       │   │   │   ├── controller.py
│   │       │   │   │   ├── filewrapper.py
│   │       │   │   │   ├── heuristics.py
│   │       │   │   │   ├── LICENSE.txt
│   │       │   │   │   ├── py.typed
│   │       │   │   │   ├── serialize.py
│   │       │   │   │   └── wrapper.py
│   │       │   │   ├── certifi/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── __main__.py
│   │       │   │   │   ├── cacert.pem
│   │       │   │   │   ├── core.py
│   │       │   │   │   ├── LICENSE
│   │       │   │   │   └── py.typed
│   │       │   │   ├── distlib/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── compat.py
│   │       │   │   │   ├── LICENSE.txt
│   │       │   │   │   ├── resources.py
│   │       │   │   │   ├── scripts.py
│   │       │   │   │   ├── t32.exe
│   │       │   │   │   ├── t64-arm.exe
│   │       │   │   │   ├── t64.exe
│   │       │   │   │   ├── util.py
│   │       │   │   │   ├── w32.exe
│   │       │   │   │   ├── w64-arm.exe
│   │       │   │   │   └── w64.exe
│   │       │   │   ├── distro/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── __main__.py
│   │       │   │   │   ├── distro.py
│   │       │   │   │   ├── LICENSE
│   │       │   │   │   └── py.typed
│   │       │   │   ├── idna/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── __main__.py
│   │       │   │   │   ├── cli.py
│   │       │   │   │   ├── codec.py
│   │       │   │   │   ├── compat.py
│   │       │   │   │   ├── core.py
│   │       │   │   │   ├── idnadata.py
│   │       │   │   │   ├── intranges.py
│   │       │   │   │   ├── LICENSE.md
│   │       │   │   │   ├── package_data.py
│   │       │   │   │   ├── py.typed
│   │       │   │   │   └── uts46data.py
│   │       │   │   ├── msgpack/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── COPYING
│   │       │   │   │   ├── exceptions.py
│   │       │   │   │   ├── ext.py
│   │       │   │   │   └── fallback.py
│   │       │   │   ├── packaging/
│   │       │   │   │   ├── licenses/
│   │       │   │   │   │   ├── __init__.py
│   │       │   │   │   │   └── _spdx.py
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── _elffile.py
│   │       │   │   │   ├── _manylinux.py
│   │       │   │   │   ├── _musllinux.py
│   │       │   │   │   ├── _parser.py
│   │       │   │   │   ├── _structures.py
│   │       │   │   │   ├── _tokenizer.py
│   │       │   │   │   ├── dependency_groups.py
│   │       │   │   │   ├── direct_url.py
│   │       │   │   │   ├── errors.py
│   │       │   │   │   ├── LICENSE
│   │       │   │   │   ├── LICENSE.APACHE
│   │       │   │   │   ├── LICENSE.BSD
│   │       │   │   │   ├── markers.py
│   │       │   │   │   ├── metadata.py
│   │       │   │   │   ├── py.typed
│   │       │   │   │   ├── pylock.py
│   │       │   │   │   ├── requirements.py
│   │       │   │   │   ├── specifiers.py
│   │       │   │   │   ├── tags.py
│   │       │   │   │   ├── utils.py
│   │       │   │   │   └── version.py
│   │       │   │   ├── pkg_resources/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   └── LICENSE
│   │       │   │   ├── platformdirs/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── __main__.py
│   │       │   │   │   ├── _xdg.py
│   │       │   │   │   ├── android.py
│   │       │   │   │   ├── api.py
│   │       │   │   │   ├── LICENSE
│   │       │   │   │   ├── macos.py
│   │       │   │   │   ├── py.typed
│   │       │   │   │   ├── unix.py
│   │       │   │   │   ├── version.py
│   │       │   │   │   └── windows.py
│   │       │   │   ├── pygments/
│   │       │   │   │   ├── filters/
│   │       │   │   │   │   └── __init__.py
│   │       │   │   │   ├── formatters/
│   │       │   │   │   │   ├── __init__.py
│   │       │   │   │   │   └── _mapping.py
│   │       │   │   │   ├── lexers/
│   │       │   │   │   │   ├── __init__.py
│   │       │   │   │   │   ├── _mapping.py
│   │       │   │   │   │   └── python.py
│   │       │   │   │   ├── styles/
│   │       │   │   │   │   ├── __init__.py
│   │       │   │   │   │   └── _mapping.py
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── __main__.py
│   │       │   │   │   ├── console.py
│   │       │   │   │   ├── filter.py
│   │       │   │   │   ├── formatter.py
│   │       │   │   │   ├── lexer.py
│   │       │   │   │   ├── LICENSE
│   │       │   │   │   ├── modeline.py
│   │       │   │   │   ├── plugin.py
│   │       │   │   │   ├── regexopt.py
│   │       │   │   │   ├── scanner.py
│   │       │   │   │   ├── sphinxext.py
│   │       │   │   │   ├── style.py
│   │       │   │   │   ├── token.py
│   │       │   │   │   ├── unistring.py
│   │       │   │   │   └── util.py
│   │       │   │   ├── pyproject_hooks/
│   │       │   │   │   ├── _in_process/
│   │       │   │   │   │   ├── __init__.py
│   │       │   │   │   │   └── _in_process.py
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── _impl.py
│   │       │   │   │   ├── LICENSE
│   │       │   │   │   └── py.typed
│   │       │   │   ├── requests/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── __version__.py
│   │       │   │   │   ├── _internal_utils.py
│   │       │   │   │   ├── _types.py
│   │       │   │   │   ├── adapters.py
│   │       │   │   │   ├── api.py
│   │       │   │   │   ├── auth.py
│   │       │   │   │   ├── certs.py
│   │       │   │   │   ├── compat.py
│   │       │   │   │   ├── cookies.py
│   │       │   │   │   ├── exceptions.py
│   │       │   │   │   ├── help.py
│   │       │   │   │   ├── hooks.py
│   │       │   │   │   ├── LICENSE
│   │       │   │   │   ├── models.py
│   │       │   │   │   ├── packages.py
│   │       │   │   │   ├── py.typed
│   │       │   │   │   ├── sessions.py
│   │       │   │   │   ├── status_codes.py
│   │       │   │   │   ├── structures.py
│   │       │   │   │   └── utils.py
│   │       │   │   ├── resolvelib/
│   │       │   │   │   ├── resolvers/
│   │       │   │   │   │   ├── __init__.py
│   │       │   │   │   │   ├── abstract.py
│   │       │   │   │   │   ├── criterion.py
│   │       │   │   │   │   ├── exceptions.py
│   │       │   │   │   │   └── resolution.py
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── LICENSE
│   │       │   │   │   ├── providers.py
│   │       │   │   │   ├── py.typed
│   │       │   │   │   ├── reporters.py
│   │       │   │   │   └── structs.py
│   │       │   │   ├── rich/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── __main__.py
│   │       │   │   │   ├── _cell_widths.py
│   │       │   │   │   ├── _emoji_codes.py
│   │       │   │   │   ├── _emoji_replace.py
│   │       │   │   │   ├── _export_format.py
│   │       │   │   │   ├── _extension.py
│   │       │   │   │   ├── _fileno.py
│   │       │   │   │   ├── _inspect.py
│   │       │   │   │   ├── _log_render.py
│   │       │   │   │   ├── _loop.py
│   │       │   │   │   ├── _null_file.py
│   │       │   │   │   ├── _palettes.py
│   │       │   │   │   ├── _pick.py
│   │       │   │   │   ├── _ratio.py
│   │       │   │   │   ├── _spinners.py
│   │       │   │   │   ├── _stack.py
│   │       │   │   │   ├── _timer.py
│   │       │   │   │   ├── _win32_console.py
│   │       │   │   │   ├── _windows_renderer.py
│   │       │   │   │   ├── _windows.py
│   │       │   │   │   ├── _wrap.py
│   │       │   │   │   ├── abc.py
│   │       │   │   │   ├── align.py
│   │       │   │   │   ├── ansi.py
│   │       │   │   │   ├── bar.py
│   │       │   │   │   ├── box.py
│   │       │   │   │   ├── cells.py
│   │       │   │   │   ├── color_triplet.py
│   │       │   │   │   ├── color.py
│   │       │   │   │   ├── columns.py
│   │       │   │   │   ├── console.py
│   │       │   │   │   ├── constrain.py
│   │       │   │   │   ├── containers.py
│   │       │   │   │   ├── control.py
│   │       │   │   │   ├── default_styles.py
│   │       │   │   │   ├── diagnose.py
│   │       │   │   │   ├── emoji.py
│   │       │   │   │   ├── errors.py
│   │       │   │   │   ├── file_proxy.py
│   │       │   │   │   ├── filesize.py
│   │       │   │   │   ├── highlighter.py
│   │       │   │   │   ├── json.py
│   │       │   │   │   ├── jupyter.py
│   │       │   │   │   ├── layout.py
│   │       │   │   │   ├── LICENSE
│   │       │   │   │   ├── live_render.py
│   │       │   │   │   ├── live.py
│   │       │   │   │   ├── logging.py
│   │       │   │   │   ├── markup.py
│   │       │   │   │   ├── measure.py
│   │       │   │   │   ├── padding.py
│   │       │   │   │   ├── pager.py
│   │       │   │   │   ├── palette.py
│   │       │   │   │   ├── panel.py
│   │       │   │   │   ├── pretty.py
│   │       │   │   │   ├── progress_bar.py
│   │       │   │   │   ├── progress.py
│   │       │   │   │   ├── prompt.py
│   │       │   │   │   ├── protocol.py
│   │       │   │   │   ├── py.typed
│   │       │   │   │   ├── region.py
│   │       │   │   │   ├── repr.py
│   │       │   │   │   ├── rule.py
│   │       │   │   │   ├── scope.py
│   │       │   │   │   ├── screen.py
│   │       │   │   │   ├── segment.py
│   │       │   │   │   ├── spinner.py
│   │       │   │   │   ├── status.py
│   │       │   │   │   ├── style.py
│   │       │   │   │   ├── styled.py
│   │       │   │   │   ├── syntax.py
│   │       │   │   │   ├── table.py
│   │       │   │   │   ├── terminal_theme.py
│   │       │   │   │   ├── text.py
│   │       │   │   │   ├── theme.py
│   │       │   │   │   ├── themes.py
│   │       │   │   │   ├── traceback.py
│   │       │   │   │   └── tree.py
│   │       │   │   ├── tomli/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── _parser.py
│   │       │   │   │   ├── _re.py
│   │       │   │   │   ├── _types.py
│   │       │   │   │   ├── LICENSE
│   │       │   │   │   └── py.typed
│   │       │   │   ├── tomli_w/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── _writer.py
│   │       │   │   │   ├── LICENSE
│   │       │   │   │   └── py.typed
│   │       │   │   ├── truststore/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── _api.py
│   │       │   │   │   ├── _macos.py
│   │       │   │   │   ├── _openssl.py
│   │       │   │   │   ├── _ssl_constants.py
│   │       │   │   │   ├── _windows.py
│   │       │   │   │   ├── LICENSE
│   │       │   │   │   └── py.typed
│   │       │   │   ├── urllib3/
│   │       │   │   │   ├── contrib/
│   │       │   │   │   │   ├── emscripten/
│   │       │   │   │   │   │   ├── __init__.py
│   │       │   │   │   │   │   ├── connection.py
│   │       │   │   │   │   │   ├── emscripten_fetch_worker.js
│   │       │   │   │   │   │   ├── fetch.py
│   │       │   │   │   │   │   ├── request.py
│   │       │   │   │   │   │   └── response.py
│   │       │   │   │   │   ├── __init__.py
│   │       │   │   │   │   ├── pyopenssl.py
│   │       │   │   │   │   └── socks.py
│   │       │   │   │   ├── http2/
│   │       │   │   │   │   ├── __init__.py
│   │       │   │   │   │   ├── connection.py
│   │       │   │   │   │   └── probe.py
│   │       │   │   │   ├── util/
│   │       │   │   │   │   ├── __init__.py
│   │       │   │   │   │   ├── connection.py
│   │       │   │   │   │   ├── proxy.py
│   │       │   │   │   │   ├── request.py
│   │       │   │   │   │   ├── response.py
│   │       │   │   │   │   ├── retry.py
│   │       │   │   │   │   ├── ssl_.py
│   │       │   │   │   │   ├── ssl_match_hostname.py
│   │       │   │   │   │   ├── ssltransport.py
│   │       │   │   │   │   ├── timeout.py
│   │       │   │   │   │   ├── url.py
│   │       │   │   │   │   ├── util.py
│   │       │   │   │   │   └── wait.py
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── _base_connection.py
│   │       │   │   │   ├── _collections.py
│   │       │   │   │   ├── _request_methods.py
│   │       │   │   │   ├── _version.py
│   │       │   │   │   ├── connection.py
│   │       │   │   │   ├── connectionpool.py
│   │       │   │   │   ├── exceptions.py
│   │       │   │   │   ├── fields.py
│   │       │   │   │   ├── filepost.py
│   │       │   │   │   ├── LICENSE.txt
│   │       │   │   │   ├── poolmanager.py
│   │       │   │   │   ├── py.typed
│   │       │   │   │   └── response.py
│   │       │   │   ├── __init__.py
│   │       │   │   ├── bom.cdx.json
│   │       │   │   ├── README.rst
│   │       │   │   └── vendor.txt
│   │       │   ├── __init__.py
│   │       │   ├── __main__.py
│   │       │   ├── __pip-runner__.py
│   │       │   └── py.typed
│   │       ├── pip-26.2.dist-info/
│   │       │   ├── licenses/
│   │       │   │   ├── src/
│   │       │   │   │   └── pip/
│   │       │   │   │       └── _vendor/
│   │       │   │   │           ├── cachecontrol/
│   │       │   │   │           ├── certifi/
│   │       │   │   │           ├── distlib/
│   │       │   │   │           ├── distro/
│   │       │   │   │           ├── idna/
│   │       │   │   │           ├── msgpack/
│   │       │   │   │           ├── packaging/
│   │       │   │   │           ├── pkg_resources/
│   │       │   │   │           ├── platformdirs/
│   │       │   │   │           ├── pygments/
│   │       │   │   │           ├── pyproject_hooks/
│   │       │   │   │           ├── requests/
│   │       │   │   │           ├── resolvelib/
│   │       │   │   │           ├── rich/
│   │       │   │   │           ├── tomli/
│   │       │   │   │           ├── tomli_w/
│   │       │   │   │           ├── truststore/
│   │       │   │   │           └── urllib3/
│   │       │   │   ├── AUTHORS.txt
│   │       │   │   └── LICENSE.txt
│   │       │   ├── entry_points.txt
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   ├── REQUESTED
│   │       │   └── WHEEL
│   │       ├── pyasn1/
│   │       │   ├── codec/
│   │       │   │   ├── ber/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── decoder.py
│   │       │   │   │   ├── encoder.py
│   │       │   │   │   └── eoo.py
│   │       │   │   ├── cer/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── decoder.py
│   │       │   │   │   └── encoder.py
│   │       │   │   ├── der/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── decoder.py
│   │       │   │   │   └── encoder.py
│   │       │   │   ├── native/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── decoder.py
│   │       │   │   │   └── encoder.py
│   │       │   │   ├── __init__.py
│   │       │   │   └── streaming.py
│   │       │   ├── compat/
│   │       │   │   ├── __init__.py
│   │       │   │   └── integer.py
│   │       │   ├── type/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── base.py
│   │       │   │   ├── char.py
│   │       │   │   ├── constraint.py
│   │       │   │   ├── error.py
│   │       │   │   ├── namedtype.py
│   │       │   │   ├── namedval.py
│   │       │   │   ├── opentype.py
│   │       │   │   ├── tag.py
│   │       │   │   ├── tagmap.py
│   │       │   │   ├── univ.py
│   │       │   │   └── useful.py
│   │       │   ├── __init__.py
│   │       │   ├── debug.py
│   │       │   └── error.py
│   │       ├── pyasn1-0.6.4.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE.rst
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   ├── top_level.txt
│   │       │   ├── WHEEL
│   │       │   └── zip-safe
│   │       ├── pycparser/
│   │       │   ├── __init__.py
│   │       │   ├── _ast_gen.py
│   │       │   ├── _c_ast.cfg
│   │       │   ├── ast_transforms.py
│   │       │   ├── c_ast.py
│   │       │   ├── c_generator.py
│   │       │   ├── c_lexer.py
│   │       │   └── c_parser.py
│   │       ├── pycparser-3.0.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   ├── top_level.txt
│   │       │   └── WHEEL
│   │       ├── pydantic/
│   │       │   ├── _internal/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── _config.py
│   │       │   │   ├── _core_metadata.py
│   │       │   │   ├── _core_utils.py
│   │       │   │   ├── _dataclasses.py
│   │       │   │   ├── _decorators_v1.py
│   │       │   │   ├── _decorators.py
│   │       │   │   ├── _discriminated_union.py
│   │       │   │   ├── _docs_extraction.py
│   │       │   │   ├── _fields.py
│   │       │   │   ├── _forward_ref.py
│   │       │   │   ├── _generate_schema.py
│   │       │   │   ├── _generics.py
│   │       │   │   ├── _git.py
│   │       │   │   ├── _import_utils.py
│   │       │   │   ├── _internal_dataclass.py
│   │       │   │   ├── _known_annotated_metadata.py
│   │       │   │   ├── _mock_val_ser.py
│   │       │   │   ├── _model_construction.py
│   │       │   │   ├── _namespace_utils.py
│   │       │   │   ├── _repr.py
│   │       │   │   ├── _schema_gather.py
│   │       │   │   ├── _schema_generation_shared.py
│   │       │   │   ├── _serializers.py
│   │       │   │   ├── _signature.py
│   │       │   │   ├── _typing_extra.py
│   │       │   │   ├── _utils.py
│   │       │   │   ├── _validate_call.py
│   │       │   │   └── _validators.py
│   │       │   ├── deprecated/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── class_validators.py
│   │       │   │   ├── config.py
│   │       │   │   ├── copy_internals.py
│   │       │   │   ├── decorator.py
│   │       │   │   ├── json.py
│   │       │   │   ├── parse.py
│   │       │   │   └── tools.py
│   │       │   ├── experimental/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── arguments_schema.py
│   │       │   │   ├── missing_sentinel.py
│   │       │   │   └── pipeline.py
│   │       │   ├── plugin/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── _loader.py
│   │       │   │   └── _schema_validator.py
│   │       │   ├── v1/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── _hypothesis_plugin.py
│   │       │   │   ├── annotated_types.py
│   │       │   │   ├── class_validators.py
│   │       │   │   ├── color.py
│   │       │   │   ├── config.py
│   │       │   │   ├── dataclasses.py
│   │       │   │   ├── datetime_parse.py
│   │       │   │   ├── decorator.py
│   │       │   │   ├── env_settings.py
│   │       │   │   ├── error_wrappers.py
│   │       │   │   ├── errors.py
│   │       │   │   ├── fields.py
│   │       │   │   ├── generics.py
│   │       │   │   ├── json.py
│   │       │   │   ├── main.py
│   │       │   │   ├── mypy.py
│   │       │   │   ├── networks.py
│   │       │   │   ├── parse.py
│   │       │   │   ├── py.typed
│   │       │   │   ├── schema.py
│   │       │   │   ├── tools.py
│   │       │   │   ├── types.py
│   │       │   │   ├── typing.py
│   │       │   │   ├── utils.py
│   │       │   │   ├── validators.py
│   │       │   │   └── version.py
│   │       │   ├── __init__.py
│   │       │   ├── _migration.py
│   │       │   ├── alias_generators.py
│   │       │   ├── aliases.py
│   │       │   ├── annotated_handlers.py
│   │       │   ├── class_validators.py
│   │       │   ├── color.py
│   │       │   ├── config.py
│   │       │   ├── dataclasses.py
│   │       │   ├── datetime_parse.py
│   │       │   ├── decorator.py
│   │       │   ├── env_settings.py
│   │       │   ├── error_wrappers.py
│   │       │   ├── errors.py
│   │       │   ├── fields.py
│   │       │   ├── functional_serializers.py
│   │       │   ├── functional_validators.py
│   │       │   ├── generics.py
│   │       │   ├── json_schema.py
│   │       │   ├── json.py
│   │       │   ├── main.py
│   │       │   ├── mypy.py
│   │       │   ├── networks.py
│   │       │   ├── parse.py
│   │       │   ├── py.typed
│   │       │   ├── root_model.py
│   │       │   ├── schema.py
│   │       │   ├── tools.py
│   │       │   ├── type_adapter.py
│   │       │   ├── types.py
│   │       │   ├── typing.py
│   │       │   ├── utils.py
│   │       │   ├── validate_call_decorator.py
│   │       │   ├── validators.py
│   │       │   ├── version.py
│   │       │   └── warnings.py
│   │       ├── pydantic_core/
│   │       │   ├── __init__.py
│   │       │   ├── _pydantic_core.cp314-win_amd64.pyd
│   │       │   ├── _pydantic_core.pyi
│   │       │   ├── core_schema.py
│   │       │   └── py.typed
│   │       ├── pydantic_core-2.46.4.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE
│   │       │   ├── sboms/
│   │       │   │   └── pydantic-core.cyclonedx.json
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   └── WHEEL
│   │       ├── pydantic_settings/
│   │       │   ├── sources/
│   │       │   │   ├── providers/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── aws.py
│   │       │   │   │   ├── azure.py
│   │       │   │   │   ├── cli.py
│   │       │   │   │   ├── dotenv.py
│   │       │   │   │   ├── env.py
│   │       │   │   │   ├── gcp.py
│   │       │   │   │   ├── json.py
│   │       │   │   │   ├── nested_secrets.py
│   │       │   │   │   ├── pyproject.py
│   │       │   │   │   ├── secrets.py
│   │       │   │   │   ├── toml.py
│   │       │   │   │   └── yaml.py
│   │       │   │   ├── __init__.py
│   │       │   │   ├── base.py
│   │       │   │   ├── types.py
│   │       │   │   └── utils.py
│   │       │   ├── __init__.py
│   │       │   ├── exceptions.py
│   │       │   ├── main.py
│   │       │   ├── py.typed
│   │       │   ├── utils.py
│   │       │   └── version.py
│   │       ├── pydantic_settings-2.14.2.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   ├── REQUESTED
│   │       │   └── WHEEL
│   │       ├── pydantic-2.13.4.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   ├── REQUESTED
│   │       │   └── WHEEL
│   │       ├── python_dotenv-1.2.2.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE
│   │       │   ├── entry_points.txt
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   ├── top_level.txt
│   │       │   └── WHEEL
│   │       ├── python_jose-3.5.0.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   ├── REQUESTED
│   │       │   ├── top_level.txt
│   │       │   └── WHEEL
│   │       ├── python_multipart/
│   │       │   ├── __init__.py
│   │       │   ├── decoders.py
│   │       │   ├── exceptions.py
│   │       │   ├── multipart.py
│   │       │   └── py.typed
│   │       ├── python_multipart-0.0.32.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE.txt
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   ├── REQUESTED
│   │       │   └── WHEEL
│   │       ├── pyyaml-6.0.3.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   ├── top_level.txt
│   │       │   └── WHEEL
│   │       ├── redis/
│   │       │   ├── _parsers/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── base.py
│   │       │   │   ├── commands.py
│   │       │   │   ├── encoders.py
│   │       │   │   ├── helpers.py
│   │       │   │   ├── hiredis.py
│   │       │   │   ├── resp2.py
│   │       │   │   ├── resp3.py
│   │       │   │   ├── response_callbacks.py
│   │       │   │   └── socket.py
│   │       │   ├── asyncio/
│   │       │   │   ├── http/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   └── http_client.py
│   │       │   │   ├── multidb/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── client.py
│   │       │   │   │   ├── command_executor.py
│   │       │   │   │   ├── config.py
│   │       │   │   │   ├── database.py
│   │       │   │   │   ├── event.py
│   │       │   │   │   ├── failover.py
│   │       │   │   │   ├── failure_detector.py
│   │       │   │   │   └── healthcheck.py
│   │       │   │   ├── observability/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   └── recorder.py
│   │       │   │   ├── __init__.py
│   │       │   │   ├── _himport_exec.py
│   │       │   │   ├── client.py
│   │       │   │   ├── cluster.py
│   │       │   │   ├── connection.py
│   │       │   │   ├── keyspace_notifications.py
│   │       │   │   ├── lock.py
│   │       │   │   ├── maint_notifications.py
│   │       │   │   ├── retry.py
│   │       │   │   ├── sentinel.py
│   │       │   │   └── utils.py
│   │       │   ├── auth/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── err.py
│   │       │   │   ├── idp.py
│   │       │   │   ├── token_manager.py
│   │       │   │   └── token.py
│   │       │   ├── commands/
│   │       │   │   ├── bf/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── commands.py
│   │       │   │   │   └── info.py
│   │       │   │   ├── json/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── _util.py
│   │       │   │   │   ├── commands.py
│   │       │   │   │   ├── decoders.py
│   │       │   │   │   └── path.py
│   │       │   │   ├── search/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── _util.py
│   │       │   │   │   ├── aggregation.py
│   │       │   │   │   ├── commands.py
│   │       │   │   │   ├── dialect.py
│   │       │   │   │   ├── document.py
│   │       │   │   │   ├── field.py
│   │       │   │   │   ├── hybrid_query.py
│   │       │   │   │   ├── hybrid_result.py
│   │       │   │   │   ├── index_definition.py
│   │       │   │   │   ├── profile_information.py
│   │       │   │   │   ├── query.py
│   │       │   │   │   ├── querystring.py
│   │       │   │   │   ├── reducers.py
│   │       │   │   │   ├── result.py
│   │       │   │   │   └── suggestion.py
│   │       │   │   ├── timeseries/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── commands.py
│   │       │   │   │   ├── info.py
│   │       │   │   │   └── utils.py
│   │       │   │   ├── vectorset/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── commands.py
│   │       │   │   │   └── utils.py
│   │       │   │   ├── __init__.py
│   │       │   │   ├── cluster.py
│   │       │   │   ├── core.py
│   │       │   │   ├── helpers.py
│   │       │   │   ├── policies.py
│   │       │   │   ├── redismodules.py
│   │       │   │   └── sentinel.py
│   │       │   ├── http/
│   │       │   │   ├── __init__.py
│   │       │   │   └── http_client.py
│   │       │   ├── multidb/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── circuit.py
│   │       │   │   ├── client.py
│   │       │   │   ├── command_executor.py
│   │       │   │   ├── config.py
│   │       │   │   ├── database.py
│   │       │   │   ├── event.py
│   │       │   │   ├── exception.py
│   │       │   │   ├── failover.py
│   │       │   │   └── failure_detector.py
│   │       │   ├── observability/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── attributes.py
│   │       │   │   ├── config.py
│   │       │   │   ├── metrics.py
│   │       │   │   ├── providers.py
│   │       │   │   ├── recorder.py
│   │       │   │   └── registry.py
│   │       │   ├── __init__.py
│   │       │   ├── _defaults.py
│   │       │   ├── _himport_exec.py
│   │       │   ├── background.py
│   │       │   ├── backoff.py
│   │       │   ├── cache.py
│   │       │   ├── client.py
│   │       │   ├── cluster.py
│   │       │   ├── connection.py
│   │       │   ├── crc.py
│   │       │   ├── credentials.py
│   │       │   ├── data_structure.py
│   │       │   ├── driver_info.py
│   │       │   ├── event.py
│   │       │   ├── exceptions.py
│   │       │   ├── himport.py
│   │       │   ├── keyspace_notifications.py
│   │       │   ├── lock.py
│   │       │   ├── maint_notifications.py
│   │       │   ├── ocsp.py
│   │       │   ├── py.typed
│   │       │   ├── retry.py
│   │       │   ├── sentinel.py
│   │       │   ├── typing.py
│   │       │   └── utils.py
│   │       ├── redis-8.1.0.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   ├── REQUESTED
│   │       │   └── WHEEL
│   │       ├── rsa/
│   │       │   ├── __init__.py
│   │       │   ├── asn1.py
│   │       │   ├── cli.py
│   │       │   ├── common.py
│   │       │   ├── core.py
│   │       │   ├── key.py
│   │       │   ├── parallel.py
│   │       │   ├── pem.py
│   │       │   ├── pkcs1_v2.py
│   │       │   ├── pkcs1.py
│   │       │   ├── prime.py
│   │       │   ├── py.typed
│   │       │   ├── randnum.py
│   │       │   ├── transform.py
│   │       │   └── util.py
│   │       ├── rsa-4.9.1.dist-info/
│   │       │   ├── entry_points.txt
│   │       │   ├── INSTALLER
│   │       │   ├── LICENSE
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   └── WHEEL
│   │       ├── six-1.17.0.dist-info/
│   │       │   ├── INSTALLER
│   │       │   ├── LICENSE
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   ├── top_level.txt
│   │       │   └── WHEEL
│   │       ├── sqlalchemy/
│   │       │   ├── connectors/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── aioodbc.py
│   │       │   │   ├── asyncio.py
│   │       │   │   └── pyodbc.py
│   │       │   ├── cyextension/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── collections.cp314-win_amd64.pyd
│   │       │   │   ├── collections.pyx
│   │       │   │   ├── immutabledict.cp314-win_amd64.pyd
│   │       │   │   ├── immutabledict.pxd
│   │       │   │   ├── immutabledict.pyx
│   │       │   │   ├── processors.cp314-win_amd64.pyd
│   │       │   │   ├── processors.pyx
│   │       │   │   ├── resultproxy.cp314-win_amd64.pyd
│   │       │   │   ├── resultproxy.pyx
│   │       │   │   ├── util.cp314-win_amd64.pyd
│   │       │   │   └── util.pyx
│   │       │   ├── dialects/
│   │       │   │   ├── mssql/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── aioodbc.py
│   │       │   │   │   ├── base.py
│   │       │   │   │   ├── information_schema.py
│   │       │   │   │   ├── json.py
│   │       │   │   │   ├── provision.py
│   │       │   │   │   ├── pymssql.py
│   │       │   │   │   └── pyodbc.py
│   │       │   │   ├── mysql/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── aiomysql.py
│   │       │   │   │   ├── asyncmy.py
│   │       │   │   │   ├── base.py
│   │       │   │   │   ├── cymysql.py
│   │       │   │   │   ├── dml.py
│   │       │   │   │   ├── enumerated.py
│   │       │   │   │   ├── expression.py
│   │       │   │   │   ├── json.py
│   │       │   │   │   ├── mariadb.py
│   │       │   │   │   ├── mariadbconnector.py
│   │       │   │   │   ├── mysqlconnector.py
│   │       │   │   │   ├── mysqldb.py
│   │       │   │   │   ├── provision.py
│   │       │   │   │   ├── pymysql.py
│   │       │   │   │   ├── pyodbc.py
│   │       │   │   │   ├── reflection.py
│   │       │   │   │   ├── reserved_words.py
│   │       │   │   │   └── types.py
│   │       │   │   ├── oracle/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── base.py
│   │       │   │   │   ├── cx_oracle.py
│   │       │   │   │   ├── dictionary.py
│   │       │   │   │   ├── oracledb.py
│   │       │   │   │   ├── provision.py
│   │       │   │   │   ├── types.py
│   │       │   │   │   └── vector.py
│   │       │   │   ├── postgresql/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── _psycopg_common.py
│   │       │   │   │   ├── array.py
│   │       │   │   │   ├── asyncpg.py
│   │       │   │   │   ├── base.py
│   │       │   │   │   ├── dml.py
│   │       │   │   │   ├── ext.py
│   │       │   │   │   ├── hstore.py
│   │       │   │   │   ├── json.py
│   │       │   │   │   ├── named_types.py
│   │       │   │   │   ├── operators.py
│   │       │   │   │   ├── pg_catalog.py
│   │       │   │   │   ├── pg8000.py
│   │       │   │   │   ├── provision.py
│   │       │   │   │   ├── psycopg.py
│   │       │   │   │   ├── psycopg2.py
│   │       │   │   │   ├── psycopg2cffi.py
│   │       │   │   │   ├── ranges.py
│   │       │   │   │   └── types.py
│   │       │   │   ├── sqlite/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── aiosqlite.py
│   │       │   │   │   ├── base.py
│   │       │   │   │   ├── dml.py
│   │       │   │   │   ├── json.py
│   │       │   │   │   ├── provision.py
│   │       │   │   │   ├── pysqlcipher.py
│   │       │   │   │   └── pysqlite.py
│   │       │   │   ├── __init__.py
│   │       │   │   ├── _typing.py
│   │       │   │   └── type_migration_guidelines.txt
│   │       │   ├── engine/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── _py_processors.py
│   │       │   │   ├── _py_row.py
│   │       │   │   ├── _py_util.py
│   │       │   │   ├── base.py
│   │       │   │   ├── characteristics.py
│   │       │   │   ├── create.py
│   │       │   │   ├── cursor.py
│   │       │   │   ├── default.py
│   │       │   │   ├── events.py
│   │       │   │   ├── interfaces.py
│   │       │   │   ├── mock.py
│   │       │   │   ├── processors.py
│   │       │   │   ├── reflection.py
│   │       │   │   ├── result.py
│   │       │   │   ├── row.py
│   │       │   │   ├── strategies.py
│   │       │   │   ├── url.py
│   │       │   │   └── util.py
│   │       │   ├── event/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── api.py
│   │       │   │   ├── attr.py
│   │       │   │   ├── base.py
│   │       │   │   ├── legacy.py
│   │       │   │   └── registry.py
│   │       │   ├── ext/
│   │       │   │   ├── asyncio/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── base.py
│   │       │   │   │   ├── engine.py
│   │       │   │   │   ├── exc.py
│   │       │   │   │   ├── result.py
│   │       │   │   │   ├── scoping.py
│   │       │   │   │   └── session.py
│   │       │   │   ├── declarative/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   └── extensions.py
│   │       │   │   ├── mypy/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── apply.py
│   │       │   │   │   ├── decl_class.py
│   │       │   │   │   ├── infer.py
│   │       │   │   │   ├── names.py
│   │       │   │   │   ├── plugin.py
│   │       │   │   │   └── util.py
│   │       │   │   ├── __init__.py
│   │       │   │   ├── associationproxy.py
│   │       │   │   ├── automap.py
│   │       │   │   ├── baked.py
│   │       │   │   ├── compiler.py
│   │       │   │   ├── horizontal_shard.py
│   │       │   │   ├── hybrid.py
│   │       │   │   ├── indexable.py
│   │       │   │   ├── instrumentation.py
│   │       │   │   ├── mutable.py
│   │       │   │   ├── orderinglist.py
│   │       │   │   └── serializer.py
│   │       │   ├── future/
│   │       │   │   ├── __init__.py
│   │       │   │   └── engine.py
│   │       │   ├── orm/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── _orm_constructors.py
│   │       │   │   ├── _typing.py
│   │       │   │   ├── attributes.py
│   │       │   │   ├── base.py
│   │       │   │   ├── bulk_persistence.py
│   │       │   │   ├── clsregistry.py
│   │       │   │   ├── collections.py
│   │       │   │   ├── context.py
│   │       │   │   ├── decl_api.py
│   │       │   │   ├── decl_base.py
│   │       │   │   ├── dependency.py
│   │       │   │   ├── descriptor_props.py
│   │       │   │   ├── dynamic.py
│   │       │   │   ├── evaluator.py
│   │       │   │   ├── events.py
│   │       │   │   ├── exc.py
│   │       │   │   ├── identity.py
│   │       │   │   ├── instrumentation.py
│   │       │   │   ├── interfaces.py
│   │       │   │   ├── loading.py
│   │       │   │   ├── mapped_collection.py
│   │       │   │   ├── mapper.py
│   │       │   │   ├── path_registry.py
│   │       │   │   ├── persistence.py
│   │       │   │   ├── properties.py
│   │       │   │   ├── query.py
│   │       │   │   ├── relationships.py
│   │       │   │   ├── scoping.py
│   │       │   │   ├── session.py
│   │       │   │   ├── state_changes.py
│   │       │   │   ├── state.py
│   │       │   │   ├── strategies.py
│   │       │   │   ├── strategy_options.py
│   │       │   │   ├── sync.py
│   │       │   │   ├── unitofwork.py
│   │       │   │   ├── util.py
│   │       │   │   └── writeonly.py
│   │       │   ├── pool/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── base.py
│   │       │   │   ├── events.py
│   │       │   │   └── impl.py
│   │       │   ├── sql/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── _dml_constructors.py
│   │       │   │   ├── _elements_constructors.py
│   │       │   │   ├── _orm_types.py
│   │       │   │   ├── _py_util.py
│   │       │   │   ├── _selectable_constructors.py
│   │       │   │   ├── _typing.py
│   │       │   │   ├── annotation.py
│   │       │   │   ├── base.py
│   │       │   │   ├── cache_key.py
│   │       │   │   ├── coercions.py
│   │       │   │   ├── compiler.py
│   │       │   │   ├── crud.py
│   │       │   │   ├── ddl.py
│   │       │   │   ├── default_comparator.py
│   │       │   │   ├── dml.py
│   │       │   │   ├── elements.py
│   │       │   │   ├── events.py
│   │       │   │   ├── expression.py
│   │       │   │   ├── functions.py
│   │       │   │   ├── lambdas.py
│   │       │   │   ├── naming.py
│   │       │   │   ├── operators.py
│   │       │   │   ├── roles.py
│   │       │   │   ├── schema.py
│   │       │   │   ├── selectable.py
│   │       │   │   ├── sqltypes.py
│   │       │   │   ├── traversals.py
│   │       │   │   ├── type_api.py
│   │       │   │   ├── util.py
│   │       │   │   └── visitors.py
│   │       │   ├── testing/
│   │       │   │   ├── fixtures/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── base.py
│   │       │   │   │   ├── mypy.py
│   │       │   │   │   ├── orm.py
│   │       │   │   │   └── sql.py
│   │       │   │   ├── plugin/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── bootstrap.py
│   │       │   │   │   ├── plugin_base.py
│   │       │   │   │   └── pytestplugin.py
│   │       │   │   ├── suite/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── test_cte.py
│   │       │   │   │   ├── test_ddl.py
│   │       │   │   │   ├── test_deprecations.py
│   │       │   │   │   ├── test_dialect.py
│   │       │   │   │   ├── test_insert.py
│   │       │   │   │   ├── test_reflection.py
│   │       │   │   │   ├── test_results.py
│   │       │   │   │   ├── test_rowcount.py
│   │       │   │   │   ├── test_select.py
│   │       │   │   │   ├── test_sequence.py
│   │       │   │   │   ├── test_types.py
│   │       │   │   │   ├── test_unicode_ddl.py
│   │       │   │   │   └── test_update_delete.py
│   │       │   │   ├── __init__.py
│   │       │   │   ├── assertions.py
│   │       │   │   ├── assertsql.py
│   │       │   │   ├── asyncio.py
│   │       │   │   ├── config.py
│   │       │   │   ├── engines.py
│   │       │   │   ├── entities.py
│   │       │   │   ├── exclusions.py
│   │       │   │   ├── pickleable.py
│   │       │   │   ├── profiling.py
│   │       │   │   ├── provision.py
│   │       │   │   ├── requirements.py
│   │       │   │   ├── schema.py
│   │       │   │   ├── util.py
│   │       │   │   └── warnings.py
│   │       │   ├── util/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── _collections.py
│   │       │   │   ├── _concurrency_py3k.py
│   │       │   │   ├── _has_cy.py
│   │       │   │   ├── _py_collections.py
│   │       │   │   ├── compat.py
│   │       │   │   ├── concurrency.py
│   │       │   │   ├── deprecations.py
│   │       │   │   ├── langhelpers.py
│   │       │   │   ├── preloaded.py
│   │       │   │   ├── queue.py
│   │       │   │   ├── tool_support.py
│   │       │   │   ├── topological.py
│   │       │   │   └── typing.py
│   │       │   ├── __init__.py
│   │       │   ├── events.py
│   │       │   ├── exc.py
│   │       │   ├── inspection.py
│   │       │   ├── log.py
│   │       │   ├── py.typed
│   │       │   ├── schema.py
│   │       │   └── types.py
│   │       ├── sqlalchemy-2.0.51.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   ├── REQUESTED
│   │       │   ├── top_level.txt
│   │       │   └── WHEEL
│   │       ├── starlette/
│   │       │   ├── middleware/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── authentication.py
│   │       │   │   ├── base.py
│   │       │   │   ├── cors.py
│   │       │   │   ├── errors.py
│   │       │   │   ├── exceptions.py
│   │       │   │   ├── gzip.py
│   │       │   │   ├── httpsredirect.py
│   │       │   │   ├── sessions.py
│   │       │   │   ├── trustedhost.py
│   │       │   │   └── wsgi.py
│   │       │   ├── __init__.py
│   │       │   ├── _exception_handler.py
│   │       │   ├── _utils.py
│   │       │   ├── applications.py
│   │       │   ├── authentication.py
│   │       │   ├── background.py
│   │       │   ├── concurrency.py
│   │       │   ├── config.py
│   │       │   ├── convertors.py
│   │       │   ├── datastructures.py
│   │       │   ├── endpoints.py
│   │       │   ├── exceptions.py
│   │       │   ├── formparsers.py
│   │       │   ├── py.typed
│   │       │   ├── requests.py
│   │       │   ├── responses.py
│   │       │   ├── routing.py
│   │       │   ├── schemas.py
│   │       │   ├── staticfiles.py
│   │       │   ├── status.py
│   │       │   ├── templating.py
│   │       │   ├── testclient.py
│   │       │   ├── types.py
│   │       │   └── websockets.py
│   │       ├── starlette-1.3.1.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE.md
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   └── WHEEL
│   │       ├── typing_extensions-4.16.0.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   └── WHEEL
│   │       ├── typing_inspection/
│   │       │   ├── __init__.py
│   │       │   ├── introspection.py
│   │       │   ├── py.typed
│   │       │   ├── typing_objects.py
│   │       │   └── typing_objects.pyi
│   │       ├── typing_inspection-0.4.2.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   └── WHEEL
│   │       ├── uvicorn/
│   │       │   ├── lifespan/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── off.py
│   │       │   │   └── on.py
│   │       │   ├── loops/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── asyncio.py
│   │       │   │   ├── auto.py
│   │       │   │   └── uvloop.py
│   │       │   ├── middleware/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── asgi2.py
│   │       │   │   ├── message_logger.py
│   │       │   │   ├── proxy_headers.py
│   │       │   │   └── wsgi.py
│   │       │   ├── protocols/
│   │       │   │   ├── http/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── auto.py
│   │       │   │   │   ├── flow_control.py
│   │       │   │   │   ├── h11_impl.py
│   │       │   │   │   ├── httptools_impl.py
│   │       │   │   │   └── zttp_impl.py
│   │       │   │   ├── websockets/
│   │       │   │   │   ├── __init__.py
│   │       │   │   │   ├── auto.py
│   │       │   │   │   ├── websockets_impl.py
│   │       │   │   │   ├── websockets_sansio_impl.py
│   │       │   │   │   └── wsproto_impl.py
│   │       │   │   ├── __init__.py
│   │       │   │   └── utils.py
│   │       │   ├── supervisors/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── basereload.py
│   │       │   │   ├── multiprocess.py
│   │       │   │   ├── statreload.py
│   │       │   │   └── watchfilesreload.py
│   │       │   ├── __init__.py
│   │       │   ├── __main__.py
│   │       │   ├── _ansi.py
│   │       │   ├── _compat.py
│   │       │   ├── _subprocess.py
│   │       │   ├── _types.py
│   │       │   ├── config.py
│   │       │   ├── importer.py
│   │       │   ├── logging.py
│   │       │   ├── main.py
│   │       │   ├── py.typed
│   │       │   ├── server.py
│   │       │   └── workers.py
│   │       ├── uvicorn-0.52.1.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE.md
│   │       │   ├── entry_points.txt
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   ├── REQUESTED
│   │       │   └── WHEEL
│   │       ├── watchfiles/
│   │       │   ├── __init__.py
│   │       │   ├── __main__.py
│   │       │   ├── _rust_notify.cp314-win_amd64.pyd
│   │       │   ├── _rust_notify.pyi
│   │       │   ├── cli.py
│   │       │   ├── filters.py
│   │       │   ├── main.py
│   │       │   ├── py.typed
│   │       │   ├── run.py
│   │       │   └── version.py
│   │       ├── watchfiles-1.2.0.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE
│   │       │   ├── sboms/
│   │       │   │   └── watchfiles_rust_notify.cyclonedx.json
│   │       │   ├── entry_points.txt
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   └── WHEEL
│   │       ├── websockets/
│   │       │   ├── asyncio/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── client.py
│   │       │   │   ├── connection.py
│   │       │   │   ├── messages.py
│   │       │   │   ├── router.py
│   │       │   │   └── server.py
│   │       │   ├── extensions/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── base.py
│   │       │   │   └── permessage_deflate.py
│   │       │   ├── legacy/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── auth.py
│   │       │   │   ├── client.py
│   │       │   │   ├── exceptions.py
│   │       │   │   ├── framing.py
│   │       │   │   ├── handshake.py
│   │       │   │   ├── http.py
│   │       │   │   ├── protocol.py
│   │       │   │   └── server.py
│   │       │   ├── sync/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── client.py
│   │       │   │   ├── connection.py
│   │       │   │   ├── messages.py
│   │       │   │   ├── router.py
│   │       │   │   ├── server.py
│   │       │   │   └── utils.py
│   │       │   ├── trio/
│   │       │   │   ├── __init__.py
│   │       │   │   ├── client.py
│   │       │   │   ├── connection.py
│   │       │   │   ├── messages.py
│   │       │   │   ├── router.py
│   │       │   │   ├── server.py
│   │       │   │   └── utils.py
│   │       │   ├── __init__.py
│   │       │   ├── __main__.py
│   │       │   ├── auth.py
│   │       │   ├── cli.py
│   │       │   ├── client.py
│   │       │   ├── connection.py
│   │       │   ├── datastructures.py
│   │       │   ├── exceptions.py
│   │       │   ├── frames.py
│   │       │   ├── headers.py
│   │       │   ├── http11.py
│   │       │   ├── imports.py
│   │       │   ├── protocol.py
│   │       │   ├── proxy.py
│   │       │   ├── py.typed
│   │       │   ├── server.py
│   │       │   ├── speedups.c
│   │       │   ├── speedups.cp314-win_amd64.pyd
│   │       │   ├── speedups.pyi
│   │       │   ├── streams.py
│   │       │   ├── typing.py
│   │       │   ├── uri.py
│   │       │   ├── utils.py
│   │       │   └── version.py
│   │       ├── websockets-17.0.1.dist-info/
│   │       │   ├── licenses/
│   │       │   │   └── LICENSE
│   │       │   ├── entry_points.txt
│   │       │   ├── INSTALLER
│   │       │   ├── METADATA
│   │       │   ├── RECORD
│   │       │   ├── top_level.txt
│   │       │   └── WHEEL
│   │       ├── yaml/
│   │       │   ├── __init__.py
│   │       │   ├── _yaml.cp314-win_amd64.pyd
│   │       │   ├── composer.py
│   │       │   ├── constructor.py
│   │       │   ├── cyaml.py
│   │       │   ├── dumper.py
│   │       │   ├── emitter.py
│   │       │   ├── error.py
│   │       │   ├── events.py
│   │       │   ├── loader.py
│   │       │   ├── nodes.py
│   │       │   ├── parser.py
│   │       │   ├── reader.py
│   │       │   ├── representer.py
│   │       │   ├── resolver.py
│   │       │   ├── scanner.py
│   │       │   ├── serializer.py
│   │       │   └── tokens.py
│   │       ├── _cffi_backend.cp314-win_amd64.pyd
│   │       ├── six.py
│   │       └── typing_extensions.py
│   ├── Scripts/
│   │   ├── activate
│   │   ├── activate.bat
│   │   ├── activate.fish
│   │   ├── Activate.ps1
│   │   ├── alembic.exe
│   │   ├── cffi-gen-src.exe
│   │   ├── deactivate.bat
│   │   ├── dotenv.exe
│   │   ├── email_validator.exe
│   │   ├── fastapi.exe
│   │   ├── httpx.exe
│   │   ├── idna.exe
│   │   ├── mako-render.exe
│   │   ├── pip.exe
│   │   ├── pip3.14.exe
│   │   ├── pip3.exe
│   │   ├── pyrsa-decrypt.exe
│   │   ├── pyrsa-encrypt.exe
│   │   ├── pyrsa-keygen.exe
│   │   ├── pyrsa-priv2pub.exe
│   │   ├── pyrsa-sign.exe
│   │   ├── pyrsa-verify.exe
│   │   ├── python.exe
│   │   ├── pythonw.exe
│   │   ├── uvicorn.exe
│   │   ├── watchfiles.exe
│   │   └── websockets.exe
│   └── pyvenv.cfg
├── alembic.ini
├── README.md
├── requirements.txt
├── test_api.py
└── test_jikan.py
```