# 🇯🇵 TripSense Japan

> Discover Japan in a slow, soulful, and personal way.
> This is the MVP repository for the TripSense Japan travel planning experience.

---

## 🚀 Project Overview

TripSense Japan helps travelers craft personalized Japan trips through:
- A two-question travel style quiz
- Curated activity recommendations
- Auto-generated itineraries (3 / 5 / 7 days)
- Budget estimates and lodging suggestions

This MVP is focused on building a fast, customizable, and scalable foundation using modern serverless tools.

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | [Next.js (App Router)](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) |
| Backend / DB | [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage, Edge Functions) |
| Hosting | [Vercel](https://vercel.com/) |
| AI / NLP | [OpenAI GPT-4o](https://openai.com/) (for tag suggestion, summaries, etc.) |
| Analytics (optional) | [PostHog](https://posthog.com/) or [Plausible](https://plausible.io/) |

---

## 🗂️ Project Structure

```bash
.
├── apps
│   └── web                # Next.js frontend app
├── supabase
│   └── sql                # Schema & seed data
│   └── functions          # Edge functions (Node.js)
├── .env.local            # Local environment variables
└── README.md
```

---

## 🧪 Local Development

### 1. Clone this repo

```bash
git clone https://github.com/[your-org]/tripsense-japan.git
cd tripsense-japan
```

### 2. Install dependencies

```bash
pnpm install
# or yarn / npm
```

### 3. Set up environment variables

* Copy the template file and create your `.env`:
```bash
cp .env.local .env
```

* Add your actual values to `.env`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://kxkafewyhkjkphivygdk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
SUPABASE_DB_PASSWORD=[your-db-password]
```

* Get these values from your [Supabase project dashboard](https://app.supabase.com/)

### 4. Set up Supabase

* Push schema (optional)

```bash
supabase db push
```

### 5. Start the dev server

```bash
pnpm dev
```