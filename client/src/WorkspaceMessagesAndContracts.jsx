import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare, ShieldCheck, Send, Paperclip, Search,
  CheckCircle2, Clock, DollarSign, FileText, ChevronRight,
  ArrowUpRight, User, Zap, Lock, MoreHorizontal, Star,
  PlusCircle, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';

// ─── STATIC DEMO DATA ─────────────────────────────────────────────────────────

const CONTACTS = [
  {
    id: 1,
    name: 'Arjun Mehta',
    role: 'Full-Stack Engineer',
    avatar: 'AM',
    avatarColor: 'from-indigo-600 to-violet-600',
    online: true,
    unread: 3,
    lastMsg: 'I can begin on Monday. The backend architecture looks solid.',
    time: '2m ago',
    project: 'AI Matchmaking Engine',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'UI/UX Designer',
    avatar: 'PS',
    avatarColor: 'from-fuchsia-600 to-pink-600',
    online: true,
    unread: 0,
    lastMsg: 'Figma handoff is complete. All 32 components exported.',
    time: '18m ago',
    project: 'Talent Portal Redesign',
  },
  {
    id: 3,
    name: 'Rahul Singh',
    role: 'Blockchain Developer',
    avatar: 'RS',
    avatarColor: 'from-emerald-600 to-teal-600',
    online: false,
    unread: 1,
    lastMsg: 'Escrow contract is deployed to Sepolia. Gas optimised.',
    time: '1h ago',
    project: 'Smart Escrow Protocol',
  },
  {
    id: 4,
    name: 'Neha Kapoor',
    role: 'ML Engineer',
    avatar: 'NK',
    avatarColor: 'from-amber-500 to-orange-500',
    online: false,
    unread: 0,
    lastMsg: 'Model accuracy is now 94.2% on the validation set.',
    time: '3h ago',
    project: 'Skill Matching ML API',
  },
];

const MESSAGES = {
  1: [
    { id: 1, from: 'them', text: 'Hi! I reviewed the project brief thoroughly. Looks like an exciting challenge.', time: '10:14 AM' },
    { id: 2, from: 'them', text: 'I have extensive experience with Golang microservices and React. My portfolio includes two similar SaaS platforms.', time: '10:15 AM' },
    { id: 3, from: 'me', text: "Great Arjun! We are looking for someone who can own the backend from day one. What's your availability?", time: '10:22 AM' },
    { id: 4, from: 'them', text: 'I can begin on Monday. The backend architecture looks solid.', time: '10:28 AM' },
  ],
  2: [
    { id: 1, from: 'them', text: 'Hi! I have completed the full design system. All components follow your brand guidelines.', time: '9:00 AM' },
    { id: 2, from: 'me', text: 'Fantastic work Priya! The Figma file looks great.', time: '9:10 AM' },
    { id: 3, from: 'them', text: 'Figma handoff is complete. All 32 components exported.', time: '9:40 AM' },
  ],
  3: [
    { id: 1, from: 'me', text: 'Rahul, any update on the escrow contract audit?', time: '8:30 AM' },
    { id: 2, from: 'them', text: 'Escrow contract is deployed to Sepolia. Gas optimised.', time: '9:15 AM' },
  ],
  4: [
    { id: 1, from: 'them', text: 'I have retrained the model with your extended dataset.', time: 'Yesterday' },
    { id: 2, from: 'them', text: 'Model accuracy is now 94.2% on the validation set.', time: 'Yesterday' },
  ],
};

const MILESTONES = [
  {
    id: 'M1',
    title: 'Design System & Wireframes',
    contractor: 'Priya Sharma',
    project: 'Talent Portal Redesign',
    amount: 8500,
    released: 8500,
    due: 'May 20, 2025',
    status: 'completed',
    deliverable: 'Full Figma file + 32 components',
  },
  {
    id: 'M2',
    title: 'Backend API — Authentication & Core Routes',
    contractor: 'Arjun Mehta',
    project: 'AI Matchmaking Engine',
    amount: 14000,
    released: 0,
    due: 'Jun 5, 2025',
    status: 'in-progress',
    deliverable: 'REST API + OpenAPI Spec',
  },
  {
    id: 'M3',
    title: 'Smart Escrow Contract — Sepolia Deployment',
    contractor: 'Rahul Singh',
    project: 'Smart Escrow Protocol',
    amount: 18000,
    released: 0,
    due: 'Jun 18, 2025',
    status: 'pending',
    deliverable: 'Solidity contract + Audit report',
  },
  {
    id: 'M4',
    title: 'ML Model v2 — Skill Matching API',
    contractor: 'Neha Kapoor',
    project: 'Skill Matching ML API',
    amount: 12000,
    released: 12000,
    due: 'May 15, 2025',
    status: 'completed',
    deliverable: 'FastAPI service + model weights',
  },
];

const STATUS_CONFIG = {
  completed: {
    label: 'Completed',
    icon: CheckCircle2,
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    bar: 'bg-emerald-500',
  },
  'in-progress': {
    label: 'In Progress',
    icon: Clock,
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dot: 'bg-indigo-500',
    bar: 'bg-indigo-500',
  },
  pending: {
    label: 'Pending Start',
    icon: AlertCircle,
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    bar: 'bg-amber-500',
  },
};

// ─── MESSAGES PANEL ───────────────────────────────────────────────────────────

function MessagesPanel() {
  const [active, setActive] = useState(CONTACTS[0]);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState(MESSAGES);
  const [search, setSearch] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [active, msgs]);

  const send = () => {
    if (!input.trim()) return;
    setMsgs((prev) => ({
      ...prev,
      [active.id]: [
        ...(prev[active.id] || []),
        { id: Date.now(), from: 'me', text: input.trim(), time: 'Now' },
      ],
    }));
    setInput('');
  };

  const filtered = CONTACTS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.project.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-[680px] rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">

      {/* ── LEFT SIDEBAR ── */}
      <div className="w-72 shrink-0 flex flex-col border-r border-slate-200 bg-slate-50">

        {/* Sidebar Header */}
        <div className="px-4 py-4 border-b border-slate-200">
          <h3 className="text-base font-black text-slate-800 tracking-tight">Active Conversations</h3>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">4 candidates engaged</p>
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidates..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 transition-colors"
            />
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c)}
              className={`w-full flex items-start gap-3 px-4 py-3.5 text-left border-b border-slate-200/60 transition-all duration-150 cursor-pointer
                ${active.id === c.id ? 'bg-indigo-50 border-l-2 border-l-indigo-650' : 'hover:bg-slate-100/60'}`}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${c.avatarColor} flex items-center justify-center text-xs font-black text-white shadow-sm`}>
                  {c.avatar}
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-50 ${c.online ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className={`text-sm font-bold truncate leading-tight ${active.id === c.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                    {c.name}
                  </p>
                  <span className="text-[10px] text-slate-400 shrink-0">{c.time}</span>
                </div>
                <p className="text-[11px] text-indigo-600 font-semibold mt-0.5 truncate">{c.role}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate leading-snug">{c.lastMsg}</p>
              </div>

              {/* Unread badge */}
              {c.unread > 0 && (
                <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center mt-1">
                  {c.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── RIGHT CHAT PANE ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Chat Header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="relative">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${active.avatarColor} flex items-center justify-center text-xs font-black text-white shadow-sm`}>
              {active.avatar}
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-200 ${active.online ? 'bg-emerald-500' : 'bg-slate-400'}`} />
          </div>
          <div>
            <h4 className="text-base font-black text-slate-800 leading-tight">{active.name}</h4>
            <p className="text-xs text-slate-500 font-semibold">
              {active.role} · <span className="text-indigo-600">{active.project}</span>
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${active.online ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${active.online ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              {active.online ? 'Online Now' : 'Offline'}
            </span>
            <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all cursor-pointer">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Project Context Banner */}
        <div className="mx-4 mt-3 mb-1 px-4 py-2.5 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center gap-2.5 shrink-0">
          <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <p className="text-xs font-semibold text-indigo-800">
            Engaged on: <span className="text-slate-800 font-bold">{active.project}</span>
          </p>
          <button className="ml-auto flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-bold transition-colors cursor-pointer">
            View Contract <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4">
          {(msgs[active.id] || []).map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.from === 'me' ? 'flex-row-reverse' : ''}`}>
              {m.from === 'them' ? (
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${active.avatarColor} flex items-center justify-center text-[10px] font-black text-white shrink-0 mt-0.5 shadow-sm`}>
                  {active.avatar}
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600 border border-slate-200 shrink-0 mt-0.5">
                  ME
                </div>
              )}
              <div className={`max-w-[72%] ${m.from === 'me' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed font-semibold shadow-sm
                  ${m.from === 'me'
                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                    : 'bg-slate-100 text-slate-800 rounded-tl-sm border border-slate-200/60'
                  }`}>
                  {m.text}
                </div>
                <span className="text-[10px] text-slate-400 font-medium px-1">{m.time}</span>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-end gap-2">
            <button className="w-9 h-9 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all cursor-pointer shrink-0 mb-0.5">
              <Paperclip className="w-4 h-4" />
            </button>
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
                }}
                placeholder={`Message ${active.name}...`}
                rows={1}
                className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 resize-none transition-colors leading-relaxed"
              />
            </div>
            <button
              onClick={send}
              className="w-9 h-9 rounded-lg bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white transition-all shadow-lg shadow-indigo-500/20 cursor-pointer shrink-0 mb-0.5"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5 text-center font-semibold">
            All messages are end-to-end encrypted · <Lock className="w-2.5 h-2.5 inline-block" /> Escrow-linked channel
          </p>
        </div>
      </div>

    </div>
  );
}

// ─── MILESTONES PANEL ─────────────────────────────────────────────────────────

function ContractsPanel() {
  const [expanded, setExpanded] = useState(null);

  const totalEscrow = MILESTONES.reduce((a, m) => a + m.amount, 0);
  const totalReleased = MILESTONES.reduce((a, m) => a + m.released, 0);
  const totalPending = totalEscrow - totalReleased;

  return (
    <div className="space-y-5">

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Contract Value', value: `₹${totalEscrow.toLocaleString()}`, sub: 'Across 4 active milestones', icon: FileText, color: 'indigo' },
          { label: 'Released to Contractors', value: `₹${totalReleased.toLocaleString()}`, sub: '2 milestones completed', icon: CheckCircle2, color: 'emerald' },
          { label: 'Held in Escrow', value: `₹${totalPending.toLocaleString()}`, sub: 'Pending delivery approval', icon: Lock, color: 'amber' },
        ].map((card) => (
          <div key={card.label} className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-colors">
            <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center
              ${card.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                card.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                'bg-amber-50 text-amber-600'}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-slate-900 leading-tight">{card.value}</p>
            <p className="text-sm font-bold text-slate-500 mt-1">{card.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Milestones Table */}
      <div className="rounded-2xl border border-slate-200 overflow-hidden">

        {/* Table Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="text-base font-black text-slate-800 tracking-tight">Milestone Escrow Ledger</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Smart contract-backed milestone tracking</p>
          </div>
          <button className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 hover:bg-indigo-100 text-xs font-bold transition-all cursor-pointer">
            <PlusCircle className="w-3.5 h-3.5" />
            Add Milestone
          </button>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_40px] gap-4 px-5 py-2.5 bg-slate-50/20 border-b border-slate-200">
          {['Milestone', 'Amount', 'Due Date', 'Status', ''].map((h) => (
            <p key={h} className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{h}</p>
          ))}
        </div>

        {/* Milestone Rows */}
        <div className="divide-y divide-slate-100">
          {MILESTONES.map((m) => {
            const cfg = STATUS_CONFIG[m.status];
            const StatusIcon = cfg.icon;
            const pct = m.amount > 0 ? Math.round((m.released / m.amount) * 100) : 0;
            const isOpen = expanded === m.id;

            return (
              <div key={m.id} className="bg-white hover:bg-slate-50 transition-colors">
                {/* Row */}
                <div
                  onClick={() => setExpanded(isOpen ? null : m.id)}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_40px] gap-4 px-5 py-4 cursor-pointer items-center"
                >
                  {/* Title */}
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">{m.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">{m.contractor} · {m.project}</p>
                  </div>

                  {/* Amount */}
                  <div>
                    <p className="text-sm font-black text-slate-900">₹{m.amount.toLocaleString()}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{pct}% released</p>
                  </div>

                  {/* Due */}
                  <p className="text-sm font-semibold text-slate-700">{m.due}</p>

                  {/* Status */}
                  <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border w-fit text-xs font-bold ${cfg.badge}`}>
                    <StatusIcon className="w-3 h-3" />
                    {cfg.label}
                  </div>

                  {/* Expand */}
                  <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all cursor-pointer">
                    {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Progress bar */}
                <div className="px-5 pb-2">
                  <div className="w-full h-1 rounded-full bg-slate-100 overflow-hidden">
                    <div
                       className={`h-full rounded-full transition-all duration-700 ${cfg.bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Expanded Detail */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-2">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Deliverable</p>
                        <p className="text-sm font-bold text-slate-900">{m.deliverable}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Amount Released</p>
                        <p className="text-sm font-black text-emerald-600">₹{m.released.toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2 items-end">
                        {m.status === 'in-progress' && (
                          <>
                            <button className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Approve &amp; Release
                            </button>
                            <button className="flex-1 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer">
                              Request Revision
                            </button>
                          </>
                        )}
                        {m.status === 'completed' && (
                          <div className="flex-1 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black flex items-center justify-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Payment Released
                          </div>
                        )}
                        {m.status === 'pending' && (
                          <button className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20">
                            <Zap className="w-3.5 h-3.5" />
                            Fund Escrow
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

// ─── ROOT EXPORT ──────────────────────────────────────────────────────────────

export default function WorkspaceMessagesAndContracts({ activeSection = 'messages' }) {
  const [tab, setTab] = useState(activeSection === 'contracts' ? 'contracts' : 'messages');

  const TABS = [
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: '4 active' },
    { id: 'contracts', label: 'Contracts & Escrow', icon: ShieldCheck, badge: '₹52,500 locked' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">

      {/* ── PAGE HEADER ── */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Workspace</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                {tab === 'messages' ? 'Messages Hub' : 'Contracts & Escrow'}
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {tab === 'messages' ? 'Candidate Messages' : 'Milestone & Escrow Ledger'}
            </h1>
            <p className="text-base text-slate-500 font-semibold mt-1.5">
              {tab === 'messages'
                ? 'Real-time encrypted communication with your shortlisted contractors.'
                : 'Smart contract-backed milestone payments. Full audit trail & dispute resolution.'}
            </p>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Escrow Active
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
              <Star className="w-3 h-3 text-indigo-600" />
              4 Contractors
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mt-5 p-1 bg-white border border-slate-200 rounded-xl w-fit">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer
                ${tab === t.id
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full
                ${tab === t.id ? 'bg-indigo-200 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                {t.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      {tab === 'messages' ? <MessagesPanel /> : <ContractsPanel />}

    </div>
  );
}
