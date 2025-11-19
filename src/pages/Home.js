import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import FloatingActions from "../components/FloatingActions";

function Home() {
  const { darkMode } = useTheme();
  const [cars, setCars] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [news, setNews] = useState([]);

  const sliderImages = [
    "/images/home_page/audi1.jpg",
    "/images/home_page/mercedes-benz1.jpg",
    "/images/home_page/skoda1.jpg"
  ];

  const brands = [
    { name: "Audi", image: "/images/home_page/brand_logo/audi_logo.png" },
    { name: "BMW", image: "/images/home_page/brand_logo/bmw_logo.jpg" },
    { name: "Mercedes", image: "/images/home_page/brand_logo/mercedes_logo.png" },
    { name: "Volkswagen", image: "/images/home_page/brand_logo/volkswagen_logo.png" },
    { name: "Skoda", image: "/images/home_page/brand_logo/skoda_logo.jpg" },
  ];

  useEffect(() => {
    setCars([
      { id: "1", name: "Audi A4", price: "5 200 000 Ft", year: 2018, image: "/images/home_page/audi1.jpg" },
      { id: "2", name: "Mercedes-Benz C", price: "7 500 000 Ft", year: 2020, image: "/images/home_page/mercedes-benz1.jpg" },
      { id: "3", name: "Skoda Octavia", price: "6 200 000 Ft", year: 2019, image: "/images/home_page/skoda1.jpg" },
    ]);

    setNews([
      {
        id: 1,
        slug: "audi-skoda-elektromos-2026",
        date: "2025/09/25",
        title: "Audi és Skoda: új elektromos modellek 2026-ra",
        summary: "Az Audi és a Skoda új elektromos SUV-modelleket fejleszt, melyek 2026-ban érkeznek.",
        image: "/images/home_page/news/audi_and_skoda.jpg"
      },
      {
        id: 2,
        slug: "mercedes-bmw-onvezetes",
        date: "2025/09/22",
        title: "Mercedes és BMW: közös fejlesztés az önvezetésért",
        summary: "A Mercedes és a BMW közösen dolgoznak a 4-es szintű önvezető rendszerek bevezetésén.",
        image: "/images/home_page/news/mercedesz_and_bmw.jpg"
      },
      {
        id: 3,
        slug: "volkswagen-zoldebb-jovo",
        date: "2025/09/18",
        title: "Volkswagen-csoport: erős második negyedév, zöldebb jövő",
        summary: "A VW-csoport 15%-kal növelte az eladásokat az elektromos járművek szegmensében.",
        image: "/images/home_page/news/Volkswagen_results.jpg"
      }
    ]);
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliderImages.length]);


  const styles = {
    container: {
      textAlign: "center",
      backgroundColor: darkMode ? "#121212" : "#f9f9f9",
      color: darkMode ? "#e0e0e0" : "#000",
      transition: "background-color 0.3s ease, color 0.3s ease"
    },
    hero: {
      position: "relative",
      height: "90vh",
      overflow: "hidden"
    },
    heroImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "opacity 1s ease-in-out"
    },
    navButton: {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      background: "rgba(0,0,0,0.5)",
      border: "none",
      color: "white",
      fontSize: "2rem",
      padding: "10px 15px",
      cursor: "pointer",
      borderRadius: "50%"
    },
    brandsSection: { padding: "60px 20px", backgroundColor: darkMode ? "#1a1a1a" : "#fff" },
    brandsTitle: { fontSize: "2rem", marginBottom: "40px", color: darkMode ? "#e0e0e0" : "#333" },
    brandsGrid: { display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap" },
    brandCard: {
      width: "150px", textAlign: "center", transition: "transform 0.3s ease",
      cursor: "pointer", backgroundColor: darkMode ? "#2c2c2c" : "transparent",
      borderRadius: "12px", padding: "10px"
    },
    brandImage: { width: "100%", height: "auto", marginBottom: "15px" },
    brandName: { fontSize: "1.2rem", color: darkMode ? "#eee" : "#333" },
    featuredCars: { padding: "60px 20px", backgroundColor: darkMode ? "#121212" : "#f9f9f9" },
    sectionTitle: { fontSize: "2rem", marginBottom: "40px", color: darkMode ? "#e0e0e0" : "#333" },
    carGrid: { display: "flex", justifyContent: "center", gap: "30px", flexWrap: "wrap" },
    carCard: {
      background: darkMode ? "#2c2c2c" : "white",
      borderRadius: "15px", padding: "20px", width: "280px",
      boxShadow: "0 6px 15px rgba(0,0,0,0.1)", color: darkMode ? "#e0e0e0" : "#000"
    },
    carImage: { width: "100%", borderRadius: "10px", marginBottom: "15px" },
    carName: { fontSize: "1.5rem", margin: "10px 0" },
    carPrice: { fontWeight: "bold", color: "#007bff" },
    carYear: { color: darkMode ? "#ccc" : "#555", marginBottom: "15px" },
    buttonSmall: {
      backgroundColor: "#28a745", color: "white", padding: "8px 15px",
      textDecoration: "none", borderRadius: "20px", fontWeight: "bold"
    },
    newsSection: { padding: "60px 20px", backgroundColor: darkMode ? "#1a1a1a" : "#fff" },
    newsGrid: { display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "30px" },
    newsCard: {
      width: "320px", background: darkMode ? "#2c2c2c" : "white",
      borderRadius: "15px", padding: "20px", boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
      color: darkMode ? "#e0e0e0" : "#000"
    },
    newsImage: { width: "100%", height: "200px", objectFit: "cover", borderRadius: "10px", marginBottom: "15px" },
    newsDate: { fontSize: "0.9rem", color: darkMode ? "#aaa" : "#555", marginBottom: "10px" },
    newsTitle: { fontSize: "1.3rem", fontWeight: "bold", marginBottom: "10px" },
    newsSummary: { fontSize: "1rem", marginBottom: "15px" },
    newsLink: { color: "#007bff", textDecoration: "none", fontWeight: "bold" },
  };

  return (
    <div style={styles.container}>

      <section style={styles.hero}>
        <img
          src={sliderImages[currentSlide]}
          alt="Car slider"
          style={styles.heroImage}
        />
        <button
          style={{ ...styles.navButton, left: "20px" }}
          onClick={() => setCurrentSlide((currentSlide - 1 + sliderImages.length) % sliderImages.length)}
        >
          ❮
        </button>
        <button
          style={{ ...styles.navButton, right: "20px" }}
          onClick={() => setCurrentSlide((currentSlide + 1) % sliderImages.length)}
        >
          ❯
        </button>
      </section>


      <section style={styles.brandsSection}>
        <h2 style={styles.brandsTitle}>Márkák áttekintése</h2>
        <div style={styles.brandsGrid}>
          {brands.map((b, i) => (
            <Link key={i} to={`/brand/${b.name.toLowerCase()}`} style={{ textDecoration: "none" }}>
              <div style={styles.brandCard}>
                <img src={b.image} alt={b.name} style={styles.brandImage} />
                <h3 style={styles.brandName}>{b.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>


      <section style={styles.featuredCars}>
        <h2 style={styles.sectionTitle}>Kiemelt ajánlataink</h2>
        <div style={styles.carGrid}>
          {cars.map(car => (
            <div key={car.id} style={styles.carCard}>
              <img src={car.image} alt={car.name} style={styles.carImage} />
              <h3 style={styles.carName}>{car.name}</h3>
              <p style={styles.carPrice}>Ár: {car.price}</p>
              <p style={styles.carYear}>Évjárat: {car.year}</p>
              <Link to={`/car/${car.id}`} style={styles.buttonSmall}>Részletek</Link>
            </div>
          ))}
        </div>
      </section>


      <section style={styles.newsSection}>
        <h2 style={styles.sectionTitle}>Legfrissebb híreink</h2>
        <div style={styles.newsGrid}>
          {news.map(n => (
            <div key={n.id} style={styles.newsCard}>
              <img src={n.image} alt={n.title} style={styles.newsImage} />
              <p style={styles.newsDate}>{n.date}</p>
              <h3 style={styles.newsTitle}>{n.title}</h3>
              <p style={styles.newsSummary}>{n.summary}</p>
              <Link to={`/news/${n.slug}`} style={styles.newsLink}>Tudjon meg többet ›</Link>
            </div>
          ))}
        </div>
      </section>

      <FloatingActions />
    </div>
  );
}

export default Home;
