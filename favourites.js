function favLoadTrips() {
    try {
        return JSON.parse(localStorage.getItem('myTrips') || '[]');
    } catch {
        return [];
    }
}

// function favLoadOfflineTrips() {
//     try {
//         return JSON.parse(localStorage.getItem('offlineTrips') || '[]');
//     } catch {
//         return [];
//     }
// }

document.addEventListener('DOMContentLoaded', () => {
    // setupFavTabs();
    renderSavedTrips();
    // renderOfflineTrips();
});

// function setupFavTabs() {
//     const tabSaved = document.getElementById('tab-saved');
//     const tabOffline = document.getElementById('tab-offline');
//     const savedView = document.getElementById('saved-view');
//     const offlineView = document.getElementById('offline-view');

//     if (!tabSaved || !tabOffline) return;

//     tabSaved.addEventListener('click', () => {
//         tabSaved.classList.add('active');
//         tabOffline.classList.remove('active');
//         savedView.classList.remove('hidden');
//         offlineView.classList.add('hidden');
//     });

//     tabOffline.addEventListener('click', () => {
//         tabOffline.classList.add('active');
//         tabSaved.classList.remove('active');
//         offlineView.classList.remove('hidden');
//         savedView.classList.add('hidden');
//     });
// }

function renderSavedTrips() {
    const container = document.getElementById('saved-trips-list');
    if (!container) return;

    const allTrips = favLoadTrips();
    // Map to preserve original index for toggling
    const trips = allTrips
        .map((t, i) => ({ ...t, originalIndex: i }))
        .filter(t => t.isFavorite);
    
    container.innerHTML = '';

    if (trips.length === 0) {
        container.innerHTML =
            '<p class="empty-message">No favourite trips yet. Tap the heart icon on your itinerary to add one.</p>';
        return;
    }

    trips.forEach((flight) => {
        const card = document.createElement('div');
        card.className = 'flight-card'; // Use the standard card class
        
        // Format Date Range (Same logic as itinerary.js)
        let dateDisplay = 'Date TBD';
        if (flight.departDate && flight.returnDate) {
             const formatDate = (dateStr) => {
                const [y, m, d] = dateStr.split('-');
                const date = new Date(y, m - 1, d);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
             };
             dateDisplay = `${formatDate(flight.departDate)} - ${formatDate(flight.returnDate)}`;
        } else if (flight.travelDate) {
             const [y, m, d] = flight.travelDate.split('-');
             const date = new Date(y, m - 1, d);
             dateDisplay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }

        const destinationName = flight.destination || flight.destinationCode;
        const heartColor = '#e74c3c'; // Always red in favorites list

        card.innerHTML = `
            <div class="flight-card-header">
                <div class="airline-name">${destinationName}</div>
                <div class="fav-toggle" onclick="event.stopPropagation(); toggleFavorite(${flight.originalIndex})" style="cursor: pointer; font-size: 1.2rem; color: ${heartColor};">
                    <i class="fas fa-heart"></i>
                </div>
            </div>
            <div class="flight-route">
                <div class="route-point">
                    <span class="time">${flight.departTime}</span>
                    <span class="code">${flight.originCode}</span>
                </div>
                <div class="route-line">
                    <span class="duration">${flight.duration}</span>
                    <div class="line-graphic"><i class="fas fa-plane"></i></div>
                    <span class="stops">${flight.stops} stop</span>
                </div>
                <div class="route-point">
                    <span class="time">${flight.arrivalTime}</span>
                    <span class="code">${flight.destinationCode}</span>
                </div>
            </div>
            <div class="flight-footer">
                <div style="display: flex; align-items: center; gap: 10px; width: 100%; justify-content: space-between;">
                    <span class="flight-price" style="font-size: 0.9rem; color: #666;">${dateDisplay}</span>
                    <button class="select-btn" onclick="event.stopPropagation(); viewTrip(${flight.originalIndex})" aria-label="View Ticket">
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;

        // Make the whole card clickable to view trip
        card.onclick = () => viewTrip(flight.originalIndex);

        container.appendChild(card);
    });
}

// Expose functions to window for onclick handlers
window.toggleFavorite = function(originalIndex) {
    const trips = JSON.parse(localStorage.getItem('myTrips') || '[]');
    if (trips[originalIndex]) {
        trips[originalIndex].isFavorite = !trips[originalIndex].isFavorite;
        localStorage.setItem('myTrips', JSON.stringify(trips));
        renderSavedTrips(); // Re-render to remove the item
    }
};

window.viewTrip = function(originalIndex) {
    const trips = JSON.parse(localStorage.getItem('myTrips') || '[]');
    const flight = trips[originalIndex];
    
    if (flight) {
        sessionStorage.setItem('bookedFlight', JSON.stringify(flight));
    sessionStorage.setItem('flightDate', flight.travelDate);
    window.location.href = 'itinerary-details.html';
    }
};

// function renderOfflineTrips() {
//     const container = document.getElementById('offline-list');
//     if (!container) return;

//     const offline = favLoadOfflineTrips();
//     if (!offline.length) {
//         // The text above already warns user. We just clear list.
//         container.innerHTML = '';
//         return;
//     }

//     container.innerHTML = '';
//     offline.forEach((trip) => {
//         const card = document.createElement('div');
//         card.className = 'flight-card fav-card offline-card';

//         const dateDisplay = trip.travelDate
//             ? new Date(trip.travelDate).toLocaleDateString()
//             : 'Date TBD';

//         const origin = trip.originCity || trip.originCode || 'Origin';
//         const dest = trip.destinationCity || trip.destination || trip.destinationCode || 'Destination';

//         card.innerHTML = `
//             <div class="fav-card-main">
//                 <div class="fav-route">
//                     <div class="fav-route-city">
//                         <span class="code">${origin}</span>
//                     </div>
//                     <div class="fav-route-line">
//                         <i class="fas fa-download"></i>
//                     </div>
//                     <div class="fav-route-city">
//                         <span class="code">${dest}</span>
//                     </div>
//                 </div>
//                 <div class="fav-meta">
//                     <span class="fav-airline">Offline copy</span>
//                     <span class="fav-date">${dateDisplay}</span>
//                 </div>
//             </div>
//         `;

//         container.appendChild(card);
//     });
// }