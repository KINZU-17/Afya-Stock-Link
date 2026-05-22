/* eslint-disable react-refresh/only-export-components */

export function getStockStatus(quantity) {
  if (quantity === 0)
    return { label: "CRITICAL — Out of Stock", color: "bg-red-100 text-red-700 border-red-300" };
  if (quantity <= 20)
    return { label: "LOW STOCK — Reorder Now", color: "bg-orange-100 text-orange-700 border-orange-300" };
  return { label: "Adequate", color: "bg-green-100 text-green-700 border-green-300" };
}

export function getExpiryStatus(expiryDate) {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  if (daysLeft < 0) return { label: "EXPIRED", color: "text-red-600 font-bold" };
  if (daysLeft <= 90) return { label: `Expires in ${daysLeft} days`, color: "text-orange-600 font-semibold" };
  return { label: `Expires ${expiryDate}`, color: "text-slate-500" };
}

function StockBadge({ quantity }) {
  const status = getStockStatus(quantity);
  return (
    <span className={`text-xs font-bold px-2 py-1 rounded-full border ${status.color}`}>
      {status.label}
    </span>
  );
}

export default StockBadge;