# Roam Together Tours - Travel Companion App

| Full Name | UCID |
| :--- | :--- |
| Hongwoo Yoon | 30113779 |
| Alexander Firth | 30223984 |
| Ayushi Patil | 30223926 |
| Arpit Chitkara | 30170166 |

**Course:** CPSC 481 - Fall 2025

## Project Overview
Roam Together Tours is a mobile-first web application designed to help users plan, manage, and enjoy their group travel experiences. The prototype focuses on flight searching, itinerary management, and trip personalization.

## Acknowledgements
*   **GitHub Copilot**: Used for code generation, debugging, and refactoring assistance throughout the development of this project.

## Instructions for Use

### 1. Setup & Running
1.  Unzip the project folder.
2.  Open the folder in VS Code or your preferred editor.
3.  Open `index.html` in a web browser (Chrome or Edge recommended).
    *   *Tip: For the best experience, use the browser's "Inspect Element" tool and toggle the "Device Toolbar" to simulate a mobile device (e.g., iPhone 12/13).*
    *   *Tip: VS code Extansion, 'Live Server' is recommended.

### 2. Implemented Features & Walkthrough

To fully experience the prototype, please follow this step-by-step walkthrough:

#### **Scenario 1: Searching and Booking a Flight**
1.  **Start at Home:** You will land on the `index.html` page.
2.  **Navigate to Search:** Click the "Search" tab in the top navigation bar.
3.  **Enter Search Criteria:**
    *   **Destination:** Type "Vancouver" (or leave blank to see all).
    *   **Dates:** Select a departure date (e.g., tomorrow) and a return date.
    *   **Search:** Click the "Search Flights" button.
4.  **View Results:** You will see a list of available flights.
5.  **Select a Flight:** Click the "Select" button on any flight card.
6.  **View Ticket:** You will be taken to the `ticket.html` page showing your boarding pass with a QR code.
    *   *Note: This action automatically saves the trip to your "Itinerary".*

#### **Scenario 2: Managing Your Itinerary (My Trips)**
1.  **Go to Itinerary:** Click the "Itinerary" tab in the top navigation bar.
2.  **View Trips:** You will see the flight you just booked listed here.
3.  **Add to Favorites:** Click the **Heart icon** on the trip card. It will turn red, indicating it is saved to your Favorites.
4.  **Delete Mode:**
    *   Click the **FAB (Floating Action Button)** with the `+` icon in the bottom right.
    *   Select **"Delete itinerary"** from the menu.
    *   The interface changes to "Delete Mode". Checkboxes appear next to your trips.
    *   Select the trip you want to remove.
    *   Click the **Trash Can icon** that appears in the bottom left.
    *   Confirm the deletion in the modal popup.
5. **Edit Mode:**
    *   Click the **FAB (Floating Action Button)** with the `+` icon in the bottom right.
    *   Select **"Edit itinerary"** from the menu.
    *   The interface changes to "Edit Mode". Border changes to dashed line.
    *   Select the trip you want to edit.
    *   Pop up appears with Itinerary Items.
    *   Select the Itineary Item you want to remove.
    *   Click the delete button.
    *   Confrim the deletion in the modal popup.
   
#### **Scenario 3: Favorites & Past Trips**
1.  **Go to Favorites:** Click the "Favourites" (Heart icon) in the bottom navigation bar.
2.  **Toggle Views:** Use the toggle switch at the top to switch between **"Upcoming"** and **"Past"**.
    *   **Upcoming:** Shows your currently booked future trips that you have "hearted".
    *   **Past:** Shows a hardcoded example of a past trip to demonstrate history functionality.
3.  **View Details:** Click on any card to view the detailed ticket/itinerary page.

#### **Scenario 4: Notifications & Settings**
1.  **Notifications:**
    *   From the Itinerary Detail page (`itinerary-details.html`), click the **Bell icon** in the top right corner.
    *   You will see a list of notifications (e.g., "Flight delayed", "Gate change").
    *   Click "Mark all as read" to dim the notifications.
2.  **Settings:**
    *   Click the "Settings" (Sliders icon) in the bottom navigation bar.
    *   Toggle the switches for "Notifications".

#### **Scenario 5: Adding an Activity to a Trip**
1.  **Go to Itinerary:** Click the "Itinerary" tab.
2.  **Select a Trip:** Click the arrow button `->` on a trip card to view its details.
3.  **View Itinerary Details:** You will see the daily schedule for that trip.
4.  **Add Activity:**
    *   Click the **Add Activity**.
    *   A modal popup will appear.
    *   **Type:** Select "Accommodation", "Restaurant", or "Activity".
    *   **Name:** Enter a name (e.g., "Hilton Hotel", "Joe's Pizza").
    *   **Time:** Select a time.
    *   **Save:** Click "Save Activity".
5.  **Verify:** The new activity will appear in the timeline for that day.


### 3. Data Entry Guide
*   **Search Page:**
    *   **Destination:** "Vancouver", "Toronto", "Paris", "Berlin", "New York", "Tokyo".
    *   **Dates:** Any valid future date range.
*   **Itinerary Page:** No data entry required; interacts with clicked elements.

## Technical Details
*   **Storage:** Uses `localStorage` to persist trips and favorites across pages during the session.
*   **Responsive Design:** Optimized for mobile viewports (max-width 400px container).
*   **Icons:** FontAwesome 6.4.0.
