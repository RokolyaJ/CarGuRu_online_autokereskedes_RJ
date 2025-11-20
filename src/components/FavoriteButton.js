import { FiHeart } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

const API_BASE = "https://carguru.up.railway.app";

export default function FavoriteButton({ carId, size = 26 }) {
  const { user } = useAuth();
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !user.token) return;

    fetch(`${API_BASE}/api/favorites`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Nem sikerült lekérni a kedvencek listáját");
        return r.json();
      })
      .then((ids) => {
        if (Array.isArray(ids)) {
          setIsFav(ids.includes(carId));
        }
      })
      .catch((err) => console.error(err));
  }, [carId, user]);

  const toggleFavorite = async (e) => {
    e.stopPropagation();

    if (!user || !user.token) {
      alert("A kedvencek használatához be kell jelentkezni.");
      return;
    }

    if (loading) return;
    setLoading(true);

    const method = isFav ? "DELETE" : "POST";

    try {
      const res = await fetch(`${API_BASE}/api/favorites/${carId}`, {
        method,
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json", 
        },
      });

      if (!res.ok) {
        console.error("Szerver hiba:", res.status);
        return;
      }

      setIsFav(!isFav);
    } catch (err) {
      console.error("Kedvenc hiba:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      style={{
        border: "none",
        background: "rgba(0,0,0,0.45)",
        borderRadius: "999px",
        padding: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      <FiHeart
        size={size}
        color={isFav ? "red" : "white"}
        style={{ filter: "drop-shadow(0 0 4px rgba(0,0,0,0.8))" }}
      />
    </button>
  );
}
