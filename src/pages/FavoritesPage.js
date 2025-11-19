import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const API_BASE = "http://localhost:8080";

const fmt = (n) =>
  (Number(n) || 0).toLocaleString("hu-HU", { maximumFractionDigits: 0 });

export default function FavoritesPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth(); 

  useEffect(() => {
    let alive = true;

    async function load() {
      if (!user || !user.token) {
        console.warn("Nincs bejelentkezve → nincs kedvenc");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/favorites`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!res.ok) throw new Error("Nem sikerült lekérni a kedvenceket");

        const ids = await res.json();

        const carPromises = ids.map((id) =>
          fetch(`${API_BASE}/api/usedcars/${id}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }).then((r) => r.json())
        );

        const carDetails = await Promise.all(carPromises);

        if (alive) setCars(carDetails);
      } catch (e) {
        console.error("HIBA a kedvencek lekérésekor:", e);
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, [user]);

  return (
    <div>
      <Navbar />

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "90px 20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Kedvenc autóim</h1>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid #ddd",
              cursor: "pointer",
              background: "#fff",
            }}
          >
            ← Vissza
          </button>
        </div>

        {loading && <p>Betöltés...</p>}

        {!loading && cars.length === 0 && (
          <p>Még nincsenek kedvenc autóid.</p>
        )}

        <div
          style={{
            marginTop: 24,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {cars.map((car) => (
            <div
              key={car.id}
              onClick={() => navigate(`/used-cars/${car.id}`)}
              style={{
                cursor: "pointer",
                borderRadius: 10,
                border: "1px solid #ddd",
                overflow: "hidden",
                background: "#fff",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)",
              }}
            >
              <img
                src={
                  car.images && car.images.length > 0
                    ? car.images[0]
                    : "/placeholder.png"
                }
                alt={`${car.brand} ${car.model}`}
                style={{ width: "100%", height: 180, objectFit: "cover" }}
                onError={(e) => (e.currentTarget.src = "/placeholder.png")}
              />

              <div style={{ padding: 12 }}>
                <h3 style={{ margin: "0 0 4px" }}>
                  {car.brand} {car.model}
                </h3>

                <p style={{ margin: 0, color: "#667085", fontSize: 14 }}>
                  {car.year} • {fmt(car.mileage)} km • {car.fuel}
                </p>

                <strong style={{ color: "#ef530f", fontSize: 16 }}>
                  {fmt(car.price)} Ft
                </strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
