document.addEventListener('DOMContentLoaded', () => {
    startCountdown();
    setupModalHandlers();
    initializeSchedule(); 
});

let currentType = 'accommodation';

function initializeSchedule() {
    // 1. Try to get data, or use a default fallback for testing
    let flight = {
        departDate: new Date().toISOString().split('T')[0], // Today
        returnDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], // 2 days later
        destinationCode: 'YYC' // Default
    };

    const flightData = sessionStorage.getItem('bookedFlight');
    if (flightData) {
        try {
            const parsed = JSON.parse(flightData);
            // Only use if valid dates exist
            if (parsed.departDate && parsed.returnDate) {
                flight = parsed;
            }
        } catch (e) {
            console.error("Error parsing flight data, using default.", e);
        }
    }
    
    // Helper to parse "YYYY-MM-DD" correctly as local time
    const parseDate = (dateStr) => {
        if (!dateStr) return new Date();
        const [y, m, d] = dateStr.split('-');
        return new Date(y, m - 1, d);
    };

    const start = parseDate(flight.departDate);
    const end = parseDate(flight.returnDate);
    
    // Calculate difference in days
    const diffTime = Math.abs(end - start);
    // Ensure at least 1 day
    const dayCount = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

    const container = document.getElementById('itinerary-schedule');
    const modalSelect = document.getElementById('modal-day-select');
    
    if (!container || !modalSelect) return;

    container.innerHTML = '';
    modalSelect.innerHTML = '';

    for (let i = 1; i <= dayCount; i++) {
        // Calculate the date for this specific day
        const currentDayDate = new Date(start);
        currentDayDate.setDate(start.getDate() + (i - 1));
        
        // Format: "Dec 16"
        const dateString = currentDayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        // 1. Create Day Section
        const daySection = document.createElement('div');
        daySection.id = `day-section-${i}`;
        daySection.innerHTML = `<h2 class="day-header">Day ${i} <span style="font-size: 0.9rem; color: #7f8c8d; font-weight: normal;">- ${dateString}</span></h2>`;
        
        // INJECT MAP CARD INTO DAY 1
        if (i === 1) {
            const mapCardHTML = `
            <div class="start-location-card">
                <div class="location-card-header">
                    <div class="location-left">
                        <i class="fas fa-plane-departure location-icon"></i>
                        <div class="location-text">
                            <h3>Move to ${flight.destinationCode || 'YYC'}</h3>
                            <span>Departure Point</span>
                        </div>
                    </div>
                    <div class="countdown-container">
                        <span class="countdown-label">Departs in</span>
                        <div class="countdown-time" id="countdown-timer">--d --h --m</div>
                    </div>
                </div>
                <div id="mini-map" class="mini-map-container"></div>
                
                <!-- ADDED: View Ticket Button -->
                <button class="view-ticket-btn" onclick="window.location.href='ticket.html?mode=view'">
                    <i class="fas fa-ticket-alt"></i> View Ticket
                </button>
            </div>`;
            daySection.innerHTML += mapCardHTML;
        }

        container.appendChild(daySection);

        // 2. Add Option to Modal Dropdown
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Day ${i} (${dateString})`;
        modalSelect.appendChild(option);
    }
    
    // LOAD SAVED ACTIVITIES
    loadSavedActivities(flight);

    // Initialize map after DOM injection
    initMap();
    // Restart countdown since we just re-injected the timer HTML
    startCountdown();
}

function addActivityToSchedule(day, type, name) {
    // 1. Render to DOM
    renderActivityItem(day, type, name);

    // 2. Save to LocalStorage
    saveActivity(day, type, name);
}

function renderActivityItem(day, type, name) {
    let daySection = document.getElementById(`day-section-${day}`);
    
    // Fallback if day section doesn't exist (shouldn't happen with init logic)
    if (!daySection) {
        const container = document.getElementById('itinerary-schedule');
        daySection = document.createElement('div');
        daySection.id = `day-section-${day}`;
        daySection.innerHTML = `<h2 class="day-header">Day ${day}</h2>`;
        container.appendChild(daySection);
    }

    const item = document.createElement('div');
    item.className = 'itinerary-item';
    
    let iconClass = 'fa-bed';
    let label = 'Accommodation';
    
    if (type === 'restaurant') { iconClass = 'fa-utensils'; label = 'Restaurant'; }
    if (type === 'event') { iconClass = 'fa-calendar-alt'; label = 'Event'; }

    item.innerHTML = `
        <div class="item-icon">
            <i class="fas ${iconClass}"></i>
        </div>
        <div class="item-details">
            <h4>${label}</h4>
            <p>${name}</p>
        </div>
    `;

    daySection.appendChild(item);
}

// --- STORAGE HELPERS ---

function getStorageKey(flight) {
    // Create a unique key based on destination and date
    // e.g. "activities_YYC_2025-12-12"
    const dest = flight.destinationCode || 'YYC';
    const date = flight.departDate || 'TBD';
    return `activities_${dest}_${date}`;
}

function saveActivity(day, type, name) {
    const flightData = sessionStorage.getItem('bookedFlight');
    // If no flight data, we can't save reliably to a specific trip
    if (!flightData) return;
    
    const flight = JSON.parse(flightData);
    const key = getStorageKey(flight);
    
    const activities = JSON.parse(localStorage.getItem(key) || '[]');
    
    activities.push({ day, type, name });
    
    localStorage.setItem(key, JSON.stringify(activities));
}

function loadSavedActivities(flight) {
    const key = getStorageKey(flight);
    const activities = JSON.parse(localStorage.getItem(key) || '[]');
    
    activities.forEach(act => {
        renderActivityItem(act.day, act.type, act.name);
    });
}

function initMap() {
    const mapContainer = document.getElementById('mini-map');
    if (!mapContainer) return;

    // Check if map is already initialized to avoid Leaflet error
    if (mapContainer._leaflet_id) return;

    const map = L.map('mini-map', {
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false
    }).setView([51.1215, -114.0076], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    L.marker([51.1215, -114.0076]).addTo(map)
        .bindPopup('<b>Move to YYC</b><br>Departure Point');
        
    setTimeout(() => {
        map.invalidateSize(true);
    }, 300);
}

function setupModalHandlers() {
    const modal = document.getElementById('activity-modal');
    const addBtn = document.getElementById('add-itinerary-item');
    const cancelBtn = document.getElementById('cancel-activity');
    const saveBtn = document.getElementById('save-activity');

    if(!addBtn) return;

    addBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });

    cancelBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    saveBtn.addEventListener('click', () => {
        const day = document.getElementById('modal-day-select').value;
        const name = document.getElementById('modal-activity-name').value;

        if (!name) {
            alert("Please enter an activity name.");
            return;
        }

        addActivityToSchedule(day, currentType, name);
        
        document.getElementById('modal-activity-name').value = '';
        modal.classList.add('hidden');
    });
}

window.selectType = function(btn) {
    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentType = btn.dataset.type;
}

function startCountdown() {
    const timerElement = document.getElementById('countdown-timer');
    if (!timerElement) return; // Safety check
    
    const flightData = sessionStorage.getItem('bookedFlight');
    let departureDate = new Date();
    
    if (flightData) {
        try {
            const flight = JSON.parse(flightData);
            if(flight.departDate && flight.departTime) {
                departureDate = new Date(`${flight.departDate}T${flight.departTime}`);
            } else {
                departureDate.setDate(departureDate.getDate() + 2);
            }
        } catch(e) {
            departureDate.setDate(departureDate.getDate() + 2);
        }
    } else {
        departureDate.setDate(departureDate.getDate() + 2);
    }

    function updateTimer() {
        const now = new Date();
        const diff = departureDate - now;

        if (diff <= 0) {
            timerElement.textContent = "Departed";
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        timerElement.textContent = `${days}d ${hours}h ${minutes}m`;
    }

    updateTimer();          // Run immediately
    setInterval(updateTimer, 60000); // Update every minute
}