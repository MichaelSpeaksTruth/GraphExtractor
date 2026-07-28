# Deploying the Backend to Render

Follow this comprehensive guide to deploy the FastAPI PyMuPDF backend to Render's Free Tier.

## 1. Prepare Your GitHub Repository
Ensure that your GitHub repository contains the `backend` folder. Specifically, the root of your repository (or the sub-directory you choose to deploy) must contain:
- `main.py`
- `requirements.txt`

## 2. Connect to Render
1. Go to [Render's Dashboard](https://dashboard.render.com/).
2. Click **New +** and select **Web Service**.
3. Under **Connect a repository**, connect your GitHub account if you haven't already, and select the repository containing the backend code.

## 3. Configure the Web Service Settings
Fill out the configuration form exactly as follows:

| Setting | Value | Explanation |
| :--- | :--- | :--- |
| **Name** | `graph-extractor-backend` (or anything you prefer) | A unique name for your API. |
| **Region** | `Oregon (US West)` or `Frankfurt (EU Central)` | Choose whichever is closest to where you deploy Vercel to minimize latency. |
| **Branch** | `main` | Or whichever branch holds your production code. |
| **Root Directory** | `backend` | **Crucial step**: If your code is inside a folder named `backend`, you MUST set this so Render knows where to look. If your code is at the root of the repo, leave it blank. |
| **Runtime** | `Python 3` | Render will automatically detect this from `requirements.txt`, but setting it explicitly is safer. |
| **Build Command** | `pip install -r requirements.txt` | Installs PyMuPDF, FastAPI, and Uvicorn. |
| **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` | Starts the server. Render injects the `$PORT` environment variable dynamically. |

## 4. Select the Free Instance Type
- Scroll down to the **Instance Type** section.
- Select the **Free** tier (0.1 CPU, 512 MB RAM).

> [!WARNING]  
> **Cold Starts**: Render free tier instances spin down after 15 minutes of inactivity. The very first request you make to the backend after it has spun down might take 30–50 seconds to complete while the instance wakes up. Subsequent requests will be extremely fast.

## 5. Add Environment Variables (Optional but Recommended)
Click on **Advanced** -> **Environment Variables**.
Although our backend doesn't strictly require any keys, it's good practice to set the Python version explicitly to match what you tested locally.
- **Key**: `PYTHON_VERSION`
- **Value**: `3.10.0` (or `3.11.0` depending on your preference)

## 6. Deploy!
- Click the **Create Web Service** button.
- Render will pull your repository, run the build command, and start the service.
- Monitor the deployment logs. Once it says "Your service is live 🎉", copy the URL at the top left of the screen (e.g., `https://graph-extractor-backend.onrender.com`).
- **Save this URL!** You will need it for the Vercel Frontend deployment.
