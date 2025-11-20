import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function BrandModels() {
  const { brandName } = useParams();
  const navigate = useNavigate();
  const [variants, setVariants] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("A");
  const [selectedType, setSelectedType] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const [priceRange, setPriceRange] = useState([0, 0]);
  const [selectedPrice, setSelectedPrice] = useState([0, 0]);
  const [selectedFuel, setSelectedFuel] = useState(null);

  const categories = ["A", "S", "Q", "RS", "Etron"];

  useEffect(() => {
    const mq = window.matchMedia
      ? window.matchMedia("(prefers-color-scheme: dark)")
      : null;

    const detectDark = () => {
      const docEl = document.documentElement;
      const body = document.body;

      const hasDarkClass =
        body.classList.contains("dark") ||
        body.classList.contains("dark-mode") ||
        docEl.classList.contains("dark") ||
        docEl.classList.contains("dark-mode");

      const hasDarkAttr =
        body.getAttribute("data-theme") === "dark" ||
        docEl.getAttribute("data-theme") === "dark";

      const stored =
        localStorage.getItem("theme") ||
        localStorage.getItem("color-theme") ||
        localStorage.getItem("darkMode");

      const hasStoredDark =
        stored === "dark" || stored === "true" || stored === "1";

      const explicitKnown =
        hasDarkClass || hasDarkAttr || stored !== null;

      const systemPrefersDark = mq ? mq.matches : false;

      return explicitKnown
        ? hasDarkClass || hasDarkAttr || hasStoredDark
        : systemPrefersDark;
    };

    const update = () => setDarkMode(detectDark());
    update();

    const obsBody = new MutationObserver(update);
    const obsHtml = new MutationObserver(update);

    obsBody.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    obsHtml.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    const onStorage = () => update();
    window.addEventListener("storage", onStorage);

    const onMq = mq ? () => update() : null;
    if (mq && mq.addEventListener) mq.addEventListener("change", onMq);

    return () => {
      obsBody.disconnect();
      obsHtml.disconnect();
      window.removeEventListener("storage", onStorage);
      if (mq && mq.removeEventListener) mq.removeEventListener("change", onMq);
    };
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#121212" : "#f4f5f7";
    document.documentElement.style.backgroundColor = darkMode ? "#121212" : "#f4f5f7";
  }, [darkMode]);

  useEffect(() => {
    fetchVariants(selectedCategory, selectedType);
  }, [brandName, selectedCategory, selectedType]);

  const fetchVariants = (category, type) => {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (type) params.append("type", type);

const url = `https://carguru.up.railway.app/api/variants/by-brand/${brandName}${params.toString() ? `?${params.toString()}` : ""}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log("Betöltött variánsok:", data);
        setVariants(data);

        if (data.length > 0) {
          const prices = data.map((v) => v.price || 0);
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          setPriceRange([min, max]);
          setSelectedPrice([min, max]);
        } else {
          setPriceRange([0, 0]);
          setSelectedPrice([0, 0]);
        }
      })
      .catch((err) => console.error("Hiba a variánsok betöltésekor:", err));
  };

  const groupByModel = (list) => {
    const grouped = {};
    list.forEach((v) => {
      const modelMatch = v.name?.match(/^[A-Z]+\d+/i);
      const model = modelMatch ? modelMatch[0] : "Egyéb";
      if (!grouped[model]) grouped[model] = [];
      grouped[model].push(v);
    });
    return grouped;
  };

  const filteredVariants = variants
    .filter((v) => (selectedType ? v.carType === selectedType : true))
    .filter((v) =>
      selectedFuel
        ? (v.fuels ? v.fuels.includes(selectedFuel) : v.fuel === selectedFuel)
        : true
    )
    .filter(
      (v) =>
        (v.price || 0) >= selectedPrice[0] &&
        (v.price || 0) <= selectedPrice[1]
    );

  filteredVariants.sort((a, b) => (a.price || 0) - (b.price || 0));

  const groupedVariants = groupByModel(filteredVariants);

  const availableTypes = [...new Set(variants.map((v) => v.carType))].filter(Boolean);
  const availableFuels = [
    ...new Set(
      variants.flatMap((v) =>
        v.fuels && v.fuels.length > 0 ? v.fuels : v.fuel ? [v.fuel] : []
      )
    ),
  ];

  const styles = {
    page: {
      display: "flex",
      padding: "40px 5%",
      minHeight: "100vh",
      color: darkMode ? "#eaeaea" : "#111",
      transition: "background-color .25s ease, color .25s ease",
    },
    mainContent: {
      marginLeft: "260px",
      width: "100%",
      paddingRight: "20px",
      paddingTop: "60px",
    },
    heading: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "10px",
      color: darkMode ? "#fff" : "#000",
    },
    subheading: {
      fontSize: "1.1rem",
      color: darkMode ? "#b8b8b8" : "#555",
      textAlign: "center",
      marginBottom: "20px",
    },
    categoryBar: {
      display: "flex",
      justifyContent: "center",
      gap: "15px",
      flexWrap: "wrap",
      position: "sticky",
      top: "100px",
      marginBottom: "40px",
      zIndex: 1000,
    },
    categoryBtn: (active) => ({
      padding: "12px 30px",
      border: active ? "2px solid #000" : "1px solid #ccc",
      background: active ? "#e0e0e0" : "#fff",
      color: "#000",
      borderRadius: "6px",
      fontSize: "1.1rem",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "all 0.25s",
      minWidth: "90px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    }),
    sidebar: {
      width: "240px",
      backgroundColor: darkMode ? "#1b1b1b" : "#fff",
      padding: "15px",
      borderRadius: "12px",
      boxShadow: darkMode
        ? "0 4px 12px rgba(255,255,255,0.06)"
        : "0 4px 12px rgba(0,0,0,0.1)",
      position: "fixed",
      top: "80px",
      left: "40px",
      bottom: "20px",
      overflowY: "auto",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
    },
    sectionTitle: {
      fontSize: "1.2rem",
      fontWeight: "bold",
      margin: "20px 0 10px",
      color: darkMode ? "#fff" : "#000",
    },
    filterBtn: (active) => ({
      width: "100%",
      padding: "12px 16px",
      border: active
        ? `2px solid ${darkMode ? "#fff" : "#000"}`
        : `2px solid ${darkMode ? "#4a4a4a" : "#ccc"}`,
      background: active
        ? darkMode
          ? "#fff"
          : "#000"
        : darkMode
        ? "#2a2a2a"
        : "#fff",
      color: active ? "#000" : darkMode ? "#eaeaea" : "#000",
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: "bold",
      marginBottom: "10px",
      cursor: "pointer",
      transition: "all 0.25s",
    }),
    rangeInput: { width: "100%", margin: "10px 0" },
    modelsWrapper: {
      display: "flex",
      flexDirection: "column",
      gap: "60px",
    },
    modelSection: { marginBottom: "40px" },
    modelTitle: {
      fontSize: "3rem",
      fontWeight: "900",
      marginBottom: "25px",
      borderBottom: `3px solid ${darkMode ? "#fff" : "#000"}`,
      display: "inline-block",
      paddingBottom: "5px",
      color: darkMode ? "#fff" : "#000",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "25px",
    },
    card: {
      background: darkMode ? "#1b1b1b" : "#fff",
      borderRadius: "12px",
      boxShadow: darkMode
        ? "0 4px 12px rgba(255,255,255,0.06)"
        : "0 4px 12px rgba(0,0,0,0.1)",
      padding: "20px",
      textAlign: "center",
      transition: "background-color .25s ease, box-shadow .25s ease",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    image: {
      width: "100%",
      height: "180px",
      objectFit: "contain",
      marginBottom: "15px",
    },
    name: {
      fontSize: "1.3rem",
      fontWeight: "bold",
      marginBottom: "10px",
      color: darkMode ? "#fff" : "#000",
    },
    info: {
      color: darkMode ? "#b8b8b8" : "#777",
      marginBottom: "6px",
      fontSize: "0.95rem",
    },
    price: {
      fontWeight: "bold",
      fontSize: "1.1rem",
      margin: "10px 0",
      color: darkMode ? "#fff" : "#000",
    },
    buttonGroup: {
      display: "flex",
      justifyContent: "space-between",
      gap: "10px",
      marginTop: "15px",
      flexWrap: "wrap",
    },
    button: {
      flex: "1",
      padding: "10px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "0.2s",
    },
    primaryBtn: { background: "#0070f3", color: "#fff" },
    secondaryBtn: { background: "#eee", color: "#000" },
  };

  return (
    <div style={styles.page}>
      <div style={styles.sidebar} className="sidebar">
        <div style={styles.sectionTitle}>Gépkocsitípus</div>
        {availableTypes.map((type) => (
          <button
            key={type}
            style={styles.filterBtn(selectedType === type)}
            onClick={() =>
              setSelectedType(selectedType === type ? null : type)
            }
          >
            {type}
          </button>
        ))}

        {priceRange[1] > 0 && (
          <>
            <div style={styles.sectionTitle}>Ár szűrő</div>
            <input
              type="range"
              min={priceRange[0]}
              max={priceRange[1]}
              value={selectedPrice[0]}
              onChange={(e) =>
                setSelectedPrice([Number(e.target.value), selectedPrice[1]])
              }
              style={styles.rangeInput}
            />
            <input
              type="range"
              min={priceRange[0]}
              max={priceRange[1]}
              value={selectedPrice[1]}
              onChange={(e) =>
                setSelectedPrice([selectedPrice[0], Number(e.target.value)])
              }
              style={styles.rangeInput}
            />
            <p>
              {selectedPrice[0].toLocaleString("hu-HU")} Ft –{" "}
              {selectedPrice[1].toLocaleString("hu-HU")} Ft
            </p>
          </>
        )}

        {availableFuels.length > 0 && (
          <>
            <div style={styles.sectionTitle}>Üzemanyag</div>
            {availableFuels.map((fuel) => (
              <button
                key={fuel}
                style={styles.filterBtn(selectedFuel === fuel)}
                onClick={() =>
                  setSelectedFuel(selectedFuel === fuel ? null : fuel)
                }
              >
                {fuel}
              </button>
            ))}
          </>
        )}
      </div>

      <div style={styles.mainContent}>
        <h1 style={styles.heading}>{brandName.toUpperCase()} modellek</h1>
        <p style={styles.subheading}>Válasszon kategóriát és gépkocsítípust.</p>

        <div style={styles.categoryBar}>
          {categories.map((cat) => (
            <button
              key={cat}
              style={styles.categoryBtn(selectedCategory === cat)}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedType(null);
                setSelectedFuel(null);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={styles.modelsWrapper}>
          {filteredVariants.length === 0 ? (
            <p>Nincs elérhető modell a választott szűrőkkel.</p>
          ) : (
            Object.entries(groupedVariants).map(([model, cars]) => (
              <div key={model} style={styles.modelSection}>
                <h2 style={styles.modelTitle}>{model}</h2>
                <div style={styles.grid}>
                  {cars.map((v) => (
                    <div key={v.id} style={styles.card}>
                      <div>
                        <img
                          src={v.imageUrl || "/images/default-car.png"}
                          alt={v.name}
                          style={styles.image}
                        />
                        <h3 style={styles.name}>{v.name}</h3>
                        {v.carType && (
                          <p style={styles.info}>Típus: {v.carType}</p>
                        )}
                        {v.fuels && v.fuels.length > 0 && (
                          <p style={styles.info}>
                            Üzemanyag: {v.fuels.join(" / ")}
                          </p>
                        )}
                        {v.power && (
                          <p style={styles.info}>Teljesítmény: {v.power}</p>
                        )}
                        {v.price !== null && v.price !== undefined ? (
                          <p style={styles.price}>
                            {Number(v.price).toLocaleString("hu-HU")} Ft -tól
                          </p>
                        ) : null}
                      </div>
                      <div style={styles.buttonGroup}>
                        <button
                          style={{ ...styles.button, ...styles.secondaryBtn }}
                          onClick={() => navigate(`/models/${v.id}/details`)}
                        >
                          Részletes információ
                        </button>
                        <button
                          style={{ ...styles.button, ...styles.secondaryBtn }}
                          onClick={() => {
                          if (v.availableVins && v.availableVins.length > 0) {
                            const vin = v.availableVins[0]; 
                            navigate(`/stock/${vin}`);
                          } else {
                            alert("Ehhez a modellhez nem található készleten jármű (VIN).");
                          }
                        }}


                        >
                          Készletről elérhető
                        </button>
                        <button
                          style={{ ...styles.button, ...styles.primaryBtn }}
                          onClick={() =>
                            navigate(
                              `/configurator/${brandName.toLowerCase()}/${model.toLowerCase()}/${v.id}/engine`
                            )
                          }
                        >
                          Konfiguráció
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default BrandModels;
