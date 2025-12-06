document.addEventListener('DOMContentLoaded', () => {
    const darkToggle = document.getElementById('toggle-dark-mode');
    const notifToggle = document.getElementById('toggle-notifications');

    // Load saved state
    const darkStored = localStorage.getItem('rt_dark_mode') === 'true';
    const notifStored = localStorage.getItem('rt_notifications') === 'true';

    if (darkToggle) {
        darkToggle.checked = darkStored;
    }
    if (notifToggle) {
        notifToggle.checked = notifStored;
    }

    applyDarkMode(darkStored);

    if (darkToggle) {
        darkToggle.addEventListener('change', () => {
            const enabled = darkToggle.checked;
            localStorage.setItem('rt_dark_mode', String(enabled));
            applyDarkMode(enabled);
            showSettingsStatus(enabled ? 'Dark mode on' : 'Dark mode off');
        });
    }

    if (notifToggle) {
        notifToggle.addEventListener('change', () => {
            const enabled = notifToggle.checked;
            localStorage.setItem('rt_notifications', String(enabled));
            showSettingsStatus(
                enabled ? 'Trip alerts enabled' : 'Trip alerts disabled'
            );
        });
    }
});

function applyDarkMode(enabled) {
    if (enabled) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

function showSettingsStatus(msg) {
    const status = document.createElement('div');
    status.className = 'save-status';
    status.textContent = msg;
    document.body.appendChild(status);
    setTimeout(() => status.remove(), 1200);
}
