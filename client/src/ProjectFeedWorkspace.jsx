import { useState, useMemo } from 'react';
import {
  Cpu, ArrowLeft, Search, Filter, Sparkles, CheckCircle2, Star,
  Clock, DollarSign, Calendar, Briefcase, ChevronDown, Code2,
  Globe, ArrowRight, Check, ShieldCheck, Award, ExternalLink,
  TrendingUp, Zap, MessageSquare, Send, User
} from 'lucide-react';

// ─── Project Feed Data ─────────────────────────────────────────────────────
const ALL_PROJECTS = [
  {
    id: 1,
    title: 'EIP-4337 Account Abstraction Wallet SDK',
    client: 'ConsenSys Labs',
    postedAgo: '2 hours ago',
    description:
      'Build a production-grade Account Abstraction SDK on top of ERC-4337 supporting bundlers, paymasters, and entry-point factory contracts. The SDK must expose typed TypeScript interfaces and pass a full Hardhat test suite before deployment on Polygon zkEVM.',
    skills: ['Solidity', 'TypeScript', 'ERC-4337', 'Hardhat', 'Polygon zkEVM'],
    budget: '₹1,40,000',
    deadline: 'July 10, 2026',
    category: 'Smart Contracts',
    match: 97,
    proposals: 14,
    budgetRange: 'high',
  },
  {
    id: 2,
    title: 'Real-time Collaborative Code Review Platform',
    client: 'GitOps Ventures',
    postedAgo: '5 hours ago',
    description:
      'Design and implement a low-latency, browser-native collaborative code review interface using CRDTs for conflict-free concurrent edits. Back-end streaming via WebSockets (Fastify) and Monaco Editor on the front-end. CI badge integration required.',
    skills: ['Next.js', 'FastAPI', 'WebSockets', 'Monaco Editor', 'Redis'],
    budget: '₹95,000',
    deadline: 'June 30, 2026',
    category: 'Full-Stack',
    match: 91,
    proposals: 22,
    budgetRange: 'mid',
  },
  {
    id: 3,
    title: 'AI-Powered Resume Screening Microservice',
    client: 'TalentStage LLC',
    postedAgo: '1 day ago',
    description:
      'Develop a containerised Python microservice powered by a fine-tuned LLM that parses, scores and rank-orders candidate resumes against job descriptions. Must expose a REST API, include async job queuing with Celery + Redis, and ship a Grafana dashboard for observability.',
    skills: ['Python', 'FastAPI', 'LangChain', 'Docker', 'Celery', 'PostgreSQL'],
    budget: '₹78,000',
    deadline: 'July 5, 2026',
    category: 'AI / ML',
    match: 88,
    proposals: 31,
    budgetRange: 'mid',
  },
  {
    id: 4,
    title: 'Cross-chain Liquidity Bridge Protocol',
    client: 'Aave Governance DAO',
    postedAgo: '2 days ago',
    description:
      'Architect and audit a decentralised cross-chain asset bridge supporting Ethereum, Arbitrum, and Base. Implementation must use LayerZero message passing, an on-chain oracle for price feeds, and include a formal security audit report before mainnet deployment.',
    skills: ['Rust', 'Solidity', 'LayerZero', 'Go', 'Chainlink'],
    budget: '₹2,20,000',
    deadline: 'Aug 1, 2026',
    category: 'Smart Contracts',
    match: 94,
    proposals: 9,
    budgetRange: 'high',
  },
  {
    id: 5,
    title: 'Design System & Component Library Audit',
    client: 'Razorpay Engineering',
    postedAgo: '3 days ago',
    description:
      'Conduct a comprehensive audit of an existing React component library, migrate all components to Radix UI primitives with WAI-ARIA compliance, generate Storybook documentation, and publish to a private npm registry. Tailwind CSS v4 theming required.',
    skills: ['React', 'Tailwind CSS', 'Radix UI', 'Storybook', 'TypeScript'],
    budget: '₹55,000',
    deadline: 'June 22, 2026',
    category: 'Frontend',
    match: 85,
    proposals: 18,
    budgetRange: 'low',
  },
];

// ─── Top AI Freelancer Matches (for detail view) ───────────────────────────
const AI_CANDIDATE_MATCHES = [
  {
    id: 1,
    name: 'Dr. Evelyn Vance',
    role: 'AI & Agentic NLP Specialist',
    initials: 'EV',
    rating: 5.0,
    jobs: 28,
    verifiedSkills: 8,
    match: 99,
    gradient: 'from-violet-600/40 to-indigo-500/30',
    borderColor: 'border-violet-500/30',
    matchColor: 'text-violet-400',
    barColor: 'from-violet-600 to-indigo-500',
    isTopPick: true,
  },
  {
    id: 2,
    name: 'Elena Rostova',
    role: 'Rust & Solidity Protocol Engineer',
    initials: 'ER',
    rating: 4.95,
    jobs: 37,
    verifiedSkills: 7,
    match: 95,
    gradient: 'from-indigo-600/40 to-violet-500/30',
    borderColor: 'border-indigo-500/30',
    matchColor: 'text-indigo-400',
    barColor: 'from-indigo-600 to-violet-500',
    isTopPick: false,
  },
  {
    id: 3,
    name: 'Marcus Chen',
    role: 'ML Platform & GPU Engineer',
    initials: 'MC',
    rating: 4.8,
    jobs: 19,
    verifiedSkills: 6,
    match: 89,
    gradient: 'from-fuchsia-600/30 to-indigo-600/20',
    borderColor: 'border-fuchsia-500/30',
    matchColor: 'text-fuchsia-400',
    barColor: 'from-fuchsia-600 to-violet-600',
    isTopPick: false,
  },
];

// ─── Proposal Queue entries (for detail view) ──────────────────────────────
const PROPOSALS = [
  {
    id: 1,
    name: 'Dr. Evelyn Vance',
    initials: 'EV',
    bid: '₹1,35,000',
    timeline: '18 days',
    coverSnippet:
      'I have architected five production-grade ERC-4337 bundler infrastructures for leading Web3 protocols. My approach leverages gas-optimised entry-point factories, modular paymaster strategies, and a layered TypeScript SDK that achieves 3× faster developer onboarding.',
    aiScore: 98,
    aiLabel: 'Clarity Fit',
    gradient: 'from-violet-600/40 to-indigo-500/30',
  },
  {
    id: 2,
    name: 'Elena Rostova',
    initials: 'ER',
    bid: '₹1,28,000',
    timeline: '21 days',
    coverSnippet:
      'Specialist in Solidity protocol engineering and formal verification using Certora. Delivered the Aave v3 bridge contract suite reviewed by OpenZeppelin. My SDK design pattern uses discriminated union types for zero-runtime errors at the paymaster boundary.',
    aiScore: 95,
    aiLabel: 'Technical Depth',
    gradient: 'from-indigo-600/40 to-violet-500/30',
  },
  {
    id: 3,
    name: 'Arjun Patel',
    initials: 'AP',
    bid: '₹98,000',
    timeline: '24 days',
    coverSnippet:
      'Full-stack blockchain engineer with 4 years on Polygon zkEVM tooling. Built an open-source ERC-4337 relayer service with 99.97% uptime. Comfortable leading both the Hardhat test harness design and the TypeScript public API surface alignment.',
    aiScore: 88,
    aiLabel: 'Budget Fit',
    gradient: 'from-emerald-600/30 to-indigo-600/20',
  },
];

// ─── Star Rating helper ────────────────────────────────────────────────────
function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i < full ? 'text-amber-400 fill-amber-400' : half && i === full ? 'text-amber-400 fill-amber-400/50' : 'text-slate-700'}`}
        />
      ))}
      <span className="ml-1 text-[9px] font-bold text-slate-500">{rating.toFixed(2)}</span>
    </div>
  );
}

// ─── Match % Badge ─────────────────────────────────────────────────────────
function MatchBadge({ match }) {
  const color =
    match >= 95
      ? { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', dot: 'bg-emerald-400' }
      : match >= 88
      ? { text: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/25', dot: 'bg-violet-400' }
      : { text: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/25', dot: 'bg-indigo-400' };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-extrabold uppercase tracking-wider select-none ${color.text} ${color.bg} ${color.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${color.dot}`} />
      {match}% Match
    </span>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function ProjectFeedWorkspace({ onNavigate }) {
  const [view, setView] = useState('feed'); // 'feed' | 'details'
  const [selectedProject, setSelectedProject] = useState(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSkill, setFilterSkill] = useState('all');
  const [filterBudget, setFilterBudget] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Proposal accept state
  const [acceptedProposal, setAcceptedProposal] = useState(null);

  // Proposal submission modal
  const [submitting, setSubmitting] = useState(null);
  const [submitted, setSubmitted] = useState(null);

  // Hire modal
  const [hiring, setHiring] = useState(false);
  const [hired, setHired] = useState(null);

  // Computed filtered feed
  const filteredProjects = useMemo(() => {
    return ALL_PROJECTS.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.skills.some((s) => s.toLowerCase().includes(q));
      const matchesSkill =
        filterSkill === 'all' || p.skills.some((s) => s.toLowerCase().includes(filterSkill.toLowerCase()));
      const matchesBudget = filterBudget === 'all' || p.budgetRange === filterBudget;
      const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
      return matchesSearch && matchesSkill && matchesBudget && matchesCategory;
    });
  }, [searchQuery, filterSkill, filterBudget, filterCategory]);

  const openDetails = (project) => {
    setSelectedProject(project);
    setAcceptedProposal(null);
    setHired(null);
    setView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitProposal = (projectId) => {
    setSubmitting(projectId);
    setTimeout(() => {
      setSubmitting(null);
      setSubmitted(projectId);
      setTimeout(() => setSubmitted(null), 3000);
    }, 1400);
  };

  const handleHire = (candidate) => {
    setHiring(true);
    setTimeout(() => {
      setHiring(false);
      setHired(candidate);
    }, 1200);
  };

  const handleAcceptProposal = (proposalId) => {
    setAcceptedProposal(proposalId);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden selection:bg-violet-500/30 selection:text-violet-200">
      {/* ── Ambient glows ── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-10 right-[-60px] w-[540px] h-[540px] rounded-full bg-violet-700/6 blur-[130px] animate-pulse-glow" />
        <div className="absolute bottom-[-60px] left-[-40px] w-[500px] h-[480px] rounded-full bg-indigo-700/5 blur-[110px] animate-pulse-glow-reverse" />
      </div>

      {/* ── Top Nav Bar ── */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {view === 'details' && (
              <button
                onClick={() => setView('feed')}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-white transition-colors cursor-pointer group select-none mr-2"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
                <span>Back to Feed</span>
              </button>
            )}
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2 group cursor-pointer select-none"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform duration-200">
                <Cpu className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Freelance<span className="text-violet-400 font-extrabold">AI</span>
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500">
            <button
              onClick={() => setView('feed')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer select-none ${view === 'feed' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'hover:text-slate-200'}`}
            >
              Project Feed
            </button>
            <button
              onClick={() => onNavigate('client-dashboard')}
              className="px-3 py-1.5 rounded-lg hover:text-slate-200 transition-all cursor-pointer select-none"
            >
              Client Dashboard
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-3 py-1.5 rounded-lg hover:text-slate-200 transition-all cursor-pointer select-none"
            >
              My Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* PAGE 8 — PROJECT FEED                                          */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {view === 'feed' && (
          <div className="space-y-8">

            {/* Page header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white leading-tight">
                  Browse Open Projects
                </h1>
                <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                  AI-curated contracts matched to your verified skill attestations and proposal history.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 select-none">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-400">{filteredProjects.length} contracts available</span>
              </div>
            </div>

            {/* ── Top Filter / Search Bar ── */}
            <div className="flex flex-col lg:flex-row gap-3 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl shadow-lg">

              {/* Search */}
              <div className="relative flex-1 group">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-600 group-focus-within:text-indigo-400 transition-colors pointer-events-none">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search projects, clients, technologies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="
                    w-full pl-10 pr-4 py-2.5 rounded-xl
                    bg-slate-950 border border-slate-800
                    text-sm text-white placeholder:text-slate-700
                    focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50
                    hover:border-slate-700 transition-all duration-200
                  "
                />
              </div>

              {/* Skills Filter */}
              <div className="relative">
                <select
                  value={filterSkill}
                  onChange={(e) => setFilterSkill(e.target.value)}
                  className="
                    pl-3.5 pr-8 py-2.5 rounded-xl
                    bg-slate-950 border border-slate-800
                    text-xs text-slate-300 appearance-none cursor-pointer
                    focus:outline-none focus:border-indigo-500 hover:border-slate-700
                    transition-all duration-200
                  "
                >
                  <option value="all">All Skills</option>
                  <option value="Solidity">Solidity</option>
                  <option value="TypeScript">TypeScript</option>
                  <option value="Python">Python</option>
                  <option value="Rust">Rust</option>
                  <option value="Next.js">Next.js</option>
                  <option value="React">React</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Budget Filter */}
              <div className="relative">
                <select
                  value={filterBudget}
                  onChange={(e) => setFilterBudget(e.target.value)}
                  className="
                    pl-3.5 pr-8 py-2.5 rounded-xl
                    bg-slate-950 border border-slate-800
                    text-xs text-slate-300 appearance-none cursor-pointer
                    focus:outline-none focus:border-indigo-500 hover:border-slate-700
                    transition-all duration-200
                  "
                >
                  <option value="all">Budget Range</option>
                  <option value="low">₹30k–₹80k</option>
                  <option value="mid">₹80k–₹1.5L</option>
                  <option value="high">₹1.5L+</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="
                    pl-3.5 pr-8 py-2.5 rounded-xl
                    bg-slate-950 border border-slate-800
                    text-xs text-slate-300 appearance-none cursor-pointer
                    focus:outline-none focus:border-indigo-500 hover:border-slate-700
                    transition-all duration-200
                  "
                >
                  <option value="all">All Categories</option>
                  <option value="Smart Contracts">Smart Contracts</option>
                  <option value="Full-Stack">Full-Stack</option>
                  <option value="AI / ML">AI / ML</option>
                  <option value="Frontend">Frontend</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Active filters indicator */}
              <button
                onClick={() => { setSearchQuery(''); setFilterSkill('all'); setFilterBudget('all'); setFilterCategory('all'); }}
                className="flex items-center gap-2 py-2.5 px-4 rounded-xl border border-slate-800 text-xs font-bold text-slate-500 hover:text-slate-200 hover:border-slate-700 transition-all cursor-pointer select-none whitespace-nowrap"
              >
                <Filter className="w-3.5 h-3.5" />
                Clear Filters
              </button>
            </div>

            {/* ── Project Card Grid ── */}
            {filteredProjects.length === 0 ? (
              <div className="text-center py-24 space-y-3">
                <Search className="w-10 h-10 text-slate-700 mx-auto" />
                <p className="text-sm font-bold text-slate-500">No contracts match your active filters.</p>
                <p className="text-xs text-slate-700">Try broadening your search or resetting filters.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="
                      relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-xl shadow-lg p-6
                      hover:border-indigo-500/30 hover:shadow-[0_6px_30px_-8px_rgba(99,102,241,0.15)]
                      transition-all duration-300 group
                    "
                  >
                    {/* Subtle top sheen */}
                    <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white/[0.015] to-transparent pointer-events-none" />

                    <div className="flex flex-col lg:flex-row gap-6 lg:items-start">

                      {/* Main content area */}
                      <div className="flex-1 min-w-0 space-y-4">

                        {/* Header row */}
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-500">
                                {project.category}
                              </span>
                              <span className="text-[9px] text-slate-600 font-medium flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {project.postedAgo}
                              </span>
                            </div>
                            <h2 className="text-base font-extrabold tracking-tight text-white group-hover:text-indigo-400 transition-colors leading-snug">
                              {project.title}
                            </h2>
                            <p className="text-xs font-semibold text-slate-500 mt-0.5">
                              Posted by <span className="text-indigo-400">{project.client}</span>
                            </p>
                          </div>

                          {/* Match badge — prominent placement */}
                          <MatchBadge match={project.match} />
                        </div>

                        {/* Description — 2-line clamp */}
                        <p className="text-[12.5px] text-slate-400 leading-relaxed line-clamp-2">
                          {project.description}
                        </p>

                        {/* Telemetry row: skills + metadata pills */}
                        <div className="flex flex-wrap items-center gap-2">
                          {project.skills.map((skill) => (
                            <span
                              key={skill}
                              className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400 select-none"
                            >
                              {skill}
                            </span>
                          ))}
                          <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 px-2.5 py-0.5 rounded-full bg-indigo-950/30 border border-indigo-900/40 select-none">
                            <DollarSign className="w-3 h-3" />
                            {project.budget}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 select-none">
                            <Calendar className="w-3 h-3" />
                            Due {project.deadline}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 select-none">
                            <Send className="w-3 h-3" />
                            {project.proposals} proposals
                          </span>
                        </div>
                      </div>

                      {/* Action buttons — stacked vertically on the right */}
                      <div className="flex lg:flex-col gap-3 shrink-0 lg:min-w-[160px]">
                        <button
                          onClick={() => openDetails(project)}
                          className="
                            flex-1 lg:flex-none py-2.5 px-5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300
                            hover:bg-slate-800/50 hover:border-slate-600 hover:text-white
                            active:scale-[0.98] transition-all duration-200 cursor-pointer select-none
                            flex items-center justify-center gap-1.5
                          "
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View Project
                        </button>
                        <button
                          onClick={() => handleSubmitProposal(project.id)}
                          disabled={submitting === project.id || submitted === project.id}
                          className="
                            flex-1 lg:flex-none py-2.5 px-5 rounded-xl text-xs font-bold
                            bg-gradient-to-r from-indigo-600 to-violet-600
                            hover:brightness-110 active:scale-[0.98]
                            disabled:opacity-70 disabled:cursor-not-allowed
                            text-white shadow-md shadow-indigo-500/15
                            flex items-center justify-center gap-1.5
                            transition-all duration-200 cursor-pointer select-none
                          "
                        >
                          {submitting === project.id ? (
                            <>
                              <span className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                              <span>Submitting…</span>
                            </>
                          ) : submitted === project.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-300" strokeWidth={3} />
                              <span className="text-emerald-300">Proposal Sent</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>Submit Proposal</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* PAGE 9 — PROJECT DETAILS + AI MATCHING                         */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {view === 'details' && selectedProject && (
          <div className="space-y-10">

            {/* Details page header breadcrumb */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 select-none">
                <span>Project Feed</span>
                <ChevronDown className="w-3 h-3 -rotate-90" />
                <span className="text-indigo-400">{selectedProject.title}</span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-tight max-w-3xl">
                  {selectedProject.title}
                </h1>
                <MatchBadge match={selectedProject.match} />
              </div>
              <p className="text-xs font-semibold text-slate-500">
                Posted by <span className="text-indigo-400 font-bold">{selectedProject.client}</span>
                <span className="mx-2 text-slate-700">·</span>
                <span className="text-slate-600">{selectedProject.postedAgo}</span>
              </p>
            </div>

            {/* ── Main Split Layout ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

              {/* ── Column A: Project Parameters (Left) ── */}
              <div className="lg:col-span-7 space-y-7">

                {/* Full Description */}
                <div className="rounded-2xl bg-slate-900/40 border border-slate-800/60 p-6 md:p-7 backdrop-blur-xl shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/[0.015] to-transparent pointer-events-none" />

                  <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-4 select-none">
                    Project Scope & Deliverables
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {selectedProject.description}
                  </p>
                  <p className="text-[12.5px] text-slate-400 leading-relaxed mt-4">
                    All deliverables must be accompanied by a comprehensive technical documentation package including architecture decision records (ADRs), deployment runbooks, and integration test coverage exceeding 90%. A code walkthrough session with the engineering team will be required before milestone release.
                  </p>
                </div>

                {/* Required Skills grid */}
                <div className="rounded-2xl bg-slate-900/40 border border-slate-800/60 p-6 backdrop-blur-xl shadow-lg">
                  <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-4 select-none">
                    Required Technical Stack
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {selectedProject.skills.map((skill) => (
                      <span
                        key={skill}
                        className="
                          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                          bg-indigo-950/40 border border-indigo-500/20
                          text-xs text-indigo-300 font-bold select-none
                          hover:bg-indigo-950/60 hover:border-indigo-500/40 transition-all duration-200
                        "
                      >
                        <Code2 className="w-3 h-3" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Budget & Milestones grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {/* Budget Allocation */}
                  <div className="rounded-2xl bg-slate-900/40 border border-slate-800/60 p-5 backdrop-blur-xl shadow-lg space-y-4">
                    <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 select-none">
                      Budget Allocation
                    </h3>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-black tracking-tight text-white">{selectedProject.budget}</span>
                      <span className="text-xs font-bold text-slate-500 mb-0.5">fixed price</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 select-none">
                        <span>Escrow Deposit</span>
                        <span className="text-emerald-400">100% Secured</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                        <div className="h-full w-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9.5px] font-semibold text-slate-500 select-none">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Smart contract escrow active
                    </div>
                  </div>

                  {/* Milestone Deadlines */}
                  <div className="rounded-2xl bg-slate-900/40 border border-slate-800/60 p-5 backdrop-blur-xl shadow-lg space-y-4">
                    <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 select-none">
                      Milestone Schedule
                    </h3>
                    <div className="space-y-3 pl-2 border-l border-slate-800">
                      {[
                        { label: 'M1 – Architecture & Setup', date: 'Jun 20, 2026', pct: '25%' },
                        { label: 'M2 – Core Protocol Build', date: 'Jul 01, 2026', pct: '60%' },
                        { label: 'M3 – Audit & Finalisation', date: selectedProject.deadline, pct: '100%' },
                      ].map((m, i) => (
                        <div key={i} className="relative space-y-0.5 pl-3">
                          <div className="absolute -left-[15.5px] top-1 w-2 h-2 rounded-full bg-indigo-500 border border-slate-950" />
                          <p className="text-[10.5px] font-bold text-white leading-none">{m.label}</p>
                          <div className="flex items-center gap-2 text-[9px] text-slate-500 font-semibold">
                            <span>{m.date}</span>
                            <span className="px-1.5 py-0.5 rounded bg-indigo-950/40 text-indigo-400 border border-indigo-900/40">
                              {m.pct} payment
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submit your proposal inline CTA */}
                <div className="rounded-2xl bg-indigo-950/10 border border-indigo-500/20 p-5 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-extrabold text-white tracking-tight select-none">Interested in this contract?</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 select-none">Our AI will optimise your bid for maximum acceptance probability.</p>
                  </div>
                  <button
                    onClick={() => handleSubmitProposal(selectedProject.id)}
                    disabled={submitting === selectedProject.id || submitted === selectedProject.id}
                    className="
                      py-2.5 px-5 rounded-xl text-xs font-bold
                      bg-gradient-to-r from-indigo-600 to-violet-600
                      hover:brightness-110 active:scale-[0.98]
                      disabled:opacity-70 text-white shadow-md shadow-indigo-500/20
                      flex items-center gap-1.5 transition-all duration-200 cursor-pointer select-none whitespace-nowrap
                    "
                  >
                    {submitting === selectedProject.id ? (
                      <><span className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" /><span>Sending…</span></>
                    ) : submitted === selectedProject.id ? (
                      <><Check className="w-3.5 h-3.5 text-emerald-300" strokeWidth={3} /><span className="text-emerald-300">Proposal Sent!</span></>
                    ) : (
                      <><Send className="w-3.5 h-3.5" /><span>Submit Proposal</span></>
                    )}
                  </button>
                </div>

              </div>

              {/* ── Column B: AI Match Radar Matrix (Right) ── */}
              <div className="lg:col-span-5 space-y-5">

                <div className="rounded-2xl bg-indigo-950/10 border border-indigo-500/20 p-6 backdrop-blur-xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-indigo-500/8 blur-2xl pointer-events-none" />
                  <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-indigo-500/8 to-transparent pointer-events-none" />

                  <div className="flex items-center justify-between mb-5 select-none">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                      <h3 className="text-xs font-extrabold uppercase tracking-widest text-indigo-300">
                        Top AI Freelancer Fits
                      </h3>
                    </div>
                    <span className="text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded bg-indigo-950 border border-indigo-500/30 text-indigo-400 select-none">
                      Live Match
                    </span>
                  </div>

                  <div className="space-y-4">
                    {AI_CANDIDATE_MATCHES.map((c) => (
                      <div
                        key={c.id}
                        className={`relative rounded-xl border p-4 bg-slate-950/60 transition-all duration-200 ${c.isTopPick ? `${c.borderColor} shadow-lg` : 'border-slate-900'}`}
                      >
                        {c.isTopPick && (
                          <span className="absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                        )}
                        {c.isTopPick && (
                          <span className="absolute top-2.5 right-2.5 text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-violet-500 text-white select-none">
                            Top Pick
                          </span>
                        )}

                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <div className={`w-9 h-9 rounded-full border ${c.borderColor} overflow-hidden bg-slate-950 shrink-0`}>
                            <div className={`w-full h-full bg-gradient-to-tr ${c.gradient} flex items-center justify-center text-xs font-black text-white`}>
                              {c.initials}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="text-xs font-extrabold text-white tracking-tight leading-none">{c.name}</h4>
                                <p className="text-[9.5px] text-slate-500 mt-0.5 leading-none">{c.role}</p>
                              </div>
                              <span className={`text-[10px] font-black ${c.matchColor} shrink-0`}>{c.match}%</span>
                            </div>

                            <StarRating rating={c.rating} />

                            <div className="flex items-center gap-2 mt-2 text-[9px] font-semibold text-slate-600 select-none">
                              <span className="flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                {c.verifiedSkills} verified skills
                              </span>
                              <span>·</span>
                              <span>{c.jobs} contracts</span>
                            </div>

                            {/* Match Metrics Bar */}
                            <div className="mt-3 space-y-1">
                              <div className="flex justify-between text-[8.5px] font-bold text-slate-600 select-none">
                                <span>Structural Overlap</span>
                                <span className={c.matchColor}>{c.match}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                <div
                                  className={`h-full bg-gradient-to-r ${c.barColor} rounded-full transition-all duration-700`}
                                  style={{ width: `${c.match}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {c.isTopPick && !hired && (
                          <button
                            onClick={() => handleHire(c)}
                            disabled={hiring}
                            className="
                              w-full mt-3.5 py-2.5 rounded-xl text-xs font-bold
                              bg-gradient-to-r from-violet-600 to-indigo-600
                              hover:brightness-110 active:scale-[0.98]
                              text-white shadow-md shadow-violet-500/20
                              flex items-center justify-center gap-1.5
                              transition-all duration-200 cursor-pointer select-none
                            "
                          >
                            {hiring ? (
                              <><span className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" /><span>Processing hire…</span></>
                            ) : (
                              <><Zap className="w-3.5 h-3.5" /><span>Instant Hire — Deploy Escrow</span></>
                            )}
                          </button>
                        )}
                        {hired && c.id === hired.id && (
                          <div className="w-full mt-3.5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center gap-1.5 select-none">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Hired · Escrow Secured
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* ── Proposals Evaluation Queue (Bottom) ── */}
            <div className="rounded-2xl bg-slate-900/40 border border-slate-800/60 p-6 md:p-7 backdrop-blur-xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/[0.015] to-transparent pointer-events-none" />

              <div className="flex items-center justify-between mb-6 select-none">
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                    Candidate Proposals — Evaluation Queue
                  </h3>
                  <p className="text-[10px] text-slate-600 mt-0.5">AI-ranked by bid optimality, clarity score, and technical depth.</p>
                </div>
                <span className="text-[9px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-400 select-none">
                  {PROPOSALS.length} Bids Received
                </span>
              </div>

              <div className="space-y-5">
                {PROPOSALS.map((proposal, idx) => {
                  const isAccepted = acceptedProposal === proposal.id;
                  return (
                    <div
                      key={proposal.id}
                      className={`
                        relative overflow-hidden rounded-xl border p-5 transition-all duration-300 group
                        ${isAccepted
                          ? 'border-emerald-500/40 bg-emerald-950/10 shadow-md shadow-emerald-500/5'
                          : 'border-slate-800/80 bg-slate-950/30 hover:bg-slate-800/20 hover:border-slate-700'}
                      `}
                    >
                      {isAccepted && (
                        <span className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                      )}

                      <div className="flex flex-col lg:flex-row gap-5 lg:items-start">

                        {/* Profile & metadata */}
                        <div className="flex items-start gap-3.5 lg:w-56 shrink-0">
                          <div className={`w-9 h-9 rounded-full border ${idx === 0 ? 'border-violet-500/40' : 'border-slate-800'} overflow-hidden bg-slate-950 shrink-0`}>
                            <div className={`w-full h-full bg-gradient-to-tr ${proposal.gradient} flex items-center justify-center text-xs font-black text-white`}>
                              {proposal.initials}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs font-extrabold text-white tracking-tight leading-none">{proposal.name}</h4>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[10px] font-bold text-indigo-400">{proposal.bid}</span>
                              <span className="text-slate-700">·</span>
                              <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {proposal.timeline}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Cover letter snippet */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[11.5px] text-slate-400 leading-relaxed line-clamp-3">
                            {proposal.coverSnippet}
                          </p>
                        </div>

                        {/* Score + action */}
                        <div className="flex lg:flex-col items-center lg:items-end gap-3 lg:gap-3 shrink-0">
                          {/* AI Score Badge */}
                          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-violet-950/40 border border-violet-500/20 select-none">
                            <Sparkles className="w-3 h-3 text-violet-400" />
                            <span className="text-[10px] font-black text-violet-300">{proposal.aiScore}/100</span>
                            <span className="text-[8px] font-bold text-violet-500 uppercase tracking-widest hidden sm:block">
                              {proposal.aiLabel}
                            </span>
                          </div>

                          {/* Accept Proposal button */}
                          {!isAccepted ? (
                            <button
                              onClick={() => handleAcceptProposal(proposal.id)}
                              className="
                                py-2 px-4 rounded-xl text-[10px] font-extrabold uppercase tracking-wide
                                border border-slate-700 text-slate-300
                                hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:text-emerald-300
                                active:scale-[0.97]
                                transition-all duration-200 cursor-pointer select-none whitespace-nowrap
                                flex items-center gap-1.5
                              "
                            >
                              <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                              Accept Proposal
                            </button>
                          ) : (
                            <div className="py-2 px-4 rounded-xl text-[10px] font-extrabold uppercase tracking-wide bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5 select-none">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Accepted
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
