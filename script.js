// Valid invite passcodes
const VALID_PASSCODES = ['FERWAP2026', '3H3D', 'INVITEONLY'];

const loginGate = document.getElementById('loginGate');
const mainContent = document.getElementById('mainContent');
const loginForm = document.getElementById('loginForm');
const accessCodeInput = document.getElementById('accessCode');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

// Authentication Check
function checkAuth() {
    if (sessionStorage.getItem('ferwap_unlocked') === 'true') {
        loginGate.classList.add('hidden');
        mainContent.classList.remove('hidden');
    } else {
        loginGate.classList.remove('hidden');
        mainContent.classList.add('hidden');
    }
}

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

logoutBtn.addEventListener('click', function() {
    sessionStorage.removeItem('ferwap_unlocked');
    checkAuth();
});

checkAuth();

// =========================================
// PAGE SWITCHING LOGIC (SPA NAVIGATION)
// =========================================
const navButtons = document.querySelectorAll('.nav-btn');
const switchTriggers = document.querySelectorAll('.switch-trigger');
const pageViews = document.querySelectorAll('.page-view');

function switchPage(targetId) {
    // Update active state on navigation buttons
    navButtons.forEach(btn => {
        if (btn.getAttribute('data-target') === targetId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Show target view and hide others
    pageViews.forEach(view => {
        if (view.id === targetId) {
            view.classList.add('active-view');
        } else {
            view.classList.remove('active-view');
        }
    });
}

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        switchPage(target);
    });
});

switchTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        switchPage(target);
    });
});

// =========================================
// RELEASE SUBMISSION HANDLER
// =========================================
document.getElementById('inviteForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('artistName').value;
    const email = document.getElementById('artistEmail').value;
    const link = document.getElementById('demoLink').value;
    const notes = document.getElementById('notes').value;

    const subject = encodeURIComponent(`[Ferwap Release/Demo] ${name}`);
    const body = encodeURIComponent(
        `Artist/Project Name: ${name}\nEmail: ${email}\nAudio/Drive Link: ${link}\n\nRelease Details & Credits:\n${notes}`
    );

    window.location.href = `mailto:admin@ferwap.com?subject=${subject}&body=${body}`;
});
