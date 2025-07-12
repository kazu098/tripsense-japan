# 🛠️ 開発ガイド

## 📋 目次

- [技術スタック選定理由](#技術スタック選定理由)
- [開発環境セットアップ](#開発環境セットアップ)
- [データベーススキーマ](#データベーススキーマ)
- [開発ワークフロー](#開発ワークフロー)
- [デプロイメント](#デプロイメント)
- [トラブルシューティング](#トラブルシューティング)
- [マイグレーションの反映](#マイグレーションの反映)

---

## 🧱 技術スタック選定理由

### なぜ Next.js + Supabase？

**フロントエンド (Next.js)**
- ✅ App RouterでモダンなReactパターン
- ✅ 組み込みAPIルートでサーバーレス関数
- ✅ 優れたTypeScriptサポート
- ✅ 素晴らしい開発者体験
- ✅ Vercelでの簡単デプロイ

**バックエンド (Supabase)**
- ✅ PostgreSQLとリアルタイムサブスクリプション
- ✅ 組み込み認証システム
- ✅ Row Level Security (RLS)
- ✅ Edge Functionsでサーバーレスコンピュート
- ✅ 画像用ファイルストレージ
- ✅ データベースバックアップとモニタリング

**将来の検討事項**
- Supabase → Rails API（複雑なビジネスロジックが必要な場合）
- Next.js → React Native（モバイルアプリ用）
- Redis追加（キャッシュが必要な場合）

---

## 🚀 開発環境セットアップ

### 前提条件

- Node.js 18+ 
- pnpm（推奨）または npm
- Supabase CLI
- Git

### 環境変数

1. **テンプレートファイルをコピー**
   ```bash
   cp .env.local .env
   ```

2. **`.env` に実際の値を設定**
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://kxkafewyhkjkphivygdk.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=（Supabase管理画面から取得）
   SUPABASE_SERVICE_ROLE_KEY=（Supabase管理画面から取得）
   SUPABASE_DB_PASSWORD=（Supabase管理画面から取得）

   # OpenAI（AI機能用）
   OPENAI_API_KEY=（OpenAI管理画面から取得）

   # オプション：アナリティクス
   NEXT_PUBLIC_POSTHOG_KEY=（PostHog管理画面から取得）
   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
   ```

**注意**: `.env` ファイルは機密情報を含むため、git管理対象外です。

### データベースセットアップ

1. **Supabaseプロジェクト作成**
   ```bash
   # Supabase CLIインストール
   npm install -g supabase
   
   # Supabaseにログイン
   supabase login
   
   # プロジェクト初期化
   supabase init
   ```

2. **スキーマプッシュ**
   ```bash
   supabase db push
   ```

3. **シードデータ投入**
   ```bash
   supabase db reset
   ```

---

## 🗄️ データベーススキーマ

### 主要テーブル

```sql
-- ユーザーテーブル
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 体験テーブル
CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  thumbnail_image TEXT, -- メイン画像（1枚）
  price_range TEXT CHECK (price_range IN ('budget', 'mid', 'luxury')),
  duration_hours INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 体験画像テーブル
CREATE TABLE experience_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID REFERENCES experiences(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL, -- Supabase Storageのパス
  order_index INTEGER DEFAULT 0, -- 表示順序
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- タグテーブル
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3B82F6', -- タグの色
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 体験タグ中間テーブル
CREATE TABLE experience_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID REFERENCES experiences(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(experience_id, tag_id)
);

-- プランテーブル
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  total_days INTEGER NOT NULL,
  budget_estimate INTEGER,
  travel_style TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- プラン体験テーブル
CREATE TABLE plan_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES plans(id) ON DELETE CASCADE,
  experience_id UUID REFERENCES experiences(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL, -- 何日目か
  order_in_day INTEGER DEFAULT 0, -- その日の何番目か
  start_time TEXT, -- "09:00"
  end_time TEXT, -- "11:00"
  notes TEXT, -- メモ
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- お気に入りテーブル
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  experience_id UUID REFERENCES experiences(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, experience_id)
);
```

### Row Level Security (RLS)

```sql
-- 全テーブルでRLSを有効化
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のデータのみアクセス可能
CREATE POLICY "ユーザーは自分のプロフィールを閲覧可能" ON users
  FOR SELECT USING (auth.uid() = id);

-- 体験は誰でも閲覧可能
CREATE POLICY "体験は誰でも閲覧可能" ON experiences
  FOR SELECT USING (true);

-- プランは作成者のみアクセス可能
CREATE POLICY "ユーザーは自分のプランを閲覧可能" ON plans
  FOR ALL USING (auth.uid() = user_id);

-- お気に入りはユーザーのみアクセス可能
CREATE POLICY "ユーザーは自分のお気に入りを閲覧可能" ON wishlists
  FOR ALL USING (auth.uid() = user_id);
```

---

## 🔄 開発ワークフロー

### 1. 機能開発

```bash
# 機能ブランチ作成
git checkout -b feature/travel-quiz

# 依存関係インストール
pnpm install

# 開発サーバー起動
pnpm dev

# テスト実行
pnpm test

# 本番用ビルド
pnpm build
```

### 2. データベース変更

```bash
# マイグレーション作成
supabase migration new add_user_preferences

# マイグレーション適用
supabase db push

# データベースリセット（開発時のみ）
supabase db reset
```

### 3. コード品質

```bash
# リンター実行
pnpm lint

# 型チェック
pnpm type-check

# コードフォーマット
pnpm format
```

---

## 🚀 デプロイメント

### Vercelデプロイ

1. **リポジトリ接続**
   - コードをGitHubにプッシュ
   - Vercelダッシュボードでリポジトリ接続

2. **環境変数設定**
   - すべての`.env.local`変数をVercelに追加

3. **デプロイ**
   ```bash
   # 本番デプロイ
   vercel --prod
   
   # プレビューデプロイ
   vercel
   ```

### Supabase本番環境

1. **本番プロジェクト作成**
   - Supabaseダッシュボードで新しいプロジェクト作成
   - 環境変数を更新

2. **スキーマデプロイ**
   ```bash
   supabase db push --project-ref [production-project-id]
   ```

---

## 🐛 トラブルシューティング

### よくある問題

**Supabase接続エラー**
```bash
# Supabaseの状態確認
supabase status

# Supabase再起動
supabase stop
supabase start
```

**TypeScriptエラー**
```bash
# TypeScriptキャッシュクリア
rm -rf .next
rm -rf node_modules/.cache

# 依存関係再インストール
pnpm install
```

**データベースマイグレーション問題**
```bash
# データベースリセット
supabase db reset

# マイグレーション状態確認
supabase migration list
```

### パフォーマンスのコツ

- Supabaseの組み込みキャッシュを使用
- よく使うカラムに適切なインデックスを設定
- 重い計算にはEdge Functionsを使用
- Next.js Imageコンポーネントで画像最適化

---

## 📚 参考資料

- [Next.js ドキュメント](https://nextjs.org/docs)
- [Supabase ドキュメント](https://supabase.com/docs)
- [Tailwind CSS ドキュメント](https://tailwindcss.com/docs)
- [shadcn/ui コンポーネント](https://ui.shadcn.com/)

---

## 🤝 コントリビューション

1. リポジトリをフォーク
2. 機能ブランチを作成
3. 変更を加える
4. テストを追加（該当する場合）
5. プルリクエストを送信

質問や問題がある場合は、GitHub issueを作成するか、開発チームにお問い合わせください。

---

## 🗄️ マイグレーションの反映

Supabaseのマイグレーションファイル（`supabase/migrations/` 配下）をクラウドプロジェクトに反映するには、以下のコマンドを使用します。

### 1. 通常のマイグレーション適用

```bash
supabase db push
```
- `supabase/config.toml` の `[project] ref` で指定されたプロジェクトに適用されます。

### 2. プロジェクトIDを明示する場合

```bash
supabase db push --project-ref プロジェクトID
```
- 例: `supabase db push --project-ref kxkafewyhkjkphivygdk`

### 3. 全データをリセットして適用（開発用）

```bash
supabase db reset
```
- すべてのデータが消去され、マイグレーションが再適用されます。

### 4. 反映後の確認

- Supabase管理画面の「Table Editor」でテーブルが作成されているか確認できます。

---
