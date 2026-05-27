import { useState } from 'react';
import {
  Cpu, Briefcase, Sparkles, TrendingUp, DollarSign, CheckCircle2,
  Clock, Globe, Code2, LogOut, LayoutDashboard, FolderGit2,
  ShieldCheck, Send, MessageSquare, User, Calendar, Plus,
  ChevronRight, ArrowUpRight, Award, HelpCircle
} from 'lucide-react';
import WorkspaceMessagesAndContracts from './WorkspaceMessagesAndContracts';

function FreelancerDashboard({ onNavigate }) {
  // Active state for sidebar navigation simulation
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Simulated dynamic dates
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Recent Projects List
  const recentProjects = [
    {
      id: 1,
      name: 'EVM Smart Escrow Audit',
      client: 'ConsenSys Ventures',
      status: 'In Progress',
      payment: '₹18,000',
      deadline: 'June 05, 2026'
    },
    {
      id: 2,
      name: 'DeFi Staking Pool Contracts',
      client: 'Aave Labs',
      status: 'Under Review',
      payment: '₹22,000',
      deadline: 'June 18, 2026'
    },
    {
      id: 3,
      name: 'React Dashboard UI Kit',
      client: 'TalentStage LLC',
      status: 'In Progress',
      payment: '₹14,500',
      deadline: 'May 30, 2026'
    },
    {
      id: 4,
      name: 'Solidity Token Vesting Hub',
      client: 'Polygon Guild',
      status: 'Completed',
      payment: '₹12,000',
      deadline: 'Completed'
    }
  ];

  // Recent Proposals List
  const recentProposals = [
    {
      id: 1,
      project: 'EIP-4337 Account Abstraction Wallet',
      bid: '₹35,000',
      timeline: '14 Days',
      score: 98,
      aiOptimized: true
    },
    {
      id: 2,
      project: 'Cross-chain Liquidity Bridge Protocol',
      bid: '₹48,000',
      timeline: '20 Days',
      score: 95,
      aiOptimized: true
    },
    {
      id: 3,
      project: 'Next.js Multi-Tenant SaaS Platform',
      bid: '₹28,000',
      timeline: '10 Days',
      score: 92,
      aiOptimized: true
    },
    {
      id: 4,
      project: 'Metamask Flask Extension Plugin',
      bid: '₹18,000',
      timeline: '7 Days',
      score: 87,
      aiOptimized: false
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex relative overflow-hidden select-none">
      
      {/* ── Subtle light ambient accents ── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-80px] right-[-60px] w-[500px] h-[500px] rounded-full bg-indigo-100/60 blur-[120px]" />
        <div className="absolute bottom-[-100px] left-[200px] w-[450px] h-[450px] rounded-full bg-violet-100/40 blur-[100px]" />
      </div>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* ── 1. LEFT SIDEBAR ARCHITECTURE ───────────────────────────────── */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <aside className="w-64 h-screen sticky top-0 bg-white border-r border-slate-200 flex flex-col justify-between py-6 px-4 z-30 shrink-0 shadow-sm">
        <div className="space-y-7">
          
          {/* Logo brand lockup */}
          <div className="flex items-center gap-2.5 px-2.5 cursor-pointer group" onClick={() => onNavigate('landing')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform duration-200">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight text-slate-800">
              Talent<span className="text-violet-600 font-extrabold">Stage</span>
            </span>
          </div>

          {/* Navigation vertical list */}
          <nav className="space-y-1">
            
            {/* Dashboard Link (Active) */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`
                w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all relative group cursor-pointer
                ${activeTab === 'dashboard'
                  ? 'bg-indigo-50 text-indigo-600 border-l-2 border-indigo-500 pl-2.5 rounded-l-none'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }
              `}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
              {activeTab !== 'dashboard' && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-indigo-500 rounded-r opacity-0 group-hover:opacity-100 transition-all duration-200" />
              )}
            </button>

            {/* Browse Projects Link */}
            <button
              onClick={() => onNavigate('project-feed')}
              className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all relative group cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-violet-400" />
              <span>Browse Projects</span>
              <span className="ml-auto text-xs font-extrabold uppercase bg-violet-100 border border-violet-200 text-violet-600 px-1 rounded shadow-sm">Feed</span>
            </button>

            {/* Portfolio Link */}
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`
                w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all relative group cursor-pointer
                ${activeTab === 'portfolio'
                  ? 'bg-indigo-50 text-indigo-600 border-l-2 border-indigo-500 pl-2.5 rounded-l-none'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }
              `}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>Portfolio Registry</span>
            </button>

            {/* Skill Verification */}
            <button
              onClick={() => onNavigate('skill-match')}
              className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all relative group cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              <span>Skill Attestations</span>
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            </button>

            {/* Proposals */}
            <button
              onClick={() => setActiveTab('proposals')}
              className={`
                w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all relative group cursor-pointer
                ${activeTab === 'proposals'
                  ? 'bg-indigo-50 text-indigo-600 border-l-2 border-indigo-500 pl-2.5 rounded-l-none'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }
              `}
            >
              <Send className="w-4 h-4" />
              <span>AI Proposals</span>
            </button>

            {/* Projects */}
            <button
              onClick={() => setActiveTab('projects')}
              className={`
                w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all relative group cursor-pointer
                ${activeTab === 'projects'
                  ? 'bg-indigo-50 text-indigo-600 border-l-2 border-indigo-500 pl-2.5 rounded-l-none'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }
              `}
            >
              <Briefcase className="w-4 h-4" />
              <span>Active Contracts</span>
            </button>

            {/* Earnings */}
            <button
              onClick={() => setActiveTab('earnings')}
              className={`
                w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all relative group cursor-pointer
                ${activeTab === 'earnings'
                  ? 'bg-indigo-50 text-indigo-600 border-l-2 border-indigo-500 pl-2.5 rounded-l-none'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }
              `}
            >
              <DollarSign className="w-4 h-4" />
              <span>Escrow Ledgers</span>
            </button>

            {/* Messages */}
            <button
              onClick={() => setActiveTab('messages')}
              className={`
                w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all relative group cursor-pointer
                ${activeTab === 'messages'
                  ? 'bg-indigo-50 text-indigo-600 border-l-2 border-indigo-500 pl-2.5 rounded-l-none'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }
              `}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Messages</span>
              <span className="ml-auto px-1.5 py-0.5 rounded-md bg-violet-600 text-white text-xs font-extrabold tracking-wide">
                3
              </span>
            </button>

            {/* Profile */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`
                w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all relative group cursor-pointer
                ${activeTab === 'profile'
                  ? 'bg-indigo-50 text-indigo-600 border-l-2 border-indigo-500 pl-2.5 rounded-l-none'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }
              `}
            >
              <User className="w-4 h-4" />
              <span>Developer Profile</span>
            </button>

          </nav>
        </div>

        {/* Bottom Profile / Logout */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-1.5">
            <div className="relative w-8 h-8 rounded-full border border-violet-300 overflow-hidden bg-violet-50 shrink-0">
              <div className="w-full h-full bg-gradient-to-tr from-violet-600/30 to-indigo-500/20 flex items-center justify-center text-xs font-bold text-violet-600">
                A
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-800 leading-none truncate">
                Ananya Sharma
              </h4>
              <p className="text-xs font-medium text-slate-500 mt-1 truncate">
                ananya@talentstage.dev
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('landing')}
            className="w-full flex items-center gap-3 py-2 px-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* ── 2. MAIN WORKSPACE (Scrollable) ─────────────────────────────── */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <main className="flex-1 h-screen overflow-y-auto p-8 lg:p-10 relative z-10 space-y-8 bg-slate-50">
        
        {/* ── CONDITIONAL TABS RENDER ── */}
        {(activeTab === 'dashboard' || activeTab === 'portfolio' || activeTab === 'proposals' || activeTab === 'profile') && <>
          
            {/* Workspace Top Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6 select-none">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              Welcome back, Ananya
              <Sparkles className="w-6 h-6 text-indigo-500 animate-pulse" />
            </h1>
            <p className="text-sm text-slate-500 mt-1 leading-normal font-medium">
              Escrow ledger checked. You have <span className="text-indigo-600 font-bold">2 project reviews</span> pending audit compliance.
            </p>
          </div>

          {/* Calendar date badge */}
          <div className="flex items-center gap-2.5 py-2 px-3.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm">
            <Calendar className="w-4 h-4 text-violet-500" />
            <span>{currentDate}</span>
          </div>
        </header>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* ── 2. TOP ANALYTICS CARDS (4-Column Grid) ─────────────────────── */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
          
          {/* Card 1: Total Earnings */}
          <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 p-5 shadow-sm flex flex-col justify-between min-h-[110px] group hover:border-indigo-200 hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">Total Earnings</span>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight mt-2">₹45,000</h3>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-600">
                +12%
              </span>
              <span className="text-sm text-slate-500 font-medium">this calendar month</span>
            </div>
          </div>

          {/* Card 2: Active Projects */}
          <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 p-5 shadow-sm flex flex-col justify-between min-h-[110px] group hover:border-indigo-200 hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">Active Projects</span>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight mt-2">4</h3>
              </div>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-sm text-slate-500 font-medium">2 pending audit review</span>
            </div>
          </div>

          {/* Card 3: AI Match Score */}
          <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 p-5 shadow-sm flex flex-col justify-between min-h-[110px] group hover:border-violet-200 hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-violet-600">AI Match Rating</span>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight mt-2">92%</h3>
              </div>
              <div className="w-9 h-9 rounded-lg bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-600 shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <span className="px-2.5 py-0.5 rounded-full bg-violet-50 border border-violet-200 text-xs font-bold text-violet-700 uppercase tracking-wider shadow-sm">
                Highly Optimized Profile
              </span>
            </div>
          </div>

          {/* Card 4: Verified Skills */}
          <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 p-5 shadow-sm flex flex-col justify-between min-h-[110px] group hover:border-fuchsia-200 hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-fuchsia-600">Verified Skills</span>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight mt-2">6</h3>
              </div>
              <div className="w-9 h-9 rounded-lg bg-fuchsia-50 border border-fuchsia-200 flex items-center justify-center text-fuchsia-600 shadow-sm">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-fuchsia-600" />
              <span className="text-xs font-extrabold uppercase tracking-wide text-fuchsia-600">Top 5% Tier Developer</span>
            </div>
          </div>

        </section>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* ── 3. REWORKED CUSTOM RADAR CHART SECTION ─────────────────────── */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Custom SVG Radar Chart Card */}
          <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-200 p-6 md:p-7 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />
            
            {/* Header info */}
            <div className="flex justify-between items-start select-none">
              <div>
                <h3 className="text-lg font-bold text-slate-900">AI Competency Mapping</h3>
                <p className="text-sm text-slate-500 mt-0.5 leading-normal font-medium">
                  Attested skill profile. Verified by decentralized node testing frameworks.
                </p>
              </div>
              <div className="flex items-center gap-1 py-1 px-2 rounded-lg bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-600">
                <Award className="w-4 h-4" />
                <span>Escrow Verified</span>
              </div>
            </div>

            {/* Custom SVG Radar Diagram */}
            <div className="flex-1 flex items-center justify-center py-6 min-h-[300px]">
              <svg width="340" height="300" viewBox="0 0 340 300" className="overflow-visible select-none">
                <defs>
                  {/* Skill fill gradient overlay */}
                  <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(99, 102, 241, 0.45)" />
                    <stop offset="100%" stopColor="rgba(139, 92, 246, 0.15)" />
                  </linearGradient>
                </defs>

                {/* concentric octagon grid outlines (concentric rings at 25%, 50%, 75%, 100%) */}
                {/* Center point at (170, 150) */}
                {/* Concentric diamond grid rings */}
                
                {/* 100% Ring */}
                <polygon 
                  points="170,50 270,150 170,250 70,150" 
                  fill="none" 
                  stroke="rgba(148, 163, 184, 0.5)" 
                  strokeWidth="1" 
                  strokeDasharray="3,3" 
                />
                {/* 75% Ring */}
                <polygon 
                  points="170,75 245,150 170,225 95,150" 
                  fill="none" 
                  stroke="rgba(148, 163, 184, 0.4)" 
                  strokeWidth="1" 
                  strokeDasharray="3,3" 
                />
                {/* 50% Ring */}
                <polygon 
                  points="170,100 220,150 170,200 120,150" 
                  fill="none" 
                  stroke="rgba(148, 163, 184, 0.3)" 
                  strokeWidth="1" 
                  strokeDasharray="3,3" 
                />
                {/* 25% Ring */}
                <polygon 
                  points="170,125 195,150 170,175 145,150" 
                  fill="none" 
                  stroke="rgba(148, 163, 184, 0.2)" 
                  strokeWidth="1" 
                  strokeDasharray="3,3" 
                />

                {/* Axes dotted lines */}
                <line x1="170" y1="150" x2="170" y2="50" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="1" strokeDasharray="2,2" />
                <line x1="170" y1="150" x2="270" y2="150" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="1" strokeDasharray="2,2" />
                <line x1="170" y1="150" x2="170" y2="250" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="1" strokeDasharray="2,2" />
                <line x1="170" y1="150" x2="70" y2="150" stroke="rgba(148, 163, 184, 0.5)" strokeWidth="1" strokeDasharray="2,2" />

                {/* Axis Value Indicators (Ticks) */}
                <text x="175" y="105" className="fill-slate-400 text-xs font-bold select-none">50%</text>
                <text x="175" y="80" className="fill-slate-400 text-xs font-bold select-none">75%</text>
                <text x="175" y="55" className="fill-slate-400 text-xs font-bold select-none">100%</text>

                {/* ── SKILLS OVERLAY POLYGON ── */}
                {/* React: 95% -> (170, 150 - 95) = (170, 55) */}
                {/* TypeScript: 88% -> (170 + 88, 150) = (258, 150) */}
                {/* Node.js: 78% -> (170, 150 + 78) = (170, 228) */}
                {/* Communication: 90% -> (170 - 90, 150) = (80, 150) */}
                <polygon 
                  points="170,55 258,150 170,228 80,150" 
                  fill="url(#indigoGrad)" 
                  stroke="#818cf8" 
                  strokeWidth="2.5" 
                  className="drop-shadow-[0_0_12px_rgba(129,140,248,0.3)] animate-pulse" 
                />

                {/* Skill Level Node Circles */}
                <circle cx="170" cy="55" r="4" className="fill-white stroke-indigo-500 stroke-2" />
                <circle cx="258" cy="150" r="4" className="fill-white stroke-indigo-500 stroke-2" />
                <circle cx="170" cy="228" r="4" className="fill-white stroke-indigo-500 stroke-2" />
                <circle cx="80" cy="150" r="4" className="fill-white stroke-indigo-500 stroke-2" />

                {/* ── AXIS TYPOGRAPHY LABELS ── */}
                {/* React Label */}
                <text x="170" y="32" textAnchor="middle" className="fill-slate-800 text-sm font-bold tracking-wider select-none uppercase">
                  React Architecture
                </text>
                <text x="170" y="44" textAnchor="middle" className="fill-indigo-600 text-xs font-bold tracking-wide select-none">
                  95% Expert
                </text>

                {/* TypeScript Label */}
                <text x="285" y="148" textAnchor="start" className="fill-slate-800 text-sm font-bold tracking-wider select-none uppercase">
                  TypeScript
                </text>
                <text x="285" y="160" textAnchor="start" className="fill-indigo-600 text-xs font-bold tracking-wide select-none">
                  88% Master
                </text>

                {/* Node.js Label */}
                <text x="170" y="270" textAnchor="middle" className="fill-slate-800 text-sm font-bold tracking-wider select-none uppercase">
                  Node / Web3.js
                </text>
                <text x="170" y="282" textAnchor="middle" className="fill-indigo-600 text-xs font-bold tracking-wide select-none">
                  78% Advanced
                </text>

                {/* Communication Label */}
                <text x="55" y="148" textAnchor="end" className="fill-slate-800 text-sm font-bold tracking-wider select-none uppercase">
                  Communication
                </text>
                <text x="55" y="160" textAnchor="end" className="fill-indigo-600 text-xs font-bold tracking-wide select-none">
                  90% Flawless
                </text>
              </svg>
            </div>
          </div>

          {/* Right Panel: AI Optimization Feedback Card */}
          <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200 p-6 md:p-7 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />
            
            <div className="space-y-4 select-none">
              <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider">AI Optimization Feed</h3>
              <p className="text-sm text-slate-500 leading-normal font-medium">
                Your portfolio, skills, and escrows have been audited. Here are recommendations to maximize contract match rates.
              </p>

              <div className="space-y-3 pt-2">
                
                {/* Optimization Row 1 */}
                <div className="flex gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">GitHub Sync Active</h4>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                      Synced 4 codebases. React and Solidity smart contracts mapped to your verified credentials.
                    </p>
                  </div>
                </div>

                {/* Optimization Row 2 */}
                <div className="flex gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-600 shrink-0">
                    <Sparkles className="w-4 h-4 text-violet-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Proposal Scoring Alert</h4>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                      AI Proposal Helper active. Bids optimized for Aave and ConsenSys projects with a <span className="text-emerald-600 font-bold">96% success probability</span>.
                    </p>
                  </div>
                </div>

                {/* Optimization Row 3 */}
                <div className="flex gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-fuchsia-50 border border-fuchsia-200 flex items-center justify-center text-fuchsia-600 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Escrow Safeguard Enabled</h4>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                      Smart contract escrow is active on all contracts. Secure deposits guaranteed on Aave projects.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick action button */}
            <button className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 active:scale-[0.98] text-white text-sm font-bold tracking-wider uppercase shadow-md shadow-violet-500/10 transition-all cursor-pointer">
              Launch Skill Verification Test
            </button>
          </div>

        </section>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* ── 4. TWO-COLUMN RECENT DATA TABLES (Responsive & Dense) ───────── */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* Table A: Recent Projects */}
          <div className="rounded-2xl bg-white border border-slate-200 p-5 md:p-6 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />
            
            <div>
              <div className="flex justify-between items-center mb-4 select-none">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Active Work Contracts</h3>
                  <p className="text-sm text-slate-500 mt-0.5 leading-normal font-medium">Active agreements with secured escrow deposits.</p>
                </div>
                <button className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-800 hover:border-slate-300 transition-colors text-xs font-bold cursor-pointer flex items-center gap-1">
                  <span>View All</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 select-none">
                      <th className="py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">Project</th>
                      <th className="py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">Client</th>
                      <th className="py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                      <th className="py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">Payment</th>
                      <th className="py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">Deadline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProjects.map((proj) => (
                      <tr 
                        key={proj.id} 
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-150 group"
                      >
                        <td className="py-3 text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">
                          {proj.name}
                        </td>
                        <td className="py-3 text-sm font-medium text-slate-600">
                          {proj.client}
                        </td>
                        <td className="py-3 text-sm">
                          {proj.status === 'In Progress' && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-xs font-extrabold text-emerald-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Active
                            </span>
                          )}
                          {proj.status === 'Under Review' && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-xs font-extrabold text-amber-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              Review
                            </span>
                          )}
                          {proj.status === 'Completed' && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs font-extrabold text-slate-500">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                              Done
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-sm font-bold text-slate-700">
                          {proj.payment}
                        </td>
                        <td className="py-3 text-xs font-medium text-slate-500">
                          {proj.deadline}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick action info */}
            <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-sm font-semibold text-slate-500 select-none">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                ₹30,000 active deposits secured in Escrow
              </span>
              <span>2/3 Contracts Audited</span>
            </div>
          </div>

          {/* Table B: Recent Proposals */}
          <div className="rounded-2xl bg-white border border-slate-200 p-5 md:p-6 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />
            
            <div>
              <div className="flex justify-between items-center mb-4 select-none">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Recent Bid Proposals</h3>
                  <p className="text-sm text-slate-500 mt-0.5 leading-normal font-medium">Smart-matching algorithms generated proposals.</p>
                </div>
                <button className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-800 hover:border-slate-300 transition-colors text-xs font-bold cursor-pointer flex items-center gap-1">
                  <span>New Proposal</span>
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 select-none">
                      <th className="py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">Target Project</th>
                      <th className="py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">Bid Offer</th>
                      <th className="py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">Delivery</th>
                      <th className="py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">Match Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProposals.map((prop) => (
                      <tr 
                        key={prop.id} 
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-150 group"
                      >
                        <td className="py-3 text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight max-w-[200px] truncate">
                          {prop.project}
                        </td>
                        <td className="py-3 text-sm font-bold text-slate-700">
                          {prop.bid}
                        </td>
                        <td className="py-3 text-xs font-medium text-slate-500">
                          {prop.timeline}
                        </td>
                        <td className="py-3 text-sm">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-violet-600">{prop.score}/100</span>
                            {prop.aiOptimized && (
                              <span className="p-0.5 rounded bg-violet-50 border border-violet-200 text-violet-600 group-hover:bg-violet-100 transition-all" title="AI Optimized Bid Structure">
                                <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick action info */}
            <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-sm font-semibold text-slate-500 select-none">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-violet-500" />
                Average matching decision in under 4 hours
              </span>
              <span className="text-violet-600 font-extrabold flex items-center gap-0.5 hover:underline cursor-pointer">
                Launch AI Optimizer
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          </section></>}

        {/* Workspace Messages Hub (Page 14) */}
        {activeTab === 'messages' && (
          <WorkspaceMessagesAndContracts activeSection="messages" onNavigate={onNavigate} />
        )}

        {/* Escrow Contract Ledger (Page 15) */}
        {(activeTab === 'earnings' || activeTab === 'projects') && (
          <WorkspaceMessagesAndContracts activeSection="contracts" onNavigate={onNavigate} />
        )}

      </main>

    </div>
  );
}

export default FreelancerDashboard;

