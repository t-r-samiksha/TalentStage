import React, { useState } from 'react';
import {
  Terminal, X, Layers, Sparkles, ShieldAlert, BarChart2,
  ArrowRight, Cpu, Home, LogIn, UserPlus, FileText, CheckCircle2,
  List, Eye, PlusCircle, CheckSquare, RefreshCw, Send, MessageSquare,
  DollarSign, User
} from 'lucide-react';

function GlobalDemoController({ setView, currentView }) {
  const [isOpen, setIsOpen] = useState(false);

  // Categories and links configuration for all 17 views
  const categories = [
    {
      title: 'Pillar 1: Gateway & Onboarding',
      items: [
        { name: 'Landing Page', icon: Home, view: 'landing', path: '/' },
        { name: 'Login Interface', icon: LogIn, view: 'login', path: '/login' },
        { name: 'Signup Gate', icon: UserPlus, view: 'signup', path: '/signup' },
        { name: 'Onboarding Wizard', icon: FileText, view: 'onboarding', path: '/onboarding' }
      ]
    },
    {
      title: 'Pillar 2: Core Workspaces',
      items: [
        { name: 'Freelancer Dashboard', icon: BarChart2, view: 'dashboard', path: '/dashboard/freelancer' },
        { name: 'Client Dashboard', icon: Cpu, view: 'client-dashboard', path: '/dashboard/client' },
        { name: 'Project Feed', icon: List, view: 'project-feed', path: '/projects' },
        { name: 'Project Details', icon: Eye, view: 'project-feed', path: '/projects/id' }
      ]
    },
    {
      title: 'Pillar 3: AI Engine Modules',
      items: [
        { name: 'Post Project AI Form', icon: PlusCircle, view: 'client-dashboard', path: '/projects/post' },
        { name: 'Submit Proposal Evaluator', icon: Send, view: 'project-feed', path: '/projects/submit-proposal' },
        { name: 'AI Portfolio Review Diff', icon: RefreshCw, view: 'dashboard', path: '/ai/portfolio-review' },
        { name: 'Skill Verification Sandbox', icon: CheckSquare, view: 'skill-match', path: '/ai/verification' },
        { name: 'AI Vector Match Results', icon: Sparkles, view: 'skill-match', path: '/ai/match-results' }
      ]
    },
    {
      title: 'Pillar 4: Operations & Ledger',
      items: [
        { name: 'Workspace Messages', icon: MessageSquare, view: 'workspace', path: '/messages', subSection: 'messages' },
        { name: 'Escrow Ledger Timeline', icon: ShieldAlert, view: 'workspace', path: '/contract', subSection: 'escrow' },
        { name: 'Financial Earnings', icon: DollarSign, view: 'dashboard', path: '/earnings' },
        { name: 'Public Profile Showcase', icon: User, view: 'dashboard', path: '/profile' }
      ]
    }
  ];

  const handleLinkClick = (item) => {
    // Navigation router state-based simulation
    if (setView) {
      setView(item.view);
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans select-none">
      
      {/* ───────────────────────────────────────────────────────────────── */}
      {/* ── 1. COLLAPSED TRIGGER FAB STATE ─────────────────────────────── */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="
            group flex items-center gap-0 hover:gap-3 px-4 py-3.5 rounded-full
            bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 text-white
            shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:shadow-[0_0_25px_rgba(99,102,241,0.35)]
            hover:border-indigo-500/40 transition-all duration-300 ease-in-out cursor-pointer
            relative overflow-hidden
          "
        >
          {/* Pulsing Outer Glow Ring */}
          <span className="absolute inset-0 rounded-full bg-indigo-500/5 animate-ping duration-3000 pointer-events-none" />
          
          {/* Icon Terminal / Layers */}
          <div className="relative flex items-center justify-center">
            <Terminal className="w-4.5 h-4.5 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Hover Micro-text Expander */}
          <span className="
            max-w-0 overflow-hidden text-[10px] font-black uppercase tracking-wider text-slate-300
            group-hover:max-w-[150px] transition-all duration-300 ease-in-out whitespace-nowrap
          ">
            Launch System Navigator
          </span>
        </button>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* ── 2. EXPANDED CONTROL MATRIX (The Dashboard Panel) ───────────── */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {isOpen && (
        <div className="
          w-[480px] max-h-[500px] overflow-hidden rounded-2xl
          bg-slate-950/95 border border-slate-800/90 shadow-2xl backdrop-blur-2xl
          animate-scaleUp relative flex flex-col justify-between
          before:absolute before:inset-0 before:bg-gradient-to-b before:from-indigo-500/5 before:to-transparent before:pointer-events-none
        ">
          
          {/* Accenting Top Line Glow */}
          <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

          {/* Panel Header */}
          <div className="p-4 border-b border-slate-900 bg-slate-900/30 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400 animate-pulse" />
              <div>
                <h3 className="text-xs font-black text-white tracking-wider uppercase leading-none">
                  IITB Demo Control Matrix
                </h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8.5px] text-slate-500 font-extrabold uppercase tracking-widest">
                    All 17 Engine Sub-systems Compiled
                  </span>
                </div>
              </div>
            </div>

            {/* Close Trigger Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* SYSTEM LINK GRID NODES (Pillars) */}
          <div className="p-5 overflow-y-auto space-y-5 flex-1 max-h-[380px] z-10 scrollbar-thin">
            {categories.map((cat, idx) => (
              <div key={idx} className="space-y-2">
                
                {/* Pillar Mini-Heading */}
                <h4 className="text-[8.5px] font-mono tracking-widest text-slate-500 uppercase select-none">
                  {cat.title}
                </h4>

                {/* Grid Links List */}
                <div className="grid grid-cols-2 gap-2">
                  {cat.items.map((item, itemIdx) => {
                    const LinkIcon = item.icon;
                    const isActive = currentView === item.view;
                    return (
                      <button
                        key={itemIdx}
                        onClick={() => handleLinkClick(item)}
                        className={`
                          flex items-center gap-2.5 p-2 rounded-lg text-left transition-all duration-200 cursor-pointer group
                          ${isActive 
                            ? 'bg-indigo-600/10 border border-indigo-500/20 text-indigo-300' 
                            : 'bg-slate-900/40 border border-slate-850 hover:bg-slate-900/90 hover:border-slate-700 text-slate-400 hover:text-white'
                          }
                        `}
                      >
                        <div className={`
                          p-1 rounded bg-slate-950 border transition-all duration-200
                          ${isActive ? 'border-indigo-500/30 text-indigo-400' : 'border-slate-800 text-slate-500 group-hover:text-white group-hover:border-slate-600 group-hover:translate-x-0.5'}
                        `}>
                          <LinkIcon className="w-3 h-3" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold leading-tight truncate">{item.name}</p>
                          <p className="text-[8px] font-mono text-slate-600 truncate uppercase mt-0.5">{item.path}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

              </div>
            ))}
          </div>

          {/* Controller footer with systems stats */}
          <div className="p-3 border-t border-slate-900 bg-slate-950/40 select-none text-[8.5px] font-mono text-slate-600 flex justify-between items-center z-10">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/80" />
              DX ENGINE: DEPLOYED (VITE 8.0.14)
            </span>
            <span className="text-slate-700">PORT: 5173</span>
          </div>

        </div>
      )}

    </div>
  );
}

export default GlobalDemoController;
