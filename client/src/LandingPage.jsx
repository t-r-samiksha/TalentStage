import { useState, useEffect } from 'react';
import {
  Cpu,
  Sparkles,
  ShieldCheck,
  Terminal,
  ArrowRight,
  Star,
  CheckCircle2,
  Code,
  X,
  Menu,
  Briefcase,
  Check
} from 'lucide-react';

// Custom inline SVG icons for brands (Github, Twitter, Linkedin) since they are deprecated in newer Lucide React versions
const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// Freelancer Database
const FREELANCERS = [
  {
    id: 1,
    name: "Dr. Evelyn Vance",
    role: "AI & Agentic NLP Specialist",
    category: "AI Engineers",
    initials: "EV",
    skills: ["PyTorch", "LLMs", "LangChain", "Python"],
    rate: 125,
    jobs: 28,
    rating: 5.0,
    match: 99,
    bio: "Former OpenAI researcher specializing in custom agentic workflows, fine-tuning, and neural reasoning pipelines."
  },
  {
    id: 2,
    name: "Arjun Patel",
    role: "Full-Stack React Architect",
    category: "Full-Stack React",
    initials: "AP",
    skills: ["Next.js", "TypeScript", "Tailwind", "Node.js"],
    rate: 85,
    jobs: 64,
    rating: 4.9,
    match: 98,
    bio: "Core contributor to major React frameworks. Excels in high-performance web apps, rendering strategies, and state design."
  },
  {
    id: 3,
    name: "Elena Rostova",
    role: "Rust & Solidity Protocol Engineer",
    category: "Rust & Solidity",
    initials: "ER",
    skills: ["Rust", "Solidity", "Web3.js", "EVM Audits"],
    rate: 110,
    jobs: 37,
    rating: 4.95,
    match: 97,
    bio: "Specializes in secure smart contracts, cryptographic proof-of-concept audits, and ultra-fast consensus layers in Rust."
  },
  {
    id: 4,
    name: "Marcus Chen",
    role: "ML Platform & GPU Engineer",
    category: "AI Engineers",
    initials: "MC",
    skills: ["Kubernetes", "Docker", "PyTorch", "AWS Sagemaker"],
    rate: 135,
    jobs: 19,
    rating: 4.8,
    match: 96,
    bio: "Optimizes cluster scheduling and training distribution for large-scale language and diffusion models."
  },
  {
    id: 5,
    name: "Sarah Jenkins",
    role: "Lead Tailwind & Creative Designer",
    category: "Full-Stack React",
    initials: "SJ",
    skills: ["Tailwind CSS", "Figma", "React", "Framer Motion"],
    rate: 90,
    jobs: 53,
    rating: 5.0,
    match: 99,
    bio: "Designs and builds premium, interactive SaaS interfaces. Bridges the gap between aesthetic design and modular code."
  },
  {
    id: 6,
    name: "Hiroshi Tanaka",
    role: "Cryptographic Protocol Architect",
    category: "Rust & Solidity",
    initials: "HT",
    skills: ["Rust", "Zero-Knowledge Proofs", "Go", "zk-Rollups"],
    rate: 150,
    jobs: 12,
    rating: 5.0,
    match: 95,
    bio: "Focuses on privacy-preserving cryptographic primitives, ZK-Rollups, and layer-2 decentralized protocols."
  }
];

function LandingPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  
  // Hiring Simulation Modal States
  const [hiringFreelancer, setHiringFreelancer] = useState(null);
  const [matchingStep, setMatchingStep] = useState(0);
  const [simulationLogs, setSimulationLogs] = useState([]);
  
  // Scrolled state for Navbar shadow/blur transition
  const [scrolled, setScrolled] = useState(false);
  const [previewChartTab, setPreviewChartTab] = useState('weekly');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter freelancers based on selected category
  const filteredFreelancers = activeTab === "All" 
    ? FREELANCERS 
    : FREELANCERS.filter(f => f.category === activeTab);

  const handleStartHiring = (freelancer) => {
    setMatchingStep(0);
    setSimulationLogs([]);
    setHiringFreelancer(freelancer);
  };

  // Run matching simulation steps
  useEffect(() => {
    if (!hiringFreelancer) return;

    const logTemplates = [
      `[AI Engine] Analyzing project scope and requirements...`,
      `[AI Engine] Verifying tech stack alignment with ${hiringFreelancer.name}...`,
      `[AI Engine] Fetching historical GitHub PR code metrics...`,
      `[Smart Escrow] Generating milestone payment smart contract...`,
      `[Smart Escrow] Compiling EVM bytecode & deploying to security-sandbox...`,
      `[Smart Escrow] Locked ${hiringFreelancer.rate * 40} USD equivalent for Milestone 1...`,
      `[AI Matcher] Complete match found: ${hiringFreelancer.match}% confidence score.`,
      `[FreelanceAI] Sending instant secure Slack/Email invitation...`
    ];

    const logIntervals = [800, 1800, 2700, 3700, 4800, 5800, 6800, 7800];
    const stepsIntervals = [2000, 4500, 7000, 8500];

    // Log messages timing
    const logTimers = logTemplates.map((log, index) => {
      return setTimeout(() => {
        setSimulationLogs(prev => [...prev, log]);
      }, logIntervals[index]);
    });

    // Step progress timing
    const stepTimers = [
      setTimeout(() => setMatchingStep(1), stepsIntervals[0]),
      setTimeout(() => setMatchingStep(2), stepsIntervals[1]),
      setTimeout(() => setMatchingStep(3), stepsIntervals[2]),
      setTimeout(() => setMatchingStep(4), stepsIntervals[3])
    ];

    return () => {
      logTimers.forEach(clearTimeout);
      stepTimers.forEach(clearTimeout);
    };
  }, [hiringFreelancer]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail("");
      setTimeout(() => setNewsletterSubscribed(false), 4000);
    }
  };

  return (
    <div className="min-h-screen text-slate-100 bg-slate-950 font-sans relative overflow-x-hidden selection:bg-violet-500/30 selection:text-violet-200">
      
      {/* Background Decorative Ambient Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-[800px] right-1/4 w-[600px] h-[600px] rounded-full bg-indigo-600/8 blur-[150px] pointer-events-none animate-pulse-glow-reverse" />
      <div className="absolute bottom-[400px] left-1/3 w-[500px] h-[500px] rounded-full bg-purple-600/8 blur-[120px] pointer-events-none" />

      {/* SECTION 1: NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-slate-950/85 backdrop-blur-md border-b border-slate-900/80 py-4 shadow-lg shadow-black/25' 
          : 'bg-transparent py-6 border-b border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform duration-200">
              <Cpu className="w-5 h-5 text-white animate-pulse" />
              <div className="absolute inset-0 rounded-lg bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Freelance<span className="text-violet-400 font-extrabold">AI</span>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200 relative group py-1">
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-violet-400 transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#dashboard-preview" className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200 relative group py-1">
              Co-Pilot Demo
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-violet-400 transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#freelancers" className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200 relative group py-1">
              Freelancers
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-violet-400 transition-all duration-300 group-hover:w-full" />
            </a>
          </div>

          {/* Right Action CTAs */}
          <div className="hidden md:flex items-center gap-5">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onNavigate('login'); }}
              className="text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-200"
            >
              Login
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onNavigate('signup'); }}
              className="relative px-4.5 py-2.5 rounded-lg text-sm font-semibold text-white overflow-hidden group transition-all duration-300 hover:scale-105 active:scale-95 shadow-md shadow-violet-500/10"
            >
              {/* Button gradient border */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg" />
              <div className="absolute inset-[1px] bg-slate-950 rounded-md group-hover:opacity-0 transition-opacity duration-300" />
              <span className="relative z-10 bg-gradient-to-r from-white to-slate-100 bg-clip-text text-transparent group-hover:text-white">
                Get Started
              </span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-slate-950/95 backdrop-blur-lg border-b border-slate-900 px-6 py-6 flex flex-col gap-5 shadow-2xl">
            <a 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-slate-300 hover:text-white py-1 transition-colors"
            >
              Features
            </a>
            <a 
              href="#dashboard-preview" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-slate-300 hover:text-white py-1 transition-colors"
            >
              Co-Pilot Demo
            </a>
            <a 
              href="#freelancers" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-slate-300 hover:text-white py-1 transition-colors"
            >
              Freelancers
            </a>
            <hr className="border-slate-900" />
            <div className="flex flex-col gap-3">
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate('login'); }}
                className="text-center font-semibold text-slate-400 hover:text-white py-2"
              >
                Login
              </a>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigate('signup'); }}
                className="w-full text-center py-3 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:brightness-110 active:scale-98 transition-all"
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* SECTION 2: HERO SECTION */}
      <section className="relative py-24 md:py-32 px-6 max-w-7xl mx-auto">
        
        {/* Metric Badges */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm shadow-inner shadow-violet-500/5">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            <span>AI-Driven Matchmaking Engine</span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15] mb-6 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            AI-Powered Freelancer Hiring Marketplace
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Hire verified freelancers smarter with AI matching and proposal analysis.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4.5 mb-16">
            <a 
              href="#freelancers" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-700 font-semibold text-white hover:scale-105 active:scale-95 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/35 transition-all duration-200"
            >
              <span>Hire Talent</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onNavigate('signup'); }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-slate-800 bg-transparent text-slate-300 hover:text-white hover:border-slate-50 hover:bg-slate-900/40 font-semibold hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <span>Become Freelancer</span>
            </a>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-20 text-center">
          {[
            { value: "15s", label: "Match Time" },
            { value: "$14.2M+", label: "Payouts Secured" },
            { value: "99.8%", label: "Milestone Success" },
            { value: "2,400+", label: "Vetted Engineers" }
          ].map((stat, i) => (
            <div key={i} className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-slate-700/80 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <p className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">{stat.value}</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* HERO FEATURE: LIVE RENDERED DASHBOARD MOCKUP */}
        <div id="dashboard-preview" className="relative max-w-5xl mx-auto rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-md p-3 md:p-4 shadow-2xl shadow-black/80">
          
          {/* Decorative ambient glowing lines */}
          <div className="absolute -top-[1px] left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent blur-[1px]" />
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-tr from-violet-500/10 to-indigo-500/10 opacity-30 blur-sm -z-10" />

          {/* Title Bar */}
          <div className="flex items-center justify-between px-3 pb-3 border-b border-slate-900">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-semibold text-slate-500 ml-2 select-none">WORKSPACE // LIVE_MATCH_ANALYTICS</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-950/60 border border-slate-800/80 rounded-md px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Engine Status: Online</span>
            </div>
          </div>

          {/* Dashboard Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
            
            {/* Left Column: Analytics Summary */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              
              {/* Match Confidence Badge Card */}
              <div className="glass-panel p-5 rounded-xl border border-slate-850 bg-slate-950/45 relative overflow-hidden group hover:border-slate-700/80 transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Match Index</span>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white tracking-tight">94%</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    Match Confidence
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">
                  AI parsing verified 94% compatibility with recent PR commits and stack specifications.
                </p>
              </div>

              {/* Recent Earnings Visual Tracker Card */}
              <div className="glass-panel p-5 rounded-xl border border-slate-850 bg-slate-950/45 relative overflow-hidden group hover:border-slate-700/80 transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-600/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Milestone Escrows</span>
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/25 px-2 py-0.5 rounded">
                    +15.2%
                  </span>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-extrabold text-white tracking-tight">₹45,000</span>
                  <span className="text-xs font-medium text-slate-400 ml-1.5 select-none">Recent Earnings</span>
                </div>
                {/* Visual progress bar */}
                <div className="h-1.5 bg-slate-900 rounded-full mt-4 overflow-hidden">
                  <div className="h-full w-[75%] bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                </div>
                <div className="flex justify-between items-center mt-2.5 text-[9px] text-slate-500">
                  <span>Milestone 2 Verified</span>
                  <span>Goal: ₹60,000</span>
                </div>
              </div>

            </div>

            {/* Middle Column: Interactive CSS Bar Chart */}
            <div className="lg:col-span-5 glass-panel p-5 rounded-xl border border-slate-850 bg-slate-950/45 flex flex-col justify-between min-h-[260px] relative">
              <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-600/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-slate-900/60 pb-3">
                <div>
                  <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">AI Match Density</h4>
                  <h3 className="text-xs font-bold text-white mt-0.5">Distribution Index</h3>
                </div>
                
                {/* Selector Tabs */}
                <div className="flex bg-slate-900 border border-slate-800 p-0.5 rounded-lg">
                  <button 
                    onClick={() => setPreviewChartTab('weekly')}
                    className={`px-2.5 py-1 text-[9px] font-bold rounded-md transition-all cursor-pointer ${
                      previewChartTab === 'weekly' 
                        ? 'bg-violet-600 text-white shadow-md' 
                        : 'text-slate-500 hover:text-slate-350'
                    }`}
                  >
                    Weekly
                  </button>
                  <button 
                    onClick={() => setPreviewChartTab('monthly')}
                    className={`px-2.5 py-1 text-[9px] font-bold rounded-md transition-all cursor-pointer ${
                      previewChartTab === 'monthly' 
                        ? 'bg-violet-600 text-white shadow-md' 
                        : 'text-slate-500 hover:text-slate-355'
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              {/* Bar Chart Canvas */}
              <div className="h-[150px] flex items-end justify-between px-2 pt-6 pb-2 relative border-b border-slate-900/40 mt-4">
                
                {/* Background grid lines */}
                <div className="absolute left-0 right-0 top-[25%] border-b border-slate-900/25 pointer-events-none" />
                <div className="absolute left-0 right-0 top-[50%] border-b border-slate-900/25 pointer-events-none" />
                <div className="absolute left-0 right-0 top-[75%] border-b border-slate-900/25 pointer-events-none" />

                {previewChartTab === 'weekly' ? (
                  // Weekly Data: Mon to Sun
                  [
                    { label: "Mon", val: 64 },
                    { label: "Tue", val: 78 },
                    { label: "Wed", val: 82 },
                    { label: "Thu", val: 90 },
                    { label: "Fri", val: 94, highlight: true },
                    { label: "Sat", val: 80 },
                    { label: "Sun", val: 85 }
                  ].map((bar, idx) => (
                    <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end group/bar relative px-1 sm:px-2">
                      {/* Tooltip on Hover */}
                      <div className="opacity-0 group-hover/bar:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] font-bold text-white transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg z-10">
                        {bar.val}% Fit
                      </div>
                      
                      {/* CSS Shape Bar */}
                      <div 
                        style={{ height: `${bar.val}%` }} 
                        className={`w-4 sm:w-5.5 rounded-t-md relative transition-all duration-500 ease-out cursor-default ${
                          bar.highlight 
                            ? 'bg-gradient-to-t from-violet-600 via-indigo-500 to-cyan-400 shadow-lg shadow-violet-500/15 group-hover/bar:brightness-110' 
                            : 'bg-gradient-to-t from-slate-900 to-slate-700 border border-slate-800 group-hover/bar:bg-slate-850 group-hover/bar:border-slate-650'
                        }`}
                      />
                      
                      {/* X-axis Label */}
                      <span className="text-[9px] font-semibold text-slate-500 mt-2">{bar.label}</span>
                    </div>
                  ))
                ) : (
                  // Monthly Data: Week 1 to Week 4
                  [
                    { label: "W1", val: 72 },
                    { label: "W2", val: 85 },
                    { label: "W3", val: 94, highlight: true },
                    { label: "W4", val: 89 }
                  ].map((bar, idx) => (
                    <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end group/bar relative px-3 sm:px-5">
                      {/* Tooltip on Hover */}
                      <div className="opacity-0 group-hover/bar:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] font-bold text-white transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg z-10">
                        {bar.val}% Fit
                      </div>

                      {/* CSS Shape Bar */}
                      <div 
                        style={{ height: `${bar.val}%` }} 
                        className={`w-7 sm:w-9.5 rounded-t-md relative transition-all duration-500 ease-out cursor-default ${
                          bar.highlight 
                            ? 'bg-gradient-to-t from-violet-600 via-indigo-500 to-cyan-400 shadow-lg shadow-violet-500/15 group-hover/bar:brightness-110' 
                            : 'bg-gradient-to-t from-slate-900 to-slate-700 border border-slate-800 group-hover/bar:bg-slate-850 group-hover/bar:border-slate-650'
                        }`}
                      />

                      {/* X-axis Label */}
                      <span className="text-[9px] font-semibold text-slate-500 mt-2">{bar.label}</span>
                    </div>
                  ))
                )}

              </div>
            </div>

            {/* Right Column: Console terminal stream */}
            <div className="lg:col-span-3 bg-black/55 border border-slate-900/60 rounded-xl p-4 font-mono text-[11px] leading-[1.4] text-slate-400 flex flex-col justify-between min-h-[260px]">
              <div className="space-y-1.5">
                <div className="text-slate-500 border-b border-slate-900 pb-1 flex justify-between font-sans text-[9px] uppercase tracking-wider font-bold">
                  <span>console_feed</span>
                  <span>status: streaming</span>
                </div>
                <div className="text-slate-500 mt-2">$ match --live --analytics</div>
                <div className="text-slate-350 flex items-center gap-1.5">
                  <span className="text-violet-400 animate-pulse">●</span> Scanning repositories...
                </div>
                <div className="text-indigo-400">Match score updated: 94% fit</div>
                <div className="text-slate-350">Smart Escrow funded: ₹45,000</div>
                <div className="text-emerald-400">Escrow deployed: 0x71C84...a49d</div>
                <div className="text-slate-500">$ verify commit --hash 4f7c1d</div>
                <div className="text-slate-400">Unit tests passed (100% green)</div>
                <div className="text-emerald-350 font-semibold">✓ Milestone released to team</div>
              </div>
              <div className="flex items-center justify-between border-t border-slate-900 pt-2 mt-2 text-slate-500 text-[9px]">
                <span>Logs active</span>
                <span>CTRL+C to close</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURES GRID */}
      <section id="features" className="py-24 border-t border-slate-900 bg-slate-950/20 relative z-10 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-18">
            <h2 className="text-xs font-bold text-violet-400 tracking-widest uppercase mb-3">Core Infrastructure</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Engineered For Premium Development Cycles</h3>
            <p className="text-slate-400 text-base sm:text-lg mt-4 max-w-xl mx-auto leading-relaxed">
              We eliminated standard marketplace bloat. FreelanceAI functions with procedural efficiency powered by AI audits.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            
            {/* Feature 1: AI Match Engine */}
            <div className="bg-slate-900/20 backdrop-blur-md border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:bg-slate-900/50 hover:border-slate-700/80 hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 shadow-xl shadow-black/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 rounded-full blur-2xl group-hover:bg-violet-600/10 transition-colors duration-300" />
              <div className="w-11 h-11 rounded-xl bg-violet-950/50 border border-violet-500/30 flex items-center justify-center mb-5 text-violet-400">
                <Cpu className="w-5.5 h-5.5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">AI Match Engine</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Instantly matches your technical requirements and repositories with elite engineers, analyzing past pull requests for a perfect project fit.
              </p>
            </div>

            {/* Feature 2: AI Proposal Evaluator */}
            <div className="bg-slate-900/20 backdrop-blur-md border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:bg-slate-900/50 hover:border-slate-700/80 hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 shadow-xl shadow-black/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-2xl group-hover:bg-indigo-600/10 transition-colors duration-300" />
              <div className="w-11 h-11 rounded-xl bg-indigo-950/50 border border-indigo-500/30 flex items-center justify-center mb-5 text-indigo-400">
                <Sparkles className="w-5.5 h-5.5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">AI Proposal Evaluator</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Automatically screens and ranks developer bids using smart proposal analysis to save you hours of manual review.
              </p>
            </div>

            {/* Feature 3: Skill Verification */}
            <div className="bg-slate-900/20 backdrop-blur-md border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:bg-slate-900/50 hover:border-slate-700/80 hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 shadow-xl shadow-black/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-2xl group-hover:bg-purple-600/10 transition-colors duration-300" />
              <div className="w-11 h-11 rounded-xl bg-purple-950/50 border border-purple-500/30 flex items-center justify-center mb-5 text-purple-400">
                <Code className="w-5.5 h-5.5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Skill Verification</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Agentic validation of code history and repository commits, ensuring engineers possess real, tested competency.
              </p>
            </div>

            {/* Feature 4: Secure Milestone Payments */}
            <div className="bg-slate-900/20 backdrop-blur-md border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:bg-slate-900/50 hover:border-slate-700/80 hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 shadow-xl shadow-black/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 rounded-full blur-2xl group-hover:bg-emerald-600/10 transition-colors duration-300" />
              <div className="w-11 h-11 rounded-xl bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center mb-5 text-emerald-400">
                <ShieldCheck className="w-5.5 h-5.5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Secure Milestone Payments</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Locks funds in smart-contract escrows that auto-release instantly once the milestone deliverables pass our test suites.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: INTERACTIVE FREELANCER MARKETPLACE SHOWCASE */}
      <section id="freelancers" className="py-24 border-t border-slate-900 bg-slate-950/40 relative z-10 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-violet-400 tracking-widest uppercase mb-3">Live Roster</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Vetted Engineering Candidates</h3>
            <p className="text-slate-400 text-base sm:text-lg mt-4 max-w-xl mx-auto leading-relaxed">
              Explore a handful of our top-tier engineering freelancers currently in high demand.
            </p>
          </div>

          {/* Interactive Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {["All", "AI Engineers", "Rust & Solidity", "Full-Stack React"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold cursor-pointer border transition-all duration-300 shadow-md ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-violet-500 shadow-violet-500/10'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800/80 hover:text-slate-200 hover:border-slate-700/80'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Freelancer Grid Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredFreelancers.map((freelancer) => (
              <div 
                key={freelancer.id} 
                className="glass-panel p-6 rounded-2xl flex flex-col justify-between group hover:border-slate-700/80 hover:-translate-y-1 transition-all duration-300 relative"
              >
                {/* Accent glow on card hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />

                <div>
                  {/* Top Row: Initial Avatar and Availability Status */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-slate-800 flex items-center justify-center font-bold text-lg text-white group-hover:scale-105 transition-transform duration-200">
                      {freelancer.initials}
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      {/* Availability */}
                      <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 rounded-full px-2 py-0.5">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                        Available Now
                      </span>

                      {/* Match confidence */}
                      <span className="text-[10px] font-bold text-violet-300 bg-violet-950/40 border border-violet-500/30 rounded-full px-2 py-0.5">
                        {freelancer.match}% Match
                      </span>
                    </div>
                  </div>

                  {/* Name and Role */}
                  <h4 className="text-lg font-bold text-white mb-0.5">{freelancer.name}</h4>
                  <p className="text-xs font-semibold text-violet-400/90 mb-3">{freelancer.role}</p>

                  {/* Bio */}
                  <p className="text-xs text-slate-400 leading-relaxed mb-5 min-h-[50px]">
                    {freelancer.bio}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {freelancer.skills.map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rating and Rate / Hiring Button */}
                <div className="border-t border-slate-900 pt-4 flex items-center justify-between mt-auto">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{freelancer.rating}</span>
                      <span className="text-slate-500 text-[10px] font-medium">({freelancer.jobs} jobs)</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-400">
                      <span className="text-slate-100 font-extrabold text-sm">${freelancer.rate}</span>/hr
                    </div>
                  </div>

                  <button 
                    onClick={() => handleStartHiring(freelancer)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-gradient-to-r hover:from-violet-600 hover:to-indigo-600 hover:text-white border border-slate-800 hover:border-transparent text-slate-200 text-xs font-semibold cursor-pointer transition-all duration-200 active:scale-95 shadow-md"
                  >
                    <span>Instant Match</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 5: MINIMAL 3-COLUMN FOOTER */}
      <footer className="relative border-t border-slate-900/60 bg-slate-950 overflow-hidden z-10">

        {/* Ambient radial glow — soft backlighting from below */}
        <div className="pointer-events-none absolute inset-0 -z-0">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[320px] rounded-full bg-violet-700/5 blur-[120px]" />
          <div className="absolute -bottom-10 left-[15%] w-[420px] h-[220px] rounded-full bg-indigo-600/6 blur-[100px]" />
          <div className="absolute -bottom-10 right-[15%] w-[380px] h-[200px] rounded-full bg-violet-500/4 blur-[90px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-14 sm:py-16">

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 items-start">

            {/* ── Column 1: Brand & Copyright ── */}
            <div className="flex flex-col gap-4">
              {/* Logo */}
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="inline-flex items-center gap-2.5 group w-fit"
                aria-label="FreelanceAI — Back to top"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform duration-200">
                  <Cpu className="w-4 h-4 text-white" />
                </div>
                <span className="text-base font-bold tracking-tight text-white">
                  Freelance<span className="text-violet-400 font-extrabold">AI</span>
                </span>
              </a>

              {/* Tagline */}
              <p className="text-[11px] leading-[1.65] text-slate-500 max-w-[220px]">
                Automated talent matchmaking powered by AI, verified code audits, and on-chain escrow releases.
              </p>

              {/* Copyright */}
              <p className="text-[10px] font-medium text-slate-600 tracking-tight mt-1">
                &copy; {new Date().getFullYear()} FreelanceAI Technologies Inc.
                <br />All rights reserved.
              </p>
            </div>

            {/* ── Column 2: Hover-active Nav Links ── */}
            <div className="flex flex-col items-start sm:items-center gap-1.5">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600 mb-3">Navigate</p>

              {[
                { label: 'About', href: '#' },
                { label: 'Contact', href: '#' },
                { label: 'GitHub', href: 'https://github.com', external: true },
              ].map(({ label, href, external }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  onClick={!external ? (e) => e.preventDefault() : undefined}
                  className="relative inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200 group py-0.5"
                >
                  {label === 'GitHub' && (
                    <GithubIcon className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors duration-200" />
                  )}
                  <span>{label}</span>
                  {/* Sliding underline on hover */}
                  <span className="absolute -bottom-px left-0 h-px w-0 bg-gradient-to-r from-violet-400 to-indigo-400 group-hover:w-full transition-all duration-300 ease-out rounded-full" />
                </a>
              ))}
            </div>

            {/* ── Column 3: System Status & Legal ── */}
            <div className="flex flex-col items-start sm:items-end gap-3">
              {/* Live system status badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/20 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[10px] font-semibold text-emerald-400 tracking-wide">All Systems Operational</span>
              </div>

              {/* Legal links */}
              <div className="flex items-center gap-4 flex-wrap justify-start sm:justify-end mt-1">
                {['Terms of Service', 'Privacy Policy', 'Security'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-[10px] font-medium text-slate-600 hover:text-slate-300 transition-colors duration-200"
                  >
                    {item}
                  </a>
                ))}
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-3 mt-1">
                <a href="#" onClick={(e) => e.preventDefault()} aria-label="Twitter" className="text-slate-600 hover:text-white transition-colors duration-200">
                  <TwitterIcon className="w-4 h-4" />
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-slate-600 hover:text-white transition-colors duration-200">
                  <GithubIcon className="w-4 h-4" />
                </a>
                <a href="#" onClick={(e) => e.preventDefault()} aria-label="LinkedIn" className="text-slate-600 hover:text-white transition-colors duration-200">
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

          {/* Hairline divider at very bottom */}
          <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-slate-800/70 to-transparent" />
        </div>
      </footer>

      {/* MOCKMATCH SIMULATOR WIZARD (MODAL) */}
      {hiringFreelancer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop Glassmorphism */}
          <div 
            onClick={() => setHiringFreelancer(null)}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800/80 rounded-2xl shadow-2xl p-6 overflow-hidden z-10">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-6.5 h-6.5 rounded-md bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center">
                  <Cpu className="w-3.5 h-3.5 text-white" />
                </div>
                <h3 className="text-sm font-bold text-white">AI-Powered Matchmaking Wizard</h3>
              </div>
              <button 
                onClick={() => setHiringFreelancer(null)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Selected Freelancer Header */}
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-900/60 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-violet-600/20 border border-violet-500/20 flex items-center justify-center font-bold text-violet-300">
                {hiringFreelancer.initials}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">{hiringFreelancer.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{hiringFreelancer.role} • <span className="text-violet-400 font-semibold">${hiringFreelancer.rate}/hr</span></p>
              </div>
            </div>

            {/* Steps Visual Tracker */}
            <div className="mt-6">
              <div className="grid grid-cols-4 gap-2 relative">
                
                {/* Horizontal Progress Lines */}
                <div className="absolute top-4.5 left-6 right-6 h-[2px] bg-slate-800 -z-1" />
                <div 
                  className="absolute top-4.5 left-6 h-[2px] bg-gradient-to-r from-violet-500 to-indigo-500 -z-1 transition-all duration-500" 
                  style={{ width: `${(matchingStep / 3) * 88}%` }}
                />

                {[
                  { title: "Identify", desc: "Select dev" },
                  { title: "Scan Specs", desc: "Match fit" },
                  { title: "Secure Funds", desc: "Escrow lock" },
                  { title: "Complete", desc: "Team invite" }
                ].map((step, idx) => {
                  const isCompleted = idx < matchingStep;
                  const isActive = idx === matchingStep;
                  return (
                    <div key={idx} className="flex flex-col items-center text-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-gradient-to-r from-violet-600 to-indigo-600 border-transparent text-white'
                          : isActive
                            ? 'bg-slate-950 border-2 border-violet-500 text-violet-400 shadow-md shadow-violet-500/10'
                            : 'bg-slate-950 border-2 border-slate-800 text-slate-500'
                      }`}>
                        {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span className={`text-[10px] font-bold mt-2 ${isActive ? 'text-violet-400' : isCompleted ? 'text-slate-300' : 'text-slate-500'}`}>{step.title}</span>
                      <span className="text-[8px] text-slate-500/80 mt-0.5 block">{step.desc}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Console Output Feed */}
            <div className="mt-6 bg-slate-950/80 border border-slate-900 rounded-xl p-4 font-mono text-[10px] text-slate-400 min-h-[140px] flex flex-col justify-between">
              
              <div className="space-y-1.5 max-h-[110px] overflow-y-auto">
                {simulationLogs.length === 0 && (
                  <div className="text-slate-600 animate-pulse">Initializing matcher runtime...</div>
                )}
                {simulationLogs.map((log, idx) => (
                  <div key={idx} className="animate-fade-in">
                    {log}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-slate-900 pt-2 text-[9px] text-slate-600 mt-2 font-sans">
                <span>MATCHER_LIVE_STREAM</span>
                <span>STEP {Math.min(matchingStep + 1, 4)} OF 4</span>
              </div>
            </div>

            {/* Footer Summary / Action CTA */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                {matchingStep < 4 ? (
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-ping" />
                    Simulating blockchain deployment...
                  </span>
                ) : (
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Match fully secured!
                  </span>
                )}
              </div>

              {matchingStep === 4 ? (
                <button
                  onClick={() => setHiringFreelancer(null)}
                  className="px-4.5 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold active:scale-95 transition-all shadow-md"
                >
                  Enter Workspace
                </button>
              ) : (
                <button
                  disabled
                  className="px-4.5 py-2.5 rounded-lg bg-slate-800 text-slate-500 text-xs font-bold cursor-not-allowed"
                >
                  Connecting...
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default LandingPage;
