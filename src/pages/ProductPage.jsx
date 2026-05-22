import { useState } from "react";
import ProductCard from "../components/ProductCard";

function ProductPage({ products, onUpdate, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const filtered = products
    .filter((p) => {
      if (filter === "critical") return p.quantity === 0;
      if (filter === "low") return p.quantity > 0 && p.quantity <= 20;
      if (filter === "adequate") return p.quantity > 20;
      return true;
    })
    .filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "quantity") return a.quantity - b.quantity;
      if (sortBy === "price") return b.price - a.price;
      return 0;
    });

  const outOfStock = products.filter((p) => p.quantity === 0).length;
  const lowStock = products.filter((p) => p.quantity > 0 && p.quantity <= 20).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Medical Inventory</h2>
        <p className="text-sm text-slate-500 mt-1">
          {products.length} total items —{" "}
          <span className="text-red-600 font-semibold">{outOfStock} out of stock</span>,{" "}
          <span className="text-orange-600 font-semibold">{lowStock} low stock</span>
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input type="text" placeholder="Search by medicine name, supplier, or category..."
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl border border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-hospital-teal text-sm bg-white" />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-3 rounded-xl border border-slate-300 shadow-sm text-sm bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-teal-400/30">
          <option value="all">All Stock</option>
          <option value="critical">Out of Stock</option>
          <option value="low">Low Stock</option>
          <option value="adequate">Adequate</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 rounded-xl border border-slate-300 shadow-sm text-sm bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-teal-400/30">
          <option value="name">Sort: Name</option>
          <option value="quantity">Sort: Quantity</option>
          <option value="price">Sort: Price</option>
        </select>
      </div>

      <p className="text-sm text-slate-500 font-medium">
        Showing <span className="font-bold text-slate-800">{filtered.length}</span> of {products.length} items
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length > 0 ? (
          filtered.map((product) => (
            <ProductCard key={product.id} product={product} onUpdate={onUpdate} onDelete={onDelete} />
          ))
        ) : (
          <div className="col-span-full text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500 mt-3 font-medium">No items match your search or filter.</p>
            <button onClick={() => { setSearchTerm(""); setFilter("all"); }}
              className="mt-3 text-sm font-bold text-hospital-teal hover:underline">
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductPage;