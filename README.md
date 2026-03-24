# Note Stream

> **Transforming passive video consumption into structured, stateful knowledge.**

Note Stream is a full-stack, AI-powered ecosystem built to bridge the gap between watching YouTube videos and actually retaining the information. By injecting a custom React interface directly into the YouTube DOM, it allows users to capture, query, and refine their notes in real-time without ever switching tabs.

🌐 **[Live Web Dashboard]([https://note-stream-three.vercel.app/])** | 📦 **[Download Extension (v1.0.0)](#-quick-install-for-users)**

---

## 🚀 Core Engineering Features

- **Native DOM Interaction:** A context-aware playback controller hooks directly into the YouTube HTML5 player to auto-pause on input focus and auto-resume on blur, eliminating manual control overhead.
- **Zero-Context Switching:** Powered by Gemini 1.5 Flash, users can query complex concepts directly within the active viewport. The AI utilizes the video metadata to provide hyper-relevant answers on the spot.
- **Selective Cloud Sync:** Notes are only persisted to a MongoDB cluster when the user explicitly engages the extension, utilizing debounced auto-save triggers to ensure data integrity across browser sessions.
- **Adaptive Gap Analysis:** Post-session quizzes analyze performance to identify specific knowledge gaps. The AI dynamically regenerates notes focusing on unmastered domains.
- **Standardized Output:** A built-in rendering engine transforms markdown notes into high-fidelity, offline-ready PDF study guides.

## 💻 Technical Architecture

This repository is structured as a monorepo containing three distinct micro-environments:

- **Frontend / Dashboard (`/dashboard`):** Next.js 15, React, TailwindCSS *(Deployed on Vercel)*
- **Backend API (`/backend`):** Node.js, Express.js *(Deployed on Render)*
- **Extension (`/extension`):** Chrome Extension API, React Injection 
- **Database:** MongoDB Atlas
- **Artificial Intelligence:** Google Gemini 1.5 Flash

---

## 📦 Quick Install (For Users)

Want to use Note Stream right now? You don't need to run any code.

1. Go to the **[Releases](../../releases)** tab on the right side of this repository.
2. Download the `Note-Stream-v1.0.zip` file and extract it.
3. Open Google Chrome and navigate to `chrome://extensions`.
4. Enable **Developer mode** (toggle in the top right corner).
5. Click **Load unpacked** (top left) and select the extracted `dist` folder.
6. Open a YouTube video, click the ⚡ widget, and start learning.

---

## 🛠️ Local Development (For Engineers)

To run Note Stream locally for development, you will need to initialize the Backend and Frontend microservices.

### 🔑 API Configuration & Cost Management
This project is architected to be completely free to run locally. 
- **Gemini API:** The AI features utilize the Gemini 1.5 Flash model. You can generate an API key via Google AI Studio. The standard free tier (15 RPM / 1M TPM) is more than sufficient for local testing and does not require a billing account.
- **MongoDB:** The database utilizes MongoDB Atlas. The free `M0` cluster provides 512MB of storage, which is ample for stateful note persistence.

### 1. Repository Setup

git clone [https://github.com/SlimmShadyyy/note-stream.git](https://github.com/SlimmShadyyy/note-stream.git)
cd note-stream

2. Backend API
cd backend
npm install

Create a .env file in the /backend directory:
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key

npm run dev
# The API will initialize on http://localhost:5000

3. Frontend Dashboard
Open a new terminal session:
cd dashboard
npm install
npm run dev
# The client interface will initialize on http://localhost:3000

4. Chrome Extension Build
Open a final terminal session:
cd extension
npm install
npm run build
Load the /extension/dist folder into Chrome via chrome://extensions -> Load Unpacked.
```bash
git clone [https://github.com/SlimmShadyyy/note-stream.git](https://github.com/SlimmShadyyy/note-stream.git)
cd note-stream
