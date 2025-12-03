document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('itinerary-list');
    const trips = JSON.parse(localStorage.getItem('myTrips') || '[]');

    if (trips.length === 0) {
        // Optional: Show a message if no trips
        return; 
    }

    trips.forEach((flight, index) => {
        const card = document.createElement('div');
        card.className = 'flight-card';
        
        // Format the date for display
        const dateDisplay = flight.travelDate ? new Date(flight.travelDate).toLocaleDateString() : 'Date TBD';

        card.innerHTML = `
            <div class="flight-card-header">
                <div class="airline-name">${flight.airline}</div>
                <div class="flight-price" style="font-size: 0.9rem; color: #666;">${dateDisplay}</div>
            </div>
            <div class="flight-route">
                <div class="route-point">
                    <span class="time">${flight.departTime}</span>
                    <span class="code">${flight.originCode}</span>
                </div>
                <div class="route-line">
                    <span class="duration">${flight.duration}</span>
                    <div class="line-graphic">
                        <i class="fas fa-plane"></i>
                    </div>
                    <span class="stops">${flight.stops} stop</span>
                </div>
                <div class="route-point">
                    <span class="time">${flight.arrivalTime}</span>
                    <span class="code">${flight.destinationCode}</span>
                </div>
            </div>
            <div class="flight-footer">
                <div class="amenities">
                    ${flight.amenities ? flight.amenities.map(am => `<span class="badge">${am}</span>`).join('') : ''}
                </div>
                <!-- UPDATED: Changed Remove button to Right Arrow for viewing -->
                <button class="select-btn" onclick="viewTrip(${index})" aria-label="View Ticket">
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        `;
        
        container.appendChild(card);
    });
});

// New function to handle viewing the ticket
function viewTrip(index) {
    const trips = JSON.parse(localStorage.getItem('myTrips') || '[]');
    const flight = trips[index];
    
    if (flight) {
        // Load this flight into session storage so ticket.html can read it
        sessionStorage.setItem('bookedFlight', JSON.stringify(flight));
        sessionStorage.setItem('flightDate', flight.travelDate);
        // Redirect to the ticket page
        window.location.href = 'ticket.html';
    }
}