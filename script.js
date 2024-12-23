document.addEventListener('DOMContentLoaded', () => {
    // 現在のページのURLを取得
    const currentPage = window.location.pathname.split("/").pop();

    // ナビゲーションリンクを取得
    const navLinks = document.querySelectorAll('#navbar li a');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // ナビゲーションのバーのトグル
    const bar = document.getElementById('bar');
    const close = document.getElementById('close');
    const nav = document.getElementById('navbar');

    if (bar) {
        bar.addEventListener('click', () => {
            nav.classList.add('active');
        });
    }

    if (close) {
        close.addEventListener('click', () => {
            nav.classList.remove('active');
        });
    }

    // アクティブボタンのクリックエフェクト
    const activeButtons = document.querySelectorAll('#navbar li a.active');

    activeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // ページ遷移を防ぐ（テスト時のみ）
            e.preventDefault();
            // 一時的にクラスを追加してアニメーションをトリガー
            button.classList.add('clicked');

            // アニメーションが完了したらクラスを削除
            setTimeout(() => {
                button.classList.remove('clicked');
                // ページ遷移を実行
                window.location.href = button.getAttribute('href');
            }, 300); // アニメーションの持続時間と一致させる
        });
    });

    // 検索機能の実装
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            const products = document.querySelectorAll('.pro');

            products.forEach(product => {
                const title = product.querySelector('h5').textContent.toLowerCase();
                if (title.includes(query)) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    }
});