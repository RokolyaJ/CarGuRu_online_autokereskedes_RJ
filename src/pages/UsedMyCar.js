import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: "https://carguru.up.railway.app/api"
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("Nincs JWT token a localStorage-ban!");
  }

  return config;
});

const UsedMyCar = () => {
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/usedcars/mine")
      .then((res) => {
        console.log("Autók lekérve:", res.data);
        setCars(res.data);
      })
      .catch((err) => {
        console.error("Hiba a lekéréskor:", err);
      });
  }, []);

  const handleDelete = async (id) => {
    const ok = window.confirm("Biztosan törölni szeretnéd a hirdetést?");
    if (!ok) return;

    try {
      await api.delete(`/usedcars/${id}`);
      setCars((prev) => prev.filter((c) => c.id !== id));
      alert("Hirdetés törölve!");
    } catch (err) {
      console.error("Hiba törlés közben:", err);
      alert("Nem sikerült törölni a hirdetést!");
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Feltöltött hirdetéseim</h1>

      {cars.length === 0 ? (
        <p style={styles.empty}>Még nincs feltöltött autód.</p>
      ) : (
        <div style={styles.list}>
          {cars.map((car) => (
            <div key={car.id} style={styles.card}>
              <div style={styles.imageWrapper}>
                <img
                  src={car.imageUrl || car.image || "/placeholder.png"}
                  alt={`${car.brand} ${car.model}`}
                  style={styles.image}
                />
              </div>

              <div style={styles.details}>
                <h2 style={styles.carTitle}>
                  {car.brand} {car.model}
                </h2>

                <p style={styles.info}>
                  {car.year} •{" "}
                  {car.mileage
                    ? car.mileage.toLocaleString("hu-HU")
                    : "N/A"}{" "}
                  km • {car.fuel} • {car.bodyType}
                </p>

                <p style={styles.price}>
                  {car.price
                    ? car.price.toLocaleString("hu-HU")
                    : "N/A"}{" "}
                  Ft
                </p>

                <div style={styles.buttonRow}>
                  <button
                    onClick={() => navigate(`/mycars/${car.id}`)}
                    style={{ ...styles.button, background: "#2563eb" }}
                  >
                    Megnyitás
                  </button>
                  <button
                    onClick={() => handleDelete(car.id)}
                    style={{ ...styles.button, background: "#dc2626" }}
                  >
                    Törlés
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#111827",
    marginBottom: "30px",
    textAlign: "center",
  },
  empty: {
    fontSize: "1.1rem",
    color: "#6b7280",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    width: "100%",
    maxWidth: "900px",
  },
  card: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
  },
  imageWrapper: {
    flex: "1 1 40%",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease",
  },
  details: {
    flex: "1 1 60%",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  carTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "6px",
  },
  info: {
    fontSize: "1rem",
    color: "#4b5563",
    marginBottom: "12px",
  },
  price: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    color: "#e65100",
    marginBottom: "10px",
  },
  buttonRow: {
    display: "flex",
    gap: "10px",
  },
  button: {
    flex: 1,
    padding: "10px 16px",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "background 0.3s ease",
  },
};

export default UsedMyCar;
