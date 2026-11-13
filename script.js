const VALID_PASSCODES = ['3H3D', 'FERWAP2026', 'ADMIN'];

const isLoggedIn = sessionStorage.getItem('ferwap_auth') === 'true';
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// Proteksi halaman portal: jika belum login tapi membuka portal.html, kembalikan ke login.html
if (currentPage === 'portal.html' && !isLoggedIn) {
    window.location.href = 'login.html';
}

// Jika sudah login tapi membuka login.html, langsung arahkan ke portal.html
if (currentPage === 'login.html' && isLoggedIn) {
    window.location.href = 'portal.html';
}

// Sesuaikan tautan bawah (LOG IN berubah menjadi PORTAL jika sudah login)
const authNavLink = document.getElementById('authNavLink');
if (authNavLink && isLoggedIn) {
    authNavLink.textContent = 'PORTAL';
    authNavLink.href = 'portal.html';
}

// Proses Form Login di login.html
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    const passcodeInput = document.getElementById('passcodeInput');
    const errorMsg = document.getElementById('errorMsg');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = passcodeInput.value.trim().toUpperCase();

        if (VALID_PASSCODES.includes(code)) {
            sessionStorage.setItem('ferwap_auth', 'true');
            window.location.href = 'portal.html';
        } else {
            errorMsg.style.display = 'block';
        }
    });
}

// Proses Lock / Keluar di portal.html
const lockBtn = document.getElementById('lockBtn');
if (lockBtn) {
    lockBtn.addEventListener('click', () => {
        sessionStorage.removeItem('ferwap_auth');
        window.location.href = 'index.html';
    });
}
