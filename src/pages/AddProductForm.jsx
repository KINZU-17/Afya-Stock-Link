import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  "Antibiotics", "Antimalarials", "Analgesics", "Vaccines", "IV Fluids",
  "Surgical Supplies", "Rehydration", "Diabetes", "Cardiovascular",
  "Respiratory", "Maternal Health", "Vitamins & Supplements", "Other",
];

function AddProductForm({ onAddProduct }) {
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    name: "", origin: "", category: "Other", description: "",
    price: "", quantity: "", expiry_date: "", image: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    setFields({ ...fields, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ...fields,
      price: parseFloat(fields.price || 0),
      quantity: parseInt(fields.quantity || 0),
      image: fields.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
    };

    fetch("http://localhost:3001/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((saved) => {
        onAddProduct(saved);
        setSuccess(true);
        setTimeout(() => navigate("/products"), 1200);
      })
      .finally(() => setSubmitting(false));
  }

  const inputClass = "w-full mt-1 px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-hospital-teal bg-white transition-colors";
  const labelClass = "text-xs font-bold uppercase tracking-wider text-slate-500";

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-24">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-black text-slate-900">Stock Entry Authorized!</h2>
        <p className="text-slate-500 mt-2">Redirecting to inventory...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="mb-6">
          <h2 className="text-xl font-black text-slate-900">Log Inbound Supply Batch</h2>
          <p className="text-sm text-slate-500 mt-1">Register newly received medical stock into the system</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Generic Name / Drug Identity *</label>
            <input type="text" name="name" required placeholder="e.g. Paracetamol 500mg Tablets"
              value={fields.name} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Supplier / Origin Depot *</label>
            <input type="text" name="origin" required placeholder="e.g. KEMSA Central Stores"
              value={fields.origin} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Category *</label>
            <select name="category" value={fields.category} onChange={handleChange} className={inputClass}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>Clinical Usage & Storage Notes *</label>
            <textarea name="description" required rows={3}
              placeholder="Storage requirements, dosage notes, warnings..."
              value={fields.description} onChange={handleChange} className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Unit Cost (KES) *</label>
              <input type="number" step="0.01" name="price" required placeholder="350.00"
                value={fields.price} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Quantity (Units) *</label>
              <input type="number" min="0" name="quantity" required placeholder="500"
                value={fields.quantity} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Expiry Date *</label>
            <input type="date" name="expiry_date" required
              value={fields.expiry_date} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Batch Image URL (Optional)</label>
            <input type="url" name="image" placeholder="Leave blank for default image"
              value={fields.image} onChange={handleChange} className={inputClass} />
          </div>

          <button type="submit" disabled={submitting}
            className="w-full bg-hospital-teal text-white font-bold py-3 rounded-xl hover:bg-teal-800 transition-colors text-sm disabled:opacity-60 cursor-pointer mt-2">
            {submitting ? "Saving..." : "✅ Authorize Delivery Entry"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProductForm;