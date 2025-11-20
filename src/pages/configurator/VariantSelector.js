import React, { useEffect, useRef, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ConfigContext } from "../../context/ConfigContext";

function VariantSelector() {
  const { brand, model } = useParams();
  const navigate = useNavigate();

  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);
  const [showArrows, setShowArrows] = useState(false);
  const scrollRef = useRef(null);

  const { setSelectedVariant } = useContext(ConfigContext);

  const getToken = () => {
    const candidates = [
      localStorage.getItem("token"),
      localStorage.getItem("auth"),
      localStorage.getItem("user"),
      sessionStorage.getItem("token"),
      sessionStorage.getItem("auth"),
      sessionStorage.getItem("user"),
    ].filter(Boolean);

    for (const raw of candidates) {
      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed === "string") return parsed;
        if (parsed?.token) return parsed.token;
        if (parsed?.accessToken) return parsed.accessToken;
      } catch {
        return raw;
      }
    }
    return null;
  };

  useEffect(() => {
    if (!model) return;

    const token = getToken();
    if (!token) {
      setLoading(false);
      setErrorMsg("Nincs jogosultság. Jelentkezz be újra.");
      console.error("Hiányzik a JWT token a storage-ból.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    axios.get(`https://carguru.up.railway.app/api/variants/by-model/${model}`, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }
})
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setVariants(list);
      })
      .catch((err) => {
        if (err.response) {
          const { status, statusText } = err.response;
          console.error("API hiba:", status, statusText, err.response.data);
          if (status === 401 || status === 403) {
            setErrorMsg("Nincs jogosultság. Jelentkezz be újra.");
          } else {
            setErrorMsg("Hiba történt a változatok lekérése közben.");
          }
        } else {
          console.error("Hálózati hiba:", err.message);
          setErrorMsg("Hálózati hiba történt.");
        }
      })
      .finally(() => setLoading(false));
  }, [model]);

  const scroll = (direction) => {
    const scrollAmount = 320;
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    if (selectedVariantIndex === null) return;
    const selected = variants[selectedVariantIndex];

    setSelectedVariant(selected);

    navigate(`/configurator/${brand}/${model}/${selected.id}/engine`);
  };

  return (
    <div
      style={styles.container}
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <h1 style={styles.title}>Változat választó</h1>
      <h2 style={styles.subtitle}>{brand?.toUpperCase() || "MÁRKA"}</h2>

      {loading && <p>Betöltés…</p>}
      {!loading && errorMsg && <p style={{ color: "#c00" }}>{errorMsg}</p>}

      {!loading && !errorMsg && variants.length === 0 ? (
        <p style={styles.noVariants}>
          Nincsenek elérhető változatok ehhez a modellhez.
        </p>
      ) : null}

      {!loading && !errorMsg && variants.length > 0 && (
        <>
          <div style={styles.carouselWrapper}>
            {showArrows && (
              <button
                style={{ ...styles.arrow, ...styles.left }}
                onClick={() => scroll("left")}
              >
                <span style={styles.arrowIcon}>❮</span>
              </button>
            )}

            <div style={styles.carousel} ref={scrollRef}>
              {variants.map((variant, index) => (
                <div
                  key={variant.id}
                  style={{
                    ...styles.variantCard,
                    border:
                      selectedVariantIndex === index
                        ? "2px solid #007bff"
                        : "1px solid #ccc",
                  }}
                  onClick={() => setSelectedVariantIndex(index)}
                  tabIndex={0}
                  onFocus={(e) => (e.currentTarget.style.outline = "none")}
                >
                  <img
                    src={variant.imageUrl || "/images/default-car.png"}
                    alt={variant.name}
                    style={styles.image}
                  />
                  <h3 style={styles.variantName}>{variant.name}</h3>

                  {variant.price !== null && variant.price !== undefined && (
                    <p style={styles.price}>
                      {Number(variant.price).toLocaleString("hu-HU")} Ft
                    </p>
                  )}

                  <div style={styles.details}>
                    {Array.isArray(variant.fuels) && variant.fuels.length > 0 ? (
                      <p>
                        <strong>Üzemanyag:</strong>{" "}
                        {variant.fuels.join(" / ")}
                      </p>
                    ) : (
                      <p>
                        <strong>Üzemanyag:</strong> Ismeretlen
                      </p>
                    )}

                    {variant.power && (
                      <p>
                        <strong>Motor:</strong> {variant.power}
                      </p>
                    )}
                    {variant.drive && (
                      <p>
                        <strong>Hajtás:</strong> {variant.drive}
                      </p>
                    )}
                    {variant.range && (
                      <p>
                        <strong>Hatótáv:</strong> {variant.range} km
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {showArrows && (
              <button
                style={{ ...styles.arrow, ...styles.right }}
                onClick={() => scroll("right")}
              >
                <span style={styles.arrowIcon}>❯</span>
              </button>
            )}
          </div>

          {selectedVariantIndex !== null && (
            <div style={styles.footerBar}>
              <div style={styles.footerLeft}>
                <span style={styles.footerTitle}>
                  {brand.charAt(0).toUpperCase() + brand.slice(1)}{" "}
                  {variants[selectedVariantIndex].name}
                </span>
              </div>
              <div style={styles.footerCenter}>
                <span style={styles.footerSubtitle}>
                  Teljes ajánlott kiskereskedelmi ár
                </span>
                <div style={styles.footerPrice}>
                  {Number(
                    variants[selectedVariantIndex].price
                  ).toLocaleString("hu-HU")}{" "}
                  Ft-tól
                </div>
              </div>
              <div style={styles.footerRight}>
                <button style={styles.footerButtonOutline}>
                  Összehasonlítás
                </button>
                <button style={styles.footerButton} onClick={handleNext}>
                  Tovább
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "100%",
    margin: "0 auto",
    padding: "140px 20px 100px",
    textAlign: "center",
    position: "relative",
  },
  title: { fontSize: "36px", fontWeight: "bold", marginBottom: "10px" },
  subtitle: { fontSize: "24px", fontWeight: "bold", marginBottom: "30px" },
  noVariants: { fontSize: "18px", color: "#888", marginTop: "20px" },
  carouselWrapper: { position: "relative", overflow: "hidden" },
  carousel: {
    display: "flex",
    gap: "24px",
    overflowX: "auto",
    scrollBehavior: "smooth",
    paddingBottom: "20px",
  },
  variantCard: {
    flex: "0 0 280px",
    background: "#f9f9f9",
    borderRadius: "16px",
    padding: "20px",
    cursor: "pointer",
    transition: "transform 0.2s ease-in-out",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    outline: "none",
  },
  image: { width: "100%", height: "auto", marginBottom: "15px" },
  variantName: { fontSize: "20px", fontWeight: "bold", marginBottom: "8px" },
  price: { fontSize: "16px", marginBottom: "12px" },
  details: { fontSize: "14px", color: "#555", textAlign: "left" },
  arrow: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "#d1fce2",
    color: "#000",
    border: "2px solid #b6f0cf",
    borderRadius: "8px",
    padding: "6px 12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    cursor: "pointer",
    zIndex: 2,
    transition: "background-color 0.2s ease",
  },
  left: { left: "10px" },
  right: { right: "10px" },
  arrowIcon: { fontSize: "24px", fontWeight: "bold" },
  footerBar: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100vw",
    backgroundColor: "#003d2c",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    fontSize: "18px",
    boxSizing: "border-box",
    zIndex: 10,
  },
  footerLeft: { fontWeight: "bold" },
  footerCenter: { textAlign: "center" },
  footerTitle: { fontWeight: "bold" },
  footerSubtitle: { fontSize: "14px", opacity: 0.8 },
  footerPrice: { fontSize: "20px", fontWeight: "bold" },
  footerRight: { display: "flex", gap: "15px" },
  footerButtonOutline: {
    backgroundColor: "#fff",
    color: "#003d2c",
    border: "2px solid white",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  footerButton: {
    backgroundColor: "#28f5a1",
    color: "#000",
    border: "none",
    padding: "8px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default VariantSelector;
