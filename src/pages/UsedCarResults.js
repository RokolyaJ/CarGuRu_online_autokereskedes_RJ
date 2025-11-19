"use client"

import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import FavoriteButton from "../components/FavoriteButton";

const styles = {
   page: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
    padding: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  title: {
    fontSize: "24px",
    fontWeight: 700,
    margin: 0,
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "400px 1fr",
    gap: 24,
  },
  sidebar: {
    border: "1px solid #eef0f2",
    borderRadius: 8,
    overflow: "hidden",
    background: "#fff",
  },
  sectionBody: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    padding: 12,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  label: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#344054",
  },
  input: {
    padding: "8px 10px",
    border: "1px solid #d0d5dd",
    borderRadius: 4,
    fontSize: "14px",
    fontFamily: "inherit",
  },
  check: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: "14px",
    cursor: "pointer",
  },
  resultsCol: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
    background: "#fafafa",
    padding: 16,
    borderRadius: 12,
    border: "1px solid #eee",
  },
  grid: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  card: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: 16,
    cursor: "pointer",
    background: "#fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    transition: "0.2s",
  },
  img: {
    width: "220px",
    height: "140px",
    objectFit: "cover",
    borderRadius: 4,
  },
  price: {
    fontSize: "18px",
    color: "#ef530f",
    display: "block",
    marginTop: 8,
  },
  pagerWrap: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    padding: 24,
  },
}

const btn = {
  primary: {
    width: "100%",
    padding: "12px 16px",
    background: "#ef530f",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "14px",
    marginTop: 12,
  },
}

const buttonStyle = {
  background: "#f1f1f1",
  border: "1px solid #ddd",
  padding: "8px 16px",
  borderRadius: "6px",
  cursor: "pointer",
}

const dropdownStyle = {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  background: "#fff",
  cursor: "pointer",
}

const fmt = (n) => (Number(n) || 0).toLocaleString("hu-HU", { maximumFractionDigits: 0 })
function PageBtn({ active, disabled, onClick, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 36,
        height: 36,
        padding: "0 10px",
        borderRadius: 8,
        border: "1px solid " + (active ? "#ef530f" : "#d0d5dd"),
        background: active ? "#ef530f" : "#fff",
        color: active ? "#fff" : "#344054",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  )
}

function SectionHeader({ title, open, toggle }) {
  return (
    <div
      onClick={toggle}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontWeight: 700,
        padding: "12px 10px",
        borderBottom: "1px solid #eef0f2",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <span>{title}</span>
      <span style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
    </div>
  )
}

function FilterSidebar({ filters, setFilters, applyFilters, optionSources, resultsCount, pageSize, setPageSize }) {
  const [open, setOpen] = useState({
    markamodel: true,
    altalanos: true,
    muszaki: true,
    jellemzok: true,
    hirdetes: true,
    darab: true,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFilters((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }))
  }

  const modelOptions = useMemo(() => {
    const all = optionSources.models
    if (!filters.brand) return all
    return Array.from(new Set(optionSources.allCars.filter((c) => c.brand === filters.brand).map((c) => c.model)))
  }, [filters.brand, optionSources.models, optionSources.allCars])

  return (
    <aside style={styles.sidebar}>
      <SectionHeader
        title="Márka, modell, típus"
        open={open.markamodel}
        toggle={() => setOpen((o) => ({ ...o, markamodel: !o.markamodel }))}
      />
      {open.markamodel && (
        <div style={styles.sectionBody}>
          <div style={styles.field}>
            <div style={styles.label}>Márka</div>
            <select name="brand" value={filters.brand} onChange={handleChange} style={styles.input}>
              <option value="">AUDI (Mindegy)</option>
              {optionSources.brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <div style={styles.label}>Modell</div>
            <select
              name="model"
              value={filters.model}
              onChange={handleChange}
              style={styles.input}
              disabled={!filters.brand && modelOptions.length === 0}
            >
              <option value="">Mindegy</option>
              {modelOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <div style={styles.label}>Típusjel</div>
            <input
              name="typeCode"
              value={filters.typeCode || ""}
              onChange={handleChange}
              style={styles.input}
              placeholder=""
            />
          </div>
        </div>
      )}

      <SectionHeader
        title="Általános adatok"
        open={open.altalanos}
        toggle={() => setOpen((o) => ({ ...o, altalanos: !o.altalanos }))}
      />
      {open.altalanos && (
        <div style={styles.sectionBody}>
          <div style={styles.field}>
            <div style={styles.label}>Vételár (-tól -ig)</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <input
                type="number"
                name="priceFrom"
                value={filters.priceFrom || ""}
                onChange={handleChange}
                style={styles.input}
                placeholder="-tól"
              />
              <input
                type="number"
                name="priceTo"
                value={filters.priceTo || ""}
                onChange={handleChange}
                style={styles.input}
                placeholder="-ig"
              />
            </div>
          </div>

          <div style={styles.field}>
            <div style={styles.label}>Évjárat (-tól -ig)</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <input
                type="number"
                name="yearFrom"
                value={filters.yearFrom || ""}
                onChange={handleChange}
                style={styles.input}
                placeholder="-tól"
              />
              <input
                type="number"
                name="yearTo"
                value={filters.yearTo || ""}
                onChange={handleChange}
                style={styles.input}
                placeholder="-ig"
              />
            </div>
          </div>

          <div style={styles.field}>
            <div style={styles.label}>Kivitel</div>
            <select name="body" value={filters.body} onChange={handleChange} style={styles.input}>
              <option value="">Mindegy</option>
              {optionSources.bodies.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <div style={styles.label}>Üzemanyag</div>
            <select name="fuel" value={filters.fuel} onChange={handleChange} style={styles.input}>
              <option value="">Mindegy</option>
              {optionSources.fuels.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <div style={styles.label}>Km. óra állás (-tól -ig)</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <input
                type="number"
                name="mileageFrom"
                value={filters.mileageFrom || ""}
                onChange={handleChange}
                style={styles.input}
                placeholder="-tól"
              />
              <input
                type="number"
                name="mileageTo"
                value={filters.mileageTo || ""}
                onChange={handleChange}
                style={styles.input}
                placeholder="-ig"
              />
            </div>
          </div>

          <div style={styles.field}>
            <div style={styles.label}>Hengerűrtartalom (-tól -ig)</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <input
                type="number"
                name="engineCcFrom"
                value={filters.engineCcFrom || ""}
                onChange={handleChange}
                style={styles.input}
                placeholder="-tól"
              />
              <input
                type="number"
                name="engineCcTo"
                value={filters.engineCcTo || ""}
                onChange={handleChange}
                style={styles.input}
                placeholder="-ig"
              />
            </div>
          </div>

          <div style={styles.field}>
            <div style={styles.label}>Állapot</div>
            <select name="condition" value={filters.condition} onChange={handleChange} style={styles.input}>
              <option value="">Normál, Kitűnő…</option>
              {optionSources.conditions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <div style={styles.label}>Ajtók száma</div>
            <select name="doors" value={filters.doors} onChange={handleChange} style={styles.input}>
              <option value="">Mindegy</option>
              {optionSources.doors.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <div style={styles.label}>Ülések száma</div>
            <select name="seats" value={filters.seats} onChange={handleChange} style={styles.input}>
              <option value="">Mindegy</option>
              {optionSources.seats.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      <SectionHeader
        title="Jellemzők"
        open={open.jellemzok}
        toggle={() => setOpen((o) => ({ ...o, jellemzok: !o.jellemzok }))}
      />
      {open.jellemzok && (
        <div style={styles.sectionBody}>
          {[
            ["automatic", "Automata"],
            ["awd", "Összkerékhajtás"],
            ["isofix", "ISOFIX rendszer"],
            ["electricWindows", "Elektromos ablak"],
            ["alloyWheels", "Alufelni"],
            ["ac", "Klíma"],
            ["cruiseControl", "Tempomat"],
            ["serviceBook", "Szervizkönyv"],
            ["esp", "ESP (menetstabilizátor)"],
            ["towHook", "Vonóhorog"],
            ["regValidHu", "Érvényes magyar forgalmi"],
            ["veteran", "Veterán"],
          ].map(([key, label]) => (
            <label key={key} style={styles.check}>
              <input type="checkbox" name={key} checked={!!filters[key]} onChange={handleChange} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      )}

      <SectionHeader
        title="Hirdetés típus"
        open={open.hirdetes}
        toggle={() => setOpen((o) => ({ ...o, hirdetes: !o.hirdetes }))}
      />
      {open.hirdetes && (
        <div style={styles.sectionBody}>
          {[
            ["isUsed", "használt járművek"],
            ["hasWarranty", "garanciális járművek"],
            ["isNewOrDemo", "új, teszt járművek"],
            ["rentable", "bérelhető járművek"],
            ["hasDocuments", "feltöltött dokumentum"],
            ["historyChecked", "ellenőrizhető járműelőélet"],
          ].map(([key, label]) => (
            <label key={key} style={styles.check}>
              <input type="checkbox" name={key} checked={!!filters[key]} onChange={handleChange} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      )}

      <SectionHeader
        title="Találatok száma"
        open={open.darab}
        toggle={() => setOpen((o) => ({ ...o, darab: !o.darab }))}
      />
      {open.darab && (
        <div style={{ ...styles.sectionBody, gap: 8 }}>
          <div style={styles.label}>Találatok (db/oldal)</div>
          <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} style={styles.input}>
            {[25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      )}

      <button onClick={applyFilters} style={btn.primary}>
        Szűrés ({fmt(resultsCount)} db találat)
      </button>
    </aside>
  )
}

const defaultFilters = {
  brand: "",
  model: "",
  body: "",
  fuel: "",
  yearFrom: "",
  yearTo: "",
  priceFrom: "",
  priceTo: "",
  typeCode: "",
  mileageFrom: "",
  mileageTo: "",
  engineCcFrom: "",
  engineCcTo: "",
  condition: "",
  doors: "",
  seats: "",
  automatic: false,
  cruiseControl: false,
  awd: false,
  alloyWheels: false,
  electricWindows: false,
  towHook: false,
  isofix: false,
  esp: false,
  serviceBook: false,
  veteran: false,
  isNewOrDemo: false,
  hasWarranty: false,
  rentable: false,
  hasDocuments: false,
  isUsed: false,
  historyChecked: false,
  ac: false,
  regValidHu: false,
}
export default function UsedCarResults() {
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (state?.forceRefresh) {
      applyFilters();
      navigate(".", { replace: true, state: {} });
    }
  }, [state]);

  const [sort, setSort] = useState("")
  const initialCars = state?.cars || []
  const [cars, setCars] = useState(initialCars)
  const initialFilters = state?.filters || {}
  const [filters, setFilters] = useState({ ...defaultFilters, ...initialFilters })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [shouldReload, setShouldReload] = useState(true);
  const optionSources = useMemo(() => {
    const uniq = (arr) => Array.from(new Set(arr.filter(Boolean)))
    return {
      allCars: cars,
      brands: uniq(cars.map((c) => c.brand)),
      models: uniq(cars.map((c) => c.model)),
      bodies: uniq(cars.map((c) => c.body)),
      fuels: uniq(cars.map((c) => c.fuel)),
      conditions: uniq(cars.map((c) => c.condition)),
      doors: uniq(cars.map((c) => c.doors)),
      seats: uniq(cars.map((c) => c.seats)),
    }
  }, [cars])
  const applyFilterFn = (car) => {
    const num = (v) => (v === "" || v === null || v === undefined ? undefined : Number(v))

    const checks = [
      !filters.brand || car.brand === filters.brand,
      !filters.model || car.model === filters.model,
      !filters.body || car.body === filters.body,
      !filters.fuel || car.fuel === filters.fuel,
      !filters.typeCode ||
        (car.typeCode || "").toString().toLowerCase().includes(filters.typeCode.toString().toLowerCase()),
      !filters.condition || car.condition === filters.condition,
      !filters.doors || String(car.doors) === String(filters.doors),
      !filters.seats || String(car.seats) === String(filters.seats),

      num(filters.yearFrom) === undefined || Number(car.year) >= Number(filters.yearFrom),
      num(filters.yearTo) === undefined || Number(car.year) <= Number(filters.yearTo),

      num(filters.priceFrom) === undefined || Number(car.price) >= Number(filters.priceFrom),
      num(filters.priceTo) === undefined || Number(car.price) <= Number(filters.priceTo),

      num(filters.mileageFrom) === undefined || Number(car.mileage) >= Number(filters.mileageFrom),
      num(filters.mileageTo) === undefined || Number(car.mileage) <= Number(filters.mileageTo),

      num(filters.engineCcFrom) === undefined || Number(car.engineCc) >= Number(filters.engineCcFrom),
      num(filters.engineCcTo) === undefined || Number(car.engineCc) <= Number(filters.engineCcTo),

      !filters.automatic || !!car.automatic,
      !filters.cruiseControl || !!car.cruiseControl,
      !filters.awd || !!car.awd,
      !filters.alloyWheels || !!car.alloyWheels,
      !filters.electricWindows || !!car.electricWindows,
      !filters.towHook || !!car.towHook,
      !filters.isofix || !!car.isofix,
      !filters.esp || !!car.esp,
      !filters.serviceBook || !!car.serviceBook,
      !filters.veteran || !!car.veteran,
      !filters.isNewOrDemo || !!car.isNewOrDemo,
      !filters.hasWarranty || !!car.hasWarranty,
      !filters.rentable || !!car.rentable,
      !filters.hasDocuments || !!car.hasDocuments,
      !filters.isUsed || !!car.isUsed,
      !filters.historyChecked || !!car.historyChecked,
      !filters.ac || !!car.ac,
      !filters.regValidHu || !!car.regValidHu,
    ]

    return checks.every(Boolean)
  }
  const filtered = useMemo(() => {
    return cars.filter(applyFilterFn)
  }, [cars, filters])
  const sortedCars = useMemo(() => {
    if (sort === "priceAsc") return [...filtered].sort((a, b) => a.price - b.price)
    if (sort === "priceDesc") return [...filtered].sort((a, b) => b.price - a.price)
    if (sort === "yearAsc") return [...filtered].sort((a, b) => a.year - b.year)
    if (sort === "yearDesc") return [...filtered].sort((a, b) => b.year - a.year)
    if (sort === "kmAsc") return [...filtered].sort((a, b) => a.mileage - b.mileage)
    if (sort === "kmDesc") return [...filtered].sort((a, b) => b.mileage - a.mileage)
    return filtered
  }, [filtered, sort])
  const pagedCars = useMemo(() => {
    const start = (page - 1) * pageSize
    return sortedCars.slice(start, start + pageSize)
  }, [sortedCars, page, pageSize])
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageNumbers = useMemo(() => {
    const pages = []
    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
      return pages
    }
    for (let i = 1; i <= 10; i++) pages.push(i)
    pages.push("…")
    pages.push(totalPages)
    return pages
  }, [totalPages])
  useEffect(() => {
    const totalPagesCalc = Math.max(1, Math.ceil(filtered.length / pageSize))
    if (page > totalPagesCalc) setPage(1)
  }, [filtered.length, pageSize, page])

  const applyFilters = async () => {
    console.log("SZŰRÉS INDULT", filters)

    try {
      const response = await fetch("http://localhost:8080/api/usedcars/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      })

      if (!response.ok) throw new Error("Hiba a backend hívás közben")

      const data = await response.json()
      setCars(data)
      setPage(1)
    } catch (err) {
      console.error("Szűrési hiba:", err)
    }
  }
  return (
  <div>
    <Navbar />

    <div style={styles.page}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => navigate(-1)} style={buttonStyle}>
            ← Vissza a keresőhöz
          </button>
          <button onClick={() => navigate("/")} style={buttonStyle}>
            Új keresés indítása
          </button>
        </div>

        <select value={sort} onChange={(e) => setSort(e.target.value)} style={dropdownStyle}>
          <option value="">Rendezés...</option>
          <option value="priceAsc">Vételár szerint növekvő</option>
          <option value="priceDesc">Vételár szerint csökkenő</option>
          <option value="yearAsc">Évjárat szerint növekvő</option>
          <option value="yearDesc">Évjárat szerint csökkenő</option>
          <option value="kmAsc">Kilométer szerint növekvő</option>
          <option value="kmDesc">Kilométer szerint csökkenő</option>
        </select>
      </div>

      <div style={styles.layout}>
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          applyFilters={applyFilters}
          optionSources={optionSources}
          resultsCount={filtered.length}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />

<main style={styles.resultsCol}>

  {filtered.length === 0 && (
    <p style={{ padding: 24, textAlign: "center", color: "red" }}>
      Nincs találat a keresésre.
    </p>
  )}
  {filtered.length > 0 && (
    <div style={styles.grid}>
      {pagedCars.map((car) => (
        <div
  key={car.id}
  style={styles.card}
  onClick={() => navigate(`/used-cars/${car.id}`)}
>
  <div style={{ position: "relative" }}>
  {car.reserved && (
    <div
      style={{
        position: "absolute",
        top: 8,
        left: 8,
        background: "red",
        color: "white",
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: 700,
        zIndex: 3,
      }}
    >
      FOGLALT
    </div>
  )}
  <img
  src={
    car.imageUrl
      ? car.imageUrl
      : "/placeholder.png"
  }
  alt={`${car.brand} ${car.model}`}
  style={styles.img}
  onError={(e) => (e.currentTarget.src = "/placeholder.png")}
/>
  <div
    style={{
      position: "absolute",
      right: 8,
      bottom: 8,
      zIndex: 2,
    }}
    onClick={(e) => e.stopPropagation()}
  >
    <FavoriteButton carId={car.id} size={22} />
  </div>


</div>


  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <h3 style={{ margin: 0 }}>
      {car.brand} {car.model}
    </h3>
    <p style={{ margin: 0, color: "#667085" }}>
      {car.year} • {fmt(car.mileage)} km • {car.fuel} • {car.body}
    </p>
    <strong style={styles.price}>{fmt(car.price)} Ft</strong>
  </div>
</div>

      ))}
    </div>
  )}
  {filtered.length > 0 && (
    <div style={styles.pagerWrap}>
      <PageBtn disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
        ←
      </PageBtn>

      {pageNumbers.map((n, i) =>
        n === "…" ? (
          <div key={`dots-${i}`} style={{ padding: "0 6px", color: "#667085" }}>
            …
          </div>
        ) : (
          <PageBtn key={n} active={page === n} onClick={() => setPage(Number(n))}>
            {n}
          </PageBtn>
        )
      )}

      <PageBtn
        disabled={page === totalPages}
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
      >
        →
      </PageBtn>
    </div>
  )}
</main>

      </div>
    </div>
  </div>
)
}