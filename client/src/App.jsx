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

function App() {
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
          <a href="#" className="flex items-center gap-2.5 group">
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
            <a href="#" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-200">
              Login
            </a>
            <a 
              href="#freelancers" 
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
              <a href="#" className="text-center font-semibold text-slate-400 hover:text-white py-2">
                Login
              </a>
              <a 
                href="#freelancers" 
                onClick={() => setMobileMenuOpen(false)}
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
              href="#freelancers" 
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
              <span className="text-xs font-semibold text-slate-500 ml-2 select-none">WORKSPACE // AGENTIC_MATCHMAKER</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-950/60 border border-slate-800/80 rounded-md px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Matching Core v1.42</span>
            </div>
          </div>

          {/* Dashboard Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
            
            {/* Left Sidebar Mockup */}
            <div className="lg:col-span-3 flex flex-col gap-1.5">
              <div className="text-slate-500 text-[10px] font-bold px-2 py-1 uppercase tracking-widest">Navigation</div>
              {[
                { label: "AI Matcher Hub", icon: Cpu, active: true },
                { label: "Active Milestones", icon: Briefcase, count: 2 },
                { label: "Smart Escrows", icon: ShieldCheck, status: "Secure" },
                { label: "Commit Logs", icon: Terminal }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold cursor-default transition-all duration-200 ${
                    item.active 
                      ? 'bg-violet-600/15 border border-violet-500/30 text-violet-300' 
                      : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count && (
                    <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[9px] font-bold">{item.count}</span>
                  )}
                  {item.status && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[8px] font-bold uppercase tracking-wider">{item.status}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Middle Main Mockup Card */}
            <div className="lg:col-span-5 bg-slate-950/65 border border-slate-900/60 rounded-xl p-4.5 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">PROJECT PROFILE</h4>
                    <h3 className="text-sm font-bold text-white mt-1">Autonomous Neural Agents Pipeline</h3>
                  </div>
                  <div className="px-2 py-1 rounded bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold">
                    Active Spec
                  </div>
                </div>

                {/* Match metrics progress */}
                <div className="mt-5 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-400 mb-1">
                      <span>Semantic Spec Analysis</span>
                      <span className="text-violet-400 font-bold">98% Complete</span>
                    </div>
                    <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full w-[98%] bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-400 mb-1">
                      <span>Milestone Smart-Escrow</span>
                      <span className="text-emerald-400 font-bold">Deposited</span>
                    </div>
                    <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Alert Badge */}
              <div className="mt-4 p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-950/60 border border-violet-500/30 flex items-center justify-center text-violet-400">
                  <Cpu className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-slate-200">Match Completed</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Top Matched Agent: Dr. Evelyn Vance</div>
                </div>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 99% Fit
                </span>
              </div>
            </div>

            {/* Right Command Terminal stream */}
            <div className="lg:col-span-4 bg-black/55 border border-slate-900/60 rounded-xl p-4 font-mono text-[11px] leading-[1.4] text-slate-400 flex flex-col justify-between min-h-[220px]">
              <div className="space-y-1.5">
                <div className="text-slate-500 border-b border-slate-900 pb-1 flex justify-between font-sans text-[9px] uppercase tracking-wider font-bold">
                  <span>console_feed</span>
                  <span>status: streaming</span>
                </div>
                <div className="text-slate-500 mt-2">$ match --spec-id nlp_agent_092</div>
                <div className="text-slate-300 flex items-center gap-1.5">
                  <span className="text-violet-400 animate-pulse">●</span> Parsing requirements...
                </div>
                <div className="text-indigo-400">Found 3 candidates matching &quot;PyTorch, Agentic LLM&quot;</div>
                <div className="text-slate-300">Deploying smart escrow contract...</div>
                <div className="text-emerald-400">Escrow deployed: 0x71C84...a49d (5.0 ETH)</div>
                <div className="text-slate-500">$ listen github_webhook --active</div>
                <div className="text-slate-400">Commit 4f7c1d: Unit tests passed (100% green)</div>
                <div className="text-emerald-300 font-semibold">✓ Funds released to EV_dev</div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            
            {/* Feature 1: Neural Match Engine */}
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-slate-800 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 rounded-full blur-2xl group-hover:bg-violet-600/10 transition-colors duration-300" />
              <div className="w-11 h-11 rounded-xl bg-violet-950/50 border border-violet-500/30 flex items-center justify-center mb-5 text-violet-400">
                <Cpu className="w-5.5 h-5.5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Neural Match Engine</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Provide a plain-text prompt or your GitHub repository URL. Our semantic matching engine evaluates engineer profiles, codebase compatibility, and historical PR quality to hook up the ideal fit in under 15 seconds.
              </p>
            </div>

            {/* Feature 2: Smart Escrow */}
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-slate-800 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-2xl group-hover:bg-indigo-600/10 transition-colors duration-300" />
              <div className="w-11 h-11 rounded-xl bg-indigo-950/50 border border-indigo-500/30 flex items-center justify-center mb-5 text-indigo-400">
                <ShieldCheck className="w-5.5 h-5.5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Milestone Smart-Escrows</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Safeguard every budget dollar. Projects are split into milestone contracts. Escrow funds lock in sandbox contracts and release instantly when your test suites report green builds. No manual verification delays.
              </p>
            </div>

            {/* Feature 3: AI-Audited Portfolios */}
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-slate-800 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-2xl group-hover:bg-purple-600/10 transition-colors duration-300" />
              <div className="w-11 h-11 rounded-xl bg-purple-950/50 border border-purple-500/30 flex items-center justify-center mb-5 text-purple-400">
                <Code className="w-5.5 h-5.5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">AI-Audited Code Portfolios</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Zero fake resumes. Our system continuously reviews freelancers’ public GitHub activities, running sanity checks, performance checks, and formatting assessments. You receive raw metrics, not marketing claims.
              </p>
            </div>

            {/* Feature 4: Chat-to-Spec Composer */}
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-slate-800 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-600/5 rounded-full blur-2xl group-hover:bg-fuchsia-600/10 transition-colors duration-300" />
              <div className="w-11 h-11 rounded-xl bg-fuchsia-950/50 border border-fuchsia-500/30 flex items-center justify-center mb-5 text-fuchsia-400">
                <Sparkles className="w-5.5 h-5.5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Chat-to-Spec Composer</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Unsure how to frame your project specs? Just chat. The composer parses complex goals, maps dependencies, compiles a technical specifications sheet, and automatically segments tasks into incremental milestones.
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

      {/* SECTION 5: DARK GRADIENT FOOTER & NEWSLETTER */}
      <footer className="border-t border-slate-900 bg-slate-950 relative overflow-hidden z-10">
        
        {/* Newsletter Section */}
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
          
          <div className="glass-panel max-w-4xl mx-auto p-8 rounded-2xl relative overflow-hidden bg-gradient-to-b from-slate-900/60 to-slate-950/60 mb-20 text-center">
            
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

            <h3 className="text-2xl font-bold text-white mb-2">Join the Private Roster Release</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6.5">
              Subscribe to get immediate email updates when verified AI researchers and protocol developers check into the system.
            </p>

            <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                placeholder="Enter your work email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg bg-slate-950/80 border border-slate-800 text-sm placeholder:text-slate-600 text-white focus:outline-none focus:border-violet-500/80 transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white text-sm font-semibold active:scale-95 cursor-pointer transition-all duration-200 shadow-md shadow-violet-500/10"
              >
                Subscribe
              </button>
            </form>

            {newsletterSubscribed && (
              <p className="text-xs font-semibold text-emerald-400 mt-3.5 flex items-center justify-center gap-1.5 animate-fade-in">
                <CheckCircle2 className="w-4 h-4" /> Thank you for subscribing! Check your inbox shortly.
              </p>
            )}
          </div>

          {/* Footer Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16 text-left">
            
            {/* Logo Column */}
            <div className="col-span-2 lg:col-span-2 space-y-4">
              <a href="#" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center">
                  <Cpu className="w-4.5 h-4.5 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight text-white">
                  Freelance<span className="text-violet-400 font-extrabold">AI</span>
                </span>
              </a>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                A high-performance automated talent portal pairing machine-parsed requirements to verified specialists. Standardizing freelance development cycles via automated Smart Escrow code builds.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <a href="#" className="text-slate-500 hover:text-white transition-colors"><TwitterIcon className="w-4.5 h-4.5" /></a>
                <a href="#" className="text-slate-500 hover:text-white transition-colors"><GithubIcon className="w-4.5 h-4.5" /></a>
                <a href="#" className="text-slate-500 hover:text-white transition-colors"><LinkedinIcon className="w-4.5 h-4.5" /></a>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Product</h4>
              <ul className="space-y-2 text-xs text-slate-500">
                <li><a href="#features" className="hover:text-slate-200 transition-colors">Neural Matcher</a></li>
                <li><a href="#features" className="hover:text-slate-200 transition-colors">Smart Escrows</a></li>
                <li><a href="#features" className="hover:text-slate-200 transition-colors">Portfolios Auditing</a></li>
                <li><a href="#features" className="hover:text-slate-200 transition-colors">Release Timeline</a></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Platform</h4>
              <ul className="space-y-2 text-xs text-slate-500">
                <li><a href="#freelancers" className="hover:text-slate-200 transition-colors">Browse Talent</a></li>
                <li><a href="#" className="hover:text-slate-200 transition-colors">Security Sandbox</a></li>
                <li><a href="#" className="hover:text-slate-200 transition-colors">Developer Portal</a></li>
                <li><a href="#" className="hover:text-slate-200 transition-colors">System Metrics</a></li>
              </ul>
            </div>

            {/* Column 4 */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Company</h4>
              <ul className="space-y-2 text-xs text-slate-500">
                <li><a href="#" className="hover:text-slate-200 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-slate-200 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-slate-200 transition-colors">Press Kit</a></li>
                <li><a href="#" className="hover:text-slate-200 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

          </div>

          {/* Bottom copyright bar */}
          <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-slate-600 text-xs">
            <span>&copy; {new Date().getFullYear()} FreelanceAI Technologies Inc. All rights reserved.</span>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Security</a>
            </div>
          </div>

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

export default App;
