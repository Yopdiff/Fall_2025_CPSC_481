// 1. SELECT ELEMENTS
const btnItinerary = document.getElementById('tab-itinerary');
const btnShare = document.getElementById('tab-share');
const btnSearch = document.getElementById('tab-search');
const contentArea = document.getElementById('main-content');

// 2. ADD EVENT LISTENERS
btnItinerary.addEventListener('click', () => {
    setActiveTab(btnItinerary);
    // Logic to show Itinerary content goes here
    console.log("Switched to Itinerary");
});

btnShare.addEventListener('click', () => {
    setActiveTab(btnShare);
    console.log("Switched to Share");
});

btnSearch.addEventListener('click', () => {
    setActiveTab(btnSearch);
    // In the future, this will swap the content to the city grid
    console.log("Switched to Search");
});

// 3. HELPER FUNCTION
function setActiveTab(activeBtn) {
    // Remove 'active' class from all buttons
    const allBtns = document.querySelectorAll('.tab-btn');
    allBtns.forEach(btn => {
        btn.classList.remove('active');
    });

    // Add 'active' class to the clicked button
    activeBtn.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    const allBtns = document.querySelectorAll('.tab-btn');
    allBtns.forEach(btn => {
        btn.classList.remove('active');
    });

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