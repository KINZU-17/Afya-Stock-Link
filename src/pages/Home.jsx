import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { useAuth } from "../context/AuthContext";
import { getStockStatus } from "../components/StockBadge";

function StatCard({ label, value, icon, borderColor }) {
  return (
    <div className={`bg-white rounded-xl p-5 border-l-4 shadow-sm flex items-center gap-4 ${borderColor}`}>
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="text-xl font-black text-slate-900">{value}</p>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}

function Home() {
  const { data: facility, loading: fLoading } = useFetch("http://localhost:3001/facility_info");
  const { data: products, loading: pLoading } = useFetch("http://localhost:3001/products");
  const { user } = useAuth();

  if (fLoading || pLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="w-14 h-14 bg-hospital-teal rounded-xl flex items-center justify-center mx-auto text-white text-2xl font-black animate-pulse">+</div>
          <p className="mt-4 text-hospital-teal font-semibold animate-pulse">Loading facility data...</p>
        </div>
      </div>
    );
  }

  const totalItems = products?.length || 0;
  const outOfStock = products?.filter((p) => p.quantity === 0).length || 0;
  const lowStock = products?.filter((p) => p.quantity > 0 && p.quantity <= 20).length || 0;
  const totalValue = products?.reduce((sum, p) => sum + p.price * p.quantity, 0) || 0;
  const criticalItems = products?.filter((p) => p.quantity <= 20) || [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-hospital-teal to-teal-600 text-white rounded-2xl p-6 shadow-md">
        <p className="text-teal-200 text-sm font-semibold">Welcome back</p>
        <h2 className="text-2xl font-black mt-1">{user?.name || "Staff Member"}</h2>
        <p className="text-teal-100 text-sm mt-1">{user?.role} — {facility?.name}</p>
        <div className="flex gap-4 mt-4 flex-wrap">
          <span className="bg-white/20 rounded-lg px-3 py-1 text-xs font-bold">MFL Code: {facility?.facility_code}</span>
          <span className="bg-white/20 rounded-lg px-3 py-1 text-xs font-bold">{facility?.emergency_contact}</span>
          <span className="bg-white/20 rounded-lg px-3 py-1 text-xs font-bold">{facility?.beds} Beds · {facility?.staff} Staff</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Items" value={totalItems} icon="" borderColor="border-teal-400" />
        <StatCard label="Out of Stock" value={outOfStock} icon="" borderColor="border-red-400" />
        <StatCard label="Low Stock" value={lowStock} icon="" borderColor="border-orange-400" />
        <StatCard label="Inventory Value" value={`KES ${totalValue.toLocaleString()}`} icon="" borderColor="border-green-400" />
      </div>

      {/* Facility Info */}
      {facility && (
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">Facility Profile</h3>
            <span className="bg-teal-100 text-teal-700 text-xs font-bold px-3 py-1 rounded-full">● Active</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-400 text-xs uppercase font-bold">Facility Name</p>
              <p className="font-semibold text-slate-800 mt-0.5">{facility.name}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase font-bold">Region</p>
              <p className="font-semibold text-slate-800 mt-0.5">{facility.region}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase font-bold">MFL Code</p>
              <p className="font-semibold text-slate-800 mt-0.5">{facility.facility_code}</p>
            </div>
          </div>
        </div>
      )}

      {/* Critical Alerts */}
      {criticalItems.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-red-100 shadow-sm">
          <h3 className="text-lg font-bold text-red-600 mb-4">Critical Stock Alerts</h3>
          <div className="space-y-3">
            {criticalItems.map((item) => {
              const status = getStockStatus(item.quantity);
              return (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.origin}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full border ${status.color}`}>
                    {item.quantity} units
                  </span>
                </div>
              );
            })}
          </div>
          <Link to="/products" className="mt-4 inline-block text-sm font-bold text-hospital-teal hover:underline">
            View Full Inventory →
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { to: "/products", icon: "", title: "View Inventory", sub: "Browse all medical stock" },
          { to: "/add-product", icon: "", title: "Log Inbound Stock", sub: "Register new supply batch" },
          { to: "/symptom-checker", icon: "", title: "Symptom Checker", sub: "AI-powered diagnosis tool" },
          { to: "/nearby", icon: "", title: "Nearby Facilities", sub: "Find health centers near you" },
        ].map((action) => (
          <Link key={action.to} to={action.to}
            className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow text-center group">
            <span className="text-3xl">{action.icon}</span>
            <p className="font-bold text-slate-800 mt-2 group-hover:text-hospital-teal transition-colors text-sm">{action.title}</p>
            <p className="text-xs text-slate-400 mt-1">{action.sub}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;