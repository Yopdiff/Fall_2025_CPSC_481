document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Map
    // Coordinates for Vancouver: [Lat, Long], Zoom Level: 13
    const map = L.map('map').setView([49.2827, -123.1207], 13);

    // 2. Add the "Tile Layer" (The actual map images from OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // 3. Add some dummy markers (Pins)
    
    // Marker 1: Downtown
    L.marker([49.2827, -123.1207]).addTo(map)
        .bindPopup('<b>Vancouver City Centre</b><br>Popular destination.')
        .openPopup();

    // Marker 2: Stanley Park
    L.marker([49.3017, -123.1417]).addTo(map)
        .bindPopup('<b>Stanley Park</b><br>Great for biking!');

    // Marker 3: YVR Airport
    L.marker([49.1967, -123.1815]).addTo(map)
        .bindPopup('<b>YVR Airport</b><br>Your flight departs here.');
});