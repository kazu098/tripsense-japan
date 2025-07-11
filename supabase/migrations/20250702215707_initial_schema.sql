-- ユーザーテーブル
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- カテゴリテーブル
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_ja TEXT NOT NULL,
  description_en TEXT,
  description_ja TEXT,
  color TEXT DEFAULT '#3B82F6',
  category_type TEXT NOT NULL CHECK (category_type IN ('traveler_type', 'content_category')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 体験テーブル
CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_ja TEXT NOT NULL,
  description_en TEXT,
  description_ja TEXT,
  location TEXT NOT NULL,
  area TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  url TEXT,
  thumbnail_image TEXT,
  family_friendly BOOLEAN DEFAULT false,
  english_support BOOLEAN DEFAULT false,
  reservation_required BOOLEAN DEFAULT false,
  notes TEXT,
  duration_hours INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 体験画像テーブル
CREATE TABLE experience_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID REFERENCES experiences(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- タグテーブル
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
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
  day_number INTEGER NOT NULL,
  order_in_day INTEGER DEFAULT 0,
  start_time TEXT,
  end_time TEXT,
  notes TEXT,
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

-- RLS有効化
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- 主要ポリシー
CREATE POLICY "ユーザーは自分のプロフィールを閲覧可能" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "カテゴリは誰でも閲覧可能" ON categories
  FOR SELECT USING (true);

CREATE POLICY "体験は誰でも閲覧可能" ON experiences
  FOR SELECT USING (true);

CREATE POLICY "ユーザーは自分のプランを閲覧可能" ON plans
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "ユーザーは自分のお気に入りを閲覧可能" ON wishlists
  FOR ALL USING (auth.uid() = user_id);
