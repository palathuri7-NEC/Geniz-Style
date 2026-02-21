import { useState, useEffect, useRef } from "react";

// ── THEME ────────────────────────────────────────────────────────────
const C = {
  cream:    "#FAF8F5",
  blush:    "#F4E4DC",
  rose:     "#E8C4B8",
  dusty:    "#D4A5A0",
  lavender: "#E8E0F0",
  mauve:    "#C9B8D8",
  sage:     "#D4E4D8",
  charcoal: "#2C2C2C",
  taupe:    "#8C7B70",
  soft:     "#B8A8A0",
  white:    "#FFFFFF",
  gold:     "#C9A96E",
};

const glass = {
  background: "rgba(255,255,255,0.72)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.8)",
};

const SCREENS = ["login", "profile", "home", "generate", "tryon", "wardrobe", "wishlist"];

// ── ICONS (inline SVG components) ───────────────────────────────────
const Icon = ({ d, size = 22, color = "currentColor", fill = "none", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const icons = {
  home:     "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  sparkle:  ["M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"],
  shirt:    "M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z",
  heart:    "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  user:     ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"],
  camera:   "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  download: ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M7 10l5 5 5-5", "M12 15V3"],
  share:    ["M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8", "M16 6l-4-4-4 4", "M12 2v13"],
  refresh:  "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  eye:      ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  plus:     ["M12 5v14", "M5 12h14"],
  grid:     ["M3 3h7v7H3z", "M14 3h7v7h-7z", "M14 14h7v7h-7z", "M3 14h7v7H3z"],
  leaf:     "M2 22 17 7M17 3s2 6-2 10-10 2-10 2",
  star:     "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  mail:     ["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z", "M22 6l-10 7L2 6"],
  lock:     ["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z", "M7 11V7a5 5 0 0 1 10 0v4"],
  back:     "M19 12H5M12 19l-7-7 7-7",
  check:    "M20 6L9 17l-5-5",
  location: ["M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z", "M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
};

// ── SHARED COMPONENTS ────────────────────────────────────────────────
const Btn = ({ children, onClick, variant = "primary", style = {}, small = false }) => {
  const base = {
    border: "none", cursor: "pointer", borderRadius: 50, fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 600, letterSpacing: "0.08em", transition: "all 0.25s cubic-bezier(.34,1.56,.64,1)",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: small ? "10px 22px" : "15px 32px",
    fontSize: small ? 13 : 15,
  };
  const variants = {
    primary: { background: `linear-gradient(135deg, ${C.dusty} 0%, ${C.mauve} 100%)`, color: C.white, boxShadow: `0 8px 24px ${C.dusty}55` },
    ghost:   { background: "rgba(255,255,255,0.6)", color: C.charcoal, border: `1px solid ${C.rose}`, backdropFilter: "blur(10px)" },
    dark:    { background: C.charcoal, color: C.white, boxShadow: `0 8px 24px rgba(44,44,44,0.25)` },
    gold:    { background: `linear-gradient(135deg, ${C.gold} 0%, #E8C580 100%)`, color: C.white, boxShadow: `0 8px 24px ${C.gold}44` },
  };
  return <button onClick={onClick} style={{ ...base, ...variants[variant], ...style }}>{children}</button>;
};

const Tag = ({ children, active, onClick }) => (
  <button onClick={onClick} style={{
    border: `1.5px solid ${active ? C.dusty : C.rose}`,
    background: active ? `linear-gradient(135deg, ${C.blush}, ${C.lavender})` : "rgba(255,255,255,0.6)",
    color: active ? C.charcoal : C.taupe,
    borderRadius: 50, padding: "8px 18px", fontSize: 13,
    fontFamily: "'Jost', sans-serif", fontWeight: active ? 600 : 400,
    cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap",
    boxShadow: active ? `0 4px 12px ${C.rose}44` : "none",
  }}>{children}</button>
);

const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{
    ...glass, borderRadius: 24, padding: 20,
    boxShadow: "0 8px 32px rgba(180,140,130,0.12)",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: onClick ? "pointer" : "default",
    ...style,
  }}>{children}</div>
);

// ── OUTFIT PLACEHOLDER (SVG fashion illustration) ─────────────────
const OutfitCard = ({ title, style: label, price, color = C.blush, size = "normal", onClick }) => {
  const h = size === "small" ? 160 : 220;
  return (
    <Card onClick={onClick} style={{ padding: 0, overflow: "hidden", cursor: "pointer" }}>
      <div style={{ height: h, background: `linear-gradient(160deg, ${color}, ${C.lavender})`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="80" height="120" viewBox="0 0 80 120" fill="none">
          {/* Dress silhouette */}
          <path d="M40 8 C35 8 28 12 25 20 L15 35 L22 38 L20 80 C20 82 22 84 24 84 L56 84 C58 84 60 82 60 80 L58 38 L65 35 L55 20 C52 12 45 8 40 8Z" fill="rgba(255,255,255,0.5)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5"/>
          {/* Collar */}
          <path d="M33 8 Q40 15 47 8" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" fill="none"/>
          {/* Waist detail */}
          <path d="M24 52 Q40 56 56 52" stroke="rgba(255,255,255,0.6)" strokeWidth="1" fill="none"/>
          {/* Sparkles */}
          <circle cx="32" cy="30" r="2" fill="rgba(255,255,255,0.8)"/>
          <circle cx="50" cy="45" r="1.5" fill="rgba(255,255,255,0.6)"/>
          <circle cx="38" cy="65" r="2" fill="rgba(255,255,255,0.7)"/>
        </svg>
        <div style={{ position: "absolute", top: 12, right: 12, ...glass, borderRadius: 50, padding: "4px 10px", fontSize: 11, color: C.charcoal, fontFamily: "'Jost', sans-serif" }}>
          AI ✦
        </div>
      </div>
      <div style={{ padding: "14px 16px" }}>
        <p style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, color: C.charcoal }}>{title}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
          <span style={{ fontSize: 12, color: C.taupe, fontFamily: "'Jost', sans-serif" }}>{label}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.dusty, fontFamily: "'Jost', sans-serif" }}>{price}</span>
        </div>
      </div>
    </Card>
  );
};

// ══════════════════════════════════════════════════════════════════════
// SCREEN 1 — LOGIN
// ══════════════════════════════════════════════════════════════════════
function LoginScreen({ onNav }) {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  return (
    <div style={{ minHeight: "100%", position: "relative", overflow: "hidden", background: `linear-gradient(170deg, ${C.blush} 0%, ${C.lavender} 40%, ${C.cream} 100%)` }}>
      {/* Decorative circles */}
      {[[-80,-80,280,C.rose],[200,-60,200,C.mauve],[120,580,240,C.blush]].map(([x,y,s,c],i)=>(
        <div key={i} style={{ position:"absolute", left:x, top:y, width:s, height:s, borderRadius:"50%", background:`radial-gradient(circle, ${c}66, transparent)`, pointerEvents:"none" }}/>
      ))}

      {/* Logo area */}
      <div style={{ paddingTop: 80, textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <svg width="32" height="32" viewBox="0 0 32 32"><path d="M16 3 C12 3 8 7 8 11 L8 13 L4 16 L8 19 L8 29 L24 29 L24 19 L28 16 L24 13 L24 11 C24 7 20 3 16 3Z" fill={C.dusty} opacity="0.7"/><path d="M13 3 Q16 8 19 3" stroke={C.dusty} strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: C.charcoal, letterSpacing: "0.1em" }}>AURA</span>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: C.taupe, fontFamily: "'Jost', sans-serif", letterSpacing: "0.2em" }}>YOUR AI STYLE COMPANION</p>
      </div>

      {/* Fashion illustration */}
      <div style={{ display: "flex", justifyContent: "center", margin: "24px 0", position: "relative", zIndex: 1 }}>
        <svg width="180" height="180" viewBox="0 0 180 180">
          <defs>
            <radialGradient id="lg1" cx="50%" cy="50%"><stop offset="0%" stopColor={C.rose} stopOpacity="0.3"/><stop offset="100%" stopColor={C.lavender} stopOpacity="0.1"/></radialGradient>
          </defs>
          <circle cx="90" cy="90" r="85" fill="url(#lg1)"/>
          {/* Figure */}
          <circle cx="90" cy="42" r="16" fill={C.blush} stroke={C.rose} strokeWidth="2"/>
          <path d="M75 60 Q70 65 68 75 L72 120 L90 125 L108 120 L112 75 Q110 65 105 60 Q97 55 90 55 Q83 55 75 60Z" fill={C.dusty} opacity="0.8"/>
          <path d="M72 120 L65 148 L75 148 L90 128 L105 148 L115 148 L108 120Z" fill={C.mauve} opacity="0.7"/>
          {/* Arms */}
          <path d="M75 65 Q60 75 58 90" stroke={C.blush} strokeWidth="8" strokeLinecap="round" fill="none"/>
          <path d="M105 65 Q120 75 122 90" stroke={C.blush} strokeWidth="8" strokeLinecap="round" fill="none"/>
          {/* Decorative stars */}
          {[[130,35,6],[40,80,5],[150,110,4],[30,130,7]].map(([x,y,s],i)=>(
            <text key={i} x={x} y={y} fontSize={s*3} fill={C.gold} opacity="0.7" textAnchor="middle">✦</text>
          ))}
        </svg>
      </div>

      {/* Glass card */}
      <div style={{ margin: "0 20px", ...glass, borderRadius: "32px 32px 0 0", padding: "28px 24px 40px", position: "relative", zIndex: 1 }}>
        {/* Tabs */}
        <div style={{ display: "flex", ...glass, borderRadius: 50, padding: 4, marginBottom: 28 }}>
          {["login","signup"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{
              flex:1, padding:"10px 0", border:"none", borderRadius:50, cursor:"pointer",
              background: tab===t ? C.charcoal : "transparent",
              color: tab===t ? C.white : C.taupe,
              fontFamily:"'Jost', sans-serif", fontSize:14, fontWeight:600, letterSpacing:"0.1em",
              transition:"all 0.25s", textTransform:"capitalize",
            }}>{t === "login" ? "Sign In" : "Sign Up"}</button>
          ))}
        </div>

        {/* Fields */}
        {[
          { icon: icons.mail, placeholder: "Email address", val: email, set: setEmail, type: "email" },
          { icon: icons.lock, placeholder: "Password", val: pass, set: setPass, type: "password" },
        ].map(({ icon, placeholder, val, set, type }) => (
          <div key={placeholder} style={{ position: "relative", marginBottom: 14 }}>
            <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: C.soft }}>
              <Icon d={icon} size={18} color={C.soft} />
            </div>
            <input
              type={type} value={val} onChange={e=>set(e.target.value)}
              placeholder={placeholder}
              style={{
                width: "100%", boxSizing: "border-box", padding: "15px 16px 15px 46px",
                border: `1.5px solid ${C.rose}`, borderRadius: 16, background: "rgba(255,255,255,0.7)",
                color: C.charcoal, fontFamily: "'Jost', sans-serif", fontSize: 14,
                outline: "none", backdropFilter: "blur(8px)",
              }}
            />
          </div>
        ))}

        {tab === "login" && <p style={{ textAlign: "right", margin: "0 0 20px", fontSize: 13, color: C.dusty, fontFamily: "'Jost', sans-serif", cursor: "pointer" }}>Forgot password?</p>}

        <Btn onClick={() => onNav("profile")} style={{ width: "100%", justifyContent: "center", marginBottom: 20 }}>
          {tab === "login" ? "Sign In" : "Create Account"} ✦
        </Btn>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: C.rose }}/>
          <span style={{ color: C.soft, fontSize: 12, fontFamily: "'Jost', sans-serif" }}>or continue with</span>
          <div style={{ flex: 1, height: 1, background: C.rose }}/>
        </div>

        {/* Social buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          {[
            { label: "Google", bg: "#fff", border: C.rose, icon: "G" },
            { label: "Instagram", bg: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", icon: "✿" },
          ].map(({ label, bg, border, icon }) => (
            <button key={label} style={{
              flex: 1, padding: "12px 16px", border: `1.5px solid ${border || "transparent"}`,
              borderRadius: 14, background: bg, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 600,
              color: label === "Instagram" ? "#fff" : C.charcoal,
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)", transition: "transform 0.2s",
            }}>
              <span style={{ fontSize: 16 }}>{icon}</span> {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// SCREEN 2 — PROFILE SETUP
// ══════════════════════════════════════════════════════════════════════
function ProfileScreen({ onNav }) {
  const [step, setStep] = useState(0);
  const [gender, setGender] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [skin, setSkin] = useState(0);
  const [styles, setStyles] = useState([]);
  const [budget, setBudget] = useState(5000);
  const [occasion, setOccasion] = useState("");

  const skintones = ["#FDDBB4","#F5C08A","#E8A87C","#D4845A","#B86B3C","#8B4513","#5C2E0A"];
  const styleOpts = ["Casual", "Traditional", "Formal", "Party", "Streetwear", "Minimalist"];
  const occasionOpts = ["Daily Wear","Work","Wedding","Date Night","Festival","Travel"];

  const steps = [
    {
      title: "Who are you?", sub: "Help us personalize your experience",
      content: (
        <div>
          <p style={labelStyle}>Gender</p>
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            {["Women","Men","Non-binary"].map(g=>(
              <button key={g} onClick={()=>setGender(g)} style={{
                flex:1, padding:"18px 8px", border:`2px solid ${gender===g?C.dusty:C.rose}`,
                borderRadius:20, background: gender===g ? `linear-gradient(135deg,${C.blush},${C.lavender})` : "rgba(255,255,255,0.6)",
                cursor:"pointer", fontFamily:"'Jost', sans-serif", fontSize:13, fontWeight:gender===g?600:400,
                color: gender===g?C.charcoal:C.taupe, transition:"all 0.2s",
              }}>
                <div style={{fontSize:28, marginBottom:4}}>{g==="Women"?"👗":g==="Men"?"👔":"✨"}</div>
                {g}
              </button>
            ))}
          </div>
          <p style={labelStyle}>Body Type</p>
          <select value={bodyType} onChange={e=>setBodyType(e.target.value)} style={{
            width:"100%", padding:"14px 16px", border:`1.5px solid ${C.rose}`, borderRadius:16,
            background:"rgba(255,255,255,0.7)", fontFamily:"'Jost', sans-serif", fontSize:14,
            color: bodyType ? C.charcoal : C.soft, outline:"none", appearance:"none",
            backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238C7B70' fill='none' strokeWidth='2'/%3E%3C/svg%3E")`,
            backgroundRepeat:"no-repeat", backgroundPosition:"right 16px center",
          }}>
            <option value="" disabled>Select body type</option>
            {["Hourglass","Pear","Apple","Rectangle","Inverted Triangle"].map(b=><option key={b}>{b}</option>)}
          </select>
        </div>
      )
    },
    {
      title: "Your aesthetic", sub: "Personalize your style DNA",
      content: (
        <div>
          <p style={labelStyle}>Skin Tone</p>
          <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
            {skintones.map((s,i)=>(
              <button key={i} onClick={()=>setSkin(i)} style={{
                width:40, height:40, borderRadius:"50%", background:s, border: skin===i?`3px solid ${C.charcoal}`:"3px solid transparent",
                cursor:"pointer", transition:"transform 0.2s, box-shadow 0.2s",
                boxShadow: skin===i?`0 0 0 2px white, 0 4px 12px ${s}88`:`0 2px 8px ${s}66`,
                transform: skin===i?"scale(1.15)":"scale(1)",
              }}/>
            ))}
          </div>
          <p style={labelStyle}>Preferred Styles</p>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:24 }}>
            {styleOpts.map(s=>(
              <Tag key={s} active={styles.includes(s)} onClick={()=>setStyles(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s])}>{s}</Tag>
            ))}
          </div>
          <p style={labelStyle}>Occasion</p>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {occasionOpts.map(o=>(
              <Tag key={o} active={occasion===o} onClick={()=>setOccasion(o)}>{o}</Tag>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Budget & Location", sub: "We'll find the perfect price range",
      content: (
        <div>
          <p style={labelStyle}>Budget Range</p>
          <div style={{ ...glass, borderRadius:20, padding:"20px 20px 14px", marginBottom:24 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
              <span style={{ fontFamily:"'Jost', sans-serif", fontSize:13, color:C.taupe }}>₹500</span>
              <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:20, fontWeight:700, color:C.charcoal }}>₹{budget.toLocaleString()}</span>
              <span style={{ fontFamily:"'Jost', sans-serif", fontSize:13, color:C.taupe }}>₹50,000</span>
            </div>
            <input type="range" min={500} max={50000} step={500} value={budget} onChange={e=>setBudget(+e.target.value)} style={{
              width:"100%", appearance:"none", height:4, background:`linear-gradient(to right, ${C.dusty} ${((budget-500)/49500)*100}%, ${C.rose} 0%)`,
              borderRadius:2, outline:"none",
            }}/>
            <div style={{ display:"flex", gap:8, marginTop:16, flexWrap:"wrap" }}>
              {[2000,5000,10000,25000].map(v=>(
                <button key={v} onClick={()=>setBudget(v)} style={{
                  padding:"6px 14px", borderRadius:50, border:`1px solid ${budget===v?C.dusty:C.rose}`,
                  background: budget===v?`linear-gradient(135deg,${C.blush},${C.lavender})`:"transparent",
                  cursor:"pointer", fontFamily:"'Jost', sans-serif", fontSize:12, color: budget===v?C.charcoal:C.taupe,
                }}>₹{(v/1000).toFixed(0)}K</button>
              ))}
            </div>
          </div>
          <p style={labelStyle}>Location / Weather</p>
          <div style={{ position:"relative" }}>
            <Icon d={icons.location} size={18} color={C.soft} style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)" }}/>
            <input placeholder="Enter your city..." style={{
              width:"100%", boxSizing:"border-box", padding:"15px 16px 15px 46px",
              border:`1.5px solid ${C.rose}`, borderRadius:16, background:"rgba(255,255,255,0.7)",
              fontFamily:"'Jost', sans-serif", fontSize:14, outline:"none",
            }}/>
          </div>
          <div style={{ display:"flex", gap:8, marginTop:12 }}>
            {["☀️ Summer","🌧 Monsoon","❄️ Winter","🌤 Autumn"].map(w=>(
              <Tag key={w}>{w}</Tag>
            ))}
          </div>
        </div>
      )
    }
  ];

  const labelStyle = { margin:"0 0 10px", fontFamily:"'Cormorant Garamond', serif", fontSize:16, fontWeight:600, color:C.charcoal };

  return (
    <div style={{ minHeight:"100%", background:C.cream, display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg, ${C.blush}, ${C.lavender})`, padding:"50px 24px 28px", position:"relative" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
          <div>
            <h1 style={{ margin:0, fontFamily:"'Cormorant Garamond', serif", fontSize:26, fontWeight:700, color:C.charcoal }}>Style Profile</h1>
            <p style={{ margin:"4px 0 0", fontFamily:"'Jost', sans-serif", fontSize:13, color:C.taupe }}>Step {step+1} of {steps.length}</p>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {steps.map((_,i)=>(
              <div key={i} style={{ height:4, width: i===step?28:12, borderRadius:2, background: i<=step?C.dusty:C.rose, transition:"all 0.3s" }}/>
            ))}
          </div>
        </div>
        <h2 style={{ margin:"0 0 4px", fontFamily:"'Cormorant Garamond', serif", fontSize:22, color:C.charcoal }}>{steps[step].title}</h2>
        <p style={{ margin:0, fontFamily:"'Jost', sans-serif", fontSize:13, color:C.taupe }}>{steps[step].sub}</p>
      </div>

      {/* Content */}
      <div style={{ flex:1, padding:24, overflowY:"auto" }}>
        {steps[step].content}
      </div>

      {/* Footer */}
      <div style={{ padding:"16px 24px 32px", display:"flex", gap:12 }}>
        {step > 0 && <Btn variant="ghost" onClick={()=>setStep(s=>s-1)} style={{ flex:0.4 }}>Back</Btn>}
        <Btn onClick={()=> step < steps.length-1 ? setStep(s=>s+1) : onNav("home")} style={{ flex:1 }}>
          {step < steps.length-1 ? "Continue →" : "Start My Journey ✦"}
        </Btn>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// SCREEN 3 — HOME DASHBOARD
// ══════════════════════════════════════════════════════════════════════
function HomeScreen({ onNav }) {
  const [activeStyle, setActiveStyle] = useState("All");
  const styles = ["All","Casual","Formal","Party","Traditional"];

  const outfits = [
    { title:"Breezy Linen Set", style:"Casual", price:"₹2,400", color:C.sage },
    { title:"Evening Enchantment", style:"Party", price:"₹5,800", color:C.mauve },
    { title:"Office Chic", style:"Formal", price:"₹4,200", color:C.blush },
    { title:"Heritage Silk", style:"Traditional", price:"₹8,500", color:C.rose },
  ];

  const trending = [
    { label:"Cottagecore", emoji:"🌸" },
    { label:"Y2K Revival", emoji:"⭐" },
    { label:"Quiet Luxury", emoji:"💎" },
    { label:"Boho Chic", emoji:"🪶" },
    { label:"Clean Girl", emoji:"✨" },
  ];

  const tips = [
    { icon:"🌿", text:"Choose organic cotton for everyday wear" },
    { icon:"♻️", text:"Thrift & upcycle to reduce fashion waste" },
    { icon:"💧", text:"Opt for water-efficient fabric production" },
  ];

  return (
    <div style={{ background:C.cream, minHeight:"100%", paddingBottom:90 }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(160deg, ${C.blush} 0%, ${C.lavender} 100%)`, padding:"52px 24px 28px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:-30, top:-30, width:160, height:160, borderRadius:"50%", background:`radial-gradient(circle, ${C.rose}44, transparent)` }}/>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <p style={{ margin:"0 0 4px", fontFamily:"'Jost', sans-serif", fontSize:13, color:C.taupe, letterSpacing:"0.15em" }}>GOOD MORNING</p>
            <h1 style={{ margin:0, fontFamily:"'Cormorant Garamond', serif", fontSize:28, fontWeight:700, color:C.charcoal }}>Sofia ✦</h1>
            <p style={{ margin:"6px 0 0", fontFamily:"'Jost', sans-serif", fontSize:13, color:C.taupe }}>26°C · Mumbai · Humid</p>
          </div>
          <div style={{ width:48, height:48, borderRadius:"50%", background:`linear-gradient(135deg,${C.dusty},${C.mauve})`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 4px 16px ${C.dusty}44` }}>
            <Icon d={icons.user} size={22} color={C.white} />
          </div>
        </div>

        {/* Generate button */}
        <button onClick={()=>onNav("generate")} style={{
          marginTop:20, width:"100%", padding:"18px 24px",
          background:`linear-gradient(135deg, ${C.charcoal} 0%, #4a3f3a 100%)`,
          border:"none", borderRadius:20, cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          boxShadow:`0 12px 32px rgba(44,44,44,0.25)`,
          transition:"transform 0.2s",
        }}>
          <div style={{ textAlign:"left" }}>
            <p style={{ margin:0, fontFamily:"'Cormorant Garamond', serif", fontSize:19, color:C.white, fontWeight:700 }}>Generate Outfit</p>
            <p style={{ margin:"3px 0 0", fontFamily:"'Jost', sans-serif", fontSize:12, color:"rgba(255,255,255,0.6)" }}>AI-powered style for today</p>
          </div>
          <div style={{ width:44, height:44, borderRadius:"50%", background:`linear-gradient(135deg,${C.dusty},${C.gold})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon d={icons.sparkle} size={20} color={C.white} fill={C.white} />
          </div>
        </button>
      </div>

      <div style={{ padding:"0 20px" }}>
        {/* Trending carousel */}
        <div style={{ marginTop:24 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <h2 style={{ margin:0, fontFamily:"'Cormorant Garamond', serif", fontSize:20, color:C.charcoal }}>Trending Now</h2>
            <span style={{ fontFamily:"'Jost', sans-serif", fontSize:12, color:C.dusty, cursor:"pointer" }}>See all →</span>
          </div>
          <div style={{ display:"flex", gap:12, overflowX:"auto", paddingBottom:8, scrollbarWidth:"none" }}>
            {trending.map(({ label, emoji }) => (
              <div key={label} style={{
                minWidth:110, ...glass, borderRadius:20, padding:"16px 14px", textAlign:"center",
                cursor:"pointer", flexShrink:0, boxShadow:`0 4px 16px rgba(180,140,130,0.12)`,
              }}>
                <div style={{ fontSize:28, marginBottom:8 }}>{emoji}</div>
                <p style={{ margin:0, fontFamily:"'Jost', sans-serif", fontSize:12, fontWeight:600, color:C.charcoal }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Style filter */}
        <div style={{ marginTop:24, marginBottom:16 }}>
          <h2 style={{ margin:"0 0 14px", fontFamily:"'Cormorant Garamond', serif", fontSize:20, color:C.charcoal }}>For You</h2>
          <div style={{ display:"flex", gap:8, overflowX:"auto", scrollbarWidth:"none" }}>
            {styles.map(s=><Tag key={s} active={activeStyle===s} onClick={()=>setActiveStyle(s)}>{s}</Tag>)}
          </div>
        </div>

        {/* Outfit grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          {outfits.filter(o=>activeStyle==="All"||o.style===activeStyle).map(o=>(
            <OutfitCard key={o.title} {...o} size="small" onClick={()=>onNav("generate")} />
          ))}
        </div>

        {/* Sustainable tips */}
        <div style={{ marginTop:28 }}>
          <h2 style={{ margin:"0 0 14px", fontFamily:"'Cormorant Garamond', serif", fontSize:20, color:C.charcoal }}>
            Sustainable ✦ Fashion
          </h2>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {tips.map(({ icon, text }) => (
              <Card key={text} style={{ padding:"14px 18px", display:"flex", alignItems:"center", gap:14 }}>
                <span style={{ fontSize:24, flexShrink:0 }}>{icon}</span>
                <p style={{ margin:0, fontFamily:"'Jost', sans-serif", fontSize:13, color:C.taupe, lineHeight:1.5 }}>{text}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// SCREEN 4 — OUTFIT GENERATION
// ══════════════════════════════════════════════════════════════════════
function GenerateScreen({ onNav }) {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(()=>{ const t=setTimeout(()=>setLoading(false),1800); return()=>clearTimeout(t); },[]);

  return (
    <div style={{ background:C.cream, minHeight:"100%", paddingBottom:90 }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${C.blush},${C.lavender})`, padding:"52px 24px 24px", display:"flex", alignItems:"center", gap:16 }}>
        <button onClick={()=>onNav("home")} style={{ background:"rgba(255,255,255,0.6)", border:"none", borderRadius:50, width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", backdropFilter:"blur(10px)" }}>
          <Icon d={icons.back} size={18} color={C.charcoal} />
        </button>
        <div>
          <h1 style={{ margin:0, fontFamily:"'Cormorant Garamond', serif", fontSize:22, color:C.charcoal }}>AI Outfit Studio</h1>
          <p style={{ margin:0, fontFamily:"'Jost', sans-serif", fontSize:12, color:C.taupe }}>Generated for today's weather</p>
        </div>
      </div>

      <div style={{ padding:"24px 20px" }}>
        {loading ? (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"60px 0" }}>
            <div style={{ width:80, height:80, borderRadius:"50%", background:`linear-gradient(135deg,${C.blush},${C.lavender})`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20, animation:"spin 2s linear infinite" }}>
              <Icon d={icons.sparkle} size={36} color={C.dusty} fill={C.dusty} />
            </div>
            <p style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:18, color:C.charcoal }}>Styling your look…</p>
            <p style={{ fontFamily:"'Jost', sans-serif", fontSize:13, color:C.taupe }}>AI is curating the perfect ensemble</p>
          </div>
        ) : (
          <>
            {/* Main outfit card */}
            <Card style={{ padding:0, overflow:"hidden", marginBottom:20 }}>
              <div style={{ height:300, background:`linear-gradient(160deg, ${C.blush} 0%, ${C.lavender} 60%, ${C.mauve} 100%)`, position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="140" height="200" viewBox="0 0 140 200">
                  {/* AI Generated outfit illustration */}
                  <defs>
                    <linearGradient id="dress" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={C.rose}/>
                      <stop offset="100%" stopColor={C.mauve}/>
                    </linearGradient>
                  </defs>
                  {/* Head */}
                  <circle cx="70" cy="30" r="22" fill="#F5C08A"/>
                  {/* Hair */}
                  <path d="M48 25 Q50 8 70 10 Q90 8 92 25 Q88 15 70 16 Q52 15 48 25Z" fill={C.charcoal}/>
                  {/* Neck */}
                  <rect x="65" y="50" width="10" height="12" fill="#F5C08A"/>
                  {/* Top */}
                  <path d="M50 62 Q45 68 42 80 L42 110 Q42 114 46 114 L94 114 Q98 114 98 110 L98 80 Q95 68 90 62 Q80 56 70 56 Q60 56 50 62Z" fill="url(#dress)"/>
                  {/* Collar detail */}
                  <path d="M62 62 Q70 70 78 62" stroke="rgba(255,255,255,0.7)" strokeWidth="2" fill="none"/>
                  {/* Skirt */}
                  <path d="M42 112 L35 175 Q35 178 38 178 L102 178 Q105 178 105 175 L98 112Z" fill={C.dusty} opacity="0.85"/>
                  {/* Pleats */}
                  {[52,62,72,82].map(x=><line key={x} x1={x} y1={112} x2={x-6} y2={178} stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>)}
                  {/* Arms */}
                  <path d="M50 65 Q35 80 33 100" stroke="#F5C08A" strokeWidth="12" strokeLinecap="round" fill="none"/>
                  <path d="M90 65 Q105 80 107 100" stroke="#F5C08A" strokeWidth="12" strokeLinecap="round" fill="none"/>
                  {/* Shoes */}
                  <ellipse cx="52" cy="188" rx="16" ry="7" fill={C.charcoal}/>
                  <ellipse cx="88" cy="188" rx="16" ry="7" fill={C.charcoal}/>
                  <rect x="50" y="178" width="4" height="12" fill={C.charcoal}/>
                  <rect x="86" y="178" width="4" height="12" fill={C.charcoal}/>
                  {/* Sparkles */}
                  <text x="20" y="75" fontSize="18" fill={C.gold} opacity="0.8">✦</text>
                  <text x="108" y="95" fontSize="14" fill={C.white} opacity="0.7">✦</text>
                  <text x="30" y="145" fontSize="12" fill={C.gold} opacity="0.6">✦</text>
                </svg>
                <div style={{ position:"absolute", top:16, right:16, ...glass, borderRadius:12, padding:"8px 12px" }}>
                  <p style={{ margin:0, fontFamily:"'Jost', sans-serif", fontSize:11, color:C.charcoal, fontWeight:600 }}>✦ AI STYLED</p>
                </div>
                <div style={{ position:"absolute", bottom:16, left:16, display:"flex", gap:8 }}>
                  {["Romantic","Elegant","Festive"].map(t=>(
                    <span key={t} style={{ ...glass, borderRadius:50, padding:"4px 10px", fontFamily:"'Jost', sans-serif", fontSize:11, color:C.charcoal }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{ padding:"20px 20px 16px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <h2 style={{ margin:0, fontFamily:"'Cormorant Garamond', serif", fontSize:22, color:C.charcoal }}>Rose Garden Soirée</h2>
                    <p style={{ margin:"6px 0 0", fontFamily:"'Jost', sans-serif", fontSize:13, color:C.taupe }}>Mauve floral midi · Strappy heels · Pearl clutch</p>
                  </div>
                  <button onClick={()=>setSaved(s=>!s)} style={{ background:"none", border:"none", cursor:"pointer", padding:4, transition:"transform 0.2s", transform: saved?"scale(1.2)":"scale(1)" }}>
                    <Icon d={icons.heart} size={24} color={saved?C.dusty:"#ccc"} fill={saved?C.dusty:"none"} />
                  </button>
                </div>
                <div style={{ display:"flex", gap:8, marginTop:14 }}>
                  {[{label:"Top",price:"₹2,800"},{label:"Skirt",price:"₹1,900"},{label:"Shoes",price:"₹3,200"},{label:"Bag",price:"₹1,400"}].map(item=>(
                    <div key={item.label} style={{ flex:1, ...glass, borderRadius:12, padding:"10px 8px", textAlign:"center", border:`1px solid ${C.rose}` }}>
                      <p style={{ margin:"0 0 2px", fontSize:11, color:C.taupe, fontFamily:"'Jost', sans-serif" }}>{item.label}</p>
                      <p style={{ margin:0, fontSize:12, fontWeight:600, color:C.charcoal, fontFamily:"'Jost', sans-serif" }}>{item.price}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:16, padding:"14px 16px", background:`linear-gradient(135deg,${C.blush},${C.lavender})`, borderRadius:14 }}>
                  <span style={{ fontFamily:"'Jost', sans-serif", fontSize:13, color:C.taupe }}>Total Estimate</span>
                  <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:22, fontWeight:700, color:C.charcoal }}>₹9,300</span>
                </div>
              </div>
            </Card>

            {/* Action buttons */}
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <Btn onClick={()=>onNav("tryon")} style={{ width:"100%", justifyContent:"center" }}>
                <Icon d={icons.eye} size={18} color={C.white} /> Try Virtual Fit
              </Btn>
              <div style={{ display:"flex", gap:12 }}>
                <Btn variant="ghost" onClick={()=>setSaved(true)} style={{ flex:1, justifyContent:"center" }}>
                  <Icon d={icons.heart} size={16} color={C.dusty} /> Save
                </Btn>
                <Btn variant="ghost" onClick={()=>setLoading(true)} style={{ flex:1, justifyContent:"center" }}>
                  <Icon d={icons.refresh} size={16} color={C.taupe} /> Regenerate
                </Btn>
              </div>
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// SCREEN 5 — VIRTUAL TRY-ON
// ══════════════════════════════════════════════════════════════════════
function TryOnScreen({ onNav }) {
  const [uploaded, setUploaded] = useState(false);

  return (
    <div style={{ background:C.cream, minHeight:"100%", paddingBottom:90 }}>
      <div style={{ background:`linear-gradient(135deg,${C.lavender},${C.blush})`, padding:"52px 24px 24px", display:"flex", alignItems:"center", gap:16 }}>
        <button onClick={()=>onNav("generate")} style={{ background:"rgba(255,255,255,0.6)", border:"none", borderRadius:50, width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
          <Icon d={icons.back} size={18} color={C.charcoal} />
        </button>
        <div>
          <h1 style={{ margin:0, fontFamily:"'Cormorant Garamond', serif", fontSize:22, color:C.charcoal }}>Virtual Try-On</h1>
          <p style={{ margin:0, fontFamily:"'Jost', sans-serif", fontSize:12, color:C.taupe }}>See how it looks on you</p>
        </div>
      </div>

      <div style={{ padding:"24px 20px" }}>
        {/* Upload area */}
        {!uploaded ? (
          <Card style={{ textAlign:"center", padding:"48px 24px", border:`2px dashed ${C.rose}`, cursor:"pointer", background:"rgba(255,255,255,0.5)" }} onClick={()=>setUploaded(true)}>
            <div style={{ width:64, height:64, borderRadius:"50%", background:`linear-gradient(135deg,${C.blush},${C.lavender})`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
              <Icon d={icons.camera} size={28} color={C.dusty} />
            </div>
            <h3 style={{ margin:"0 0 8px", fontFamily:"'Cormorant Garamond', serif", fontSize:20, color:C.charcoal }}>Upload Your Photo</h3>
            <p style={{ margin:"0 0 20px", fontFamily:"'Jost', sans-serif", fontSize:13, color:C.taupe }}>Take a full-body photo or upload from gallery</p>
            <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
              <Btn small>📷 Take Photo</Btn>
              <Btn small variant="ghost">🖼 Gallery</Btn>
            </div>
          </Card>
        ) : (
          <Card style={{ padding:0, overflow:"hidden" }}>
            <div style={{ height:380, background:`linear-gradient(160deg,${C.blush},${C.lavender},${C.mauve})`, position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
              {/* Preview illustration */}
              <svg width="160" height="280" viewBox="0 0 160 280">
                <circle cx="80" cy="35" r="28" fill="#E8A87C"/>
                <path d="M52 28 Q55 8 80 10 Q105 8 108 28 Q102 18 80 20 Q58 18 52 28Z" fill="#3C2415"/>
                <rect x="73" y="61" width="14" height="16" fill="#E8A87C"/>
                {/* Outfit on person */}
                <path d="M55 78 Q48 88 46 105 L46 155 Q46 160 51 160 L109 160 Q114 160 114 155 L114 105 Q112 88 105 78 Q92 68 80 68 Q68 68 55 78Z" fill={C.dusty} opacity="0.9"/>
                <path d="M46 158 L38 230 Q38 234 42 234 L118 234 Q122 234 122 230 L114 158Z" fill={C.mauve} opacity="0.85"/>
                <path d="M65 78 Q80 88 95 78" stroke="rgba(255,255,255,0.7)" strokeWidth="2" fill="none"/>
                <path d="M55 82 Q38 100 35 125" stroke="#E8A87C" strokeWidth="14" strokeLinecap="round" fill="none"/>
                <path d="M105 82 Q122 100 125 125" stroke="#E8A87C" strokeWidth="14" strokeLinecap="round" fill="none"/>
                <ellipse cx="60" cy="242" rx="18" ry="9" fill="#3C2415"/>
                <ellipse cx="100" cy="242" rx="18" ry="9" fill="#3C2415"/>
                <text x="12" y="80" fontSize="20" fill={C.gold} opacity="0.9">✦</text>
                <text x="128" y="110" fontSize="14" fill={C.white} opacity="0.8">✦</text>
              </svg>
              {/* AI badge */}
              <div style={{ position:"absolute", top:16, right:16, ...glass, borderRadius:12, padding:"8px 14px" }}>
                <p style={{ margin:0, fontFamily:"'Jost', sans-serif", fontSize:11, fontWeight:700, color:C.charcoal }}>✦ AI PREVIEW</p>
              </div>
              {/* Confidence badge */}
              <div style={{ position:"absolute", bottom:16, left:"50%", transform:"translateX(-50%)", ...glass, borderRadius:50, padding:"8px 20px", whiteSpace:"nowrap" }}>
                <p style={{ margin:0, fontFamily:"'Jost', sans-serif", fontSize:12, color:C.charcoal }}>96% Fit Confidence ✓</p>
              </div>
            </div>
            <div style={{ padding:"20px 20px" }}>
              <div style={{ display:"flex", gap:12, marginBottom:14 }}>
                {["Front","Side","Back"].map((v,i)=>(
                  <button key={v} style={{
                    flex:1, padding:"10px 0", border:`1.5px solid ${i===0?C.dusty:C.rose}`,
                    borderRadius:12, background: i===0?`linear-gradient(135deg,${C.blush},${C.lavender})`:"transparent",
                    cursor:"pointer", fontFamily:"'Jost', sans-serif", fontSize:13,
                    color: i===0?C.charcoal:C.taupe, fontWeight: i===0?600:400,
                  }}>{v}</button>
                ))}
              </div>
              <div style={{ display:"flex", gap:12 }}>
                <Btn style={{ flex:1, justifyContent:"center" }} small>
                  <Icon d={icons.download} size={16} color={C.white} /> Download
                </Btn>
                <Btn variant="ghost" style={{ flex:1, justifyContent:"center" }} small>
                  <Icon d={icons.share} size={16} color={C.taupe} /> Share
                </Btn>
              </div>
            </div>
          </Card>
        )}

        {/* Outfit details */}
        <Card style={{ marginTop:20 }}>
          <h3 style={{ margin:"0 0 14px", fontFamily:"'Cormorant Garamond', serif", fontSize:18, color:C.charcoal }}>Outfit Details</h3>
          {[{icon:"👗",name:"Dusty Rose Midi Dress",size:"M · UK 12",price:"₹4,700"},{icon:"👠",name:"Strappy Block Heels",size:"Size 38",price:"₹3,200"},{icon:"👜",name:"Pearl Mini Clutch",size:"One Size",price:"₹1,400"}].map(item=>(
            <div key={item.name} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 0", borderBottom:`1px solid ${C.blush}` }}>
              <span style={{ fontSize:24 }}>{item.icon}</span>
              <div style={{ flex:1 }}>
                <p style={{ margin:0, fontFamily:"'Jost', sans-serif", fontSize:13, fontWeight:600, color:C.charcoal }}>{item.name}</p>
                <p style={{ margin:"2px 0 0", fontSize:12, color:C.taupe, fontFamily:"'Jost', sans-serif" }}>{item.size}</p>
              </div>
              <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:16, fontWeight:600, color:C.dusty }}>{item.price}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// SCREEN 6 — WARDROBE
// ══════════════════════════════════════════════════════════════════════
function WardrobeScreen({ onNav }) {
  const [activeTab, setActiveTab] = useState("all");
  const cats = ["all","tops","bottoms","dresses","shoes","acc"];
  const items = [
    {emoji:"👚",name:"White Linen",cat:"tops",color:C.cream},{emoji:"👕",name:"Stripe Tee",cat:"tops",color:C.lavender},
    {emoji:"👗",name:"Floral Midi",cat:"dresses",color:C.rose},{emoji:"👖",name:"Mom Jeans",cat:"bottoms",color:C.sage},
    {emoji:"🩱",name:"Black Slip",cat:"dresses",color:C.mauve},{emoji:"👠",name:"Block Heels",cat:"shoes",color:C.blush},
    {emoji:"👟",name:"White Sneakers",cat:"shoes",color:C.cream},{emoji:"🧣",name:"Silk Scarf",cat:"acc",color:C.gold},
  ];
  const filtered = activeTab==="all" ? items : items.filter(i=>i.cat===activeTab);

  return (
    <div style={{ background:C.cream, minHeight:"100%", paddingBottom:90 }}>
      <div style={{ background:`linear-gradient(135deg,${C.sage},${C.lavender})`, padding:"52px 24px 24px" }}>
        <h1 style={{ margin:"0 0 4px", fontFamily:"'Cormorant Garamond', serif", fontSize:26, color:C.charcoal }}>My Wardrobe</h1>
        <p style={{ margin:0, fontFamily:"'Jost', sans-serif", fontSize:13, color:C.taupe }}>{items.length} items · 3 AI suggestions</p>
      </div>

      <div style={{ padding:"0 20px" }}>
        {/* Upload */}
        <button onClick={()=>{}} style={{
          width:"100%", marginTop:20, padding:"16px 24px",
          background:`linear-gradient(135deg,${C.charcoal},#4a3f3a)`,
          border:"none", borderRadius:18, cursor:"pointer",
          display:"flex", alignItems:"center", gap:14,
          boxShadow:`0 8px 24px rgba(44,44,44,0.2)`,
        }}>
          <div style={{ width:40, height:40, borderRadius:12, background:`linear-gradient(135deg,${C.dusty},${C.gold})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon d={icons.plus} size={20} color={C.white} />
          </div>
          <div style={{ textAlign:"left" }}>
            <p style={{ margin:0, fontFamily:"'Cormorant Garamond', serif", fontSize:17, color:C.white }}>Upload New Item</p>
            <p style={{ margin:0, fontFamily:"'Jost', sans-serif", fontSize:12, color:"rgba(255,255,255,0.5)" }}>Photo, tag, categorize</p>
          </div>
        </button>

        {/* AI mix match */}
        <Card style={{ marginTop:16, background:`linear-gradient(135deg,${C.blush},${C.lavender})` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <p style={{ margin:"0 0 4px", fontFamily:"'Cormorant Garamond', serif", fontSize:17, fontWeight:600, color:C.charcoal }}>AI Mix & Match ✦</p>
              <p style={{ margin:0, fontFamily:"'Jost', sans-serif", fontSize:12, color:C.taupe }}>3 new outfit suggestions ready</p>
            </div>
            <Btn small onClick={()=>onNav("generate")}>View →</Btn>
          </div>
        </Card>

        {/* Category filter */}
        <div style={{ display:"flex", gap:8, overflowX:"auto", scrollbarWidth:"none", margin:"20px 0 16px" }}>
          {cats.map(c=>(
            <Tag key={c} active={activeTab===c} onClick={()=>setActiveTab(c)}>{c.charAt(0).toUpperCase()+c.slice(1)}</Tag>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, paddingBottom:8 }}>
          {filtered.map((item)=>(
            <div key={item.name} style={{ ...glass, borderRadius:18, overflow:"hidden", boxShadow:`0 4px 16px rgba(180,140,130,0.1)`, cursor:"pointer" }}>
              <div style={{ height:90, background:`linear-gradient(135deg,${item.color},${C.lavender})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36 }}>
                {item.emoji}
              </div>
              <div style={{ padding:"8px 10px" }}>
                <p style={{ margin:0, fontFamily:"'Jost', sans-serif", fontSize:11, fontWeight:600, color:C.charcoal, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{item.name}</p>
              </div>
            </div>
          ))}
          {/* Add more */}
          <div style={{ ...glass, borderRadius:18, height:120, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", border:`2px dashed ${C.rose}`, flexDirection:"column", gap:6 }}>
            <Icon d={icons.plus} size={24} color={C.rose} />
            <p style={{ margin:0, fontFamily:"'Jost', sans-serif", fontSize:10, color:C.taupe }}>Add</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// SCREEN 7 — WISHLIST
// ══════════════════════════════════════════════════════════════════════
function WishlistScreen({ onNav }) {
  const items = [
    { title:"Velvet Wrap Dress", style:"Evening", price:"₹6,200", color:C.mauve, saved:"2 days ago" },
    { title:"Linen Co-ord Set", style:"Casual", price:"₹3,800", color:C.sage, saved:"5 days ago" },
    { title:"Embroidered Kurta", style:"Traditional", price:"₹4,500", color:C.rose, saved:"1 week ago" },
    { title:"Blazer & Trousers", style:"Formal", price:"₹7,100", color:C.lavender, saved:"2 weeks ago" },
  ];

  return (
    <div style={{ background:C.cream, minHeight:"100%", paddingBottom:90 }}>
      <div style={{ background:`linear-gradient(135deg,${C.rose},${C.blush})`, padding:"52px 24px 24px" }}>
        <h1 style={{ margin:"0 0 4px", fontFamily:"'Cormorant Garamond', serif", fontSize:26, color:C.charcoal }}>Wishlist ♡</h1>
        <p style={{ margin:0, fontFamily:"'Jost', sans-serif", fontSize:13, color:C.taupe }}>{items.length} saved looks</p>
      </div>
      <div style={{ padding:"24px 20px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {items.map(item=>(
          <Card key={item.title} style={{ padding:0, overflow:"hidden" }}>
            <div style={{ height:160, background:`linear-gradient(160deg,${item.color},${C.lavender})`, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
              <span style={{ fontSize:52 }}>👗</span>
              <button style={{ position:"absolute", top:10, right:10, background:"rgba(255,255,255,0.8)", border:"none", borderRadius:"50%", width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                <Icon d={icons.heart} size={15} color={C.dusty} fill={C.dusty} />
              </button>
            </div>
            <div style={{ padding:"12px 14px" }}>
              <p style={{ margin:"0 0 4px", fontFamily:"'Cormorant Garamond', serif", fontSize:15, fontWeight:600, color:C.charcoal }}>{item.title}</p>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:11, color:C.taupe, fontFamily:"'Jost', sans-serif" }}>{item.style}</span>
                <span style={{ fontSize:13, fontWeight:600, color:C.dusty, fontFamily:"'Jost', sans-serif" }}>{item.price}</span>
              </div>
              <p style={{ margin:"6px 0 0", fontSize:10, color:C.soft, fontFamily:"'Jost', sans-serif" }}>Saved {item.saved}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// BOTTOM NAV
// ══════════════════════════════════════════════════════════════════════
function BottomNav({ screen, onNav }) {
  const tabs = [
    { id:"home",    icon:icons.home,    label:"Home" },
    { id:"generate",icon:icons.sparkle, label:"Generate" },
    { id:"wardrobe",icon:icons.shirt,   label:"Wardrobe" },
    { id:"wishlist",icon:icons.heart,   label:"Wishlist" },
    { id:"profile", icon:icons.user,    label:"Profile" },
  ];

  return (
    <div style={{
      position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
      width:"100%", maxWidth:430,
      ...glass, borderTop:`1px solid rgba(255,255,255,0.8)`,
      padding:"12px 8px 20px", zIndex:100,
    }}>
      <div style={{ display:"flex", justifyContent:"space-around" }}>
        {tabs.map(({ id, icon, label }) => {
          const active = screen === id;
          const isGen = id === "generate";
          return (
            <button key={id} onClick={()=>onNav(id)} style={{
              background: isGen ? `linear-gradient(135deg,${C.dusty},${C.mauve})` : "none",
              border:"none", cursor:"pointer",
              display:"flex", flexDirection:"column", alignItems:"center", gap:4,
              padding: isGen ? "10px 14px" : "4px 8px",
              borderRadius: isGen ? 20 : 8,
              marginTop: isGen ? -24 : 0,
              boxShadow: isGen ? `0 8px 24px ${C.dusty}55` : "none",
              transition:"all 0.2s",
            }}>
              <Icon d={icon} size={isGen?22:20} color={active||isGen ? (isGen?C.white:C.dusty) : C.soft} fill={active&&!isGen&&(id==="heart")?C.dusty:"none"} />
              <span style={{ fontFamily:"'Jost', sans-serif", fontSize:10, color: isGen?C.white:(active?C.dusty:C.soft), fontWeight: active?600:400, letterSpacing:"0.05em" }}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// PROFILE SCREEN (nav)
// ══════════════════════════════════════════════════════════════════════
function ProfileNav({ onNav }) {
  const stats = [{ label:"Outfits", val:"47" },{ label:"Wishlist", val:"12" },{ label:"Streak", val:"8d" }];
  const menu = ["Edit Profile","My Orders","Size Guide","Sustainability Report","Notifications","Help & Support","Sign Out"];

  return (
    <div style={{ background:C.cream, minHeight:"100%", paddingBottom:90 }}>
      <div style={{ background:`linear-gradient(160deg,${C.blush},${C.lavender})`, padding:"52px 24px 32px", textAlign:"center" }}>
        <div style={{ width:80, height:80, borderRadius:"50%", background:`linear-gradient(135deg,${C.dusty},${C.mauve})`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", boxShadow:`0 8px 24px ${C.dusty}44` }}>
          <Icon d={icons.user} size={36} color={C.white} />
        </div>
        <h2 style={{ margin:"0 0 4px", fontFamily:"'Cormorant Garamond', serif", fontSize:24, color:C.charcoal }}>Sofia Mehra</h2>
        <p style={{ margin:"0 0 20px", fontFamily:"'Jost', sans-serif", fontSize:13, color:C.taupe }}>sofia@example.com</p>
        <div style={{ display:"flex", justifyContent:"center", gap:0, ...glass, borderRadius:20, padding:"16px 0" }}>
          {stats.map(({ label, val }, i)=>(
            <div key={label} style={{ flex:1, textAlign:"center", borderRight: i<stats.length-1?`1px solid ${C.rose}`:0 }}>
              <p style={{ margin:"0 0 2px", fontFamily:"'Cormorant Garamond', serif", fontSize:22, fontWeight:700, color:C.charcoal }}>{val}</p>
              <p style={{ margin:0, fontFamily:"'Jost', sans-serif", fontSize:11, color:C.taupe }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding:"20px 20px" }}>
        <Card style={{ padding:0, overflow:"hidden" }}>
          {menu.map((item, i)=>(
            <div key={item} style={{
              padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center",
              borderBottom: i<menu.length-1?`1px solid ${C.blush}`:"none",
              cursor:"pointer", background:"transparent",
            }}>
              <span style={{ fontFamily:"'Jost', sans-serif", fontSize:14, color: item==="Sign Out"?C.dusty:C.charcoal }}>{item}</span>
              <span style={{ color:C.soft, fontSize:18 }}>›</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// ROOT APP
// ══════════════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState("login");
  const showNav = !["login","profile"].includes(screen);

  const screenMap = {
    login:    <LoginScreen onNav={setScreen} />,
    profile:  <ProfileScreen onNav={setScreen} />,
    home:     <HomeScreen onNav={setScreen} />,
    generate: <GenerateScreen onNav={setScreen} />,
    tryon:    <TryOnScreen onNav={setScreen} />,
    wardrobe: <WardrobeScreen onNav={setScreen} />,
    wishlist: <WishlistScreen onNav={setScreen} />,
    profilenav: <ProfileNav onNav={setScreen} />,
  };

  const navMap = { home:"home", generate:"generate", wardrobe:"wardrobe", wishlist:"wishlist", profile:"profilenav" };

  return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"flex-start", minHeight:"100vh", background:"#E8DDD8", padding:"20px 0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #E8DDD8; }
        input::placeholder { color: #B8A8A0; }
        ::-webkit-scrollbar { display: none; }
        input[type=range]::-webkit-slider-thumb { appearance: none; width: 18px; height: 18px; border-radius: 50%; background: linear-gradient(135deg,${C.dusty},${C.mauve}); cursor: pointer; box-shadow: 0 2px 8px ${C.dusty}66; }
        button:active { transform: scale(0.97) !important; }
      `}</style>
      <div style={{ width:"100%", maxWidth:430, minHeight:"100vh", background:C.cream, position:"relative", overflow:"hidden", boxShadow:"0 0 80px rgba(0,0,0,0.12)", borderRadius:0 }}>
        <div style={{ minHeight:"100vh", overflowY:"auto", paddingBottom: showNav?80:0 }}>
          {screenMap[screen] || screenMap["home"]}
        </div>
        {showNav && (
          <BottomNav screen={screen==="profilenav"?"profile":screen} onNav={s => setScreen(navMap[s]||s)} />
        )}
      </div>
    </div>
  );
}
