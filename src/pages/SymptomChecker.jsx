import { useState } from "react";
import { ALL_SYMPTOMS, diagnose } from "../data/symptomsData";

const SEVERITY_STYLES = {
  CRITICAL: "bg-red-600 text-white",
  HIGH: "bg-orange-500 text-white",
  MEDIUM: "bg-yellow-400 text-slate-900",
  LOW: "bg-green-500 text-white",
};

const SEVERITY_BORDER = {
  CRITICAL: "border-red-300",
  HIGH: "border-orange-300",
  MEDIUM: "border-yellow-300",
  LOW: "border-green-300",
};

function SymptomChecker() {
  const [selected, setSelected] = useState([]);
  const [results, setResults] = useState(null);
  const [search, setSearch] = useState("");

  function toggleSymptom(symptom) {
    setSelected((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom],
    );
    setResults(null);
  }

  function handleDiagnose() {
    if (selected.length < 2) {
      alert("Please select at least 2 symptoms for an accurate diagnosis.");
      return;
    }
    setResults(diagnose(selected));
    window.scrollTo({ top: 600, behavior: "smooth" });
  }

  function handleReset() {
    setSelected([]);
    setResults(null);
    setSearch("");
  }

  const visibleSymptoms = ALL_SYMPTOMS.filter((s) =>
    s.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-hospital-teal to-teal-600 text-white rounded-2xl p-6 shadow-md">
        <h2 className="text-2xl font-black">Symptom Checker</h2>
        <p className="text-teal-100 text-sm mt-1">
          Select your symptoms below. Our diagnostic engine will identify
          possible conditions and recommend immediate action.
        </p>
        <div className="mt-3 bg-white/20 rounded-lg px-3 py-2 text-xs text-teal-100">
          This tool is for guidance only and does not replace professional
          medical diagnosis.
        </div>
      </div>

      {/* Symptom Selector */}
      <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800">Select Your Symptoms</h3>
          <span className="text-xs bg-teal-50 text-teal-700 font-bold px-3 py-1 rounded-full border border-teal-200">
            {selected.length} selected
          </span>
        </div>

        <input
          type="text"
          placeholder="Search symptoms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-teal-400/30"
        />

        <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1">
          {visibleSymptoms.map((symptom) => (
            <button
              key={symptom}
              onClick={() => toggleSymptom(symptom)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer capitalize ${
                selected.includes(symptom)
                  ? "bg-hospital-teal text-white border-hospital-teal"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:border-hospital-teal hover:text-hospital-teal"
              }`}
            >
              {symptom}
            </button>
          ))}
        </div>

        {selected.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 font-bold uppercase mb-2">
              Selected:
            </p>
            <div className="flex flex-wrap gap-2">
              {selected.map((s) => (
                <span
                  key={s}
                  className="bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold px-2 py-1 rounded-full capitalize"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleDiagnose}
          className="flex-1 bg-hospital-teal text-white font-bold py-3 rounded-xl hover:bg-teal-800 transition-colors cursor-pointer"
        >
          Run Diagnosis
        </button>
        <button
          onClick={handleReset}
          className="px-6 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
        >
          Reset
        </button>
      </div>

      {/* Results */}
      {results !== null && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-800">
            {results.length > 0
              ? "Possible Conditions"
              : "No strong matches found"}
          </h3>

          {results.length === 0 && (
            <div className="bg-white rounded-xl p-6 border border-dashed border-slate-300 text-center">
              <p className="text-slate-500 mt-3 text-sm">
                Your symptoms do not clearly match our database. Please visit
                the nearest health facility for a professional diagnosis.
              </p>
            </div>
          )}

          {results.map((condition, i) => (
            <div
              key={i}
              className={`bg-white rounded-xl border shadow-sm overflow-hidden ${SEVERITY_BORDER[condition.severity]}`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{condition.icon}</span>
                    <div>
                      <h4 className="font-black text-slate-900 text-lg leading-tight">
                        {condition.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {condition.matchCount} of {condition.symptoms.length}{" "}
                        symptoms matched
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-black px-3 py-1 rounded-full shrink-0 ${SEVERITY_STYLES[condition.severity]}`}
                  >
                    {condition.severity}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-bold uppercase text-slate-400 mb-2">
                    Matched Symptoms
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {condition.matchedSymptoms.map((s) => (
                      <span
                        key={s}
                        className="bg-teal-50 text-teal-700 text-xs font-semibold px-2 py-0.5 rounded-full capitalize border border-teal-100"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-xs font-black uppercase text-amber-700 mb-1">
                    Immediate Action Required
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {condition.immediateAction}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500">
              This tool is for guidance only and does not replace
              professional medical diagnosis. Always consult a qualified
              healthcare provider.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SymptomChecker;
