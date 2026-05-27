import React, { useState } from 'react';
import {
  X, Layers, Sparkles, ShieldCheck, BarChart2, Cpu,
  Home, LogIn, UserPlus, FileText, List, Eye, PlusCircle,
  CheckSquare, RefreshCw, Send, MessageSquare, DollarSign,
  User, ArrowRight, Zap, CheckCircle2, Terminal
} from 'lucide-react';

const PILLARS = [
  {
    id: 'gateway',
    label: 'Gateway & Auth',
    color: 'indigo',
    icon: Home,
    badge: '4 views',
    items: [
      {
        label: 'Landing Page',
        desc: 'Public marketing portal',
        icon: Home,
        view: 'landing',
        tag: 'PUBLIC',
        tagColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
      },
      {
        label: 'Login Portal',
        desc: 'Secure user authentication',
        icon: LogIn,
        view: 'login',
        tag: 'AUTH',
        tagColor: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
      },
      {
        label: 'Sign Up',
        desc: 'Create a new account',
        icon: UserPlus,
        view: 'signup',
        tag: 'REGISTER',
        tagColor: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
      },
      {
        label: 'Onboarding Wizard',
        desc: 'Developer profile setup flow',
        icon: FileText,
        view: 'onboarding',
        tag: 'SETUP',
        tagColor: 'bg-slate-700 text-slate-300 border-slate-600',
      },
    ],
  },
  {
    id: 'workspaces',
    label: 'Core Workspaces',
    color: 'violet',
    icon: BarChart2,
    badge: '4 views',
    items: [
      {
        label: 'Freelancer Dashboard',
        desc: 'Contractor analytics & projects',
        icon: BarChart2,
        view: 'dashboard',
        tag: 'FREELANCER',
        tagColor: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
      },
      {
        label: 'Client Workspace',
        desc: 'Employer hiring cockpit',
        icon: Cpu,
        view: 'client-dashboard',
        tag: 'CLIENT',
        tagColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
      },
      {
        label: 'Project Feed',
        desc: 'Browse & bid on contracts',
        icon: List,
        view: 'project-feed',
        tag: 'LISTINGS',
        tagColor: 'bg-slate-700 text-slate-300 border-slate-600',
      },
      {
        label: 'AI Skill Match',
        desc: 'AI-ranked talent discovery',
        icon: Eye,
        view: 'skill-match',
        tag: 'AI',
        tagColor: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30',
      },
    ],
  },
  {
    id: 'ai',
    label: 'AI Engine Modules',
    color: 'fuchsia',
    icon: Sparkles,
    badge: '5 views',
    items: [
      {
        label: 'Post Project (AI Form)',
        desc: 'AI-generated contract scope',
        icon: PlusCircle,
        view: 'client-dashboard',
        tag: 'AI COMPOSE',
        tagColor: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30',
      },
      {
        label: 'Submit Proposal',
        desc: 'AI-evaluated bid submission',
        icon: Send,
        view: 'project-feed',
        tag: 'AI SCORE',
        tagColor: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30',
      },
      {
        label: 'Portfolio AI Diff',
        desc: 'Deep portfolio review analysis',
        icon: RefreshCw,
        view: 'dashboard',
        tag: 'AI REVIEW',
        tagColor: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30',
      },
      {
        label: 'Skill Verification',
        desc: 'Decentralized skill attestation',
        icon: CheckSquare,
        view: 'skill-match',
        tag: 'VERIFIED',
        tagColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      },
      {
        label: 'Vector Match Results',
        desc: 'AI compatibility index report',
        icon: Sparkles,
        view: 'skill-match',
        tag: 'MATCH AI',
        tagColor: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30',
      },
    ],
  },
  {
    id: 'operations',
    label: 'Operations & Ledger',
    color: 'emerald',
    icon: ShieldCheck,
    badge: '4 views',
    items: [
      {
        label: 'Messages Hub',
        desc: 'Secure candidate chat channels',
        icon: MessageSquare,
        view: 'workspace',
        tag: 'PAGE 14',
        tagColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
      },
      {
        label: 'Escrow Ledger',
        desc: 'Smart contract payment flows',
        icon: ShieldCheck,
        view: 'workspace',
        tag: 'PAGE 15',
        tagColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      },
      {
        label: 'Financial Earnings',
        desc: 'Balance sheets & payouts',
        icon: DollarSign,
        view: 'dashboard',
        tag: 'FINANCE',
        tagColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      },
      {
        label: 'Public Profile',
        desc: 'Attested developer showcase',
        icon: User,
        view: 'dashboard',
        tag: 'PROFILE',
        tagColor: 'bg-slate-700 text-slate-300 border-slate-600',
      },
    ],
  },
];

const PILLAR_ACCENT = {
  indigo:  { dot: 'bg-indigo-400',  text: 'text-indigo-400',  border: 'border-indigo-500/40', bg: 'bg-indigo-500/10' },
  violet:  { dot: 'bg-violet-400',  text: 'text-violet-400',  border: 'border-violet-500/40', bg: 'bg-violet-500/10' },
  fuchsia: { dot: 'bg-fuchsia-400', text: 'text-fuchsia-400', border: 'border-fuchsia-500/40', bg: 'bg-fuchsia-500/10' },
  emerald: { dot: 'bg-emerald-400', text: 'text-emerald-400', border: 'border-emerald-500/40', bg: 'bg-emerald-500/10' },
};

export default function GlobalDemoController({ setView, currentView }) {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = (view) => {
    setView?.(view);
    setIsOpen(false);
  };

  const totalViews = PILLARS.reduce((acc, p) => acc + p.items.length, 0);

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none font-sans">

      {/* ── FAB TRIGGER ─────────────────────────────────────── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 pl-4 pr-6 py-3.5 rounded-2xl
            bg-slate-900 border border-slate-700 text-white cursor-pointer
            shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(99,102,241,0.1)]
            hover:border-indigo-500 hover:shadow-[0_8px_40px_rgba(99,102,241,0.2)]
            hover:-translate-y-1 transition-all duration-300 ease-out"
        >
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-2xl ring-1 ring-indigo-500/0 group-hover:ring-indigo-500/30 transition-all duration-300 pointer-events-none" />

          {/* Icon */}
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow duration-300">
            <Terminal className="w-4 h-4 text-white" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900 shadow animate-pulse" />
          </div>

          {/* Label */}
          <div>
            <p className="text-sm font-bold text-white leading-none">Demo Navigator</p>
            <p className="text-xs text-slate-400 mt-0.5 leading-none">{totalViews} pages ready</p>
          </div>

          {/* Arrow */}
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all duration-200 ml-1" />
        </button>
      )}

      {/* ── EXPANDED PANEL ──────────────────────────────────── */}
      {isOpen && (
        <div className="w-[600px] max-h-[560px] flex flex-col rounded-2xl overflow-hidden
          bg-[#0a0f1e] border border-slate-800/80
          shadow-[0_24px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(99,102,241,0.08)]
          animate-scaleUp">

          {/* Top gloss line */}
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />

          {/* ── HEADER ── */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60 bg-slate-900/30 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-black text-white tracking-tight leading-none">
                  TalentStage Demo Navigator
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    All {totalViews} pages compiled &amp; ready
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── PILLARS GRID ── */}
          <div className="overflow-y-auto flex-1 p-5 space-y-6">
            {PILLARS.map((pillar) => {
              const accent = PILLAR_ACCENT[pillar.color];
              const PillarIcon = pillar.icon;
              return (
                <div key={pillar.id}>

                  {/* Pillar heading */}
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className={`w-7 h-7 rounded-lg ${accent.bg} border ${accent.border} flex items-center justify-center ${accent.text}`}>
                      <PillarIcon className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-sm font-bold text-white tracking-tight">{pillar.label}</h3>
                    <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border ${accent.bg} ${accent.border} ${accent.text}`}>
                      {pillar.badge}
                    </span>
                  </div>

                  {/* Items grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {pillar.items.map((item) => {
                      const ItemIcon = item.icon;
                      const isActive = currentView === item.view;
                      return (
                        <button
                          key={item.label}
                          onClick={() => navigate(item.view)}
                          className={`group relative flex items-start gap-3 p-3.5 rounded-xl border text-left cursor-pointer
                            transition-all duration-200 ease-out
                            ${isActive
                              ? `${accent.bg} ${accent.border} ring-1 ${accent.border.replace('border-', 'ring-')}`
                              : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                            }`}
                        >
                          {/* Icon */}
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5
                            transition-all duration-200
                            ${isActive ? `${accent.bg} ${accent.text}` : 'bg-slate-800 text-slate-400 group-hover:text-white group-hover:bg-slate-700'}`}>
                            <ItemIcon className="w-4 h-4" />
                          </div>

                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold leading-tight truncate
                              ${isActive ? accent.text : 'text-slate-200 group-hover:text-white'}`}>
                              {item.label}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5 truncate group-hover:text-slate-400 transition-colors leading-snug">
                              {item.desc}
                            </p>
                            <span className={`inline-block mt-1.5 text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${item.tagColor}`}>
                              {item.tag}
                            </span>
                          </div>

                          {/* Arrow indicator */}
                          <ArrowRight className={`w-3.5 h-3.5 shrink-0 mt-1 transition-all duration-200
                            ${isActive ? accent.text : 'text-slate-700 group-hover:text-slate-400 group-hover:translate-x-0.5'}`} />
                        </button>
                      );
                    })}
                  </div>

                </div>
              );
            })}
          </div>

          {/* ── FOOTER ── */}
          <div className="px-6 py-3 border-t border-slate-800/60 bg-slate-900/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-semibold text-slate-400">
                TalentStage · IITB Prototype · Vite 8.0 · Port 5173
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400">Live</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
