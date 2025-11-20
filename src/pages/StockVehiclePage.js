import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_BASE = "https://carguru.up.railway.app";

const StockVehiclePage = () => {
  const { vin } = useParams();

  const { user, token: contextToken, isAuthenticated } = useAuth();
  const token = contextToken || user?.token || null;

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBottomBar, setShowBottomBar] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const documentHeight = document.body.scrollHeight;
      const windowHeight = window.innerHeight;
      setShowBottomBar(scrollY + windowHeight >= documentHeight - 600);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
const response = await axios.get(`${API_BASE}/api/stock-vehicle/${vin}`);
        setVehicle(response.data);
      } catch (err) {
        console.error(err);
        setError("Nem sikerült betölteni az autó adatait.");
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [vin]);
  const handleOfferSubmit = async (formData) => {
    try {
      await axios.post(`${API_BASE}/api/offer/request`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Köszönjük, fogadtuk az ajánlatkérést!");
      setShowOfferForm(false);
    } catch (err) {
      alert("Hiba történt az ajánlatkérés során.");
    }
  };

  const handleAddToCart = async () => {
    if (!vehicle) return;

    if (!isAuthenticated || !token) {
      alert("Be kell jelentkezned, hogy a kosárba helyezhess autót!");
      return;
    }

    try {
      console.log("Kosár POST indítása tokennel:", token);

      const res = await axios.post(
        `${API_BASE}/api/cart/items`,
        {          vin: vehicle.vin,
          modelId: vehicle.modelId || null,
          configurationId: null,
          quantity: 1,
          titleSnapshot: `${vehicle.brand} ${vehicle.model}`,
          priceSnapshot: vehicle.priceHuf,
          imageUrl: vehicle.imageFrontUrl || vehicle.imageInteriorUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Kosárba helyezés válasz:", res.status, res.data);
      alert(`${vehicle.brand} ${vehicle.model} hozzáadva a kosárhoz!`);
    } catch (err) {
      console.error("Kosárba helyezés hiba:", err.response || err);
      alert("Nem sikerült hozzáadni a kosárhoz.");
    }
  };

  if (loading) return <div className="loading">Betöltés...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!vehicle) return null;

  return (
    <div className="stock-page">
      <style>{`
        html { scrollbar-gutter: stable both-edges; }
        *, *::before, *::after { box-sizing: border-box; }
        body {
          background: #fff;
          margin: 0;
          font-family: "BMW Type", "Helvetica Neue", Arial, sans-serif;
          color: #111;
          line-height: 1.35;
        }
   .stock-page {
     
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          background: #fff;
        }

        .main-section {
          flex: 1;
          padding: 60px 80px;
          margin-top: 70px;
        }

        .vehicle-header h1 {
          font-size: 2.6rem;
          font-weight: 700;
          margin: 0 0 6px 0;
        }
        .model-code { color: #666; font-size: 1rem; margin: 0 0 24px 0; }

        .main-image img {
          width: 100%; height: auto; border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08); margin-bottom: 24px;
        }

        .gallery { display: flex; gap: 15px; margin-bottom: 40px; }
        .gallery img {
          width: 30%; height: auto; border-radius: 8px;
          cursor: pointer; transition: transform .25s ease;
        }
        .gallery img:hover { transform: scale(1.05); }

        .details-section { margin-bottom: 60px; }
        .details-section h2 {
          font-size: 1.6rem; font-weight: 700;
          border-bottom: 2px solid #000; padding-bottom: 6px; margin-bottom: 22px;
        }

        .spec-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 18px;
        }
        .spec-item { display: flex; flex-direction: column; }
        .spec-label { color: #666; font-size: .92rem; margin-bottom: 2px; }
        .spec-value { font-weight: 600; font-size: 1rem; }

        .sidebar {
          width: 380px; background: #fff; border-left: 1px solid #e3e3e3;
          padding: 40px 30px 200px 30px; margin-top: 110px;
        }

        .sidebar h1 { font-size: 1.9rem; margin: 0 0 10px 0; line-height: 1.15; }
        .sidebar p.vin { color: #777; font-size: .95rem; margin: 0 0 18px 0; }

        .tag-container { display: flex; gap: 10px; margin-bottom: 20px; }
        .tag {
          background: #f0f2f5; color: #000; font-size: .85rem; font-weight: 600;
          padding: 6px 10px; border-radius: 6px;
        }

        .price-title { color: #333; font-size: .95rem; margin: 22px 0 6px; }
        .price {
          font-size: 2.1rem; font-weight: 800; margin: 0 0 12px 0; letter-spacing: .2px;
        }

        .dealer {
          display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: .98rem; margin-bottom: 22px;
        }
        .dealer::before { content: ""; font-size: 1.1rem; }

        .button-primary,
        .button-secondary,
        .button-cart {
          width: 100%; padding: 14px 16px; font-size: 1rem; font-weight: 600;
          border-radius: 8px; cursor: pointer; transition: all .2s ease;
        }
        .button-primary {
          background: #1967d2; color: #fff; border: none; margin-bottom: 12px;
        }
        .button-primary:hover { background: #1558b5; }

        .button-cart {
          background: #10b981; color: #fff; border: none; margin-bottom: 12px;
        }
        .button-cart:hover { background: #0d946b; }

        .button-secondary {
          background: transparent; color: #000; border: 1px solid #ccc;
        }
        .button-secondary:hover { background: #f7f7f7; }

        .save-vehicle {
          display: flex; align-items: center; gap: 8px; color: #000;
          margin-top: 26px; font-weight: 500; cursor: pointer;
        }
        .save-vehicle::before { content: "♡"; font-size: 1.15rem; }

        .bottom-bar {
          position: fixed; left: 0; right: 0; bottom: 0;
          background: #fff; box-shadow: 0 -2px 10px rgba(0,0,0,.1);
          z-index: 10; padding: 14px 0;
        }
        .bottom-bar__content {
          width: min(1200px, 100% - 40px); margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between; gap: 24px;
        }
        .bottom-model { font-weight: 600; font-size: 1.05rem; }
        .bottom-price { font-weight: 800; font-size: 1.3rem; }
        .bottom-cta {
          background: #1967d2; color: #fff; border: none;
          padding: 12px 28px; border-radius: 8px; font-weight: 700;
          cursor: pointer; transition: background .2s;
        }
        .bottom-cta:hover { background: #1558b5; }
        .offer-overlay { 
        position: fixed; 
        inset: 0; 
        background: rgba(0,0,0,0.5); 
        display: flex; 
        justify-content: flex-end;
       align-items: stretch; 
       z-index: 9999; 
       transition: background 0.3s ease; } 
       .offer-modal { background: #fff; 
       padding: 30px; 
       width: 420px; 
       max-width: 90%; 
       box-shadow: -4px 0 20px rgba(0,0,0,0.2); 
       border-top-left-radius: 12px; 
       border-bottom-left-radius: 12px;
        animation: slideIn 0.35s ease forwards; 
        overflow-y: auto; }

.offer-modal h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.5rem;
  text-align: center;
}

.offer-modal input {
  display: block;
  width: 100%;
  margin-bottom: 12px;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

      `}</style>

      <main className="main-section">
        <div className="vehicle-header">
          <h1>{vehicle.brand} {vehicle.model}</h1>
          <p className="model-code">{vehicle.modelCode}</p>
        </div>

        <div className="main-image">
          <img src={vehicle.imageFrontUrl || vehicle.imageInteriorUrl} alt="Autó" />
        </div>

        <div className="gallery">
          {[vehicle.imageFrontUrl, vehicle.imageSideUrl, vehicle.imageBackUrl]
            .filter(Boolean)
            .map((img, idx) => (
              <img key={idx} src={img} alt={`Kép ${idx + 1}`} />
            ))}
        </div>

        <section className="details-section">
          <h2>Jármű részletek</h2>
          <div className="spec-grid">
            <Spec label="Motor" value={`${vehicle.fuelType} | ${vehicle.powerKw} kW (${vehicle.powerHp} LE)`} />
            <Spec label="Sebességváltó" value={vehicle.transmission} />
            <Spec label="Fényezés" value={vehicle.extColor} />
            <Spec label="Belső szín" value={vehicle.intColor} />
            <Spec label="Gyártás éve" value={vehicle.year} />
          </div>
        </section>
      </main>

      <aside className="sidebar">
        <h1>{vehicle.brand} {vehicle.model}</h1>
        <p className="vin">Alvázszám {vehicle.vin}</p>
        <div className="tag-container">
          <div className="tag">Új autó</div>
          <div className="tag">Online foglalható</div>
        </div>
        <p className="price-title">Ajánlati ár</p>
        <p className="price">{vehicle.priceHuf?.toLocaleString("hu-HU")} Ft</p>
        <div className="dealer">Linartech Group Kft.</div>

        <button className="button-cart" onClick={handleAddToCart}>
          Kosárba
        </button>

        <button className="button-primary" onClick={() => setShowOfferForm(true)}>Ajánlatkérés</button>
        <button className="button-secondary">Online foglalás</button>
        <div className="save-vehicle">Jármű mentése</div>
      </aside>

           {showBottomBar && (
        <div className="bottom-bar">
          <div className="bottom-bar__content">
            <div className="bottom-model">{vehicle.brand} {vehicle.model}</div>
            <div className="bottom-price">{vehicle.priceHuf?.toLocaleString("hu-HU")} Ft</div>
            <button className="bottom-cta" onClick={handleAddToCart}>
              Kosárba
            </button>
          </div>
        </div>
      )}

{showOfferForm && (
  <div className="offer-overlay">
    <div className="offer-modal">
      <h2>Ajánlatkérés</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = {
            vin: vehicle.vin,
            megszolitas: e.target.megszolitas.value,
            keresztnev: e.target.keresztnev.value,
            vezeteknev: e.target.vezeteknev.value,
            phone: e.target.phone.value,
            email: e.target.email.value,
            utca: e.target.utca.value,
            hazszam: e.target.hazszam.value,
            iranyitoszam: e.target.iranyitoszam.value,
            telepules: e.target.telepules.value,
            dealer: "Linartech Group Kft.",
            message: e.target.message.value,
          };
          handleOfferSubmit(formData);
        }}
      >
        <select name="megszolitas" required>
          <option value="">Megszólítás</option>
          <option value="Úr">Úr</option>
          <option value="Asszony">Asszony</option>
          <option value="Kisasszony">Kisasszony</option>
        </select>

        <input name="vezeteknev" placeholder="Vezetéknév" required />
        <input name="keresztnev" placeholder="Keresztnév" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="phone" placeholder="Telefonszám" required />
        <input name="iranyitoszam" placeholder="Irányítószám" />
        <input name="telepules" placeholder="Település" />
        <input name="utca" placeholder="Utca" />
        <input name="hazszam" placeholder="Házszám" />
        <textarea name="message" placeholder="Üzenet (opcionális)" rows={4} />

        <div style={{ marginTop: "12px", display: "flex", gap: "10px" }}>
          <button type="submit" className="button-primary">Küldés</button>
          <button
            type="button"
            className="button-secondary"
            onClick={() => setShowOfferForm(false)}
          >
            Mégse
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};


const Spec = ({ label, value }) => (
  <div className="spec-item">
    <p className="spec-label">{label}</p>
    <p className="spec-value">{value || "-"} </p>
  </div>
);

export default StockVehiclePage;
