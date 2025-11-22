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

    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', (event) => {
            event.preventDefault();
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = 'index.html';
            }
        });
    }

    const searchInput = document.getElementById('location-search');
    const searchButton = document.getElementById('search-button');
    const locationCards = document.querySelectorAll('.location-card');

    const filterLocations = () => {
        const query = (searchInput?.value || '').trim().toLowerCase();
        locationCards.forEach(card => {
            const matches = card.dataset.name.toLowerCase().includes(query);
            card.style.display = matches ? '' : 'none';
        });
    };

    if (searchInput && locationCards.length) {
        searchInput.addEventListener('input', filterLocations);
    }

    if (searchButton) {
        searchButton.addEventListener('click', (event) => {
            event.preventDefault();
            filterLocations();
        });
    }

    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            filterLocations();
        });
    }
});

// Hook location cards and pass selection via query string
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.location-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const name = card.dataset.name;
            window.location.href = `destination.html?location=${encodeURIComponent(name)}`;
        });
    });
});