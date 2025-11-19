import React from "react";
import { useNavigate } from "react-router-dom";

export default function AuthDialog({ onClose }) {
  const navigate = useNavigate();

  const goToLogin = () => {
    onClose();
    navigate("/login");
  };

  const goToRegister = () => {
    onClose();
    navigate("/register");
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <h3 style={titleStyle}>Üdvözlünk!</h3>
        <p style={descStyle}>
          Válassz, hogy bejelentkezni vagy regisztrálni szeretnél.
        </p>

        <button onClick={goToLogin} style={actionButtonStyle}>
          Bejelentkezés
        </button>
        <button
          onClick={goToRegister}
          style={{ ...actionButtonStyle, backgroundColor: "#10b981" }}
        >
          Regisztráció
        </button>
      </div>
    </div>
  );
}

const containerStyle = {
  position: "absolute",
  top: "100%",
  right: "0",
  zIndex: 2000,
  animation: "fadeIn 0.25s ease-out",
};

const boxStyle = {
  width: "280px",
  padding: "20px",
  borderRadius: "10px",
  backgroundColor: "#fff",
  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const titleStyle = { margin: "0 0 10px", textAlign: "center", color: "#111" };
const descStyle = { fontSize: "14px", textAlign: "center", color: "#333" };

const actionButtonStyle = {
  padding: "10px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#1e90ff",
  color: "#fff",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
};
