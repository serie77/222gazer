// Shared docs page template with search
// Usage: include this script + call renderDocsPage({ content })

const SIDEBAR_ITEMS = [
    { title: 'Getting Started', href: 'getting-started.html', desc: 'Install, connect, and set up your first wallet', keywords: 'install chrome extension connect region api key wallet setup developer mode load unpacked ds sniper only export import dark mode popout disconnect header buttons update download version' },
    { title: 'Trading Accounts', href: 'trading-accounts.html', desc: 'Wallets, groups, and multi-wallet trading', keywords: 'generate import wallet private key rename delete drag reorder wallet groups color axiom header multi-wallet split buy amount balance' },
    { title: 'Trading Settings', href: 'trading-settings.html', desc: 'Presets, slippage, tips, MEV, and the trade bar', keywords: 'preset validator tip transaction fee slippage mev protection buy sell split sound kaching bell beep sparkle osu volume trade bar quick buy sell percentage close ata cashback' },
    { title: 'Deploy Settings', href: 'deploy-settings.html', desc: 'Flash Deploy, buy amounts, and instant deploy presets', keywords: 'main buy sol usd1 secondary instant deploy pump bonk bags fee sharing creator claimers keybind vamp button pulse meme flash deploy popout new tab' },
    { title: 'More Settings', href: 'more-settings.html', desc: 'Customization, performance, and advanced options', keywords: 'wallet highlight color toast notification style stack midnight glass aurora trade bar dark transparent gradient axiom wallet sync raw mode rust deploy cashback rewards' },
    { title: '222 Sniper', href: 'sniper.html', desc: 'Dev sell, limit order, CA snipe, and interaction snipe', keywords: 'automated sniper dev sell buy amount slippage tip mev wallets limit order market cap ca sniper contract address interaction twitter live feed execution history api key' },
    { title: 'Supported Platforms', href: 'supported-platforms.html', desc: 'PumpFun, Bonk, USD1, Bags, Raydium, and more', keywords: 'pumpfun pumpswap mayhem bonk launchlab bonkers usd1 bags virtual curve raydium cpmm v4 meteora amm jupiter deploy detection' },
    { title: 'FAQ', href: 'faq.html', desc: 'Common questions about trading, deploying, and performance', keywords: 'axiom private keys safe api key multiple devices trade fail slippage mev protection close ata flash deploy sniper raw mode rust deploy cashback' }
];

function buildSearch(container) {
    const input = container.querySelector('.docs-search-input');
    const results = container.querySelector('.docs-search-results');
    if (!input || !results) return;

    input.addEventListener('input', function () {
        const q = this.value.trim().toLowerCase();
        if (q.length < 2) {
            results.classList.remove('visible');
            results.innerHTML = '';
            return;
        }

        const matches = [];
        for (const item of SIDEBAR_ITEMS) {
            const haystack = (item.title + ' ' + item.desc + ' ' + item.keywords).toLowerCase();
            if (haystack.includes(q)) {
                // Find matching context
                let matchText = item.desc;
                const kwIndex = item.keywords.toLowerCase().indexOf(q);
                if (kwIndex !== -1) {
                    // Extract context around keyword match
                    const start = Math.max(0, kwIndex - 20);
                    const end = Math.min(item.keywords.length, kwIndex + q.length + 30);
                    matchText = (start > 0 ? '...' : '') + item.keywords.substring(start, end) + (end < item.keywords.length ? '...' : '');
                }
                // Highlight the match
                const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
                const highlighted = matchText.replace(re, '<mark>$1</mark>');
                matches.push({ item, highlighted });
            }
        }

        if (matches.length === 0) {
            results.innerHTML = '<div class="docs-search-empty">No results</div>';
        } else {
            results.innerHTML = matches.map(m =>
                `<a href="${m.item.href}" class="docs-search-result">
                    <span class="docs-search-result-title">${m.item.title}</span>
                    <span class="docs-search-result-match">${m.highlighted}</span>
                </a>`
            ).join('');
        }
        results.classList.add('visible');
    });

    // Close on click outside
    document.addEventListener('click', function (e) {
        if (!container.contains(e.target)) {
            results.classList.remove('visible');
        }
    });

    // Close on Escape
    input.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            results.classList.remove('visible');
            this.blur();
        }
    });

    // Keyboard shortcut: / to focus search
    document.addEventListener('keydown', function (e) {
        if (e.key === '/' && document.activeElement !== input && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            input.focus();
        }
    });
}

function renderDocsPage(config) {
    const currentPage = window.location.pathname.split('/').pop();
    const currentIndex = SIDEBAR_ITEMS.findIndex(item => item.href === currentPage);

    const sidebar = SIDEBAR_ITEMS.map(item => {
        const active = item.href === currentPage ? ' active' : '';
        return `<a href="${item.href}" class="sidebar-link${active}">${item.title}</a>`;
    }).join('\n');

    // Prev/next page nav
    let pageNav = '';
    const prev = currentIndex > 0 ? SIDEBAR_ITEMS[currentIndex - 1] : null;
    const next = currentIndex < SIDEBAR_ITEMS.length - 1 ? SIDEBAR_ITEMS[currentIndex + 1] : null;
    if (prev || next) {
        pageNav = '<div class="docs-page-nav">';
        if (prev) {
            pageNav += `<a href="${prev.href}"><span class="docs-page-nav-label">&larr; Previous</span><span class="docs-page-nav-title">${prev.title}</span></a>`;
        }
        if (next) {
            pageNav += `<a href="${next.href}" class="next"><span class="docs-page-nav-label">Next &rarr;</span><span class="docs-page-nav-title">${next.title}</span></a>`;
        }
        pageNav += '</div>';
    }

    document.getElementById('docs-app').innerHTML = `
        <nav class="docs-nav">
            <a href="../index.html" class="docs-nav-brand">
                <img src="../assets/222-image.png" alt="222" class="docs-nav-logo">
                <span class="docs-nav-title">222</span>
            </a>
            <div class="docs-nav-links">
                <a href="index.html"><img src="../assets/gitbook.svg" alt="" class="docs-nav-icon">Docs</a>
                <a href="https://discord.gg/your-invite" target="_blank"><img src="../assets/discord.svg" alt="" class="docs-nav-icon">Discord</a>
            </div>
        </nav>
        <div class="docs-layout">
            <aside class="docs-sidebar">
                <div class="docs-search">
                    <svg class="docs-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input type="text" class="docs-search-input" placeholder="Search docs..." spellcheck="false">
                    <div class="docs-search-results"></div>
                </div>
                <div class="sidebar-section-title">Documentation</div>
                ${sidebar}
            </aside>
            <main class="docs-main">
                <article class="docs-content">
                    ${config.content}
                </article>
                ${pageNav}
            </main>
        </div>
        <div class="docs-footer">
            <div class="docs-footer-inner">
                <span>222</span>
                <div class="docs-footer-nav">
                    <a href="../index.html">Home</a>
                    <a href="https://discord.gg/your-invite" target="_blank">Discord</a>
                </div>
            </div>
        </div>
    `;

    // Init search
    buildSearch(document.querySelector('.docs-search'));
}
