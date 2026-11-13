// Daftar kode undangan yang valid (bisa Anda ubah atau tambah sesuai kebutuhan)
const VALID_PASSCODES = ['FERWAP2026', '3H3D', 'INVITEONLY'];

const loginGate = document.getElementById('loginGate');
const mainContent = document.getElementById('mainContent');
const loginForm = document.getElementById('loginForm');
const accessCodeInput = document.getElementById('accessCode');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

// Cek apakah pengguna sudah login di sesi browser ini
function checkAuth() {
    if (sessionStorage.getItem('ferwap_unlocked') === 'true') {
        loginGate.classList.add('hidden');
        mainContent.classList.remove('hidden');
    } else {
        loginGate.classList.remove('hidden');
        mainContent.classList.add('hidden');
    }
}

// Proses verifikasi kode undangan
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const enteredCode = accessCodeInput.value.trim().toUpperCase();

    if (VALID_PASSCODES.includes(enteredCode)) {
        sessionStorage.setItem('ferwap_unlocked', 'true');
        loginError.style.display = 'none';
        accessCodeInput.value = '';
        checkAuth();
    } else {
        loginError.style.display = 'block';
    }
});

// Tombol Lock / Keluar di menu atas
logoutBtn.addEventListener('click', function(e) {
    e.preventDefault();
    sessionStorage.removeItem('ferwap_unlocked');
    checkAuth();
});

// Jalankan pengecekan saat halaman pertama kali dibuka
checkAuth();

// Handler untuk formulir pengajuan
document.getElementById('inviteForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('artistName').value;
    const email = document.getElementById('artistEmail').value;
    const link = document.getElementById('demoLink').value;
    const notes = document.getElementById('notes').value;

    const subject = encodeURIComponent(`[Ferwap Invite Application] ${name}`);
    const body = encodeURIComponent(
        `Artist/Project Name: ${name}\nEmail: ${email}\nDemo/Catalog Link: ${link}\n\nProject Notes:\n${notes}`
    );

    window.location.href = `mailto:admin@ferwap.com?subject=${subject}&body=${body}`;
});
