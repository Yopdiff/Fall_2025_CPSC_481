document.addEventListener('DOMContentLoaded', () => {
    // 1. Parse URL parameters
    const params = new URLSearchParams(window.location.search);
    const destinationQuery = params.get('destination') || 'Vancouver'; // Default fallback
    const departDate = params.get('depart');
    const returnDate = params.get('return');

    // 2. Set the inputs to the passed dates (or defaults)
    if (departDate) document.getElementById('res-depart-date').value = departDate;
    if (returnDate) document.getElementById('res-return-date').value = returnDate;

    // Update Title
    document.getElementById('results-title').textContent = `To ${destinationQuery}`;

    // 3. Fetch and Filter Data
    fetch('data/flights.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('flight-list');
            container.innerHTML = ''; // Clear loading spinner

            // Filter logic: Check if destination name or code matches
            const filteredFlights = data.flights.filter(flight => {
                const q = destinationQuery.toLowerCase();
                return flight.destination.toLowerCase().includes(q) || 
                       flight.destinationCode.toLowerCase().includes(q);
            });

            if (filteredFlights.length === 0) {
                container.innerHTML = '<p class="no-results">No flights found for this destination.</p>';
                return;
            }

            // 4. Render Cards
            filteredFlights.forEach(flight => {
                const card = document.createElement('div');
                card.className = 'flight-card';
                
                // Calculate duration or use string from JSON
                // Simple HTML structure for the card
                card.innerHTML = `
                    <div class="flight-card-header">
                        <span class="airline-name">${flight.airline}</span>
                        <span class="flight-price">$${flight.price}</span>
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
                            <span class="stops">${flight.stops}</span>
                        </div>
                        <div class="route-point">
                            <span class="time">${flight.arrivalTime}</span>
                            <span class="code">${flight.destinationCode}</span>
                        </div>
                    </div>
                    <div class="flight-footer">
                        <div class="amenities">
                            ${flight.amenities.slice(0, 2).map(a => `<span class="badge">${a}</span>`).join('')}
                        </div>
                        <button class="select-btn">Select</button>
                    </div>
                `;
                
                // INJECTED: Add click listener to the button inside this specific card
                const selectBtn = card.querySelector('.select-btn');
                selectBtn.addEventListener('click', () => {
                    // 1. Save for the Ticket Page (Session only)
                    sessionStorage.setItem('bookedFlight', JSON.stringify(flight));
                    sessionStorage.setItem('flightDate', document.getElementById('res-depart-date').value);

                    // 2. Save to Itinerary (Permanent Local Storage)
                    // Get existing trips or initialize empty array
                    const myTrips = JSON.parse(localStorage.getItem('myTrips') || '[]');
                    
                    // Add the date to the flight object so we remember when it is
                    flight.travelDate = document.getElementById('res-depart-date').value;
                    
                    // Add to array and save back to storage
                    myTrips.push(flight);
                    localStorage.setItem('myTrips', JSON.stringify(myTrips));
                    
                    // Redirect to the ticket page
                    window.location.href = 'ticket.html';
                });
                
                container.appendChild(card);
            });
        })
        .catch(err => {
            console.error('Error loading flights:', err);
            document.getElementById('flight-list').innerHTML = '<p>Error loading data.</p>';
        });
});