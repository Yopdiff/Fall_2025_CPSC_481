document.addEventListener('DOMContentLoaded', () => {
    renderItinerary();
    setupDeleteHandlers();
});

let isDeleteMode = false;
let selectedIndices = new Set();

function renderItinerary() {
    const container = document.getElementById('itinerary-list');
    const trips = JSON.parse(localStorage.getItem('myTrips') || '[]');
    container.innerHTML = ''; // Clear current list

    if (trips.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#999; margin-top:20px;">No trips planned yet.</p>';
        return; 
    }

    trips.forEach((flight, index) => {
        // Create Wrapper for Checkbox + Card
        const wrapper = document.createElement('div');
        wrapper.className = 'trip-wrapper';
        wrapper.onclick = () => handleCardClick(index); // Handle click on wrapper

        // Checkbox HTML
        const checkbox = document.createElement('div');
        checkbox.className = 'delete-checkbox';
        checkbox.id = `check-${index}`;
        checkbox.innerHTML = '<i class="fas fa-check" style="font-size: 12px;"></i>';

        // Flight Card
        const card = document.createElement('div');
        card.className = 'flight-card';
        card.style.flex = '1'; // Take remaining space
        
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
                <button class="select-btn" onclick="event.stopPropagation(); viewTrip(${index})" aria-label="View Ticket">
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        `;
        
        wrapper.appendChild(checkbox);
        wrapper.appendChild(card);
        container.appendChild(wrapper);
    });
}

function setupDeleteHandlers() {
    const btnDeleteMode = document.getElementById('btn-delete-mode');
    const fabBtn = document.getElementById('fab-btn');
    const fabIcon = fabBtn.querySelector('i');
    const fabContainer = document.querySelector('.fab-container');
    const deleteConfirmFab = document.getElementById('delete-confirm-fab');
    
    // 1. Enter Delete Mode
    btnDeleteMode.addEventListener('click', (e) => {
        e.preventDefault();
        toggleDeleteMode(true);
        fabContainer.classList.remove('open'); // Close menu
    });

    // 2. Main FAB acts as Cancel/Close
    fabBtn.addEventListener('click', (e) => {
        if (isDeleteMode) {
            e.preventDefault();
            e.stopPropagation(); // Prevent script.js from toggling menu
            toggleDeleteMode(false);
        }
    });

    // 3. Trash FAB Click -> Show Modal
    deleteConfirmFab.addEventListener('click', () => {
        if (selectedIndices.size > 0) {
            document.getElementById('delete-modal').classList.remove('hidden');
        }
    });

    // 4. Modal Actions
    document.getElementById('modal-cancel').addEventListener('click', () => {
        document.getElementById('delete-modal').classList.add('hidden');
    });

    document.getElementById('modal-confirm').addEventListener('click', () => {
        deleteSelectedTrips();
        document.getElementById('delete-modal').classList.add('hidden');
        toggleDeleteMode(false);
    });
}

function toggleDeleteMode(active) {
    isDeleteMode = active;
    const body = document.body;
    const fabIcon = document.querySelector('#fab-btn i');
    const deleteConfirmFab = document.getElementById('delete-confirm-fab');

    if (active) {
        body.classList.add('delete-mode');
        fabIcon.className = 'fas fa-times'; // Change to X
        deleteConfirmFab.classList.remove('hidden');
        selectedIndices.clear(); // Reset selections
        updateTrashButton();
    } else {
        body.classList.remove('delete-mode');
        fabIcon.className = 'fas fa-plus'; // Back to Plus
        deleteConfirmFab.classList.add('hidden');
        
        // Uncheck all visuals
        document.querySelectorAll('.delete-checkbox').forEach(el => el.classList.remove('checked'));
    }
}

function handleCardClick(index) {
    if (!isDeleteMode) return;

    const checkbox = document.getElementById(`check-${index}`);
    
    if (selectedIndices.has(index)) {
        selectedIndices.delete(index);
        checkbox.classList.remove('checked');
    } else {
        selectedIndices.add(index);
        checkbox.classList.add('checked');
    }

    updateTrashButton();
}

function updateTrashButton() {
    const btn = document.getElementById('delete-confirm-fab');
    if (selectedIndices.size > 0) {
        btn.classList.add('active'); // Turns Red
    } else {
        btn.classList.remove('active'); // Stays Grey
    }
}

function deleteSelectedTrips() {
    const trips = JSON.parse(localStorage.getItem('myTrips') || '[]');
    
    // Filter out trips whose index is in the selected set
    const newTrips = trips.filter((_, index) => !selectedIndices.has(index));
    
    localStorage.setItem('myTrips', JSON.stringify(newTrips));
    renderItinerary(); // Re-render list
}

function viewTrip(index) {
    if (isDeleteMode) return; // Don't view if deleting
    
    const trips = JSON.parse(localStorage.getItem('myTrips') || '[]');
    const flight = trips[index];
    
    if (flight) {
        sessionStorage.setItem('bookedFlight', JSON.stringify(flight));
        sessionStorage.setItem('flightDate', flight.travelDate);
        window.location.href = 'itinerary-details.html';
    }
}
// ADD NEW TRIP HANDLER (vertical prototype functionality)
document.getElementById('fab-btn').addEventListener('click', () => {
    const trips = loadTrips();

    // Default trip object (minimal, safe)
    const newTrip = {
        airline: "Custom Trip",
        originCode: "YYC",
        destinationCode: "JFK",
        travelDate: new Date().toISOString(),
        departTime: "10:00",
        arrivalTime: "16:00",
        duration: "6h",
        stops: 0,
        amenities: ["WiFi"],
        activities: []    // ← Important heuristic fix
    };

    trips.push(newTrip);
    saveTrips(trips);

    showStatus("Trip added");   // ← Visibility of system status
    console.log("Trip saved to localStorage:", newTrip);
});