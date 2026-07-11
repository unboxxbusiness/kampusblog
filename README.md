# Kampus Filter

An editorial student briefing and admissions updates platform built with Next.js, a relational database, and a cloud messaging backend.

## Getting Started

1. **Clone the repository.**
2. **Setup environment variables:**
   * Copy the template to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   * Fill in your database and API credentials in `.env.local`.
3. **Install dependencies:**
   ```bash
   pnpm install
   ```
4. **Sync database schemas:**
   ```bash
   pnpm db:push
   ```
5. **Run the development server:**
   ```bash
   pnpm dev
   ```

---

## 🔒 Security Audit & Secret Safety Pass

> [!WARNING]
> **Important Rotation Policy:**
> If any environment variables or API keys were tracked in the Git repository cache under previous commits, those old keys remain in the Git history. 
> 
> Before deploying this app to production, **you must rotate the following credentials**:
> 1. Rotate the **Database Authorization Token** (`TURSO_AUTH_TOKEN`).
> 2. Rotate the **Private Key Credentials** (`FIREBASE_ADMIN_PRIVATE_KEY`) inside the cloud developer console.
> 3. Rotate the **YouTube API Key** (`YOUTUBE_API_KEY`).
> 4. Rotate the **Webhook Key** (`KAMPUSFILTER_API_KEY`).

### Key Safety Actions Performed:
* **Zero Hardcoded Secrets:** Checked the entire codebase to confirm that all database strings, connection configuration blocks, and external API keys are loaded via process environment variables (`process.env`).
* **Safe Client Exposure:** Only public-safe configurations are exposed to the browser. Admin private keys are kept strictly server-side.
* **Ignored Environment Files:** Verfied that `.env`, `.env.local`, and custom local database caches match `.gitignore` exclusion rules and are completely untracked.