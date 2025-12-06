document.addEventListener('DOMContentLoaded', () => {
    const toggles = {
        flights: document.getElementById('notify-flights'),
        hotels: document.getElementById('notify-hotels'),
        suggestions: document.getElementById('notify-suggestions'),
        local: document.getElementById('notify-local')
    };

    // Load saved values from localStorage
    Object.entries(toggles).forEach(([key, input]) => {
        if (!input) return;
        const stored = localStorage.getItem('notify_' + key);
        if (stored === 'true') {
            input.checked = true;
        } else if (stored === 'false') {
            input.checked = false;
        }
        input.addEventListener('change', () => {
            localStorage.setItem('notify_' + key, String(input.checked));
            showNotifyToast(key, input.checked);
        });
    });
});

function showNotifyToast(type, on) {
    const msgMap = {
        flights: 'Flight alerts',
        hotels: 'Hotel alerts',
        suggestions: 'Suggestions',
        local: 'Local alerts'
    };
    const base = msgMap[type] || 'Notifications';

    const toast = document.createElement('div');
    toast.className = 'notify-toast';
    toast.textContent = base + (on ? ' turned on' : ' turned off');
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
    }, 900);

    setTimeout(() => {
        toast.remove();
    }, 1400);
}
