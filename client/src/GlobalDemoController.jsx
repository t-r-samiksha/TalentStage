import React, { useState } from 'react';
import {
  Terminal, X, Layers, Sparkles, ShieldAlert, BarChart2,
  ArrowRight, Cpu, Home, LogIn, UserPlus, FileText, CheckCircle2,
  List, Eye, PlusCircle, CheckSquare, RefreshCw, Send, MessageSquare,
  DollarSign, User, Activity, ShieldCheck, Compass, Settings, Zap
} from 'lucide-react';

function GlobalDemoController({ setView, currentView }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activePillar, setActivePillar] = useState(0); // 0: All, 1: Gateway, 2: Core, 3: AI, 4: Operations

  // Categories and links configuration for all 17 views
  const categories = [
    {
      id: 1,
      title: 'Gateway & Onboarding',
      shortTitle: 'Gateway',
      icon: Home,
      accentColor: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5',
      glow: 'shadow-indigo-500/5',
      items: [
        { name: 'Landing Portal', icon: Home, view: 'landing', path: '/', desc: 'Main public platform gateway' },
        { name: 'Access Terminal', icon: LogIn, view: 'login', path: '/login', desc: 'Secure user login gate' },
        { name: 'Signup Node', icon: UserPlus, view: 'signup', path: '/signup', desc: 'On-chain user registration' },
        { name: 'Onboarding Flow', icon: FileText, view: 'onboarding', path: '/onboarding', desc: 'Developer/Client wizard' }
      ]
    },
    {
      id: 2,
      title: 'Core Workspaces',
      shortTitle: 'Workspaces',
      icon: BarChart2,
      accentColor: 'text-violet-400 border-violet-500/20 bg-violet-500/5',
      glow: 'shadow-violet-500/5',
      items: [
        { name: 'Freelancer Core', icon: BarChart2, view: 'dashboard', path: '/dashboard/freelancer', desc: 'Contractor dashboard hub' },
        { name: 'Client Console', icon: Cpu, view: 'client-dashboard', path: '/dashboard/client', desc: 'Employer metrics ledger' },
        { name: 'Project Feed', icon: List, view: 'project-feed', path: '/projects', desc: 'Bidding and listings search' },
        { name: 'Project Details', icon: Eye, view: 'project-feed', path: '/projects/id', desc: 'Milestone scope breakdown' }
      ]
    },
    {
      id: 3,
      title: 'AI Engine Modules',
      shortTitle: 'AI Core',
      icon: Sparkles,
      accentColor: 'text-fuchsia-400 border-fuchsia-500/20 bg-fuchsia-500/5',
      glow: 'shadow-fuchsia-500/5',
      items: [
        { name: 'AI Scope Architect', icon: PlusCircle, view: 'client-dashboard', path: '/projects/post', desc: 'Natural language contract composer' },
        { name: 'Proposal Optimizer', icon: Send, view: 'project-feed', path: '/projects/submit-proposal', desc: 'Bid success matching analyzer' },
        { name: 'Portfolio Review Diff', icon: RefreshCw, view: 'dashboard', path: '/ai/portfolio-review', desc: 'Interactive skill verification' },
        { name: 'Verification Sandbox', icon: CheckSquare, view: 'skill-match', path: '/ai/verification', desc: 'Decentralized skill testing' },
        { name: 'Vector Match Logs', icon: Sparkles, view: 'skill-match', path: '/ai/match-results', desc: 'Compatibility index analytics' }
      ]
    },
    {
      id: 4,
      title: 'Operations & Ledger',
      shortTitle: 'Ledger',
      icon: ShieldAlert,
      accentColor: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
      glow: 'shadow-emerald-500/5',
      items: [
        { name: 'Workspace Messages', icon: MessageSquare, view: 'workspace', path: '/messages', desc: 'Page 14: Secured chat tunnel' },
        { name: 'Escrow Ledgers', icon: ShieldCheck, view: 'workspace', path: '/contract', desc: 'Page 15: On-chain vault flows' },
        { name: 'Financial Ledger', icon: DollarSign, view: 'dashboard', path: '/earnings', desc: 'Balance ledger and earnings' },
        { name: 'Developer Profile', icon: User, view: 'dashboard', path: '/profile', desc: 'Attested public credentials' }
      ]
    }
  ];

  const handleLinkClick = (item) => {
    if (setView) {
      setView(item.view);
    }
    setIsOpen(false);
  };

  // Get active items based on selected pillar tab
  const getDisplayedCategories = () => {
    if (activePillar === 0) return categories;
    return categories.filter(c => c.id === activePillar);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans select-none">
      
      {/* Dynamic Ambient Background Glows */}
      {isOpen && (
        <div className="absolute right-0 bottom-0 w-[520px] h-[480px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse-glow" />
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* ── 1. FUTURISTIC FAB TRIGGER STATE ────────────────────────────── */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="
            group flex items-center gap-0 hover:gap-3.5 px-4.5 py-4 rounded-full
            bg-slate-950/90 backdrop-blur-md border border-slate-800/80 text-white
            shadow-[0_0_20px_rgba(99,102,241,0.12)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]
            hover:border-indigo-500/50 hover:translate-y-[-2px]
            transition-all duration-300 ease-in-out cursor-pointer relative
          "
        >
          {/* Pulsing ring indicator */}
          <span className="absolute inset-0 rounded-full border border-indigo-500/20 scale-100 group-hover:scale-105 transition-all duration-300 pointer-events-none" />
          <span className="absolute inset-0 rounded-full bg-indigo-500/5 animate-ping opacity-30 pointer-events-none" />

          {/* Animated terminal icon */}
          <div className="relative flex items-center justify-center">
            <Terminal className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 group-hover:rotate-6 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 border border-slate-950 animate-pulse" />
          </div>

          {/* Collapsed label */}
          <span className="
            max-w-0 overflow-hidden text-[9px] font-black uppercase tracking-[0.2em] text-slate-300
            group-hover:max-w-[170px] transition-all duration-350 ease-in-out whitespace-nowrap
          ">
            Launch System Navigator
          </span>
        </button>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* ── 2. PREMIUM COLLAPSIBLE MATRIX TERMINAL PANEL ───────────────── */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {isOpen && (
        <div className="
          w-[520px] max-h-[500px] rounded-2xl overflow-hidden
          bg-slate-950/95 border border-slate-800/90 shadow-2xl backdrop-blur-3xl
          transition-all duration-300 ease-out animate-scaleUp flex flex-col justify-between
          before:absolute before:inset-0 before:bg-gradient-to-b before:from-indigo-500/5 before:to-transparent before:pointer-events-none
        ">
          {/* Top hairline glass highlighting */}
          <div className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

          {/* PANEL MAIN HEADER BLOCK */}
          <div className="p-4 border-b border-slate-900 bg-slate-900/40 flex items-center justify-between z-10 select-none">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shadow-sm relative shrink-0">
                <Layers className="w-4 h-4 animate-pulse" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-slate-950" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white tracking-widest uppercase leading-none">
                  IITB Demo Control Matrix
                </h3>
                <p className="text-[8.5px] font-mono text-slate-500 mt-1 uppercase tracking-widest leading-none flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-emerald-400 shrink-0" />
                  All 17 engine sub-systems operational
                </p>
              </div>
            </div>

            {/* Quick metrics */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-850 font-mono text-[8px] text-slate-500">
                <span>CPU: 4%</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded bg-slate-900 border border-slate-850 hover:border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer shadow-sm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* DUAL-PANE SELECTION SCHEMATIC CONTAINER */}
          <div className="flex-1 flex overflow-hidden min-h-[350px] z-10">
            
            {/* LEFT PILLAR SELECTOR TAB BAR */}
            <div className="w-[125px] border-r border-slate-900 bg-slate-950/80 p-2 space-y-1 overflow-y-auto shrink-0 select-none">
              
              <div className="text-[7.5px] font-black tracking-widest text-slate-650 uppercase px-2 py-1">
                SYSTEM PILLARS
              </div>

              {/* Tab button 0: All Categories */}
              <button
                onClick={() => setActivePillar(0)}
                className={`
                  w-full flex items-center gap-2 p-2 rounded-lg text-[9.5px] font-extrabold uppercase tracking-wide text-left transition-all cursor-pointer
                  ${activePillar === 0
                    ? 'bg-slate-900 text-indigo-400 border border-slate-850'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/30'
                  }
                `}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Show All</span>
              </button>

              {/* Category-specific pillars tabs */}
              {categories.map((cat) => {
                const TabIcon = cat.icon;
                const isActive = activePillar === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActivePillar(cat.id)}
                    className={`
                      w-full flex flex-col p-2 rounded-lg text-left transition-all cursor-pointer gap-1
                      ${isActive
                        ? 'bg-slate-900 text-white border border-slate-850'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/30'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <TabIcon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : ''}`} />
                      <span className="text-[9.5px] font-extrabold uppercase tracking-wide leading-none">{cat.shortTitle}</span>
                    </div>
                  </button>
                );
              })}

              {/* Diagnostics node */}
              <div className="pt-8 px-2 space-y-1">
                <div className="text-[7.5px] font-black tracking-widest text-slate-700 uppercase">SYS TELEMETRY</div>
                <div className="font-mono text-[7px] text-slate-600 space-y-0.5 leading-tight">
                  <p>TEMP: 38°C</p>
                  <p>DB: CONNECTED</p>
                  <p>TLS: SECURE</p>
                </div>
              </div>

            </div>

            {/* RIGHT CONSOLE ROW MATRICES (THE LINKS GRID) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[380px] bg-slate-950/20 scrollbar-thin">
              {getDisplayedCategories().map((cat) => (
                <div key={cat.id} className="space-y-2 select-none">
                  
                  {/* Category Title */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow shadow-indigo-500/80 animate-pulse" />
                    <h4 className="text-[8.5px] font-mono tracking-widest text-slate-500 uppercase leading-none">
                      {cat.title}
                    </h4>
                  </div>

                  {/* Links options */}
                  <div className="grid grid-cols-1 gap-1.5">
                    {cat.items.map((item, itemIdx) => {
                      const LinkIcon = item.icon;
                      const isActive = currentView === item.view;
                      return (
                        <div
                          key={itemIdx}
                          onClick={() => handleLinkClick(item)}
                          className={`
                            group w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer
                            ${isActive
                              ? 'bg-gradient-to-r from-indigo-950/50 to-violet-950/30 border-indigo-500/40 text-indigo-300 shadow shadow-indigo-500/5'
                              : 'bg-slate-900/30 border-slate-900 hover:bg-slate-900/85 hover:border-slate-800 text-slate-400 hover:text-white'
                            }
                          `}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Icon frame with hover translation */}
                            <div className={`
                              p-1.5 rounded-lg border transition-all duration-300 flex items-center justify-center shrink-0
                              ${isActive
                                ? 'bg-indigo-950/80 border-indigo-500/30 text-indigo-400'
                                : 'bg-slate-950 border-slate-850 text-slate-500 group-hover:text-white group-hover:border-slate-700 group-hover:translate-x-0.5'
                              }
                            `}>
                              <LinkIcon className="w-3.5 h-3.5" />
                            </div>
                            
                            {/* Link title & details */}
                            <div className="min-w-0 leading-tight">
                              <p className="text-[10.5px] font-extrabold tracking-wide truncate">{item.name}</p>
                              <p className="text-[8.5px] text-slate-650 truncate mt-0.5 font-medium">{item.desc}</p>
                            </div>
                          </div>

                          {/* Navigation Indicator Arrow */}
                          <div className="flex items-center gap-1.5 shrink-0 ml-3">
                            <span className="font-mono text-[8.5px] text-slate-650 truncate group-hover:text-slate-500 transition-colors uppercase">
                              {item.path}
                            </span>
                            <ArrowRight className="w-3 h-3 text-slate-700 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>
              ))}
            </div>

          </div>

          {/* PLATFORM DIAGNOSTICS SYSTEMS FOOTER */}
          <div className="p-3 border-t border-slate-900 bg-slate-950/70 select-none text-[8.5px] font-mono text-slate-600 flex justify-between items-center z-10">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              DX CONTROL DEPLOYED (VITE 8.0.14)
            </span>
            <span className="text-slate-750 font-bold">PORT: 5173 / HOST: LOCAL</span>
          </div>

        </div>
      )}

    </div>
  );
}

export default GlobalDemoController;
