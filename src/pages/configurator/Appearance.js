import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ConfigContext } from "../../context/ConfigContext";

function Appearance() {
  const { brand, model, variantId } = useParams(); 
  const [appearances, setAppearances] = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const { setSelectedAppearance } = useContext(ConfigContext);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/appearance/variant/${variantId}`) 
      .then((res) => {
        const uniqueColors = [];
        const uniqueAppearances = res.data.filter((item) => {
          if (!uniqueColors.includes(item.color.toLowerCase())) {
            uniqueColors.push(item.color.toLowerCase());
            return true;
          }
          return false;
        });

        setAppearances(uniqueAppearances);
        if (uniqueAppearances.length > 0) {
          setSelected(uniqueAppearances[0]);
        }
      })
      .catch((err) => console.error("Hiba a megjelenések lekérésekor:", err));
  }, [variantId]);

  const handleNext = () => {
    if (selected) {
      setSelectedAppearance({
        color: selected.color,
        wheels: selected.wheel,
        interior: selected.interior,
        price: selected.price,
        imageUrl: selected.imageUrl,
      });
      navigate(`/configurator/${brand}/${model}/${variantId}/equipment`); 
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Megjelenés kiválasztása</h1>

      <div style={styles.content}>
        <div style={styles.imageWrapper}>
          {selected?.imageUrl ? (
            <img
              src={selected.imageUrl}
              alt={selected.color}
              style={styles.image}
              onError={(e) => {
                e.target.style.display = "none";
                console.error("Nem található kép:", selected.imageUrl);
              }}
            />
          ) : (
            <p>Nincs kép elérhető ehhez a megjelenéshez.</p>
          )}
        </div>

        <div style={styles.colorsGrid}>
          {appearances.map((item) => (
            <div
              key={item.id}
              style={{
                ...styles.colorCard,
                border:
                  selected?.id === item.id
                    ? "2px solid #28f5a1"
                    : "1px solid #ccc",
              }}
              onClick={() => setSelected(item)}
            >
              <div style={styles.colorCircleWrapper}>
                <div
                  style={{
                    ...styles.colorCircle,
                    backgroundColor: item.color.toLowerCase(),
                  }}
                ></div>
              </div>
              <div style={styles.colorName}>{item.color}</div>
              <div style={styles.colorPrice}>
                {item.price > 0
                  ? `${item.price.toLocaleString()} Ft`
                  : "Alap szín"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.footerBar}>
        <div>
          <strong>Választott szín:</strong> {selected ? selected.color : "–"}
        </div>
        <button style={styles.button} onClick={handleNext}>
          Tovább
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "100px 20px 160px",
  },
  title: {
    fontSize: "32px",
    marginBottom: "40px",
    textAlign: "center",
  },
  content: {
    display: "flex",
    gap: "60px",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexWrap: "nowrap",
  },
  imageWrapper: {
    position: "fixed",
    top: "120px",
    left: "40px",
    width: "600px",
    zIndex: 10,
  },
  image: {
    width: "100%",
    maxWidth: "100%",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  colorsGrid: {
    marginLeft: "700px",
    flex: "1 1 auto",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  colorCard: {
    padding: "16px",
    borderRadius: "10px",
    cursor: "pointer",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    textAlign: "center",
  },
  colorName: {
    fontWeight: "bold",
    textTransform: "capitalize",
    marginTop: "8px",
  },
  colorPrice: {
    fontSize: "14px",
    marginTop: "4px",
    color: "#555",
  },
  colorCircleWrapper: {
    display: "flex",
    justifyContent: "center",
  },
  colorCircle: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "1px solid #aaa",
  },
  footerBar: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#003d2c",
    color: "#fff",
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "16px",
    boxSizing: "border-box",
    zIndex: 100,
  },
  button: {
    backgroundColor: "#28f5a1",
    color: "#000",
    padding: "10px 28px",
    fontWeight: "bold",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Appearance;
