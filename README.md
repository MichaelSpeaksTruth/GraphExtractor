# Graph Extractor AI - Technical Documentation

## 1. Overview
Graph Extractor AI is a web application designed to extract embedded raster graphics (charts, graphs, figures) from research paper PDFs. It utilizes a deterministic extraction method via PyMuPDF (`fitz`), avoiding LLM-based hallucination, excessive compute overhead, and high latency. 

The architecture is split into a frontend client and a backend API, optimized specifically for free-tier hosting limits (e.g., Render's 512MB RAM limit and Vercel's 10-second serverless timeout).

### Architecture Stack
* **Frontend:** Next.js (React), TailwindCSS, TypeScript.
* **Backend:** FastAPI (Python), PyMuPDF (`fitz`), Uvicorn.
* **Data Transfer Protocol:** In-memory Base64 JSON payloads (no persistent disk writes).

---

## 2. Usage Instructions
1. Navigate to the frontend URL.
2. Drag and drop a valid `.pdf` file into the upload zone, or click the zone to open the file picker.
3. The file is sent via `POST /extract` to the backend.
4. The backend iterates through the PDF pages, extracts embedded objects, converts them to Base64, and returns a JSON payload.
5. The frontend decodes and renders the extracted images in a masonry gallery.
6. Users can download individual images via the provided action buttons.

---

## 3. Local Development Setup

### Backend
1. Navigate to the `backend` directory.
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *The API will be available at `http://localhost:8000`.*

### Frontend
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The client will be available at `http://localhost:3000`.*

---

## 4. Deployment & Infrastructure Guidelines

### 4.1 Backend Deployment (Render Free Tier)
The backend must be deployed as a Web Service.

**Configuration:**
* **Root Directory:** `backend`
* **Environment:** `Python 3`
* **Build Command:** `pip install -r requirements.txt`
* **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

**Infrastructure Constraints:**
* **Memory Limits:** The free tier provides 512MB RAM. The `main.py` implementation reads PDFs directly into memory bytes rather than allocating virtual disk space, optimizing memory overhead.
* **Cold Starts:** Render spins down free instances after 15 minutes of inactivity. The first request post-spin-down will experience a 30-50 second delay. Subsequent requests execute normally.

### 4.2 Frontend Deployment (Vercel)
The frontend must be deployed as a Next.js project.

**Configuration:**
* **Framework Preset:** Next.js
* **Root Directory:** `frontend`

**Environment Variables Setup:**
The client requires the backend URL to make API calls. This is configured via environment variables.

1. In the Vercel project dashboard, navigate to **Settings > Environment Variables**.
2. **Key:** `NEXT_PUBLIC_API_URL`
3. **Value:** The target URL of your Render backend deployment (e.g., `https://graph-extractor-backend.onrender.com`).
   *Note: Do not include a trailing slash (`/`).*
4. Click **Save**.
5. **Redeploy:** If you modify this variable after an initial deployment, you must manually trigger a redeployment in Vercel to bake the variable into the static client build.

### 4.3 Fallback Behavior
If `NEXT_PUBLIC_API_URL` is omitted or undefined in the environment, the client application explicitly falls back to `http://localhost:8000`. This allows for seamless local development without configuring `.env` files locally.
