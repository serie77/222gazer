// Docs password gate — SHA-256 hash check
(function () {
    const HASH = '60904bcf9b9be3f25c7b121a8856fd5964e87135e00ef8d8abdf8199542e8159';
    const SESSION_KEY = '__222_docs_auth';

    async function sha256(str) {
        const buf = new TextEncoder().encode(str);
        const hash = await crypto.subtle.digest('SHA-256', buf);
        return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    if (sessionStorage.getItem(SESSION_KEY) === HASH) return;

    // Block page
    document.documentElement.style.overflow = 'hidden';
    var overlay = document.createElement('div');
    overlay.id = '__222-auth-overlay';
    overlay.innerHTML = `
        <style>
            #__222-auth-overlay {
                position: fixed; inset: 0; z-index: 99999;
                background: #050510;
                display: flex; flex-direction: column;
                align-items: center; justify-content: center;
                font-family: 'Inter', -apple-system, sans-serif;
                gap: 24px;
            }
            #__222-auth-overlay .auth-logo {
                width: 56px; height: 56px; border-radius: 50%;
                border: 1px solid rgba(255,255,255,0.08);
                box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            }
            #__222-auth-overlay .auth-title {
                font-size: 14px; font-weight: 600;
                color: rgba(255,255,255,0.5);
                letter-spacing: 0.03em;
            }
            #__222-auth-overlay .auth-input {
                width: 280px; padding: 12px 16px;
                background: rgba(255,255,255,0.04);
                border: 1px solid rgba(255,255,255,0.08);
                border-radius: 10px; outline: none;
                color: rgba(255,255,255,0.8);
                font-size: 13px; font-family: inherit;
                text-align: center; letter-spacing: 0.02em;
                transition: border-color 0.2s;
            }
            #__222-auth-overlay .auth-input:focus {
                border-color: rgba(255,255,255,0.16);
            }
            #__222-auth-overlay .auth-input::placeholder {
                color: rgba(255,255,255,0.15);
            }
            #__222-auth-overlay .auth-error {
                font-size: 12px; color: rgba(255,80,80,0.7);
                height: 16px;
            }
            #__222-auth-overlay .auth-input.shake {
                animation: authShake 0.4s ease;
                border-color: rgba(255,80,80,0.4);
            }
            @keyframes authShake {
                0%,100% { transform: translateX(0); }
                20% { transform: translateX(-8px); }
                40% { transform: translateX(8px); }
                60% { transform: translateX(-4px); }
                80% { transform: translateX(4px); }
            }
        </style>
        <img src="../assets/222-image.png" class="auth-logo" alt="222">
        <div class="auth-title">Documentation is password protected</div>
        <input type="password" class="auth-input" placeholder="Enter password" spellcheck="false" autocomplete="off">
        <div class="auth-error"></div>
    `;

    // Insert before anything renders
    document.body.appendChild(overlay);

    var input = overlay.querySelector('.auth-input');
    var error = overlay.querySelector('.auth-error');

    input.focus();
    input.addEventListener('keydown', async function (e) {
        if (e.key !== 'Enter') return;
        var val = input.value;
        if (!val) return;

        var h = await sha256(val);
        if (h === HASH) {
            sessionStorage.setItem(SESSION_KEY, HASH);
            overlay.remove();
            document.documentElement.style.overflow = '';
        } else {
            error.textContent = 'Wrong password';
            input.classList.add('shake');
            input.value = '';
            setTimeout(function () { input.classList.remove('shake'); }, 400);
        }
    });
})();
