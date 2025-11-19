import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function TestDriveBrandSelect() {
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/brands")
      .then(res => res.json())
      .then(data => setBrands(data))
      .catch(err => console.error("Hiba a márkák betöltésekor:", err));
  }, []);

  return (
    <div style={{
      textAlign: "center",
      padding: "40px",
      backgroundColor: "#f7f7f7",
      minHeight: "100vh"
    }}>
      <h1 style={{ fontSize: "2.5rem", color: "#007000", marginBottom: "30px" }}>
        VÁLASSZON MÁRKÁT TESZTVEZETÉSHEZ
      </h1>

      <div style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "40px"
      }}>
        {brands.map((b) => (
          <div
            key={b.id}
            onClick={() => navigate(`/test-drive/${b.name.toLowerCase()}`)}
            style={{
              width: "200px",
              border: "2px solid #ccc",
              borderRadius: "12px",
              padding: "20px",
              background: "#fff",
              cursor: "pointer",
              transition: "0.3s ease",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1.0)"}
          >
            <img
              src={b.logoUrl || "/images/default-logo.png"}
              alt={b.name}
              style={{ width: "100%", height: "100px", objectFit: "contain" }}
            />
            <h3 style={{ marginTop: "15px", fontSize: "1.3rem", color: "#333" }}>
              {b.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestDriveBrandSelect;
