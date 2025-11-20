import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const baseUrl = "https://carguru.up.railway.app";

const ImageCarousel = ({ images }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <img
        src="/no-image.png"
        alt="no img"
        style={{
          width: "180px",
          height: "130px",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />
    );
  }

  return (
    <div style={{ position: "relative", width: "180px", height: "130px" }}>
      <img
src={`${baseUrl}${images[current].url}`}
        alt="car"
        style={{
          width: "180px",
          height: "130px",
          objectFit: "cover",
          borderRadius: "8px",
          transition: "opacity 0.5s ease-in-out",
        }}
      />
    </div>
  );
};

export default function ProfilePage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({});
  const [saveMsg, setSaveMsg] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
const [recipientEmail, setRecipientEmail] = useState("");
const [transferAmount, setTransferAmount] = useState("");
const [transferMsg, setTransferMsg] = useState("");

const handleTransfer = async () => {
  if (!recipientEmail || !transferAmount) {
    setTransferMsg("Add meg az email címet és az összeget!");
    return;
  }

  if (!window.confirm(`Biztosan elutalod ${transferAmount} Ft-ot a(z) ${recipientEmail} címre?`)) {
    return;
  }

  try {
    const res = await fetch(
      `${baseUrl}/api/users/transfer?recipientEmail=${recipientEmail}&amount=${transferAmount}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${user?.token}` },
      }
    );
    if (res.ok) {
      setTransferMsg("Utalás sikeresen elküldve!");
      setProfile((p) => ({ ...p, balance: p.balance - Number(transferAmount) }));
      setRecipientEmail("");
      setTransferAmount("");
    } else {
      const msg = await res.text();
      setTransferMsg(`Hiba: ${msg}`);
    }
  } catch (err) {
    console.error("Hiba az utalás során:", err);
    setTransferMsg("Kapcsolódási hiba.");
  }
};
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedType, setSelectedType] = useState("ID_CARD");
  const [documents, setDocuments] = useState([]);
  const [uploadMsg, setUploadMsg] = useState("");
  const [tradeIns, setTradeIns] = useState([]);
  const [tradeMsg, setTradeMsg] = useState("");
const baseUrl = "https://carguru.up.railway.app";
const loadProfile = async () => {
  if (!user?.token) return;
  try {
    const res = await fetch(`${baseUrl}/api/users/me`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    if (!res.ok) throw new Error("Nem sikerült betölteni a profiladatokat.");
    const data = await res.json();
    setProfile(data);
    await fetchDocuments(data.id);
    await fetchTradeIns(data.id);
  } catch (err) {
    console.error("Profil betöltési hiba:", err);
  }
};

useEffect(() => {
  const localBal = localStorage.getItem("balance");
  if (localBal) {
    setProfile((prev) => ({ ...prev, balance: parseInt(localBal) }));
  }
  loadProfile();

  window.addEventListener("focus", loadProfile);
  return () => window.removeEventListener("focus", loadProfile);
}, [user]);
  const fetchDocuments = async (userId) => {
    try {
      const res = await fetch(`${baseUrl}/api/documents/get?userId=${userId}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.ok) {
        setDocuments(await res.json());
      } else setDocuments([]);
    } catch (err) {
      console.error("Hiba a dokumentumok lekérésekor:", err);
    }
  };
  const fetchTradeIns = async (userId) => {
    try {
      const res = await fetch(`${baseUrl}/api/tradein/user/${userId}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.ok) setTradeIns(await res.json());
    } catch (err) {
      console.error("Hiba az autók lekérésekor:", err);
    }
  };
const calculatePrice = (data) => {
  const year = parseInt(data.year) || 2015;
  const mileage = parseInt(data.mileage) || 0;
  const power = parseInt(data.power) || 0;
  const condition = parseInt(data.condition) || 3;

  let base = 10_000_000;
  let price =
    base -
    (2025 - year) * 300_000 -
    mileage * 10 +
    power * 1000 +
    (condition - 3) * 200_000;

  if (price < 500_000) price = 500_000;
  return Math.round(price);
};
  const handleSaveProfile = async () => {
    setSaveMsg("");
    const cleaned = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone,
      country: profile.country,
      birthDate: profile.birthDate || null,
      birthPlace: profile.birthPlace,
      motherName: profile.motherName,
      idCardNumber: profile.idCardNumber,
      idCardExpiry: profile.idCardExpiry || null,
      personalNumber: profile.personalNumber,
      addressCountry: profile.addressCountry,
      addressCity: profile.addressCity,
      addressZip: profile.addressZip,
      addressStreet: profile.addressStreet,
      taxId: profile.taxId,
      taxCardNumber: profile.taxCardNumber,
      nationality: profile.nationality,
      bankAccount: profile.bankAccount,
    };

    try {
      const res = await fetch(`${baseUrl}/api/users/me/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(cleaned),
      });

      if (res.ok) setSaveMsg("Profil sikeresen frissítve!");
      else setSaveMsg("Hiba történt a mentés során.");
    } catch {
      setSaveMsg("Kapcsolódási hiba.");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMsg("Kérlek, válassz ki egy fájlt!");
      return;
    }

    const formData = new FormData();
    formData.append("userId", profile.id);
    formData.append("type", selectedType);
    formData.append("file", selectedFile);

    try {
      const res = await fetch(`${baseUrl}/api/documents/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${user?.token}` },
        body: formData,
      });

      if (res.ok) {
        setUploadMsg("Fájl sikeresen feltöltve!");
        setSelectedFile(null);
        fetchDocuments(profile.id);
      } else {
        setUploadMsg("Hiba történt a feltöltéskor.");
      }
    } catch {
      setUploadMsg("Kapcsolódási hiba a szerverhez.");
    }
  };
const handleDelete = async (id) => {
  if (!window.confirm("Biztosan törölni szeretnéd ezt az autót?")) return;
  try {
    const res = await fetch(`${baseUrl}/api/tradein/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user?.token}` },
    });
    if (res.ok) {
      setTradeIns((prev) => prev.filter((c) => c.id !== id));
    }
  } catch (err) {
    console.error("Törlési hiba:", err);
  }
};

const handleEdit = (car) => {
  localStorage.setItem("editCarData", JSON.stringify(car));
  window.location.href = "/car-calculator";
};

  const handleChangePassword = async () => {
    setPassMsg("");
    try {
      const res = await fetch(`${baseUrl}/api/users/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(passwords),
      });

      if (res.ok) {
        setPassMsg("Jelszó sikeresen módosítva!");
        setPasswords({ oldPassword: "", newPassword: "" });
      } else {
        setPassMsg("Hiba a jelszó módosításakor!");
      }
    } catch {
      setPassMsg("Kapcsolódási hiba.");
    }
  };
  const handleAccept = async (id) => {
  try {
    const res = await fetch(`${baseUrl}/api/tradein/${id}/accept`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${user?.token}` },
    });

    if (!res.ok) {
      setTradeMsg("Hiba az elfogadás során.");
      setTimeout(() => setTradeMsg(""), 3000);
      return;
    }

    const data = await res.json();
    setTradeMsg(data.message || "Autó elfogadva, egyenleg frissítve!");

    setProfile((prev) => ({ ...prev, balance: data.newBalance ?? prev.balance }));
    setTradeIns((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "ACCEPTED" } : t))
    );
    setTimeout(() => setTradeMsg(""), 3000);
  } catch {
    setTradeMsg("Kapcsolódási hiba.");
    setTimeout(() => setTradeMsg(""), 3000);
  }
};



  const handleDecline = async (id) => {
    try {
      const res = await fetch(`${baseUrl}/api/tradein/${id}/decline`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.ok) {
        setTradeMsg("Autó elutasítva!");
        fetchTradeIns(profile.id);
      } else setTradeMsg("Hiba az elutasítás során.");
    } catch {
      setTradeMsg("Kapcsolódási hiba.");
    }
  };

  if (!profile) return <p className="profile-wrap">Betöltés...</p>;

  return (
    <div className="profile-wrap">
      <h1 className="page-title">Saját fiók</h1>

<section className="card-section">
  <h2 className="section-title">Egyenleged</h2>
  <p style={{ fontSize: "18px", fontWeight: "700", color: "#2563eb" }}>
    {profile.balance ? `${profile.balance.toLocaleString()} Ft` : "0 Ft"}
    
  </p>
  <button
    className="btn-primary"
    
    onClick={async () => {
      if (!profile.bankAccount || profile.bankAccount.trim() === "") {
  alert("Nincs megadva bankszámlaszám! Kérlek, töltsd ki a profilodban.");
  return;
}
      if (!window.confirm("Biztosan ki szeretnéd utalni a teljes egyenlegedet a számládra?")) return;
      try {
        const res = await fetch(`${baseUrl}/api/users/withdraw`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        if (res.ok) {
          alert("Kifizetés megtörtént! Az egyenleged lenullázódott.");
          setProfile((p) => ({ ...p, balance: 0 }));
        } else {
          alert("Hiba történt az utalás közben.");
        }
      } catch (err) {
        console.error("Hiba:", err);
      }
    }}
    style={{ marginTop: "10px" }}
  >
    Utalás a saját számlámra
  </button>

  <div style={{ marginTop: "20px" }}>
    <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>
      Pénz küldése másik felhasználónak
    </h3>
    <input
      type="email"
      placeholder="Címzett email címe"
      value={recipientEmail}
      onChange={(e) => setRecipientEmail(e.target.value)}
      style={{ width: "100%", marginBottom: "8px", padding: "8px" }}
    />
    <input
      type="number"
      placeholder="Összeg (Ft)"
      value={transferAmount}
      onChange={(e) => setTransferAmount(e.target.value)}
      style={{ width: "100%", marginBottom: "8px", padding: "8px" }}
    />
    <button
      className="btn-primary"
      onClick={handleTransfer}
    >
      Utalás indítása
    </button>
    {transferMsg && <p className="msg ok">{transferMsg}</p>}
  </div>
</section>


      <section className="card-section">
        <h2 className="section-title">Felhasználói adatok</h2>
        <div className="grid">
          <input type="text" placeholder="Keresztnév" value={profile.firstName || ""} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
          <input type="text" placeholder="Vezetéknév" value={profile.lastName || ""} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
          <input type="text" placeholder="Telefonszám" value={profile.phone || ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
          <input type="text" placeholder="Ország" value={profile.country || ""} onChange={(e) => setProfile({ ...profile, country: e.target.value })} />
        </div>
      </section>

      <section className="card-section">
        <h2 className="section-title">Személyes és igazolvány adatok</h2>
        <div className="grid">
          <input type="date" value={profile.birthDate || ""} onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })} />
          <input type="text" placeholder="Születési hely" value={profile.birthPlace || ""} onChange={(e) => setProfile({ ...profile, birthPlace: e.target.value })} />
          <input type="text" placeholder="Anyja neve" value={profile.motherName || ""} onChange={(e) => setProfile({ ...profile, motherName: e.target.value })} />
          <input type="text" placeholder="Személyi igazolvány száma" value={profile.idCardNumber || ""} onChange={(e) => setProfile({ ...profile, idCardNumber: e.target.value })} />
          <input type="date" value={profile.idCardExpiry || ""} onChange={(e) => setProfile({ ...profile, idCardExpiry: e.target.value })} />
          <input type="text" placeholder="Személyi szám" value={profile.personalNumber || ""} onChange={(e) => setProfile({ ...profile, personalNumber: e.target.value })} />
          <input type="text" placeholder="Állampolgárság" value={profile.nationality || ""} onChange={(e) => setProfile({ ...profile, nationality: e.target.value })} />
        </div>
      </section>
<section className="card-section">
  <h2 className="section-title">Banki adatok</h2>
  <div className="grid">
    <input
      type="text"
      placeholder="Bankszámlaszám"
      value={profile.bankAccount || ""}
      onChange={(e) => setProfile({ ...profile, bankAccount: e.target.value })}
    />
  </div>

  <button
    className="btn-primary"
    style={{ marginTop: "10px" }}
    onClick={async () => {
      if (!profile.bankAccount || profile.bankAccount.trim() === "") {
        alert("Kérlek, add meg a bankszámlaszámodat!");
        return;
      }

      try {
        const res = await fetch(`${baseUrl}/api/users/me/update`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user?.token}`,
  },
  body: JSON.stringify({ bankAccount: profile.bankAccount }),
});

        if (res.ok) {
          alert("Bankszámlaszám sikeresen mentve!");
        } else {
          alert("Hiba történt a mentés során.");
        }
      } catch (err) {
        console.error("Hiba a mentés során:", err);
        alert("Kapcsolódási hiba a szerverhez.");
      }
    }}
  >
    Bankszámlaszám mentése
  </button>
</section>

      <section className="card-section">
        <h2 className="section-title">Lakcím és adó adatok</h2>
        <div className="grid">
          <input type="text" placeholder="Ország" value={profile.addressCountry || ""} onChange={(e) => setProfile({ ...profile, addressCountry: e.target.value })} />
          <input type="text" placeholder="Város" value={profile.addressCity || ""} onChange={(e) => setProfile({ ...profile, addressCity: e.target.value })} />
          <input type="text" placeholder="Irányítószám" value={profile.addressZip || ""} onChange={(e) => setProfile({ ...profile, addressZip: e.target.value })} />
          <input type="text" placeholder="Utca, házszám" value={profile.addressStreet || ""} onChange={(e) => setProfile({ ...profile, addressStreet: e.target.value })} />
          <input type="text" placeholder="Adószám" value={profile.taxId || ""} onChange={(e) => setProfile({ ...profile, taxId: e.target.value })} />
          <input type="text" placeholder="Adókártya szám" value={profile.taxCardNumber || ""} onChange={(e) => setProfile({ ...profile, taxCardNumber: e.target.value })} />
        </div>
        <button className="btn-primary" onClick={handleSaveProfile}>Mentés</button>
        {saveMsg && <p className="msg ok">{saveMsg}</p>}
      </section>

<section className="card-section">
  <h2 className="section-title">Feltöltött autóim</h2>
  {tradeIns.length === 0 && <p>Nincs még feltöltött autód.</p>}
  <div className="saved-cars">
    {tradeIns.map((car) => {
      const price = calculatePrice(car);
      const details = [
        car.year && `${car.year}`,
        car.mileage && `${car.mileage.toLocaleString()} km`,
        car.fuelType && `Üzemanyag: ${car.fuelType}`,
        (car.driveType || car.drivetrain) && `Hajtás: ${car.driveType || car.drivetrain}`,
        car.transmission && `Sebességváltó: ${car.transmission}`,
        car.condition && `Állapot: ${car.condition}/5`,
        car.color && `Külső szín: ${car.color}`,
        car.interiorColor && `Kárpit: ${car.interiorColor}`,
        car.bodyType && `Kivitel: ${car.bodyType}`,
        car.seats && `Ülések száma: ${car.seats}`,
        car.engineSize && `Motor: ${car.engineSize} cm³`,
        car.power && `Teljesítmény: ${car.power} kW`,
        car.luggage && `Csomagtartó: ${car.luggage} liter`,
        car.weight && `Teljes tömeg: ${car.weight} kg`,
        car.documents && `Okmányok: ${car.documents}`,
        car.technicalValidity && `Műszaki érvényessége: ${car.technicalValidity}`,
      ].filter(Boolean);

      return (
        <div key={car.id} className="saved-car-card">
          <div className="saved-car-image">
            <ImageCarousel images={car.images} />
          </div>

          <div className="saved-car-info">
            <h2 className="car-title">{car.make} {car.model}</h2>
            <p className="seller">Forgalmazza: CarGuru</p>

            {details.length > 0 && (
              <div className="car-meta">{details.join(" • ")}</div>
            )}

            {car.description && (
              <div className="car-description">
                <strong>Leírás:</strong> {car.description}
              </div>
            )}

            <div className="bottom-row">
              <div className="price">{price.toLocaleString()} Ft</div>
              <div className="buttons">
                <button className="config-btn" onClick={() => handleEdit(car)}>
                  Módosítás
                </button>
                <button
                  className="remove-btn"
                  onClick={() => handleDelete(car.id)}
                >
                  Törlés
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>
</section>


      <section className="card-section">
        <h2 className="section-title">Dokumentum feltöltés</h2>
        <div className="grid">
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="ID_CARD">Személyi igazolvány</option>
            <option value="ADDRESS_CARD">Lakcímkártya</option>
            <option value="DRIVING_LICENSE">Jogosítvány</option>
            <option value="OTHER">Egyéb</option>
          </select>
          <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
        </div>
        <button className="btn-primary" onClick={handleUpload}>Feltöltés</button>
        {uploadMsg && <p className="msg ok">{uploadMsg}</p>}

        {documents.length > 0 ? (
          <ul style={{ marginTop: "10px", listStyle: "none", padding: 0 }}>
            {documents.map((d) => {
              const fileName = d.url.split("/").pop();
              return (
                <li
                  key={d.id}
                  style={{
                    background: "#f3f4f6",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    marginBottom: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>{d.type}</strong>{" "}
                    <span style={{ color: "#666" }}>({fileName})</span>
                    <br />
                    <span style={{ fontSize: "0.9rem", color: d.status === "PENDING" ? "#ca8a04" : "#16a34a", fontWeight: 500 }}>
                      {d.status === "PENDING" ? "⏳ Jóváhagyás alatt" : "Elfogadva"}
                    </span>
                  </div>
                  <a href={`${baseUrl}${d.url}`} target="_blank" rel="noopener noreferrer"
                    style={{ background: "#2563eb", color: "#fff", padding: "6px 12px", borderRadius: "6px", textDecoration: "none", fontWeight: 500 }}>
                    Megnyitás
                  </a>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Nincsenek feltöltött dokumentumok.</p>
        )}
      </section>

      <section className="card-section">
        <h2 className="section-title">Jelszó módosítása</h2>
        <div className="grid">
          <input type="password" name="oldPassword" value={passwords.oldPassword} onChange={(e) => setPasswords((p) => ({ ...p, oldPassword: e.target.value }))} placeholder="Régi jelszó" />
          <input type="password" name="newPassword" value={passwords.newPassword} onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))} placeholder="Új jelszó" />
        </div>
        <button className="btn-primary" onClick={handleChangePassword}>Jelszó frissítése</button>
        {passMsg && <p className="msg ok">{passMsg}</p>}
      </section>

      <style>{`
        .profile-wrap { max-width: 900px; margin: 40px auto; padding: 20px; }
        .page-title { font-size: 28px; font-weight: 800; margin-bottom: 22px; }
        .card-section { background: #fafafa; border: 1px solid #e5e7eb; border-radius: 12px; padding: 22px; margin-bottom: 26px; }
        .section-title { font-size: 20px; font-weight: 700; margin-bottom: 10px; }
        .grid { display: grid; gap: 10px; grid-template-columns: 1fr 1fr; }
        input, select { padding: 10px; border-radius: 8px; border: 1px solid #ccc; }
        .btn-primary { margin-top: 10px; background: #2563eb; color: #fff; border: none; border-radius: 8px; padding: 10px 16px; cursor: pointer; font-weight: 600; }
        .btn-primary:hover { background: #1d4ed8; }
        .tradein-item { margin-bottom: 15px; padding: 12px; background: #fff; border-radius: 10px; border: 1px solid #ddd; }
        .actions button { margin-right: 10px; padding: 6px 12px; border-radius: 8px; border: none; cursor: pointer; }
        .actions button:first-child { background: #22c55e; color: white; }
        .actions button:last-child { background: #ef4444; color: white; }
        .msg.ok { color: #16a34a; margin-top: 8px; font-weight: 600; }
        .msg.ok {
  color: #16a34a;
  margin-top: 8px;
  font-weight: 600;
}

      `}</style>
    </div>
  );
}
