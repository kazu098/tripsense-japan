-- categoriesテーブルにimage_urlカラムを追加
ALTER TABLE categories ADD COLUMN image_url TEXT;

-- 既存のカテゴリにデフォルト画像URLを設定
UPDATE categories SET image_url = '/images/categories/default.jpg' WHERE image_url IS NULL; 