class EmojiExplorer {
    constructor() {
        this.emojiData = {};
        this.allEmojis = [];
        this.filteredEmojis = [];
        this.currentEmoji = null;
        this.selectedCategories = new Set();

        this.init();
    }

    async init() {
        try {
            await this.loadEmojiData();
            this.setupEventListeners();
            this.renderCategories();
            // 初期表示は1回だけ
            this.showRandomEmoji();
        } catch (error) {
            console.error('初期化エラー:', error);
            this.showError('データの読み込みに失敗しました。');
        }
    }

    async loadEmojiData() {
        try {
            const response = await fetch('emojis_by_main_categories.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.emojiData = await response.json();
            this.processEmojiData();
        } catch (error) {
            console.error('JSONファイルの読み込みエラー:', error);
            throw error;
        }
    }

    processEmojiData() {
        this.allEmojis = [];

        // 全ての絵文字を平坦化
        Object.entries(this.emojiData).forEach(([mainCategory, subcategories]) => {
            Object.entries(subcategories).forEach(([subcategory, emojis]) => {
                emojis.forEach(emoji => {
                    this.allEmojis.push({
                        ...emoji,
                        mainCategory,
                        subcategory
                    });
                });
            });
        });

        // 初期状態では全カテゴリを選択
        this.selectedCategories = new Set(Object.keys(this.emojiData));
        this.updateFilteredEmojis();
    }

    updateFilteredEmojis() {
        this.filteredEmojis = this.allEmojis.filter(emoji =>
            this.selectedCategories.has(emoji.mainCategory)
        );
    }

    renderCategories() {
        const categoryGrid = document.getElementById('categoryGrid');
        categoryGrid.innerHTML = '';

        Object.entries(this.emojiData).forEach(([category, subcategories]) => {
            const emojiCount = Object.values(subcategories).reduce((sum, emojis) => sum + emojis.length, 0);

            const categoryItem = document.createElement('div');
            categoryItem.className = 'category-item checked';

            categoryItem.innerHTML = `
                <input type="checkbox"
                       class="category-checkbox"
                       id="category-${category}"
                       checked
                       data-category="${category}">
                <label class="category-label" for="category-${category}">
                    ${category}
                </label>
                <span class="category-count">${emojiCount}</span>
            `;

            categoryGrid.appendChild(categoryItem);
        });
    }

    setupEventListeners() {
        // Nextボタン
        document.getElementById('nextButton').addEventListener('click', () => {
            this.showRandomEmoji();
        });

        // Copyボタン
        document.getElementById('copyButton').addEventListener('click', () => {
            this.copyEmojiToClipboard();
        });

        // 全て選択ボタン
        document.getElementById('selectAllButton').addEventListener('click', () => {
            this.selectAllCategories();
        });

        // 全て解除ボタン
        document.getElementById('deselectAllButton').addEventListener('click', () => {
            this.deselectAllCategories();
        });

        // カテゴリアイテム全体をクリック可能に
        document.getElementById('categoryGrid').addEventListener('click', (e) => {
            const categoryItem = e.target.closest('.category-item');
            if (categoryItem) {
                const checkbox = categoryItem.querySelector('.category-checkbox');

                // チェックボックス自体がクリックされた場合は自然な動作に任せる
                if (e.target === checkbox) {
                    return;
                }

                // category-item内の他の部分がクリックされた場合
                e.preventDefault();
                e.stopPropagation();

                // チェックボックスの状態を切り替え
                checkbox.checked = !checkbox.checked;

                // change イベントを手動で発火
                const changeEvent = new Event('change', { bubbles: true });
                checkbox.dispatchEvent(changeEvent);
            }
        });

        // カテゴリチェックボックスの変更
        document.getElementById('categoryGrid').addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                this.handleCategoryChange(e);
            }
        });

        // キーボードショートカット
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                this.showRandomEmoji();
            }
        });
    }

    handleCategoryChange(e) {
        const category = e.target.dataset.category;
        const categoryItem = e.target.closest('.category-item');

        if (e.target.checked) {
            this.selectedCategories.add(category);
            categoryItem.classList.add('checked');
        } else {
            this.selectedCategories.delete(category);
            categoryItem.classList.remove('checked');
        }

        this.updateFilteredEmojis();

        // 現在表示中の絵文字が選択されたカテゴリに含まれない場合のみ、新しい絵文字を表示
        if (this.currentEmoji && !this.selectedCategories.has(this.currentEmoji.mainCategory)) {
            this.showRandomEmoji();
        }

        // 全てのカテゴリが解除された場合の処理
        if (this.selectedCategories.size === 0) {
            this.showNoEmojiMessage();
        }
    }

    showRandomEmoji() {
        if (this.filteredEmojis.length === 0) {
            this.showNotification('カテゴリを1つ以上選択してください');
            this.showNoEmojiMessage();
            return;
        }

        // 前回の絵文字を保存
        const previousEmoji = this.currentEmoji;
        
        // ランダムに絵文字を選択
        let randomIndex = Math.floor(Math.random() * this.filteredEmojis.length);
        this.currentEmoji = this.filteredEmojis[randomIndex];
        
        // 選択肢が2つ以上あり、前回と同じ絵文字が選ばれた場合は再選択
        if (this.filteredEmojis.length > 1 && previousEmoji && 
            this.currentEmoji.emoji === previousEmoji.emoji) {
            // 再度ランダムに選択（前回と違うものが選ばれるまで）
            do {
                randomIndex = Math.floor(Math.random() * this.filteredEmojis.length);
                this.currentEmoji = this.filteredEmojis[randomIndex];
            } while (this.currentEmoji.emoji === previousEmoji.emoji);
        }

        this.displayEmoji(this.currentEmoji);

        // Nextボタンを有効化
        document.getElementById('nextButton').disabled = false;
    }

    displayEmoji(emoji) {
        const emojiCard = document.getElementById('emojiCard');
        emojiCard.classList.add('loading');

        setTimeout(() => {
            document.getElementById('emojiChar').textContent = emoji.emoji;
            document.getElementById('emojiName').textContent = emoji.description;
            document.getElementById('categoryValue').textContent = emoji.mainCategory;
            document.getElementById('subcategoryValue').textContent = emoji.subcategory;

            // Copyボタンを有効化
            document.getElementById('copyButton').disabled = false;

            emojiCard.classList.remove('loading');
        }, 100);
    }

    showError(message) {
        document.getElementById('emojiChar').textContent = '';
        document.getElementById('emojiName').textContent = message;
        document.getElementById('categoryValue').textContent = 'エラー';
        document.getElementById('subcategoryValue').textContent = '';
        
        // Copyボタンを無効化
        document.getElementById('copyButton').disabled = true;
    }

    showNoEmojiMessage() {
        document.getElementById('emojiChar').textContent = '';
        document.getElementById('emojiName').textContent = '表示できる絵文字がありません。カテゴリを1つ以上選択してください';
        document.getElementById('categoryValue').textContent = '-';
        document.getElementById('subcategoryValue').textContent = '-';
        
        // Copyボタンを無効化
        document.getElementById('copyButton').disabled = true;
    }

    async copyEmojiToClipboard() {
        if (!this.currentEmoji) {
            this.showNotification('コピーする絵文字がありません');
            return;
        }

        try {
            await navigator.clipboard.writeText(this.currentEmoji.emoji);
            this.showNotification(`${this.currentEmoji.emoji} をコピーしました！`);
            
            // Copyボタンの一時的なフィードバック
            const copyButton = document.getElementById('copyButton');
            const originalText = copyButton.innerHTML;
            copyButton.innerHTML = '✅ Copied!';
            copyButton.disabled = true;
            
            setTimeout(() => {
                copyButton.innerHTML = originalText;
                copyButton.disabled = false;
            }, 1500);
            
        } catch (err) {
            console.error('クリップボードへのコピーに失敗:', err);
            // フォールバック: 古いブラウザ対応
            this.fallbackCopyToClipboard(this.currentEmoji.emoji);
        }
    }

    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showNotification(`${text} をコピーしました！`);
        } catch (err) {
            console.error('フォールバックコピーも失敗:', err);
            this.showNotification('コピーに失敗しました');
        }
        
        document.body.removeChild(textArea);
    }

    showNotification(message) {
        // 簡単な通知表示
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #32cd32; /* Stronger green color */
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            font-weight: 500;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    selectAllCategories() {
        const checkboxes = document.querySelectorAll('.category-checkbox');
        checkboxes.forEach(checkbox => {
            if (!checkbox.checked) {
                checkbox.checked = true;
                const categoryItem = checkbox.closest('.category-item');
                categoryItem.classList.add('checked');
                this.selectedCategories.add(checkbox.dataset.category);
            }
        });
        this.updateFilteredEmojis();
        // 全選択時は自動で新しい絵文字を表示しない
    }

    deselectAllCategories() {
        const checkboxes = document.querySelectorAll('.category-checkbox');
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                checkbox.checked = false;
                const categoryItem = checkbox.closest('.category-item');
                categoryItem.classList.remove('checked');
                this.selectedCategories.delete(checkbox.dataset.category);
            }
        });
        this.updateFilteredEmojis();
        this.showNotification('カテゴリを1つ以上選択してください');
    }
}

// アプリケーション開始
document.addEventListener('DOMContentLoaded', () => {
    new EmojiExplorer();
});

// PWA対応のためのサービスワーカー登録（オプション）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
