# TheAskt AI-powered Knowledge Platform

**TheAskt** is a premium, high-performance, Progressive Web App (PWA) AI learning platform. Built with Next.js App Router, Tailwind CSS v4, Drizzle ORM, Turso DB, and Firebase Services (Firestore & Cloud Messaging), it is optimized for traditional Google Search SEO and Generative Engine Optimization (GEO) rankings (Perplexity, ChatGPT Search, Gemini AI Overviews).

---

## Technical Stack
- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + lucide-react + shadcn/ui custom theme
- **Database**: Turso (libSQL client)
- **ORM**: Drizzle ORM
- **Leads & Subscriptions**: Firebase Firestore (No auth required)
- **Push Alerts**: Firebase Cloud Messaging (FCM)
- **Deployment**: Netlify Enterprise

---

## Getting Started

### 1. Installation
Install the project dependencies using `pnpm`:
```bash
pnpm install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory:
```env
# Next.js Server & Turso DB Connection
TURSO_CONNECTION_URL=libsql://your-database-name-username.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token

# Firebase Admin SDK Credentials (for push notifications & Firestore)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"

# Webhook Secret Token (Shared between publishing script and Next.js /api/notify)
THEASKT_API_KEY=your-shared-secure-webhook-token

# Next.js Client-Side configuration (for FCM setup)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-firebase-web-push-vapid-key
NEXT_PUBLIC_SITE_URL=https://your-domain.netlify.app
```

### 3. Database Sync
To sync schemas with your Turso database:
```bash
pnpm drizzle-kit push
```

### 4. Running Locally
Start the development server:
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view it.

---

## The Hybrid Publishing Workflow (Option B)

### Step 1: Fetch Trends
Run the Python script locally to pull trending queries from Google Trends and relevant high-ranking YouTube videos:
```bash
python scripts/fetch_trends.py
```
This saves search metrics inside `.agents/research/trends_research.json`.

### Step 2: Write Article (via Antigravity)
Type in the chat:
> *"Write a trending article about AI CRM systems using the latest trends"*
Antigravity will invoke the `.agents/skills/write_article` skill, read the JSON report, draft a GEO-optimized draft with Key Takeaways, FAQ list, and outbound citations, and save it to `scripts/draft_article.json`.

### Step 3: Publish & Send Push Alerts
Antigravity automatically runs the following command (or you can run it manually):
```bash
pnpm publish-article
```
This inserts the draft into the Turso Database, triggers the FCM multicast webhook, and delivers push notifications to all active subscribed browsers.

---

## PWA & SEO Optimizations
- **Offline Fallback**: Serves a dynamic `/offline` layout and caches visited article HTML pages using stale-while-revalidate policies.
- **FCM Service Worker**: Dynamically served from `/firebase-messaging-sw.js` with runtime keys injected safely.
- **AI Bot Whitelist**: Custom rules in `/robots.txt` authorizing `GPTBot`, `ClaudeBot`, `PerplexityBot`, and `Google-Extended`.
- **Structured Data**: Injects dynamic JSON-LD tags (`FAQPage`, `NewsArticle`, `BreadcrumbList`, and `Organization`) on every article page.
- **Core Web Vitals**: Configures ISR caching headers (Home: 60s, Category: 120s, Articles: 300s, Search: 30s) to keep Netlify CDN responses under 100ms.
# kampusfilterblogapp
