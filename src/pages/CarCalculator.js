import React, { useEffect, useState } from "react";

const CarCalculator = () => {
  const [formData, setFormData] = useState({
    id: null,
    make: "",
    model: "",
    year: "",
    mileage: "",
    seats: "",
    engine_displacement_cc: "",
    fuel_type: "",
    power_kw: "",
    condition_grade: "",
    trunk_liters: "",
    body_style: "",
    upholstery_color: "",
    color: "",
    gross_weight_kg: "",
    drive_type: "",
    transmission: "",
    documents: "",
    technical_valid_until: "",
    description: "",
  });

  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [cars, setCars] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [calculatedPrice, setCalculatedPrice] = useState(null);
  const [showCalculation, setShowCalculation] = useState(false);
  const [showSavedCars, setShowSavedCars] = useState(true);
  const [lastSavedTradeInId, setLastSavedTradeInId] = useState(null);
const [serverEstimatedPrice, setServerEstimatedPrice] = useState(null);



  const loadCars = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) return;

    try {
      const response = await fetch(
        `https://cargururj-production.up.railway.app/api/tradein/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setCars(data);
      }
    } catch (err) {
      console.error("Hiba az autók lekérésekor:", err);
    }
  };

  useEffect(() => {
    loadCars();
  }, []);


const calculatePrice = (data) => {
  const year = parseInt(data.year) || 2015;
  const mileage = parseInt(data.mileage) || 0;
  const power = parseInt(data.power_kw) || 0;
  const condition = parseInt(data.condition_grade) || 3;
  const fuel = (data.fuel_type || "").toLowerCase();
  const body = (data.body_style || "").toLowerCase();
  const techValid = data.technical_valid_until
    ? new Date(data.technical_valid_until)
    : null;

  let basePrice = 8_000_000;
  if (/bmw|audi|mercedes/i.test(data.make)) basePrice = 12_000_000;
  else if (/toyota|honda|mazda/i.test(data.make)) basePrice = 9_000_000;
  else if (/skoda|vw|volkswagen|seat/i.test(data.make)) basePrice = 8_500_000;
  else if (/dacia|lada|suzuki/i.test(data.make)) basePrice = 6_000_000;

  const agePenalty = (2025 - year) * 300_000;
  basePrice -= agePenalty;

  const kmPenalty = Math.floor(mileage / 1000) * 500;
  basePrice -= kmPenalty;

  if (power > 150) basePrice += 500_000;
  else if (power < 80) basePrice -= 300_000;

  if (fuel.includes("dízel") || fuel.includes("diesel")) basePrice -= 200_000;
  if (fuel.includes("elektromos") || fuel.includes("electric")) basePrice += 800_000;
  if (fuel.includes("hybrid")) basePrice += 400_000;
  if (body.includes("suv")) basePrice += 600_000;
  if (body.includes("kombi")) basePrice += 200_000;
  if (body.includes("sedan")) basePrice += 100_000;
  if (techValid) {
    const now = new Date();
    const diffMonths =
      (techValid.getFullYear() - now.getFullYear()) * 12 +
      (techValid.getMonth() - now.getMonth());
    if (diffMonths < 6) basePrice -= 300_000;
  }

  basePrice += (condition - 3) * 400_000;

  if (basePrice < 500_000) basePrice = 500_000;
  if (basePrice > 25_000_000) basePrice = 25_000_000;

  return Math.round(basePrice);
};


  const handleImageChange = (e) => {
  const files = Array.from(e.target.files || []);
  if (files.length === 0) return;

  setImages((prev) => [...prev, ...files]);

  const preview = files.map((file) => URL.createObjectURL(file));
  setPreviewUrls((prev) => [...prev, ...preview]);

  e.target.value = null;
};
const handleChange = (e) => {
  const { name, value, type } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: type === "number" ? value.replace(/\D/g, "") : value,
    
  }));
setServerEstimatedPrice(calculatePrice({ ...formData, [name]: value }));

};
const ImageRotator = ({ images = [], alt }) => {
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    if (!images.length) return;
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % images.length);
    }, 2000); 
    return () => clearInterval(id);
  }, [images]);

  if (!images.length) {
    return <img src="/no-image.png" alt={alt} style={{ width: "180px", height: "130px", objectFit: "cover", borderRadius: "8px" }} />;
  }

  return (
    <img
      src={images[idx]}
      alt={alt}
      style={{ width: "180px", height: "130px", objectFit: "cover", borderRadius: "8px" }}
    />
  );
};
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setMessage("");
  setShowCalculation(false);
 const localEstimate = calculatePrice(formData);
  setServerEstimatedPrice(localEstimate);
  const mappedData = {
    id: formData.id || null,
    make: formData.make,
    model: formData.model,
    year: parseInt(formData.year) || 0,
    mileage: parseInt(formData.mileage) || 0,
    seats: parseInt(formData.seats) || 0,
    engineSize: parseInt(formData.engine_displacement_cc) || 0,
    fuelType: formData.fuel_type || "",
    power: parseInt(formData.power_kw) || 0,
    condition: parseInt(formData.condition_grade) || 0,
    luggage: parseInt(formData.trunk_liters) || 0,
    bodyType: formData.body_style || "",
    interiorColor: formData.upholstery_color || "",
    color: formData.color || "",
    weight: parseInt(formData.gross_weight_kg) || 0,
    drivetrain: formData.drive_type || "",
    gearbox: formData.transmission || "",
    documents: formData.documents || "",
    technicalValidity: formData.technical_valid_until || "",
    description: formData.description || "",
  };

  const form = new FormData();
  form.append(
    "tradeIn",
    new Blob([JSON.stringify(mappedData)], { type: "application/json" })
  );
  images.forEach((img) => form.append("images", img));

  const token = localStorage.getItem("token");
  if (!token) {
    setMessage("Jelentkezz be a beküldéshez!");
    setIsLoading(false);
    return;
  }

  try {
    const url = editingId
      ? `https://cargururj-production.up.railway.app/api/tradein/update/${editingId}`
      : "https://cargururj-production.up.railway.app/api/tradein/create";
    const method = editingId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: form,
      credentials: "include",
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Mentett adat:", result);

      setLastSavedTradeInId(result.id);
      setServerEstimatedPrice(result.estValueHuf ?? null);

      setMessage(
        editingId
          ? "Az autó sikeresen frissítve!"
          : "Az autó sikeresen mentve és kalkulálva!"
      );
      setShowCalculation(true);
      await loadCars();

      setFormData({
        id: null,
        make: "",
        model: "",
        year: "",
        mileage: "",
        seats: "",
        engine_displacement_cc: "",
        fuel_type: "",
        power_kw: "",
        condition_grade: "",
        trunk_liters: "",
        body_style: "",
        upholstery_color: "",
        color: "",
        gross_weight_kg: "",
        drive_type: "",
        transmission: "",
        documents: "",
        technical_valid_until: "",
        description: "",
      });
      setImages([]);
      setPreviewUrls([]);
      setEditingId(null);
      setShowSavedCars(false);
    } else {
      const text = await response.text();
      console.error("Szerver válasz:", text);
      setMessage("Hiba történt a mentés során!");
    }
  } catch (error) {
    console.error("Hiba:", error);
    setMessage("Nem sikerült kapcsolódni a szerverhez.");
  } finally {
    setIsLoading(false);
  }
};



const handleDelete = async (id) => {
  if (!window.confirm("Biztosan törlöd ezt az autót?")) return;

  const token = localStorage.getItem("token");
  if (!token) {
    setMessage("Jelentkezz be a törléshez!");
    return;
  }

  try {
const res = await fetch(`https://carguru.up.railway.app/api/tradein/delete/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });

    if (res.ok) {
      setMessage("Az autó sikeresen törölve!");
      await loadCars(); 
    } else {
      const errText = await res.text();
      console.error("Törlési hiba:", errText);
      setMessage("Hiba történt a törlés során!");
    }
  } catch (err) {
    console.error("Szerver hiba törlésnél:", err);
    setMessage("Nem sikerült törölni az autót.");
  }
};

  const handleEdit = (car) => {
  setEditingId(car.id);
  setShowSavedCars(false);
  setFormData({
    id: car.id,
    make: car.make || "",
    model: car.model || "",
    year: car.year || "",
    mileage: car.mileage || "",
    seats: car.seats || "",
    engine_displacement_cc: car.engineSize || "",
    fuel_type: car.fuelType || "",
    power_kw: car.power || "",
    condition_grade: car.condition || "",
    trunk_liters: car.luggage || "",
    body_style: car.bodyType || "",
    upholstery_color: car.interiorColor || "",
    color: car.color || "",
    gross_weight_kg: car.weight || "",
    drive_type: car.drivetrain || "",
    transmission: car.gearbox || "",
    documents: car.documents || "",
    technical_valid_until: car.technicalValidity || "",
    description: car.description || "",
  });
  setPreviewUrls(
  car.images?.map((img) => `https://carguru.up.railway.app${img.url}`) || []
);

  window.scrollTo({ top: 0, behavior: "smooth" });
};
const handleAccept = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Nincs bejelentkezve felhasználó!");
      return;
    }
    if (!id) {
      setMessage("Nincs kiválasztott autó az elfogadáshoz.");
      return;
    }

const res = await fetch(`https://carguru.up.railway.app/api/tradein/${id}/accept`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });

    if (!res.ok) {
      setMessage("Hiba az autó elfogadásakor!");
      return;
    }

    const data = await res.json();
    setMessage(data.message || "Az összeg sikeresen jóváírva!");

    await loadCars();

const profileRes = await fetch("https://carguru.up.railway.app/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    if (profileRes.ok) {
      const profile = await profileRes.json();
      localStorage.setItem("balance", profile.balance);
      console.log("Új egyenleg:", profile.balance);
    }

    setShowCalculation(false);
    setShowSavedCars(true);
    setTimeout(() => setMessage(""), 3000);
  } catch (err) {
    console.error("Elfogadási hiba:", err);
    setMessage("Kapcsolódási hiba a szerverhez.");
  }
};
const handleDecline = async () => {
  alert("Kalkuláció elutasítva");
  setShowCalculation(false);
  setShowSavedCars(true);
};

  return (
    <div className="car-form-container">
      <style>{`
        .car-form-container {
          max-width: 1100px;
          margin: 60px auto;
          background: #ffffff;
          padding: 40px 50px;
          border-radius: 20px;
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }
        .title {
          text-align: center;
          color: #222;
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 30px;
        }
        .car-form { display: flex; flex-direction: column; gap: 20px; }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
        .form-group { display: flex; flex-direction: column; }
        .form-group label { font-weight: 600; margin-bottom: 6px; color: #333; }
        .form-group input,
        .form-group textarea {
          padding: 10px 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 15px;
          transition: all 0.2s ease-in-out;
        }
        .form-group input:focus,
        .form-group textarea:focus {
          border-color: #007bff;
          box-shadow: 0 0 4px rgba(0, 123, 255, 0.3);
          outline: none;
        }
        .preview { display: flex; flex-wrap: wrap; gap: 15px; margin-top: 10px; }
        .preview img { width: 100px; height: 100px; object-fit: cover; border-radius: 10px; }
        button {
          width: 100%;
          background-color: #007bff;
          color: white;
          font-weight: 600;
          border: none;
          padding: 14px;
          border-radius: 10px;
          font-size: 16px;
          transition: background-color 0.3s ease;
          cursor: pointer;
        }
        button:hover { background-color: #0056b3; }
        button:disabled { background-color: #ccc; cursor: not-allowed; }
        .message { text-align: center; margin-top: 20px; font-weight: 600; font-size: 16px; }
        .message.success { color: #2e8b57; }
        .message.error { color: #cc0000; }

        .calc-box { margin-top: 30px; background: #f8fafc; border: 1px solid #d1d5db; padding: 25px; border-radius: 12px; text-align: center; }
        .calc-price { font-size: 26px; font-weight: 800; color: #1e90ff; margin: 10px 0 20px 0; }
        .calc-actions { display: flex; justify-content: center; gap: 20px; }
        .calc-actions button { padding: 12px 24px; border-radius: 8px; border: none; font-size: 16px; font-weight: 700; cursor: pointer; }
        .btn-accept { background-color: #22c55e; color: white; }
        .btn-decline { background-color: #ef4444; color: white; }

        .car-item { display: flex; justify-content: space-between; align-items: center; border: 1px solid #ddd; padding: 15px; margin-top: 12px; border-radius: 10px; background: #f9fafb; }
        .car-buttons { display: flex; gap: 10px; }
        .btn-edit { background: #007bff; color: white; padding: 8px 12px; border-radius: 8px; border: none; }
        .btn-delete { background: #ef4444; color: white; padding: 8px 12px; border-radius: 8px; border: none; }

        .saved-cars {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
}
.saved-car-card {
  display: flex;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: box-shadow 0.2s ease;
}
.saved-car-card:hover {
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
}
.saved-car-image img {
  width: 180px;
  height: 130px;
  object-fit: cover;
}
.saved-car-info {
  flex: 1;
  padding: 1rem 1.5rem;
}
.car-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0070f3;
  margin-bottom: 0.25rem;
}
.seller {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.4rem;
}
.car-meta {
  color: #444;
  margin-bottom: 0.6rem;
  font-size: 0.95rem;
}
.bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #111;
}
.buttons {
  display: flex;
  gap: 0.75rem;
}
.config-btn {
  background: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}
.config-btn:hover {
  background: #e0e0e0;
}
.remove-btn {
  background: none;
  border: none;
  color: #d00;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: underline;
}
  .car-description {
  margin-top: 8px;
  background: #f9fafb;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #444;
}
  .message {
  text-align: center;
  margin-top: 15px;
  font-size: 16px;
  font-weight: 600;
  transition: opacity 0.5s ease;
}
.message.success {
  color: #22c55e;
}
  .trade-buttons {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}
.trade-buttons button {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
}
.trade-buttons .btn-accept {
  background: #22c55e;
  color: white;
}
.trade-buttons .btn-accept:hover {
  background: #16a34a;
}
.trade-buttons .btn-decline {
  background: #ef4444;
  color: white;
}
.trade-buttons .btn-decline:hover {
  background: #dc2626;
}

      `}</style>

      <h2 className="title">Autó beszámítás / értékkalkulátor</h2>

      <form onSubmit={handleSubmit} className="car-form">
        <div className="grid">
          {[
            ["Márka", "make"],
            ["Típus / Modell", "model"],
            ["Évjárat", "year", "number"],
            ["Futott km", "mileage", "number"],
            ["Ülések száma", "seats", "number"],
            ["Motor (cm³)", "engine_displacement_cc", "number"],
            ["Üzemanyag", "fuel_type"],
            ["Teljesítmény (kW)", "power_kw", "number"],
            ["Állapot (1–5)", "condition_grade", "number"],
            ["Csomagtartó (liter)", "trunk_liters", "number"],
            ["Kivitel (pl. Sedan)", "body_style"],
            ["Kárpit színe", "upholstery_color"],
            ["Külső szín", "color"],
            ["Teljes tömeg (kg)", "gross_weight_kg", "number"],
            ["Hajtás", "drive_type"],
            ["Sebességváltó", "transmission"],
            ["Okmányok", "documents"],
            ["Műszaki érvényessége", "technical_valid_until"],
          ].map(([label, name, type = "text"], i) => (
            <div key={i} className="form-group">
              <label>{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name] || ""}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

        <div className="form-group full">
          <label>Részletes leírás</label>
          <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            placeholder="Írd ide az autó részletes állapotát, extrákat, megjegyzéseket..."
            rows="5"
          />
        </div>

        <div className="form-group full">
          <label>Képek feltöltése</label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} />
          <div className="preview">
            {previewUrls.map((url, i) => (
              <img key={i} src={url} alt="preview" />
            ))}
          </div>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading
            ? "Mentés..."
            : editingId
            ? "Autó módosítása"
            : "Autó mentése és kalkulálás"}
        </button>
      </form>

      {message && (
        <div className={`message ${message.startsWith("") ? "success" : "error"}`}>
          {message}
        </div>
      )}

      {showCalculation && (
  <div className="calc-box">
    <h3>Becsült érték</h3>
   <p className="calc-price">
  {serverEstimatedPrice != null ? serverEstimatedPrice.toLocaleString() : "-"} Ft
</p>


    <div className="calc-actions">
      {cars.length > 0 ? (
        <>
          <button className="btn-accept" onClick={() => handleAccept(lastSavedTradeInId)} disabled={!lastSavedTradeInId}>
  Elfogadom
</button>
          <button className="btn-decline" onClick={handleDecline}>
            Elutasítom
          </button>
        </>
      ) : (
        <p style={{ color: "#666" }}>
          Nincs elérhető autó az elfogadáshoz.
        </p>
      )}
    </div>
  </div>
)}

{showSavedCars && cars.length > 0 && (
  <div className="saved-cars">
    <h3>Mentett autóim</h3>

    {cars.map((car) => (
      <div key={car.id} className="saved-car-card">
        <div className="saved-car-image">
          <ImageRotator 
   images={car.images?.map((img) => `https://carguru.up.railway.app${img.url}`)}
/>

        </div>

        <div className="saved-car-info">
          <div className="car-title">
            {car.make} {car.model} ({car.year})
          </div>

          <p className="car-meta">
            {car.mileage?.toLocaleString()} km · {car.power} kW · {car.fuelType}
          </p>
          <p
            style={{
              color:
                car.status === "ACCEPTED"
                  ? "#16a34a"
                  : car.status === "DECLINED"
                  ? "#dc2626"
                  : "#555",
              fontWeight: 600,
            }}
          >
            {car.status === "ACCEPTED"
              ? "✅ Elfogadva"
              : car.status === "DECLINED"
              ? "Elutasítva"
              : "Függőben"}
          </p>

          <div className="trade-buttons">
            <button
              className="btn-edit"
              onClick={() => handleEdit(car)}
              disabled={car.status === "ACCEPTED"}
              style={{
                opacity: car.status === "ACCEPTED" ? 0.5 : 1,
                cursor: car.status === "ACCEPTED" ? "not-allowed" : "pointer",
              }}
            >
              Módosítás
            </button>

            <button
              className="btn-delete"
              onClick={() => handleDelete(car.id)}
              disabled={car.status === "ACCEPTED"}
              style={{
                opacity: car.status === "ACCEPTED" ? 0.5 : 1,
                cursor: car.status === "ACCEPTED" ? "not-allowed" : "pointer",
              }}
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

export default CarCalculator;