import React, { useState } from "react";
import StockBadge, { getExpiryStatus } from "./StockBadge";
import { Package, TriangleAlert } from "lucide-react";

function ProductCard({ product, onUpdate, onDelete }) {
  const {
    id,
    name,
    description,
    origin,
    category,
    price,
    quantity,
    expiry_date,
    image,
  } = product;
  const [isEditing, setIsEditing] = useState(false);
  const [editFields, setEditFields] = useState({ price, quantity });
  const [saving, setSaving] = useState(false);
  const expiryStatus = getExpiryStatus(expiry_date);

  function handlePatchSubmit(e) {
    e.preventDefault();
    setSaving(true);
    fetch(`http://localhost:3001/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price: parseFloat(editFields.price),
        quantity: parseInt(editFields.quantity),
      }),
    })
      .then((r) => r.json())
      .then((updated) => {
        onUpdate(updated);
        setIsEditing(false);
        setSaving(false);
      })
      .catch(() => setSaving(false));
  }

  function handleDelete(e) {
    e.preventDefault();
    fetch(`http://localhost:3001/products/${id}`, { method: "DELETE" }).then(
      () => onDelete(id),
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="w-full h-44 object-cover"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500";
          }}
        />
        <div className="absolute top-2 left-2">
          <StockBadge quantity={quantity} />
        </div>
        {category && (
          <div className="absolute top-2 right-2">
            <span className="text-xs font-semibold bg-white/90 text-slate-700 px-2 py-0.5 rounded-full">
              {category}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow space-y-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 leading-tight">
            {name}
          </h3>
          <p className="text-xs text-teal-700 font-semibold mt-1">
            <Package size={16} className="inline mr-1" />
            {origin}
          </p>
        </div>

        <p className="text-sm text-slate-500 line-clamp-2 flex-grow">
          {description}
        </p>

        <p className={`text-xs ${expiryStatus.color}`}>{expiryStatus.label}</p>

        {/* Edit form */}
        {isEditing ? (
          <form
            onSubmit={handlePatchSubmit}
            className="space-y-2 pt-2 border-t border-slate-100"
          >
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-slate-500 font-bold uppercase">
                  Price (KES)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editFields.price}
                  onChange={(e) =>
                    setEditFields({ ...editFields, price: e.target.value })
                  }
                  className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-1 focus:ring-hospital-teal mt-1"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-slate-500 font-bold uppercase">
                  Qty (Units)
                </label>
                <input
                  type="number"
                  min="0"
                  value={editFields.quantity}
                  onChange={(e) =>
                    setEditFields({ ...editFields, quantity: e.target.value })
                  }
                  className="w-full px-2 py-1.5 text-sm border rounded-lg focus:ring-1 focus:ring-hospital-teal mt-1"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-hospital-teal text-white text-xs font-bold py-2 rounded-lg hover:bg-teal-800 disabled:opacity-60 cursor-pointer"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-slate-100 text-slate-600 text-xs font-bold py-2 rounded-lg hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase">
                Unit Cost
              </span>
              <p className="text-lg font-black text-slate-900">
                KES {price.toFixed(2)}
              </p>
              <p className="text-xs text-slate-500">
                {quantity} units in stock
              </p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs font-bold text-hospital-teal border border-hospital-teal px-3 py-2 rounded-lg hover:bg-hospital-teal hover:text-white transition-colors cursor-pointer"
            >
              Update Stock
            </button>
          </div>
        )}

        {/* Delete */}
        <button
          onClick={handleDelete}
          className="w-full bg-rose-50 text-rose-600 font-bold text-xs py-2.5 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
        >
          Flag as Depleted / Expired
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
