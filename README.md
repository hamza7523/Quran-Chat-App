# Qur'an Chat App 🌙
*Bridging timeless scripture with modern intelligence.*

An AI-powered conversational iOS application engineered to provide deeply grounded, contextually accurate guidance based on the Holy Qur'an. Developed as a rapid 3-day Minimum Viable Product (MVP), this application prioritizes a hallucination-resistant data architecture, zero-latency state syncing, and a premium, natively fluid user interface.

---

## 🚀 The Tech Stack & Tooling
* **Frontend:** React Native (Expo) & Expo Router for universal, file-based routing.
* **Backend & Auth:** Supabase (PostgreSQL) for secure, scalable data storage and authentication.
* **Web Deployment:** Vercel (orchestrating the universal React Native web build).
* **State Management:** Zustand for lightweight, optimistic UI updates.
* **AI Provider:** Google Gemini API.
* **Typography:** Custom integrations of `Amiri` (Arabic) and `Fraunces`/`Inter` (English).

---

## 🧠 Architectural Deep Dive

Delivering an AI product centered around religious text requires absolute precision. The architecture was designed to mitigate the inherent risks of Large Language Models (LLMs) while maintaining a seamless user experience.

### 1. Context-First Retrieval-Augmented Generation (RAG)
To prevent the AI from generating hallucinatory or unverified religious advice, the system does not rely on the LLM's raw parametric memory. Instead, it utilizes a strict, lightweight RAG pipeline:
* **Query Interception:** User prompts are intercepted and distilled into optimal search keywords.
* **Deterministic Retrieval:** These keywords query a deterministic Qur'an API to retrieve exact, verified English translations and Arabic references.
* **Prompt Injection & Grounding:** The retrieved text is injected into a strict system prompt. The LLM is forced to act as a synthesizer of this injected context rather than a raw knowledge generator, ensuring the output is always anchored to authentic scripture.

### 2. Dual-Layer State Management & Optimistic UI
In mobile chat interfaces, network latency is the enemy of user engagement. 
* **The Illusion of Zero Latency:** Zustand manages a highly optimized local memory store. When a user sends a message, local UUIDs instantly populate the UI with the user's message and an animated "Seeking wisdom..." placeholder.
* **Asynchronous Persistence:** Database synchronization to Supabase's `conversations` and `messages` tables happens entirely in the background. 
* **State Isolation:** The Zustand memory tree is completely wiped upon `signOut`, strictly preventing local state leakage between sessions on the same physical device.

### 3. UI/UX Philosophy
The interface was crafted to evoke tranquility, respect, and modern sophistication:
* **Glassmorphism & Depth:** Extensive use of `expo-blur` and dynamic `LinearGradient` overlays to create frosted glass effects and 3D bevels that mimic high-end iOS design languages.
* **Fluid Physics:** Tab transitions and state toggles utilize custom spring animations tuned to native iOS tension and friction physics.
* **Contextual Typographic Rhythm:** The UI dynamically shifts between high-impact English serif displays (`Fraunces`) and authentic, culturally resonant Arabic script (`Amiri`), dynamically greeting the user with context-aware verses based on their session state.

---

## ✂️ MVP Scope & Intentional Trade-offs

Engineering is about resource allocation. To deliver a polished MVP within 72 hours, the following boundaries were explicitly drawn:

1. **Row Level Security (RLS) Deferral:** While Supabase Auth handles identity perfectly, Postgres RLS policies on the `conversations` and `messages` tables were left permissive to accelerate client-side development. Locking these down to `auth.uid() = user_id` is the immediate next step for production.
2. **Synchronous AI Payloads:** The Gemini response is currently awaited and rendered as a single block. Implementing Server-Sent Events (SSE) for chunked streaming would drastically reduce Time-to-First-Token (TTFT), but required complex native networking bridges outside the MVP timeframe.

---

## 🔭 Future Roadmap: Big Data & Scaling

With more time, the application would transition from a lightweight prototype to a highly robust data product:

* **Semantic Search via pgvector:** The current keyword-based retrieval is limited. The primary architectural upgrade would involve generating high-dimensional embeddings for every Ayah in the Qur'an and storing them in Supabase using the `pgvector` extension. This would transform the retrieval engine to understand the deep semantic meaning of user queries (e.g., finding verses about "grief" even if the word isn't explicitly in the text).
* **Caching & Edge Delivery:** Implementing a local persistence layer (like MMKV or SQLite) to cache the daily Ayahs and historical conversations, allowing the application to render instantly offline.
* **Personalized Insight Engine:** Securely aggregating anonymized query intents to build localized, daily push notifications that offer highly relevant, tailored reflections.

---

## 🛠️ Local Development Guide

**1. Clone the repository**
```bash
git clone [https://github.com/hamza7523/Quran-Chat-App.git](https://github.com/hamza7523/Quran-Chat-App.git)
cd Quran-Chat-App
