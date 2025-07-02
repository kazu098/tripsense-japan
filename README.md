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

### 1. リポジトリをクローン

```bash
git clone https://github.com/kazu098/tripsense-japan.git
cd tripsense-japan
```

### 2. 依存パッケージをインストール

```bash
pnpm install
```

### 3. フロントエンド開発サーバーを起動

```bash
pnpm dev
```

- アクセス: http://localhost:3000

### 4. （オプション）データベース機能を使用する場合

#### 環境変数を設定

```bash
cp .env.local .env
```
`.env` にSupabaseの各種キー・パスワードを記入してください。

#### Supabaseスキーマを適用

```bash
supabase db push
```