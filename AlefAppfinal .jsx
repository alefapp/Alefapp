import { useState, useEffect } from "react";

// ─── SUPABASE CONFIG ─────────────────────────────────────
const SUPABASE_URL = "https://imsjxfetnwyyngtmqici.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imltc2p4ZmV0bnd5eW5ndG1xaWNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExOTI1MzYsImV4cCI6MjA5Njc2ODUzNn0.2vGKaQiGjsGlE07ZdGFuwqdm_Yu6zMv4KirSwJaX82Q";

async function sbFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      "apikey": SUPABASE_ANON,
      "Authorization": `Bearer ${SUPABASE_ANON}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation",
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  return { data, ok: res.ok, status: res.status };
}

async function getUser(username) {
  const { data, ok } = await sbFetch(`users?username=eq.${username.toLowerCase()}&select=*`);
  return ok && data.length > 0 ? data[0] : null;
}

async function createUser(username, password) {
  const { data, ok } = await sbFetch("users", {
    method: "POST",
    body: JSON.stringify({
      username: username.toLowerCase(),
      password,
      created_at: new Date().toISOString(),
      is_paid: false,
      xp: 0,
      learned: [],
      streak: 0,
    }),
  });
  return ok ? data[0] : null;
}

async function updateUser(username, fields) {
  await sbFetch(`users?username=eq.${username.toLowerCase()}`, {
    method: "PATCH",
    body: JSON.stringify(fields),
  });
}

// ─── DATA ────────────────────────────────────────────────
const alphabet = [
  { letter: "ا", name: "Alif", transliteration: "a", word: "أسد", wordMeaning: "Lion", wordLatin: "Asad" },
  { letter: "ب", name: "Ba", transliteration: "b", word: "بيت", wordMeaning: "Maison", wordLatin: "Bayt" },
  { letter: "ت", name: "Ta", transliteration: "t", word: "تفاح", wordMeaning: "Pomme", wordLatin: "Tuffah" },
  { letter: "ث", name: "Tha", transliteration: "th", word: "ثعلب", wordMeaning: "Renard", wordLatin: "Tha'lab" },
  { letter: "ج", name: "Jim", transliteration: "dj", word: "جمل", wordMeaning: "Chameau", wordLatin: "Jamal" },
  { letter: "ح", name: "Ha", transliteration: "ḥ", word: "حصان", wordMeaning: "Cheval", wordLatin: "Hisan" },
  { letter: "خ", name: "Kha", transliteration: "kh", word: "خبز", wordMeaning: "Pain", wordLatin: "Khubz" },
  { letter: "د", name: "Dal", transliteration: "d", word: "دجاجة", wordMeaning: "Poulet", wordLatin: "Dajaja" },
  { letter: "ذ", name: "Dhal", transliteration: "dh", word: "ذهب", wordMeaning: "Or", wordLatin: "Dhahab" },
  { letter: "ر", name: "Ra", transliteration: "r", word: "رمل", wordMeaning: "Sable", wordLatin: "Raml" },
  { letter: "ز", name: "Zay", transliteration: "z", word: "زهرة", wordMeaning: "Fleur", wordLatin: "Zahra" },
  { letter: "س", name: "Sin", transliteration: "s", word: "سمكة", wordMeaning: "Poisson", wordLatin: "Samaka" },
  { letter: "ش", name: "Shin", transliteration: "sh", word: "شمس", wordMeaning: "Soleil", wordLatin: "Shams" },
  { letter: "ص", name: "Sad", transliteration: "ṣ", word: "صقر", wordMeaning: "Faucon", wordLatin: "Saqr" },
  { letter: "ض", name: "Dad", transliteration: "ḍ", word: "ضفدع", wordMeaning: "Grenouille", wordLatin: "Difda'" },
  { letter: "ط", name: "Ta'", transliteration: "ṭ", word: "طائر", wordMeaning: "Oiseau", wordLatin: "Ta'ir" },
  { letter: "ظ", name: "Dha'", transliteration: "ẓ", word: "ظبي", wordMeaning: "Gazelle", wordLatin: "Zaby" },
  { letter: "ع", name: "'Ayn", transliteration: "'a", word: "عين", wordMeaning: "Œil", wordLatin: "'Ayn" },
  { letter: "غ", name: "Ghayn", transliteration: "gh", word: "غزال", wordMeaning: "Gazelle", wordLatin: "Ghazal" },
  { letter: "ف", name: "Fa", transliteration: "f", word: "فيل", wordMeaning: "Éléphant", wordLatin: "Fil" },
  { letter: "ق", name: "Qaf", transliteration: "q", word: "قمر", wordMeaning: "Lune", wordLatin: "Qamar" },
  { letter: "ك", name: "Kaf", transliteration: "k", word: "كتاب", wordMeaning: "Livre", wordLatin: "Kitab" },
  { letter: "ل", name: "Lam", transliteration: "l", word: "ليمون", wordMeaning: "Citron", wordLatin: "Laymun" },
  { letter: "م", name: "Mim", transliteration: "m", word: "ماء", wordMeaning: "Eau", wordLatin: "Ma'" },
  { letter: "ن", name: "Nun", transliteration: "n", word: "نجمة", wordMeaning: "Étoile", wordLatin: "Najma" },
  { letter: "ه", name: "Ha'", transliteration: "h", word: "هلال", wordMeaning: "Croissant", wordLatin: "Hilal" },
  { letter: "و", name: "Waw", transliteration: "w/ou", word: "وردة", wordMeaning: "Rose", wordLatin: "Warda" },
  { letter: "ي", name: "Ya", transliteration: "y/i", word: "يد", wordMeaning: "Main", wordLatin: "Yad" },
];

const LEVELS = [
  { id: "beginner", label: "Débutant", range: [0, 9], color: "#00ffe0" },
  { id: "intermediate", label: "Intermédiaire", range: [10, 19], color: "#a78bfa" },
  { id: "advanced", label: "Avancé", range: [20, 27], color: "#f59e0b" },
];

const CYAN = "#00ffe0";
const CB = "rgba(0,255,224,0.22)";
const CD = "rgba(0,255,224,0.1)";
const TRIAL_DAYS = 14;

function speak(text) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ar-SA"; u.rate = 0.8;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

function daysLeft(createdAt) {
  const diff = Date.now() - new Date(createdAt).getTime();
  return Math.max(0, TRIAL_DAYS - Math.floor(diff / 86400000));
}

function isTrialActive(user) {
  if (user.is_paid) return true;
  return daysLeft(user.created_at) > 0;
}

function getSession() {
  try { return JSON.parse(localStorage.getItem("alef_session") || "null"); } catch { return null; }
}
function saveSession(u) { localStorage.setItem("alef_session", JSON.stringify(u)); }
function clearSession() { localStorage.removeItem("alef_session"); }

// ─── PARTICLES ───────────────────────────────────────────
function Particles() {
  const pts = Array.from({ length: 16 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 2 + 1, dur: Math.random() * 6 + 4, delay: Math.random() * 4,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {pts.map(p => (
        <div key={p.id} style={{
          position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size, borderRadius: "50%",
          background: "rgba(0,255,200,0.35)", boxShadow: "0 0 6px rgba(0,255,200,0.5)",
          animation: `flt ${p.dur}s ${p.delay}s infinite ease-in-out`,
        }} />
      ))}
      <style>{`
        @keyframes flt{0%,100%{transform:translateY(0) scale(1);opacity:.3}50%{transform:translateY(-28px) scale(1.3);opacity:.7}}
        @keyframes glow{0%,100%{opacity:1}93%{opacity:.7}96%{opacity:.85}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn{0%{transform:scale(.8);opacity:0}100%{transform:scale(1);opacity:1}}
        @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      `}</style>
    </div>
  );
}

function Corner({ pos }) {
  const t = pos.startsWith("t"), l = pos.endsWith("l");
  return <div style={{ position:"absolute", top:t?6:"auto", bottom:t?"auto":6, left:l?6:"auto", right:l?"auto":6, width:10, height:10, borderTop:t?`1px solid ${CYAN}`:"none", borderBottom:t?"none":`1px solid ${CYAN}`, borderLeft:l?`1px solid ${CYAN}`:"none", borderRight:l?"none":`1px solid ${CYAN}`, opacity:.5 }} />;
}

function Input({ label, type, value, onChange, placeholder }) {
  return (
    <div style={{ width: "100%" }}>
      <div style={{ fontSize: 9, color: "rgba(0,255,224,0.5)", letterSpacing: 3, marginBottom: 5, textTransform: "uppercase" }}>{label}</div>
      <input type={type || "text"} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", boxSizing: "border-box", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(0,255,224,0.2)", borderRadius: 5, padding: "10px 12px", color: "#e0f5f0", fontSize: 13, outline: "none", fontFamily: "inherit" }}
        onFocus={e => e.target.style.border = `1px solid ${CYAN}`}
        onBlur={e => e.target.style.border = "1px solid rgba(0,255,224,0.2)"}
      />
    </div>
  );
}

function Btn({ children, onClick, disabled, color }) {
  const c = color || CYAN;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: "11px 28px", borderRadius: 4, border: `1px solid ${disabled ? "rgba(0,255,224,0.15)" : c}`,
      background: disabled ? "transparent" : `${c}18`, color: disabled ? "rgba(0,255,224,0.3)" : c,
      fontWeight: 700, fontSize: 12, letterSpacing: 2, cursor: disabled ? "not-allowed" : "pointer",
      textTransform: "uppercase", boxShadow: disabled ? "none" : `0 0 14px ${c}22`, width: "100%",
    }}>{children}</button>
  );
}

// ─── AUTH ────────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  function triggerError(msg) {
    setError(msg); setShake(true); setTimeout(() => setShake(false), 500);
  }

  async function handleLogin() {
    if (!username.trim() || !password.trim()) return triggerError("Remplis tous les champs.");
    setLoading(true); setError("");
    const user = await getUser(username);
    setLoading(false);
    if (!user) return triggerError("Utilisateur introuvable.");
    if (user.password !== password) return triggerError("Mot de passe incorrect.");
    if (!isTrialActive(user)) return triggerError("Essai expiré. Abonne-toi pour continuer.");
    saveSession(user);
    onLogin(user);
  }

  async function handleRegister() {
    if (!username.trim() || !password.trim() || !confirm.trim()) return triggerError("Remplis tous les champs.");
    if (password !== confirm) return triggerError("Les mots de passe ne correspondent pas.");
    if (password.length < 4) return triggerError("Mot de passe trop court (min 4 caractères).");
    if (username.length < 3) return triggerError("Nom d'utilisateur trop court (min 3 caractères).");
    setLoading(true); setError("");
    const existing = await getUser(username);
    if (existing) { setLoading(false); return triggerError("Ce nom d'utilisateur est déjà pris."); }
    const newUser = await createUser(username, password);
    setLoading(false);
    if (!newUser) return triggerError("Erreur lors de la création du compte. Réessaie.");
    setSuccess("Compte créé ! Ton essai gratuit de 14 jours commence maintenant. 🎉");
    setTimeout(() => { saveSession(newUser); onLogin(newUser); }, 1500);
  }

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at 20% 20%,#050d1a,#020a14 60%,#000508)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <Particles />
      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 400, padding: "0 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 40, fontWeight: 900, color: CYAN, textShadow: `0 0 30px ${CYAN}`, letterSpacing: 6, animation: "glow 5s infinite" }}>AlefApp</div>
          <div style={{ fontSize: 10, color: "rgba(0,255,224,0.4)", letterSpacing: 4, marginTop: 4 }}>الحروف العربية — ARABIC LEARNING v3.0</div>
        </div>
        <div style={{ background: "rgba(0,10,20,0.9)", border: `1px solid ${CB}`, borderRadius: 12, padding: "26px 22px", backdropFilter: "blur(12px)", position: "relative", overflow: "hidden", animation: shake ? "shake 0.4s" : "fadeIn 0.4s ease" }}>
          {["tl","tr","bl","br"].map(p => <Corner key={p} pos={p} />)}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${CYAN},transparent)` }} />
          <div style={{ display: "flex", marginBottom: 20, background: "rgba(0,0,0,0.3)", borderRadius: 6, padding: 3 }}>
            {[["login","CONNEXION"],["register","INSCRIPTION"]].map(([k,l]) => (
              <button key={k} onClick={() => { setMode(k); setError(""); setSuccess(""); }} style={{ flex: 1, padding: 7, borderRadius: 4, border: "none", background: mode===k ? CD : "transparent", color: mode===k ? CYAN : "rgba(0,255,224,0.35)", cursor: "pointer", fontSize: 10, fontWeight: 700, letterSpacing: 2 }}>{l}</button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <Input label="Nom d'utilisateur" value={username} onChange={setUsername} placeholder="ex: ali123" />
            <Input label="Mot de passe" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
            {mode === "register" && <Input label="Confirmer le mot de passe" type="password" value={confirm} onChange={setConfirm} placeholder="••••••••" />}
            {error && <div style={{ fontSize: 11, color: "#ff4466", background: "rgba(255,68,102,0.08)", border: "1px solid rgba(255,68,102,0.2)", borderRadius: 4, padding: "7px 10px", textAlign: "center" }}>✗ {error}</div>}
            {success && <div style={{ fontSize: 11, color: "#00ff88", background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 4, padding: "7px 10px", textAlign: "center" }}>✓ {success}</div>}
            <Btn onClick={mode === "login" ? handleLogin : handleRegister} disabled={loading}>
              {loading ? "⏳ CHARGEMENT..." : mode === "login" ? "SE CONNECTER →" : "CRÉER MON COMPTE →"}
            </Btn>
          </div>
          {mode === "register" && (
            <div style={{ marginTop: 14, background: "rgba(0,255,224,0.03)", border: "1px solid rgba(0,255,224,0.07)", borderRadius: 6, padding: "9px 11px" }}>
              <div style={{ fontSize: 10, color: CYAN, fontWeight: 700, marginBottom: 3 }}>🎁 ESSAI GRATUIT 14 JOURS</div>
              <div style={{ fontSize: 10, color: "rgba(0,255,224,0.45)", lineHeight: 1.6 }}>Accès complet pendant 14 jours sans carte bancaire.<br />Ensuite : <strong style={{ color: CYAN }}>0,50 € / mois</strong> seulement.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── EXPIRED ─────────────────────────────────────────────
function ExpiredScreen({ user, onSubscribe, onLogout }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function handleSubscribe() {
    window.open("https://buy.stripe.com/9B6dRa93C1YT3mgdpe0sU00", "_blank");
    setLoading(true);
    setTimeout(() => {
      updateUser(user.username, { is_paid: true });
      const updated = { ...user, is_paid: true };
      saveSession(updated);
      setLoading(false); setDone(true);
      setTimeout(() => onSubscribe(updated), 1200);
    }, 3000);
  }

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at 20% 20%,#050d1a,#020a14 60%,#000508)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <Particles />
      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 400, padding: "0 20px", textAlign: "center" }}>
        <div style={{ fontSize: 38, fontWeight: 900, color: CYAN, textShadow: `0 0 30px ${CYAN}`, letterSpacing: 6, marginBottom: 22 }}>AlefApp</div>
        <div style={{ background: "rgba(0,10,20,0.9)", border: `1px solid ${CB}`, borderRadius: 12, padding: "30px 22px", backdropFilter: "blur(12px)", position: "relative", overflow: "hidden", animation: "fadeIn 0.4s ease" }}>
          {["tl","tr","bl","br"].map(p => <Corner key={p} pos={p} />)}
          <div style={{ fontSize: 34, marginBottom: 10 }}>⏳</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#ff6b6b", letterSpacing: 2, marginBottom: 8 }}>ESSAI EXPIRÉ</div>
          <div style={{ fontSize: 12, color: "rgba(0,255,224,0.5)", marginBottom: 22, lineHeight: 1.7 }}>
            Ton essai gratuit de 14 jours est terminé.<br />Continue pour seulement<br />
            <span style={{ fontSize: 26, fontWeight: 900, color: CYAN, display: "block", margin: "8px 0" }}>0,50 €<span style={{ fontSize: 12, color: "rgba(0,255,224,0.5)" }}> / mois</span></span>
          </div>
          {done ? (
            <div style={{ fontSize: 13, color: "#00ff88", fontWeight: 700 }}>✓ Abonnement activé !</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Btn onClick={handleSubscribe} disabled={loading}>{loading ? "⏳ REDIRECTION STRIPE..." : "S'ABONNER MAINTENANT →"}</Btn>
              <button onClick={onLogout} style={{ background: "transparent", border: "none", color: "rgba(0,255,224,0.3)", cursor: "pointer", fontSize: 11 }}>Se déconnecter</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────
function MainApp({ user, onLogout }) {
  const [tab, setTab] = useState("learn");
  const [selected, setSelected] = useState(alphabet[0]);
  const [learned, setLearned] = useState(user.learned || []);
  const [xp, setXp] = useState(user.xp || 0);
  const [streak, setStreak] = useState(user.streak || 0);
  const [quizState, setQuizState] = useState(null);
  const [answered, setAnswered] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [speakAnim, setSpeakAnim] = useState(false);
  const [xpAnim, setXpAnim] = useState(false);
  const [activeLevel, setActiveLevel] = useState("beginner");
  const [showProfile, setShowProfile] = useState(false);

  const trialDays = daysLeft(user.created_at);
  const progress = Math.round((learned.length / 28) * 100);
  const rank = xp < 100 ? "Novice" : xp < 300 ? "Apprenti" : xp < 600 ? "Initié" : xp < 1000 ? "Expert" : "Maître";
  const rankColor = xp < 100 ? "#9aabb8" : xp < 300 ? CYAN : xp < 600 ? "#a78bfa" : xp < 1000 ? "#f59e0b" : "#ff6b6b";

  useEffect(() => {
    const timer = setTimeout(() => {
      updateUser(user.username, { xp, learned, streak });
      saveSession({ ...user, xp, learned, streak });
    }, 1500);
    return () => clearTimeout(timer);
  }, [xp, learned, streak]);

  function triggerSpeak(text) { speak(text); setSpeakAnim(true); setTimeout(() => setSpeakAnim(false), 900); }
  function addXp(pts) { setXp(x => x + pts); setXpAnim(true); setTimeout(() => setXpAnim(false), 700); }

  function selectLetter(l) {
    setSelected(l);
    if (!learned.includes(l.name)) { setLearned(p => [...p, l.name]); addXp(10); }
    triggerSpeak(l.letter);
  }

  function goQuiz() { generateQuestion(); setTab("quiz"); }

  function generateQuestion() {
    const type = Math.random() > 0.5 ? "name" : "word";
    const correct = alphabet[Math.floor(Math.random() * alphabet.length)];
    const others = alphabet.filter(l => l.name !== correct.name).sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [...others, correct].sort(() => Math.random() - 0.5);
    setQuizState({ correct, options, type });
    setAnswered(null);
  }

  function handleAnswer(opt) {
    if (answered) return;
    const isCorrect = opt.name === quizState.correct.name;
    setAnswered({ selected: opt.name, isCorrect });
    setScore(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
    if (isCorrect) { triggerSpeak(quizState.correct.letter); addXp(25); setStreak(s => s + 1); }
    else setStreak(0);
  }

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at 20% 20%,#050d1a,#020a14 60%,#000508)", fontFamily: "'Segoe UI',system-ui,sans-serif", color: "#c8e8e0", position: "relative", overflow: "hidden" }}>
      <Particles />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.04) 2px,rgba(0,0,0,0.04) 4px)" }} />
      <div style={{ position: "relative", zIndex: 2 }}>

        {/* HEADER */}
        <div style={{ padding: "12px 18px", borderBottom: `1px solid ${CB}`, background: "rgba(0,255,224,0.02)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: CYAN, boxShadow: `0 0 10px ${CYAN}` }} />
              <span style={{ fontSize: 20, fontWeight: 800, color: CYAN, textShadow: `0 0 20px ${CYAN}`, letterSpacing: 4, animation: "glow 6s infinite" }}>AlefApp</span>
            </div>
            <div style={{ fontSize: 8, color: "rgba(0,255,224,0.3)", letterSpacing: 3, marginTop: 1, marginLeft: 15 }}>ARABIC LEARNING SYSTEM v3.0</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {!user.is_paid && trialDays > 0 && (
              <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 6, padding: "5px 10px", fontSize: 10, color: "#f59e0b" }}>⏱ Essai : <strong>{trialDays}j restants</strong></div>
            )}
            {[["XP", xp, xpAnim], ["RANG", rank, false]].map(([k, v, anim]) => (
              <div key={k} style={{ background: CD, border: `1px solid ${CB}`, borderRadius: 6, padding: "5px 10px" }}>
                <div style={{ fontSize: 8, color: "rgba(0,255,224,0.4)", letterSpacing: 2 }}>{k}</div>
                <div style={{ fontSize: k==="RANG"?12:15, fontWeight: 800, color: k==="RANG"?rankColor:CYAN, animation: anim?"popIn 0.4s":"none" }}>{v}</div>
              </div>
            ))}
            {streak > 0 && <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 6, padding: "5px 10px" }}><div style={{ fontSize: 8, color: "rgba(245,158,11,0.5)", letterSpacing: 2 }}>STREAK</div><div style={{ fontSize: 13, color: "#f59e0b", fontWeight: 700 }}>🔥 {streak}</div></div>}
            <div style={{ background: CD, border: `1px solid ${CB}`, borderRadius: 6, padding: "5px 10px" }}><div style={{ fontSize: 8, color: "rgba(0,255,224,0.4)", letterSpacing: 2 }}>PROGRESS</div><div style={{ fontSize: 12, color: CYAN, fontWeight: 700 }}>{progress}%</div></div>
            <button onClick={() => setShowProfile(p => !p)} style={{ background: showProfile ? CD : "transparent", border: `1px solid ${CB}`, borderRadius: 6, padding: "5px 12px", cursor: "pointer", color: CYAN, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>◈ {user.username}</button>
          </div>
        </div>

        {/* PROFILE DROPDOWN */}
        {showProfile && (
          <div style={{ position: "absolute", top: 68, right: 18, zIndex: 10, background: "rgba(0,10,20,0.97)", border: `1px solid ${CB}`, borderRadius: 10, padding: 18, minWidth: 220, backdropFilter: "blur(16px)", animation: "fadeIn 0.2s ease" }}>
            {["tl","tr","bl","br"].map(p => <Corner key={p} pos={p} />)}
            <div style={{ fontSize: 10, color: "rgba(0,255,224,0.4)", letterSpacing: 3, marginBottom: 12 }}>PROFIL UTILISATEUR</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
              {[["Utilisateur", user.username], ["Statut", user.is_paid ? "✓ Abonné" : `Essai — ${trialDays}j restants`], ["Abonnement", user.is_paid ? "0,50 € / mois" : "Gratuit"], ["XP total", xp], ["Rang", rank], ["Lettres apprises", `${learned.length}/28`]].map(([k,v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, borderBottom: "1px solid rgba(0,255,224,0.05)", paddingBottom: 5 }}>
                  <span style={{ color: "rgba(0,255,224,0.4)" }}>{k}</span>
                  <span style={{ color: "#e0f5f0", fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => { clearSession(); onLogout(); }} style={{ width: "100%", padding: 8, background: "rgba(255,68,102,0.08)", border: "1px solid rgba(255,68,102,0.2)", color: "#ff4466", borderRadius: 5, cursor: "pointer", fontSize: 10, fontWeight: 700, letterSpacing: 2 }}>✕ SE DÉCONNECTER</button>
          </div>
        )}

        {/* TABS */}
        <div style={{ display: "flex", padding: "12px 18px 0", gap: 6, borderBottom: "1px solid rgba(0,255,224,0.06)", flexWrap: "wrap" }}>
          {[["learn","APPRENDRE","◈"],["quiz","QUIZ","◉"],["levels","NIVEAUX","★"]].map(([k,l,ic]) => (
            <button key={k} onClick={() => k==="quiz"?goQuiz():setTab(k)} style={{ padding: "7px 14px", borderRadius: "4px 4px 0 0", border: tab===k?`1px solid ${CB}`:"1px solid transparent", borderBottom: tab===k?"1px solid #020a14":"1px solid rgba(0,255,224,0.06)", background: tab===k?"rgba(0,255,224,0.06)":"transparent", color: tab===k?CYAN:"rgba(0,255,224,0.35)", cursor: "pointer", fontSize: 10, fontWeight: 700, letterSpacing: 2, display: "flex", alignItems: "center", gap: 5 }}>
              {ic} {l}
            </button>
          ))}
          {tab==="quiz" && <span style={{ marginLeft: "auto", fontSize: 11, color: "rgba(0,255,224,0.5)", alignSelf: "center" }}>SCORE <strong style={{ color: CYAN }}>{score.correct}/{score.total}</strong></span>}
        </div>

        {/* LEARN */}
        {tab==="learn" && (
          <div style={{ padding: "18px", display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 260px" }}>
              <div style={{ fontSize: 9, color: "rgba(0,255,224,0.35)", letterSpacing: 3, marginBottom: 10 }}>— SÉLECTIONNER UNE LETTRE</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
                {alphabet.map(l => {
                  const isSel = selected.name===l.name, isL = learned.includes(l.name);
                  const lvl = LEVELS.find(lv => { const i=alphabet.findIndex(a=>a.name===l.name); return i>=lv.range[0]&&i<=lv.range[1]; });
                  return (
                    <button key={l.name} onClick={() => selectLetter(l)} style={{ padding: "9px 4px", borderRadius: 5, border: isSel?`1px solid ${lvl?.color||CYAN}`:"1px solid rgba(0,255,224,0.07)", background: isSel?`${lvl?.color||CYAN}12`:isL?"rgba(0,255,224,0.03)":"rgba(0,0,0,0.3)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, transition: "all 0.15s", boxShadow: isSel?`0 0 10px ${lvl?.color||CYAN}22`:"none" }}>
                      <span style={{ fontSize: 22, color: isSel?(lvl?.color||CYAN):isL?"rgba(0,255,224,0.65)":"#c8e8e0", textShadow: isSel?`0 0 10px ${lvl?.color||CYAN}`:"none" }}>{l.letter}</span>
                      <span style={{ fontSize: 8, color: "rgba(0,255,224,0.28)" }}>{l.name}</span>
                      {isL && <span style={{ fontSize: 7, color: CYAN, opacity: 0.6 }}>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{ flex: "1 1 210px", background: "rgba(0,10,20,0.85)", borderRadius: 10, border: `1px solid ${CB}`, padding: "20px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 13, backdropFilter: "blur(12px)", animation: "fadeIn 0.3s ease", position: "relative", overflow: "hidden" }}>
              {["tl","tr","bl","br"].map(p => <Corner key={p} pos={p} />)}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${CYAN},transparent)` }} />
              <div style={{ fontSize: 90, lineHeight: 1, color: CYAN, textShadow: `0 0 30px ${CYAN},0 0 60px ${CYAN}44`, animation: "glow 5s infinite" }}>{selected.letter}</div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#e0f5f0", letterSpacing: 2, textTransform: "uppercase" }}>{selected.name}</div>
                <div style={{ marginTop: 5, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <span style={{ fontSize: 8, color: "rgba(0,255,224,0.4)", letterSpacing: 2 }}>PRONONCIATION</span>
                  <span style={{ background: CD, border: `1px solid ${CB}`, color: CYAN, borderRadius: 4, padding: "2px 7px", fontSize: 11, fontWeight: 700, fontFamily: "monospace" }}>{selected.transliteration}</span>
                </div>
              </div>
              <button onClick={() => triggerSpeak(selected.letter)} style={{ padding: "8px 20px", borderRadius: 4, border: `1px solid ${CYAN}`, background: speakAnim?CD:"transparent", color: CYAN, fontWeight: 700, fontSize: 11, letterSpacing: 2, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: speakAnim?`0 0 16px rgba(0,255,224,0.3)`:"none", transition: "all 0.2s" }}>
                <span>{speakAnim?"◉":"▶"}</span> ÉCOUTER
              </button>
              <div style={{ width: "100%", background: "rgba(0,255,224,0.03)", borderRadius: 7, padding: 10, border: "1px solid rgba(0,255,224,0.06)" }}>
                <div style={{ fontSize: 8, color: "rgba(0,255,224,0.4)", letterSpacing: 3, marginBottom: 7 }}>MOT EXEMPLE</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 26, color: "#e0f5f0" }}>{selected.word}</div>
                    <div style={{ fontSize: 10, color: "rgba(0,255,224,0.45)", fontFamily: "monospace" }}>{selected.wordLatin}</div>
                    <div style={{ fontSize: 11, color: CYAN, fontWeight: 600 }}>{selected.wordMeaning}</div>
                  </div>
                  <button onClick={() => triggerSpeak(selected.word)} style={{ background: "transparent", border: "1px solid rgba(0,255,224,0.2)", color: "rgba(0,255,224,0.5)", borderRadius: 4, padding: "4px 9px", cursor: "pointer", fontSize: 13 }}>▶</button>
                </div>
              </div>
              <div style={{ width: "100%", background: "rgba(0,0,0,0.25)", borderRadius: 6, padding: 9, border: "1px solid rgba(0,255,224,0.05)" }}>
                <div style={{ fontSize: 8, color: "rgba(0,255,224,0.35)", letterSpacing: 3, marginBottom: 7 }}>FORMES</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
                  {[["isolated","Isolée"],["initial","Début"],["medial","Milieu"],["final","Fin"]].map(([k,v]) => {
                    const forms = { isolated:selected.letter, initial:selected.letter+"ـ", medial:"ـ"+selected.letter+"ـ", final:"ـ"+selected.letter };
                    return <div key={k} style={{ background: "rgba(0,255,224,0.02)", borderRadius: 4, padding: "6px 4px", textAlign: "center", border: "1px solid rgba(0,255,224,0.04)" }}><div style={{ fontSize: 17, color: "#e0f5f0" }}>{forms[k]}</div><div style={{ fontSize: 8, color: "rgba(0,255,224,0.28)", marginTop: 2 }}>{v}</div></div>;
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* QUIZ */}
        {tab==="quiz" && quizState && (
          <div style={{ padding: "22px 18px", maxWidth: 440, margin: "0 auto", animation: "fadeIn 0.3s ease" }}>
            <div style={{ textAlign: "center", background: "rgba(0,10,20,0.85)", border: `1px solid ${CB}`, borderRadius: 12, padding: "26px 16px", marginBottom: 16, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${CYAN},transparent)` }} />
              <p style={{ fontSize: 9, color: "rgba(0,255,224,0.4)", letterSpacing: 4, textTransform: "uppercase", marginBottom: 10 }}>{quizState.type==="word"?"◈ Quelle lettre commence ce mot ?":"◈ Identifiez cette lettre"}</p>
              <div style={{ fontSize: quizState.type==="word"?40:100, lineHeight: 1, color: CYAN, textShadow: `0 0 40px ${CYAN}`, marginBottom: 10 }}>{quizState.type==="word"?quizState.correct.word:quizState.correct.letter}</div>
              {quizState.type==="word" && <div style={{ fontSize: 12, color: "rgba(0,255,224,0.45)", marginBottom: 6 }}>{quizState.correct.wordMeaning} — <span style={{ fontFamily:"monospace" }}>{quizState.correct.wordLatin}</span></div>}
              <button onClick={() => triggerSpeak(quizState.type==="word"?quizState.correct.word:quizState.correct.letter)} style={{ background:"transparent", border:"1px solid rgba(0,255,224,0.25)", color:"rgba(0,255,224,0.55)", borderRadius:4, padding:"5px 12px", cursor:"pointer", fontSize:10, letterSpacing:2 }}>▶ ÉCOUTER</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 16 }}>
              {quizState.options.map(opt => {
                let border="1px solid rgba(0,255,224,0.1)",bg="rgba(0,0,0,0.4)",color="#c8e8e0",glow="none";
                if(answered){if(opt.name===quizState.correct.name){border="1px solid #00ff88";bg="rgba(0,255,136,0.1)";color="#00ff88";glow="0 0 14px rgba(0,255,136,0.2)";}else if(opt.name===answered.selected&&!answered.isCorrect){border="1px solid #ff4466";bg="rgba(255,68,102,0.1)";color="#ff4466";glow="0 0 14px rgba(255,68,102,0.2)";}}
                return <button key={opt.name} onClick={() => handleAnswer(opt)} style={{ padding:"13px 8px",borderRadius:6,border,background:bg,color,cursor:answered?"default":"pointer",fontWeight:700,transition:"all 0.2s",boxShadow:glow,textAlign:"center" }}><div style={{ fontSize:22 }}>{opt.letter}</div><div style={{ fontSize:13 }}>{opt.name}</div><div style={{ fontSize:9,fontFamily:"monospace",opacity:.55,marginTop:2 }}>[{opt.transliteration}]</div></button>;
              })}
            </div>
            {answered && (
              <div style={{ textAlign: "center", animation: "fadeIn 0.2s ease" }}>
                <div style={{ fontSize: 12, color: answered.isCorrect?"#00ff88":"#ff4466", fontWeight: 700, marginBottom: 6, letterSpacing: 2, textTransform: "uppercase" }}>{answered.isCorrect?`✓ Correct  +25 XP`:`✗ C'était : ${quizState.correct.name}`}</div>
                {streak>1&&answered.isCorrect&&<div style={{ fontSize:11,color:"#f59e0b",marginBottom:8 }}>🔥 Série de {streak} !</div>}
                <button onClick={generateQuestion} style={{ padding:"10px 30px",borderRadius:4,border:`1px solid ${CYAN}`,background:CD,color:CYAN,fontWeight:700,fontSize:11,letterSpacing:3,cursor:"pointer",boxShadow:`0 0 14px rgba(0,255,224,0.15)` }}>SUIVANT →</button>
              </div>
            )}
          </div>
        )}

        {/* LEVELS */}
        {tab==="levels" && (
          <div style={{ padding: "18px", animation: "fadeIn 0.3s ease" }}>
            <div style={{ display: "flex", gap: 7, marginBottom: 18, flexWrap: "wrap" }}>
              {LEVELS.map(l => <button key={l.id} onClick={() => setActiveLevel(l.id)} style={{ padding:"7px 14px",borderRadius:4,border:activeLevel===l.id?`1px solid ${l.color}`:"1px solid rgba(0,255,224,0.1)",background:activeLevel===l.id?`${l.color}18`:"transparent",color:activeLevel===l.id?l.color:"rgba(0,255,224,0.35)",cursor:"pointer",fontSize:10,fontWeight:700,letterSpacing:2 }}>{l.label.toUpperCase()}</button>)}
            </div>
            <div style={{ background:"rgba(0,10,20,0.7)",border:`1px solid ${CB}`,borderRadius:10,padding:16,marginBottom:16,position:"relative",overflow:"hidden" }}>
              {["tl","tr","bl","br"].map(p=><Corner key={p} pos={p}/>)}
              <div style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:9 }}>
                {alphabet.slice(LEVELS.find(l=>l.id===activeLevel).range[0],LEVELS.find(l=>l.id===activeLevel).range[1]+1).map(l=>{
                  const lvl=LEVELS.find(lv=>lv.id===activeLevel),isL=learned.includes(l.name);
                  return <div key={l.name} onClick={()=>{setTab("learn");selectLetter(l);}} style={{ padding:"10px 6px",borderRadius:7,border:`1px solid ${isL?lvl.color:"rgba(0,255,224,0.05)"}`,background:isL?`${lvl.color}10`:"rgba(0,0,0,0.3)",cursor:"pointer",textAlign:"center",transition:"all 0.2s",boxShadow:isL?`0 0 8px ${lvl.color}22`:"none" }}><div style={{ fontSize:30,color:isL?lvl.color:"#c8e8e0",textShadow:isL?`0 0 10px ${lvl.color}`:"none" }}>{l.letter}</div><div style={{ fontSize:8,color:"rgba(0,255,224,0.38)",marginTop:2 }}>{l.name}</div><div style={{ fontSize:8,fontFamily:"monospace",color:isL?lvl.color:"rgba(0,255,224,0.18)",marginTop:1 }}>[{l.transliteration}]</div>{isL&&<div style={{ fontSize:8,color:lvl.color,marginTop:2 }}>✓</div>}</div>;
                })}
              </div>
            </div>
            <div style={{ background:"rgba(0,10,20,0.7)",border:`1px solid ${CB}`,borderRadius:10,padding:16,position:"relative",overflow:"hidden" }}>
              {["tl","tr","bl","br"].map(p=><Corner key={p} pos={p}/>)}
              <div style={{ fontSize:9,color:"rgba(0,255,224,0.4)",letterSpacing:3,marginBottom:14 }}>◉ TABLEAU XP</div>
              <div style={{ display:"flex",flexDirection:"column",gap:7 }}>
                {[["Novice","#9aabb8",0,99],["Apprenti",CYAN,100,299],["Initié","#a78bfa",300,599],["Expert","#f59e0b",600,999],["Maître","#ff6b6b",1000,9999]].map(([label,c,min,max])=>{
                  const isCurr=xp>=min&&xp<=max;
                  return <div key={label} style={{ display:"flex",alignItems:"center",gap:10,padding:"7px 10px",borderRadius:5,background:isCurr?`${c}10`:"rgba(0,0,0,0.2)",border:isCurr?`1px solid ${c}`:"1px solid rgba(0,255,224,0.04)" }}><div style={{ fontSize:13,fontWeight:700,color:c,minWidth:70 }}>{label}</div><div style={{ flex:1,height:3,background:"rgba(255,255,255,0.05)",borderRadius:2,overflow:"hidden" }}><div style={{ width:isCurr?`${Math.min(100,((xp-min)/(max-min))*100)}%`:xp>max?"100%":"0%",height:"100%",background:c,transition:"width 0.5s" }}/></div><div style={{ fontSize:9,color:"rgba(0,255,224,0.35)",minWidth:70,textAlign:"right" }}>{min}–{max} XP</div>{isCurr&&<div style={{ fontSize:9,color:c,fontWeight:700 }}>◀ TOI</div>}</div>;
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => getSession());
  if (!user) return <AuthScreen onLogin={u => setUser(u)} />;
  if (!isTrialActive(user)) return <ExpiredScreen user={user} onSubscribe={u => setUser(u)} onLogout={() => { clearSession(); setUser(null); }} />;
  return <MainApp user={user} onLogout={() => { clearSession(); setUser(null); }} />;
}
