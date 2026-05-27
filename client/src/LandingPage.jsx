import { useState, useEffect } from 'react';
import {
  Cpu, Sparkles, ShieldCheck, ArrowRight, Star,
  CheckCircle2, X, Menu, Zap, Users,
  TrendingUp, Lock, Globe, ChevronRight, Database
} from 'lucide-react';

const FREELANCERS = [
  {
    id: 1, name: 'Dr. Evelyn Vance', role: 'AI & NLP Specialist', initials: 'EV',
    skills: ['PyTorch', 'LLMs', 'LangChain', 'Python'], rate: 125, jobs: 28, rating: 5.0, match: 99,
    bio: 'Former OpenAI researcher specializing in custom agentic workflows, fine-tuning, and neural reasoning pipelines.',
    category: 'AI Engineers',
  },
  {
    id: 2, name: 'Arjun Patel', role: 'Full-Stack React Architect', initials: 'AP',
    skills: ['Next.js', 'TypeScript', 'Tailwind', 'Node.js'], rate: 85, jobs: 64, rating: 4.9, match: 98,
    bio: 'Core contributor to major React frameworks. Excels in high-performance web apps and state design patterns.',
    category: 'Full-Stack',
  },
  {
    id: 3, name: 'Elena Rostova', role: 'Blockchain Protocol Engineer', initials: 'ER',
    skills: ['Rust', 'Solidity', 'Web3.js', 'EVM Audits'], rate: 110, jobs: 37, rating: 4.95, match: 97,
    bio: 'Specializes in secure smart contracts, cryptographic audits, and ultra-fast consensus layers in Rust.',
    category: 'Blockchain',
  },
  {
    id: 4, name: 'Marcus Chen', role: 'ML Platform Engineer', initials: 'MC',
    skills: ['Kubernetes', 'Docker', 'PyTorch', 'AWS Sagemaker'], rate: 135, jobs: 19, rating: 4.8, match: 96,
    bio: 'Optimizes cluster scheduling and distributed training for large-scale language and diffusion models.',
    category: 'AI Engineers',
  },
  {
    id: 5, name: 'Sarah Jenkins', role: 'Lead Product Designer', initials: 'SJ',
    skills: ['Figma', 'Tailwind CSS', 'React', 'Framer Motion'], rate: 90, jobs: 53, rating: 5.0, match: 99,
    bio: 'Designs and builds premium, interactive SaaS interfaces. Bridges the gap between design and modular code.',
    category: 'Full-Stack',
  },
  {
    id: 6, name: 'Hiroshi Tanaka', role: 'Cryptographic Protocol Architect', initials: 'HT',
    skills: ['Rust', 'Zero-Knowledge Proofs', 'Go', 'zk-Rollups'], rate: 150, jobs: 12, rating: 5.0, match: 95,
    bio: 'Focuses on privacy-preserving cryptographic primitives, ZK-Rollups, and layer-2 decentralized protocols.',
    category: 'Blockchain',
  },
];

const AVATAR_COLORS = [
  'from-red-650 to-red-800',
  'from-neutral-700 to-neutral-900',
  'from-red-700 to-neutral-800',
  'from-zinc-700 to-red-800',
  'from-rose-800 to-neutral-900',
  'from-red-900 to-zinc-800',
];

const FEATURES = [
  {
    icon: Cpu, color: 'indigo', title: 'AI Match Engine',
    desc: 'Our AI analyzes project scopes and matches verified freelancers whose actual codebases prove structural competency alignment.',
  },
  {
    icon: Sparkles, color: 'violet', title: 'Attestation Audit',
    desc: 'Automatically ranks and shortlists candidates based on verified skill tests, neural score indexes, and git history telemetry.',
  },
  {
    icon: CheckCircle2, color: 'emerald', title: 'Decentralized Attestations',
    desc: 'Independent skill validation utilizing zero-knowledge test sandboxes and verified technical stack benchmark score reports.',
  },
  {
    icon: ShieldCheck, color: 'amber', title: 'Escrow Ledger',
    desc: 'Smart contract milestone payments lock funds securely in escrow, auto-releasing payments when milestones compile successfully.',
  },
];

const STATS = [
  { value: '15s', label: 'Average Match Latency', icon: Zap },
  { value: '₹14.2M+', label: 'Escrow Transactions Secured', icon: TrendingUp },
  { value: '99.8%', label: 'Milestone Delivery Rate', icon: CheckCircle2 },
  { value: '2,400+', label: 'Vetted Engineers', icon: Users },
];

const TABS = ['All', 'AI Engineers', 'Full-Stack', 'Blockchain'];

const ACCENT = {
  indigo: { bg: 'bg-red-950/20', border: 'border-red-900/30', text: 'text-red-400', icon: 'bg-red-950/20' },
  violet: { bg: 'bg-slate-900/40', border: 'border-slate-800', text: 'text-slate-300', icon: 'bg-slate-900/40' },
  emerald: { bg: 'bg-red-950/20', border: 'border-red-900/20', text: 'text-red-400', icon: 'bg-red-950/20' },
  amber: { bg: 'bg-slate-900/30', border: 'border-slate-800/80', text: 'text-slate-450', icon: 'bg-slate-900/30' },
};

export default function LandingPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Simulation steps for pipeline editor
  const [activeStep, setActiveStep] = useState(0); // 0: Data, 1: Train, 2: Evaluate, 3: Deploy
  const [isSimulating, setIsSimulating] = useState(false);
  const [pipelineOutput, setPipelineOutput] = useState('System Idle. Ready for compilation.');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Neural simulation tick
  useEffect(() => {
    let timer;
    if (isSimulating) {
      timer = setInterval(() => {
        setActiveStep((prev) => {
          const next = (prev + 1) % 4;
          if (next === 0) {
            setPipelineOutput('Data ingested. Embeddings calculated (1536 dim).');
          } else if (next === 1) {
            setPipelineOutput('Rerank pipeline initialized. Cosine loss: 0.042.');
          } else if (next === 2) {
            setPipelineOutput('Attestation validated. Confidence score: 98.6%.');
          } else {
            setPipelineOutput('Deployment successful! Escrow contract initialized.');
          }
          return next;
        });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isSimulating]);

  const filtered = activeTab === 'All' ? FREELANCERS : FREELANCERS.filter(f => f.category === activeTab);

  return (
    <div className="min-h-screen bg-[#08080a] text-slate-100 relative overflow-x-hidden selection:bg-red-550/30 selection:text-red-200">

      {/* Stunning high-fidelity ambient mesh glows - Cinema theme */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-200px] left-[5%] w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-red-950/15 via-slate-950/10 to-red-950/5 blur-[150px] animate-pulse-glow" />
        <div className="absolute bottom-[-100px] right-[5%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-red-955/10 via-slate-955/5 to-slate-955/5 blur-[130px] animate-pulse-glow-reverse" />
        {/* Soft grid overlay for premium engineering tech aesthetic */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0f0f12]/85 backdrop-blur-xl border-b border-[#222227] shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
          : 'bg-transparent border-b border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <button onClick={() => onNavigate('landing')} className="flex items-center gap-2.5 group cursor-pointer bg-transparent border-none">
            <div className="w-9 h-9 rounded-xl bg-[#e50914] flex items-center justify-center shadow-lg shadow-red-500/10 group-hover:scale-105 transition-all duration-300">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-100 tracking-tight">
              Talent<span className="text-red-500">Stage</span>
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {[['#features', 'Features'], ['#simulator', 'Neural Match Simulator'], ['#freelancers', 'Talent Pool']].map(([href, label]) => (
              <a key={label} href={href} className="text-sm font-semibold text-slate-400 hover:text-slate-100 transition-colors relative group py-1">
                {label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => onNavigate('login')} className="text-sm font-semibold text-slate-400 hover:text-slate-100 transition-colors cursor-pointer bg-transparent border-none">
              Sign In
            </button>
            <button
              onClick={() => onNavigate('signup')}
              className="px-5 py-2.5 rounded-xl bg-[#e50914] hover:bg-[#b80710] text-white text-sm font-bold shadow-lg shadow-red-950/20 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border-none"
            >
              Sign Up Free
            </button>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer bg-transparent border-none">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0d0d10]/98 backdrop-blur-xl border-b border-[#222227] px-6 py-6 space-y-4 shadow-xl">
            {[['#features', 'Features'], ['#simulator', 'Match Simulator'], ['#freelancers', 'Talent Pool']].map(([href, label]) => (
              <a key={label} href={href} onClick={() => setMobileMenuOpen(false)} className="block text-base font-semibold text-slate-300 hover:text-white">{label}</a>
            ))}
            <div className="pt-2 space-y-3 border-t border-[#222227]">
              <button onClick={() => { setMobileMenuOpen(false); onNavigate('login'); }} className="w-full py-2.5 text-sm font-semibold text-slate-400 cursor-pointer bg-transparent border-none">Sign In</button>
              <button onClick={() => { setMobileMenuOpen(false); onNavigate('signup'); }} className="w-full py-3 bg-[#e50914] rounded-xl text-sm font-bold text-white cursor-pointer border-none">Get Started Free</button>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-6 text-center max-w-7xl mx-auto z-10">

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/40 border border-slate-800/80 text-red-400 text-xs font-semibold mb-8 shadow-sm">
          <Sparkles className="w-4 h-4 text-red-500" />
          AI-Powered Talent Matching — Built for Engineering Teams
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-100 leading-[1.15] tracking-tight mb-6 max-w-4xl mx-auto">
          Hire the Right Engineer,{' '}
          <span className="text-[#e50914]">
            Every Single Time
          </span>
        </h1>

        <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10 font-normal">
          TalentStage analyzes production commit history and verified attestations to pair your project scopes with top-tier engineers.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button
            onClick={() => onNavigate('signup')}
            className="flex items-center gap-2.5 px-8 py-4 rounded-xl bg-[#e50914] hover:bg-[#b80710] text-white text-base font-bold shadow-xl shadow-red-950/20 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border-none"
          >
            Start Hiring Now
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => onNavigate('onboarding')}
            className="flex items-center gap-2.5 px-8 py-4 rounded-xl border border-[#222227] bg-[#121216]/50 backdrop-blur-md text-slate-300 hover:text-white hover:bg-slate-900 hover:border-slate-800 text-base font-semibold shadow-sm hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            Become a Freelancer
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400 font-medium select-none">
          {['No platform fees first 30 days', 'Verified engineers only', 'Smart escrow protection', 'Cancel anytime'].map((t) => (
            <span key={t} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-red-500" />
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────────────── */}
      <section id="stats" className="relative py-14 px-6 border-y border-[#1a1a20] bg-[#121216]/20 backdrop-blur-md select-none">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center group">
              <p className="text-4xl md:text-5xl font-extrabold text-slate-100 mb-2 group-hover:text-red-500 transition-colors">{s.value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────────── */}
      <section id="features" className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">
            <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-4">Platform Features</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-100 mb-4 leading-tight">
              Built for Serious Engineering Teams
            </h2>
            <p className="text-base text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
              We stripped away the noise. TalentStage gives you precision hiring tools backed by AI — not guesswork.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => {
              const a = ACCENT[f.color];
              return (
                <div key={f.title} className="relative p-7 rounded-2xl bg-[#121216]/40 border border-[#22222a] backdrop-blur-md hover:bg-[#121216]/80 hover:border-red-900/30 hover:shadow-[0_8px_30px_rgba(229,9,20,0.04)] hover:-translate-y-1.5 transition-all duration-300 group">
                  <div className={`w-12 h-12 rounded-xl ${a.icon} ${a.border} border flex items-center justify-center ${a.text} mb-5`}>
                    <f.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 mb-3">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-normal">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HIGH FIDELITY NEURAL MATCH SIMULATOR ────────────────── */}
      <section id="simulator" className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-12">
            <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-4">Live Interactive Simulation</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-100 leading-tight">Neural Match Vector Pipeline</h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto font-normal mt-2">
              Click the simulator buttons to run a live semantic alignment sequence for candidate matches.
            </p>
          </div>

          <div className="rounded-3xl border border-[#22222a] bg-[#121216]/20 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.4)] overflow-hidden">

            {/* Mock browser bar */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[#22222a] bg-[#121216]/40">
              <div className="flex gap-1.5 select-none">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex-1 mx-4 px-4 py-1.5 rounded-lg bg-slate-950/60 border border-slate-900 text-[11px] text-slate-400 font-semibold text-center">
                app.talentstage.io/welcome/neural-match-visualizer
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-400 bg-red-955/20 border border-red-900/30 px-2.5 py-0.5 rounded-full select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Active Telemetry
              </div>
            </div>

            {/* Premium Aesthetic Dashboard Mockup Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 md:p-8">

              {/* Sidebar Panel (Left) */}
              <div className="lg:col-span-3 rounded-2xl bg-[#121216]/40 border border-[#22222a] p-4 space-y-6">
                <div className="flex items-center gap-2.5 select-none">
                  <div className="w-8 h-8 rounded-lg bg-[#e50914] flex items-center justify-center shadow">
                    <Cpu className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-200 uppercase tracking-widest">Aether Engine</span>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-1 mb-2">Workspace</p>
                  {[
                    { label: 'Pipeline Editor', active: true, icon: Cpu },
                    { label: 'Attestation Center', active: false, icon: CheckCircle2 },
                    { label: 'Milestone Escrow', active: false, icon: Lock },
                    { label: 'Team Insights', active: false, icon: Users },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all select-none ${
                        item.active
                          ? 'bg-red-955/20 text-red-450 border border-red-900/30 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <item.icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Content Dashboard Frame (Right / Center) */}
              <div className="lg:col-span-9 space-y-6">
                
                {/* Dashboard Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 select-none pb-4 border-b border-[#22222a]">
                  <div>
                    <h3 className="text-base font-bold text-slate-100 tracking-tight leading-none">Welcome back, Alex!</h3>
                    <p className="text-[11px] text-slate-400 mt-1.5 font-medium">Attestation dashboard for Project AlphaGo</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => onNavigate('login')} className="px-3.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/40 text-xs font-semibold text-slate-300 hover:bg-slate-900 cursor-pointer">Login</button>
                    <button onClick={() => onNavigate('signup')} className="px-3.5 py-1.5 rounded-lg bg-[#e50914] hover:bg-[#b80710] text-white text-xs font-bold shadow-sm cursor-pointer border-none">Sign Up Free</button>
                  </div>
                </div>

                {/* Telemetry Stats Ribbon */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 select-none">
                  {[
                    { label: 'API Requests', val: '4.8M', change: '+12.5%', color: 'text-red-400' },
                    { label: 'Model Accuracy', val: '98.2%', change: 'active', color: 'text-slate-300' },
                    { label: 'Active Projects', val: '7', change: 'nominal', color: 'text-slate-300' },
                    { label: 'Server Status', val: 'Online', change: '15ms latency', color: 'text-emerald-400' },
                  ].map((s, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-[#121216]/40 border border-[#22222a] shadow-sm space-y-1">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</span>
                      <div className="flex items-baseline justify-between gap-1">
                        <span className="text-base font-bold text-slate-100 leading-none">{s.val}</span>
                        <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          idx === 0 ? 'bg-red-955/20 text-red-400' :
                          idx === 1 ? 'bg-slate-900 text-slate-350' :
                          idx === 2 ? 'bg-slate-950/60 text-slate-400' :
                          'bg-emerald-950/40 text-emerald-400'
                        }`}>
                          {s.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Neural Pipeline Simulator Visual Card */}
                <div className="p-6 rounded-3xl bg-[#121216]/40 border border-[#22222a] shadow-sm space-y-6">
                  
                  {/* Pipeline Title */}
                  <div className="flex justify-between items-center select-none">
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Active Pipeline Builder</span>
                    <span className="px-2.5 py-1 rounded-full bg-red-955/20 border border-red-900/30 text-[9px] font-bold text-red-400 tracking-wide">
                      Transformer-X12
                    </span>
                  </div>

                  {/* Flow Diagram (SVG connections overlay & HTML buttons) */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-4 relative">
                    
                    {/* SVG Connector Lines in Background */}
                    <div className="absolute inset-0 pointer-events-none hidden md:block select-none">
                      <svg className="w-full h-full" viewBox="0 0 600 100" fill="none">
                        <path d="M120 20 C200 20, 220 50, 300 50 M120 50 C200 50, 220 50, 300 50 M120 80 C200 80, 220 50, 300 50 M300 50 L480 50" stroke="#1c1c22" strokeWidth="1.8" />
                        <path d="M120 50 C200 50, 220 50, 300 50" stroke="url(#redGrad)" strokeWidth="1.8" strokeDasharray="6 4" className="animate-dash" />
                        <defs>
                          <linearGradient id="redGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#e50914" />
                            <stop offset="100%" stopColor="#7f1d1d" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>

                    {/* Left Blocks */}
                    <div className="flex flex-col gap-2.5 w-full md:w-44 select-none relative z-10">
                      {[
                        { label: 'Data Ingestion', stepIdx: 0, icon: Database },
                        { label: 'Rerank Pipeline', stepIdx: 1, icon: Cpu },
                        { label: 'Evaluation Matrix', stepIdx: 2, icon: CheckCircle2 },
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => { setActiveStep(item.stepIdx); setIsSimulating(false); }}
                          className={`p-2.5 rounded-xl border text-left shadow-sm flex items-center gap-2 cursor-pointer transition-all duration-200 ${
                            activeStep === item.stepIdx
                              ? 'bg-slate-900 border-red-500 shadow-md ring-1 ring-red-500/10'
                              : 'bg-slate-950 border-[#22222a] hover:border-slate-800'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${activeStep === item.stepIdx ? 'bg-[#e50914] text-white' : 'bg-slate-900 text-slate-400'}`}>
                            <item.icon className="w-3 h-3" />
                          </div>
                          <span className="text-xs font-semibold text-slate-300 truncate">{item.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Glowing Center Processor Ring */}
                    <div className="w-16 h-16 rounded-full bg-red-955/20 border-2 border-red-900/30 flex items-center justify-center shadow-lg relative group shrink-0 animate-pulse-glow z-10">
                      <div className="absolute inset-0.5 rounded-full bg-gradient-to-tr from-red-600 to-red-800 flex items-center justify-center text-white font-bold shadow">
                        <Sparkles className="w-6 h-6 animate-spin-slow" />
                      </div>
                    </div>

                    {/* Right Block */}
                    <div className="w-full md:w-40 select-none relative z-10">
                      <button
                        onClick={() => { setActiveStep(3); setIsSimulating(false); }}
                        className={`w-full p-3 rounded-xl border text-center shadow flex items-center justify-center gap-2 cursor-pointer font-bold transition-all duration-200 ${
                          activeStep === 3
                            ? 'border-emerald-500 bg-emerald-950/45 text-emerald-400'
                            : 'border-red-900 bg-red-950/20 text-red-400 hover:bg-red-955/35'
                        }`}
                      >
                        <Zap className="w-4 h-4 text-red-500" />
                        <span className="text-xs font-bold">Deploy Live</span>
                      </button>
                    </div>

                  </div>

                  {/* Simulator Control Box */}
                  <div className="pt-4 border-t border-[#22222a] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => setIsSimulating(!isSimulating)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 border cursor-pointer ${
                          isSimulating
                            ? 'bg-rose-950/40 border-rose-900/50 text-rose-400 hover:bg-rose-955/50'
                            : 'bg-[#e50914] border-red-500 text-white hover:bg-[#b80710] shadow-sm'
                        }`}
                      >
                        {isSimulating ? 'Pause Simulation' : 'Run Autopilot'}
                      </button>
                      <button
                        onClick={() => { setActiveStep(0); setIsSimulating(false); setPipelineOutput('System Idle. Ready for compilation.'); }}
                        className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                    
                    {/* Live Output Feed console */}
                    <div className="flex-1 w-full sm:w-auto p-2.5 rounded-xl bg-slate-955 border border-slate-900 font-mono text-[11px] text-slate-300 flex items-center gap-2 overflow-x-auto shadow-inner select-none">
                      <span className="text-red-400">console.log:</span>
                      <span className="text-emerald-400 truncate animate-fadeIn" key={pipelineOutput}>{pipelineOutput}</span>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FREELANCER GRID ────────────────────────────────────────────────── */}
      <section id="freelancers" className="py-24 px-6 border-t border-[#22222a]">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-12">
            <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-4">Talent Pool</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-100 mb-4 leading-tight">
              Top Engineers Available Now
            </h2>
            <p className="text-base text-slate-400 max-w-xl mx-auto font-normal">
              Every engineer is AI-verified and ready to deliver. Browse by expertise.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#e50914] text-white border-red-500 shadow-lg shadow-red-500/10'
                    : 'bg-[#121216]/40 text-slate-400 border-slate-850 hover:text-slate-200 hover:border-slate-800 hover:bg-[#121216]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Freelancer cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((f, idx) => (
              <div key={f.id} className="flex flex-col p-6 rounded-2xl bg-[#121216]/40 border border-[#22222a] backdrop-blur-md hover:bg-[#121216]/80 hover:border-red-900/30 hover:shadow-[0_8px_30px_rgba(229,9,20,0.04)] hover:-translate-y-1.5 transition-all duration-300 group">

                {/* Header */}
                <div className="flex items-start justify-between mb-5 select-none">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} flex items-center justify-center text-base font-black text-white shadow-md`}>
                    {f.initials}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 rounded-full px-3 py-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      Available
                    </span>
                    <span className="text-xs font-bold text-red-400 bg-red-955/20 border border-red-900/30 rounded-full px-3 py-1">
                      {f.match}% Match
                    </span>
                  </div>
                </div>

                {/* Name & role */}
                <h3 className="text-lg font-bold text-slate-100 mb-0.5">{f.name}</h3>
                <p className="text-sm font-semibold text-red-500 mb-3">{f.role}</p>
                <p className="text-sm text-slate-400 leading-relaxed mb-5 flex-1 font-normal">{f.bio}</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {f.skills.map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-900 text-xs font-semibold text-slate-400">
                      {s}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-[#22222a]">
                  <div>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-200 mb-0.5">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                      {f.rating}
                      <span className="text-slate-500 text-xs font-normal">({f.jobs} jobs)</span>
                    </div>
                    <p className="text-sm text-slate-400 font-medium">
                      <span className="text-slate-200 font-bold text-base">${f.rate}</span>/hr
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('signup')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-[#e50914] border border-slate-850 hover:border-red-650 text-slate-300 hover:text-white text-sm font-bold transition-all cursor-pointer"
                  >
                    Hire Now
                    <ArrowRight className="w-4 h-4 animate-pulse" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* CTA below grid */}
          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('skill-match')}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-[#e50914] hover:bg-[#b80710] text-white font-bold shadow-xl shadow-red-955/20 hover:scale-105 transition-all cursor-pointer border-none"
            >
              <Sparkles className="w-5 h-5 animate-spin-slow" />
              View All Engineers &amp; AI Rankings
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ── MINIMALIST TRUST & SECURITY COMPLIANCE BADGES ────────────────── */}
      <section className="py-24 px-6 border-t border-[#22222a] bg-[#121216]/10">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          
          <div className="space-y-4 select-none">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-955/20 border border-red-900/30 text-red-400 text-sm font-semibold">
              <Globe className="w-4 h-4 text-red-400" />
              Trusted by 200+ Enterprise Engineering Teams
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-100 leading-tight">
              Ready to Hire Smarter?
            </h2>
            <p className="text-base text-slate-400 font-normal max-w-2xl mx-auto leading-relaxed">
              Join leading engineering organizations who streamlined developer matchmaking and secured payment flows using TalentStage.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <button
              onClick={() => onNavigate('signup')}
              className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#e50914] hover:bg-[#b80710] text-white font-bold text-base shadow-xl shadow-red-955/20 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border-none"
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('login')}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-slate-850 bg-slate-950 text-slate-350 hover:text-white hover:bg-slate-900 hover:border-slate-800 font-bold shadow-sm hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              Sign In to Your Account
            </button>
          </div>

          {/* High-Tech Security Compliance Badges */}
          <div className="pt-8 border-t border-[#22222a] select-none">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Security, Compliance, &amp; Enterprise-Ready</p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-75">
              {[
                { label: 'SOC2 Type II Certified', desc: 'Enterprise trust' },
                { label: 'HIPAA Compliant', desc: 'Secure data layers' },
                { label: 'GDPR Compliant', desc: 'Strict user privacy' },
                { label: 'ISO 27001 Certified', desc: 'Security protocol' },
              ].map((badge, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-slate-500" />
                  <div className="text-left leading-none">
                    <span className="text-[11px] font-bold text-slate-350 tracking-tight block">{badge.label}</span>
                    <span className="text-[9px] font-semibold text-slate-500">{badge.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#22222a] bg-[#0d0d10]/60 py-12 px-6 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div className="sm:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#e50914] flex items-center justify-center shadow-md">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-100">Talent<span className="text-red-500">Stage</span></span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed font-normal">
                AI-powered engineering talent marketplace. Built for teams that ship.
              </p>
            </div>

            {/* Links */}
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'How It Works', 'API'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Security'] },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-sm font-bold text-slate-200 mb-4">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-sm text-slate-400 hover:text-red-400 font-semibold transition-colors">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          </div>

          <div className="border-t border-[#22222a] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500 font-medium">
              © 2025 TalentStage, Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-450 font-semibold select-none">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              SOC 2 Type II · End-to-End Encrypted
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
