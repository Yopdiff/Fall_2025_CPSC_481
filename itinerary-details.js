// This file contains JavaScript for handling the details of the itinerary,
// including day-by-day schedule and user interactions for adding items.

document.addEventListener('DOMContentLoaded', () => {
    const itineraryContainer = document.getElementById('itinerary-schedule');
    const addItemButton = document.getElementById('add-itinerary-item');
    const itemInput = document.getElementById('item-input');
    const daySelect = document.getElementById('day-select');

    // Local itinerary structure (used only for rendering)
    const itineraryData = {
        days: [
            { day: 1, items: [] },
            { day: 2, items: [] },
            { day: 3, items: [] },
            { day: 4, items: [] },
            { day: 5, items: [] },
        ]
    };

    // RENDER ITINERARY UI
    function renderItinerary() {
        // NEW: Load saved activities from current trip
        const trips = loadTrips();
        let currentTripIndex = parseInt(sessionStorage.getItem('currentTripIndex'));
        if (!Number.isInteger(currentTripIndex)) currentTripIndex = 0;

        itineraryData.days.forEach(day => day.items = []);

        if (Number.isInteger(currentTripIndex) && trips[currentTripIndex] && Array.isArray(trips[currentTripIndex].activities)) {
            trips[currentTripIndex].activities.forEach(act => {
                const targetDay = itineraryData.days.find(d => d.day === act.day);
                if (targetDay) targetDay.items.push(act.text);
            });
        }

        itineraryContainer.innerHTML = '';

        // Build DOM
        itineraryData.days.forEach(day => {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day');
            dayDiv.innerHTML = `<h3>Day ${day.day}</h3>`;

            const itemsList = document.createElement('ul');
            day.items.forEach(item => {
                const listItem = document.createElement('li');
                listItem.textContent = item;
                itemsList.appendChild(listItem);
            });

            dayDiv.appendChild(itemsList);
            itineraryContainer.appendChild(dayDiv);
        });
    }

    // ADD NEW ITINERARY ITEM
    function addItem() {

    const selectedDay = parseInt(daySelect.value);

    // intuitive fallback input
    let itemText = prompt("Add an activity:");

    if (!itemText) {
        showStatus("Cancelled");
        return;
    }

    // Load stored trips
    const trips = loadTrips();
    let currentTripIndex = parseInt(sessionStorage.getItem('currentTripIndex'));
    if (!Number.isInteger(currentTripIndex)) currentTripIndex = 0;

    // Validate index
    if (!Number.isInteger(currentTripIndex) || !trips[currentTripIndex]) {
        alert("Could not find trip data.");
        return;
    }

    // Ensure activities array exists
    if (!Array.isArray(trips[currentTripIndex].activities)) {
        trips[currentTripIndex].activities = [];
    }

    // Store new itinerary activity
    trips[currentTripIndex].activities.push({
        day: selectedDay,
        text: itemText
    });

    // Save back to localStorage
    saveTrips(trips);

    // UI feedback (heuristic)
    showStatus("Activity added");

    // Reset input field
    itemInput.value = "";

    // Clear local view and re-render
    itineraryData.days.forEach(day => day.items = []);
    renderItinerary();
}

    // EVENT HANDLERS
    addItemButton.addEventListener('click', addItem);

    // Initial UI paint
    renderItinerary();
});

// Countdown Feature 
document.addEventListener('DOMContentLoaded', () => {
    startCountdown();
});

function startCountdown() {
    const timerElement = document.getElementById('countdown-timer');
    
    // Fake departure date (2 days and 5 hours from now)
    const departureDate = new Date();
    departureDate.setDate(departureDate.getDate() + 2);
    departureDate.setHours(departureDate.getHours() + 5);

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

