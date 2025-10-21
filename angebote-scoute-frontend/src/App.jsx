import { useState } from "react";

function App() {
  const [product, setProduct] = useState("");
  const [results, setResults] = useState([]);
  const [email, setEmail] = useState("");
  const [alertMsg, setAlertMsg] = useState("");

  const API_URL = "https://angebote-scout-backend.onrender.com";

  const handleSearch = async () => {
    const res = await fetch(`${API_URL}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product }),
    });
    const data = await res.json();
    setResults(data.results || []);
  };

  const handleAlert = async () => {
    const res = await fetch(`${API_URL}/alert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product, email }),
    });
    const data = await res.json();
    setAlertMsg(data.message);
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">🛒 Angebote-Scout</h1>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="Produkt eingeben..."
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Suchen
        </button>
      </div>

      {results.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold">Ergebnisse:</h2>
          <ul className="mt-2 space-y-2">
            {results.map((r, i) => (
              <li key={i} className="border p-2 rounded">
                🏪 <b>{r.store}</b> – {r.product} – 💶 {r.price} – 📅 gültig ab{" "}
                {r.valid_from}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold">🔔 Preisalarm setzen</h2>
        <input
          type="email"
          placeholder="E-Mail-Adresse"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />
        <button
          onClick={handleAlert}
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Alarm aktivieren
        </button>
        {alertMsg && <p className="text-green-700 mt-2">{alertMsg}</p>}
      </div>
    </div>
  );
}

export default App;
