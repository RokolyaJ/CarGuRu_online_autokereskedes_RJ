import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);

  useEffect(() => {
    const dummyCars = [
      {
        id: "1",
        name: "Audi A4",
        price: "5 200 000 Ft",
        year: 2018,
        description: "Megbízható és elegáns Audi A4, kiváló állapotban."
      },
      {
        id: "2",
        name: "BMW 3",
        price: "6 800 000 Ft",
        year: 2019,
        description: "Sportos BMW 3-as sorozat, erős motorral."
      },
      {
        id: "3",
        name: "Mercedes C",
        price: "7 500 000 Ft",
        year: 2020,
        description: "Luxus Mercedes C osztály, modern extrákkal."
      },
      {
        id: "4",
        name: "Volkswagen Golf",
        price: "3 900 000 Ft",
        year: 2017,
        description: "Kompakt és gazdaságos Volkswagen Golf."
      }
    ];


    const selectedCar = dummyCars.find((car) => car.id === id);
    setCar(selectedCar || null);
  }, [id]);

  if (!car) {
    return <p>Betöltés...</p>;
  }

  return (
    <div style={styles.container}>
      <h2>{car.name}</h2>
      <img src={car.image} alt={car.name} style={styles.image} />
      <p><strong>Ár:</strong> {car.price}</p>
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
