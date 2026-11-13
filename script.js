// Data akun uji coba untuk login (atau ganti sesuai database/sistem Anda nanti)
const VALID_EMAIL = "admin@ferwap.com";
const VALID_PASSWORD = "3H3D";

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
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('loginEmail').value.trim().toLowerCase();
        const passwordInput = document.getElementById('loginPassword').value.trim();
        const errorMsg = document.getElementById('errorMsg');

        // Validasi email dan password (bisa disesuaikan)
        if (emailInput === VALID_EMAIL && passwordInput === VALID_PASSWORD) {
            sessionStorage.setItem('ferwap_auth', 'true');
            window.location.href = 'portal.html';
        } else {
            errorMsg.style.display = 'block';
        }
    });
}

// Proses Publishing Form di publishing.html
const publishingForm = document.getElementById('publishingForm');
if (publishingForm) {
    publishingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const first = document.getElementById('pubFirstName').value;
        const last = document.getElementById('pubLastName').value;
        const qty = document.getElementById('pubQty').value;
        const adminStatus = document.getElementById('pubAdministered').value;
        const country = document.getElementById('pubCountry').value;
        const email = document.getElementById('pubEmail').value;

        const subject = encodeURIComponent(`[Publishing Admin Application] ${first} ${last}`);
        const body = encodeURIComponent(
            `First Name: ${first}\n` +
            `Last Name: ${last}\n` +
            `Publishing Qty: ${qty}\n` +
            `Currently Administrated?: ${adminStatus}\n` +
            `Country: ${country}\n` +
            `Email: ${email}`
        );

        window.location.href = `mailto:admin@ferwap.com?subject=${subject}&body=${body}`;
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
