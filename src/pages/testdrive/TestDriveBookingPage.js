import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const styles = {
  page: {
    padding: "40px",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    fontSize: "32px",
    fontWeight: "800",
    color: "#007000",
    marginBottom: "40px",
  },
  container: {
    display: "flex",
    gap: "40px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  carDetails: {
    width: "300px",
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  carImage: {
    width: "100%",
    borderRadius: "10px",
    marginBottom: "15px",
  },
  form: {
    width: "400px",
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "15px",
  },
  label: {
    fontWeight: "600",
    marginTop: "10px",
    fontSize: "14px",
  },
  button: {
    padding: "12px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
  },
  buttonHover: {
    backgroundColor: "#218838",
  },
};

const TestDriveBookingPage = () => {
  const { state } = useLocation();
  const selectedCar = state?.car;
console.log("Kiválasztott autó:", selectedCar);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    date: ""
  });

  const [hover, setHover] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
   await axios.post("http://localhost:8080/api/test-drive", {
    vehicleId: selectedCar.id,

    brand: selectedCar.brand,

    brand: selectedCar.make || selectedCar.brand || "Audi",

    model: selectedCar.model,
    variant: selectedCar.variant,

    fullName: form.fullName,
    email: form.email,
    phone: form.phone,
    date: form.date,

    price: selectedCar.price,
    fuel: selectedCar.fuel,
    powerHp: selectedCar.powerHp,
    transmission: selectedCar.transmission,
    storeName: selectedCar.storeName,
    city: selectedCar.city,
});

console.log("Küldött adat:", {
  brand: selectedCar.brand,
  model: selectedCar.model,
  variant: selectedCar.variant
});



    alert("Sikeres foglalás! Hamarosan emailben kap visszaigazolást.");
  } catch (err) {
    console.error(err);
    alert("Hiba történt!");
  }
};




  return (
    <div style={styles.page}>
      <h1 style={styles.title}>AZ ÖN TESZTAUTÓJA</h1>

      <div style={styles.container}>
        <div style={styles.carDetails}>
          <img
            src={selectedCar?.imageUrl || "/images/default-car.png"}
            alt={selectedCar?.model}
            style={styles.carImage}
          />
          <h2>{selectedCar?.brand} {selectedCar?.model}</h2>
          <p><strong>Változat:</strong> {selectedCar?.variant || "—"}</p>
          <p><strong>Ár:</strong> {selectedCar?.price?.toLocaleString() || "—"} Ft</p>
          <p><strong>Üzemanyag:</strong> {selectedCar?.fuel || "—"}</p>
          <p><strong>Teljesítmény:</strong> {selectedCar?.powerHp ? `${selectedCar.powerHp} LE` : "—"}</p>
          <p><strong>Váltó:</strong> {selectedCar?.transmission || "—"}</p>
          <p><strong>Szalon:</strong> {selectedCar?.storeName || "—"} ({selectedCar?.city || "—"})</p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <h3>Kérjük, töltse ki az alábbi űrlapot!</h3>

          <input type="text" name="fullName" placeholder="Teljes név"
            style={styles.input} onChange={handleChange} required />

          <input type="email" name="email" placeholder="E-mail cím"
            style={styles.input} onChange={handleChange} required />

          <input type="text" name="phone" placeholder="Telefonszám (pl. 06201234567)"
            style={styles.input} onChange={handleChange} required />

         <label style={styles.label}>Válasszon dátumot (csak munkanapok):</label>
<select name="date" style={styles.input} onChange={handleChange} required>
  <option value="">Válassz dátumot</option>
  {getNextWorkdays(10).map((d, i) => (
    <option key={i} value={d.toISOString().split("T")[0]}>
      {d.toISOString().split("T")[0]}
    </option>
  ))}
</select>


          <button
            type="submit"
            style={{ ...styles.button, ...(hover ? styles.buttonHover : {}) }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            Elküldöm
          </button>
        </form>
      </div>
    </div>
  );
};

function getTomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

function getNextWeek() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().split("T")[0];
}
function getNextWorkdays(count = 10) {
  const days = [];
  let date = new Date();
  date.setDate(date.getDate() + 1); 

  while (days.length < count) {
    const day = date.getDay();
    if (day !== 0 && day !== 6) { 
      days.push(new Date(date));
    }
    date.setDate(date.getDate() + 1);
  }
  return days;
}


export default TestDriveBookingPage;
