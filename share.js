document.addEventListener('DOMContentLoaded', () => {
    renderShareList();
    setupShareHandlers();
});

let isShareMode = false;
let selectedIndices = new Set();

function renderShareList() {
    const container = document.getElementById('share-list');
    const trips = JSON.parse(localStorage.getItem('myTrips') || '[]');
    container.innerHTML = '';

    if (trips.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#999; margin-top:20px;">No trips to share.</p>';
        return; 
    }

    trips.forEach((flight, index) => {
        // Ensure sharedWith array exists
        if (!flight.sharedWith) flight.sharedWith = [];

        const wrapper = document.createElement('div');
        wrapper.className = 'trip-wrapper';
        
        // Click logic: In share mode -> Select. In normal mode -> Toggle Accordion.
        wrapper.onclick = () => handleCardClick(index);

        // Checkbox
        const checkbox = document.createElement('div');
        checkbox.className = 'delete-checkbox'; // Reusing the style
        checkbox.id = `check-${index}`;
        checkbox.innerHTML = '<i class="fas fa-check" style="font-size: 12px;"></i>';

        // Card Content
        const card = document.createElement('div');
        card.className = 'flight-card';
        card.style.flex = '1';
        card.style.paddingBottom = '0'; // Remove padding for accordion flush fit
        card.style.overflow = 'hidden'; // Ensure rounded corners work

        const dateDisplay = flight.travelDate ? new Date(flight.travelDate).toLocaleDateString() : 'Date TBD';
        const shareCount = flight.sharedWith.length;

        card.innerHTML = `
            <div style="padding: 18px;">
                <div class="flight-card-header">
                    <div class="airline-name">${flight.airline}</div>
                    <div class="flight-price" style="font-size: 0.9rem; color: #666;">${dateDisplay}</div>
                </div>
                <div class="flight-route">
                    <div class="route-point">
                        <span class="code">${flight.originCode}</span>
                    </div>
                    <div class="route-line">
                        <div class="line-graphic"><i class="fas fa-plane"></i></div>
                    </div>
                    <div class="route-point">
                        <span class="code">${flight.destinationCode}</span>
                    </div>
                </div>
                <div class="flight-footer" style="margin-top: 10px;">
                    <div class="amenities">
                        <span class="share-indicator ${shareCount > 0 ? 'visible' : ''}">
                            <i class="fas fa-user-friends"></i> Shared with ${shareCount}
                        </span>
                    </div>
                    <i class="fas fa-chevron-down" id="arrow-${index}" style="color:#ccc; transition: transform 0.3s;"></i>
                </div>
            </div>
            
            <!-- Accordion Section -->
            <div class="shared-with-section" id="accordion-${index}">
                <div class="shared-header">SHARED WITH:</div>
                ${flight.sharedWith.map(p => `
                    <div class="shared-person">
                        <span>${p.name}</span>
                        <span style="color:#999; font-size:0.8rem;">${p.email}</span>
                    </div>
                `).join('')}
                ${shareCount === 0 ? '<div style="color:#ccc; font-size:0.8rem; padding-bottom:10px;">Not shared with anyone yet.</div>' : ''}
            </div>
        `;

        wrapper.appendChild(checkbox);
        wrapper.appendChild(card);
        container.appendChild(wrapper);
    });
}

function handleCardClick(index) {
    if (isShareMode) {
        // Selection Logic
        const checkbox = document.getElementById(`check-${index}`);
        if (selectedIndices.has(index)) {
            selectedIndices.delete(index);
            checkbox.classList.remove('checked');
        } else {
            selectedIndices.add(index);
            checkbox.classList.add('checked');
        }
        updateConfirmButton();
    } else {
        // Accordion Logic
        const accordion = document.getElementById(`accordion-${index}`);
        const arrow = document.getElementById(`arrow-${index}`);
        
        if (accordion.classList.contains('open')) {
            accordion.classList.remove('open');
            arrow.style.transform = 'rotate(0deg)';
        } else {
            accordion.classList.add('open');
            arrow.style.transform = 'rotate(180deg)';
        }
    }
}

function setupShareHandlers() {
    const btnShareMode = document.getElementById('fab-share-mode');
    const btnConfirm = document.getElementById('share-confirm-fab');
    const modalOptions = document.getElementById('share-options-modal');
    const modalEmail = document.getElementById('email-modal');

    // 1. Toggle Share Mode
    btnShareMode.addEventListener('click', () => {
        isShareMode = !isShareMode;
        const body = document.body;
        const icon = btnShareMode.querySelector('i');

        if (isShareMode) {
            body.classList.add('delete-mode'); // Reusing this class for checkbox visibility
            icon.className = 'fas fa-times'; // Change to X
            btnConfirm.classList.remove('hidden');
            selectedIndices.clear();
        } else {
            body.classList.remove('delete-mode');
            icon.className = 'fas fa-share-alt';
            btnConfirm.classList.add('hidden');
            document.querySelectorAll('.delete-checkbox').forEach(el => el.classList.remove('checked'));
        }
    });

    // 2. Confirm Selection -> Open Options Modal
    btnConfirm.addEventListener('click', () => {
        if (selectedIndices.size > 0) {
            modalOptions.classList.remove('hidden');
        }
    });

    // 3. Close Options Modal
    document.getElementById('close-share-options').addEventListener('click', () => {
        modalOptions.classList.add('hidden');
    });

    // 4. Open Email Modal
    document.getElementById('btn-email-share').addEventListener('click', () => {
        modalOptions.classList.add('hidden');
        modalEmail.classList.remove('hidden');
    });

    // 5. Cancel Email
    document.getElementById('cancel-email').addEventListener('click', () => {
        modalEmail.classList.add('hidden');
    });

    // 6. Send Email (The Logic)
    document.getElementById('send-email-btn').addEventListener('click', () => {
        const name = document.getElementById('recipient-name').value;
        const email = document.getElementById('recipient-email').value;

        if (!name || !email) {
            alert("Please fill in both fields.");
            return;
        }

        // Update Data
        const trips = JSON.parse(localStorage.getItem('myTrips') || '[]');
        selectedIndices.forEach(index => {
            if (!trips[index].sharedWith) trips[index].sharedWith = [];
            trips[index].sharedWith.push({ name, email });
        });

        localStorage.setItem('myTrips', JSON.stringify(trips));

        // Reset UI
        modalEmail.classList.add('hidden');
        document.getElementById('recipient-name').value = '';
        document.getElementById('recipient-email').value = '';
        
        // Exit Share Mode
        btnShareMode.click(); 
        
        // Re-render to show new shared status
        renderShareList();        
    });
}

function updateConfirmButton() {
    const btn = document.getElementById('share-confirm-fab');
    if (selectedIndices.size > 0) {
        btn.classList.add('active');
    } else {
        btn.classList.remove('active');
    }
}