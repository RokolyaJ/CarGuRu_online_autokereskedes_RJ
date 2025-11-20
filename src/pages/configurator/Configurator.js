import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Configurator() {
  const [brands, setBrands] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://carguru.up.railway.app/api/brands")

      .then((res) => {
        setBrands(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Hiba a márkák lekérésekor:", err);
        setError("Nem sikerült betölteni a márkákat.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={styles.loading}>Betöltés...</p>;
  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Autó Konfigurátor</h1>
      <h2 style={styles.subtitle}>Válassz márkát:</h2>

      <div style={styles.grid}>
        {brands.map((b, index) => (
          <div
            key={b.id}
            style={{
              ...styles.card,
              transform: hoveredIndex === index ? "scale(1.1)" : "scale(1)",
              boxShadow:
                hoveredIndex === index
                  ? "0 8px 20px rgba(0,0,0,0.2)"
                  : "0 4px 10px rgba(0,0,0,0.1)",
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => navigate(`/configurator/${b.name.toLowerCase()}`)}
          >
            <img src={b.logoUrl} alt={b.name} style={styles.brandLogo} />
            <div style={styles.brandName}>{b.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "960px",
    margin: "0 auto",
    padding: "40px",
    textAlign: "center",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "30px",
  },
  grid: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
  },
  card: {
    background: "#f1f1f1",
    padding: "24px",
    borderRadius: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease-in-out",
    width: "140px",
    textAlign: "center",
  },
  brandLogo: {
    width: "100px",
    height: "100px",
    objectFit: "contain",
    marginBottom: "8px",
  },
  brandName: {
    fontWeight: "bold",
    fontSize: "16px",
  },
  loading: {
    textAlign: "center",
    fontSize: "18px",
    marginTop: "100px",
  },
  error: {
    color: "red",
    textAlign: "center",
    fontSize: "18px",
    marginTop: "100px",
  },
};

export default Configurator;
