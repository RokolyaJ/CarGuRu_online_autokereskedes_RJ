import React from "react";
import { Link } from "react-router-dom";
import { FiSettings, FiMail } from "react-icons/fi";
import { MdOutlineDriveEta } from "react-icons/md";
import { useTheme } from "../context/ThemeContext";

export default function FloatingActions() {
  const { darkMode } = useTheme();

  return (
    <div className="fab-wrap">
      <Link to="/configurator" className={`fab-btn ${darkMode ? "dark" : "light"}`} aria-label="Konfigurátor">
        <span className="icon"><FiSettings size={22} /></span>
        <span className="label">Konfigurátor</span>
      </Link>

      <Link to="/test-drive" className={`fab-btn ${darkMode ? "dark" : "light"}`} aria-label="Tesztvezetés">
        <span className="icon"><MdOutlineDriveEta size={22} /></span>
        <span className="label">Tesztvezetés</span>
      </Link>

      <Link to="/request-offer" className={`fab-btn ${darkMode ? "dark" : "light"}`} aria-label="Ajánlatot kérek">
        <span className="icon"><FiMail size={22} /></span>
        <span className="label">Ajánlatot kérek</span>
      </Link>

      <style>{`
        .fab-wrap {
          position: fixed;
          bottom: 70px;
          right: 30px;
          z-index: 2000;
          display: flex;
          flex-direction: column;
          gap: 18px;
          align-items: flex-end;
        }
        .fab-btn {
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          border-radius: 999px;
          padding: 12px 14px;
          max-width: 54px;
          overflow: visible;
          box-shadow: 0 8px 18px rgba(0,0,0,.25);
          transition: max-width .28s ease, background-color .28s ease, box-shadow .28s ease, color .28s ease;
        }
        .fab-btn.light { background: #888; color: #000; }
        .fab-btn.light:hover { background: #aaa; }
        .fab-btn.dark { background: #888; color: #fff; }
        .fab-btn.dark:hover { background: #aaa; }
        .fab-btn .icon { width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; }
        .fab-btn .label {
          margin-left: 12px; white-space: nowrap; opacity: 0; max-width: 0;
          overflow: hidden; transform: translateX(-6px);
          transition: opacity .22s ease, max-width .28s ease, transform .28s ease;
        }
        .fab-btn:hover { max-width: 240px; box-shadow: 0 10px 22px rgba(0,0,0,.3); }
        .fab-btn:hover .label { opacity: 1; max-width: 180px; transform: translateX(0); }
        @media (max-width: 768px) {
          .fab-wrap { right: 18px; gap: 14px; }
          .fab-btn { padding: 10px 12px; max-width: 50px; }
          .fab-btn:hover { max-width: 210px; }
        }
      `}</style>
    </div>
  );
}
