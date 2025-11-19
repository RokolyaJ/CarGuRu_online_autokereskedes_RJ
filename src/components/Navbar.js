import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  FiShoppingCart,
  FiHeart,
  FiMapPin,
  FiSun,
  FiMoon,
  FiUser,
  FiMenu,
  FiX
} from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import AuthDialog from "./AuthDialog";

function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { cart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [brandsPanelOpen, setBrandsPanelOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const authRef = useRef(null);
  const profileRef = useRef(null);

  const [vw, setVw] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1920
  );
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const compact = vw < 1280;
  const tight = vw < 1060;

  const isConfiguratorPage = location.pathname.startsWith("/configurator");
  const isHomePage = location.pathname === "/";

  const pathParts = location.pathname.split("/");
  const selectedBrand = pathParts[2] || "";
  const selectedModelSlug = pathParts[3] || "";
  const variantId = pathParts[3] || "";

  useEffect(() => {
    const path = location.pathname;
    if (path === "/configurator") setStep(1);
    else if (path.match(/^\/configurator\/[a-z]+$/)) setStep(2);
    else if (path.match(/^\/configurator\/[a-z0-9-]+\/[a-z0-9-]+$/)) setStep(3);
    else if (path.includes("/appearance")) setStep(4);
    else if (path.includes("/equipment")) setStep(5);
    else if (path.includes("/summary")) setStep(6);
  }, [location.pathname]);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (authOpen && authRef.current && !authRef.current.contains(e.target))
        setAuthOpen(false);
      if (profileOpen && profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [authOpen, profileOpen]);

  useEffect(() => {
    if (menuOpen || brandsPanelOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [menuOpen, brandsPanelOpen]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setBrandsPanelOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const brands = [
    { name: "Audi", logo: "/images/home_page/brand_logo/audi_logo.png" },
    { name: "BMW", logo: "/images/home_page/brand_logo/bmw_logo.jpg" },
    { name: "Mercedes", logo: "/images/home_page/brand_logo/mercedes_logo.png" },
    { name: "Volkswagen", logo: "/images/home_page/brand_logo/volkswagen_logo.png" },
    { name: "Skoda", logo: "/images/home_page/brand_logo/skoda_logo.jpg" }
  ];

  const navPadding = tight ? "12px 18px" : compact ? "14px 28px" : "15px 40px";
  const logoH = tight ? 70 : compact ? 86 : 100;
  const gapRight = tight ? 10 : 15;
  const btnPad = tight ? "6px 10px" : compact ? "6px 12px" : "8px 14px";
  const btnFont = tight ? "13px" : "14px";
  const toggleSize = tight ? 34 : compact ? 38 : 42;

  const themeBtnStyle = {
    ...styles.themeToggleBase,
    width: toggleSize,
    height: toggleSize,
    background: darkMode ? "#f59e0b" : "#0f172a",
    border: "2px solid #fff",
    color: darkMode ? "#111" : "#fff"
  };

  const handleMenuButton = () => {
    if (menuOpen) {
      setMenuOpen(false);
    } else {
      setMenuOpen(true);
      setBrandsPanelOpen(false); 
    }
  };
  const handleBrandsButton = () => {
    if (brandsPanelOpen) {
      setBrandsPanelOpen(false);
    } else {
      setBrandsPanelOpen(true);
      setMenuOpen(false); 
    }
  };
  const cartCount = cart?.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;

  return (
    <>
      <nav
        style={{
          ...styles.navbar,
          padding: navPadding,
          background: isConfiguratorPage
            ? "linear-gradient(to right, #0f2027, #203a43, #2c5364)"
            : darkMode
            ? "#111"
            : "#000"
        }}
      >
        <div style={{ ...styles.leftSide, gap: compact ? 16 : 20 }}>
          {isHomePage && (
            <button
              style={styles.hamburgerBtn}
              onClick={handleMenuButton}
              aria-label="Főmenü"
            >
              <FiMenu size={24} />
            </button>
          )}

          {isHomePage && (
            <span
              style={{ ...styles.brandPanelToggle, fontSize: compact ? "1.05rem" : "1.1rem" }}
              onClick={handleBrandsButton}
            >
              Márkák ▾
            </span>
          )}

          {isHomePage && (
            <Link
              to="/used-cars"
              style={{ ...styles.usedCarsButton, padding: btnPad, fontSize: btnFont }}
            >
              Használtautók
            </Link>
          )}
        </div>

        <div style={styles.centerLogo}>
          <Link to="/" style={{ pointerEvents: "auto" }}>
            <img
              src="/images/logo/logo.png"
              alt="CarGuRu Logo"
              style={{ ...styles.logoCenter, height: logoH }}
            />
          </Link>
        </div>

        <div style={{ ...styles.rightSide, gap: gapRight }}>
          {user && (
  <>
    <Link to="/favorites" style={styles.iconLink}>
      <FiHeart size={22} />
    </Link>

    {!location.pathname.startsWith("/used-cars") && (
  <Link to="/cart" style={{ ...styles.iconLink, position: "relative" }}>
    <FiShoppingCart size={22} />
  </Link>
)}

    {!location.pathname.startsWith("/used-cars") && (
      <Link to="/locations" style={styles.iconLink}>
        <FiMapPin size={22} />
      </Link>
    )}
  </>
)}


          {!user && (
            <div style={{ position: "relative" }} ref={authRef}>
              <button
                onClick={() => setAuthOpen((p) => !p)}
                style={{ ...styles.loginButton, padding: btnPad, fontSize: btnFont }}
              >
                Bejelentkezés
              </button>
              {authOpen && (
                <div style={styles.authDialogWrapper}>
                  <AuthDialog onClose={() => setAuthOpen(false)} />
                </div>
              )}
            </div>
          )}

          {user && (
            <div style={{ position: "relative" }} ref={profileRef}>
              <button onClick={() => setProfileOpen((p) => !p)} style={styles.profileButton}>
                <FiUser size={22} />
              </button>
              {profileOpen && (
                <div style={styles.profileMenu}>
  <div style={styles.profileHeader}>Üdvözöljük, {user.fullName}</div>
  <div style={styles.profileItem} onClick={() => { setProfileOpen(false); navigate("/dashboard"); }}>Irányítópult</div>
  <div style={styles.profileItem}>A kívánságlistám</div>
 <div
  style={styles.profileItem}
  onClick={() => {
    setProfileOpen(false);
    navigate("/messages");
  }}
>
  Üzeneteim
</div>

  <div style={styles.profileItem} onClick={() => { setProfileOpen(false); navigate("/profile"); }}>Saját fiók</div>
    <div
      style={styles.profileItem}
      onClick={() => {
        setProfileOpen(false);
        navigate("/used-cars/my");
      }}
    >
      Feltöltött hirdetéseim
    </div>
<div
  style={styles.profileItem}
  onClick={() => {
    setProfileOpen(false);
    navigate("/used-cars/my-reservations");
  }}
>
  Lefoglalt hirdetéseim
</div>

    {user.role === "ADMIN" && (
      <div
        style={styles.profileItem}
        onClick={() => {
          setProfileOpen(false);
          navigate("/used-cars/admin");
        }}
      >
        Feltöltött hirdetések (Admin)
      </div>
    )}

  <div
    style={styles.profileItem}
    onClick={() => {
      setProfileOpen(false);
      navigate("/car-calculator");
    }}
  >
    Autó kalkulálás
  </div>

  {user.role === "ADMIN" && (
    <div style={styles.profileItem} onClick={() => { setProfileOpen(false); navigate("/admin"); }}>Admin felület</div>
  )}
  <div style={styles.profileItem}>Kapcsolat</div>
  <hr />
  <button onClick={logout} style={styles.logoutButton}>Kijelentkezés</button>
</div>

              )}
            </div>
          )}

          <button
            onClick={toggleTheme}
            style={themeBtnStyle}
            aria-label={darkMode ? "Világos mód" : "Sötét mód"}
            title={darkMode ? "Világos mód" : "Sötét mód"}
          >
            {darkMode ? <FiSun size={tight ? 18 : 22} /> : <FiMoon size={tight ? 18 : 22} />}
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div
          style={{
            ...styles.topDropMenu,
            backgroundColor: darkMode ? "#1a1a1a" : "#f2f2f2",
            color: darkMode ? "#fff" : "#000"
          }}
        >
          <button
            style={{ ...styles.closeTopMenu, color: darkMode ? "#fff" : "#000" }}
            onClick={() => setMenuOpen(false)}
          >
            <FiX size={26} />
          </button>
          <div style={styles.topMenuItems}>
            {["Érdeklődőknek","Tulajdonosoknak","A Škoda világa","Akciók","Finanszírozás","Kapcsolat"]
              .map(item => (
                <div key={item} style={{ ...styles.topMenuItem, color: darkMode ? "#fff" : "#000" }}>
                  {item}
                </div>
              ))}
          </div>
        </div>
      )}

      {brandsPanelOpen && (
        <div
          style={{
            ...styles.brandsPanel,
            backgroundColor: darkMode ? "#1a1a1a" : "#fff",
            color: darkMode ? "#fff" : "#000"
          }}
        >
          <button
            style={{ ...styles.closeTopMenu, color: darkMode ? "#fff" : "#000" }}
            onClick={() => setBrandsPanelOpen(false)}
          >
            <FiX size={26} />
          </button>
          <h2 style={{ ...styles.brandsHeading, color: darkMode ? "#fff" : "#000" }}>
            Márkák áttekintése
          </h2>
          <div style={styles.brandsGrid}>
            {brands.map(b => (
              <Link
                key={b.name}
                to={`/brand/${b.name.toLowerCase()}`}
                style={{ ...styles.brandItem, color: darkMode ? "#fff" : "#000" }}
                onClick={() => setBrandsPanelOpen(false)}
              >
                <img src={b.logo} alt={b.name} style={styles.brandLogo}/>
                <span style={styles.brandName}>{b.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {isConfiguratorPage && (
        <div style={styles.subMenu}>
          {["Márkák","Modellek","Változat","Megjelenés","Felszereltség","Áttekintés"].map((t,i)=>(
            <button key={t}
              style={{...styles.subMenuItem,color:step>=i+1?"#000":"#999"}}
              disabled={step<i+1}
            >{t}</button>
          ))}
        </div>
      )}
    </>
  );
}

const styles = {
  navbar:{display:"flex",alignItems:"center",justifyContent:"space-between",position:"fixed",top:0,left:0,width:"100%",zIndex:1000,color:"#fff",transition:"background .3s",boxSizing:"border-box",paddingTop:"10px",height:"60px"},
  leftSide:{display:"flex",alignItems:"center",position:"relative",zIndex:2},
  centerLogo:{position:"absolute",left:"50%",transform:"translateX(-50%)",zIndex:1},
  logoCenter:{objectFit:"contain"},
  rightSide:{display:"flex",alignItems:"center",position:"relative",zIndex:3},
  usedCarsButton:{backgroundColor:"#1e90ff",color:"#fff",borderRadius:"8px",textDecoration:"none",fontWeight:"bold",whiteSpace:"nowrap"},
  hamburgerBtn:{background:"none",border:"none",color:"white",cursor:"pointer",padding:"6px 10px",display:"flex",alignItems:"center"},
  brandPanelToggle:{color:"white",cursor:"pointer",fontWeight:"bold",whiteSpace:"nowrap"},
  iconLink:{color:"white",textDecoration:"none",display:"flex",alignItems:"center"},
  loginButton:{backgroundColor:"#10b981",color:"#fff",borderRadius:"6px",fontWeight:"bold",position:"relative",whiteSpace:"nowrap"},
  authDialogWrapper:{position:"absolute",top:"110%",right:0,zIndex:2000},
  themeToggleBase:{display:"inline-flex",alignItems:"center",justifyContent:"center",borderRadius:"50%",cursor:"pointer",position:"relative",boxShadow:"0 0 8px rgba(0,0,0,0.4)"},
  profileButton:{background:"none",border:"none",color:"white",cursor:"pointer"},
  profileMenu:{position:"absolute",top:"110%",right:0,backgroundColor:"#fff",color:"#000",borderRadius:"8px",boxShadow:"0 4px 12px rgba(0,0,0,0.15)",padding:"12px",minWidth:"220px",zIndex:3000},
  profileHeader:{fontWeight:"bold",marginBottom:"8px"},
  profileItem:{padding:"6px 0",cursor:"pointer"},
  logoutButton:{width:"100%",padding:"8px",marginTop:"10px",backgroundColor:"#eee",border:"none",borderRadius:"4px",cursor:"pointer",fontWeight:"bold"},
  topDropMenu:{position:"fixed",top:"76px",left:0,width:"100%",zIndex:4000,padding:"40px 80px",boxSizing:"border-box",display:"flex",flexDirection:"column",minHeight:"auto",maxHeight:"70vh",overflow:"hidden"},
  closeTopMenu:{background:"none",border:"none",cursor:"pointer",fontSize:"1.5rem",position:"absolute",top:"20px",right:"30px"},
  topMenuItems:{display:"flex",flexDirection:"column",gap:"28px",fontSize:"1.3rem",fontWeight:"bold",paddingBottom:"40px"},
  topMenuItem:{cursor:"pointer",lineHeight:"1.6"},
  brandsPanel:{position:"fixed",top:"76px",left:0,width:"100%",zIndex:4000,minHeight:"calc(100vh - 76px)",padding:"40px 60px",boxSizing:"border-box"},
  brandsHeading:{fontSize:"1.8rem",fontWeight:"bold",marginBottom:"40px"},
  brandsGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:"40px",justifyItems:"center"},
  brandItem:{display:"flex",flexDirection:"column",alignItems:"center",textDecoration:"none"},
  brandLogo:{width:"120px",height:"auto",marginBottom:"12px"},
  brandName:{fontWeight:"bold",fontSize:"1.1rem"},
  subMenu:{position:"fixed",top:"76px",width:"100%",display:"flex",justifyContent:"center",backgroundColor:"#f4f4f4",padding:"10px 0",gap:"30px",zIndex:999},
  subMenuItem:{background:"none",border:"none",fontSize:"16px",fontWeight:"bold",color:"#000",cursor:"pointer"}
};

export default Navbar;
