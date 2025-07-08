# 🎯 Emoji Explorer

絵文字をランダムに見ることのできるアプリです。1,700以上の絵文字とその正式名称を見ることができます。

## 特徴

- **1,700以上の絵文字**: 8つのメインカテゴリ、48のサブカテゴリ
- **カテゴリフィルター**: 学習したいカテゴリを選択可能
- **レスポンシブデザイン**: PC・タブレット・スマートフォン対応

## 使い方

1. サイトを開くとランダムな絵文字が表示されます
2. 左側のカテゴリから学習したいものを選択
3. 「Next」ボタンで次の絵文字を表示
4. スペースキーまたはEnterキーでも次に進めます
5. 絵文字の下にCategoryとSubcategoryが表示されます

## カテゴリ

- **Smileys**:  顔文字・表情
- **People** : 人物・職業・ジェスチャー
- **Nature** : 動物・植物・天気
- **Food & Drink** : 食べ物・飲み物
- **Activity** : スポーツ・イベント・ゲーム
- **Objects** : 衣類・音楽・IT・文房具など
- **Symbols** : ハート・矢印・記号
- **Flags** : 世界各国の国旗

## GitHub Pagesでの公開方法

1. このリポジトリをフォークまたはクローン
2. GitHub Pagesを有効化
3. `emojis_by_main_categories.json`ファイルが正しく配置されていることを確認
4. サイトにアクセス

## ファイル構成

```
├── index.html              # メインHTML
├── style.css              # スタイルシート
├── script.js              # JavaScript
├── emojis_by_main_categories.json  # 絵文字データ
├── manifest.json          # PWAマニフェスト
├── sw.js                  # サービスワーカー
└── README.md              # このファイル
```

## 技術スタック

- **HTML5**: セマンティックマークアップ
- **CSS3**: Flexbox・Grid・アニメーション
- **Vanilla JavaScript**: ES6+・Fetch API

## データソース

絵文字データは[Emojipedia](https://emojipedia.org/)を参考に作成されています。

## デザイン

- **カラーパレット**: 紫系グラデーション (#667eea → #764ba2)
- **フォント**: Inter (Google Fonts)
- **アニメーション**: CSS Transitions・Keyframes
- **レイアウト**: CSS Grid・Flexbox

## PWA機能

- オフライン対応
- ホーム画面への追加
- アプリライクな体験

### 絵文字データの更新
`emojis_by_main_categories.json`を編集して絵文字を追加・削除できます。

## コントリビューション

プルリクエストやイシューの報告を歓迎します！
