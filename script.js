// DOM Elements for Auth & Navigation
const authScreen = document.getElementById('authScreen');
const dashboardScreen = document.getElementById('dashboardScreen');
const loginBox = document.getElementById('loginBox');
const applyBox = document.getElementById('applyBox');
const toApplyBtn = document.getElementById('toApplyBtn');
const toLoginBtn = document.getElementById('toLoginBtn');

const loginForm = document.getElementById('loginForm');
const applyForm = document.getElementById('applyForm');
const loginPass = document.getElementById('loginPass');
const authError = document.getElementById('authError');
const logoutBtn = document.getElementById('logoutBtn');

const navTabs = document.querySelectorAll('.nav-tab');
const switchTabBtns = document.querySelectorAll('.switch-tab-btn');
const dashViews = document.querySelectorAll('.dash-view');

// Check Session on Load
function checkSession() {
    if (sessionStorage.getItem('ferwap_logged_in') === 'true') {
        authScreen.classList.add('hidden');
        dashboardScreen.classList.remove('hidden');
    } else {
        authScreen.classList.remove('hidden');
        dashboardScreen.classList.add('hidden');
    }
}

// Toggle between Login and Apply form boxes
toApplyBtn.addEventListener('click', () => {
    loginBox.classList.add('hidden');
    applyBox.classList.remove('hidden');
});

toLoginBtn.addEventListener('click', () => {
    applyBox.classList.add('hidden');
    loginBox.classList.remove('hidden');
});

// Login Handler (Accepts passcode / password)
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const pass = loginPass.value.trim().toUpperCase();

    // Valid passcodes or demo entry
    const validPasscodes = ['3H3D', 'FERWAP2026', 'ADMIN', 'PASSWORD'];

    if (validPasscodes.includes(pass) || pass.length > 3) {
        sessionStorage.setItem('ferwap_logged_in', 'true');
        authError.style.display = 'none';
        loginPass.value = '';
        checkSession();
    } else {
        authError.style.display = 'block';
    }
});

// Apply / Invite Submission Handler
applyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('aplFirst').value;
    const artist = document.getElementById('aplArtist').value;
    const email = document.getElementById('aplEmail').value;
    const link = document.getElementById('aplLink').value;

    const subject = encodeURIComponent(`[Apply for Invite] ${artist} (${name})`);
    const body = encodeURIComponent(`Name: ${name}\nArtist/Label: ${artist}\nEmail: ${email}\nMusic Link: ${link}`);

    window.location.href = `mailto:admin@ferwap.com?subject=${subject}&body=${body}`;
});

// Logout Handler
logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('ferwap_logged_in');
    checkSession();
});

// Dashboard Tab Switching Logic (SPA)
function switchDashTab(targetId) {
    navTabs.forEach(tab => {
        if (tab.getAttribute('data-target') === targetId) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    dashViews.forEach(view => {
        if (view.id === targetId) {
            view.classList.add('active-view');
        } else {
            view.classList.remove('active-view');
        }
    });
}

navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-target');
        switchDashTab(target);
    });
});

switchTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        switchDashTab(target);
    });
});

// Release Submission Handler (Inside Dashboard)
document.getElementById('releaseForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('relTitle').value;
    const artist = document.getElementById('relArtist').value;
    const genre = document.getElementById('relGenre').value;
    const date = document.getElementById('relDate').value;
    const link = document.getElementById('relLink').value;

    const subject = encodeURIComponent(`[New Release Dispatch] ${artist} - ${title}`);
    const body = encodeURIComponent(`Title: ${title}\nArtist: ${artist}\nGenre: ${genre}\nTarget Date: ${date}\nMaster/Artwork Link: ${link}`);

    window.location.href = `mailto:distribution@ferwap.com?subject=${subject}&body=${body}`;
});

// Run session check initially
checkSession();
