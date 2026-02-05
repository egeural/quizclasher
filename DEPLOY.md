# Publishing "Quiz Clasher" with Your Own Domain

**Your domain:** **quizclasher.com**

This guide explains how to connect **quizclasher.com** to your hosting and go live.

---

## 1. Domain: quizclasher.com ✓

You already own **quizclasher.com**. Next step is to deploy your app and point this domain to it via **DNS** (where you bought the domain: Namecheap, GoDaddy, Cloudflare, etc.).

---

## 2. Understand your project (what to host)

Your app has **two parts**:

| Part | Technology | What it needs |
|------|------------|----------------|
| **Frontend** | React (Vite) | Static hosting (HTML/JS/CSS) |
| **Backend** | Node.js + WebSocket | A server that runs Node 24/7 |

So you need:
- **One host** for the React app (the “www” site).
- **One host** for the Node.js WebSocket server (can be same provider, different “app” or subdomain).

---

## 3. Hosting options

### Option A: All-in-one (easiest to start)

Run **frontend + server on one machine** (VPS = Virtual Private Server):

| Provider | Free tier / price | Good for |
|----------|-------------------|----------|
| [Railway](https://railway.app) | Free tier, then pay | Node + static, simple deploy |
| [Render](https://render.com) | Free tier for web services | Node backend + static site |
| [Fly.io](https://fly.io) | Free allowance | Full control, global |
| [DigitalOcean](https://www.digitalocean.com) | From ~$5/mo | VPS, you install Node + nginx |
| [Hetzner](https://www.hetzner.com) | From ~€4/mo | Cheap VPS in EU |

**Idea:** Deploy the **server** as a Node app, and serve the **client** as static files (e.g. from the same Node server or a separate “static site”). Then point your domain to that host.

### Option B: Split (frontend + backend separate)

| Frontend (React) | Backend (Node + WebSocket) |
|------------------|----------------------------|
| [Vercel](https://vercel.com) (free) | [Railway](https://railway.app) or [Render](https://render.com) |
| [Netlify](https://netlify.com) (free) | Same |
| [Cloudflare Pages](https://pages.cloudflare.com) (free) | Same |

- **Frontend:** Connect your GitHub repo, build command `npm run build`, publish folder `dist`. You get a URL like `your-app.vercel.app`.
- **Backend:** Deploy the `server` folder as a Node service. You get a URL like `your-server.railway.app`.  
- Then you use **one domain** for the site and point **WebSocket** to the backend URL (see step 5).

---

## 4. Connect your domain to the hosting

After you have a **hosting URL** (e.g. from Vercel or Railway):

1. Log in to the **registrar** where you bought the domain (Namecheap, Cloudflare, etc.).
2. Open **DNS settings** for that domain.
3. Add records as your host tells you. Typical examples:

   **If the whole site is at one host (e.g. Vercel):**
   - Type: **A** or **CNAME**  
   - Name: **@** (or `www`)  
   - Value: the host’s target (e.g. `cname.vercel-dns.com` or an IP).

   **If backend is on a subdomain (e.g. `api.quizclasher.com`):**
   - Type: **CNAME**  
   - Name: **api** (or `ws`)  
   - Value: backend URL (e.g. `your-app.railway.app`).

4. Save. DNS can take from a few minutes up to 24–48 hours to update.

---

## 5. Set production WebSocket URL in your project

The app already supports a **production WebSocket URL** via an environment variable.

**When building the frontend**, set:

- **Variable name:** `VITE_WS_URL`
- **Value:** Your WebSocket server URL:
  - If backend is at `https://api.quizclasher.com` → use **`wss://api.quizclasher.com`**
  - If backend is at `https://your-app.railway.app` → use **`wss://your-app.railway.app`**

**Important:** Use **`wss://`** (secure WebSocket) in production, not `ws://`.

**Examples:**

- **Vercel:** Project → Settings → Environment Variables → add `VITE_WS_URL` = `wss://your-backend-url`.
- **Netlify:** Site → Build & deploy → Environment → add `VITE_WS_URL` = `wss://...`.
- **Railway / Render (backend):** Set `PORT` if needed; they usually provide HTTPS and thus `wss` on the same URL.

Then **rebuild and redeploy** the frontend so the new URL is baked in.

---

## 6. Checklist before going live

- [ ] Domain bought and DNS pointed to your hosting (step 4).
- [ ] Backend (Node + WebSocket) deployed and reachable over **HTTPS** (so `wss://` works).
- [ ] Frontend built with `VITE_WS_URL=wss://your-backend-url` and deployed.
- [ ] Browser: open **https://www.quizclasher.com** and test creating a room and playing (WebSocket should connect).

---

## 7. Optional: HTTPS and “www”

- Most modern hosts (Vercel, Netlify, Railway, Render) provide **free HTTPS**.
- In DNS you can:
  - Point **@** (root) to your main site so **quizclasher.com** loads.
  - Point **www** to the same site so **www.quizclasher.com** also works.

Your registrar or host’s docs will say exactly which A/CNAME records to add for “www” and root.

---

## Quick summary (quizclasher.com)

1. ~~Buy a domain~~ ✓ **quizclasher.com**
2. **Deploy backend** (Node + WebSocket) to Railway, Render, or a VPS; note the HTTPS URL.
3. **Deploy frontend** (Vite build) to Vercel, Netlify, or the same host; set `VITE_WS_URL=wss://your-backend-url`.
4. **Point quizclasher.com** (and www.quizclasher.com) to your frontend via DNS at your registrar.
5. Use **wss://** in production and **rebuild** the client after changing `VITE_WS_URL`.

When live, users will visit **https://www.quizclasher.com** (or https://quizclasher.com).

---

## Deploy on Vercel (step-by-step)

You’re using **Vercel for the frontend**. The **WebSocket server** cannot run on Vercel (no long-lived connections), so deploy the backend on **Railway** or **Render** first, then the frontend on Vercel.

### Step 1: Deploy the backend (Railway or Render)

1. Go to [Railway](https://railway.app) or [Render](https://render.com) and sign up (GitHub is easiest).
2. **New project** → **Deploy from GitHub** (or upload the `server` folder).
3. Set the **root directory** to `server` (so it finds `server.js` and `package.json`).
4. Set **Start command** to `node server.js` (or leave default if it detects Node).
5. Add env var **PORT** if the host requires it (Render often sets this automatically).
6. Deploy. Copy the **HTTPS URL** (e.g. `https://your-app.railway.app` or `https://your-app.onrender.com`).
7. Your WebSocket URL is that same URL with **wss://** (e.g. `wss://your-app.railway.app`). You’ll use this in Step 3.

### Step 2: Push your code and connect Vercel

1. Put your project on **GitHub** (if it isn’t already).
2. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**.
3. **Import** your GitHub repo.
4. **Configure:**
   - **Root Directory:** click **Edit** and set to **`client`** (so Vercel builds the React app, not the whole repo).
   - **Framework Preset:** Vite (Vercel usually detects it).
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. **Environment Variables:** click **Add**:
   - **Name:** `VITE_WS_URL`
   - **Value:** `wss://your-backend-url` (the URL from Step 1, with **wss://**)
6. Click **Deploy**. Wait for the build to finish. You’ll get a URL like `your-project.vercel.app`.

### Step 3: Add quizclasher.com to Vercel

1. In Vercel, open your project → **Settings** → **Domains**.
2. Add **quizclasher.com** and **www.quizclasher.com**.
3. Vercel will show you the **DNS records** to add (usually two CNAMEs).

### Step 4: Point quizclasher.com to Vercel (DNS)

1. Log in where you bought **quizclasher.com** (Namecheap, GoDaddy, Cloudflare, etc.).
2. Open **DNS** / **Manage DNS** for quizclasher.com.
3. Add the records Vercel showed you, for example:
   - **CNAME** — Name: `www` — Value: `cname.vercel-dns.com` (or what Vercel shows).
   - **A** or **CNAME** for root (`@`) — use the value Vercel gives for **quizclasher.com**.
4. Save. DNS may take 5–60 minutes to update.

### Step 5: Test

- Visit **https://www.quizclasher.com** (or the Vercel URL before DNS is ready).
- Log in, create a room, and start the multiplayer game. If the WebSocket connects, you’re live.

**Note:** The file `client/vercel.json` is already in the project so that routes like `/menu`, `/sport`, `/history` work correctly (SPA fallback to `index.html`).
