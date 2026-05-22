import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import AddProductForm from "./pages/AddProductForm";
import SymptomChecker from "./pages/SymptomChecker";
import NearbyFacilities from "./pages/NearbyFacilities";
import LoginPage from "./pages/LoginPage";
import { useFetch } from "./hooks/useFetch";
import { AuthProvider, useAuth } from "./context/AuthContext";

function ProtectedApp() {
  const { user } = useAuth();
  const {
    data: products,
    setData: setProducts,
    loading,
    error,
  } = useFetch("http://localhost:3001/products");

  if (!user) return <Navigate to="/login" replace />;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-medical-bg">
        <div className="text-center">
          <div className="w-16 h-16 bg-hospital-teal rounded-2xl flex items-center justify-center mx-auto text-white text-3xl font-black animate-pulse">
            +
          </div>
          <h2 className="text-xl font-bold text-hospital-teal mt-4 animate-pulse">
            Synchronizing AfyaStock Link...
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Make sure json-server is running on port 3001
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-medical-bg px-4">
        <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full text-center border border-red-100">
          <h2 className="text-xl font-black text-slate-900 mt-4">Server not running</h2>
          <p className="text-slate-500 text-sm mt-2">Please start the JSON server with:</p>
          <code className="block bg-slate-100 rounded-lg px-4 py-3 mt-3 text-sm text-slate-700 font-mono text-left">
            npx json-server --watch db.json --port 3001
          </code>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-hospital-teal text-white font-bold px-6 py-2 rounded-lg hover:bg-teal-800 cursor-pointer text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  function handleAddProduct(newProduct) {
    setProducts([...(products || []), newProduct]);
  }

  function handleUpdateProduct(updated) {
    setProducts((products || []).map((p) => (p.id === updated.id ? updated : p)));
  }

  function handleDeleteProduct(id) {
    setProducts((products || []).filter((p) => p.id !== id));
  }

  return (
    <div className="min-h-screen bg-medical-bg">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/products"
            element={
              <ProductPage
                products={products || []}
                onUpdate={handleUpdateProduct}
                onDelete={handleDeleteProduct}
              />
            }
          />
          <Route
            path="/add-product"
            element={<AddProductForm onAddProduct={handleAddProduct} />}
          />
          <Route path="/symptom-checker" element={<SymptomChecker />} />
          <Route path="/nearby" element={<NearbyFacilities />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<ProtectedApp />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;