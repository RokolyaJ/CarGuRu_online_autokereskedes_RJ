import React, { useEffect, useState } from "react";
import axios from "axios";

const UsedCarMyReservations = () => {
  const [cars, setCars] = useState([]);

  const loadData = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://carguru.up.railway.app/api/usedcars/my-reservations",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setCars(res.data);
    } catch (err) {
      console.error("Hiba a foglalások betöltésekor:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancel = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`https://carguru.up.railway.app/api/usedcars/${id}/reserve`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      await loadData();
    } catch (err) {
      console.error("Hiba törléskor:", err);
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Lefoglalt hirdetéseim</h2>

      {cars.length === 0 && (
        <div style={styles.emptyBox}>
          <img
            src="/images/empty.png"
            alt="Nincs foglalás"
            style={{ width: 160, opacity: 0.6 }}
          />
          <p style={styles.emptyText}>Nincs egyetlen foglalásod sem.</p>
        </div>
      )}

      <div style={styles.grid}>
        {cars.map((car) => (
          <div key={car.id} style={styles.card}>
            <img
              src={car.imageUrl || "/placeholder.png"}
              alt={car.brand}
              style={styles.carImg}
            />

            <div style={styles.cardBody}>
              <h3 style={styles.carTitle}>
                {car.brand} {car.model}
              </h3>

              <p style={styles.meta}>
                {car.year} • {car.mileage.toLocaleString()} km • {car.fuel}
              </p>

              <p style={styles.price}>
                {car.price.toLocaleString()} Ft
              </p>

              <button
                style={styles.cancelBtn}
                onClick={() => handleCancel(car.id)}
              >
                Foglalás visszavonása
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  page: {
    maxWidth: 1200,
    margin: "100px auto",
    padding: "20px",
  },

  title: {
    fontSize: "2rem",
    fontWeight: 700,
    marginBottom: 30,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 25,
  },

  card: {
    background: "#fff",
    borderRadius: 14,
    boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
    overflow: "hidden",
    transition: "0.25s",
  },

  cardBody: {
    padding: "16px 18px",
  },

  carImg: {
    width: "100%",
    height: 200,
    objectFit: "cover",
  },

  carTitle: {
    fontSize: "1.3rem",
    fontWeight: "700",
    margin: "5px 0",
  },

  meta: {
    color: "#555",
    marginBottom: 6,
  },

  price: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#ef530f",
    marginBottom: 14,
  },

  cancelBtn: {
    background: "#d62828",
    color: "#fff",
    border: "none",
    padding: "12px 14px",
    borderRadius: 8,
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
    transition: "0.2s",
  },

  emptyBox: {
    textAlign: "center",
    marginTop: 60,
  },

  emptyText: {
    marginTop: 20,
    fontSize: 18,
    color: "#666",
  },
};

export default UsedCarMyReservations;
