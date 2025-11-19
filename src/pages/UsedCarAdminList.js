import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UsedCarAdminList = () => {
  const [grouped, setGrouped] = useState([]);
  const [expanded, setExpanded] = useState({});

  const navigate = useNavigate(); 

  const loadData = () => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8080/api/usedcars/admin/listings", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((res) => setGrouped(res.data))
      .catch((err) => console.error("Hiba:", err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteCar = async (carId) => {
    const token = localStorage.getItem("token");

    if (!window.confirm("Biztosan törlöd ezt a hirdetést?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/usedcars/${carId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      loadData();
    } catch (e) {
      console.error("Törlési hiba:", e);
      alert("Hiba történt a törlés során!");
    }
  };

  return (
    <div className="admin-container">
      <style>{css}</style>

      <h1 className="title">Admin autólista</h1>

      {grouped.length === 0 ? (
        <p className="empty-text">Jelenleg nincs feltöltött autó.</p>
      ) : (
        grouped.map((entry) => (
          <div key={entry.userId} className="user-section">
            <h2
              className="user-title clickable"
              onClick={() =>
                setExpanded((prev) => ({
                  ...prev,
                  [entry.userId]: !prev[entry.userId],
                }))
              }
            >
              {entry.fullName}{" "}
              <span style={{ color: "#888" }}>(ID: {entry.userId})</span>
              <span className="arrow">
                {expanded[entry.userId] ? "▲" : "▼"}
              </span>
            </h2>

            {expanded[entry.userId] && (
              <div className="car-grid">
                {entry.cars.map((car) => (
                  <div key={car.id} className="car-card">
                    <img src={car.imageUrl} alt={car.brand} className="car-img" />

                    <div className="car-info">
                      <h3 className="car-name">
                        {car.brand} {car.model}
                      </h3>

                      <p className="car-meta">
                        {car.year} • {car.fuel}
                      </p>

                      <p className="car-price">
                        {car.price.toLocaleString()} Ft
                      </p>
                    </div>

                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/used-cars/admin/${car.id}/edit`)}
                    >
                      Szerkesztés
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteCar(car.id)}
                    >
                      Törlés
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

const css = `
.admin-container {
  max-width: 1200px;
  margin: auto;
   padding: 80px 20px 20px;
  font-family: 'Inter', sans-serif;
  color: #222;
}

.title {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 20px;
  text-align: center;
  background: linear-gradient(90deg, #0045ff, #00b7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.user-title {
  font-size: 22px;
  font-weight: 700;
  margin: 20px 0 10px;
  color: #333;
}

.car-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 18px;
}

.car-card {
  background: white;
  border-radius: 14px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 6px 15px rgba(0,0,0,0.07);
  transition: 0.2s ease;
  padding-bottom: 45px; 
}

.car-card:hover {
  transform: translateY(-4px);
}

.car-img {
  width: 100%;
  height: 150px;      
  object-fit: cover;
}

.car-info {
  padding: 12px;
}

.car-name {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 6px;
}

.car-meta {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.car-price {
  font-size: 18px;
  font-weight: 700;
  color: #0045ff;
}


.edit-btn {
  position: absolute;
  bottom: 8px;
  left: 8px;
  padding: 5px 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s ease;
}

.edit-btn:hover {
  background: #0056c7;
  transform: scale(1.04);
}

.delete-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  padding: 5px 10px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s ease;
}

.delete-btn:hover {
  background: #d60000;
  transform: scale(1.04);
}


.edit-btn {
  position: absolute;
  bottom: 12px;
  left: 12px;
  padding: 7px 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: 0.2s ease;
}

.edit-btn:hover {
  background: #0056c7;
  transform: scale(1.05);
}

.car-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.car-info {
  padding: 18px;
}

.car-name {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
}

.car-meta {
  font-size: 15px;
  color: #666;
  margin-bottom: 12px;
}

.car-price {
  font-size: 22px;
  font-weight: 700;
  color: #0045ff;
}
`;

export default UsedCarAdminList;
