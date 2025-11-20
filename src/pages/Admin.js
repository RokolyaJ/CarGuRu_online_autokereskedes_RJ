import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const BASE_URL = "https://carguru.up.railway.app";

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "ADMIN") {
      setMessage("Nincs jogosultságod az admin felülethez.");
      setLoading(false);
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  const authHeader = () => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored) return {};
      const parsed = JSON.parse(stored);
      const token = parsed.token;
      if (!token) return {};
      return { Authorization: `Bearer ${token}` };
    } catch (e) {
      console.error("Token olvasási hiba:", e);
      return {};
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/users`, {
        headers: {
          ...authHeader(),
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Nem sikerült betölteni a felhasználókat.");

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openReset = (u) => {
    setSelectedUser(u);
    setNewPassword("");
    setMessage("");
  };

  const doResetPassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      setMessage("A jelszó legalább 8 karakter kell legyen.");
      return;
    }

    try {
      const res = await fetch(
        `${BASE_URL}/api/admin/users/${selectedUser.id}/reset-password`,
        {
          method: "PUT",
          headers: {
            ...authHeader(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword }),
        }
      );

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Hiba a jelszó visszaállításakor.");
      }

      setMessage("Jelszó sikeresen visszaállítva.");
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const changeRole = async (id, role) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/admin/users/${id}/role?role=${role}`,
        {
          method: "PUT",
          headers: {
            ...authHeader(),
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Hiba a szerep módosításakor.");
      }

      setMessage("Szerep sikeresen módosítva.");
      fetchUsers();
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) return <p style={{ padding: 24 }}>Betöltés...</p>;

  return (
    <div
      style={{
        padding: "100px 24px 40px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ marginBottom: 20 }}>Admin – Felhasználók kezelése</h1>

      {message && (
        <div style={{ margin: "10px 0", color: "red" }}>{message}</div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            minWidth: "900px",
            borderCollapse: "collapse",
            tableLayout: "auto",
            backgroundColor: "#fff",
            color: "#000",
            borderRadius: "8px",
          }}
        >
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
              <th style={thStyle}>Név</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Telefon</th>
              <th style={thStyle}>Ország</th>
              <th style={thStyle}>Szerep</th>
              <th style={thStyle}>Regisztrálva</th>
              <th style={thStyle}>Műveletek</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: "1px solid #f1f1f1" }}>
                <td style={tdStyle}>{u.firstName} {u.lastName}</td>
                <td style={tdStyle}>{u.email}</td>
                <td style={tdStyle}>{u.phone || "-"}</td>
                <td style={tdStyle}>{u.country || "-"}</td>
                <td style={tdStyle}>{u.role}</td>
                <td style={tdStyle}>
                  {new Date(u.createdAt).toLocaleString("hu-HU")}
                </td>
                <td style={tdStyle}>
                  <button onClick={() => openReset(u)} style={btnStyle}>
                    Jelszó visszaállítás
                  </button>

                  {u.role !== "ADMIN" ? (
                    <button
                      onClick={() => changeRole(u.id, "ADMIN")}
                      style={btnStyle}
                    >
                      Hozzáad admin
                    </button>
                  ) : (
                    <button
                      onClick={() => changeRole(u.id, "USER")}
                      style={btnStyle}
                    >
                      Eltávolít admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div
          style={{
            marginTop: 30,
            padding: 16,
            border: "1px solid #ddd",
            borderRadius: 8,
            backgroundColor: "#fff",
            maxWidth: 420,
          }}
        >
          <h3>
            Jelszó visszaállítása: {selectedUser.firstName} {selectedUser.lastName}
          </h3>
          <input
            type="password"
            placeholder="Új jelszó"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{
              padding: 8,
              width: "100%",
              margin: "12px 0",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={doResetPassword} style={btnStyle}>
              Visszaállít
            </button>
            <button onClick={() => setSelectedUser(null)} style={btnStyle}>
              Mégse
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle = {
  padding: "10px 12px",
  fontWeight: "bold",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "10px 12px",
  wordBreak: "break-word",
  verticalAlign: "top",
};

const btnStyle = {
  marginRight: 8,
  padding: "6px 10px",
  backgroundColor: "#007bff",
  border: "none",
  borderRadius: 4,
  color: "#fff",
  cursor: "pointer",
  fontSize: "14px",
};
