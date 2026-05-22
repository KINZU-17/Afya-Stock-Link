import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Pin, SatelliteDish,TriangleAlert } from "lucide-react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const userIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const TYPE_LABELS = {
  hospital: "Hospital",
  clinic: "Clinic",
  pharmacy: "Pharmacy",
  health_post: "Health Post",
};

function NearbyFacilities() {
  const [location, setLocation] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  function getLocation() {
    setLoading(true);
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(coords);
        fetchFacilities(coords);
      },
      () => {
        setError(
          "Unable to retrieve your location. Please allow location access in your browser.",
        );
        setLoading(false);
      },
    );
  }

  function fetchFacilities(coords) {
    const radius = 5000;
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](around:${radius},${coords.lat},${coords.lng});
        node["amenity"="clinic"](around:${radius},${coords.lat},${coords.lng});
        node["amenity"="health_post"](around:${radius},${coords.lat},${coords.lng});
        node["amenity"="pharmacy"](around:${radius},${coords.lat},${coords.lng});
        way["amenity"="hospital"](around:${radius},${coords.lat},${coords.lng});
      );
      out center;
    `;

    fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
    })
      .then((r) => r.json())
      .then((data) => {
        const results = data.elements
          .filter((el) => el.lat || el.center)
          .map((el) => ({
            id: el.id,
            name: el.tags?.name || "Unnamed Health Facility",
            type: el.tags?.amenity || "facility",
            lat: el.lat || el.center?.lat,
            lng: el.lon || el.center?.lon,
            phone: el.tags?.phone || el.tags?.["contact:phone"] || null,
            opening_hours: el.tags?.opening_hours || null,
          }));
        setFacilities(results);
        setSearched(true);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load nearby facilities. Please try again.");
        setLoading(false);
      });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-clinical-blue to-blue-600 text-white rounded-2xl p-6 shadow-md">
        <h2 className="text-2xl font-black"> Nearby Health Facilities</h2>
        <p className="text-blue-100 text-sm mt-1">
          Find hospitals, clinics, and pharmacies within 5km of your current
          location.
        </p>
      </div>

      {/* Enable Location */}
      {!location && (
        <div className="bg-white rounded-xl p-8 border border-slate-100 shadow-sm text-center">
          <span className="text-5xl flex w-full justify-center"><SatelliteDish /></span>
          <h3 className="text-lg font-bold text-slate-800 mt-4">
            Enable Location Access
          </h3>
          <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
            Allow location access so we can find health facilities near you in
            real time.
          </p>
          <button
            onClick={getLocation}
            disabled={loading}
            className="mt-6 bg-clinical-blue text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Locating you..." :"Find Nearby Facilities"}
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
          <TriangleAlert className="inline mr-2" />
          {error}
        </div>
      )}

      {location && (
        <>
          <div className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm">
            <MapContainer
              center={[location.lat, location.lng]}
              zoom={14}
              style={{ height: "420px", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[location.lat, location.lng]} icon={userIcon}>
                <Popup>
                  <strong>📍 Your Location</strong>
                </Popup>
              </Marker>
              <Circle
                center={[location.lat, location.lng]}
                radius={5000}
                pathOptions={{
                  color: "#0284c7",
                  fillColor: "#0284c7",
                  fillOpacity: 0.05,
                }}
              />
              {facilities.map((f) => (
                <Marker key={f.id} position={[f.lat, f.lng]}>
                  <Popup>
                    <div className="text-sm space-y-1">
                      <strong>{f.name}</strong>
                      <br />
                      <span className="text-slate-500">
                        {TYPE_LABELS[f.type] || "🏥 Facility"}
                      </span>
                      {f.phone && (
                        <>
                          <br />
                          📞 {f.phone}
                        </>
                      )}
                      {f.opening_hours && (
                        <>
                          <br />
                          🕐 {f.opening_hours}
                        </>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-600">
              {searched
                ? `Found ${facilities.length} facilit${facilities.length !== 1 ? "ies" : "y"} within 5km`
                : "Loading..."}
            </p>
            <button
              onClick={getLocation}
              className="text-xs font-bold text-clinical-blue border border-clinical-blue px-4 py-2 rounded-lg hover:bg-blue-50 cursor-pointer"
            >
              🔄 Refresh
            </button>
          </div>

          {facilities.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-slate-800">
                  Facility Directory ({facilities.length})
                </h3>
              </div>
              <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
                {facilities.map((f) => (
                  <div
                    key={f.id}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate">
                        {f.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {TYPE_LABELS[f.type] || "🏥 Facility"}
                        {f.phone && ` · 📞 ${f.phone}`}
                      </p>
                    </div>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${f.lat},${f.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-xs font-bold text-clinical-blue border border-clinical-blue px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Directions →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default NearbyFacilities;
