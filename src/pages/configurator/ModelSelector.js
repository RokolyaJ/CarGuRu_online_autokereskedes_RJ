import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ConfigContext } from "../../context/ConfigContext";

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

function ModelSelector() {
  const { brand } = useParams();
  const navigate = useNavigate();
  const [models, setModels] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const { setSelectedModel } = useContext(ConfigContext);

  useEffect(() => {
    axios.get(`https://carguru.up.railway.app/api/models/by-brand/${brand}`)

      .then((res) => setModels(res.data))
      .catch((err) => console.error("Hiba a modellek lekérésekor:", err));
  }, [brand]);

  const handleModelClick = (model) => {
    setSelectedModel(model);
    navigate(`/configurator/${brand}/${slugify(model.name)}`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Autó Konfigurátor</h1>
      <h2 style={styles.subtitle}>
        Válassz modellt a(z) {brand.charAt(0).toUpperCase() + brand.slice(1)} márkához:
      </h2>

      <div style={styles.grid}>
        {models.map((model, index) => (
          <div
            key={model.id}
            style={{
              ...styles.modelCard,
              transform: hoveredIndex === index ? "scale(1.1)" : "scale(1)",
              boxShadow:
                hoveredIndex === index
                  ? "0 8px 20px rgba(0,0,0,0.2)"
                  : "0 4px 10px rgba(0,0,0,0.1)",
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => handleModelClick(model)}
          >
            {model.imageUrl && (
              <img
                src={model.imageUrl}
                alt={model.name}
                style={styles.image}
              />
            )}
            <div style={styles.modelName}>{model.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px",
    textAlign: "center",
  },
  title: {
    fontSize: "36px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "30px",
  },
  grid: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    flexWrap: "wrap",
  },
  modelCard: {
    background: "#f9f9f9",
    padding: "30px",
    borderRadius: "16px",
    width: "260px",
    cursor: "pointer",
    transition: "all 0.3s ease-in-out",
  },
  image: {
    width: "100%",
    height: "auto",
    marginBottom: "15px",
    borderRadius: "8px",
    objectFit: "cover",
  },
  modelName: {
    fontWeight: "bold",
    fontSize: "20px",
  },
};

export default ModelSelector;
