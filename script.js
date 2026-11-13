// ==========================================
// KONFIGURASI SUPABASE (Ganti dengan kunci proyek Anda)
// ==========================================
const SUPABASE_URL = 'https://donsspcslvpzuphptmft.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvbnNzcGNzbHZwenVwaHB0bWZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQyNDMyMTMsImV4cCI6MjEwOTgxOTIxM30.P_V9vLXaUdoxY5EGMMQYrL4Ecjze_By6PI-hDj7jyH8';

// Inisialisasi klien Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// Cek Sesi Login secara Asinkronus
async function checkAuthSession() {
    const { data: { session } } = await supabase.auth.getSession();
    
    // Proteksi halaman portal: jika belum login, tendang ke login.html
    if (currentPage === 'portal.html' && !session) {
        window.location.href = 'login.html';
    }
    // Jika sudah login tapi membuka login.html, arahkan ke portal.html
    if (currentPage === 'login.html' && session) {
        window.location.href = 'portal.html';
    }

    // Ubah teks menu navigasi bawah jika sudah login
    const authNavLink = document.getElementById('authNavLink');
    if (authNavLink && session) {
        authNavLink.textContent = 'PORTAL';
        authNavLink.href = 'portal.html';
    }
}
checkAuthSession();

// 1. Proses Login (Supabase Auth)
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        const errorMsg = document.getElementById('errorMsg');

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            errorMsg.style.display = 'block';
            errorMsg.textContent = error.message;
        } else {
            window.location.href = 'portal.html';
        }
    });
}

// 2. Proses Pendaftaran Publishing (Simpan otomatis ke Tabel Supabase)
const publishingForm = document.getElementById('publishingForm');
if (publishingForm) {
    publishingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const first_name = document.getElementById('pubFirstName').value.trim();
        const last_name = document.getElementById('pubLastName').value.trim();
        const publishing_qty = document.getElementById('pubQty').value.trim();
        const currently_administrated = document.getElementById('pubAdministered').value.trim();
        const country = document.getElementById('pubCountry').value.trim();
        const email = document.getElementById('pubEmail').value.trim();

        // Kirim data langsung ke tabel database Supabase
        const { data, error } = await supabase
            .from('publishing_applications')
            .insert([{ 
                first_name, 
                last_name, 
                publishing_qty, 
                currently_administrated, 
                country, 
                email 
            }]);

        if (error) {
            alert('Gagal mengirim aplikasi: ' + error.message);
        } else {
            alert('Aplikasi Publishing berhasil dikirim dan tersimpan di database.');
            publishingForm.reset();
        }
    });
}

// 3. Proses Logout / Keluar (Supabase SignOut)
const lockBtn = document.getElementById('lockBtn');
if (lockBtn) {
    lockBtn.addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = 'index.html';
    });
}
