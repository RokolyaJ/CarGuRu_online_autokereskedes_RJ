import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VehicleDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.data;

  if (!data) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p>Nincs megjeleníthető adat. Kérjük, menjen vissza a kereséshez.</p>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Vissza
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>Jármű adatai</h1>
      <p><b>Márka:</b> {data.brand}</p>
      <p><b>Modell:</b> {data.model}</p>
      <p><b>Változat:</b> {data.variant}</p>
      <p><b>Motor:</b> {data.engine}</p>
      <p><b>Szín:</b> {data.color}</p>
      <p><b>Felszereltség:</b> {data.equipments}</p>
      <p><b>Ár:</b> {data.price} Ft</p>
      <p><b>Kereskedés:</b> {data.dealership}</p>
      <p><b>Vásárlás dátuma:</b> {data.purchaseDate}</p>
      <p><b>Vásárló neve:</b> {data.buyerName}</p>
    </div>
  );
}
