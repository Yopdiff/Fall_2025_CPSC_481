document.addEventListener('DOMContentLoaded', () => {
    renderItinerary();
    setupFabHandler();     
    setupDeleteHandlers(); 
    setupEditHandlers();   
});

let isDeleteMode = false;
let isEditMode = false;
let selectedIndices = new Set();
let currentEditTripIndex = null;
let selectedActivityIndices = new Set();

// 1. CONSOLIDATED FAB HANDLER
function setupFabHandler() {
    const fabBtn = document.getElementById('fab-btn');
    if (!fabBtn) return;

    fabBtn.addEventListener('click', (e) => {
        if (isDeleteMode) {
            e.preventDefault();
            toggleDeleteMode(false);
        } else if (isEditMode) {
            e.preventDefault();
            toggleEditMode(false);
        }
    });
}

function renderItinerary() {
    const container = document.getElementById('itinerary-list');
    if (!container) return; // Safety check

    const trips = JSON.parse(localStorage.getItem('myTrips') || '[]');
    container.innerHTML = ''; 

    if (trips.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#999; margin-top:20px;">No trips planned yet.</p>';
        return; 
    }

    trips.forEach((flight, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'trip-wrapper';
        wrapper.onclick = () => handleCardClick(index);

        const checkbox = document.createElement('div');
        checkbox.className = 'delete-checkbox';
        checkbox.id = `check-${index}`;
        checkbox.innerHTML = '<i class="fas fa-check" style="font-size: 12px;"></i>';

        const card = document.createElement('div');
        card.className = 'flight-card';
        card.style.flex = '1';
        
        // Format Date Range
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

        // Determine heart icon class based on favorite status
        const heartClass = flight.isFavorite ? 'fas fa-heart' : 'far fa-heart';
        const heartColor = flight.isFavorite ? '#e74c3c' : '#ccc';

        // Use destination name if available, otherwise code
        const destinationName = flight.destination || flight.destinationCode;

        card.innerHTML = `
            <div class="flight-card-header">
                <div class="airline-name">${destinationName}</div>
                <div class="fav-toggle" onclick="event.stopPropagation(); toggleFavorite(${index})" style="cursor: pointer; font-size: 1.2rem; color: ${heartColor};">
                    <i class="${heartClass}"></i>
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
                    <button class="select-btn" onclick="event.stopPropagation(); viewTrip(${index})" aria-label="View Ticket">
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;
        
        wrapper.appendChild(checkbox);
        wrapper.appendChild(card);
        container.appendChild(wrapper);
    });
}

// EXPOSE TO WINDOW
window.toggleFavorite = function(index) {
    const trips = JSON.parse(localStorage.getItem('myTrips') || '[]');
    if (trips[index]) {
        trips[index].isFavorite = !trips[index].isFavorite;
        localStorage.setItem('myTrips', JSON.stringify(trips));
        renderItinerary(); 
        
        const msg = trips[index].isFavorite ? "Added to Favourites" : "Removed from Favourites";
        showStatus(msg);
    }
};

window.viewTrip = function(index) {
    if (isDeleteMode || isEditMode) return;
    
    const trips = JSON.parse(localStorage.getItem('myTrips') || '[]');
    const flight = trips[index];
    
    if (flight) {
        sessionStorage.setItem('bookedFlight', JSON.stringify(flight));
        sessionStorage.setItem('flightDate', flight.travelDate);
        window.location.href = 'itinerary-details.html';
    }
};

function setupDeleteHandlers() {
    const btnDeleteMode = document.getElementById('btn-delete-mode');
    const fabContainer = document.querySelector('.fab-container');
    const deleteConfirmFab = document.getElementById('delete-confirm-fab');
    
    if (!btnDeleteMode) return;

    btnDeleteMode.addEventListener('click', (e) => {
        e.preventDefault();
        toggleDeleteMode(true);
        toggleEditMode(false);
        fabContainer.classList.remove('open'); 
    });

    deleteConfirmFab.addEventListener('click', () => {
        if (selectedIndices.size > 0) {
            document.getElementById('delete-modal').classList.remove('hidden');
        }
    });

    document.getElementById('modal-cancel').addEventListener('click', () => {
        document.getElementById('delete-modal').classList.add('hidden');
    });

    document.getElementById('modal-confirm').addEventListener('click', () => {
        deleteSelectedTrips();
        document.getElementById('delete-modal').classList.add('hidden');
        toggleDeleteMode(false);
    });
}

function setupEditHandlers() {
    const btnEditMode = document.getElementById('btn-edit-mode');
    const fabContainer = document.querySelector('.fab-container');
    const editModal = document.getElementById('edit-modal');
    const closeBtn = document.getElementById('edit-modal-close');
    const deleteBtn = document.getElementById('edit-modal-delete');

    if (!btnEditMode) return;

    btnEditMode.addEventListener('click', (e) => {
        e.preventDefault();
        toggleEditMode(true);
        toggleDeleteMode(false);
        fabContainer.classList.remove('open');
    });

    closeBtn.addEventListener('click', () => {
        editModal.classList.add('hidden');
    });

    deleteBtn.addEventListener('click', () => {
        deleteSelectedActivities();
    });
}

function toggleEditMode(active) {
    isEditMode = active;
    const body = document.body;
    const fabIcon = document.querySelector('#fab-btn i');
    const fabBtn = document.getElementById('fab-btn');

    if (active) {
        body.classList.add('edit-mode');
        fabIcon.className = 'fas fa-times';
        fabBtn.classList.add('active');
        showStatus("Select a trip to manage activities");
    } else {
        body.classList.remove('edit-mode');
        fabBtn.classList.remove('active');
        if (!isDeleteMode) fabIcon.className = 'fas fa-plus';
    }
}

function toggleDeleteMode(active) {
    isDeleteMode = active;
    const body = document.body;
    const fabIcon = document.querySelector('#fab-btn i');
    const deleteConfirmFab = document.getElementById('delete-confirm-fab');

    if (active) {
        body.classList.add('delete-mode');
        fabIcon.className = 'fas fa-times';
        deleteConfirmFab.classList.remove('hidden');
        selectedIndices.clear();
        updateTrashButton();
        showStatus("Select trips to delete");
    } else {
        body.classList.remove('delete-mode');
        deleteConfirmFab.classList.add('hidden');
        if (!isEditMode) fabIcon.className = 'fas fa-plus';
        document.querySelectorAll('.delete-checkbox').forEach(el => el.classList.remove('checked'));
    }
}

function handleCardClick(index) {
    if (isDeleteMode) {
        const checkbox = document.getElementById(`check-${index}`);
        if (selectedIndices.has(index)) {
            selectedIndices.delete(index);
            checkbox.classList.remove('checked');
        } else {
            selectedIndices.add(index);
            checkbox.classList.add('checked');
        }
        updateTrashButton();
    } else if (isEditMode) {
        openEditModal(index);
    }
}

function updateTrashButton() {
    const btn = document.getElementById('delete-confirm-fab');
    if (selectedIndices.size > 0) {
        btn.classList.add('active');
    } else {
        btn.classList.remove('active');
    }
}

function deleteSelectedTrips() {
    const trips = JSON.parse(localStorage.getItem('myTrips') || '[]');
    const newTrips = trips.filter((_, index) => !selectedIndices.has(index));
    localStorage.setItem('myTrips', JSON.stringify(newTrips));
    renderItinerary();
}

function openEditModal(index) {
    currentEditTripIndex = index;
    selectedActivityIndices.clear();
    
    const trips = JSON.parse(localStorage.getItem('myTrips') || '[]');
    const flight = trips[index];
    if (!flight) return;

    const dest = flight.destinationCode || 'YYC';
    const date = flight.departDate || flight.travelDate || 'TBD';
    const key = `activities_${dest}_${date}`;
    
    const activities = JSON.parse(localStorage.getItem(key) || '[]');
    const listContainer = document.getElementById('edit-activity-list');
    listContainer.innerHTML = '';

    if (activities.length === 0) {
        listContainer.innerHTML = '<p style="text-align:center; color:#999;">No activities added yet.</p>';
    } else {
        activities.forEach((act, i) => {
            const item = document.createElement('div');
            item.className = 'edit-activity-item';
            item.style.cssText = 'display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #eee; gap: 10px; cursor: pointer;';
            
            item.innerHTML = `
                <div class="activity-checkbox" id="act-check-${i}" style="width: 20px; height: 20px; border: 2px solid #ddd; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-check" style="display: none; font-size: 12px; color: white;"></i>
                </div>
                <div style="flex-grow: 1;">
                    <div style="font-weight: bold; font-size: 0.9rem;">${act.name}</div>
                    <div style="font-size: 0.8rem; color: #888;">Day ${act.day} • ${act.type}</div>
                </div>
            `;

            item.onclick = () => toggleActivitySelection(i);
            listContainer.appendChild(item);
        });
    }

    document.getElementById('edit-modal').classList.remove('hidden');
}

function toggleActivitySelection(index) {
    const checkbox = document.getElementById(`act-check-${index}`);
    const icon = checkbox.querySelector('i');
    
    if (selectedActivityIndices.has(index)) {
        selectedActivityIndices.delete(index);
        checkbox.style.backgroundColor = 'transparent';
        checkbox.style.borderColor = '#ddd';
        icon.style.display = 'none';
    } else {
        selectedActivityIndices.add(index);
        checkbox.style.backgroundColor = '#e74c3c';
        checkbox.style.borderColor = '#e74c3c';
        icon.style.display = 'block';
    }
}

function deleteSelectedActivities() {
    if (selectedActivityIndices.size === 0) return;

    const trips = JSON.parse(localStorage.getItem('myTrips') || '[]');
    const flight = trips[currentEditTripIndex];
    const dest = flight.destinationCode || 'YYC';
    const date = flight.departDate || flight.travelDate || 'TBD';
    const key = `activities_${dest}_${date}`;
    
    const activities = JSON.parse(localStorage.getItem(key) || '[]');
    const newActivities = activities.filter((_, i) => !selectedActivityIndices.has(i));
    
    localStorage.setItem(key, JSON.stringify(newActivities));
    openEditModal(currentEditTripIndex);
}

function showStatus(msg) {
    const container = document.getElementById('mobile-container') || document.body;
    const toast = document.createElement('div');
    toast.className = 'save-status';
    toast.textContent = msg;
    container.appendChild(toast); 
    setTimeout(() => toast.remove(), 2000);
}