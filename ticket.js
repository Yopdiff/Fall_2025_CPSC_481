document.addEventListener('DOMContentLoaded', () => {
    // 1. Retrieve data
    const flightData = sessionStorage.getItem('bookedFlight');
    const flightDate = sessionStorage.getItem('flightDate');

    if (!flightData) {
        alert("No flight selected. Returning to search.");
        window.location.href = 'search.html';
        return;
    }

    const flight = JSON.parse(flightData);

    // 2. Populate HTML elements
    document.getElementById('t-airline').textContent = flight.airline;
    document.getElementById('t-origin-code').textContent = flight.originCode;
    document.getElementById('t-dest-code').textContent = flight.destinationCode;
    document.getElementById('t-depart-time').textContent = flight.departTime;
    document.getElementById('t-arrive-time').textContent = flight.arrivalTime;
    document.getElementById('t-duration').textContent = flight.duration;
    
    // Generate a random flight number for effect
    document.getElementById('t-flight-num').textContent = flight.originCode.substring(0,2) + Math.floor(Math.random() * 900 + 100);

    // Format Date - FIX: Parse manually to avoid timezone shift
    if (flightDate) {
        const [year, month, day] = flightDate.split('-');
        // Create date using local arguments: new Date(year, monthIndex, day)
        const localDate = new Date(year, month - 1, day);
        
        document.getElementById('t-date').textContent = localDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
        document.getElementById('t-date').textContent = "N/A";
    }
});