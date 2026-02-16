# Deploying Quiz Clasher to Railway (All-in-One)

You have chosen **Option A: Single Service Deployment**. This means both your Node.js backend and React frontend will run on a single Railway service.

## 1. Prerequisites

- [ ] GitHub Account
- [ ] Railway Account ([railway.app](https://railway.app))
- [ ] Your code pushed to GitHub (or ready to be pushed)

## 2. Push Your Code to GitHub

Make sure your latest changes (including the new `package.json` in the root) are pushed to GitHub.
Railway will use the root `package.json` to install dependencies and start the app.

## 3. Create a Project on Railway

1.  Log in to [Railway](https://railway.app).
2.  Click **"New Project"** -> **"Deploy from GitHub repo"**.
3.  Select your repository (`QuizClasher` or whatever you named it).
4.  Click **"Deploy Now"**.

## 4. Configure Environment Variables

While the project is building (or after the first failed build), go to the **Settings** or **Variables** tab in your Railway service dashboard.

Add the following variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | (Automatic) | Railway sets this automatically. Do not change. |
| `ADMIN_EMAIL` | `your-email@example.com` | If you want to receive suggestions. |
| `SMTP_PASS` | `....` | (Optional) If using email features. |
| `VITE_WS_URL` | `wss://quizclasher.com` | **Vital!** Tells the frontend where to connect. |

> **Note on `VITE_WS_URL`**: Since you have your own domain, set this to `wss://quizclasher.com` (or `wss://www.quizclasher.com`). If you don't have the domain linked yet, use the Railway provided domain (e.g. `wss://project-name.up.railway.app`).

## 5. Add Your Domain

1.  In Railway, go to **Settings** -> **Domains**.
2.  Click **"Custom Domain"**.
3.  Enter `quizclasher.com`.
4.  Railway will verify DNS records. Go to your domain registrar (Namecheap, etc.) and add the records Railway shows you (A or CNAME).
5.  Wait for verification (can take minutes to hours).

## 6. Redeploy (Important!)

Because `VITE_WS_URL` is used during the **build** phase:

1.  After setting variables and adding the domain, verify the `VITE_WS_URL` is correct.
2.  Go to the **Deployments** tab.
3.  Click the three dots on the latest commit -> **Redeploy**.

This ensures your frontend is rebuilt with the correct WebSocket URL baked in.

## 7. Verify

Visit `https://quizclasher.com`.
- Try creating a room.
- If it connects, you are live! 🎉

