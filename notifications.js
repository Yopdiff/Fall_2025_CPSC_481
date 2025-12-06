document.addEventListener('DOMContentLoaded', () => {
    loadNotifications();
});

async function loadNotifications() {
    const container = document.querySelector('.notifications-content');
    
    // 1. Get current trip destination from sessionStorage
    // We assume 'bookedFlight' is set when viewing details
    const flightData = sessionStorage.getItem('bookedFlight');
    let destinationCode = 'YVR'; // Default fallback

    if (flightData) {
        const flight = JSON.parse(flightData);
        destinationCode = flight.destinationCode || 'YVR';
    }

    // Update header to show context
    const headerTitle = document.querySelector('header h1');
    if (headerTitle) {
        headerTitle.textContent = `Notifications for ${destinationCode}`;
    }

    try {
        // 2. Fetch the JSON data
        const response = await fetch('data/noti.json');
        const data = await response.json();

        // 3. Get alerts for specific destination
        const alerts = data[destinationCode] || [];

        container.innerHTML = ''; // Clear existing static content

        if (alerts.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; padding: 40px; color: #7f8c8d;">
                    <i class="fas fa-check-circle" style="font-size: 3rem; color: #2ecc71; margin-bottom: 15px;"></i>
                    <p>No new alerts for ${destinationCode}</p>
                </div>`;
            return;
        }

        // 4. Render Cards
        alerts.forEach(alert => {
            const card = createNotificationCard(alert);
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading notifications:', error);
        container.innerHTML = '<p style="text-align:center; margin-top:20px;">Failed to load notifications.</p>';
    }
}

function createNotificationCard(alert) {
    const div = document.createElement('div');
    
    // Map risk to border color or background accent
    let riskClass = '';
    if (alert.risk === 'red') riskClass = 'risk-red';
    else if (alert.risk === 'yellow') riskClass = 'risk-yellow';
    else riskClass = 'risk-green';

    // Map type to icon
    let iconClass = 'fa-info-circle';
    let typeClass = 'suggestion-type'; // default color scheme

    if (alert.type === 'flight') {
        iconClass = 'fa-plane';
        typeClass = 'flight-type';
    } else if (alert.type === 'hotel') {
        iconClass = 'fa-bed';
        typeClass = 'hotel-type';
    } else if (alert.type === 'alert') {
        iconClass = 'fa-exclamation-triangle';
        typeClass = 'alert-type';
    } else if (alert.type === 'suggestion') {
        iconClass = 'fa-lightbulb';
        typeClass = 'suggestion-type';
    }

    div.className = `notification-card ${typeClass} ${riskClass}`;

    div.innerHTML = `
        <div class="notif-icon">
            <i class="fas ${iconClass}"></i>
        </div>
        <div class="notif-details">
            <h3>${alert.title}</h3>
            <p>${alert.message}</p>
            <span class="time">${alert.time}</span>
        </div>
    `;

    return div;
}