// 1. SELECT ELEMENTS
const btnItinerary = document.getElementById('tab-itinerary');
const btnShare = document.getElementById('tab-share');
const btnSearch = document.getElementById('tab-search');
const contentArea = document.getElementById('main-content');

// 2. ADD EVENT LISTENERS (safely)
if (btnItinerary) {
    btnItinerary.addEventListener('click', () => {
        setActiveTab(btnItinerary);
        console.log("Switched to Itinerary");
    });
}

if (btnShare) {
    btnShare.addEventListener('click', () => {
        setActiveTab(btnShare);
    });
}

if (btnSearch) {
    btnSearch.addEventListener('click', () => {
        setActiveTab(btnSearch);
        console.log("Switched to Search");
    });
}

// 3. HELPER FUNCTION
function setActiveTab(activeBtn) {
    const allBtns = document.querySelectorAll('.tab-btn');
    allBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    activeBtn.classList.add('active');
}

// 4. FAB + GLOBAL UI SETUP
document.addEventListener('DOMContentLoaded', () => {
    const allBtns = document.querySelectorAll('.tab-btn');
    allBtns.forEach(btn => btn.classList.remove('active'));

    const fabContainer = document.querySelector('.fab-container');
    const fabBtn = document.getElementById('fab-btn');

    if (fabContainer && fabBtn) {
        fabBtn.addEventListener('click', (event) => {
            event.preventDefault();
            fabContainer.classList.toggle('open');
        });

        document.addEventListener('click', (event) => {
            if (!fabContainer.contains(event.target)) {
                fabContainer.classList.remove('open');
            }
        });
    }
});

// 5. GLOBAL HELPERS (usable everywhere)

// Load trips from localStorage
function loadTrips() {
    return JSON.parse(localStorage.getItem('myTrips') || '[]');
}

// Save trips to localStorage
function saveTrips(trips) {
    localStorage.setItem('myTrips', JSON.stringify(trips));
}

// UI feedback message
function showStatus(msg) {
    const status = document.createElement('div');
    status.className = "save-status";
    status.textContent = msg;
    document.body.appendChild(status);
    setTimeout(() => status.remove(), 1200);
}