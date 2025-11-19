import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    country: "Magyarország",
    terms: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    if (!form.firstName.trim()) return "Az utónév kötelező.";
    if (!form.lastName.trim()) return "A vezetéknév kötelező.";
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email))
      return "Érvényes e-mail cím szükséges.";
    if (form.password.length < 8)
      return "A jelszónak legalább 8 karakter hosszúnak kell lennie.";
    if (form.password !== form.confirmPassword)
      return "A jelszavak nem egyeznek.";
    if (!form.terms) return "El kell fogadnod a feltételeket.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          password: form.password,
          phone: form.phone.trim(),
          country: form.country,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
      navigate("/login", {
        state: { success: "Sikeres regisztráció, jelentkezz be!" },
      });
    } catch (err) {
      setError(err.message || "Hiba történt a regisztráció során.");
    } finally {
      setLoading(false);
    }
  };

  const pageStyle = {
    display: "flex",
    justifyContent: "center",
    padding: "120px 16px 60px",
    background: "inherit",
    color: "inherit",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "720px",
    background: "white",
    color: "#111",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,.12)",
    padding: "24px 24px 32px",
  };

  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "14px",
  };

  const inputStyle = {
    padding: "12px 14px",
    border: "1px solid #cfd4dc",
    borderRadius: "8px",
    outline: "none",
    fontSize: "15px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "16px",
  };

  const errorStyle = {
    background: "#ffe5e5",
    color: "#911",
    border: "1px solid #f5c2c7",
    borderRadius: "8px",
    padding: "10px 12px",
    marginBottom: "10px",
  };

  const checkboxStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    margin: "8px 0 14px",
    fontSize: "14px",
  };

  const grid2 = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "20px" }}>
          Új fiók létrehozása
        </h1>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={fieldStyle}>
            E-mail cím *
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </label>

          <div style={grid2}>
            <label style={fieldStyle}>
              Utónév *
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </label>

            <label style={fieldStyle}>
              Vezetéknév *
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </label>
          </div>

          <label style={fieldStyle}>
            Telefonszám
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          <label style={fieldStyle}>
            Ország *
            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              style={inputStyle}
              required
            >
              <option>Magyarország</option>
              <option>Ausztria</option>
              <option>Németország</option>
              <option>Románia</option>
              <option>Szlovákia</option>
            </select>
          </label>

          <div style={grid2}>
            <label style={fieldStyle}>
              Jelszó *
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </label>

            <label style={fieldStyle}>
              Jelszó megerősítése *
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </label>
          </div>

          <label style={checkboxStyle}>
            <input
              type="checkbox"
              name="terms"
              checked={form.terms}
              onChange={handleChange}
            />
            Elfogadom a feltételeket
          </label>

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "Fiók létrehozása..." : "Új fiók létrehozása"}
          </button>

          <div style={{ marginTop: "12px", fontSize: "14px", textAlign: "center" }}>
            Már van fiókod? <a href="/login">Bejelentkezés</a>
          </div>
        </form>
      </div>
    </div>
  );
}
