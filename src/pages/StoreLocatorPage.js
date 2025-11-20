import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

const StoreLocatorPage = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [searchCity, setSearchCity] = useState("");
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);

const baseUrl = "https://carguru.up.railway.app";

  useEffect(() => {
    async function fetchStores() {
      try {
        const res = await fetch(`${baseUrl}/api/stock/stores`);
        if (!res.ok) throw new Error("Nem sikerült betölteni az üzleteket");
        const data = await res.json();
        setStores(data);
        setFilteredStores(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStores();
  }, []);

  useEffect(() => {
    const filtered = stores.filter(
      (s) =>
        s.city.toLowerCase().includes(searchCity.toLowerCase()) &&
        s.storeName.toLowerCase().includes(searchName.toLowerCase())
    );
    setFilteredStores(filtered);
  }, [searchCity, searchName, stores]);

  useLayoutEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .leaflet-control-zoom {
        position: absolute !important;
        bottom: 25px !important;
        right: 25px !important;
        top: auto !important;
        left: auto !important;
        z-index: 9999 !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
        border-radius: 10px;
      }
      .leaflet-bottom.leaflet-right {
        bottom: 25px !important;
        right: 25px !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const defaultPosition = [47.1625, 19.5033];

  const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  if (loading) return <p>🔄 Üzletek betöltése...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const handleSelectStore = (store) => {
    setSelectedStore(store);
    const coords = getCityCoords(store.city);

    const map = mapRef.current;
    if (map && map.flyTo) {
      map.flyTo(coords, 14, {
        animate: true,
        duration: 1.5,
      });
    }
  };

  return (
    <div
      style={{
        position: "relative",
        height: "calc(100vh - 80px)",
        marginTop: "80px",
        width: "calc(100% - 80px)",
        marginLeft: "40px",
        marginRight: "40px",
        maxWidth: "1600px",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 25px rgba(0,0,0,0.1)",
        background: "#fff",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "35px",
          left: "25px",
          zIndex: 999,
          width: "340px",
          maxHeight: "70vh",
          background: "rgba(255, 255, 255, 0.97)",
          borderRadius: "14px",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.12)",
          overflowY: "auto",
          padding: "18px 20px",
          backdropFilter: "blur(6px)",
          border: "1px solid rgba(0,0,0,0.05)",
          transition: "transform 0.3s ease, opacity 0.3s ease",
          transform: selectedStore ? "translateX(0)" : "translateX(0)",
          opacity: 1,
        }}
      >
        {selectedStore === null ? (
          <>
            <h2
              style={{
                fontSize: "1.3rem",
                marginBottom: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: "700",
              }}
            >
              <span role="img" aria-label="search">
              </span>{" "}
              Keresés
            </h2>

            <label style={{ fontWeight: "600", fontSize: "0.9rem" }}>
              Település
            </label>
            <input
              type="text"
              placeholder="Pl. Budapest"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              style={inputStyle}
            />

            <label style={{ fontWeight: "600", fontSize: "0.9rem" }}>
              Márkakereskedő neve
            </label>
            <input
              type="text"
              placeholder="Pl. Autohaus"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              style={inputStyle}
            />

           

            <hr style={{ margin: "18px 0" }} />

            <h3 style={{ fontSize: "1rem", marginBottom: "8px" }}>
              Márkakereskedések
            </h3>

            {filteredStores.length === 0 ? (
              <p style={{ fontSize: "0.9rem", color: "#666" }}>Nincs találat.</p>
            ) : (
              filteredStores.map((s) => (
                <div
                  key={s.id}
                  style={{
                    padding: "8px 0",
                    borderBottom: "1px solid #eee",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSelectStore(s)}
                >
                  <strong>{s.storeName}</strong>
                  <br />
                  <span style={{ fontSize: "0.9rem", color: "#555" }}>
                    {s.city}, {s.address}
                  </span>
                </div>
              ))
            )}
          </>
        ) : (
          <>
            <button
  onClick={() => {
    setSelectedStore(null);
    const map = mapRef.current;
    if (map && map.flyTo) {
      map.flyTo([47.1625, 19.5033], 7, {
        animate: true,
        duration: 1.5,
      });
    }
  }}
  style={{
    background: "none",
    border: "none",
    color: "#007bff",
    cursor: "pointer",
    marginBottom: "10px",
    fontWeight: "600",
    fontSize: "0.9rem",
  }}
>
  ⬅ Vissza
</button>


            <h3 style={{ fontSize: "1.2rem", fontWeight: "700" }}>
              {selectedStore.storeName}
            </h3>
            <p style={{ marginBottom: "8px", color: "#333" }}>
              {selectedStore.city}, {selectedStore.address}
            </p>

            <div style={{ marginTop: "15px" }}>
              <p style={{ margin: "6px 0" }}>
                Email: info@{selectedStore.city.toLowerCase()}.hu
              </p>
              <p style={{ margin: "6px 0" }}>
                Weboldal: www.
                {selectedStore.storeName.replace(/\s/g, "").toLowerCase()}.hu
              </p>
            </div>

            <button
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #000",
                borderRadius: "6px",
                background: "#fff",
                fontWeight: "600",
                cursor: "pointer",
                marginTop: "20px",
              }}
              onClick={() => {
                const coords = getCityCoords(selectedStore.city);
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${coords[0]},${coords[1]}`,
                  "_blank"
                );
              }}
            >
              Útvonaltervezés
            </button>
          </>
        )}
      </div>

      <div style={{ flex: 1, position: "relative", height: "100%" }}>
        <MapContainer
          center={defaultPosition}
          zoom={7}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          />
          {filteredStores.map((store) => (
            <Marker
              key={store.id}
              position={getCityCoords(store.city)}
              icon={customIcon}
              eventHandlers={{
                click: () => handleSelectStore(store),
              }}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

function getCityCoords(city) {
  const coords = {
    Budapest: [47.5008797, 19.0573633],
    Debrecen: [47.5304538, 21.6328155],
    Győr: [47.6859258, 17.6338332],
    Pécs: [46.0748333, 18.2397301],
    Szeged: [46.25123, 20.1418061],
    Miskolc: [48.1031701, 20.7779123],
    Nyíregyháza: [47.9554, 21.7167],
    Kecskemét: [46.8887707, 19.6413364],
    Székesfehérvár: [47.2030097, 18.3902654],
    Tatabánya: [47.5823552, 18.3994588],
    Zalaegerszeg: [46.842, 16.844],
    Sopron: [47.687319, 16.5929652],
    Veszprém: [47.092, 17.911],
    Eger: [47.902, 20.377],
    Szolnok: [47.173, 20.201],
    Békéscsaba: [46.682, 21.087],
    Nagykanizsa: [46.453, 16.989],
    Dunaújváros: [46.964, 18.935],
    Salgótarján: [48.097, 19.803],
    Esztergom: [47.792, 18.741],
  };
  return coords[city] || [47.1625, 19.5033];
}

const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  marginBottom: "10px",
  outline: "none",
  fontSize: "0.9rem",
};

const filterButton = {
  flex: 1,
  border: "1px solid #ccc",
  borderRadius: "6px",
  padding: "7px",
  background: "#f9fafb",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "0.9rem",
  transition: "0.2s",
};

export default StoreLocatorPage;
