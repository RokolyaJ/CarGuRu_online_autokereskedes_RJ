import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Car, ShieldCheck, Truck, Home, FileText } from "lucide-react";

export default function OrderSummaryPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { order, insurance, delivery, total } = location.state || {};

  return (
    <div className="order-summary-page">
      <div className="summary-container">
        <div className="summary-header">
          <CheckCircle className="icon-success" size={70} />
          <h1>Köszönjük a rendelésedet!</h1>
          <p>A rendelésed sikeresen rögzítettük. A részleteket elküldtük e-mailben.</p>
        </div>

        <div className="summary-sections">
          <div className="card light">
            <h2>
              <FileText size={20} className="icon-indigo" /> Rendelés összefoglaló
            </h2>
            <p>
              <strong>Rendelés azonosító:</strong> #{order?.id || "N/A"}
            </p>
            <p>
              <strong>Dátum:</strong>{" "}
              {new Date(order?.createdAt || Date.now()).toLocaleString("hu-HU")}
            </p>
          </div>

          <div className="card blue">
            <h2>
              <Car size={20} className="icon-blue" /> Autó adatok
            </h2>
            {order?.car ? (
              <div className="car-details">
                <img
                  src={order.car.image || "/car-placeholder.png"}
                  alt={order.car.name}
                />
                <div>
                  <p className="car-name">{order.car.name}</p>
                  <p className="car-model">{order.car.model}</p>
                  <p className="car-price">
                    {order.car.price?.toLocaleString("hu-HU")} Ft
                  </p>
                </div>
              </div>
            ) : (
              <p>Nincs autó adat.</p>
            )}
          </div>

          <div className="grid">
            <div className="card green">
              <h2>Fizetési mód</h2>
              <p>
                <strong>{order?.payment || "Ismeretlen"}</strong>
              </p>
              <p className="text-gray">
                Összeg: {total?.toLocaleString("hu-HU")} Ft
              </p>
            </div>

            <div className="card yellow">
              <h2>
                <ShieldCheck size={20} className="icon-yellow" /> Biztosítás
              </h2>
              {insurance ? (
                <>
                  <p>
                    {insurance.provider} – {insurance.type}
                  </p>
                  <p>
                    <strong>{insurance.price.toLocaleString("hu-HU")} Ft / év</strong>
                  </p>
                </>
              ) : (
                <p>Nem választottál biztosítást.</p>
              )}
            </div>
          </div>

          <div className="card purple">
            <h2>
              <Truck size={20} className="icon-purple" /> Szállítás
            </h2>
            {delivery ? (
              <>
                <p>
                  <strong>Típus:</strong>{" "}
                  {delivery.type === "IN_STORE"
                    ? "Személyes átvétel"
                    : "Házhoz szállítás"}
                </p>
                {delivery.type === "HOME_DELIVERY" && (
                  <p>
                    {delivery.city}, {delivery.zip} – {delivery.addressLine}
                  </p>
                )}
                <p>
                  <strong>Várható átvétel:</strong>{" "}
                  {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(
                    "hu-HU"
                  )}
                </p>
              </>
            ) : (
              <p>Nincs szállítási adat.</p>
            )}
          </div>
        </div>

        <div className="button-row">
          <button onClick={() => navigate("/")} className="btn gray">
            <Home size={18} /> Főoldalra
          </button>
          <button
  onClick={() =>
    navigate("/my-orders", {
      state: { order, insurance, delivery, total },
    })
  }
  className="btn blue"
>
  Saját rendeléseim
</button>
        </div>
      </div>

      <style>{`
        .order-summary-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #ebf4ff, #eef2ff);
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 60px 20px;
          font-family: 'Segoe UI', sans-serif;
        }
        .summary-container {
          background: white;
          border-radius: 20px;
          padding: 50px;
          max-width: 850px;
          width: 100%;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .summary-header {
          text-align: center;
          margin-bottom: 50px;
        }
        .summary-header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          margin-top: 10px;
        }
        .summary-header p {
          color: #4b5563;
          margin-top: 6px;
          font-size: 1rem;
        }
        .icon-success {
          color: #22c55e;
        }
        .summary-sections {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }
        .card {
          padding: 20px 25px;
          border-radius: 14px;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
          transition: 0.3s;
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .card h2 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 10px;
        }
        .card.light { background: #f9fafb; }
        .card.blue { background: #eff6ff; border-color: #bfdbfe; }
        .card.green { background: #ecfdf5; border-color: #a7f3d0; }
        .card.yellow { background: #fefce8; border-color: #fef08a; }
        .card.purple { background: #f5f3ff; border-color: #ddd6fe; }
        .icon-indigo { color: #6366f1; }
        .icon-blue { color: #2563eb; }
        .icon-yellow { color: #ca8a04; }
        .icon-purple { color: #7e22ce; }
        .car-details {
          display: flex;
          gap: 15px;
          align-items: center;
          margin-top: 10px;
        }
        .car-details img {
          width: 120px;
          border-radius: 10px;
          border: 1px solid #ccc;
        }
        .car-name {
          font-weight: 600;
          color: #111827;
        }
        .car-model {
          color: #4b5563;
        }
        .car-price {
          color: #2563eb;
          font-weight: 700;
          margin-top: 4px;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .button-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 40px;
        }
        .btn {
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
          border-radius: 10px;
          padding: 10px 20px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
        }
        .btn.gray {
          background: #f3f4f6;
          color: #374151;
        }
        .btn.gray:hover {
          background: #e5e7eb;
        }
        .btn.blue {
          background: #2563eb;
          color: white;
        }
        .btn.blue:hover {
          background: #1e40af;
        }
        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr;
          }
          .summary-container {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
}
