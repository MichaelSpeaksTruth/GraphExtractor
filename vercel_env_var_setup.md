# Vercel Deployment & Environment Variable Setup

This guide walks you through deploying the Next.js frontend to Vercel and configuring the Environment Variables so it can communicate with your Render backend.

## 1. Prepare Your GitHub Repository
Ensure that the `frontend` directory is in your GitHub repository. The application is already configured to read the `NEXT_PUBLIC_API_URL` environment variable during fetch requests.

## 2. Connect to Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** and select **Project**.
3. Import the GitHub repository that contains your `frontend` code.

## 3. Configure the Project Settings
During the import process, you will see a "Configure Project" screen.
- **Framework Preset**: Vercel should automatically detect **Next.js**. Leave it as is.
- **Root Directory**: **Crucial Step!** Click "Edit" and select the `frontend` folder. If your Next.js app is inside the `frontend` folder and you don't select this, the build will fail.

## 4. Setting the Environment Variables
Before clicking "Deploy", expand the **Environment Variables** tab. You need to point the frontend to the backend API you deployed on Render.

1. **Key**: Enter `NEXT_PUBLIC_API_URL`
   *(Note: The `NEXT_PUBLIC_` prefix is required in Next.js to expose this variable to the browser/client side).*
2. **Value**: Enter the exact URL provided by Render when you deployed the backend. 
   - *Example:* `https://graph-extractor-backend.onrender.com`
   - **Important**: Do NOT include a trailing slash (`/`) at the end of the URL.
3. Click **Add**.

## 5. Deploy
1. Click the **Deploy** button.
2. Vercel will now build the Next.js application. This usually takes about 1-2 minutes.
3. Once finished, click **Continue to Dashboard**.

## Troubleshooting
If you deploy and the application fails to extract graphs (showing a "Failed to fetch" or network error):
1. Go to your project on Vercel.
2. Click on the **Settings** tab.
3. Click on **Environment Variables** in the left sidebar.
4. Verify that `NEXT_PUBLIC_API_URL` is spelled correctly and the URL is correct.
5. If you modify the environment variable *after* deployment, you MUST trigger a **Redeploy** (Go to Deployments tab -> Click the 3 dots on the latest deployment -> Redeploy) for the changes to take effect in the browser.
