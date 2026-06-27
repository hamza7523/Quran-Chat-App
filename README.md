# Qur'an Chat App 🌙

An AI-powered iOS conversational application designed to provide grounded, contextually accurate answers and reflections based on the Holy Qur'an. Built as a rapid 3-day Minimum Viable Product (MVP) focusing on premium UI/UX, robust state management, and hallucination-resistant AI interactions.

## 🚀 The Tech Stack
* **Frontend:** React Native (Expo) & Expo Router
* **Backend & Auth:** Supabase (PostgreSQL)
* **Web Deployment:** Vercel
* **State Management:** Zustand
* **AI Provider:** Google Gemini API

---

## 🧠 Structural Decisions & MVP Approach

Given the strict 3-day time crunch, the architecture was heavily optimized for delivery speed without sacrificing the user experience or the integrity of the AI's responses.

### 1. The AI Architecture: Lightweight RAG Pipeline
When dealing with religious texts, AI hallucinations are unacceptable. Instead of relying solely on the LLM's pre-trained knowledge, I implemented a lightweight Retrieval-Augmented Generation (RAG) approach:
* **Pre-fetch Context:** User prompts are first parsed to extract keywords and queried against a dedicated Qur'an API.
* **Prompt Injection:** The retrieved, exact English translations and Arabic references are injected into the system prompt as immutable context.
* **Grounded Generation:** Gemini is instructed to base its answers strictly on this injected context, effectively turning the LLM into a conversational synthesizer rather than a raw knowledge generator. 

### 2. State Management: Optimistic UI Syncing
To make the chat feel instantly responsive, the app utilizes an optimistic UI pattern via **Zustand**:
* User messages and local "loading" bubbles are instantly generated with local UUIDs and pushed to the global store.
* Database synchronization to **Supabase** happens asynchronously in the background. If a network request fails, the local state gracefully handles the error without locking up the main thread.
* **Session Handling:** The Zustand store is strictly wiped on user sign-out to prevent local state leakage between accounts on the same physical device.

### 3. UI/UX: Glassmorphism & Fluidity
A core requirement was making the app feel premium and native. 
* Implemented `expo-blur` for frosted glass styling across cards and bottom sheets.
* Built custom, spring-animated tab indicators that replicate native iOS physics.
* Leveraged dynamic Arabic typography (`Amiri`) seamlessly alongside modern sans-serif fonts to maintain cultural authenticity while ensuring readability.

---

## ✂️ MVP Trade-offs (What was cut)

To hit the 3-day deadline, explicit scoping decisions were made:
1. **Row Level Security (RLS):** RLS policies on the `conversations` and `messages` tables were temporarily bypassed to accelerate the prototype. Securing these routes by `user_id` would be the immediate first step for production.
2. **Server-Sent Events (SSE):** The AI currently returns its payload in a single block. Implementing a streaming response (chunk-by-chunk) would reduce perceived latency but required too much custom networking overhead for this timeframe.

---

## 🔭 Future Roadmap & Scaling

If given more time, the next iterations would focus heavily on backend data engineering and engagement:
* **Vector Database Migration:** Replace the basic keyword-search API with an embedded semantic search. By generating embeddings for the entire Qur'an and storing them in Supabase using `pgvector`, the RAG pipeline would understand the *meaning* behind complex user queries rather than just matching words.
* **Offline Caching:** Implement local persistence (e.g., SQLite or MMKV) for the user's conversation history and daily cached Ayahs, allowing the app to open instantly even in airplane mode.
* **Push Notifications:** Set up local triggers for a "Daily Ayah" reflection to drive consistent user engagement.

---

## 🛠️ Local Setup

**1. Clone the repository**
```bash
git clone [https://github.com/hamza7523/Quran-Chat-App.git](https://github.com/hamza7523/Quran-Chat-App.git)
cd Quran-Chat-App
