function favLoadTrips() {
    try {
        return JSON.parse(localStorage.getItem('myTrips') || '[]');
    } catch {
        return [];
    }
}

function favLoadOfflineTrips() {
    try {
        return JSON.parse(localStorage.getItem('offlineTrips') || '[]');
    } catch {
        return [];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupFavTabs();
    renderSavedTrips();
    renderOfflineTrips();
});

function setupFavTabs() {
    const tabSaved = document.getElementById('tab-saved');
    const tabOffline = document.getElementById('tab-offline');
    const savedView = document.getElementById('saved-view');
    const offlineView = document.getElementById('offline-view');

    if (!tabSaved || !tabOffline) return;

    tabSaved.addEventListener('click', () => {
        tabSaved.classList.add('active');
        tabOffline.classList.remove('active');
        savedView.classList.remove('hidden');
        offlineView.classList.add('hidden');
    });

    tabOffline.addEventListener('click', () => {
        tabOffline.classList.add('active');
        tabSaved.classList.remove('active');
        offlineView.classList.remove('hidden');
        savedView.classList.add('hidden');
    });
}

function renderSavedTrips() {
    const container = document.getElementById('saved-trips-list');
    if (!container) return;

    const trips = favLoadTrips();
    container.innerHTML = '';

    if (trips.length === 0) {
        container.innerHTML =
            '<p class="empty-message">No saved trips yet. Use “Start a new tour” to add one.</p>';
        return;
    }

    trips.forEach((trip, index) => {
        const card = document.createElement('div');
        card.className = 'flight-card fav-card';

        const dateDisplay = trip.travelDate
            ? new Date(trip.travelDate).toLocaleDateString()
            : 'Date TBD';

        const origin = trip.originCity || trip.originCode || 'Origin';
        const dest = trip.destinationCity || trip.destination || trip.destinationCode || 'Destination';
        const airline = trip.airline || 'Trip';

        card.innerHTML = `
            <div class="fav-card-main">
                <div class="fav-route">
                    <div class="fav-route-city">
                        <span class="code">${origin}</span>
                    </div>
                    <div class="fav-route-line">
                        <i class="fas fa-plane"></i>
                    </div>
                    <div class="fav-route-city">
                        <span class="code">${dest}</span>
                    </div>
                </div>
                <div class="fav-meta">
                    <span class="fav-airline">${airline}</span>
                    <span class="fav-date">${dateDisplay}</span>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            // Minimal behaviour: jump to itinerary page
            // You can enhance this later to deep-link a specific trip
            window.location.href = 'itinerary.html';
        });

        container.appendChild(card);
    });
}

function renderOfflineTrips() {
    const container = document.getElementById('offline-list');
    if (!container) return;

    const offline = favLoadOfflineTrips();
    if (!offline.length) {
        // The text above already warns user. We just clear list.
        container.innerHTML = '';
        return;
    }

    container.innerHTML = '';
    offline.forEach((trip) => {
        const card = document.createElement('div');
        card.className = 'flight-card fav-card offline-card';

        const dateDisplay = trip.travelDate
            ? new Date(trip.travelDate).toLocaleDateString()
            : 'Date TBD';

        const origin = trip.originCity || trip.originCode || 'Origin';
        const dest = trip.destinationCity || trip.destination || trip.destinationCode || 'Destination';

        card.innerHTML = `
            <div class="fav-card-main">
                <div class="fav-route">
                    <div class="fav-route-city">
                        <span class="code">${origin}</span>
                    </div>
                    <div class="fav-route-line">
                        <i class="fas fa-download"></i>
                    </div>
                    <div class="fav-route-city">
                        <span class="code">${dest}</span>
                    </div>
                </div>
                <div class="fav-meta">
                    <span class="fav-airline">Offline copy</span>
                    <span class="fav-date">${dateDisplay}</span>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}
