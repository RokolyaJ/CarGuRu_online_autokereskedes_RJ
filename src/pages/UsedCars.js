import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true            
});

export default function UsedCars() {
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
engineId: "",
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

  });

  
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [engines, setEngines] = useState([]);

  const [bodies, setBodies] = useState([]);
  const [fuels, setFuels] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [doors, setDoors] = useState([]);
  const [seats, setSeats] = useState([]);

  const [featuredCars, setFeaturedCars] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    api.get("/api/usedcars/brands").then(r => setBrands(r.data || []));
    api.get("/api/usedcars/bodies").then(r => setBodies(r.data || []));
    api.get("/api/usedcars/fuels").then(r => setFuels(r.data || []));
    api.get("/api/usedcars/conditions").then(r => setConditions(r.data || []));
    api.get("/api/usedcars/doors").then(r => setDoors(r.data || []));
    api.get("/api/usedcars/seats").then(r => setSeats(r.data || []));
    api.get("/api/usedcars/featured").then(r => setFeaturedCars(r.data || []));
  }, []);

  useEffect(() => {
    if (!filters.brand) {
      setModels([]);
      setFilters(f => ({ ...f, model: "" }));
      return;
    }
    api.get(`/api/usedcars/models?brand=${encodeURIComponent(filters.brand)}`)
       .then(r => setModels(r.data || []));
  }, [filters.brand]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };
  useEffect(() => {
  if (!filters.brand || !filters.model) {
    setEngines([]);
    setFilters(f => ({ ...f, engineId: "" }));
    return;
  }

  api.get("/api/engines", {
    params: {
      brand: filters.brand,
      model: filters.model
    }
  }).then(r => setEngines(r.data || []));
}, [filters.brand, filters.model]);
const handleSearch = async () => {
  setLoading(true);
  try {
    const { data } = await api.post("/api/usedcars/search", filters);
navigate("/used-cars/results", { state: { cars: data, filters } });
  } catch (err) {
    console.error("Hiba a keresésnél:", err);
  } finally {
    setLoading(false);
  }
};
  const Reset = () => {
    setFilters(f => ({
      ...f,
      brand: "", model: "", body: "", fuel: "",
      yearFrom: "", yearTo: "", priceFrom: "", priceTo: "",
      typeCode: "", mileageFrom: "", mileageTo: "",
      engineCcFrom: "", engineCcTo: "", condition: "", doors: "", seats: ""
    }));
    setCars([]);
  };

  return (
    <div>
      <Navbar />
      <div style={s.page}>
    <div style={{ maxWidth: "1100px", margin: "0 auto 20px auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h1>Használt autók</h1>
      <button
        onClick={() => navigate("/used-cars/new-ad")}
        style={{
          background: "#ef530f",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "10px 18px",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
          transition: "0.2s"
        }}
      >
        + Hirdetés feladása
      </button>
    </div>


<div style={s.panel}>
  <div style={s.row}>
    <Select label="Márka" name="brand" value={filters.brand} onChange={handleChange} data={brands} any="Mindegy" />
    <Select label="Modell" name="model" value={filters.model} onChange={handleChange} data={models} disabled={!filters.brand} any="Mindegy" />
   <div style={s.field}>
  <div style={s.label}>Motor</div>
  <select
    name="engineId"
    value={filters.engineId}
    onChange={handleChange}
    disabled={!filters.brand || !filters.model}
    style={s.input}
  >
    <option value="">Mindegy</option>
    {engines.map(e => (
      <option key={e.id} value={e.id}>{e.name}</option>
    ))}
  </select>
</div>



    <Select label="Kivitel" name="body" value={filters.body} onChange={handleChange} data={bodies} any="Mindegy" />
    <Select label="Üzemanyag" name="fuel" value={filters.fuel} onChange={handleChange} data={fuels} any="Mindegy" />

    <Dual label="Év" left={{ name: "yearFrom", value: filters.yearFrom, placeholder: "-tól" }} right={{ name: "yearTo", value: filters.yearTo, placeholder: "-ig" }} onChange={handleChange}/>
    <Dual label="Vételár" left={{ name: "priceFrom", value: filters.priceFrom, placeholder: "-tól", suffix: "Ft" }} right={{ name: "priceTo", value: filters.priceTo, placeholder: "-ig", suffix: "Ft" }} onChange={handleChange} type="number"/>

    <Select label="Típusjel" name="typeCode" value={filters.typeCode} onChange={handleChange} data={[]} any="Mindegy" />
    <Dual label="Km. óra állás" left={{name:"mileageFrom", value:filters.mileageFrom, placeholder:"-tól", suffix:"km"}} right={{name:"mileageTo", value:filters.mileageTo, placeholder:"-ig", suffix:"km"}} onChange={handleChange} type="number" />
    <Dual label="Heng. tart." left={{name:"engineCcFrom", value:filters.engineCcFrom, placeholder:"-tól", suffix:"cm³"}} right={{name:"engineCcTo", value:filters.engineCcTo, placeholder:"-ig", suffix:"cm³"}} onChange={handleChange} type="number" />
    <Select label="Állapot" name="condition" value={filters.condition} onChange={handleChange} data={conditions} any="Normál, Kitűnő…" />
    <Select label="Ajtók száma" name="doors" value={filters.doors} onChange={handleChange} data={doors} any="Mindegy" />
    <Select label="Ülések száma" name="seats" value={filters.seats} onChange={handleChange} data={seats} any="Mindegy" />

  </div>

          <div style={s.checkGrid}>
            {[
              ["automatic","automata"],
              ["cruiseControl","tempomat"],
              ["awd","összkerékmeghajtás"],
              ["alloyWheels","alufelni"],
              ["electricWindows","elektromos ablak"],
              ["towHook","vonóhorog"],
              ["isofix","ISOFIX rendszer"],
              ["esp","ESP (menetstabilizátor)"],
              ["serviceBook","szervizkönyv"],
              ["veteran","veterán"],
            ].map(([key,label]) => (
              <label key={key} style={s.check}>
                <input type="checkbox" name={key} checked={!!filters[key]} onChange={handleChange} />
                <span>{label}</span>
              </label>
            ))}
          </div>
          <div style={s.rightCol}>
            <label style={s.check}>
              <input type="checkbox" name="isNewOrDemo" checked={filters.isNewOrDemo} onChange={handleChange} />
              <span>új, teszt járművek</span>
            </label>
            <label style={s.check}>
              <input type="checkbox" name="hasWarranty" checked={filters.hasWarranty} onChange={handleChange} />
              <span>garanciális járművek</span>
            </label>
            <label style={s.check}>
              <input type="checkbox" name="rentable" checked={filters.rentable} onChange={handleChange} />
              <span>bérelhető járművek</span>
            </label>
            <label style={s.check}>
              <input type="checkbox" name="hasDocuments" checked={filters.hasDocuments} onChange={handleChange} />
              <span>feltöltött dokumentum</span>
            </label>
            <label style={s.check}>
              <input type="checkbox" name="isUsed" checked={filters.isUsed} onChange={handleChange} />
              <span>használt járművek</span>
            </label>
          </div>
          <div style={{...s.row, alignItems:"center"}}>
            <label style={s.check}>
              <input type="checkbox" name="historyChecked" checked={filters.historyChecked} onChange={handleChange} />
              <span>ellenőrizhető járműelőélet</span>
            </label>
            <label style={s.check}>
              <input type="checkbox" name="ac" checked={filters.ac} onChange={handleChange} />
              <span>klíma</span>
            </label>
            <label style={s.check}>
              <input type="checkbox" name="regValidHu" checked={filters.regValidHu} onChange={handleChange} />
              <span>érvényes magyar forgalmi</span>
            </label>

            <div style={{marginLeft:"auto", display:"flex", gap:10}}>
              <button onClick={Reset} style={btn.ghost}>Keresési feltételek törlése</button>
              <button onClick={handleSearch} style={btn.primary}>{loading ? "Keresés…" : "Keresés"}</button>
            </div>
          </div>
        </div>

        <h2>Kiemelt hirdetések</h2>
        <div style={grid.cards}>
          {featuredCars.map(c => <Card key={`f${c.id}`} car={c} />)}
          {!featuredCars.length && <p>Nincs kiemelt autó.</p>}
        </div>
        <h2>Találatok</h2>
        <div style={grid.cards}>
          {cars.map(c => <Card key={c.id} car={c} />)}
          {!loading && !cars.length && <p>Nincs találat.</p>}
        </div>
      </div>
    </div>
  );
}
function Select({label, name, value, onChange, data, any="Mindegy", disabled=false}){
  return (
    <div style={s.field}>
      <div style={s.label}>{label}</div>
      <select name={name} value={value} onChange={onChange} disabled={disabled} style={s.input}>
        <option value="">{any}</option>
        {data.map(v => (
          <option key={String(v)} value={v}>{v}</option>
        ))}
      </select>
    </div>
  );
}


function Dual({label, left, right, onChange, type="text"}){
  return (
    <div style={s.field}>
      <div style={s.label}>{label}</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        <input
          type={type}
          name={left.name}
          value={left.value || ""}
          placeholder={left.placeholder}
          onChange={onChange}
          style={{ ...s.input, width: "100%", boxSizing: "border-box" }}  
        />
        <input
          type={type}
          name={right.name}
          value={right.value || ""}
          placeholder={right.placeholder}
          onChange={onChange}
          style={{ ...s.input, width: "100%", boxSizing: "border-box" }} 
        />
      </div>
    </div>
  );
}


function Card({ car }) {
  const navigate = useNavigate();

  return (
    <article
      style={{ ...card.root, cursor: "pointer" }}
      onClick={() => navigate(`/used-cars/${car.id}`)}

    >
      <div style={card.imgWrap}>
        <img src={car.imageUrl || "/placeholder.png"} alt={`${car.brand} ${car.model}`} style={card.img} />
      </div>
      <div style={card.body}>
        <div style={card.title}>{car.brand} {car.model}</div>
        <div style={card.meta}>
          <span>{car.year}</span>
          <span>{(car.mileage || 0).toLocaleString("hu-HU")} km</span>
          <span>{car.fuel}</span>
          <span>{car.body}</span>
        </div>
        <div style={card.price}>{(car.price || 0).toLocaleString("hu-HU")} Ft</div>
      </div>
    </article>
  );
}


const s = {
  page:{
    maxWidth: "1400px",
    margin: "0 auto",
padding: "100px 20px 60px",
    fontFamily:"Inter, Arial, sans-serif"
  },
  panel:{
    background:"#fff",
  border:"1px solid #e6e8eb",
  borderRadius:12,
  padding:20,
  margin:"20px auto",
  boxShadow:"0 2px 6px rgba(0,0,0,0.05)",
  maxWidth: "1100px",     
  width: "100%"      
  },
  row:{
    display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 14,
  marginBottom: 14,
  gridAutoFlow: "dense" 
  },
  field:{ display:"flex", flexDirection:"column", gap:6 },
  label:{ fontSize:13, fontWeight:500, color:"#555" },
  input:{
    padding:"10px 12px",
  border:"1px solid #d0d5dd",
  borderRadius:8,
  fontSize:14,
  background:"#fff",
  width:"100%",           
  boxSizing:"border-box", 
  transition:"all 0.2s",
  },
  checkGrid:{
    display:"grid",
    gridTemplateColumns:"repeat(5, 1fr)",
    gap:12,
    margin:"8px 0 12px"
  },
  check:{
    display:"flex",
    alignItems:"center",
    gap:8,
    fontSize:14,
    color:"#333"
  },
  rightCol:{
    display:"grid",
    gridTemplateColumns:"repeat(5, 1fr)", 
    gap:12,
    margin:"8px 0 12px"
  }
};


const btn = {
  primary:{
    background:"#ef530f",
    color:"#fff",
    border:"none",
    borderRadius:10,
    padding:"10px 18px",
    cursor:"pointer",
    fontWeight:600,
    boxShadow:"0 2px 4px rgba(0,0,0,0.1)",
    transition:"all 0.2s"
  },
  ghost:{
    background:"#fff",
    color:"#344054",
    border:"1px solid #d0d5dd",
    borderRadius:10,
    padding:"10px 16px",
    cursor:"pointer",
    fontWeight:500,
    transition:"all 0.2s"
  }
};


const grid = {
  cards:{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:14 }
};

const card = {
  root:{ border:"1px solid #eef0f2", borderRadius:12, overflow:"hidden", background:"#fff", display:"flex", flexDirection:"column" },
  imgWrap:{ aspectRatio:"4/3", background:"#f6f7f9" },
  img:{ width:"100%", height:"100%", objectFit:"cover" },
  body:{ padding:12, display:"flex", flexDirection:"column", gap:8 },
  title:{ fontWeight:700 },
  meta:{ display:"flex", gap:8, flexWrap:"wrap", color:"#667085", fontSize:13 },
  price:{ marginTop:"auto", fontSize:18, fontWeight:800 }
};
