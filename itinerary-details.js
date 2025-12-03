// This file contains JavaScript for handling the details of the itinerary, including the day-by-day schedule and user interactions for adding items.

document.addEventListener('DOMContentLoaded', () => {
    const itineraryContainer = document.getElementById('itinerary-container');
    const addItemButton = document.getElementById('add-item-btn');
    const itemInput = document.getElementById('item-input');
    const daySelect = document.getElementById('day-select');

    // Sample itinerary data structure
    const itineraryData = {
        days: [
            { day: 1, items: [] },
            { day: 2, items: [] },
            { day: 3, items: [] },
            { day: 4, items: [] },
            { day: 5, items: [] },
        ]
    };

    // Function to render the itinerary
    function renderItinerary() {
        itineraryContainer.innerHTML = '';
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

    // Function to add an item to the selected day
    function addItem() {
        const selectedDay = parseInt(daySelect.value);
        const itemText = itemInput.value.trim();
        
        if (itemText) {
            itineraryData.days[selectedDay - 1].items.push(itemText);
            itemInput.value = '';
            renderItinerary();
        } else {
            alert('Please enter an item.');
        }
    }

    // Event listener for the add item button
    addItemButton.addEventListener('click', addItem);

    // Initial render of the itinerary
    renderItinerary();
});

document.addEventListener('DOMContentLoaded', () => {
    startCountdown();
});

function startCountdown() {
    const timerElement = document.getElementById('countdown-timer');
    
    // Set a fake departure date (e.g., 2 days and 5 hours from now)
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
    updateTimer(); // Run immediately
    setInterval(updateTimer, 60000); // Update every minute
}

