
# 🎮 QuizClasher 

> **The Ultimate Real-Time Multiplayer Quiz Battle!**

[![Deployed on Railway](https://railway.app/button.svg)](https://railway.app)
[![React](https://img.shields.io/badge/Front--End-React_19-blue?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Back--End-Node.js-green?logo=node.js)](https://nodejs.org/)
[![WebSockets](https://img.shields.io/badge/Real--Time-WebSockets-orange)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
[![Vite](https://img.shields.io/badge/Built_with-Vite-purple?logo=vite)](https://vitejs.dev/)

Welcome to **QuizClasher**, a high-energy multiplayer trivia game where you can challenge friends or random opponents in real-time battles of wit!

**🌐 Live Demo:** [https://www.quizclasher.com](https://www.quizclasher.com)

---

## 🔥 Features

-   **⚡ Real-Time Multiplayer:** Instant synchronization using WebSockets for lag-free gameplay.
-   **🏠 Custom Rooms:** Create private lobbies with unique codes to play with friends.
-   **🌍 Global Matchmaking:** Join open lobbies and clash with players worldwide.
-   **🎨 Dynamic Themes:** Beautiful, responsive UI with vibrant color palettes.
-   **🏆 Live Leaderboards:** Track your score and see who reigns supreme after each round.
-   **📱 Mobile-First Design:** Fully optimized for seamless play on phones, tablets, and desktops.

---

## 🛠️ Tech Stack

This project is built with a modern, performance-focused stack:

-   **Frontend:** React 19, React Router 7, Vite
-   **Backend:** Node.js, Express, `ws` (WebSocket library)
-   **Styling:** Pure CSS (Custom Design System)
-   **Deployment:** Railway (Single Service Monorepo)

---

## 🚀 Getting Started Locally

Want to run QuizClasher on your own machine? Follow these steps:

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/quizclasher.git
cd quizclasher
```

### 2. Install Dependencies
We use a root `package.json` to manage both client and server:
```bash
npm install
```
*(This command automatically installs dependencies for both `client` and `server` folders)*

### 3. Start the Development Server
This command builds the frontend and starts the backend server:
```bash
npm start
```

Open your browser and visit: `http://localhost:3000`

---

## 📦 Deployment

This project depends on the backend serving the frontend static files.

**Deployment Guide:**  
See [DEPLOY.md](./DEPLOY.md) for detailed instructions on deploying to Railway with a custom domain.

**Environment Variables Required:**
-   `PORT`: (Auto-set by host)
-   `VITE_WS_URL`: The full `wss://` URL of your backend (e.g., `wss://www.quizclasher.com`).

---

## 🤝 Contributing

Got a cool idea for a new feature? Found a bug?
1.  Fork the repo
2.  Create a new branch (`git checkout -b feature/amazing-idea`)
3.  Commit your changes (`git commit -m 'Add some amazing idea'`)
4.  Push to the branch (`git push origin feature/amazing-idea`)
5.  Open a Pull Request

---

Made with ❤️ by **Ege Ural**
