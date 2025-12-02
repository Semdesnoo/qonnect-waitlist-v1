import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
  Sparkles, Briefcase, User, ArrowRight, CheckCircle, X, Heart, 
  MessageSquare, LayoutDashboard, Bell, Eye, Clock, Lock, 
  FileText, Brain, Search, Target, Users, Globe, Database, 
  ChevronDown, Key
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';

// --- Firebase Setup ---

// JOUW EIGEN CONFIGURATIE (Wordt nu ALTIJD gebruikt)
const firebaseConfig = {
  apiKey: "AIzaSyC6Kd6esHBb_NFgED4wtFMC178lwdqlOHw",
  authDomain: "qonnect-5b1fe.firebaseapp.com",
  projectId: "qonnect-5b1fe",
  storageBucket: "qonnect-5b1fe.firebasestorage.app",
  messagingSenderId: "1041933509818",
  appId: "1:1041933509818:web:95aefa470fd5f18e030e83",
  measurementId: "G-PCEYP2GXH3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// We gebruiken nu een vaste ID voor jouw eigen database.
// Dit voorkomt fouten met rare tekens in de ID.
const appId = 'qonnect-prod'; 

// --- Translations ---
const content = {
  nl: {
    nav: { about: "Over ons", process: "Proces", features: "Features", access: "Early Access" },
    hero: {
      tag: "The Future of Recruitment OS",
      titleStart: "STOP MET ZOEKEN", titleEnd: "BEGIN MET", highlight: "MATCHEN",
      subtitle: "Qonnect is geen vacaturebank, maar een intelligent besturingssysteem voor jouw carrière of bedrijf. Wij vervangen handmatig zoeken door AI-gestuurde matches op basis van DNA, vaardigheden en ambities.",
      roleCandidate: "Kandidaat", roleRecruiter: "Recruiter",
      placeholderCandidate: "jouw@email.nl", placeholderRecruiter: "werk@bedrijf.nl",
      joinBtn: "Join Qonnect", loading: "Even geduld...",
      successTitle: "Je staat op de lijst!", successSub: "We houden je op de hoogte.",
      socialProof: "AL 500+ INNOVATORS GINGEN JE VOOR"
    },
    about: {
      title: "Twee Werelden, Eén Systeem",
      candTitle: "Voor Kandidaten",
      candDesc: "Stop met eindeloos scrollen. Qonnect werkt als jouw persoonlijke AI-agent. Je uploadt simpelweg je CV, en ons systeem analyseert jouw unieke mix van ervaring en potentie.",
      candPoints: ["Automatische profiel generatie", "Swipe door banen (Tinder-stijl)", "Alleen matches met hoge score"],
      recTitle: "Voor Recruiters & ZZP",
      recDesc: "Waarom betalen voor een heel recruitment team? Qonnect automatiseert sourcing en screening. Plaats een vacature en laat AI de tekst optimaliseren.",
      recPoints: ["1 Recruiter doet het werk van 10", "Pre-screened talent in je feed", "Direct chatten bij een match"]
    },
    problem: {
      title: "HET SYSTEEM IS",
      titleBreak: "GEBROKEN",
      desc: "De huidige markt is inefficiënt. Kandidaten sturen honderden brieven zonder antwoord. Recruiters verdrinken in irrelevante reacties. Wij lossen dit op met data.",
      candTitle: "De Pijn van Kandidaten",
      candPoints: ["CV's vertellen niet je hele verhaal", "Motivatiebrieven schrijven die niemand leest", "Geen feedback na afwijzing"],
      recTitle: "De Pijn van Bedrijven",
      recPoints: ["Dure licenties voor tools die niet werken", "Uren kwijt aan 'sourcing' op LinkedIn", "Cultuur mismatch pas tijdens gesprek"]
    },
    steps: {
      title: "Hoe Qonnect Werkt",
      s1: { title: "Upload & Analyse", desc: "Sleep je CV in de app. Onze AI scant niet alleen op trefwoorden, maar begrijpt context." },
      s2: { title: "Profiel Creatie", desc: "Er ontstaat direct een rijk profiel met een prachtig dashboard. Jij past aan, AI leert." },
      s3: { title: "AI Matching", desc: "Ons algoritme zoekt 24/7 naar de perfecte match tussen vacature en profiel." },
      s4: { title: "Direct Contact", desc: "Is er een wederzijdse 'Like'? Dan opent de chat direct. Geen wachttijden." }
    },
    features: {
      dashboard: {
        title: "Jouw Command Center",
        desc: "In plaats van een inbox vol spam, krijg je een dashboard vol data. Zie wie je profiel bekijkt en hoe goed je in de markt ligt."
      },
      swipe: {
        tag: "Swipe Mode",
        title: "Solliciteren is nu leuk.",
        desc: "Geen saaie lijsten, maar kaarten met alle info die je nodig hebt."
      },
      chat: {
        tag: "Privacy First",
        title: "Geen Match? Geen Chat.",
        desc: "Wij beschermen je tijd. Recruiters kunnen je pas een bericht sturen als jij ook interesse hebt getoond. Dit houdt de kwaliteit hoog en de spam nul."
      }
    },
    footer: {
      title: "Klaar voor de Nieuwe Generatie?",
      desc: "Qonnect kost nauwelijks geld en bespaart je zeeën van tijd. Sluit je aan bij de beweging en ervaar hoe recruitment hoort te zijn.",
      btn: "Join Qonnect",
      privacy: "Privacy",
      terms: "Voorwaarden",
      contact: "Contact"
    },
    ui: {
      matches: "Matches",
      views: "Views",
      score: "Score",
      optimal: "Optimaal",
      recs: "AI Aanbevelingen",
      skip: "Overslaan",
      match: "Match",
      active: "Actief 2u geleden"
    }
  },
  en: {
    nav: { about: "About", process: "Process", features: "Features", access: "Early Access" },
    hero: {
      tag: "The Future of Recruitment OS",
      titleStart: "STOP SEARCHING", titleEnd: "START", highlight: "MATCHING",
      subtitle: "Qonnect is not a job board, but an intelligent operating system. We replace manual searching with AI-driven matching.",
      roleCandidate: "Candidate", roleRecruiter: "Recruiter",
      placeholderCandidate: "you@example.com", placeholderRecruiter: "work@company.com",
      joinBtn: "Join Qonnect", loading: "Loading...",
      successTitle: "You're on the list!", successSub: "We'll keep you posted.",
      socialProof: "JOINED BY 500+ INNOVATORS"
    },
    about: {
      title: "Two Worlds, One System",
      candTitle: "For Candidates",
      candDesc: "Stop endless scrolling. Qonnect acts as your personal AI agent. Simply upload your CV, and our system analyzes your unique mix of experience and potential.",
      candPoints: ["Automatic profile generation", "Swipe through jobs (Tinder-style)", "Only high-score matches"],
      recTitle: "For Recruiters & Freelancers",
      recDesc: "Why pay for an entire recruitment team? Qonnect automates sourcing and screening. Post a job and let AI optimize the text for maximum conversion.",
      recPoints: ["1 Recruiter does the work of 10", "Pre-screened talent in your feed", "Direct chat upon matching"]
    },
    problem: {
      title: "THE SYSTEM IS",
      titleBreak: "BROKEN",
      desc: "The current market is inefficient. Candidates send hundreds of letters without reply. Recruiters drown in irrelevant responses. We solve this with data.",
      candTitle: "Candidate Pain",
      candPoints: ["CVs don't tell your full story", "Writing cover letters nobody reads", "No feedback after rejection"],
      recTitle: "Company Pain",
      recPoints: ["Expensive licenses for tools that don't work", "Hours spent 'sourcing' on LinkedIn", "Culture mismatch found only during interview"]
    },
    steps: {
      title: "How Qonnect Works",
      s1: { title: "Upload & Analyze", desc: "Drag your CV into the app. Our AI scans not just for keywords, but understands context." },
      s2: { title: "Profile Creation", desc: "A rich profile with a beautiful dashboard is created instantly. You tweak, AI learns." },
      s3: { title: "AI Matching", desc: "Our algorithm searches 24/7 for the perfect match between job and profile." },
      s4: { title: "Direct Contact", desc: "Is there a mutual 'Like'? Then the chat opens immediately. No waiting times." }
    },
    features: {
      dashboard: {
        title: "Your Command Center",
        desc: "Instead of an inbox full of spam, you get a dashboard full of data. See who views your profile and how well you fit in the market."
      },
      swipe: {
        tag: "Swipe Mode",
        title: "Applying is fun now.",
        desc: "No boring lists, but cards with all the info you need."
      },
      chat: {
        tag: "Privacy First",
        title: "No Match? No Chat.",
        desc: "We protect your time. Recruiters can only message you if you've shown interest too. This keeps quality high and spam zero."
      }
    },
    footer: {
      title: "Ready for the New Generation?",
      desc: "Qonnect costs next to nothing and saves you oceans of time. Join the movement and experience recruitment as it should be.",
      btn: "Join Qonnect",
      privacy: "Privacy",
      terms: "Terms",
      contact: "Contact"
    },
    ui: {
      matches: "Matches",
      views: "Views",
      score: "Score",
      optimal: "Optimal",
      recs: "AI Recommendations",
      skip: "Skip",
      match: "Match",
      active: "Active 2h ago"
    }
  }
};

// --- Styles Injection for Fonts ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; }
    h1, h2, h3, .font-heading { font-family: 'Space Grotesk', sans-serif; }
    .glass-card { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.5); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05); }
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }
  `}</style>
);

// --- Admin Component ---
const AdminView = ({ onClose }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  
  const ADMIN_PASS = 'Qonnect2025!';

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASS) {
      setIsAuthenticated(true);
      setError('');
      fetchData();
    } else {
      setError('Verkeerd wachtwoord');
    }
  };

  const fetchData = () => {
    setLoading(true);
    // Use the strict appId 'qonnect-prod'
    const q = query(
      collection(db, 'artifacts', appId, 'public', 'data', 'waitlist_entries'),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date()
      }));
      setEntries(data);
      setLoading(false);
    }, (err) => {
        console.error("Admin fetch error:", err);
        setLoading(false);
        if (err.code === 'permission-denied') {
            setError("Geen toegang. Heb je 'allow read, write: if true;' ingesteld in je Firebase Console Rules?");
        }
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="fixed bottom-0 left-0 w-full h-[60vh] bg-white border-t border-slate-200 shadow-2xl z-[100] flex flex-col rounded-t-3xl overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3"><Database className="w-5 h-5 text-indigo-600" /><h3 className="font-bold text-slate-900">Admin Database</h3></div>
        <button onClick={onClose}><ChevronDown className="w-5 h-5 text-slate-600" /></button>
      </div>
      <div className="flex-1 overflow-auto bg-white p-6">
        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center h-full max-w-sm mx-auto">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4"><Key className="w-6 h-6 text-slate-400" /></div>
            <h4 className="text-xl font-bold text-slate-900 mb-2">Beveiligde Omgeving</h4>
            <p className="text-slate-500 text-sm text-center mb-6">Voer de verificatiecode in.</p>
            <form onSubmit={handleLogin} className="w-full">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Code" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 mb-3 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500" />
              {error && <p className="text-red-500 text-xs mb-3 text-center">{error}</p>}
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors">Login</button>
            </form>
          </div>
        ) : (
          <>
            {error ? (
                <div className="flex flex-col items-center justify-center h-full text-red-500 text-center p-4">
                    <p className="font-bold">Database Toegang Geweigerd</p>
                    <p className="text-sm mt-2">{error}</p>
                </div>
            ) : entries.length === 0 && !loading ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <p>Nog geen inschrijvingen ontvangen.</p>
                    <p className="text-xs mt-2">Test het formulier hierboven om data te genereren.</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="p-3">Email</th><th className="p-3">Rol</th><th className="p-3">Datum</th><th className="p-3">Taal</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">{entries.map(e => (<tr key={e.id} className="hover:bg-slate-50"><td className="p-3 font-medium">{e.email}</td><td className="p-3"><span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full text-xs font-bold uppercase">{e.role}</span></td><td className="p-3 text-slate-500 text-xs">{e.createdAt.toLocaleString()}</td><td className="p-3 text-slate-400 text-xs uppercase">{e.locale || '-'}</td></tr>))}</tbody></table>
                </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

// 1. Dashboard Visual
const DashboardMockup = ({ t }) => (
  <div className="bg-white rounded-xl overflow-hidden border border-slate-200 w-full h-full flex flex-col relative group shadow-xl">
    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20"></div>
    <div className="border-b border-slate-100 p-4 flex justify-between items-center bg-white/90 backdrop-blur-md sticky top-0 z-10">
      <div><h3 className="text-sm font-bold text-slate-800 font-heading tracking-wide">QONNECT OS</h3><p className="text-slate-400 text-[10px] font-mono tracking-wider">V.2.4 • LIVE</p></div>
      <div className="flex gap-3 items-center"><div className="relative"><Bell className="w-4 h-4 text-slate-400" /><span className="absolute top-0 right-0 w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-sm"></span></div><div className="h-7 w-7 bg-gradient-to-b from-slate-100 to-slate-200 rounded-full flex items-center justify-center text-slate-600 text-xs border border-slate-200">E</div></div>
    </div>
    <div className="p-5 flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50">
       <div className="grid grid-cols-3 gap-3 mb-6">
          {[{ label: t?.matches, val: '24', color: 'text-slate-800', sub: '+12%', subColor: 'text-emerald-600' }, { label: t?.views, val: '156', color: 'text-slate-800', sub: '+28%', subColor: 'text-emerald-600' }, { label: t?.score, val: '99%', color: 'text-indigo-600', sub: t?.optimal, subColor: 'text-slate-500' }].map((stat, i) => (
            <div key={i} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-all">
               <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">{stat.label}</div>
               <div className={`text-lg font-heading font-bold ${stat.color}`}>{stat.val}</div>
               <div className={`text-[9px] font-mono mt-1 ${stat.subColor}`}>{stat.sub}</div>
            </div>
          ))}
       </div>
      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Sparkles className="w-3 h-3 text-indigo-500" /> {t?.recs}</h4>
      <div className="space-y-3">
        {/* Simplified Cards */}
        <div className="bg-white p-3 rounded-lg border border-slate-100 flex gap-3 items-center hover:border-indigo-500/30 hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-indigo-50 rounded-md flex items-center justify-center text-indigo-600 font-bold border border-indigo-100 text-xs">TC</div>
          <div className="flex-1 min-w-0"><div className="flex justify-between items-center mb-0.5"><h5 className="font-bold text-slate-800 text-xs truncate">Frontend Lead</h5><div className="flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100"><span className="text-emerald-600 text-[9px] font-bold font-mono">98%</span></div></div><p className="text-slate-500 text-[10px] truncate font-mono">TechCorp • Amsterdam</p></div>
        </div>
      </div>
    </div>
  </div>
);

// 2. Swipe Feature
const SwipeFeature = ({ t }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-10, 10]);
  const bg = useTransform(x, [-150, 0, 150], ["rgba(252, 165, 165, 0.3)", "rgba(255, 255, 255, 1)", "rgba(134, 239, 172, 0.3)"]);
  const border = useTransform(x, [-150, 0, 150], ["rgba(239, 68, 68, 0.5)", "rgba(226, 232, 240, 1)", "rgba(34, 197, 94, 0.5)"]);

  return (
    <div className="relative w-full h-full min-h-[350px] flex items-center justify-center overflow-visible">
      <div className="absolute w-56 h-80 bg-slate-100 rounded-2xl transform rotate-6 scale-90 border border-slate-200 shadow-sm"></div>
      <div className="absolute w-56 h-80 bg-slate-100 rounded-2xl transform -rotate-6 scale-90 border border-slate-200 shadow-sm"></div>
      <motion.div style={{ x, rotate, backgroundColor: bg, borderColor: border }} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.7} whileTap={{ cursor: 'grabbing' }} className="relative w-64 h-96 rounded-2xl shadow-xl cursor-grab border-2 overflow-hidden flex flex-col z-20 group bg-white">
        <div className="h-1/2 bg-slate-50 relative p-4 flex flex-col justify-end group-hover:opacity-95 transition-opacity">
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent z-10"></div>
           <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100"></div>
           <div className="absolute top-4 left-4 z-20"><span className="bg-white/80 backdrop-blur-md border border-white/40 px-2 py-1 rounded text-slate-800 text-[10px] font-bold font-mono tracking-wide shadow-sm">SENIOR UX LEAD</span></div>
        </div>
        <div className="h-1/2 bg-white p-5 flex flex-col justify-between border-t border-slate-100">
           <div>
             <div className="flex justify-between items-start mb-2"><h4 className="font-heading font-bold text-slate-800 text-lg leading-tight">Creative Agency</h4><Sparkles className="w-4 h-4 text-emerald-500" /></div>
             <p className="text-slate-500 text-[10px] mb-4 font-mono flex items-center gap-1"><Clock className="w-3 h-3"/> {t?.active}</p>
             <div className="flex flex-wrap gap-1.5 mb-2">{['Figma', 'Strategy', 'Remote'].map(tag => (<span key={tag} className="bg-slate-50 border border-slate-200 text-slate-600 text-[10px] px-2 py-1 rounded font-medium">{tag}</span>))}</div>
           </div>
           <div className="flex justify-center gap-8 mt-2 pt-4 border-t border-slate-50">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 border border-red-100 transition-transform hover:scale-110 shadow-sm"><X className="w-5 h-5" /></div>
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-100 transition-transform hover:scale-110 shadow-sm"><Heart className="w-5 h-5 fill-current" /></div>
           </div>
        </div>
      </motion.div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-12 text-slate-400 text-[10px] font-mono pointer-events-none uppercase tracking-widest"><span>{t?.skip}</span><span>{t?.match}</span></div>
    </div>
  );
};

export default function WaitlistApp() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('candidate'); 
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lang, setLang] = useState('nl');
  const [showAdmin, setShowAdmin] = useState(false);
  const [formError, setFormError] = useState('');

  const t = content[lang];

  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (e) { 
        console.error("Auth error", e);
        setFormError("Authenticatie fout (Controleer of 'Anonymous Auth' aan staat in Firebase Console).");
      }
    };
    initAuth();
    onAuthStateChanged(auth, setUser);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!email) { setFormError("Vul een geldig e-mailadres in."); return; }
    if (!user) { setFormError("Verbinding met database mislukt. Controleer internet of Firebase Auth instellingen."); return; }

    setLoading(true);
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'waitlist_entries'), {
        email, role, userId: user.uid, createdAt: serverTimestamp(), locale: lang
      });
      setSubmitted(true);
      setEmail('');
    } catch (err) { 
      console.error(err);
      if (err.code === 'permission-denied') {
        setFormError("⚠️ TOEGANG GEWEIGERD: Zet in Firebase Console > Firestore > Rules: 'allow read, write: if true;'");
      } else {
        setFormError("Fout bij opslaan: " + err.message);
      }
    } finally { setLoading(false); }
  };

  const toggleLang = () => setLang(prev => prev === 'nl' ? 'en' : 'nl');

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-indigo-100 overflow-x-hidden">
      <GlobalStyles />
      
      {/* Backgrounds */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-indigo-200/20 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-purple-200/20 rounded-full blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-2xl">
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-full px-5 py-3 flex justify-between items-center shadow-lg ring-1 ring-black/5">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shadow-md"><Sparkles className="w-4 h-4 text-white" /></div>
             <span className="font-heading font-bold text-slate-900 text-lg">QONNECT</span>
           </div>
           <div className="flex items-center gap-2">
             <button onClick={toggleLang} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 border border-slate-200"><Globe className="w-3 h-3" /> {lang.toUpperCase()}</button>
             <button onClick={() => document.getElementById('waitlist').scrollIntoView({ behavior: 'smooth' })} className="bg-slate-900 text-white px-4 py-2 rounded-full text-[11px] font-bold hover:bg-slate-800 transition-colors shadow-lg hidden sm:block">{t.nav.access}</button>
           </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative pt-44 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-10 shadow-sm">
           <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
           {t.hero.tag}
        </motion.div>
        <h1 className="text-6xl md:text-9xl font-heading font-bold tracking-tighter text-slate-900 mb-8 leading-[0.9]">
          {t.hero.titleStart}<br /> {t.hero.titleEnd} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{t.hero.highlight}</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-12 font-light">{t.hero.subtitle}</p>

        {/* Form Container */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-2 rounded-2xl w-full max-w-md mx-auto relative group bg-white shadow-2xl z-50">
           <div className="relative bg-slate-100 rounded-xl p-1 mb-4 flex">
             <button onClick={() => setRole('candidate')} className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all ${role === 'candidate' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>{t.hero.roleCandidate}</button>
             <button onClick={() => setRole('recruiter')} className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all ${role === 'recruiter' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>{t.hero.roleRecruiter}</button>
           </div>
           
           <div id="waitlist" className="relative p-2">
              {submitted ? (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="text-slate-900 font-bold text-lg mb-1">{t.hero.successTitle}</h3>
                    <p className="text-slate-500 text-sm">{t.hero.successSub}</p>
                 </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                   <div className="flex gap-2">
                     <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={role === 'candidate' ? t.hero.placeholderCandidate : t.hero.placeholderRecruiter} className="flex-1 bg-white border border-slate-200 rounded-lg px-4 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 h-12" />
                     <button disabled={loading} className="bg-slate-900 text-white px-6 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors disabled:opacity-50 h-12 shadow-lg">{loading ? t.hero.loading : t.hero.joinBtn}</button>
                   </div>
                   {formError && <div className="text-red-500 text-xs font-medium text-center bg-red-50 p-2 rounded border border-red-100">⚠️ {formError}</div>}
                </form>
              )}
           </div>
        </motion.div>
      </header>

      {/* About Section */}
      <section id="about" className="py-24 relative border-t border-slate-200 bg-white">
         <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-10">{t.about.title}</h2>
            <div className="grid md:grid-cols-2 gap-12 text-left">
               <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 mb-6 shadow-sm border border-slate-100"><User className="w-6 h-6" /></div>
                  <h3 className="text-2xl font-heading font-bold text-slate-900 mb-3">{t.about.candTitle}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">{t.about.candDesc}</p>
                  <ul className="text-slate-500 text-xs space-y-2 font-mono">{t.about.candPoints.map((p, i) => (<li key={i} className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-indigo-600"/> {p}</li>))}</ul>
               </div>
               <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-purple-600 mb-6 shadow-sm border border-slate-100"><Target className="w-6 h-6" /></div>
                  <h3 className="text-2xl font-heading font-bold text-slate-900 mb-3">{t.about.recTitle}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">{t.about.recDesc}</p>
                  <ul className="text-slate-500 text-xs space-y-2 font-mono">{t.about.recPoints.map((p, i) => (<li key={i} className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-purple-600"/> {p}</li>))}</ul>
               </div>
            </div>
         </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-32 relative border-t border-slate-200 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div><h2 className="text-4xl md:text-6xl font-heading font-bold mb-4 text-slate-900">{t.problem.title}<br/>{t.problem.titleBreak}</h2><div className="h-1 w-20 bg-indigo-600 rounded-full"></div></div>
            <p className="text-slate-600 max-w-sm text-sm leading-relaxed">{t.problem.desc}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
             <div className="bg-white border border-slate-100 rounded-3xl p-10 hover:shadow-lg transition-all">
                <div className="flex items-center gap-4 mb-8"><div className="p-3 rounded-xl text-indigo-600 bg-indigo-50"><Users className="w-6 h-6" /></div><h3 className="text-2xl font-heading font-bold text-slate-900">{t.problem.candTitle}</h3></div>
                <ul className="space-y-4">{t.problem.candPoints.map((pt, j) => (<li key={j} className="flex items-center gap-4 text-slate-500 text-sm"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>{pt}</li>))}</ul>
             </div>
             <div className="bg-white border border-slate-100 rounded-3xl p-10 hover:shadow-lg transition-all">
                <div className="flex items-center gap-4 mb-8"><div className="p-3 rounded-xl text-purple-600 bg-purple-50"><Briefcase className="w-6 h-6" /></div><h3 className="text-2xl font-heading font-bold text-slate-900">{t.problem.recTitle}</h3></div>
                <ul className="space-y-4">{t.problem.recPoints.map((pt, j) => (<li key={j} className="flex items-center gap-4 text-slate-500 text-sm"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>{pt}</li>))}</ul>
             </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section id="how" className="py-32 relative border-t border-slate-200 bg-white">
         <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-16">{t.steps.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               {[{ step: "01", ...t.steps.s1, icon: FileText }, { step: "02", ...t.steps.s2, icon: Brain }, { step: "03", ...t.steps.s3, icon: Search }, { step: "04", ...t.steps.s4, icon: MessageSquare }].map((item, i) => (
                  <div key={i} className="relative group pt-6">
                     <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-slate-200 to-transparent mb-6"></div>
                     <div className="flex justify-between items-start mb-6"><span className="text-4xl font-heading font-bold text-slate-100">{item.step}</span><item.icon className="w-5 h-5 text-slate-400" /></div>
                     <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                     <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 max-w-7xl mx-auto px-6 border-t border-slate-200">
         <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto">
            <div className="md:col-span-2 md:row-span-2 bg-slate-50 border border-slate-200 rounded-3xl p-1 relative overflow-hidden group hover:border-indigo-100 transition-all">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-200/50 blur-[100px] rounded-full pointer-events-none group-hover:bg-indigo-300/50 transition-all duration-700"></div>
               <div className="relative z-10 h-full bg-white/50 backdrop-blur-3xl rounded-[20px] p-8 flex flex-col">
                  <div className="mb-8 flex items-end justify-between"><div><h3 className="text-3xl font-heading font-bold text-slate-900 mb-2">{t.features.dashboard.title}</h3><p className="text-slate-500 text-sm max-w-md">{t.features.dashboard.desc}</p></div><LayoutDashboard className="w-8 h-8 text-indigo-200" /></div>
                  <div className="flex-1 relative rounded-xl overflow-hidden border border-slate-200 shadow-2xl bg-white"><DashboardMockup t={t.ui} /></div>
               </div>
            </div>
            <div className="md:row-span-2 bg-slate-50 border border-slate-200 rounded-3xl p-1 relative overflow-hidden group hover:border-emerald-100 transition-all">
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="relative h-full bg-white/80 backdrop-blur-xl rounded-[20px] p-6 flex flex-col items-center">
                  <div className="text-center mb-8"><span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest border border-emerald-100 px-2 py-1 rounded-full bg-emerald-50 mb-3 inline-block">{t.features.swipe.tag}</span><h3 className="text-xl font-heading font-bold text-slate-900">{t.features.swipe.title}</h3><p className="text-slate-500 text-xs mt-2 px-2">{t.features.swipe.desc}</p></div>
                  <div className="flex-1 w-full relative"><SwipeFeature t={t.ui} /></div>
               </div>
            </div>
            <div className="md:col-span-3 bg-slate-900 border border-slate-900 rounded-3xl p-1 relative overflow-hidden">
               <div className="relative h-full bg-slate-900 rounded-[20px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10">
                  <div className="max-w-xl"><div className="flex items-center gap-3 mb-4"><Lock className="w-5 h-5 text-emerald-400" /><span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">{t.features.chat.tag}</span></div><h3 className="text-3xl font-heading font-bold text-white mb-4">{t.features.chat.title}</h3><p className="text-slate-400 text-sm leading-relaxed">{t.features.chat.desc}</p></div>
                  <div className="flex items-center gap-6"><div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center"><div className="w-8 h-8 rounded-full bg-indigo-500 border border-indigo-400 flex items-center justify-center text-xs text-white font-bold">You</div></div><div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-100"></div><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-200"></div></div><div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center"><div className="w-8 h-8 rounded-full bg-purple-500 border border-purple-400 flex items-center justify-center text-xs text-white font-bold">Work</div></div></div>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-200 bg-white text-center relative z-10">
        <div className="max-w-4xl mx-auto px-6">
           <h2 className="text-4xl font-heading font-bold text-slate-900 mb-8">{t.footer.title}</h2>
           <p className="text-slate-500 mb-8 max-w-lg mx-auto text-sm">{t.footer.desc}</p>
           <div className="flex justify-center gap-4 mb-12">
             <button onClick={() => document.getElementById('waitlist').scrollIntoView({ behavior: 'smooth' })} className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-sm uppercase shadow-xl">{t.footer.btn}</button>
             <button onClick={() => setShowAdmin(!showAdmin)} className="bg-white border border-slate-200 text-slate-500 px-6 py-4 rounded-full font-bold text-xs uppercase hover:bg-slate-50">Admin Login</button>
           </div>
           <div className="flex justify-center gap-8 text-[10px] text-slate-400 font-mono uppercase tracking-widest"><a href="#" className="hover:text-indigo-600 transition-colors">{t.footer.privacy}</a><a href="#" className="hover:text-indigo-600 transition-colors">{t.footer.terms}</a><a href="#" className="hover:text-indigo-600 transition-colors">{t.footer.contact}</a></div>
           <p className="text-slate-300 text-[10px] mt-8 font-mono">© 2025 QONNECT SYSTEMS INC.</p>
        </div>
      </footer>
      
      <AnimatePresence>{showAdmin && <AdminView onClose={() => setShowAdmin(false)} />}</AnimatePresence>
    </div>
  );
}
