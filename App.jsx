import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
// ✅ FIX: Alle iconen (inclusief Check, Plus en Mail) zijn nu correct geïmporteerd
import { 
  Sparkles, Briefcase, User, ArrowRight, CheckCircle, X, Heart, 
  MessageSquare, LayoutDashboard, Bell, Eye, Clock, Lock, 
  FileText, Brain, Search, Target, Users, Globe, Database, 
  ChevronDown, Key, Shield, Zap,
  RefreshCw, Route, Archive, KeyRound, Link2, BarChart3, CloudLightning, Smartphone, ShieldCheck, Map, CreditCard,
  ScanLine, PenTool, Layers, Check, Wand2, Plus, Mail
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';

// --- Gemini API Setup ---
const apiKey = ""; // Wordt automatisch ingevuld

// --- Firebase Setup ---
const userConfig = {
  apiKey: "AIzaSyC6Kd6esHBb_NFgED4wtFMC178lwdqlOHw",
  authDomain: "qonnect-5b1fe.firebaseapp.com",
  projectId: "qonnect-5b1fe",
  storageBucket: "qonnect-5b1fe.firebasestorage.app",
  messagingSenderId: "1041933509818",
  appId: "1:1041933509818:web:95aefa470fd5f18e030e83",
  measurementId: "G-PCEYP2GXH3"
};

const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : userConfig;
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const isPreview = typeof __app_id !== 'undefined';
const rawAppId = isPreview ? __app_id : 'qonnect-live';
const appId = rawAppId.replace(/[\/.]/g, '_');

// --- Translations ---
const content = {
  nl: {
    nav: { about: "Over ons", process: "Proces", features: "Features", ai: "AI Demo", pricing: "Prijzen", faq: "FAQ", access: "Early Access" },
    hero: {
      tag: "The Future of Recruitment OS",
      titleStart: "STOP MET ZOEKEN", 
      titleEnd: "BEGIN MET", 
      highlight: "MATCHEN",
      subtitle: "Qonnect laat bedrijven en kandidaten elkaar vinden via slimme AI-matching in plaats van zoeken. Voor kandidaten betekent dit: kansen die bij je passen. Voor bedrijven: direct toegang tot relevant talent.",
      roleCandidate: "Kandidaat", roleRecruiter: "Recruiter",
      placeholderCandidate: "jouw@email.nl", placeholderRecruiter: "werk@bedrijf.nl",
      joinBtn: "Join Qonnect", loading: "Laden...",
      successTitle: "Aanmelding geslaagd!", 
      successSub: "We houden je op de hoogte.",
      launchDeal: "🎉 Launch Deal: 1e maand gratis!"
    },
    aiDemo: {
      title: "Ervaar de Magie van AI ✨",
      subtitle: "Probeer onze engine nu direct uit. Geen account nodig.",
      recruiterTab: "Vacature Generator",
      candidateTab: "CV Profiel Maker", 
      labelRecruiter: "Functietitel (bijv. Marketing Manager)",
      labelCandidate: "Plak hier tekst uit je CV (bijv. je werkervaring)", 
      placeholderRecruiter: "Bijv. Senior Sales met 5 jaar ervaring...",
      placeholderCandidate: "Plak hier je ervaring of skills...", 
      btn: "Genereer Profiel ✨", 
      resultTitle: "Jouw AI Resultaat:",
      placeholderResult: "Het resultaat verschijnt hier..."
    },
    pricing: {
      title: "Transparante Prijzen",
      subtitle: "Geen verborgen kosten. Kies het plan dat bij jouw groei past.",
      offer: "🎉 Launch Deal: Schrijf je nu in en krijg de eerste maand volledig gratis!",
      monthly: "Maandelijks",
      yearly: "Jaarlijks",
      save: "Bespaar 30%",
      candidate: {
        title: "Voor Kandidaten",
        price: "0",
        period: "voor altijd",
        desc: "De arbeidsmarkt is krap en talent is schaars. Wij geloven dat de zoektocht naar een droombaan geen drempels mag hebben.",
        features: ["Onbeperkt swipen", "AI Profiel Analyse", "Direct chatten met bedrijven", "Geen verborgen kosten"]
      },
      recruiter: {
        title: "Voor Bedrijven",
        plans: [
          {
            name: "Starter",
            price: 49, 
            desc: "Voor kleine bedrijven / 1 recruiter",
            features: ["3 Vacatures plaatsen", "AI Matching", "Direct chatten", "Basis bedrijfsprofiel"],
            highlight: false
          },
          {
            name: "Professional",
            price: 149, 
            desc: "Voor HR-bureaus / grotere bedrijven",
            features: ["15 Vacatures plaatsen", "Uitgebreide AI-Talentsuggesties", "Geavanceerde zoekfilters", "Headhunt-functie", "Toegang tot CV-data"],
            highlight: true,
            tag: "Meest Gekozen"
          },
          {
            name: "Enterprise",
            price: 399, 
            desc: "Voor corporates en headhunting bureaus",
            features: ["Onbeperkt vacatures & matches", "Teamaccounts & Dedicated Support", "Marktdata & Inzichten (Salary/Skills)", "Custom Employer Branding"],
            highlight: false
          }
        ]
      }
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
    agents: {
      title: "KLAAR MET ONEINDIG ZOEKEN NAAR DE BESTE KANDIDAAT?",
      subtitle: "Geen onnodige dure leads meer kopen of berichtjes sturen naar ongeïnteresseerde kandidaten via LinkedIn. Qonnect is de app die wél de perfecte match biedt!",
      headers: ["PIJNPUNT", "QONNECT AGENT", "ALGORITMISCHE OPLOSSING"],
      list: [
        { pain: "Slechte Matches", agent: "Deep Match Agent", icon: Brain, solution: "Analyseert kandidaten op 50+ datapunten (cultuur, skills, potentie) voor de perfecte fit." },
        { pain: "Eindeloos Sourcing", agent: "Sniper Sourcing Agent", icon: Target, solution: "Scant continu het web om passieve kandidaten te vinden die precies passen bij jouw vacature." },
        { pain: "Bias & Discriminatie", agent: "Fair Play Agent", icon: Shield, solution: "Garandeert integriteit door profielen te anonimiseren en te screenen op onbewuste vooroordelen." },
        { pain: "Trage Communicatie", agent: "Coordinator Agent", icon: Zap, solution: "Automatiseert follow-ups, plant interviews en houdt kandidaten warm zonder menselijke tussenkomst." }
      ]
    },
    appFunctions: {
      title: "De Qonnect Workflow",
      subtitle: "Twee krachtige interfaces, één naadloos proces.",
      candidate: {
        title: "Kandidaat Interface",
        features: [
          { title: "AI CV Analyse", desc: "Upload je CV en onze AI analyseert direct je skills. Er ontstaat automatisch een prachtig profiel en dashboard.", icon: ScanLine },
          { title: "Swipe & Match", desc: "Geen saaie lijsten. Swipe door vacatures zoals op Tinder. Leuk, snel en effectief.", icon: Heart },
          { title: "Direct Chatten", desc: "Heb je een match? Dan opent de chat direct. Geen wachttijden of tussenpersonen.", icon: MessageSquare }
        ]
      },
      recruiter: {
        title: "Recruiter Interface",
        features: [
          { title: "AI Vacature Optimalisatie", desc: "Plaats een vacature en laat onze AI de tekst herschrijven voor maximale conversie en vindbaarheid.", icon: PenTool },
          { title: "De Perfecte Match", desc: "Ons algoritme koppelt jouw vacature direct aan de juiste kandidaten. Geen dure programma's meer nodig.", icon: Layers },
          { title: "1 Recruiter = 10", desc: "Bespaar tijd en kosten. Eén persoon doet nu het werk van een heel team dankzij onze automatisering.", icon: Users }
        ]
      }
    },
    modernFeatures: {
      title: "Functies gebouwd voor jouw carrière",
      subtitle: "Van het eerste contact tot het tekenen van het contract: elk detail is ontworpen voor controle en inzicht.",
      leftCards: [
        { 
          icon: Route, 
          color: "text-purple-600 bg-purple-50",
          title: "Op Maat Gemaakte Matches", 
          desc: "Deel je voorkeuren en wij ontwerpen flexibele matches die zich aanpassen aan jouw tempo, salariswens en cultuur.",
          aiTag: "AI Suggesties"
        },
        { 
          icon: Bell, 
          color: "text-blue-600 bg-blue-50",
          title: "Live Updates", 
          desc: "Ontvang real-time meldingen over sollicitaties, profielviews en berichten zodat je nooit een kans mist.",
          status: "Live status"
        },
        { 
          icon: ShieldCheck, 
          color: "text-emerald-600 bg-emerald-50",
          title: "Geverifieerde Experts", 
          desc: "Werk alleen samen met gescreende recruiters en bedrijven, ondersteund door duizenden reviews.",
          rating: "4.9 score"
        },
        { 
          icon: CreditCard, 
          color: "text-pink-600 bg-pink-50",
          title: "Transparante Salarissen", 
          desc: "Geen verrassingen achteraf. Zie direct salarisranges, secundaire voorwaarden en budgetten.",
          policy: "Geen verborgen fees"
        }
      ],
      rightCard: {
        tag: "Altijd up-to-date",
        title: "Jouw Persoonlijke Dashboard",
        desc: "In één oogopslag inzicht in je matches, views en sollicitaties. Geen inbox vol spam, maar data die voor je werkt.",
        cta: "Zie hoe het werkt"
      }
    },
    steps: {
      title: "Hoe Qonnect Werkt",
      s1: { title: "Upload & Analyse", desc: "Sleep je CV in de app. Onze AI scant niet alleen op trefwoorden, maar begrijpt context." },
      s2: { title: "Profiel Creatie", desc: "Er ontstaat direct een rijk profiel met een prachtig dashboard. Jij past aan, AI leert." },
      s3: { title: "AI Matching", desc: "Ons algoritme zoekt 24/7 naar de perfecte match tussen vacature en profiel." },
      s4: { title: "Direct Contact", desc: "Is er een wederzijdse 'Like'? Dan opent de chat direct. Geen wachttijden." }
    },
    faq: {
      title: "Veelgestelde Vragen",
      items: [
        { 
          q: "Is Qonnect echt 100% gratis voor kandidaten?", 
          a: "Ja, absoluut. In de huidige arbeidsmarkt is talent goud waard. Wij vinden dat jij niet hoeft te betalen om gevonden te worden. Je krijgt gratis toegang tot alle premium features: AI-analyse van je CV, onbeperkt swipen en direct chatten met CEO's en recruiters." 
        },
        { 
          q: "Hoe garandeert Qonnect mijn privacy tijdens het zoeken?", 
          a: "Jouw profiel is standaard geanonimiseerd. Recruiters zien wel je skills, 'culture fit' score en ervaring, maar niet je naam, foto of huidige werkgever. Pas als jij een vacature 'liket' én er is een match, worden je gegevens zichtbaar. Zo zoek je veilig en discreet." 
        },
        { 
          q: "Hoe verschilt de AI-matching van een normale zoekbalk?", 
          a: "Traditionele sites zoeken op trefwoorden. Onze AI begrijpt context. Hij ziet dat een 'Marketeer' die 'Python' kent, misschien perfect is voor 'Growth Hacking', zelfs als dat woord niet in je CV staat. We matchen op DNA, ambitie en potentie, niet alleen op steekwoorden." 
        },
        { 
          q: "Ik ben ZZP'er / Freelancer, is dit voor mij?", 
          a: "Zeker! Qonnect heeft een speciale 'Gig Mode'. Hierin kun je swipen door tijdelijke opdrachten en projecten. Het systeem filtert automatisch op uurtarief en beschikbaarheid, zodat je geen tijd verspilt aan onderhandelingen over basisvoorwaarden." 
        },
        { 
          q: "Wanneer kan ik de app downloaden?", 
          a: "We zitten momenteel in een exclusieve 'Private Beta'. Door je hierboven in te schrijven op de wachtlijst, claim je jouw plek. Zodra we de volgende groep toelaten (binnenkort!), krijg je direct een uitnodiging in je mail." 
        }
      ]
    },
    footer: {
      title: "Klaar voor de Nieuwe Generatie?",
      desc: "Sluit je aan bij de beweging en ervaar hoe recruitment hoort te zijn.",
      btn: "Join Qonnect", privacy: "Privacy", terms: "Voorwaarden", contact: "Contact"
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
    nav: { about: "About", process: "Process", features: "Features", ai: "AI Demo", pricing: "Pricing", faq: "FAQ", access: "Early Access" },
    hero: {
      tag: "The Future of Recruitment OS",
      titleStart: "STOP SEARCHING", titleEnd: "START", highlight: "MATCHING",
      subtitle: "Qonnect lets companies and candidates find each other via smart AI matching instead of searching. For candidates: opportunities that fit. For companies: direct access to relevant talent.",
      roleCandidate: "Candidate", roleRecruiter: "Recruiter",
      placeholderCandidate: "you@example.com", placeholderRecruiter: "work@company.com",
      joinBtn: "Join Qonnect", loading: "Loading...",
      successTitle: "Registration Successful!", 
      successSub: "We'll keep you posted.",
      launchDeal: "🎉 Launch Deal: 1st month free!"
    },
    aiDemo: {
      title: "Experience the Magic of AI ✨",
      subtitle: "Try our engine right now. No account needed.",
      recruiterTab: "Job Generator",
      candidateTab: "CV Profile Maker",
      labelRecruiter: "Job Title (e.g. Marketing Manager)",
      labelCandidate: "Paste your CV text here",
      placeholderRecruiter: "E.g. Senior Sales with 5y experience...",
      placeholderCandidate: "Paste your experience or skills here...",
      btn: "Generate Profile ✨",
      resultTitle: "Your AI Result:",
      placeholderResult: "Result will appear here..."
    },
    pricing: {
      title: "Transparent Pricing",
      subtitle: "No hidden fees. Choose the plan that fits your growth.",
      offer: "🎉 Launch Deal: Join the waitlist now and get the first month free!",
      monthly: "Monthly",
      yearly: "Yearly",
      save: "Save 30%",
      candidate: {
        title: "For Candidates",
        price: "0",
        period: "forever",
        desc: "In today's tight labor market, employees are gold. We believe access to your dream job should have zero barriers.",
        features: ["Unlimited swiping", "AI Profile Analysis", "Direct chat with companies", "No hidden costs"]
      },
      recruiter: {
        title: "For Companies",
        plans: [
          {
            name: "Starter", price: 49, desc: "Small businesses / 1 recruiter",
            features: ["Post 3 jobs", "AI Matching", "Direct chat", "Basic company profile"], highlight: false
          },
          {
            name: "Professional", price: 149, desc: "HR agencies / larger companies",
            features: ["Post 15 jobs", "Extensive AI Talent Suggestions", "Advanced filters", "Headhunt feature", "CV data access"], highlight: true, tag: "Most Popular"
          },
          {
            name: "Enterprise", price: 399, desc: "Corporates & Headhunters",
            features: ["Unlimited jobs & matches", "Team accounts & Dedicated Support", "Market Data & Insights", "Custom Employer Branding"], highlight: false
          }
        ]
      }
    },
    about: {
      title: "Two Worlds, One System", candTitle: "For Candidates", candDesc: "Stop endless scrolling. Qonnect acts as your personal AI agent. Simply upload your CV, and our system analyzes your unique mix of experience and potential.", candPoints: ["Automatic profile generation", "Swipe through jobs (Tinder-style)", "Only high-score matches"], recTitle: "For Recruiters & Freelancers", recDesc: "Why pay for an entire recruitment team? Qonnect automates sourcing and screening. Post a job and let AI optimize the text for maximum conversion.", recPoints: ["1 Recruiter does the work of 10", "Pre-screened talent in your feed", "Direct chat upon matching"]
    },
    agents: {
      title: "DONE WITH ENDLESSLY SEARCHING FOR THE BEST CANDIDATE?",
      subtitle: "No more buying expensive leads or sending messages to uninterested candidates on LinkedIn. Qonnect is the app that truly offers the perfect match!",
      headers: ["PAIN POINT", "QONNECT AGENT", "ALGORITHMIC SOLUTION"],
      list: [
        { pain: "Solving: Poor Matches", agent: "Deep Match Agent", icon: Brain, solution: "Analyzes candidates on 50+ data points (culture, skills, potential) for the perfect fit." },
        { pain: "Solving: Endless Sourcing", agent: "Sniper Sourcing Agent", icon: Target, solution: "Continuously scans the web to find passive candidates that exactly match your vacancy." },
        { pain: "Solving: Bias & Discrimination", agent: "Fair Play Agent", icon: Shield, solution: "Guarantees integrity by anonymizing profiles and screening for unconscious bias." },
        { pain: "Solving: Slow Communication", agent: "Coordinator Agent", icon: Zap, solution: "Automates follow-ups, schedules interviews, and keeps candidates warm without human intervention." }
      ]
    },
    appFunctions: {
      title: "The Qonnect Workflow", subtitle: "Two powerful interfaces, one seamless process.",
      candidate: {
        title: "Candidate Interface", features: [ { title: "AI CV Analysis", desc: "Upload your CV and our AI instantly analyzes your skills, creating a stunning profile dashboard.", icon: ScanLine }, { title: "Swipe & Match", desc: "No boring lists. Swipe through jobs like Tinder. Fun, fast, and effective.", icon: Heart }, { title: "Direct Chat", desc: "Got a match? Chat opens instantly. No waiting times or middlemen.", icon: MessageSquare } ]
      },
      recruiter: {
        title: "Recruiter Interface", features: [ { title: "AI Job Optimization", desc: "Post a job and let our AI rewrite the text for maximum conversion and visibility.", icon: PenTool }, { title: "The Perfect Match", desc: "Our algorithm instantly links your vacancy to the right candidates. No expensive software needed.", icon: Layers }, { title: "1 Recruiter = 10", desc: "Save time and costs. One person now does the work of an entire team thanks to our automation.", icon: Users } ]
      }
    },
    modernFeatures: {
      title: "Features built for modern careers", subtitle: "From first contact to signing the contract: every detail designed for control and insight.",
      leftCards: [ { icon: Route, color: "text-purple-600 bg-purple-50", title: "Tailored Matches", desc: "Share your preferences and we design flexible matches that adapt to your pace, budget, and culture.", aiTag: "AI Suggestions" }, { icon: Bell, color: "text-blue-600 bg-blue-50", title: "Live Updates", desc: "Get real-time alerts on applications, profile views, and messages so you never miss an opportunity.", status: "Live status" }, { icon: ShieldCheck, color: "text-emerald-600 bg-emerald-50", title: "Vetted Experts", desc: "Work only with screened recruiters and companies, backed by thousands of reviews.", rating: "4.9 rating" }, { icon: CreditCard, color: "text-pink-600 bg-pink-50", title: "Transparent Salaries", desc: "No surprises. See salary ranges, benefits, and budgets instantly upfront.", policy: "No hidden fees" } ],
      rightCard: { tag: "Always up-to-date", title: "Your Personal Dashboard", desc: "Insight into your matches, views and applications at a glance. No inbox full of spam, but data that works for you.", cta: "See how it works" }
    },
    steps: {
      title: "How Qonnect Works", s1: { title: "Upload & Analyze", desc: "Drag your CV into the app. Our AI scans not just for keywords, but understands context." }, s2: { title: "Profile Creation", desc: "A rich profile with a beautiful dashboard is created instantly. You tweak, AI learns." }, s3: { title: "AI Matching", desc: "Our algorithm searches 24/7 for the perfect match between job and profile." }, s4: { title: "Direct Contact", desc: "Is there a mutual 'Like'? Then the chat opens immediately. No waiting times." }
    },
    faq: {
      title: "Frequently Asked Questions", 
      items: [ 
        { 
          q: "Is Qonnect truly 100% free for candidates?", 
          a: "Yes, absolutely. In today's job market, talent is the most valuable asset. We believe you shouldn't have to pay to be found. You get free access to all premium features: AI resume analysis, unlimited swiping, and direct chat with hiring managers." 
        },
        { 
          q: "How does Qonnect protect my privacy?", 
          a: "Your profile is anonymized by default. Recruiters see your skills, culture fit score, and experience, but not your name, photo, or current employer. Your details are only revealed once you 'like' a job AND there is a match. Search safely and discreetly." 
        },
        { 
          q: "How is AI matching different from a search bar?", 
          a: "Traditional sites look for keywords. Our AI understands context. It recognizes that a 'Marketer' who knows 'Python' might be perfect for 'Growth Hacking', even if that term isn't on your CV. We match on DNA, ambition, and potential, not just keywords." 
        },
        { 
          q: "I'm a Freelancer, is this for me?", 
          a: "Definitely! Qonnect features a special 'Gig Mode'. This allows you to swipe through temporary assignments and projects. The system automatically filters on hourly rates and availability, saving you negotiation time." 
        },
        { 
          q: "When can I download the app?", 
          a: "We are currently in an exclusive 'Private Beta'. By joining the waitlist above, you secure your spot. As soon as we open up the next batch (very soon!), you will receive an immediate invitation via email." 
        } 
      ]
    },
    footer: { title: "Ready for the New Generation?", desc: "Join the movement and experience recruitment as it should be.", btn: "Join Qonnect", privacy: "Privacy", terms: "Terms", contact: "Contact" },
    ui: { matches: "Matches", views: "Views", score: "Score", optimal: "Optimal", recs: "AI Recommendations", skip: "Skip", match: "Match", active: "Active 2h ago" }
  }
};

// --- Styles ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; }
    h1, h2, h3, .font-heading { font-family: 'Space Grotesk', sans-serif; }
    .glass-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.5); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05); }
  `}</style>
);

// --- Components ---

const InteractiveAIDemo = ({ t }) => {
  const [mode, setMode] = useState('recruiter'); // 'recruiter' | 'candidate'
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input) return;
    setLoading(true);
    setResult('');

    const prompt = mode === 'recruiter'
      ? `Schrijf een extreem wervende en professionele vacature-introductie van 2-3 zinnen voor de functie: "${input}". Focus op innovatie en groei.`
      : `Ik ben een kandidaat met deze ervaring: "${input}". Schrijf een krachtige, professionele profielsamenvatting van max 50 woorden voor boven aan mijn CV.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Geen antwoord ontvangen.";
      setResult(text);
    } catch (error) {
      console.error(error);
      setResult("Er ging iets mis met de AI verbinding. Probeer het later opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-demo" className="py-24 bg-indigo-50 border-t border-indigo-100">
      <div className="max-w-4xl mx-auto px-6 text-center">
         <div className="inline-block p-3 rounded-2xl bg-white shadow-sm mb-6">
            <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
         </div>
         <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">{t.title}</h2>
         <p className="text-slate-500 max-w-xl mx-auto mb-10">{t.subtitle}</p>

         <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-indigo-100">
            {/* Tabs */}
            <div className="flex border-b border-slate-100">
               <button 
                 onClick={() => { setMode('recruiter'); setResult(''); setInput(''); }}
                 className={`flex-1 py-4 text-sm font-bold transition-colors ${mode === 'recruiter' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
               >
                 {t.recruiterTab}
               </button>
               <button 
                 onClick={() => { setMode('candidate'); setResult(''); setInput(''); }}
                 className={`flex-1 py-4 text-sm font-bold transition-colors ${mode === 'candidate' ? 'bg-purple-600 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
               >
                 {t.candidateTab}
               </button>
            </div>

            <div className="p-8 text-left">
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {mode === 'recruiter' ? t.labelRecruiter : t.labelCandidate}
               </label>
               <div className="flex gap-3 mb-6">
                  {mode === 'recruiter' ? (
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={t.placeholderRecruiter}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                      onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    />
                  ) : (
                    <textarea 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={t.placeholderCandidate}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-purple-500 min-h-[60px] resize-none"
                    />
                  )}
                  <button 
                    onClick={handleGenerate}
                    disabled={loading || !input}
                    className={`px-6 py-3 rounded-xl font-bold text-white transition-all flex items-center gap-2 ${mode === 'recruiter' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-purple-600 hover:bg-purple-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                    <span className="hidden sm:inline">{mode === 'recruiter' ? t.btn : "Genereer Profiel ✨"}</span>
                  </button>
               </div>

               {/* Result Area */}
               <div className="bg-slate-900 rounded-2xl p-6 min-h-[120px] relative">
                  <div className="absolute top-4 left-4 flex gap-1.5">
                     <div className="w-3 h-3 rounded-full bg-red-500" />
                     <div className="w-3 h-3 rounded-full bg-yellow-500" />
                     <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="mt-6 text-indigo-300 font-mono text-sm leading-relaxed">
                     {loading ? (
                        <span className="animate-pulse">AI is aan het typen...</span>
                     ) : result ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                           <span className="text-white font-bold block mb-2">{t.resultTitle}</span>
                           {result}
                        </motion.div>
                     ) : (
                        <span className="text-slate-600 italic">{t.placeholderResult}</span>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>
    </section>
  );
};

const PricingSection = ({ t }) => {
  const [view, setView] = useState('recruiter'); 
  const [billing, setBilling] = useState('monthly');

  return (
    <section id="pricing" className="py-24 bg-[#FAFAFA] border-t border-slate-200 relative">
       <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
             <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">{t.title}</h2>
             <p className="text-slate-500 max-w-xl mx-auto mb-8">{t.subtitle}</p>
             
             {/* Main View Toggle */}
             <div className="inline-flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm mb-8">
                <button 
                  onClick={() => setView('candidate')}
                  className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${view === 'candidate' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  {t.candidate.title}
                </button>
                <button 
                  onClick={() => setView('recruiter')}
                  className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${view === 'recruiter' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  {t.recruiter.title}
                </button>
             </div>

             {/* Billing Toggle (Only for recruiters) */}
             {view === 'recruiter' && (
               <div className="flex justify-center items-center gap-3 mb-12">
                 <span className={`text-sm font-medium ${billing === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>{t.monthly}</span>
                 <button 
                   onClick={() => setBilling(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                   className="relative w-12 h-6 bg-indigo-600 rounded-full p-1 transition-colors shadow-inner"
                 >
                   <motion.div 
                     animate={{ x: billing === 'yearly' ? 24 : 0 }}
                     className="w-4 h-4 bg-white rounded-full shadow"
                   />
                 </button>
                 <span className={`text-sm font-medium ${billing === 'yearly' ? 'text-slate-900' : 'text-slate-400'}`}>{t.yearly}</span>
                 <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full border border-green-200 ml-2">{t.save}</span>
               </div>
             )}
          </div>

          {/* Offer Banner */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-3 px-4 rounded-xl mb-12 text-sm font-bold shadow-lg">
             {t.offer}
          </div>

          {/* Candidate View */}
          {view === 'candidate' && (
             <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-xl">
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                   <User className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Altijd Gratis</h3>
                <div className="text-5xl font-heading font-bold text-indigo-600 mb-6">€{t.candidate.price}<span className="text-sm text-slate-400 font-sans font-medium"> {t.candidate.period}</span></div>
                <p className="text-slate-500 mb-8 leading-relaxed">
                   {t.candidate.desc}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-8">
                   {t.candidate.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-slate-700">
                         <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> {feat}
                      </div>
                   ))}
                </div>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">Start nu gratis</button>
             </div>
          )}

          {/* Recruiter View */}
          {view === 'recruiter' && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {t.recruiter.plans.map((plan, i) => {
                   // Calculate 30% discount if yearly
                   const price = billing === 'yearly' ? Math.round(plan.price * 0.7) : plan.price;
                   const period = billing === 'yearly' ? "/maand (jaarlijks)" : "/maand";

                   return (
                     <div 
                        key={i} 
                        className={`relative bg-white border rounded-3xl p-8 shadow-lg flex flex-col h-full ${plan.highlight ? 'border-indigo-500 ring-4 ring-indigo-500/10 scale-105 z-10' : 'border-slate-200 hover:border-indigo-200'}`}
                     >
                        {plan.highlight && (
                           <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-full shadow-md">
                              {plan.tag}
                           </div>
                        )}
                        <div className="mb-6">
                           <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                           <p className="text-xs text-slate-500 mt-1">{plan.desc}</p>
                        </div>
                        <div className="mb-6">
                           <span className="text-4xl font-heading font-bold text-slate-900">€{price}</span>
                           <span className="text-slate-400 text-xs"> {period}</span>
                           {billing === 'yearly' && <div className="text-xs text-green-600 font-bold mt-1">Bespaar €{Math.round((plan.price - price) * 12)} per jaar</div>}
                        </div>
                        
                        <ul className="space-y-4 mb-8 flex-grow">
                           {plan.features.map((feat, j) => (
                              <li key={j} className="flex items-start gap-3 text-sm text-slate-600">
                                 <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                                 <span className="leading-tight">{feat}</span>
                              </li>
                           ))}
                        </ul>
                        
                        <button 
                          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                          className={`w-full py-3 rounded-xl font-bold text-sm transition-colors ${plan.highlight ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-50 text-slate-900 hover:bg-slate-100'}`}
                        >
                           Kies {plan.name}
                        </button>
                     </div>
                   );
                })}
             </div>
          )}
       </div>
    </section>
  );
};

const FAQSection = ({ t }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  return (
    <section id="faq" className="py-24 bg-white border-t border-slate-100">
       <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12"><h2 className="text-3xl font-heading font-bold text-slate-900">{t.title}</h2></div>
          <div className="space-y-4">
            {t.items.map((item, i) => (
               <motion.div 
                 key={i} 
                 className={`border rounded-xl overflow-hidden transition-all duration-300 ${activeIndex === i ? 'bg-white border-indigo-200 shadow-md' : 'bg-slate-50 border-slate-200'}`}
                 initial={false}
               >
                  <button 
                    onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                    className="w-full p-6 flex justify-between items-center text-left"
                  >
                    <span className={`font-bold text-lg ${activeIndex === i ? 'text-indigo-600' : 'text-slate-800'}`}>
                        {item.q}
                    </span>
                    <motion.div 
                        animate={{ rotate: activeIndex === i ? 45 : 0 }}
                        className={`p-1 rounded-full ${activeIndex === i ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}
                    >
                       <Plus className="w-5 h-5" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {activeIndex === i && (
                       <motion.div 
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: 'auto', opacity: 1 }}
                         exit={{ height: 0, opacity: 0 }}
                         className="overflow-hidden"
                       >
                          <div className="p-6 pt-0 text-slate-500 text-base leading-relaxed border-t border-indigo-50">
                             {item.a}
                          </div>
                       </motion.div>
                    )}
                  </AnimatePresence>
               </motion.div>
            ))}
          </div>
       </div>
    </section>
  );
};

const AdminView = ({ onClose }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const ADMIN_HASH = 'UW9ubmVjdDIwMjUh'; 
  const handleLogin = (e) => { e.preventDefault(); try { if (btoa(password) === ADMIN_HASH) { setIsAuthenticated(true); setError(''); fetchData(); } else { setError('Verkeerd wachtwoord'); } } catch (err) { setError('Fout.'); } };
  const fetchData = () => { setLoading(true); const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'waitlist_entries'), orderBy('createdAt', 'desc')); return onSnapshot(q, (snapshot) => { const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date() })); setEntries(data); setLoading(false); }, () => { setLoading(false); setError("Geen toegang."); }); };
  return (
    <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="fixed bottom-0 left-0 w-full h-[60vh] bg-white border-t border-slate-200 shadow-2xl z-[100] flex flex-col rounded-t-3xl overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center"><div className="flex items-center gap-3"><Database className="w-5 h-5 text-indigo-600" /><h3 className="font-bold text-slate-900">Admin</h3></div><button onClick={onClose}><ChevronDown className="w-5 h-5 text-slate-600" /></button></div>
      <div className="flex-1 overflow-auto bg-white p-6">
        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center h-full max-w-sm mx-auto"><Key className="w-8 h-8 text-slate-300 mb-4" /><form onSubmit={handleLogin} className="w-full"><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Wachtwoord" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 mb-3 outline-none focus:ring-2 focus:ring-indigo-500" /><button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg">Login</button>{error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}</form></div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="p-3">Email</th><th className="p-3">Rol</th><th className="p-3">Datum</th></tr></thead><tbody className="divide-y divide-slate-100">{entries.map(e => (<tr key={e.id}><td className="p-3 font-medium">{e.email}</td><td className="p-3">{e.role}</td><td className="p-3 text-slate-400">{e.createdAt.toLocaleString()}</td></tr>))}</tbody></table></div>
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
        <div className="bg-white p-3 rounded-lg border border-slate-100 flex gap-3 items-center hover:border-indigo-500/30 hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-indigo-50 rounded-md flex items-center justify-center text-indigo-600 font-bold border border-indigo-100 text-xs">TC</div>
          <div className="flex-1 min-w-0"><div className="flex justify-between items-center mb-0.5"><h5 className="font-bold text-slate-800 text-xs truncate">Frontend Lead</h5><div className="flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100"><span className="text-emerald-600 text-[9px] font-bold font-mono">98%</span></div></div><p className="text-slate-500 text-[10px] truncate font-mono">TechCorp • Amsterdam</p></div>
        </div>
      </div>
    </div>
  </div>
);

// --- NIEUWE AGENT SECTIE COMPONENT ---
const AgentSection = ({ t }) => {
  return (
    <section className="py-24 bg-white border-t border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-heading font-bold text-slate-900 mb-4">{t.title}</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">{t.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {t.list.map((agent, i) => (
            <div
              key={i}
              className="relative p-8 bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden group hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 cursor-default h-full flex flex-col" 
            >
               <div className="relative z-10 flex items-start gap-4 flex-1">
                  <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600 border border-slate-100 group-hover:text-indigo-500 group-hover:scale-110 transition-all duration-300">
                    <agent.icon className="w-8 h-8 group-hover:animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                       <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 rounded-full">AI Agent</span>
                    </div>
                    <h3 className="text-xl font-heading font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{agent.agent}</h3>
                    <div className="text-xs font-bold text-red-500 uppercase tracking-wide mb-2">{agent.pain}</div>
                    <p className="text-slate-500 text-sm leading-relaxed">{agent.solution}</p>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
    const initAuth = async () => { try { await signInAnonymously(auth); } catch (e) { console.error(e); } };
    initAuth(); onAuthStateChanged(auth, setUser);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setFormError('');
    if (!email) { setFormError("Vul e-mail in."); return; }
    if (!user) { setFormError("Database verbinding mislukt."); return; }
    setLoading(true);
    try { await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'waitlist_entries'), { email, role, userId: user.uid, createdAt: serverTimestamp(), locale: lang }); setSubmitted(true); setEmail(''); } 
    catch (err) { setFormError("Fout bij opslaan."); } finally { setLoading(false); }
  };

  const toggleLang = () => setLang(prev => prev === 'nl' ? 'en' : 'nl');

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden">
      <GlobalStyles />
      
      {/* Nav */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-2xl">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-full px-5 py-3 flex justify-between items-center shadow-sm">
           <div className="flex items-center gap-2"><div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center"><Sparkles className="w-4 h-4 text-white" /></div><span className="font-heading font-bold text-lg">QONNECT</span></div>
           <div className="flex items-center gap-2"><button onClick={toggleLang} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:border-indigo-200 hover:text-indigo-600 transition-colors shadow-sm"><Globe className="w-3.5 h-3.5" /> {lang.toUpperCase()}</button><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="bg-slate-900 text-white px-4 py-2 rounded-full text-[11px] font-bold hover:bg-slate-800 transition-colors">{t.nav.access}</button></div>
        </div>
      </nav>

      <header className="relative pt-40 pb-20 px-6 max-w-4xl mx-auto text-center z-10">
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block mb-6 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold tracking-widest uppercase border border-indigo-100">{t.hero.tag}</motion.div>
         <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter text-slate-900 mb-6 leading-[1.1]">{t.hero.titleStart}<br/> {t.hero.titleEnd} <span className="text-indigo-600">{t.hero.highlight}</span></h1>
         <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10">{t.hero.subtitle}</p>
         
         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-slate-200 p-2 rounded-2xl shadow-xl max-w-md mx-auto">
            <div className="flex bg-slate-50 p-1 rounded-xl mb-2"><button onClick={() => setRole('candidate')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${role === 'candidate' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>{t.hero.roleCandidate}</button><button onClick={() => setRole('recruiter')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${role === 'recruiter' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>{t.hero.roleRecruiter}</button></div>
            <div id="waitlist">
              {submitted ? (
                 <motion.div 
                   initial={{ scale: 0.8, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   transition={{ type: "spring", duration: 0.6 }}
                   className="py-8 px-6 bg-emerald-50 rounded-xl border border-emerald-100 flex flex-col items-center text-center"
                 >
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                       <CheckCircle className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{t.hero.successTitle}</h3>
                    <p className="text-slate-500 text-sm">{t.hero.successSub}</p>
                 </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="email" 
                      required 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder={role === 'candidate' ? t.hero.placeholderCandidate : t.hero.placeholderRecruiter} 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                    />
                  </div>
                  <button disabled={loading} className="bg-indigo-600 text-white px-6 rounded-xl font-bold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-2">
                    {loading ? "..." : "JOIN"} <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
              {!submitted && role === 'recruiter' && (
                 <div className="mt-3 p-2 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center gap-2 text-[10px] text-indigo-700 font-medium animate-pulse">
                    <Sparkles className="w-3 h-3" />
                    {t.hero.launchDeal}
                 </div>
              )}
              {!submitted && formError && <p className="text-red-500 text-[10px] mt-2">{formError}</p>}
            </div>
         </motion.div>
      </header>

      {/* --- AGENT SECTIE --- */}
      <AgentSection t={t.agents} />
      {/* --- AI DEMO SECTIE --- */}
      <InteractiveAIDemo t={t.aiDemo} />

      <section id="about" className="py-24 relative border-t border-slate-200 bg-white">
         <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-10">{t.about.title}</h2>
            <div className="grid md:grid-cols-2 gap-12 text-left">
               <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-all duration-300"><div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 mb-6 shadow-sm border border-slate-100"><User className="w-6 h-6" /></div><h3 className="text-2xl font-heading font-bold text-slate-900 mb-3">{t.about.candTitle}</h3><p className="text-slate-500 text-sm leading-relaxed mb-4">{t.about.candDesc}</p><ul className="text-slate-500 text-xs space-y-2 font-mono">{t.about.candPoints.map((p, i) => (<li key={i} className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-indigo-600"/> {p}</li>))}</ul></div>
               <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-all duration-300"><div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-purple-600 mb-6 shadow-sm border border-slate-100"><Target className="w-6 h-6" /></div><h3 className="text-2xl font-heading font-bold text-slate-900 mb-3">{t.about.recTitle}</h3><p className="text-slate-500 text-sm leading-relaxed mb-4">{t.about.recDesc}</p><ul className="text-slate-500 text-xs space-y-2 font-mono">{t.about.recPoints.map((p, i) => (<li key={i} className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-purple-600"/> {p}</li>))}</ul></div>
            </div>
         </div>
      </section>

      <section id="how" className="py-32 relative border-t border-slate-200 bg-white">
         <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-16">{t.steps.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">{[{ step: "01", ...t.steps.s1, icon: FileText }, { step: "02", ...t.steps.s2, icon: Brain }, { step: "03", ...t.steps.s3, icon: Search }, { step: "04", ...t.steps.s4, icon: MessageSquare }].map((item, i) => (<div key={i} className="relative group pt-6"><div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-slate-200 to-transparent mb-6"></div><div className="flex justify-between items-start mb-6"><span className="text-4xl font-heading font-bold text-slate-100 group-hover:text-indigo-500 group-hover:drop-shadow-lg transition-all duration-300">{item.step}</span><item.icon className="w-5 h-5 text-slate-400" /></div><h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3><p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p></div>))}</div>
         </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto bg-slate-50 border-y border-slate-200">
        <div className="text-center mb-16"><h2 className="text-4xl font-heading font-bold text-slate-900 mb-4">{t.appFunctions.title}</h2><p className="text-slate-500">{t.appFunctions.subtitle}</p></div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300"><div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider mb-8"><User className="w-4 h-4" /> {t.appFunctions.candidate.title}</div><div className="space-y-8">{t.appFunctions.candidate.features.map((feat, i) => (<div key={i} className="flex gap-4"><div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0"><feat.icon className="w-6 h-6" /></div><div><h3 className="text-lg font-bold text-slate-900 mb-1">{feat.title}</h3><p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p></div></div>))}</div></div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300"><div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider mb-8"><Briefcase className="w-4 h-4" /> {t.appFunctions.recruiter.title}</div><div className="space-y-8">{t.appFunctions.recruiter.features.map((feat, i) => (<div key={i} className="flex gap-4"><div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0"><feat.icon className="w-6 h-6" /></div><div><h3 className="text-lg font-bold text-slate-900 mb-1">{feat.title}</h3><p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p></div></div>))}</div></div>
        </div>
      </section>

      {/* --- NIEUWE PRICING SECTIE --- */}
      <PricingSection t={t.pricing} />

      {/* --- NIEUWE FEATURES LAYOUT SECTIE (Grid) --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
         <div className="text-center mb-16 max-w-2xl mx-auto"><h2 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-4">{t.modernFeatures.title}</h2><p className="text-slate-500">{t.modernFeatures.subtitle}</p></div>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">{t.modernFeatures.leftCards.map((card, i) => (<div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow flex flex-col h-full"><div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${card.color}`}><card.icon className="w-5 h-5" /></div><h3 className="text-lg font-bold text-slate-900 mb-2">{card.title}</h3><p className="text-slate-500 text-xs leading-relaxed mb-4 flex-grow">{card.desc}</p><div className="pt-4 border-t border-slate-100"><div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.aiTag && <><Sparkles className="w-3 h-3 text-purple-500" /> {card.aiTag}</>}{card.status && <><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/> {card.status}</>}{card.rating && <><div className="text-yellow-500">★★★★★</div> {card.rating}</>}{card.policy && <><Shield className="w-3 h-3 text-pink-500" /> {card.policy}</>}</div></div></div>))}</div>
            <div className="lg:col-span-1 bg-[#111] rounded-2xl p-8 text-white flex flex-col justify-between relative overflow-hidden group"><div className="relative z-10"><span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold uppercase tracking-widest mb-6 text-emerald-400">{t.modernFeatures.rightCard.tag}</span><h3 className="text-3xl font-heading font-bold mb-4 leading-tight">{t.modernFeatures.rightCard.title}</h3><p className="text-gray-400 text-sm mb-8 leading-relaxed">{t.modernFeatures.rightCard.desc}</p><div className="relative mt-8 h-64 w-full overflow-hidden rounded-xl border border-white/10 shadow-2xl transform group-hover:scale-105 transition-transform duration-500"><DashboardMockup t={t.ui} /></div></div><div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center relative z-10"><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-gray-200 transition-colors flex items-center gap-1">{t.modernFeatures.rightCard.cta} <ArrowRight className="w-3 h-3" /></button></div><div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-900/20 via-transparent to-emerald-900/20 pointer-events-none" /></div>
         </div>
      </section>

      <FAQSection t={t.faq} />

      <footer className="py-20 border-t border-slate-100 bg-white text-center">
        <div className="max-w-4xl mx-auto px-6">
           <h2 className="text-3xl font-heading font-bold text-slate-900 mb-6">{t.footer.title}</h2>
           <p className="text-slate-500 mb-8 text-sm">{t.footer.desc}</p>
           <button onClick={() => setShowAdmin(!showAdmin)} className="text-[10px] text-slate-300 hover:text-slate-500 uppercase tracking-widest">Admin Login</button>
           <div className="mt-8 text-[10px] text-slate-400 font-mono">© 2025 QONNECT SYSTEMS INC.</div>
        </div>
      </footer>
      <AnimatePresence>{showAdmin && <AdminView onClose={() => setShowAdmin(false)} />}</AnimatePresence>
    </div>
  );
}
