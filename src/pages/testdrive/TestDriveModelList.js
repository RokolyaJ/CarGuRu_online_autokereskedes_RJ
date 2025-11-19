import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

function TestDriveModelList() {
  const { brandName } = useParams();
  const [variants, setVariants] = useState([]);
  const [filteredVariants, setFilteredVariants] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("");
  const [dealers, setDealers] = useState([]);
  const [selectedDealer, setSelectedDealer] = useState("");
  const navigate = useNavigate();


  const getCarImage = (brand, model) => {
    if (!brand || !model) return "/images/default-car.png";

    const formattedModel = model
      .toLowerCase()
      .replace(/[\s–-]+/g, "_")      
      .replace(/[^a-z0-9_]/g, "");   

    return `/images/new_cars/${brand.toLowerCase()}/${formattedModel}.jpg`;
  };

  useEffect(() => {
    fetch(`http://localhost:8080/api/stock/full-variants/by-brand/${brandName}`)
      .then((res) => res.json())
      .then((data) => {
        setVariants(data);
        setFilteredVariants(data);
        setModels([...new Set(data.map((v) => v.model).filter(Boolean))]);
      })
      .catch((err) => console.error("Hiba az autók betöltésekor:", err));

    fetch(`http://localhost:8080/api/stock/stores/by-brand/${brandName}`)
      .then((res) => res.json())
      .then((stores) => {
        setDealers(
          stores.map((store) => ({
            value: store.storeName,
            label: `${store.city ?? ""}${store.city ? " - " : ""}${store.storeName}`,
          }))
        );
      })
      .catch((err) => console.error("Hiba a boltok betöltésekor:", err));
  }, [brandName]);

  useEffect(() => {
    let filtered = [...variants];
    if (selectedModel) {
      filtered = filtered.filter(
        (v) => v.model?.toLowerCase() === selectedModel.toLowerCase()
      );
    }
    if (selectedFuel) {
      filtered = filtered.filter(
        (v) => v.fuel?.toLowerCase() === selectedFuel.toLowerCase()
      );
    }
    if (selectedDealer) {
      filtered = filtered.filter(
        (v) => v.storeName?.toLowerCase() === selectedDealer.toLowerCase()
      );
    }
    setFilteredVariants(filtered);
  }, [selectedModel, selectedFuel, selectedDealer, variants]);

  return (
    <div style={{ backgroundColor: "#f9f9f9", minHeight: "100vh", padding: "40px" }}>
      <h1 style={{ textAlign: "center", color: "#007000", marginBottom: "40px", fontWeight: "800" }}>
        REGISZTRÁLJ TESZTVEZETÉSRE – {brandName.toUpperCase()}
      </h1>

      <div style={{ display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap" }}>
        
        <div
          style={{
            width: "260px",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
            padding: "25px",
            height: "fit-content",
          }}
        >
          <h3 style={{ textAlign: "center", marginBottom: "15px" }}>Modellek</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "25px" }}>
            {models.map((model) => (
              <button
                key={model}
                onClick={() => setSelectedModel(model === selectedModel ? "" : model)}
                style={{
                  border: selectedModel === model ? "2px solid #007000" : "1px solid #ccc",
                  borderRadius: "20px",
                  padding: "6px 14px",
                  backgroundColor: selectedModel === model ? "#e8f5e9" : "white",
                  cursor: "pointer",
                }}
              >
                {model}
              </button>
            ))}
          </div>

          <h3 style={{ textAlign: "center", marginBottom: "10px" }}>Üzemanyag</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "25px" }}>
            {["benzin", "dízel", "elektromos", "hibrid"].map((fuel) => (
              <button
                key={fuel}
                onClick={() => setSelectedFuel(fuel === selectedFuel ? "" : fuel)}
                style={{
                  border: selectedFuel === fuel ? "2px solid #007000" : "1px solid #ccc",
                  borderRadius: "20px",
                  padding: "6px 14px",
                  backgroundColor: selectedFuel === fuel ? "#e8f5e9" : "white",
                  cursor: "pointer",
                }}
              >
                {fuel}
              </button>
            ))}
          </div>

          <h3 style={{ textAlign: "center", marginBottom: "10px" }}>Kereskedés</h3>
          <Select
            options={[{ value: "", label: "Összes kereskedő" }, ...dealers]}
            value={
              selectedDealer
                ? dealers.find((d) => d.value === selectedDealer)
                : { value: "", label: "Összes kereskedő" }
            }
            onChange={(option) => setSelectedDealer(option?.value || "")}
          />
        </div>

        <div style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: "25px", justifyContent: "center" }}>
          {filteredVariants.length > 0 ? (
            filteredVariants.map((v) => (
              <div
                key={v.id}
                style={{
                  width: "300px",
                  background: "#fff",
                  borderRadius: "15px",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
                  padding: "20px",
                }}
              >
              <img
  src={v.imageUrl || "/images/default-car.png"}
  alt={v.model}
  onError={(e) => (e.target.src = "/images/default-car.png")}
  style={{
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "10px",
  }}
/>

<h2>{v.model} {v.variant && `– ${v.variant}`}</h2>
<p><strong>Ár:</strong> {v.price?.toLocaleString()} Ft</p>
<p><strong>Teljesítmény:</strong> {v.powerHp ? `${v.powerHp} LE` : "—"}</p>
<p><strong>Üzemanyag:</strong> {v.fuel || "—"}</p>
<p><strong>Váltó:</strong> {v.transmission || "—"}</p>
<p><strong>Szalon:</strong> {v.storeName || "Nincs megadva"} ({v.city})</p>

               <button
  style={{
    width: "100%",
    padding: "10px 0",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "8px",
    marginTop: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  }}
  onClick={() =>
    navigate(`/test-drive/${brandName}/${v.id}/booking`, {
      state: { car: v }
    })
  }
>
  Kiválasztom
</button>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", color: "#555" }}>Nincs elérhető modell.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TestDriveModelList;
