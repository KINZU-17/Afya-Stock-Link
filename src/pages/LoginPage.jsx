import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [fields, setFields] = useState({ name: "", email: "", password: "", role: "Facility Officer" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFields({ ...fields, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (isSignup) {
        const users = JSON.parse(localStorage.getItem("afyastock_users") || "[]");
        const exists = users.find((u) => u.email === fields.email);
        if (exists) {
          setError("An account with this email already exists.");
          setLoading(false);
          return;
        }
        const newUser = { name: fields.name, email: fields.email, password: fields.password, role: fields.role };
        localStorage.setItem("afyastock_users", JSON.stringify([...users, newUser]));
        login(newUser);
      } else {
        const users = JSON.parse(localStorage.getItem("afyastock_users") || "[]");
        const found = users.find((u) => u.email === fields.email && u.password === fields.password);
        if (!found) {
          setError("Invalid email or password. Please try again.");
          setLoading(false);
          return;
        }
        login(found);
      }
      navigate("/");
      setLoading(false);
    }, 400);
  }

  const inputClass = "w-full mt-1 px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-hospital-teal transition-colors";
  const labelClass = "text-xs font-bold uppercase text-slate-500 tracking-wider";

  return (
    <div className="min-h-screen bg-medical-bg flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 w-full max-w-md p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-hospital-teal rounded-2xl flex items-center justify-center mx-auto text-white text-3xl font-black shadow-md">
            +
          </div>
          <h1 className="text-2xl font-black text-hospital-teal mt-3">AfyaStock Link</h1>
          <p className="text-slate-500 text-sm mt-1">Sub-County Medical Supply Portal</p>
        </div>

        <h2 className="text-lg font-bold text-slate-800 mb-6 text-center">
          {isSignup ? "Create Staff Account" : "Staff Login"}
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <>
              <div>
                <label className={labelClass}>Full Name</label>
                <input name="name" required type="text" placeholder="e.g. James Mwangi"
                  value={fields.name} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Role</label>
                <select name="role" value={fields.role} onChange={handleChange} className={inputClass + " bg-white"}>
                  <option>Facility Officer</option>
                  <option>Pharmacist</option>
                  <option>Supply Chain Manager</option>
                  <option>Doctor</option>
                  <option>Nurse</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className={labelClass}>Email Address</label>
            <input name="email" required type="email" placeholder="you@hospital.go.ke"
              value={fields.email} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <input name="password" required type="password" placeholder="••••••••"
              value={fields.password} onChange={handleChange} className={inputClass} />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-hospital-teal text-white font-bold py-3 rounded-lg hover:bg-teal-800 transition-colors text-sm mt-2 disabled:opacity-60 cursor-pointer">
            {loading ? "Please wait..." : isSignup ? "Create Account & Enter" : "Login to Portal"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          {isSignup ? "Already have an account? " : "New staff member? "}
          <button onClick={() => { setIsSignup(!isSignup); setError(""); }}
            className="text-hospital-teal font-bold hover:underline cursor-pointer">
            {isSignup ? "Login here" : "Create account"}
          </button>
        </p>

        {!isSignup && (
          <p className="text-center text-xs text-slate-400 mt-4 bg-slate-50 rounded-lg py-2 px-3">
            First time? Click "Create account" to register as staff.
          </p>
        )}
      </div>
    </div>
  );
}

export default LoginPage;