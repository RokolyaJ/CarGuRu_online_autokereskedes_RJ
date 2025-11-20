import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Car, CreditCard, Calendar, AlertCircle, User, Truck, ShieldCheck } from "lucide-react";

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
const baseUrl = "https://carguru.up.railway.app";

  useEffect(() => {
    if (!user || !user.id) {
      setError("Jelentkezz be a rendeléseid megtekintéséhez!");
      setLoading(false);
      return;
    }

    async function fetchOrders() {
      try {
        const res = await fetch(`${baseUrl}/api/orders/get-by-user?userId=${user.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        } else {
          setError("Hiba történt a rendelések lekérésekor.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Nem sikerült kapcsolódni a szerverhez.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user]);

  if (loading) return <div className="loading-screen">Betöltés...</div>;

  if (error) {
    return (
      <div className="error-screen">
        <AlertCircle className="error-icon" size={48} />
        <p className="error-text">{error}</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1 className="orders-title">Saját rendeléseim</h1>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <Car size={60} className="empty-icon" />
            <p>Még nem adtál le rendelést.</p>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <h2>Rendelés #{order.id}</h2>
                  <p className="order-date">
                    <Calendar size={16} />{" "}
                    {new Date(order.createdAt).toLocaleString("hu-HU")}
                  </p>
                </div>

                <div className="order-details">
                  <div className="order-item">
                    <Car className="icon car-icon" size={22} />
                    <div>
                      <p className="item-title">Autó ID: {order.carId}</p>
                      <p className="item-sub">További részletek hamarosan</p>
                    </div>
                  </div>

                  <div className="order-item">
                    <CreditCard className="icon card-icon" size={22} />
                    <div>
                      <p className="item-title">Fizetés módja: {order.payment}</p>
                      <p
                        className={`status ${
                          order.paymentStatus === "PAID"
                            ? "paid"
                            : order.paymentStatus === "PARTIALLY_PAID"
                            ? "partial"
                            : "pending"
                        }`}
                      >
                        {order.paymentStatus === "PAID"
                          ? "Kifizetve"
                          : order.paymentStatus === "PARTIALLY_PAID"
                          ? "Részben fizetve"
                          : "Függőben"}
                      </p>
                    </div>
                  </div>

                  <div className="order-price">
                     {order.totalPriceHuf?.toLocaleString("hu-HU")} Ft
                    {order.leasingMonths && (
                      <p className="leasing">
                        Lízing futamidő: {order.leasingMonths} hónap
                      </p>
                    )}
                  </div>
                </div>

                <div className="info-block">
                  <h3><User size={18} /> Vevő adatai</h3>
                  <p><b>Név:</b> {order.fullName || "N/A"}</p>
                  <p><b>Telefon:</b> {order.phone || "N/A"}</p>
                  <p><b>Cím:</b> {order.country}, {order.city}, {order.address}</p>
                </div>

                <div className="info-block">
                  <h3><Truck size={18} /> Szállítás</h3>
                  <p><b>Szállítási mód:</b> {order.deliveryMethod || "N/A"}</p>
                  <p><b>Átvételi hely:</b> {order.pickupLocation || "N/A"}</p>
                </div>

                <div className="info-block">
                  <h3><ShieldCheck size={18} /> Biztosítás</h3>
                  <p><b>Biztosító:</b> {order.insuranceProvider || "N/A"}</p>
                  <p><b>Típus:</b> {order.insuranceType || "N/A"}</p>
                  <p><b>Bónusz:</b> {order.insuranceBonusLevel || "N/A"}</p>
                  <p><b>Időtartam:</b> {order.insuranceDurationMonths || 0} hónap</p>
                  <p><b>Éves díj:</b> {order.insuranceEstimatedFee?.toLocaleString("hu-HU")} Ft</p>
                </div>

                <div className="info-block">
                  <h3>Dokumentum státuszok</h3>
                  <p><b>Személyi igazolvány:</b> {order.idCardStatus || "N/A"}</p>
                  <p><b>Lakcímkártya:</b> {order.addressCardStatus || "N/A"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        body {
          background: linear-gradient(135deg, #e3f2fd, #ede7f6);
          font-family: 'Segoe UI', Roboto, sans-serif;
        }
        .orders-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 60px 20px;
        }
        .orders-container {
          background: white;
          border-radius: 24px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.1);
          padding: 40px;
          max-width: 1000px;
          width: 100%;
        }
        .orders-title {
          text-align: center;
          font-size: 2rem;
          font-weight: 700;
          color: #1a237e;
          margin-bottom: 40px;
        }
        .orders-grid {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        .order-card {
          background: #fafafa;
          border-radius: 18px;
          border: 1px solid #e0e0e0;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }
        .order-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #eee;
          padding-bottom: 8px;
          margin-bottom: 16px;
        }
        .order-details {
          margin-bottom: 10px;
        }
        .info-block {
          background: #f5f6fa;
          border-radius: 12px;
          padding: 12px 16px;
          margin-top: 14px;
          border-left: 4px solid #3949ab;
        }
        .info-block h3 {
          color: #283593;
          font-size: 1rem;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .info-block p {
          font-size: 0.9rem;
          color: #444;
          margin: 2px 0;
        }
        .paid { color: #2e7d32; }
        .partial { color: #fbc02d; }
        .pending { color: #757575; }
      `}</style>
    </div>
  );
}
