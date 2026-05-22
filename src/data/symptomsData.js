export const CONDITIONS = [
  {
    name: "Malaria",
    symptoms: [
      "fever",
      "chills",
      "headache",
      "sweating",
      "nausea",
      "vomiting",
      "muscle pain",
      "fatigue",
    ],
    severity: "HIGH",
    immediateAction:
      "Visit the nearest health facility IMMEDIATELY for a rapid diagnostic test (RDT). Do not self-medicate. If confirmed, you will need Artemether-Lumefantrine (ALu) or Artesunate injection for severe cases.",
    icon: "🦟",
  },
  {
    name: "Typhoid Fever",
    symptoms: [
      "fever",
      "headache",
      "stomach pain",
      "constipation",
      "diarrhea",
      "weakness",
      "rash",
      "loss of appetite",
    ],
    severity: "HIGH",
    immediateAction:
      "Seek medical attention immediately. Avoid self-medication. Maintain oral rehydration. A Widal test will be needed. Treated with Ciprofloxacin or Azithromycin.",
    icon: "🌡️",
  },
  {
    name: "Common Cold",
    symptoms: [
      "runny nose",
      "sneezing",
      "sore throat",
      "cough",
      "mild fever",
      "congestion",
      "fatigue",
    ],
    severity: "LOW",
    immediateAction:
      "Rest and drink plenty of fluids. Take Paracetamol for fever. Use steam inhalation for congestion. Visit a clinic if symptoms persist beyond 7 days or worsen.",
    icon: "🤧",
  },
  {
    name: "Pneumonia",
    symptoms: [
      "chest pain",
      "cough",
      "fever",
      "difficulty breathing",
      "fatigue",
      "sweating",
      "chills",
      "shortness of breath",
    ],
    severity: "HIGH",
    immediateAction:
      "Go to a health facility URGENTLY. Pneumonia can be life-threatening. You will need a chest X-ray and antibiotics. Do not delay — especially for children and elderly.",
    icon: "🫁",
  },
  {
    name: "Diarrheal Disease",
    symptoms: [
      "diarrhea",
      "stomach cramps",
      "nausea",
      "vomiting",
      "dehydration",
      "fever",
      "bloating",
    ],
    severity: "MEDIUM",
    immediateAction:
      "Start Oral Rehydration Solution (ORS) immediately — mix 1 litre water with 6 teaspoons sugar and half teaspoon salt. Visit a clinic if blood appears in stool or symptoms persist beyond 2 days.",
    icon: "💊",
  },
  {
    name: "Hypertension (High Blood Pressure)",
    symptoms: [
      "headache",
      "dizziness",
      "blurred vision",
      "chest pain",
      "shortness of breath",
      "nosebleed",
      "fatigue",
    ],
    severity: "HIGH",
    immediateAction:
      "Visit a health facility for a blood pressure check. Avoid salty foods and stress. If you experience sudden severe headache or chest pain, go to the emergency unit immediately.",
    icon: "❤️",
  },
  {
    name: "Diabetes (Type 2)",
    symptoms: [
      "frequent urination",
      "excessive thirst",
      "fatigue",
      "blurred vision",
      "slow healing wounds",
      "weight loss",
      "numbness",
    ],
    severity: "HIGH",
    immediateAction:
      "Visit a health facility for blood glucose testing. Avoid sugary foods and drinks. If already diagnosed, ensure you take your medication consistently. Seek emergency care for confusion or unconsciousness.",
    icon: "🩸",
  },
  {
    name: "Urinary Tract Infection (UTI)",
    symptoms: [
      "burning urination",
      "frequent urination",
      "lower abdominal pain",
      "cloudy urine",
      "fever",
      "back pain",
    ],
    severity: "MEDIUM",
    immediateAction:
      "Drink plenty of water. Visit a clinic for a urine test and antibiotics prescription (usually Trimethoprim or Nitrofurantoin). Do not ignore — untreated UTI can spread to kidneys.",
    icon: "🔬",
  },
  {
    name: "Cholera",
    symptoms: [
      "profuse watery diarrhea",
      "vomiting",
      "dehydration",
      "muscle cramps",
      "rapid heart rate",
      "dry mouth",
    ],
    severity: "CRITICAL",
    immediateAction:
      "EMERGENCY — Go to the nearest health facility IMMEDIATELY. Start ORS aggressively. Cholera can cause death within hours from dehydration. Avoid sharing water or utensils.",
    icon: "🚨",
  },
  {
    name: "Tuberculosis (TB)",
    symptoms: [
      "persistent cough",
      "coughing blood",
      "night sweats",
      "weight loss",
      "fatigue",
      "fever",
      "chest pain",
      "loss of appetite",
    ],
    severity: "HIGH",
    immediateAction:
      "Visit a health facility for a sputum test immediately. TB is curable with a 6-month drug course (DOTS program — free in Kenya). Wear a mask and avoid crowded areas until tested.",
    icon: "🫀",
  },
  {
    name: "Anaemia",
    symptoms: [
      "fatigue",
      "weakness",
      "pale skin",
      "dizziness",
      "shortness of breath",
      "cold hands",
      "headache",
      "chest pain",
    ],
    severity: "MEDIUM",
    immediateAction:
      "Visit a clinic for a full blood count (FBC) test. Eat iron-rich foods — spinach, liver, beans, red meat. Take iron supplements only as prescribed. Severe anaemia may need transfusion.",
    icon: "🩺",
  },
  {
    name: "Meningitis",
    symptoms: [
      "severe headache",
      "stiff neck",
      "fever",
      "vomiting",
      "sensitivity to light",
      "confusion",
      "seizures",
      "rash",
    ],
    severity: "CRITICAL",
    immediateAction:
      "EMERGENCY — Go to hospital IMMEDIATELY. Bacterial meningitis can cause death or permanent disability within 24 hours. Do not wait. This requires IV antibiotics urgently.",
    icon: "🧠",
  },
];

export function diagnose(selectedSymptoms) {
  if (!selectedSymptoms.length) return [];
  const lower = selectedSymptoms.map((s) => s.toLowerCase());
  const scored = CONDITIONS.map((condition) => {
    const matches = condition.symptoms.filter((s) => lower.includes(s));
    const score = matches.length / condition.symptoms.length;
    return {
      ...condition,
      matchCount: matches.length,
      score,
      matchedSymptoms: matches,
    };
  });
  return scored
    .filter((c) => c.matchCount >= 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export const ALL_SYMPTOMS = [
  "fever",
  "chills",
  "headache",
  "sweating",
  "nausea",
  "vomiting",
  "muscle pain",
  "fatigue",
  "stomach pain",
  "diarrhea",
  "constipation",
  "weakness",
  "rash",
  "loss of appetite",
  "runny nose",
  "sneezing",
  "sore throat",
  "cough",
  "congestion",
  "chest pain",
  "difficulty breathing",
  "shortness of breath",
  "dehydration",
  "bloating",
  "stomach cramps",
  "dizziness",
  "blurred vision",
  "nosebleed",
  "frequent urination",
  "excessive thirst",
  "slow healing wounds",
  "weight loss",
  "numbness",
  "burning urination",
  "lower abdominal pain",
  "cloudy urine",
  "back pain",
  "muscle cramps",
  "rapid heart rate",
  "dry mouth",
  "persistent cough",
  "coughing blood",
  "night sweats",
  "pale skin",
  "cold hands",
  "stiff neck",
  "sensitivity to light",
  "confusion",
  "seizures",
  "profuse watery diarrhea",
  "severe headache",
  "mild fever",
];
