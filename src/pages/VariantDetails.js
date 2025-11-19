import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VariantDetails() {
  const { variantId } = useParams();
  const navigate = useNavigate();

  const [variant, setVariant] = useState(null);
  const [engines, setEngines] = useState([]);
  const [currentTech, setCurrentTech] = useState(0);
  const [exteriorImages, setExteriorImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [interiorImages, setInteriorImages] = useState([]);
  const [currentInteriorImage, setCurrentInteriorImage] = useState(0);
  const [activeTech, setActiveTech] = useState("driver");
  const [colorGalleries, setColorGalleries] = useState({});
  const [activeColor, setActiveColor] = useState(null);
  const [colorImages, setColorImages] = useState([]);
  const [colorIndex, setColorIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("exterior");
  const [activeSection, setActiveSection] = useState("exterior");
  const [showDots, setShowDots] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [vRes, eRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/variants/${variantId}`),
          axios.get(`http://localhost:8080/api/engines/by-variant/${variantId}`),
        ]);

        if (!cancelled) {
          const v = vRes.data;
          setVariant(v);
          setExteriorImages(
  typeof v.exteriorImages === "string"
    ? JSON.parse(v.exteriorImages)
    : Array.isArray(v.exteriorImages)
    ? v.exteriorImages
    : v.exteriorImageUrl
    ? [v.exteriorImageUrl]
    : []
);

          setInteriorImages(v.interiorImages || []);
          const cg = v.colorGalleries || {};
          setColorGalleries(cg);
          const firstColor = Object.keys(cg)[0] || null;
          setActiveColor(firstColor);
          setColorImages(firstColor ? cg[firstColor] || [] : []);
          setColorIndex(0);

          const uniqEngines = (eRes.data || []).filter(
            (eng, i, arr) =>
              i ===
              arr.findIndex(
                (x) =>
                  x.name === eng.name &&
                  x.fuelType === eng.fuelType &&
                  x.powerKw === eng.powerKw &&
                  x.powerHp === eng.powerHp
              )
          );
          setEngines(uniqEngines);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled)
          setErrorMsg("Nem sikerült betölteni a variáns adatait.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [variantId]);
  useEffect(() => {
    const handleScroll = () => {
      const backBtn = document.getElementById("back-btn");
      if (!backBtn) return;
      const rect = backBtn.getBoundingClientRect();
      setShowDots(rect.bottom < 0);
    };

    const sections = document.querySelectorAll("section");
    const updateActiveSection = () => {
      let current = "";
      sections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= 250 && rect.bottom >= 250) {
          current = sec.id;
        }
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("scroll", updateActiveSection);
    handleScroll();
    updateActiveSection();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", updateActiveSection);
    };
  }, []);
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % (exteriorImages.length || 1));
  };
  const prevImage = () => {
    setCurrentImage(
      (prev) =>
        (prev - 1 + (exteriorImages.length || 1)) % (exteriorImages.length || 1)
    );
  };
  const nextInteriorImage = () => {
    setCurrentInteriorImage(
      (prev) => (prev + 1) % (interiorImages.length || 1)
    );
  };
  const prevInteriorImage = () => {
    setCurrentInteriorImage(
      (prev) =>
        (prev - 1 + (interiorImages.length || 1)) %
        (interiorImages.length || 1)
    );
  };
  const nextColorImage = () => {
    setColorIndex((prev) => (prev + 1) % (colorImages.length || 1));
  };
  const prevColorImage = () => {
    setColorIndex(
      (prev) => (prev - 1 + (colorImages.length || 1)) % (colorImages.length || 1)
    );
  };
  const handlePickColor = (key) => {
    setActiveColor(key);
    const imgs = colorGalleries[key] || [];
    setColorImages(imgs);
    setColorIndex(0);
  };

  if (loading)
    return (
      <div style={styles.wrap}>
        <div style={styles.center}>Betöltés…</div>
      </div>
    );

  if (errorMsg || !variant)
    return (
      <div style={styles.wrap}>
        <div style={styles.center}>
          <p style={{ marginBottom: 12 }}>
            {errorMsg || "A variáns nem található."}
          </p>
          <button style={styles.button} onClick={() => navigate(-1)}>
            Vissza
          </button>
        </div>
      </div>
    );

  const fuelsText =
    Array.isArray(variant.fuels) && variant.fuels.length > 0
      ? variant.fuels.join(" / ")
      : "—";

  const colorKeys = Object.keys(colorGalleries || {});
  const hasColors = colorKeys.length > 0;

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.heroText}>
          <h1 style={styles.title}>{variant.name}</h1>
          <p style={styles.subtitle}>
            {variant.brand} {variant.model}
          </p>
          <div style={styles.priceBadge}>
            {variant.price != null
              ? `${Number(variant.price).toLocaleString("hu-HU")} Ft-tól`
              : "Nincs ár"}
          </div>
          <div style={styles.specRow}>
            <Spec label="Üzemanyag" value={fuelsText} />
            <Spec label="Hajtás" value={variant.drive || "—"} />
            <Spec label="Teljesítmény" value={variant.power || "—"} />
            <Spec label="Hatótáv" value={variant.range || "—"} />
          </div>
          <div style={{ marginTop: 16 }}>
            <button
              id="back-btn"
              style={styles.button}
              onClick={() => navigate(-1)}
            >
              Vissza
            </button>
          </div>
        </div>

        <div style={styles.heroImgBox}>
          <img
            alt={variant.name}
            src={variant.imageUrl || "/images/car-placeholder.png"}
            style={styles.heroImg}
          />
        </div>
      </div>

     
      {showDots && (
        <div style={styles.dotWrapper}>
          <div style={styles.dotLine}></div>
          <div style={styles.dotNav}>
            {["exterior", "interior", "tech", "gallery"].map((id) => (
              <a
                key={id}
                href={`#${id}`}
                style={{
                  ...styles.dot,
                  background:
                    activeSection === id
                      ? "radial-gradient(circle, #28f5a1 40%, rgba(40,245,161,0.3) 60%)"
                      : "transparent",
                  border:
                    activeSection === id
                      ? "2px solid #28f5a1"
                      : "2px solid #ccc",
                }}
              ></a>
            ))}
            <div style={styles.scrollHint}>
              <span style={styles.arrow}>↓</span>
              <div style={styles.scrollText}>Görgetés</div>
            </div>
          </div>
        </div>
      )}

      <div style={styles.sectionContainer}>
        <section id="exterior" style={styles.section}>
          <div style={styles.tabContainer}>
            <button
              onClick={() => setActiveTab("exterior")}
              style={{
                ...styles.tabButton,
                ...(activeTab === "exterior" ? styles.tabActive : {}),
              }}
            >
              Külső
            </button>
            <button
              onClick={() => setActiveTab("interior")}
              style={{
                ...styles.tabButton,
                ...(activeTab === "interior" ? styles.tabActive : {}),
              }}
            >
              Belső
            </button>
          </div>

          {activeTab === "exterior" ? (
            <>
              <h2 style={styles.h2}>Külső megjelenés</h2>
              <div style={styles.exteriorCard}>
                <div style={styles.exteriorText}>
                  <p style={styles.exteriorDescription}>
                    {variant.exteriorDescription ||
                      "Ehhez a modellhez még nincs külső leírás feltöltve."}
                  </p>
                </div>
                <div style={styles.carouselContainer}>
                  {exteriorImages.length > 0 ? (
                    <>
                      <button style={styles.arrowLeft} onClick={prevImage}>
                        ‹
                      </button>
                      <img
                        key={currentImage}
                        src={exteriorImages[currentImage]}
                        alt={`${variant.name} külső ${currentImage + 1}`}
                        style={styles.carouselImage}
                      />
                      <button style={styles.arrowRight} onClick={nextImage}>
                        ›
                      </button>
                    </>
                  ) : (
                    <p style={styles.p}>Nincsenek képek ehhez a modellhez.</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 style={styles.h2}>Belső tér</h2>
              <div style={styles.exteriorCard}>
                <div style={styles.exteriorText}>
                  <p style={styles.exteriorDescription}>
                    {variant.interiorDescription ||
                      "Ehhez a modellhez még nincs belső leírás feltöltve."}
                  </p>
                </div>

                <div style={styles.carouselContainer}>
                  {interiorImages.length > 0 ? (
                    <>
                      <button
                        style={styles.arrowLeft}
                        onClick={prevInteriorImage}
                      >
                        ‹
                      </button>
                      <img
                        key={currentInteriorImage}
                        src={interiorImages[currentInteriorImage]}
                        alt={`${variant.name} belső ${
                          currentInteriorImage + 1
                        }`}
                        style={styles.carouselImage}
                      />
                      <button
                        style={styles.arrowRight}
                        onClick={nextInteriorImage}
                      >
                        ›
                      </button>
                    </>
                  ) : (
                    <img
                      src={
                        variant.interiorImageUrl ||
                        "/images/interior-placeholder.jpg"
                      }
                      alt="Belső tér"
                      style={styles.carouselImage}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </section>
        <section id="tech" style={styles.section}>
          <h2 style={styles.techTitle}>Simply Clever-Technológia</h2>

          <div style={styles.techTabs}>
            {[
              { key: "driver", label: "Travel Assist" },
              { key: "safe", label: "Biztonsági asszisztensek" },
              { key: "matrix", label: "LED Fényszórók" },
              { key: "parking", label: "Egyszerű parkolás" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTech(tab.key)}
                style={{
                  ...styles.techTab,
                  ...(activeTech === tab.key ? styles.techTabActive : {}),
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={styles.techContent}>
            <img
              src={
                activeTech === "driver"
                  ? variant.driverAssistanceImageUrl
                  : activeTech === "safe"
                  ? variant.safeAssistanceImageUrl
                  : activeTech === "matrix"
                  ? variant.matrixLightImageUrl
                  : variant.parkingAssistanceImageUrl
              }
              alt="Technology feature"
              style={styles.techImage}
            />

            <p style={styles.techDesc}>
              {activeTech === "driver"
                ? variant.driverAssistanceDescription
                : activeTech === "safe"
                ? variant.safeAssistanceDescription
                : activeTech === "matrix"
                ? variant.matrixLightDescription
                : variant.parkingAssistanceDescription}
            </p>

            <div style={styles.techMore}>
              <a href="#" style={styles.moreLink}>
                Bővebben →
              </a>
            </div>
          </div>
        </section>
      {hasColors && (
        <div id="colors" style={styles.colorSection}>
          <h2 style={styles.h2}>Külső színek</h2>

          <div style={styles.colorViewer}>
            <button style={styles.colorArrowLeft} onClick={prevColorImage}>
              ‹
            </button>
            <img
              src={colorImages[colorIndex] || variant.imageUrl}
              alt={`${
                variant.name
              } - ${activeColor || "alapszín"} - ${colorIndex + 1}`}
              style={styles.colorImage}
            />
            <button style={styles.colorArrowRight} onClick={nextColorImage}>
              ›
            </button>
          </div>

          <div style={styles.swatchRow}>
            {colorKeys.map((key) => (
              <button
                key={key}
                title={key}
                onClick={() => handlePickColor(key)}
                style={{
                  ...styles.swatch,
                  ...(activeColor === key ? styles.swatchActive : {}),
                  background: swatchBg[key] || swatchBg.default,
                }}
              />
            ))}
          </div>
        </div>
      )}
{Array.isArray(variant.technologyImages) &&
  variant.technologyImages.length > 0 && (
    <section id="extra-tech" style={extraTech.section}>
      <div style={extraTech.container}>
        <div style={extraTech.textBox}>
          <div style={extraTech.pagination}>
            {variant.technologyImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentTech(i)}
                style={{
                  ...extraTech.pageBtn,
                  ...(currentTech === i ? extraTech.pageBtnActive : {}),
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div style={extraTech.textContent}>
            <h3 style={extraTech.title}>Technológia {currentTech + 1}</h3>
            <p style={extraTech.desc}>
              {variant.technologyDescriptions?.[currentTech] ||
                "Technológiai információ nem elérhető."}
            </p>
          </div>
        </div>
        <div style={extraTech.imageBox}>
          <img
            src={
              variant.technologyImages?.[currentTech] ||
              "/images/tech-placeholder.jpg"
            }
            alt={`Technológia ${currentTech + 1}`}
            style={extraTech.image}
          />
          <button
            onClick={() =>
              setCurrentTech(
                (prev) =>
                  (prev - 1 + variant.technologyImages.length) %
                  variant.technologyImages.length
              )
            }
            style={extraTech.arrowLeft}
          >
            ‹
          </button>
          <button
            onClick={() =>
              setCurrentTech(
                (prev) => (prev + 1) % variant.technologyImages.length
              )
            }
            style={extraTech.arrowRight}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  )}

      {variant.sizeImageUrl && (
        <section id="size" style={styles.section}>
          <h2 style={styles.sizeTitle}>Méretek</h2>
          <div style={styles.sizeImageBox}>
            <img
              src={variant.sizeImageUrl}
              alt="Méretek"
              style={styles.sizeImage}
            />
          </div>
        </section>
      )}
        <section id="gallery" style={styles.section}>
          <h2 style={styles.h2}>Galéria</h2>
          <div style={styles.gallery}>
            <img
              alt={variant.name}
              src={variant.imageUrl || "/images/car-placeholder.png"}
              style={styles.galleryImg}
            />
            {exteriorImages.slice(0, 3).map((img, i) => (
              <img key={i} src={img} alt="extra" style={styles.galleryImg} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Spec({ label, value }) {
  return (
    <div style={styles.specItem}>
      <div style={styles.specLabel}>{label}</div>
      <div style={styles.specValue}>{value}</div>
    </div>
  );
}
const swatchBg = {
  red: "linear-gradient(135deg, #a40d0d 45%, #ff7a7a 50%, #a40d0d 55%)",
  blue: "linear-gradient(135deg, #0b2d6b 45%, #82a7df 50%, #0b2d6b 55%)",
  black: "linear-gradient(135deg, #0a0a0a 45%, #6b6b6b 50%, #0a0a0a 55%)",
  white: "linear-gradient(135deg, #dcdcdc 45%, #ffffff 50%, #dcdcdc 55%)",
  grey: "linear-gradient(135deg, #6e7680 45%, #c8cdd3 50%, #6e7680 55%)",
  gray: "linear-gradient(135deg, #6e7680 45%, #c8cdd3 50%, #6e7680 55%)",
  default: "linear-gradient(135deg, #aaa 45%, #fff 50%, #aaa 55%)",
};

const styles = {
  wrap: { padding: "140px 24px" },
  center: { textAlign: "center" },
  button: {
    background: "#28f5a1",
    color: "#000",
    border: "none",
    borderRadius: 8,
    padding: "10px 18px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  page: {
    padding: "120px 20px 64px",
    maxWidth: 1280,
    margin: "0 auto",
  },
  sectionContainer: { paddingLeft: "80px" },
  hero: {
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: 24,
    alignItems: "center",
  },
  heroText: { paddingRight: 8 },
  title: { fontSize: 42, margin: "0 0 8px", fontWeight: 800 },
  subtitle: { opacity: 0.8, margin: "0 0 14px" },
  priceBadge: {
    display: "inline-block",
    fontWeight: "bold",
    padding: "6px 12px",
    borderRadius: 8,
    background: "#e8fff6",
    border: "1px solid #bfeeda",
    marginBottom: 12,
  },
  specRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0,1fr))",
    gap: 12,
    marginTop: 8,
  },
  heroImgBox: { textAlign: "right" },
  heroImg: {
    width: "80%",
    borderRadius: 16,
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
  },

  colorSection: { marginTop: 40, marginBottom: 16 },
  colorViewer: {
    position: "relative",
    textAlign: "center",
    marginBottom: 16,
  },
  colorImage: {
    width: "100%",
    maxWidth: 1000,
    height: "auto",
    borderRadius: 16,
    border: "1px solid #eee",
    boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
  },
  colorArrowLeft: {
    position: "absolute",
    top: "50%",
    left: "3%",
    transform: "translateY(-50%)",
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: 40,
    height: 40,
    fontSize: 22,
    cursor: "pointer",
  },
  colorArrowRight: {
    position: "absolute",
    top: "50%",
    right: "3%",
    transform: "translateY(-50%)",
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: 40,
    height: 40,
    fontSize: 22,
    cursor: "pointer",
  },
  swatchRow: {
    display: "flex",
    gap: 18,
    justifyContent: "center",
    alignItems: "center",
    padding: "14px 18px",
    borderRadius: 50,
    background: "rgba(255,255,255,0.9)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },
  swatch: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    border: "2px solid #ddd",
    cursor: "pointer",
    outline: "none",
  },
  swatchActive: {
    border: "3px solid #000",
    boxShadow: "0 0 0 4px rgba(0,0,0,0.08)",
  },

  section: { marginTop: 60 },
  h2: { fontSize: 30, marginBottom: 20, fontWeight: 800 },
  p: { lineHeight: 1.7, opacity: 0.9 },
  tabContainer: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    marginTop: "40px",
    marginBottom: "30px",
  },
  tabButton: {
    padding: "8px 28px",
    fontSize: "17px",
    fontWeight: "bold",
    color: "#777",
    background: "transparent",
    border: "none",
    borderBottom: "2px solid transparent",
    cursor: "pointer",
    transition: "all 0.25s ease",
  },
  tabActive: {
    color: "#000",
    border: "1px solid #000",
    borderRadius: "6px",
    background: "#e8fff6",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  exteriorCard: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 40,
    alignItems: "center",
    background: "linear-gradient(145deg, #f8f9fa, #ffffff)",
    padding: "40px 50px",
    borderRadius: 24,
    boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
  },
  exteriorDescription: { fontSize: 18, color: "#333" },
  carouselContainer: { position: "relative", textAlign: "center" },
  carouselImage: {
    width: "100%",
    maxWidth: 650,
    borderRadius: 16,
    border: "1px solid #eee",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },
  arrowLeft: {
    position: "absolute",
    top: "50%",
    left: "5%",
    transform: "translateY(-50%)",
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: 40,
    height: 40,
    fontSize: 22,
    cursor: "pointer",
  },
  arrowRight: {
    position: "absolute",
    top: "50%",
    right: "5%",
    transform: "translateY(-50%)",
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: 40,
    height: 40,
    fontSize: 22,
    cursor: "pointer",
  },
  dotWrapper: {
    position: "fixed",
    left: "20px",
    top: "52%",
    transform: "translateY(-50%)",
    width: "60px",
    zIndex: 99999,
    pointerEvents: "none",
  },
  dotLine: {
    position: "absolute",
    top: "5%",
    bottom: "5%",
    width: "2px",
    background: "rgba(0,0,0,0.1)",
    left: "50%",
    transform: "translateX(-50%)",
  },
  dotNav: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "26px",
    pointerEvents: "auto",
  },
  dot: {
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    transition: "all 0.3s ease",
    background: "transparent",
  },
  scrollHint: { marginTop: 20, textAlign: "center", color: "#777" },
  arrow: { fontSize: 18 },
  scrollText: { fontSize: 13, marginTop: 4 },
  techTitle: {
    fontSize: 32,
    textAlign: "center",
    marginBottom: 30,
    fontWeight: 800,
  },
  techTabs: {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    marginBottom: 20,
    borderBottom: "1px solid #ddd",
    paddingBottom: 6,
  },
  techTab: {
    background: "none",
    border: "none",
    fontSize: 17,
    fontWeight: "bold",
    color: "#555",
    paddingBottom: 10,
    cursor: "pointer",
    position: "relative",
  },
  techTabActive: {
    color: "#00884a",
    borderBottom: "3px solid #00884a",
  },
  techContent: {
    textAlign: "center",
    marginTop: 30,
  },
  techImage: {
    width: "100%",
    maxWidth: 900,
    borderRadius: 10,
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  },
  techDesc: {
    maxWidth: 900,
    margin: "24px auto 10px",
    fontSize: 18,
    lineHeight: 1.6,
    color: "#333",
  },
  techMore: {
    marginTop: 6,
    textAlign: "center",
  },
  sizeTitle: {
    textAlign: "center",
    fontSize: 32,
    fontWeight: 800,
    marginBottom: 30,
    marginTop: 50,
  },
  sizeImageBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  sizeImage: {
    width: "100%",
    maxWidth: 1200,
    height: "auto",
    borderRadius: 16,
    border: "1px solid #ddd",
    boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
  },
  moreLink: {
    color: "#000",
    fontWeight: "bold",
    textDecoration: "none",
  },
  gallery: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 16,
  },
  galleryImg: {
    width: "100%",
    borderRadius: 12,
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  },
  specItem: {
    border: "1px solid #eee",
    borderRadius: 10,
    padding: 12,
    background: "#fff",
  },
  specLabel: { fontSize: 12, opacity: 0.6, marginBottom: 4 },
  specValue: { fontWeight: 700 },
};
const extraTech = {
  section: {
    marginTop: 80,
    marginBottom: 60,
  },
  container: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    alignItems: "center",
    gap: 40,
    background: "linear-gradient(145deg, #f9f9f9, #fff)",
    borderRadius: 24,
    padding: "50px 60px",
    boxShadow: "0 12px 35px rgba(0,0,0,0.08)",
  },
  textBox: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  pagination: {
    display: "flex",
    gap: 12,
  },
  pageBtn: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    border: "1px solid #999",
    background: "transparent",
    cursor: "pointer",
    fontWeight: "bold",
    color: "#444",
    fontSize: 16,
  },
  pageBtnActive: {
    background: "#28f5a1",
    color: "#000",
    borderColor: "#28f5a1",
  },
  textContent: {
    marginTop: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 800,
    marginBottom: 14,
  },
  desc: {
    fontSize: 17,
    lineHeight: 1.7,
    color: "#333",
    maxWidth: 500,
  },
  imageBox: {
    position: "relative",
    textAlign: "center",
  },
  image: {
    width: "100%",
    maxWidth: 750,
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    border: "1px solid #eee",
  },
  arrowLeft: {
    position: "absolute",
    top: "50%",
    left: "3%",
    transform: "translateY(-50%)",
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: 42,
    height: 42,
    fontSize: 22,
    cursor: "pointer",
  },
  arrowRight: {
    position: "absolute",
    top: "50%",
    right: "3%",
    transform: "translateY(-50%)",
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: 42,
    height: 42,
    fontSize: 22,
    cursor: "pointer",
  },
};

