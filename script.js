// ==========================================
// KONFIGURASI SUPABASE
// ==========================================
const SUPABASE_URL = 'https://donsspcslvpzuphptmft.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvbnNzcGNzbHZwenVwaHB0bWZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQyNDMyMTMsImV4cCI6MjEwOTgxOTIxM30.P_V9vLXaUdoxY5EGMMQYrL4Ecjze_By6PI-hDj7jyH8';

// Inisialisasi klien Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// Cek Sesi Login secara Asinkronus
async function checkAuthSession() {
    try {
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
    } catch (err) {
        console.error('Auth session check error:', err);
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

        if (errorMsg) errorMsg.style.display = 'none';

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            if (errorMsg) {
                errorMsg.style.display = 'block';
                errorMsg.textContent = error.message;
            } else {
                alert('Login Gagal: ' + error.message);
            }
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

// 4. Ambil dan Tampilkan Data Publishing Applications di portal.html
const submissionsContainer = document.getElementById('submissionsContainer');
if (submissionsContainer) {
    async function loadPublishingSubmissions() {
        const { data, error } = await supabase
            .from('publishing_applications')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            submissionsContainer.innerHTML = `<p style="color: #ef4444; font-size: 0.85rem;">Gagal memuat data: ${error.message}</p>`;
            return;
        }

        if (!data || data.length === 0) {
            submissionsContainer.innerHTML = `<p style="color: #a1a1aa; font-size: 0.85rem;">Belum ada data pendaftaran publishing yang masuk.</p>`;
            return;
        }

        let html = '<div style="display: flex; flex-direction: column; gap: 12px;">';
        data.forEach(item => {
            html += `
                <div style="background: #181822; border: 1px solid #2a2a38; border-radius: 6px; padding: 14px 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <strong style="color: #ffffff; font-size: 0.95rem;">${item.first_name} ${item.last_name}</strong>
                        <span style="font-size: 0.75rem; color: #d4af37; background: rgba(212, 175, 55, 0.1); padding: 2px 8px; border-radius: 4px;">Qty: ${item.publishing_qty}</span>
                    </div>
                    <div style="font-size: 0.85rem; color: #a1a1aa; display: flex; flex-wrap: wrap; gap: 16px;">
                        <span>✉️ ${item.email}</span>
                        <span>🌍 Country: ${item.country}</span>
                        <span>📋 Administered: ${item.currently_administrated}</span>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        submissionsContainer.innerHTML = html;
    }
    loadPublishingSubmissions();
}
