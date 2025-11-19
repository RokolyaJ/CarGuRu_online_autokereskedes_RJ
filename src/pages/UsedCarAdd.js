import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

export default function UsedCarAdd() {
  const [form, setForm] = useState({
    brand: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    fuel: "",
    engineSize: "",
    transmission: "",
    bodyType: "",
    condition: "",
    doors: "",
    seats: "",
    trunkCapacity: "",
    drivetrain: "",
    engineId: "",
    klimaType: "",
    docs: "",
    tireSize: "",
    location: "",
    dealer: "",
    description: "",
  });

  const [features, setFeatures] = useState({
    dontheto_ules: false,
    futheto_ules: false,
    ulesmagassag: false,
    multikormany: false,
    derektamasz: false,
    borkormany: false,
    fuggoleges_legzsak: false,
    hatso_oldal_legzsak: false,
    isofix: false,
    kikapcsolhato_legzsak: false,
    oldalso_legzsak: false,
    utas_legzsak: false,
    vezeto_legzsak: false,
    terd_legzsak: false,
    kozepso_legzsak: false,
    allithato_kormany: false,
    fedelzeti_komputer: false,
    tolatokamera: false,
    abs: false,
    asr: false,
    esp: false,
    savtarto: false,
    guminyomas_ellenorzo: false,
    tavolsagtarto_tempomat: false,
    veszfek: false,
    szervokormany: false,
    sebessegfuggo_szervokormany: false,
    centralzar: false,
    kodlampa: false,
    menetfeny: false,
    elektromos_ablak_elol: false,
    elektromos_ablak_hatul: false,
    elektromos_tukor: false,
    radio: false,
    bluetooth: false,
    erintokijelzo: false,
    hangszoro6: false,
    multikijelzo: false,
    kormany_hifi: false,
  });

  const featureCategories = {
    Muszaki: [
      "abs",
      "asr",
      "esp",
      "savtarto",
      "tavolsagtarto_tempomat",
      "menetfeny",
      "kodlampa",
      "tolatokamera",
    ],
    Kenyelmi: [
      "dontheto_ules",
      "futheto_ules",
      "multikormany",
      "ulesmagassag",
      "allithato_kormany",
      "borkormany",
      "derektamasz",
      "kormany_hifi",
    ],
    Biztonsag: [
      "vezeto_legzsak",
      "utas_legzsak",
      "oldalso_legzsak",
      "hatso_oldal_legzsak",
      "fuggoleges_legzsak",
      "kikapcsolhato_legzsak",
      "terd_legzsak",
    ],
    Media: ["radio", "bluetooth", "multikijelzo", "erintokijelzo", "hangszoro6"],
  };

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [fuels, setFuels] = useState([]);
  const [bodies, setBodies] = useState([]);
  const [engines, setEngines] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("usedCarData");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.car) setForm(parsed.car);
      if (parsed.features) setFeatures(parsed.features);
    }
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8080/api/catalog/brands").then((res) => setBrands(res.data));
    axios.get("http://localhost:8080/api/usedcars/fuels").then((res) => setFuels(res.data));
    axios.get("http://localhost:8080/api/usedcars/bodies").then((res) => setBodies(res.data));
  }, []);

  useEffect(() => {
    if (form.brand) {
      axios
        .get(`http://localhost:8080/api/catalog/models?brand=${form.brand}`)
        .then((res) => setModels(res.data));
    }
  }, [form.brand]);

  useEffect(() => {
    if (form.brand && form.model) {
      axios
        .get("http://localhost:8080/api/engines", {
          params: { brand: form.brand, model: form.model },
        })
        .then((res) => setEngines(res.data || []));
    } else {
      setEngines([]);
    }
  }, [form.brand, form.model]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFeatureChange = (e) => {
    setFeatures({ ...features, [e.target.name]: e.target.checked });
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  const formData = { car: form, features: features };
  localStorage.setItem("usedCarData", JSON.stringify(formData));
  console.log("📦 Adatok ideiglenesen mentve localStorage-ba");
  window.location.href = "/used-cars/temp/images";
};


  return (
    <div className="usedcar-container">
      <Navbar />
      <div className="form-wrapper">
        <h2 className="form-title">🚗 Új használt autó hirdetés</h2>

        <form onSubmit={handleSubmit} className="form-grid">
          <div>
            <label>Márka</label>
            <select name="brand" value={form.brand} onChange={handleChange} required>
              <option value="">Válassz</option>
              {brands.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Modell</label>
            <select
              name="model"
              value={form.model}
              onChange={handleChange}
              disabled={!form.brand}
              required
            >
              <option value="">Válassz</option>
              {models.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>

         <div>
  <label>Motor</label>
  <select
    name="engineId"  
    value={form.engineId}
    onChange={handleChange}
    disabled={!form.brand || !form.model}
  >
    <option value="">Válassz</option>
    {engines.map((e) => (
      <option key={e.id} value={e.id}>{e.name}</option>
    ))}
  </select>
</div>


          <div>
            <label>Évjárat</label>
            <input type="number" name="year" value={form.year} onChange={handleChange} required />
          </div>

          <div>
            <label>Ár (Ft)</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} required />
          </div>

          <div>
            <label>Kilométer</label>
            <input type="number" name="mileage" value={form.mileage} onChange={handleChange} required />
          </div>

          <div>
            <label>Üzemanyag</label>
            <select name="fuel" value={form.fuel} onChange={handleChange} required>
              <option value="">Válassz</option>
              {fuels.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Motor (cm³)</label>
            <input type="number" name="engineSize" value={form.engineSize} onChange={handleChange} />
          </div>

          <div>
            <label>Váltó</label>
            <input type="text" name="transmission" value={form.transmission} onChange={handleChange} />
          </div>

          <div>
            <label>Karosszéria</label>
            <select name="bodyType" value={form.bodyType} onChange={handleChange}>
              <option value="">Válassz</option>
              {bodies.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Állapot</label>
            <input type="text" name="condition" value={form.condition} onChange={handleChange} />
          </div>

          <div>
            <label>Ajtók száma</label>
            <input type="number" name="doors" value={form.doors} onChange={handleChange} />
          </div>

          <div>
            <label>Ülések</label>
            <input type="number" name="seats" value={form.seats} onChange={handleChange} />
          </div>

          <div>
            <label>Csomagtér (L)</label>
            <input
              type="number"
              name="trunkCapacity"
              value={form.trunkCapacity}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Hajtás</label>
            <input type="text" name="drivetrain" value={form.drivetrain} onChange={handleChange} />
          </div>

          <div>
            <label>Klíma típusa</label>
            <input type="text" name="klimaType" value={form.klimaType} onChange={handleChange} />
          </div>

          <div>
            <label>Okmányok</label>
            <input type="text" name="docs" value={form.docs} onChange={handleChange} />
          </div>

          <div>
            <label>Gumi méret</label>
            <input type="text" name="tireSize" value={form.tireSize} onChange={handleChange} />
          </div>

          <div>
            <label>Helyszín</label>
            <input type="text" name="location" value={form.location} onChange={handleChange} />
          </div>

          <div>
            <label>Kereskedő</label>
            <input type="text" name="dealer" value={form.dealer} onChange={handleChange} />
          </div>

          <h3 className="feature-title">Felszereltségek</h3>
          <div className="feature-sections">
            {Object.keys(featureCategories).map((category) => (
              <div key={category} className="feature-category-block">
                <h4 className="category-title">{category}</h4>
                <div className="features-list">
                  {featureCategories[category].map((key) => (
                    <label key={key} className="feature-item">
                      <input
                        type="checkbox"
                        name={key}
                        checked={features[key]}
                        onChange={handleFeatureChange}
                      />
                      {key.replace(/_/g, " ")}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ gridColumn: "1 / 3" }}>
            <label>Leírás</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="5"
              placeholder="Írj részletes leírást az autóról..."
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                fontSize: "14px",
                resize: "vertical",
              }}
            ></textarea>
          </div>

          <button type="submit" className="submit-btn">
            Tovább a képfeltöltéshez
          </button>
        </form>
      </div>

      <style>{`
        .usedcar-container {
          background: #f5f6f8;
          min-height: 100vh;
          padding-top: 80px;
        }
        .form-wrapper {
          max-width: 900px;
          margin: auto;
          background: white;
          padding: 30px 40px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        }
        .form-title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 25px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px 30px;
        }
        label {
          font-size: 14px;
          font-weight: 500;
          color: #333;
          display: inline-block;
          margin-right: 8px;
          margin-bottom: 6px;
        }
        input, select {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 14px;
        }
        .submit-btn {
          grid-column: 1 / 3;
          margin-top: 20px;
          padding: 14px;
          background-color: #1976d2;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
        }
        .submit-btn:hover {
          background-color: #125aa0;
        }
        .feature-title {
          grid-column: 1 / 2;
          margin-top: 30px;
          font-size: 20px;
          font-weight: 600;
        }
        .feature-sections {
          grid-column: 1 / 3;
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 30%;
        }
        .features-list {
          display: flex;
          flex-wrap: wrap;
          gap: 12px 20px;
        }
        textarea {
          font-family: inherit;
          outline: none;
        }
        textarea:focus {
          border-color: #1976d2;
          box-shadow: 0 0 0 3px rgba(25,118,210,0.15);
        }
      `}</style>
    </div>
  );
}
