import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const api = axios.create({
  baseURL: "https://carguru.up.railway.app",
  withCredentials: false,
});


export default function UsedCarAdminEdit() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [activeImg, setActiveImg] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    api
      .get(`/api/usedcars/${id}`)
      .then(({ data }) => {
        if (!alive) return;
        setCar(data);
        const first = (data.images && data.images[0]) || "/placeholder.png";
        setActiveImg(first);
      })
      .catch((e) => setErr(e?.response?.data?.message || "Hiba történt."))
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [id]);

  const title = useMemo(() => {
    if (!car) return "";
    return `${car.brand || ""} ${car.model || ""}`.trim();
  }, [car]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCar((c) => ({ ...c, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUploadImages = async () => {
    if (!files.length) return alert("Nincs kiválasztott fájl!");

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    try {
      await api.post(`/api/images/upload/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Képek sikeresen feltöltve!");
      window.location.reload();

    } catch (err) {
      alert("Hiba a képfeltöltés során!");
      console.error(err);
    }
  };
  const handleSave = async () => {
    setSaving(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Nem vagy bejelentkezve!");
      setSaving(false);
      return;
    }

    try {
      await api.put(`/api/usedcars/${id}`, car, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("Autó frissítve!");
      navigate("/used-cars/admin");

    } catch (e) {
      console.error(e);
      alert("Hiba a mentés során!");
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={sx.page}><h2>Betöltés...</h2></div>
      </div>
    );
  }

  if (err) {
    return (
      <div>
        <Navbar />
        <div style={sx.page}>
          <h2 style={{ color: "#B42318" }}>{err}</h2>
        </div>
      </div>
    );
  }

  if (!car) return null;
  return (
    <div>
      <Navbar />

      <div style={sx.page}>

        <button style={btn.ghost} onClick={() => navigate(-1)}>
          Vissza
        </button>

        <h1 style={sx.title}>{title} (Admin szerkesztés)</h1>

        <section style={sx.galleryWrap}>
          <div style={sx.thumbs}>
            {(car.images?.length ? car.images : ["/placeholder.png"]).map(
              (src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(src)}
                  style={{
                    ...sx.thumb,
                    outline:
                      src === activeImg ? "2px solid #ef530f" : "1px solid #eee",
                  }}
                >
                  <img src={src} alt={`kép ${i}`} style={sx.thumbImg} />
                </button>
              )
            )}
          </div>

          <div style={sx.mainImgWrap}>
            <img src={activeImg} alt="Aktív" style={sx.mainImg} />
          </div>
        </section>

        <div style={{ marginTop: 20 }}>
          <input type="file" multiple onChange={handleFileChange} />
          <button style={btn.primary} onClick={handleUploadImages}>
            Képek feltöltése
          </button>
        </div>

        <section style={sx.block}>
          <h2 style={sx.blockTitle}>Alapadatok</h2>

          <div style={form.grid}>
            {[
              "brand","model","year","price","mileage","fuel","engineSize",
              "transmission","bodyType","condition","doors","seats",
              "trunkCapacity","drivetrain","engineLayout","klimaType","docs",
              "tireSize","location","dealer"
            ].map((key) => (
              <Input
                key={key}
                label={key}
                name={key}
                value={car[key] ?? ""}
                onChange={handleChange}
              />
            ))}
          </div>

          <div style={{ marginTop: 20 }}>
            <label>Leírás</label>
            <textarea
              name="description"
              value={car.description || ""}
              onChange={handleChange}
              rows={5}
              style={form.textarea}
            />
          </div>

          <button style={btn.save} onClick={handleSave} disabled={saving}>
            {saving ? "Mentés..." : "Változások mentése"}
          </button>
        </section>
      </div>
    </div>
  );
}


function Input({ label, name, value, onChange }) {
  return (
    <div style={form.field}>
      <label style={form.label}>{label}</label>
      <input
        style={form.input}
        name={name}
        value={value ?? ""}
        onChange={onChange}
      />
    </div>
  );
}


const sx = {
  page: {
    maxWidth: 1000,
    margin: "0 auto",
    padding: "90px 20px",
    fontFamily: "Inter, Arial, sans-serif",
  },
  title: { fontSize: 28, fontWeight: 800, margin: "10px 0" },
  galleryWrap: {
    display: "grid",
    gridTemplateColumns: "148px 1fr",
    gap: 16,
    marginTop: 20,
  },
  thumbs: { display: "grid", gap: 10 },
  thumb: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    overflow: "hidden",
    padding: 0,
    cursor: "pointer",
  },
  thumbImg: { width: "100%", height: "100%", objectFit: "cover" },
  mainImgWrap: {
    width: "100%",
    aspectRatio: "16/9",
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid #EEF0F2",
  },
  mainImg: { width: "100%", height: "100%", objectFit: "cover" },
  block: { marginTop: 32 },
  blockTitle: { fontSize: 20, fontWeight: 800, marginBottom: 16 },
};

const form = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 12,
  },
  field: { display: "flex", flexDirection: "column", gap: 4 },
  label: { fontWeight: 600, color: "#555" },
  input: {
    border: "1px solid #DDD",
    borderRadius: 8,
    padding: "8px 10px",
    fontSize: 14,
  },
  textarea: {
    width: "100%",
    border: "1px solid #DDD",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    resize: "vertical",
  },
};

const btn = {
  ghost: {
    background: "#fff",
    color: "#344054",
    border: "1px solid #D0D5DD",
    borderRadius: 10,
    padding: "9px 14px",
    cursor: "pointer",
    fontWeight: 600,
  },
  primary: {
    background: "#ef530f",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "9px 14px",
    marginLeft: 10,
    cursor: "pointer",
    fontWeight: 600,
  },
  save: {
    marginTop: 20,
    background: "#16A34A",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "12px 20px",
    fontWeight: 700,
    cursor: "pointer",
  },
};
