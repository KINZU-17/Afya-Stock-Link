# AfyaStock Link

A web-based medical supply management portal for sub-county health facilities in Kenya. AfyaStock Link helps facility officers, pharmacists, and supply chain managers track drug inventory, monitor stock levels, check symptoms, and locate nearby health facilities — all from a single dashboard.

---

## Features

### Dashboard
- Overview of total inventory items, out-of-stock count, low-stock count, and total inventory value
- Facility profile (name, region, MFL code, contact, beds, and staff)
- Critical stock alerts for items at or below 20 units
- Quick navigation links to all major sections

### Medical Inventory
- View all stocked drugs and medical supplies
- Filter by stock status: adequate, low stock, or out of stock
- Sort by name, quantity, or unit price
- Search by drug name, supplier, or category
- Update unit cost and quantity per product
- Flag and remove depleted or expired stock

### Add Inbound Stock
- Register newly received supply batches into the system
- Fields: drug name, supplier/depot, category, clinical notes, unit cost, quantity, expiry date, and batch image

### Symptom Checker
- Select symptoms from a searchable list of 50+ clinical symptoms
- Diagnostic engine matches symptom combinations against 12 common conditions (malaria, typhoid, pneumonia, cholera, TB, meningitis, and more)
- Returns possible conditions ranked by match score, each with severity level and recommended immediate action

### Nearby Health Facilities
- Uses the browser's Geolocation API to find your current coordinates
- Queries the OpenStreetMap Overpass API for hospitals, clinics, pharmacies, and health posts within a 5km radius
- Displays results on an interactive Leaflet map with markers and popups
- Lists facilities with phone numbers, opening hours, and Google Maps directions links

### Authentication
- Staff login and account creation
- Role-based identity (Facility Officer, Pharmacist, Supply Chain Manager, Doctor, Nurse)
- Session persisted via localStorage

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 19 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Maps | Leaflet + React Leaflet |
| Map data | OpenStreetMap / Overpass API |
| Backend (dev) | JSON Server |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone <repo-url>
cd afyastock-link
npm install
```

### Running the app

Start the JSON Server (mock backend) in one terminal:

```bash
npx json-server --watch db.json --port 3001
```

Start the Vite dev server in another terminal:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for production

```bash
npm run build
```

---

## Project Structure

```
src/
  components/
    Navbar.jsx          # Top navigation bar
    ProductCard.jsx     # Individual drug/supply card with edit and delete
    StockBadge.jsx      # Stock status and expiry date badge logic
  context/
    AuthContext.jsx     # Auth state and login/logout logic
  data/
    symptomsData.js     # Condition definitions and diagnostic engine
  hooks/
    useFetch.js         # Generic data-fetching hook
  pages/
    Home.jsx            # Dashboard
    ProductPage.jsx     # Inventory list with filters and search
    AddProductForm.jsx  # Inbound stock registration form
    SymptomChecker.jsx  # Symptom selection and diagnosis results
    NearbyFacilities.jsx # Map-based facility finder
    LoginPage.jsx       # Login and sign-up
```

---

## Data

`db.json` at the project root acts as the database for the JSON Server. It holds:

- `products` — all drug and supply records
- `facility_info` — the facility's profile data (name, region, MFL code, contact, beds, staff)

---

## Notes

- The symptom checker is for guidance only and does not replace professional medical diagnosis.
- Location access must be granted in the browser for the Nearby Facilities feature to work.
- User accounts are stored in the browser's localStorage and are local to the device.
