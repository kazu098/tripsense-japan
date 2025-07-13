-- categoriesテーブルにimage_urlカラムを追加（まだ存在しない場合）
ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 各カテゴリのimage_urlを更新
UPDATE categories 
SET image_url = '/images/categories/cultural-experience.svg'
WHERE id = '00000000-0000-0000-0000-000000000001';

UPDATE categories 
SET image_url = '/images/categories/traditional-japan.svg'
WHERE id = '00000000-0000-0000-0000-000000000002';

UPDATE categories 
SET image_url = '/images/categories/gourmet.svg'
WHERE id = '00000000-0000-0000-0000-000000000003';

UPDATE categories 
SET image_url = '/images/categories/pop-culture.svg'
WHERE id = '00000000-0000-0000-0000-000000000004';

UPDATE categories 
SET image_url = '/images/categories/family-activity.svg'
WHERE id = '00000000-0000-0000-0000-000000000005';

UPDATE categories 
SET image_url = '/images/categories/art-architecture.svg'
WHERE id = '00000000-0000-0000-0000-000000000006';

UPDATE categories 
SET image_url = '/images/categories/festival-event.svg'
WHERE id = '00000000-0000-0000-0000-000000000007';

UPDATE categories 
SET image_url = '/images/categories/relaxation.svg'
WHERE id = '00000000-0000-0000-0000-000000000008';

UPDATE categories 
SET image_url = '/images/categories/nature-scenery.svg'
WHERE id = '00000000-0000-0000-0000-000000000009';

UPDATE categories 
SET image_url = '/images/categories/shopping.svg'
WHERE id = '00000000-0000-0000-0000-000000000010';

UPDATE categories 
SET image_url = '/images/categories/nightlife.svg'
WHERE id = '00000000-0000-0000-0000-000000000011';

UPDATE categories 
SET image_url = '/images/categories/observation-deck.svg'
WHERE id = '00000000-0000-0000-0000-000000000012';

-- 更新結果を確認
SELECT id, name_ja, image_url FROM categories ORDER BY id; 