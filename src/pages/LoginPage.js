import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email))
      return "Adj meg egy érvényes e-mail címet.";
    if (!form.password) return "Add meg a jelszót.";
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
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Bejelentkezés sikertelen.");
      }

      const data = await res.json();
      console.log("Login response:", data);

      const tokenValue =
  typeof data.token === "string"
    ? data.token
    : data.token?.token || data.accessToken || "";

if (!tokenValue) {
  console.warn("Token hiányzik vagy nem megfelelő formátumú a válaszban:", data);
} else {
  console.log("Token mentve:", tokenValue);
}

localStorage.setItem("token", tokenValue);
localStorage.setItem("email", data.email);
localStorage.setItem("fullName", data.fullName);
localStorage.setItem("role", data.role);

      if (data.userId) {
        localStorage.setItem("userId", String(data.userId));
        console.log("UserID mentve:", data.userId);
      } else {
        console.warn("Nincs userId az AuthResponse-ban!");
      }

login(tokenValue, data.userId, data.email, data.fullName, data.role);

      if (data.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (err) {
      setError(err.message || "Hiba a bejelentkezés közben.");
    } finally {
      setLoading(false);
    }
  };

  const pageStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "120px 16px 60px",
    minHeight: "100vh",
    backgroundColor: "inherit",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "420px",
    background: "#fff",
    color: "#111",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,.15)",
    padding: "32px 28px",
  };

  const logoStyle = {
    width: "64px",
    height: "64px",
    margin: "0 auto 20px",
    display: "block",
  };

  const titleStyle = {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "20px",
  };

  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "18px",
  };

  const inputStyle = {
    padding: "12px 14px",
    border: "1px solid #cfd4dc",
    borderRadius: "8px",
    outline: "none",
    fontSize: "15px",
  };

  const pwdWrapStyle = { position: "relative", display: "flex", alignItems: "center" };

  const toggleBtnStyle = {
    position: "absolute",
    right: "8px",
    top: "8px",
    padding: "4px 10px",
    borderRadius: "6px",
    border: "1px solid transparent",
    background: "#f1f3f5",
    cursor: "pointer",
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

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <img src="/images/logo/logo.png" alt="Logo" style={logoStyle} />
        <div style={titleStyle}>Bejelentkezés</div>

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

          <label style={fieldStyle}>
            Jelszó *
            <div style={pwdWrapStyle}>
              <input
                type={showPwd ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                style={{ ...inputStyle, width: "100%" }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                style={toggleBtnStyle}
              >
                {showPwd ? "Elrejt" : "Mutat"}
              </button>
            </div>
          </label>

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "Bejelentkezés..." : "Tovább"}
          </button>

          <div style={{ marginTop: "14px", fontSize: "14px", textAlign: "center" }}>
            Még nincs fiókod? <a href="/register">Új fiók létrehozása</a>
          </div>
        </form>
      </div>
    </div>
  );
}
