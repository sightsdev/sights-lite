# Sights Lite

![Screenshot](screenshot.png)

A rewrite of [Sights](https://github.com/sightsdev/sights), designed to address the steep learning curve, outdated framework and difficult extensibility.

It presently makes a number of core design decisions different to Sights including a purely declarative semi-stateless model based on a single hardware configuration file, RESTful APIs instead of WebSockets, and recurring API calls instead of streaming of sensor data. Some of these decisions may change before the final version.

It uses a modern stack: React on the frontend and Starlette/FastAPI (Python) on the backend. Frontend uses Typescript with endpoints generated from the backend applications. UI is primarily built using TailwindCSS.

Still in early stages of development. It may eventually replace Sights (as Sights 2.0) once a suitable level of extensibility (particularly some sort of plugin support) and abstraction from the rescue robotics domain is reached. 

### Quick start

- **Prerequisites**: Python 3.11+ and Node 18+. Prefer Yarn for the frontend.

#### Backend (FastAPI)

The backend uses [Python virtual environments](https://docs.python.org/3/library/venv.html).

```bash
# From the repo root
cd server
python3 -m venv .venv
source .venv/bin/activate
pip install -r ../requirements.txt

# Run the API (http://127.0.0.1:8000)
uvicorn server:app --reload --host 127.0.0.1 --port 8000
```

- **Config**: Edit `server/settings.toml` to enable/disable components (drive, arm, cameras, sensors). Changes can be hot‑reloaded via `POST /api/reload` or by restarting the server.

#### Frontend (React)

```bash
# In a separate terminal, still at repo root
yarn install
yarn start
```

- The dev server runs on `http://localhost:3000` and forwards `/api/*` to `http://127.0.0.1:8000`.

#### Generate API client (optional)

If you change backend endpoints, regenerate the typed client (backend must be running):

```bash
yarn generate-client
```

#### Production build

```bash
yarn build
# Start the backend from the `server` directory as above; FastAPI serves the static build mounted at '/'
```

That’s it — backend on `:8000`, frontend on `:3000` (dev) or served by FastAPI (prod).
