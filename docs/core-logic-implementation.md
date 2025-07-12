# TripSense Japan コアロジック実装方針

## 1. ホームページ

### 機能
- Explore Japan Your Way セクションでカテゴリ一覧を表示
- 各カテゴリのサムネイル画像（現時点ではimageURL未設定なのでデフォルト画像を使用）
- 「診断を始める」ボタンでトラベルスタイルクイズページへ遷移

### 技術・UI
- **UIライブラリ**: shadcn/ui（Button, Card, Grid等）
- **データ取得**: Supabaseのcategoriesテーブルから全カテゴリ取得
- **画像**: imageURLが未設定の場合はデフォルト画像（例: `/public/no-image.png`）を表示
- **ルーティング**: Next.js App Router (`/travel-style-quiz` へ遷移)

---

## 2. トラベルスタイルクイズ

### ステップ1: Who's going on this trip?
- experience_tagsの「XXX向け」タグ（例: 子連れファミリー向け、グループ旅行向け、ハネムーン向け、シニアにも優しい、若者に人気）から選択肢を生成
- 選択されたタグIDを状態として保持

### ステップ2: What's most important to you?
- categoriesテーブルのカテゴリ一覧から選択肢を生成
- 選択されたカテゴリIDを状態として保持

### 技術・UI
- **UIライブラリ**: shadcn/ui（RadioGroup, Button, ProgressBar等）
- **データ取得**: Supabaseのexperience_tags, categoriesテーブル
- **状態管理**: React useState/useContextでクイズ進行・選択値を管理

---

## 3. Personalized Travel Suggestions（診断結果）

### 機能
- クイズで選択した「XXX向け」タグ・カテゴリでSupabaseのexperiencesを絞り込み
- 絞り込んだexperienceをカテゴリごとにグルーピングして表示
- 各experienceカードにタイトル・説明・画像（なければデフォルト画像）を表示

### 技術・UI
- **UIライブラリ**: shadcn/ui（Card, Grid, Badge等）
- **データ取得**: Supabaseのexperiences, experience_tags, categoriesテーブルをJOINしてフィルタリング
- **グルーピング**: カテゴリごとにexperienceをまとめて表示
- **画像**: experienceの画像がなければデフォルト画像

---

## 4. ウィッシュリストとプラン生成

### ウィッシュリスト機能
- 各experienceカードに「Add to Wish List」ボタンを設置
- ユーザーは気に入った体験をウィッシュリストに追加できる
- ログインしていなくてもローカルストレージ等で一時的に保存可能

### プラン生成（Create Your Plan）
- 「Create Your Plan」ボタンでウィッシュリストのexperienceをもとに自動で5日間の旅行プランを生成
- 各experienceの`duration_hours`と`場所（location/area）`を考慮し、近い場所の体験は同じ日にまとめる
- 選択体験が少なすぎて5日分埋まらない場合は、他ユーザーが好みそうなexperience（レコメンド）を自動追加
- 多すぎる場合は適切に間引いて5日分に収める
- 生成プランは`trip-plan-detail-page`のような詳細画面で表示

### 技術・UI
- **状態管理**: ログイン前はlocalStorageやReact Contextでウィッシュリスト・プラン情報を保持
- **プラン生成ロジック**: Supabaseからexperience情報を取得し、場所・所要時間でグルーピング&日程割り当て
- **レコメンド**: タグや人気度で他ユーザーが好みそうなexperienceを選出
- **UI**: shadcn/uiのCard, Button, List, Modal等

---

## 5. 認証導線と保存フロー

### ログインなしでの利用
- ホーム画面〜診断〜ウィッシュリスト追加〜プラン生成まではログイン不要
- すべての一時データはlocalStorageやContextで管理

### プラン保存時の認証導線
- 「プランを保存」や「お気に入り登録」など、ユーザー固有のデータ保存アクション時にのみログイン/新規登録を促す
- 保存ボタン押下時にshadcn/uiのModalやDrawerで「ログイン/新規登録」画面を表示
- Supabase Authentication（Email/Google等）を利用
- 認証後、localStorageのデータをサーバー側（Supabase DB）に同期

---

## 画面遷移・データフロー（更新）

1. ホームページ
    - Supabaseからカテゴリ一覧取得
    - カテゴリカード表示
    - 「診断を始める」ボタン押下でクイズページへ
2. トラベルスタイルクイズ
    - ステップ1: experience_tagsから「XXX向け」選択
    - ステップ2: categoriesからカテゴリ選択
    - 選択値を保持し「診断結果を見る」ボタンで結果ページへ
3. Personalized Travel Suggestions
    - Supabaseでexperienceをタグ・カテゴリで絞り込み
    - カテゴリごとにexperienceカードを表示
4. ウィッシュリスト追加
    - ログイン不要、localStorage/Contextで管理
5. プラン生成
    - ログイン不要、localStorage/Contextで管理
6. プラン保存
    - 保存時に認証導線（Modal/Drawer）
    - 認証後、データをSupabaseに保存

---

## 今後の拡張ポイント
- experience, category, tagの画像アップロード・管理機能
- クイズの質問追加や分岐ロジック強化
- お気に入り登録やプラン生成への導線追加 