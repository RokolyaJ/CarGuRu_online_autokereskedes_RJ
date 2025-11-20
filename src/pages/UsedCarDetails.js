
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import FavoriteButton from "../components/FavoriteButton";

const api = axios.create({
baseURL: "https://carguru.up.railway.app",
  withCredentials: true
});

export default function UsedCarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [activeImg, setActiveImg] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [reserved, setReserved] = useState(false);
  const [reservedBy, setReservedBy] = useState(null);
  const [reservedById, setReservedById] = useState(null);
  const [userHasReserved, setUserHasReserved] = useState(false);

  

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr("");

    api
      .get(`/api/usedcars/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then(({ data }) => {
        if (!alive) return;

        setCar(data);
        setReserved(data.reserved);
        setReservedBy(data.reservedBy);
        setReservedById(data.reservedById);
        setUserHasReserved(data.userHasReserved);

        const first = (data?.images && data.images[0]) || "/placeholder.png";
        setActiveImg(first);
      })
      .catch((e) => setErr(e?.response?.data?.message || "Hiba történt."))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [id]);

  const title = useMemo(() => {
    if (!car) return "";
    return `${car.brand || ""} ${car.model || ""}`.trim();
  }, [car]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={sx.page}>
          <div style={sx.skelHeader} />
          <div style={sx.skelWide} />
          <div style={{ height: 20 }} />
          <div style={sx.skelRow} />
          <div style={sx.skelRow} />
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div>
        <Navbar />
        <div style={sx.page}>
          <button style={btn.ghost} onClick={() => navigate(-1)}>
            ← Vissza
          </button>
          <h1 style={{ color: "#B42318" }}>Hiba</h1>
          <p>{err}</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div>
        <Navbar />
        <div style={sx.page}>
          <h1>Nincs ilyen autó</h1>
        </div>
      </div>
    );
  }

  const fmtInt = (n) =>
    typeof n === "number" ? n.toLocaleString("hu-HU") : n || "-";

  const fmtFt = (n) =>
    typeof n === "number"
      ? `${n.toLocaleString("hu-HU")} Ft`
      : n || "Ár nem elérhető";

  const stat = (icon, label, value) => (
    <div style={cards.stat}>
      <div style={cards.statIcon}>{icon}</div>
      <div style={cards.statText}>
        <div style={cards.statLabel}>{label}</div>
        <div style={cards.statValue}>{value ?? "-"}</div>
      </div>
    </div>
  );

  const reserveBtn = {
    padding: "12px 20px",
    background: "#ef530f",
    color: "white",
    border: "none",
    borderRadius: 12,
    fontSize: 18,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  };

  const cancelBtn = {
    padding: "12px 20px",
    background: "#B42318",
    color: "white",
    border: "none",
    borderRadius: 12,
    fontSize: 18,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  };

  async function handleReservation() {
    try {
      await api.post(
        `/api/usedcars/${id}/reserve`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      setReserved(true);
      alert("Sikeresen lefoglaltad az autót!");
      navigate("/used-cars/results", { state: { forceRefresh: true } });
    } catch (err) {
      alert(err?.response?.data?.message || "Hiba foglalás közben.");
    }
  }

  async function handleCancelReservation() {
    try {
      await api.delete(`/api/usedcars/${id}/reserve`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      setReserved(false);
      alert("Foglalás törölve.");
    } catch (err) {
      alert(err?.response?.data?.message || "Hiba a törlés közben.");
    }
  }

  const F = car.features || {};

  return (
    <div>
      <Navbar />

      <div style={sx.page}>
        <div style={sx.topbar}>
          <button style={btn.ghost} onClick={() => navigate(-1)}>
            Vissza a találati oldalra
          </button>
        </div>

        <h1 style={sx.title}>{title || "Ismeretlen modell"}</h1>

        <div style={sx.submeta}>
          <span style={sx.chip}>{car?.dealer || "Ismeretlen kereskedő"}</span>
          <span style={sx.dot}>•</span>
          <span style={sx.chip}>{car?.location || "Magyarország"}</span>
          <span style={sx.dot}>•</span>
          <span style={sx.chip}>{car?.bodyType || "-"}</span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 15,
            marginBottom: -10,
            gap: 12,
          }}
        >
         <button
  onClick={() => {
    console.log("SELLER:", car.sellerId, car.sellerName);
    window.openChatWithSeller(car.sellerId, car.sellerName);
  }}
  style={reserveBtn}
>
  Üzenet az eladónak
</button>



          {!reserved && (
            <button onClick={handleReservation} style={reserveBtn}>
              Lefoglalom
            </button>
          )}

          {reserved && userHasReserved && (
            <button onClick={handleCancelReservation} style={cancelBtn}>
              Foglalás törlése
            </button>
          )}

          {reserved && !userHasReserved && (
            <button
              disabled
              style={{
                ...reserveBtn,
                background: "#d0d5dd",
                cursor: "not-allowed",
              }}
            >
              Már lefoglalták
            </button>
          )}
        </div>

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
                      src === activeImg
                        ? "2px solid #ef530f"
                        : "1px solid #eee",
                  }}
                >
                  <img src={src} alt={`kép ${i + 1}`} style={sx.thumbImg} />
                </button>
              )
            )}
          </div>

          <div style={{ ...sx.mainImgWrap, position: "relative" }}>
            <img src={activeImg} alt={`${title} - kép`} style={sx.mainImg} />

            <div style={{ position: "absolute", top: 12, right: 12 }}>
              <FavoriteButton carId={car.id} />
            </div>
          </div>
        </section>

        <div style={{ height: 10 }} />

        <div style={cards.row}>
          <div style={cards.priceCard}>
            <div style={cards.priceLabel}>Vételár</div>
            <div style={cards.price}>{fmtFt(car.price)}</div>
          </div>

          <div style={cards.statGrid}>
            {stat("Évjárat", car.year || "-")}
            {stat("Km. óra állás", `${fmtInt(car.mileage)} km`)}
            {stat("Üzemanyag", car.fuel || "-")}
            {stat(
              "Teljesítmény",
              car.engineSize ? `${car.engineSize} cm³` : "-"
            )}
            {stat("Állapot", car.condition || "-")}
            {stat(
             
              "Csomagtartó",
              car.trunkCapacity ? `${fmtInt(car.trunkCapacity)} l` : "-"
            )}
          </div>
        </div>

        <section style={sx.block}>
          <h2 style={sx.blockTitle}>Alapadatok</h2>
          <div style={tbl.grid}>
            <div style={tbl.col}>
              <Table
                rows={[
                  ["Évjárat", car.year ?? "-"],
                  ["Kivitel", car.bodyType ?? "-"],
                  ["Állapot", car.condition ?? "-"],
                  ["Ajtók száma", car.doors ?? "-"],
                  ["Ülések száma", car.seats ?? "-"],
                  [
                    "Csomagtartó",
                    car.trunkCapacity
                      ? `${fmtInt(car.trunkCapacity)} l`
                      : "-",
                  ],
                ]}
              />
            </div>

            <div style={tbl.col}>
              <Table
                rows={[
                  ["Üzemanyag", car.fuel ?? "-"],
                  [
                    "Hengerűrtartalom",
                    car.engineSize ? `${car.engineSize} cm³` : "-",
                  ],
                  ["Henger-elrendezés", car.engineLayout ?? "-"],
                  ["Hajtás", car.drivetrain ?? "-"],
                  ["Sebességváltó", car.transmission ?? "-"],
                  ["Klíma fajtája", car.klimaType ?? "-"],
                ]}
              />
            </div>

            <div style={tbl.col}>
              <Table
                rows={[
                  [
                    "Saját tömeg",
                    car.weight ? `${fmtInt(car.weight)} kg` : "-",
                  ],
                  [
                    "Teljes tömeg",
                    car.totalWeight ? `${fmtInt(car.totalWeight)} kg` : "-",
                  ],
                  ["Okmányok jellege", car.docs ?? "-"],
                  ["Nyári gumi méret", car.tireSize ?? "-"],
                  ["Kereskedő", car.dealer ?? "-"],
                  ["Telephely", car.location ?? "-"],
                ]}
              />
            </div>
          </div>
        </section>

        <section style={sx.block}>
          <h2 style={sx.blockTitle}>Felszereltség</h2>

          <div style={eq.grid}>
            <EquipGroup
              title="Beltér"
              items={[
                ["dönthető utasülések", F.dontheto_ules],
                ["fűthető első ülés", F.futheto_ules],
                ["ülésmagasság állítás", F.ulesmagassag],
                ["multifunkciós kormánykerék", F.multikormany],
                ["deréktámasz", F.derektamasz],
                ["bőrkormány", F.borkormany],
                ["függönylégzsák", F.fuggoleges_legzsak],
                ["hátsó oldal légzsák", F.hatso_oldal_legzsak],
                ["ISOFIX rendszer", F.isofix],
                ["kikapcsolható légzsák", F.kikapcsolhato_legzsak],
                ["oldallégzsák", F.oldalso_legzsak],
                ["utasoldali légzsák", F.utas_legzsak],
                ["vezetőoldali légzsák", F.vezeto_legzsak],
                ["térdlégzsák", F.terd_legzsak],
                ["középső légzsák elöl", F.kozepso_legzsak],
                ["állítható kormány", F.allithato_kormany],
                ["fedélzeti komputer", F.fedelzeti_komputer],
              ]}
            />

            <EquipGroup
              title="Műszaki"
              items={[
                ["tolatókamera", F.tolatokamera],
                ["ABS (blokkolásgátló)", F.abs],
                ["ASR (kipörgésgátló)", F.asr],
                ["ESP (menetstabilizátor)", F.esp],
                ["sávtartó rendszer", F.savtarto],
                ["guminyomás-ellenőrző rendszer", F.guminyomas_ellenorzo],
                ["távolságtartó tempomat", F.tavolsagtarto_tempomat],
                ["vészfék asszisztens", F.veszfek],
                ["centrálzár", F.centralzar],
                ["szervokormány", F.szervokormany],
                ["sebességfüggő szervókormány", F.sebessegfuggo_szervokormany],
              ]}
            />

            <EquipGroup
              title="Kültér"
              items={[
                ["ködlámpa", F.kodlampa],
                ["menetfény", F.menetfeny],
                ["elektromos ablak elöl", F.elektromos_ablak_elol],
                ["elektromos ablak hátul", F.elektromos_ablak_hatul],
                ["elektromos tükör", F.elektromos_tukor],
              ]}
            />

            <EquipGroup
              title="Multimédia / Navigáció"
              items={[
                ["rádió", F.radio],
                ["bluetooth-os kihangosító", F.bluetooth],
                ["érintőkijelző", F.erintokijelzo],
                ["6 hangszóró", F.hangszoro6],
                ["kormányról vezérelhető hifi", F.kormany_hifi],
                ["multifunkcionális kijelző", F.multikijelzo],
              ]}
            />
          </div>
        </section>

        {car.description?.trim?.() && (
          <section style={sx.block}>
            <h2 style={sx.blockTitle}>Leírás</h2>
            <div style={sx.desc}>{car.description}</div>
          </section>
        )}
      </div>
    </div>
  );
}
function Table({ rows }) {
  return (
    <div style={tbl.table}>
      {rows.map(([k, v], i) => (
        <div key={i} style={tbl.row}>
          <div style={tbl.key}>{k}</div>
          <div style={tbl.val}>{v}</div>
        </div>
      ))}
    </div>
  );
}

function EquipGroup({ title, items }) {
  return (
    <div style={eq.group}>
      <div style={eq.title}>{title}</div>
      <ul style={eq.list}>
        {items.map(([label, ok], i) => (
          <li key={i} style={{ ...eq.item, opacity: ok ? 1 : 0.45 }}>
            <span
              style={{
                ...eq.bullet,
                background: ok ? "#22C55E" : "#D0D5DD",
              }}
            >
              {ok ? "✓" : "–"}
            </span>
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
const sx = {
  page: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "90px 20px 48px",
    fontFamily: "Inter, Arial, sans-serif",
    color: "#101828",
  },
  topbar: { display: "flex", alignItems: "center", marginBottom: 8, gap: 10 },
  title: { fontSize: 28, fontWeight: 800, margin: "6px 0 4px" },
  submeta: { display: "flex", alignItems: "center", gap: 10, color: "#667085" },
  chip: {
    background: "#F2F4F7",
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 13,
  },
  dot: { color: "#D0D5DD" },

  galleryWrap: {
    display: "grid",
    gridTemplateColumns: "148px 1fr",
    gap: 16,
    marginTop: 18,
  },
  thumbs: {
    display: "grid",
    gridAutoRows: "100px",
    gap: 10,
    alignContent: "start",
  },
  thumb: {
    width: "100%",
    height: 100,
    background: "#F8FAFC",
    borderRadius: 10,
    overflow: "hidden",
    padding: 0,
    cursor: "pointer",
  },
  thumbImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  mainImgWrap: {
    width: "100%",
    aspectRatio: "16/9",
    background: "#F2F4F7",
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid #EDF0F2",
  },
  mainImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  block: { marginTop: 28 },
  blockTitle: { fontSize: 20, fontWeight: 800, marginBottom: 12 },

  desc: {
    background: "#FFF",
    border: "1px solid #EEF0F2",
    borderRadius: 12,
    padding: 16,
    lineHeight: 1.6,
  },

  skelHeader: {
    width: 360,
    height: 28,
    background: "#F2F4F7",
    borderRadius: 8,
  },
  skelWide: {
    width: "100%",
    height: 300,
    background: "#F2F4F7",
    borderRadius: 12,
    marginTop: 10,
  },
  skelRow: {
    width: "100%",
    height: 90,
    background: "#F8FAFC",
    borderRadius: 12,
    marginTop: 12,
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
};

const cards = {
  row: {
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    gap: 16,
    marginTop: 16,
  },
  priceCard: {
    background: "#fff",
    border: "1px solid #EEF0F2",
    borderRadius: 12,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  priceLabel: { color: "#667085", fontSize: 13, fontWeight: 600 },
  price: { fontSize: 28, fontWeight: 900, color: "#ef530f" },

  statGrid: {
    background: "#fff",
    border: "1px solid #EEF0F2",
    borderRadius: 12,
    padding: 12,
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
    alignItems: "stretch",
  },
  stat: {
    display: "grid",
    gridTemplateColumns: "36px 1fr",
    gap: 10,
    alignItems: "center",
    border: "1px dashed #EEF0F2",
    borderRadius: 12,
    padding: 10,
  },
  statIcon: {
    width: 36,
    height: 36,
    display: "grid",
    placeItems: "center",
    background: "#F2F4F7",
    borderRadius: 10,
    color: "#344054",
    fontSize: 18,
  },
  statText: { display: "flex", flexDirection: "column" },
  statLabel: { color: "#667085", fontSize: 12, fontWeight: 600 },
  statValue: { fontWeight: 800 },
};

const tbl = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 14,
  },
  col: { display: "flex", flexDirection: "column", gap: 10 },
  table: {
    background: "#fff",
    border: "1px solid #EEF0F2",
    borderRadius: 12,
    overflow: "hidden",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    padding: "10px 12px",
    borderBottom: "1px solid #F2F4F7",
  },
  key: { color: "#667085", fontSize: 13 },
  val: { fontWeight: 700 },
};

const eq = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 16,
  },
  group: {
    background: "#fff",
    border: "1px solid #EEF0F2",
    borderRadius: 12,
    padding: 14,
  },
  title: { fontWeight: 800, marginBottom: 8 },
  list: { margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 6 },
  item: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
  },
  bullet: {
    width: 20,
    height: 20,
    borderRadius: 6,
    display: "grid",
    placeItems: "center",
    color: "#fff",
    fontSize: 12,
    lineHeight: 1,
  },
};
