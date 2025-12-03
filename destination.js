document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('location') || 'Destination';
    const title = document.getElementById('destination-title');
    if (title) title.textContent = name;

    const backBtn = document.getElementById('destination-back');
    if (backBtn) {
        backBtn.addEventListener('click', (event) => {
            event.preventDefault();
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = 'search.html';
            }
        });
    }

    const actionButtons = document.querySelectorAll('.destination-action');
    const panels = {
        'new-flight': document.getElementById('panel-new-flight'),
        'existing-ticket': document.getElementById('panel-existing-ticket')
    };

    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetKey = button.dataset.target;
            Object.entries(panels).forEach(([key, panel]) => {
                if (!panel) return;
                const shouldOpen = key === targetKey && !panel.classList.contains('open');
                panel.classList.toggle('open', shouldOpen);
            });
        });
    });

    const newFlightForm = panels['new-flight'];
    if (newFlightForm) {
        newFlightForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const from = newFlightForm.querySelector('[name="flight-from"]').value;
            const to = newFlightForm.querySelector('[name="flight-to"]').value;
            
            // UPDATED: Use correct parameter names and file path
            const query = new URLSearchParams({ 
                destination: name, 
                depart: from, 
                return: to 
            }).toString();
            
            window.location.href = `flight-results.html?${query}`;
        });
    }

    const existingForm = panels['existing-ticket'];
    if (existingForm) {
        existingForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const confirmation = existingForm.querySelector('[name="confirmation-number"]').value;
            const airline = existingForm.querySelector('[name="airline-name"]').value;
            const query = new URLSearchParams({ location: name, confirmation, airline }).toString();
            window.location.href=`ticket.html?${query}`;
    });
    }
});