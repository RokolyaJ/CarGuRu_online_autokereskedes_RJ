import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ConfigContext } from "../../context/ConfigContext";

function Equipment() {
  const { brand, model } = useParams(); 
  const location = useLocation();
  const navigate = useNavigate();

  const [equipmentList, setEquipmentList] = useState([]);
  const [selected, setSelected] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [appearanceImage, setAppearanceImage] = useState(null);

  const { setSelectedEquipment, setSelectedAppearance } = useContext(ConfigContext);

  const preferredOrder = [
    "Akció",
    "Belső",
    "Komfort és funkció",
    "Biztonság és technika",
    "Infotainment",
    "Tartozék"
  ];

  useEffect(() => {
    if (location.state?.selectedAppearance?.imageUrl) {
      setAppearanceImage(location.state.selectedAppearance.imageUrl);
      setSelectedAppearance(location.state.selectedAppearance);
    }

    const getBrandId = (brandName) => {
      switch (brandName.toLowerCase()) {
        case "skoda": return 1;
        case "audi": return 2;
        case "bmw": return 3;
        default: return 1;
      }
    };

    axios
      .get(`http://localhost:8080/api/equipment/brand/${getBrandId(brand)}`)
      .then((res) => {
        setEquipmentList(res.data);
        const availableCategories = [...new Set(res.data.map((e) => e.category))];
        const defaultCategory = preferredOrder.find((cat) =>
          availableCategories.includes(cat)
        ) || availableCategories[0];
        setActiveCategory(defaultCategory);
      })
      .catch((err) => console.error("Hiba a felszerelések lekérésekor:", err));
  }, [brand, location.state, setSelectedAppearance]);

  const toggleSelection = (item) => {
    if (selected.find((sel) => sel.id === item.id)) {
      setSelected(selected.filter((sel) => sel.id !== item.id));
    } else {
      setSelected([...selected, item]);
    }
  };

  const totalPrice = selected.reduce((sum, item) => sum + item.price, 0);

  const handleNext = () => {
    setSelectedEquipment(selected);
    navigate(`/configurator/${brand}/${model}/summary`);
  };

  const categories = [...new Set(equipmentList.map((e) => e.category))].sort((a, b) => {
    const indexA = preferredOrder.indexOf(a);
    const indexB = preferredOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <div style={styles.container}>
      {appearanceImage && (
        <div style={styles.imageWrapper}>
          <img
            src={appearanceImage}
            alt="Autó"
            style={styles.image}
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>
      )}

      <div style={styles.rightSide}>
        <div style={styles.tabBar}>
          {categories.map((category) => (
            <button
              key={category}
              style={{
                ...styles.tab,
                borderBottom: activeCategory === category ? "3px solid #28f5a1" : "none",
                color: activeCategory === category ? "#000" : "#777",
              }}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <h2 style={styles.sectionTitle}>{activeCategory}</h2>
        <div style={styles.grid}>
          {equipmentList
            .filter((e) => e.category === activeCategory)
            .map((item) => {
              const isSelected = selected.find((s) => s.id === item.id);
              return (
                <div
                  key={item.id}
                  style={{
                    ...styles.card,
                    border: isSelected ? "2px solid #28f5a1" : "1px solid #ccc",
                  }}
                >
                  <h3>{item.name}</h3>
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={styles.cardImage}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  )}
                  {item.description && <p>{item.description}</p>}
                  <p style={styles.price}>{item.price.toLocaleString()} Ft</p>
                  <button
                    style={{
                      ...styles.button,
                      backgroundColor: isSelected ? "#28f5a1" : "#fff",
                      color: isSelected ? "#000" : "#333",
                      border: "1px solid #28f5a1",
                    }}
                    onClick={() => toggleSelection(item)}
                  >
                    {isSelected ? "Kiválasztva" : "Kiválasztás"}
                  </button>
                </div>
              );
            })}
        </div>
      </div>

      <div style={styles.footer}>
        <div>
          <strong>Összesen:</strong> {totalPrice.toLocaleString()} Ft
        </div>
        <button style={styles.footerButton} onClick={handleNext}>
          Tovább
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "120px 20px 160px",
    maxWidth: "100%",
    display: "flex",
    flexDirection: "row",
    boxSizing: "border-box",
  },
  imageWrapper: {
    position: "fixed",
    left: "20px",
    top: "160px",
    width: "640px",
    maxHeight: "400px",
    zIndex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  rightSide: {
    marginLeft: "680px",
    flex: 1,
    paddingRight: "40px",
    boxSizing: "border-box",
  },
  tabBar: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
    overflowX: "auto",
    whiteSpace: "nowrap",
  },
  tab: {
    fontWeight: "bold",
    fontSize: "16px",
    paddingBottom: "6px",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  sectionTitle: {
    fontSize: "28px",
    margin: "20px 0",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "24px",
  },
  card: {
    background: "#f9f9f9",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    textAlign: "center",
  },
  cardImage: {
    width: "100%",
    maxHeight: "160px",
    objectFit: "cover",
    margin: "10px 0",
    borderRadius: "8px",
  },
  price: {
    fontSize: "16px",
    margin: "10px 0",
  },
  button: {
    padding: "8px 14px",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  footer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#003d2c",
    color: "#fff",
    padding: "20px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "16px",
    zIndex: 100,
    boxSizing: "border-box",
  },
  footerButton: {
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

export default Equipment;
