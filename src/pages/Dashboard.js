import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [vin, setVin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!vin || vin.length !== 17) {
      setError("Kérjük, adjon meg egy 17 karakteres VIN számot!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/purchases/${vin}`);
      if (!response.ok) throw new Error("Nem található jármű ezzel a VIN-nel.");
      const result = await response.json();

      navigate("/vehicle-details", { state: { data: result } });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>Jármű hozzáadása</h1>
      <p>A folytatáshoz szüksége lesz az alvázszámra (VIN) és a regisztráció országára/régiójára.</p>

      <div style={{ marginTop: "20px" }}>
        <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>Gépjármű azonosító szám*</label>
        <input
          type="text"
          value={vin}
          onChange={(e) => setVin(e.target.value)}
          placeholder="Kérjük, adja meg a 17 jegyű számot!"
          style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>Forgalomba helyezés országa/régiója</label>
        <select
          defaultValue="Magyarország"
          style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
        >
          <option>Magyarország</option>
        </select>
      </div>

      <button
        onClick={handleSearch}
        disabled={loading}
        style={{
          marginTop: "30px",
          padding: "12px 30px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        {loading ? "Keresés..." : "Tovább"}
      </button>

      {error && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}
    </div>
  );
}
