import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function UsedCarSummary() {
  const { id: carId } = useParams();
  const navigate = useNavigate();
  const [carData, setCarData] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [searchParams] = useSearchParams();
const tempIdFromUrl = searchParams.get("tempId");
const tempId = tempIdFromUrl || localStorage.getItem("tempId"); 


  const handleFinalize = async () => {
  const savedData = localStorage.getItem("usedCarData");
  if (!savedData) {
    alert("Nincs elmentett adat!");
    return;
  }

  const parsed = JSON.parse(savedData);

  try {
    const token = localStorage.getItem("token");

    if (!token || token === "null" || token.trim() === "") {
      alert("Nincs bejelentkezett felhasználó! Jelentkezz be újra.");
      navigate("/login");
      return;
    }

    console.log("Küldött token:", token.substring(0, 15) + "...");
    console.log("Beküldött adat:", parsed);

    const carResponse = await axios.post(
      "http://localhost:8080/api/usedcars",
      parsed,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: false,
      }
    );

    const newCarId = carResponse.data.id;
    console.log("Autó létrehozva, ID:", newCarId);

    if (tempId) {
      await axios.post(
        `http://localhost:8080/api/images/assign/${tempId}/${newCarId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Képek hozzárendelve a hirdetéshez");
    }

    localStorage.removeItem("usedCarData");
    localStorage.removeItem("tempId");

    alert("Hirdetés sikeresen véglegesítve!");
    navigate(`/used-cars/${newCarId}`);
  } catch (err) {
    console.error(
      "Hiba a véglegesítés során:",
      err.response?.status,
      err.response?.data
    );
    alert(
      `Nem sikerült a végleges mentés! (${err.response?.status || "N/A"})`
    );
  }
};
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (tempId) {
          const savedData = localStorage.getItem("usedCarData");
          if (savedData) {
            const parsed = JSON.parse(savedData);
            setCarData(parsed.car);
          }

          const imgRes = await axios.get(`http://localhost:8080/api/images/temp/${tempId}`);
          setImages(imgRes.data || []);
        } else if (carId) {
          const resCar = await axios.get(`http://localhost:8080/api/usedcars/${carId}`);
          setCarData(resCar.data);

          const imgRes = await axios.get(`http://localhost:8080/api/images/${carId}`);
          setImages(imgRes.data || []);
        }
      } catch (err) {
        console.error("Hiba a képek vagy adatok lekérésekor:", err);
      }
    };
    fetchData();
  }, [tempId, carId]);

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(`http://localhost:8080${images[0].image}`);
    }
  }, [images]);

  if (!carData) {
    return <div>Betöltés...</div>;
  }

  return (
    <div className="summary-page">
      <Navbar />
      <div className="summary-container">
        <h2 style={{ fontWeight: "bold", fontSize: "26px" }}>
          {carData.brand} {carData.model}{" "}
          {carData.engineLayout ? `(${carData.engineLayout})` : ""}
        </h2>

        <div className="right-buttons">
          <button onClick={handleFinalize} className="finalize-button">
            Végleges feltöltés
          </button>
        </div>

        <div className="summary-wrapper">
          <div className="summary-image-box">
            <img src={selectedImage} alt="Autó főképe" />
            <p style={{ textAlign: "center", marginTop: "5px" }}>
              Képek száma: {images.length} db
            </p>

            <div
              className="image-gallery"
              style={{ marginTop: "10px", display: "flex", flexWrap: "wrap" }}
            >
              {images.map((img, index) => {
                const fullImgUrl = `http://localhost:8080${img.image}`;
                return (
                  <img
                    key={index}
                    src={fullImgUrl}
                    alt={`Kép ${index + 1}`}
                    onClick={() => setSelectedImage(fullImgUrl)}
                    style={{
                      width: "100px",
                      height: "auto",
                      marginRight: "10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      border:
                        selectedImage === fullImgUrl
                          ? "3px solid #007bff"
                          : "1px solid #ccc",
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div className="summary-details-box">
            <h3>Ár, költségek</h3>
            <p>
              <strong>Vételár:</strong> {carData.price || "—"} Ft
            </p>

            <h3>Általános adatok</h3>
            <p>
              <strong>Márka:</strong> {carData.brand || "—"}
            </p>
            <p>
              <strong>Model:</strong> {carData.model || "—"}
            </p>
            <p>
              <strong>Motor típusa:</strong> {carData.engineLayout || "—"}
            </p>
            <p>
              <strong>Évjárat:</strong> {carData.year || "—"}
            </p>
            <p>
              <strong>Állapot:</strong> {carData.condition || "—"}
            </p>
            <p>
              <strong>Kivitel:</strong> {carData.bodyType || "—"}
            </p>

            <h3>Jármű adatok</h3>
            <p>
              <strong>Km óra állás:</strong> {carData.mileage || "—"} km
            </p>
            <p>
              <strong>Ajtók száma:</strong> {carData.doors || "—"}
            </p>
            <p>
              <strong>Ülések száma:</strong> {carData.seats || "—"}
            </p>

            <h3>Motor adatok</h3>
            <p>
              <strong>Üzemanyag:</strong> {carData.fuel || "—"}
            </p>
            <p>
              <strong>Hengerűrtartalom:</strong> {carData.engineSize || "—"} cm³
            </p>
            <p>
              <strong>Hajtás:</strong> {carData.drivetrain || "—"}
            </p>
            <p>
              <strong>Váltó típusa:</strong> {carData.transmission || "—"}
            </p>

            <h3>Leírás</h3>
            <p>{carData.description || "Nincs leírás megadva."}</p>
          </div>
        </div>

        <div className="button-group">
          <div className="left-buttons">
            <button onClick={() => navigate(-1)} className="back-button">
              ← Vissza
            </button>
          </div>
          <div className="center-buttons">
            <button onClick={() => navigate("/used-cars")} className="home-button">
              Főoldal
            </button>
          </div>
          <div className="right-buttons">
            <button onClick={() => navigate("/my-usedcars")} className="mycars-button">
              Hirdetéseim
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .summary-page { padding-top: 100px; }
        .finalize-button { background: #ff9800; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; }
        .finalize-button:hover { background: #e68900; }
        .summary-container {
          max-width: 1200px;
          margin: auto;
          padding: 20px;
        }
        .summary-wrapper {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 30px;
          align-items: flex-start;
        }
        .summary-image-box img {
          width: 100%;
          max-width: 450px;
          height: auto;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .summary-details-box h3 {
          margin-top: 20px;
          font-size: 18px;
          border-bottom: 1px solid #ccc;
          padding-bottom: 5px;
        }
        .summary-details-box p {
          margin: 6px 0;
        }
        .button-group {
          margin-top: 25px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          width: 100%;
          align-items: center;
        }
        .left-buttons { text-align: left; }
        .center-buttons { text-align: center; }
        .right-buttons { text-align: right; }
        .back-button, .home-button, .mycars-button {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 500;
          color: white;
        }
        .back-button { background: #6c757d; }
        .back-button:hover { background: #5a6268; }
        .home-button { background: #1976d2; }
        .home-button:hover { background: #125aa0; }
        .mycars-button { background: #28a745; }
        .mycars-button:hover { background: #218838; }
      `}</style>
    </div>
  );
}
