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
    setupToggleSwitch();
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

function setupToggleSwitch() {
    const btnUpcoming = document.getElementById('btn-upcoming');
    const btnPast = document.getElementById('btn-past');
    const toggleBg = document.getElementById('toggle-bg');
    const upcomingView = document.getElementById('upcoming-view');
    const pastView = document.getElementById('past-view');

    if (!btnUpcoming || !btnPast) return;

    btnUpcoming.addEventListener('click', () => {
        // Move background left
        toggleBg.style.transform = 'translateX(0)';
        
        // Update text styles
        btnUpcoming.style.fontWeight = 'bold';
        btnUpcoming.style.color = '#2C3E50';
        btnPast.style.fontWeight = 'normal';
        btnPast.style.color = '#666';

        // Show/Hide views
        upcomingView.style.display = 'block';
        pastView.style.display = 'none';
    });

    btnPast.addEventListener('click', () => {
        // Move background right (width is 200px total, padding 4px, button width ~96px)
        // We translate by 96px (width of one button)
        toggleBg.style.transform = 'translateX(96px)';
        
        // Update text styles
        btnPast.style.fontWeight = 'bold';
        btnPast.style.color = '#2C3E50';
        btnUpcoming.style.fontWeight = 'normal';
        btnUpcoming.style.color = '#666';

        // Show/Hide views
        pastView.style.display = 'block';
        upcomingView.style.display = 'none';
    });
}

function renderSavedTrips() {
    const upcomingContainer = document.getElementById('upcoming-trips-list');
    const pastContainer = document.getElementById('past-trips-list');
    
    if (!upcomingContainer || !pastContainer) return;

    const allTrips = favLoadTrips();
    
    // MOCK PAST TRIP
    const mockPastTrip = {
        airline: "Air Canada",
        originCode: "YYC",
        destinationCode: "LHR",
        destination: "London",
        departTime: "18:45",
        arrivalTime: "10:30",
        duration: "8h 45m",
        stops: "Nonstop",
        price: 850,
        travelDate: "2023-05-15", // Past date
        departDate: "2023-05-15",
        returnDate: "2023-05-25",
        isFavorite: true,
        amenities: ["Meal", "WiFi"]
    };

    // Combine real trips with mock past trip for display
    // We filter for favorites first
    let trips = allTrips
        .map((t, i) => ({ ...t, originalIndex: i }))
        .filter(t => t.isFavorite);
    
    // Add mock trip to the list (give it a fake index -1 to distinguish)
    trips.push({ ...mockPastTrip, originalIndex: -1 });

    upcomingContainer.innerHTML = '';
    pastContainer.innerHTML = '';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let hasUpcoming = false;
    let hasPast = false;

    trips.forEach((flight) => {
        // Determine if trip is past or upcoming
        let tripDate = new Date();
        if (flight.travelDate) {
            const [y, m, d] = flight.travelDate.split('-');
            tripDate = new Date(y, m - 1, d);
        }
        
        const isPast = tripDate < today;
        const targetContainer = isPast ? pastContainer : upcomingContainer;
        
        if (isPast) hasPast = true;
        else hasUpcoming = true;

        const card = document.createElement('div');
        card.className = 'flight-card'; 
        // Ensure full width and spacing
        card.style.width = '100%';
        card.style.marginBottom = '15px';
        
        if (isPast) {
            card.style.opacity = '0.8'; // Slightly fade past trips
            card.style.backgroundColor = '#f9f9f9';
        }
        
        // Format Date Range
        let dateDisplay = 'Date TBD';
        if (flight.departDate && flight.returnDate) {
             const formatDate = (dateStr) => {
                const [y, m, d] = dateStr.split('-');
                const date = new Date(y, m - 1, d);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
             };
             dateDisplay = `${formatDate(flight.departDate)} - ${formatDate(flight.returnDate)}`;
             
             // Add year for past trips to be clear
             if (isPast) {
                 dateDisplay += `, ${flight.departDate.split('-')[0]}`;
             }
        } else if (flight.travelDate) {
             const [y, m, d] = flight.travelDate.split('-');
             const date = new Date(y, m - 1, d);
             dateDisplay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }

        const destinationName = flight.destination || flight.destinationCode;
        const heartColor = '#e74c3c'; 
        const heartClass = 'fas fa-heart'; // Always filled in favorites

        // Only show heart toggle for real trips (not the mock one for now, or handle it differently)
        const heartHtml = flight.originalIndex !== -1 
            ? `<div class="fav-toggle" onclick="event.stopPropagation(); toggleFavorite(${flight.originalIndex})" style="cursor: pointer; font-size: 1.2rem; color: ${heartColor};"><i class="${heartClass}"></i></div>`
            : `<div class="fav-toggle" style="cursor: default; font-size: 1.2rem; color: ${heartColor};"><i class="${heartClass}"></i></div>`;

        card.innerHTML = `
            <div class="flight-card-header">
                <div class="airline-name">${destinationName}</div>
                ${heartHtml}
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
        if (flight.originalIndex !== -1) {
            card.onclick = () => viewTrip(flight.originalIndex);
        }

        targetContainer.appendChild(card);
    });

    if (!hasUpcoming) {
        upcomingContainer.innerHTML = '<p class="empty-message" style="font-size: 0.9rem; color: #999; font-style: italic;">No upcoming trips.</p>';
    }
    
    if (!hasPast) {
        pastContainer.innerHTML = '<p class="empty-message" style="font-size: 0.9rem; color: #999; font-style: italic;">No past trips.</p>';
    }
}

// Expose functions to window for onclick handlers
window.toggleFavorite = function(originalIndex) {
    if (originalIndex === -1) return; // Ignore mock trip
    
    const trips = JSON.parse(localStorage.getItem('myTrips') || '[]');
    if (trips[originalIndex]) {
        trips[originalIndex].isFavorite = !trips[originalIndex].isFavorite;
        localStorage.setItem('myTrips', JSON.stringify(trips));
        renderSavedTrips(); // Re-render to remove the item
    }
};

window.viewTrip = function(originalIndex) {
    if (originalIndex === -1) return; // Ignore mock trip
    
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