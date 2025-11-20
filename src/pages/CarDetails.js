import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function CarDetails() {
  const { id } = useParams(); // id = VIN
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://carguru.up.railway.app/api/stock/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCar(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Hiba a jármű lekérésekor:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Betöltés...</p>;
  if (!car) return <p>Nem található jármű.</p>;

  return (
    <div style={styles.container}>
      <h2>{car.modelName}</h2>

      <img
        src={car.imageUrl || "/images/default-car.png"}
        alt={car.modelName}
        style={styles.image}
      />

      <p><strong>Ár:</strong> {car.price?.toLocaleString()} Ft</p>
      <p><strong>Évjárat:</strong> {car.year}</p>
      <p><strong>Leírás:</strong> {car.description || "Nincs megadva"}</p>
    </div>
  );
}

const styles = {
  container: { textAlign: "center", padding: "20px" },
  image: { width: "80%", maxWidth: "600px", borderRadius: "10px" }
};

export default CarDetails;
