import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "https://carguru.up.railway.app";

export default function Cart() {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    try {
      if (!token) return;
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Nem sikerült lekérni a kosarat.");
      const data = await res.json();
      setCart(data || { items: [], total: 0 });
      setError(null);
    } catch (err) {
      setError(err.message || "Ismeretlen hiba.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated, fetchCart]);

  useEffect(() => {
    if (cart?.items?.length > 0) {
      console.log("Kosár tartalma:", cart.items);
    }
  }, [cart]);

  function goToConfigurator(item) {
    const id = item?.variantId;
    if (!id) {
      alert("Hiányzik a variáns azonosító.");
      return;
    }
    const brandSlug = item?.brandSlug || "audi";
    const modelSlug = item?.modelSlug || "a1";
    navigate(`/configurator/${brandSlug}/${modelSlug}/${id}/engine`);
  }

  async function handleRemove(itemId) {
    try {
      const res = await fetch(`${API_BASE}/api/cart/items/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Nem sikerült törölni a tételt.");
      await fetchCart();
    } catch (err) {
      alert(err.message || "Ismeretlen hiba történt törlés közben.");
    }
  }

  function handleContinueToPurchase() {
    if (!cart.items || cart.items.length === 0) {
      alert("A kosár üres, nem tudsz továbblépni!");
      return;
    }

    const firstItem = cart.items[0];
    const carData = {
      id: firstItem?.variantId || 1,
      name: firstItem?.titleSnapshot || "Ismeretlen modell",
      image: firstItem?.imageUrl || "/no-image.png",
      price: Number(firstItem?.priceSnapshot || 0),
    };

    navigate("/purchase", { state: { car: carData } });
  }

  if (!isAuthenticated) {
    return (
      <div className="cart-container">
        <h2>Be kell jelentkezned a kosár megtekintéséhez</h2>
      </div>
    );
  }

  if (loading) return <p className="cart-container">Betöltés...</p>;
  if (error) return <p className="cart-container error">{error}</p>;

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="cart-container">
        <h1>Kosár</h1>
        <p className="empty">A kosarad jelenleg üres.</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-items">
        <h1 className="cart-title">Kosár</h1>

        {cart.items.map((item) => {
          const price = Number(item?.priceSnapshot || 0);

          return (
            <div key={item.id} className="cart-card">
              <div className="cart-image">
                {item?.imageUrl ? (
                  <img src={item.imageUrl} alt={item?.titleSnapshot || "Termék"} />
                ) : (
                  <div className="no-image">Nincs kép</div>
                )}
              </div>

              <div className="cart-info">
                <h2
                  className="clickable-title"
                  onClick={() => {
                    if (item?.vin) navigate(`/stock/${item.vin}`);
                    else alert("Ehhez a tételhez nincs VIN. Kérlek a készletes oldalról add újra a kosárhoz.");
                  }}
                >
                  {item?.titleSnapshot || "Termék"}
                </h2>
                <p className="seller">Forgalmazza: CarGuru</p>

                <div className="bottom-row">
                  <div className="price">{price.toLocaleString("hu-HU")} Ft</div>
                  <div className="buttons">
                    <button onClick={() => goToConfigurator(item)} className="config-btn">
                      Konfiguráció
                    </button>
                    <button onClick={() => handleRemove(item.id)} className="remove-btn">
                      Törlés
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="cart-summary">
        <h2>Rendelés összegzése</h2>
        <div className="summary-row">
          <span>Összeg:</span>
          <span>{Number(cart.total || 0).toLocaleString("hu-HU")} Ft</span>
        </div>
        <hr />
        <div className="summary-total">
          <span>Végösszeg:</span>
          <span>{Number(cart.total || 0).toLocaleString("hu-HU")} Ft</span>
        </div>

        <button className="checkout-btn" onClick={handleContinueToPurchase}>
          Folytatás
        </button>
      </div>

      <style>{`
        .cart-page {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
          max-width: 1200px;
          margin: 2rem auto;
          padding: 0 1rem;
        }
        @media (max-width: 900px) { .cart-page { grid-template-columns: 1fr; } }
        .cart-items h1 { font-size: 2rem; margin-bottom: 1.5rem; font-weight: 700; }
        .cart-card {
          display: flex; background: #fff; border-radius: 1rem;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05); margin-bottom: 1.5rem;
          overflow: hidden; transition: box-shadow 0.2s ease;
        }
        .cart-card:hover { box-shadow: 0 3px 12px rgba(0,0,0,0.1); }
        .cart-image img { width: 180px; height: 150px; object-fit: cover; }
        .cart-info { flex: 1; padding: 1rem 1.5rem; }
        .clickable-title {
          font-size: 1.25rem; font-weight: 600; color: #0070f3;
          margin-bottom: 0.25rem; cursor: pointer; transition: color 0.2s;
        }
        .clickable-title:hover { color: #004bb5; text-decoration: underline; }
        .seller { color: #666; font-size: 0.9rem; margin-bottom: 0.5rem; }
        .bottom-row { display: flex; justify-content: space-between; align-items: center; }
        .price { font-size: 1.2rem; font-weight: 700; color: #111; }
        .buttons { display: flex; gap: 0.75rem; }
        .config-btn {
          background: #f5f5f5; border: 1px solid #ccc; border-radius: 0.5rem;
          padding: 0.4rem 0.8rem; cursor: pointer; transition: all 0.2s ease;
        }
        .config-btn:hover { background: #e0e0e0; }
        .remove-btn {
          background: none; border: none; color: #d00; font-size: 0.9rem;
          cursor: pointer; text-decoration: underline;
        }
        .cart-summary {
          background: #fff; border-radius: 1rem; box-shadow: 0 2px 6px rgba(0,0,0,0.05);
          padding: 1.5rem; height: fit-content;
        }
        .cart-summary h2 { font-size: 1.3rem; font-weight: 700; margin-bottom: 1rem; }
        .summary-row, .summary-total {
          display: flex; justify-content: space-between; font-size: 1rem; margin: 0.5rem 0;
        }
        .summary-total { font-size: 1.2rem; font-weight: 700; }
        .checkout-btn {
          margin-top: 1rem; width: 100%; background: linear-gradient(90deg, #0066ff, #003399);
          color: #fff; font-size: 1.1rem; font-weight: 600; padding: 0.75rem;
          border-radius: 0.75rem; border: none; cursor: pointer;
          transition: transform 0.15s ease, background 0.3s ease;
        }
        .checkout-btn:hover { transform: translateY(-1px); background: linear-gradient(90deg, #0055cc, #002266); }
        .cart-container { text-align: center; margin: 4rem auto; }
        .empty { font-size: 1.1rem; color: #555; }
        .error { color: red; }
      `}</style>
    </div>
  );
}
