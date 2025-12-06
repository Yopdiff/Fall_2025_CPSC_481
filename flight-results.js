document.addEventListener('DOMContentLoaded', () => {
    // 1. Parse URL parameters
    const params = new URLSearchParams(window.location.search);
    const destinationQuery = params.get('destination') || 'Vancouver';
    const departDateParam = params.get('depart');
    const returnDateParam = params.get('return');

    // 2. Date Input Setup
    const departInput = document.getElementById('res-depart-date');
    const returnInput = document.getElementById('res-return-date');

    // Set 'min' to today to prevent past dates
    const today = new Date().toISOString().split('T')[0];
    departInput.min = today;
    returnInput.min = today;

    // Set values from URL or default
    if (departDateParam) departInput.value = departDateParam;
    if (returnDateParam) returnInput.value = returnDateParam;

    // Ensure return date is not before depart date
    departInput.addEventListener('change', () => {
        returnInput.min = departInput.value;
        if (returnInput.value < departInput.value) {
            returnInput.value = departInput.value;
        }
    });

    // Update Title
    document.getElementById('results-title').textContent = `To ${destinationQuery}`;

    // 3. Fetch and Filter Data
    fetch('data/flights.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('flight-list');
            container.innerHTML = '';

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

                // Add Click Listener
                const selectBtn = card.querySelector('.select-btn');
                selectBtn.addEventListener('click', () => {
                    // Capture the CURRENT values from the date inputs
                    const selectedDepart = document.getElementById('res-depart-date').value;
                    const selectedReturn = document.getElementById('res-return-date').value;

                    if (!selectedDepart || !selectedReturn) {
                        alert("Please select both departure and return dates.");
                        return;
                    }

                    // Update the flight object with the user's selected dates
                    // We create a copy so we don't modify the original data for other cards
                    const flightToSave = { 
                        ...flight, 
                        departDate: selectedDepart,
                        returnDate: selectedReturn,
                        travelDate: selectedDepart // Used for sorting/display in itinerary
                    };

                    // 1. Save for Ticket Page (Session)
                    sessionStorage.setItem('bookedFlight', JSON.stringify(flightToSave));
                    sessionStorage.setItem('flightDate', selectedDepart);

                    // 2. Save to Itinerary (Local Storage)
                    const myTrips = JSON.parse(localStorage.getItem('myTrips') || '[]');
                    myTrips.push(flightToSave);
                    localStorage.setItem('myTrips', JSON.stringify(myTrips));
                    
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