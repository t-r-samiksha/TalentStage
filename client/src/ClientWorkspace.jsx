import { useState, useRef } from 'react';
import {
  Cpu, Briefcase, Sparkles, DollarSign, CheckCircle2,
  Clock, Globe, Code2, LogOut, LayoutDashboard, Plus,
  ChevronRight, ArrowUpRight, Award, MessageSquare, Send,
  Calendar, Trash2, Check, ArrowRight, ShieldCheck, HelpCircle,
  TrendingUp, AlertCircle
} from 'lucide-react';
import WorkspaceMessagesAndContracts from './WorkspaceMessagesAndContracts';
import { authService } from './api';

function ClientWorkspace({ onNavigate }) {
  // Navigation state between view 1 ('dashboard') and view 2 ('post-project')
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Simulated submission loader & success state
  const [isPosting, setIsPosting] = useState(false);
  const [showPostSuccess, setShowPostSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // ─── Post Project Form States ──────────────────────────────────────────────
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState(['Solidity', 'Web3.js']);
  const [skillInput, setSkillInput] = useState('');
  const [budgetMin, setBudgetMin] = useState('80000');
  const [budgetMax, setBudgetMax] = useState('120000');
  const [deadline, setDeadline] = useState('2026-06-15');
  const [projectType, setProjectType] = useState('fixed');

  // Simulated AI Diagnostics states
  const [aiBriefGenerated, setAiBriefGenerated] = useState(false);
  const [generatingBrief, setGeneratingBrief] = useState(false);

  // ─── Active Client Projects Registry ───────────────────────────────────────
  const [clientProjects, setClientProjects] = useState([
    {
      id: 1,
      title: 'EVM Smart Contract Escrow Audit',
      budget: '₹1,20,000',
      deadline: 'June 15, 2026',
      skills: ['Solidity', 'Hardhat', 'Auditing'],
      proposals: 18,
      status: 'Active'
    },
    {
      id: 2,
      title: 'Cross-chain Liquidity Staking Bridge',
      budget: '₹95,000',
      deadline: 'June 28, 2026',
      skills: ['Rust', 'Go', 'Web3.js'],
      proposals: 24,
      status: 'Active'
    },
    {
      id: 3,
      title: 'Next.js Multi-Tenant SaaS Interface',
      budget: '₹65,000',
      deadline: 'July 02, 2026',
      skills: ['Next.js', 'TypeScript', 'Tailwind CSS'],
      proposals: 9,
      status: 'Under Review'
    }
  ]);

  // Simulated dynamic dates
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // ─── Skills Tag Input Handlers ─────────────────────────────────────────────
  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = skillInput.trim().replace(/,$/, '');
      if (trimmed && !skills.includes(trimmed)) {
        setSkills([...skills, trimmed]);
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleQuickAddSkill = (skill) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  };

  // ─── Form Submission Handlers ──────────────────────────────────────────────
  const handleGenerateAiBrief = () => {
    setGeneratingBrief(true);
    setTimeout(() => {
      setGeneratingBrief(false);
      setAiBriefGenerated(true);
      setTitle('Automated Decentralized Vesting Vault Protocol');
      setDescription(
        'An AI-suggested project structure focusing on secure smart contracts. It implements custom multi-token lockup schedules, gas-optimized ERC-20 staking vaults, and on-chain oracle verification models. Includes comprehensive unit tests using Hardhat and Slither static code auditing analysis.'
      );
      if (!skills.includes('Solidity')) setSkills(prev => [...prev, 'Solidity']);
      if (!skills.includes('Hardhat')) setSkills(prev => [...prev, 'Hardhat']);
      if (!skills.includes('ERC-20')) setSkills(prev => [...prev, 'ERC-20']);
    }, 1200);
  };

  const handlePostProject = (e) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Please specify a project title.');
      return;
    }
    if (!description.trim()) {
      setFormError('Please describe the scope of deliverables.');
      return;
    }
    if (skills.length === 0) {
      setFormError('Please add at least one required skill tag.');
      return;
    }
    if (!budgetMin || !budgetMax) {
      setFormError('Please define your contract budget limits.');
      return;
    }

    setIsPosting(true);
    setTimeout(() => {
      setIsPosting(false);
      
      const formatCurrency = (val) => {
        const num = parseFloat(val);
        return isNaN(num) ? '₹50,000' : '₹' + num.toLocaleString('en-IN');
      };

      const newListing = {
        id: Date.now(),
        title: title.trim(),
        budget: `${formatCurrency(budgetMin)} - ${formatCurrency(budgetMax)}`,
        deadline: new Date(deadline).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        skills: skills,
        proposals: 0,
        status: 'Active'
      };

      setClientProjects([newListing, ...clientProjects]);
      setShowPostSuccess(true);

      setTimeout(() => {
        setShowPostSuccess(false);
        // Reset fields
        setTitle('');
        setDescription('');
        setSkills(['Solidity', 'Web3.js']);
        setBudgetMin('80000');
        setBudgetMax('120000');
        setAiBriefGenerated(false);
        // Navigate back to listings
        setActiveTab('dashboard');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex relative overflow-hidden select-none">
      
      {/* ── Layered ambient radial glows ── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-80px] right-[-60px] w-[500px] h-[500px] rounded-full bg-violet-700/5 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[-100px] left-[200px] w-[450px] h-[450px] rounded-full bg-indigo-700/4 blur-[100px] animate-pulse-glow-reverse" />
      </div>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* ── PERSISTENT LEFT SIDEBAR NAVIGATION ─────────────────────────── */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <aside className="w-64 h-screen sticky top-0 bg-slate-900/60 backdrop-blur-xl border-r border-slate-800/80 flex flex-col justify-between py-6 px-4 z-30 shrink-0">
        <div className="space-y-7">
          
          {/* Logo brand lockup */}
          <div className="flex items-center gap-2.5 px-2.5 cursor-pointer group" onClick={() => onNavigate('landing')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-650 to-violet-650 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Freelance<span className="text-indigo-400 font-extrabold">AI</span>
            </span>
          </div>

          {/* Navigation vertical list */}
          <nav className="space-y-1">
            
            {/* Dashboard Link (Page 6 view) */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`
                w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-xs font-bold transition-all relative group cursor-pointer
                ${activeTab === 'dashboard'
                  ? 'bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500 pl-2.5 rounded-l-none'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.02]'
                }
              `}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Client Dashboard</span>
              {activeTab !== 'dashboard' && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-indigo-500 rounded-r opacity-0 group-hover:opacity-100 transition-all duration-200" />
              )}
            </button>

            {/* Browse Projects Link */}
            <button
              onClick={() => onNavigate('project-feed')}
              className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-200 hover:bg-white/[0.02] transition-all relative group cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>Browse Projects</span>
              <span className="ml-auto text-[8px] font-extrabold uppercase bg-indigo-650/10 border border-indigo-500/20 text-indigo-400 px-1 rounded shadow-sm shadow-indigo-500/10">Feed</span>
            </button>

            {/* Post Project Link (Page 7 view) */}
            <button
              onClick={() => setActiveTab('post-project')}
              className={`
                w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-xs font-bold transition-all relative group cursor-pointer
                ${activeTab === 'post-project'
                  ? 'bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500 pl-2.5 rounded-l-none'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.02]'
                }
              `}
            >
              <Plus className="w-4 h-4" />
              <span>Post New Project</span>
            </button>

            {/* Active Projects Placeholder */}
            <button
              onClick={() => setActiveTab('listings')}
              className={`
                w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-xs font-bold transition-all relative group cursor-pointer
                ${activeTab === 'listings'
                  ? 'bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500 pl-2.5 rounded-l-none'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.02]'
                }
              `}
            >
              <Briefcase className="w-4 h-4" />
              <span>Active Listings</span>
            </button>

            {/* Saved Freelancers */}
            <button
              onClick={() => onNavigate('skill-match')}
              className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-200 hover:bg-white/[0.02] transition-all relative group cursor-pointer"
            >
              <Award className="w-4 h-4 text-violet-400" />
              <span>Saved Freelancers</span>
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            </button>

            {/* Messages */}
            <button
              onClick={() => setActiveTab('messages')}
              className={`
                w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-xs font-bold transition-all relative group cursor-pointer
                ${activeTab === 'messages'
                  ? 'bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500 pl-2.5 rounded-l-none'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.02]'
                }
              `}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Messages</span>
              <span className="ml-auto px-1.5 py-0.5 rounded-md bg-violet-600 text-white text-[8px] font-extrabold tracking-wide scale-95">
                5
              </span>
            </button>

            {/* Payments */}
            <button
              onClick={() => setActiveTab('payments')}
              className={`
                w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-xs font-bold transition-all relative group cursor-pointer
                ${activeTab === 'payments'
                  ? 'bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500 pl-2.5 rounded-l-none'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.02]'
                }
              `}
            >
              <DollarSign className="w-4 h-4" />
              <span>Payments & Escrow</span>
            </button>

          </nav>
        </div>

        {/* Bottom Profile / Logout */}
        <div className="space-y-4 pt-4 border-t border-slate-800/60">
          <div className="flex items-center gap-3 px-1.5">
            <div className="relative w-8 h-8 rounded-full border border-indigo-500/30 overflow-hidden bg-slate-950 shrink-0">
              <div className="w-full h-full bg-gradient-to-tr from-indigo-600/40 to-violet-500/30 flex items-center justify-center text-xs font-bold text-indigo-300">
                P
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-slate-900" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[11px] font-bold text-white tracking-tight leading-none truncate">
                Prisha Iyer
              </h4>
              <p className="text-[9.5px] font-medium text-slate-500 mt-1 truncate">
                prisha.iyer@consensys.net
              </p>
            </div>
          </div>

          <button
            onClick={() => authService.logout()}
            className="w-full flex items-center gap-3 py-2 px-3 rounded-xl text-[10px] font-bold text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* ── MAIN WORKSPACE CONTENT ─────────────────────────────────────── */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <main className="flex-1 h-screen overflow-y-auto p-8 lg:p-10 relative z-10 space-y-8">
        
        {/* Workspace Top Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-6 select-none">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              {activeTab === 'dashboard' ? 'Client Workspace' : 'Post New Contract'}
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </h1>
            <p className="text-xs text-slate-500 mt-1 leading-normal">
              {activeTab === 'dashboard'
                ? 'Review bid proposals, secure contract escrows, and verify attested deliverables.'
                : 'Configure project parameters. Our AI diagnostics will evaluate budget optimization in real-time.'
              }
            </p>
          </div>

          {/* Calendar date badge */}
          <div className="flex items-center gap-2.5 py-2 px-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[10px] font-bold text-slate-400 shadow-md">
            <Calendar className="w-3.5 h-3.5 text-violet-400" />
            <span>{currentDate}</span>
          </div>
        </header>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* ── VIEW 1: CLIENT DASHBOARD VIEW (Page 6) ──────────────────────── */}
        {/* ───────────────────────────────────────────────────────────────── */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            
            {/* Top Stats Cards (4-Column Grid) */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
              
              {/* Card 1: Active Projects */}
              <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-slate-900/40 border border-slate-800/60 p-5 shadow-lg flex flex-col justify-between min-h-[110px] group hover:border-slate-700/80 transition-all duration-200">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">Active Projects</span>
                    <h3 className="text-2xl font-black text-white tracking-tight mt-1.5">3 Active</h3>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-sm relative">
                    <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-500" />
                    <Briefcase className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="text-[9.5px] text-slate-500 font-medium">All escrows fully funded</span>
                </div>
              </div>

              {/* Card 2: Total Budget */}
              <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-slate-900/40 border border-slate-800/60 p-5 shadow-lg flex flex-col justify-between min-h-[110px] group hover:border-slate-700/80 transition-all duration-200">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">Total Budget</span>
                    <h3 className="text-2xl font-black text-white tracking-tight mt-1.5">₹2,80,000</h3>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-sm">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-center">
                  <span className="text-[9.5px] text-indigo-400/90 font-extrabold uppercase tracking-wider select-none">
                    Allocated to Escrow Ledger
                  </span>
                </div>
              </div>

              {/* Card 3: AI Matches */}
              <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-slate-900/40 border border-slate-800/60 p-5 shadow-lg flex flex-col justify-between min-h-[110px] group hover:border-slate-700/80 transition-all duration-200">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">AI Matches</span>
                    <h3 className="text-2xl font-black text-white tracking-tight mt-1.5">42 Top Fits</h3>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shadow-sm">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-center">
                  <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/30 text-[8.5px] font-bold text-violet-300 uppercase tracking-wider shadow-sm">
                    94% Average Match Rate
                  </span>
                </div>
              </div>

              {/* Card 4: Pending Payments */}
              <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-slate-900/40 border border-slate-800/60 p-5 shadow-lg flex flex-col justify-between min-h-[110px] group hover:border-slate-700/80 transition-all duration-200">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">Pending Payments</span>
                    <h3 className="text-2xl font-black text-white tracking-tight mt-1.5">1 Milestone</h3>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-sm">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-[9.5px] text-amber-400/90 font-extrabold uppercase tracking-wide">Awaiting Attestation Approval</span>
                </div>
              </div>

            </section>

            {/* Project List Area */}
            <section className="space-y-5">
              <div className="flex justify-between items-center select-none">
                <h3 className="text-xs font-extrabold uppercase tracking-[0.15em] text-slate-500">
                  Active Project Listings ({clientProjects.length})
                </h3>
                <button
                  onClick={() => setActiveTab('post-project')}
                  className="py-2 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:brightness-110 active:scale-[0.98] text-white text-xs font-bold tracking-wide shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post New Project</span>
                </button>
              </div>

              {/* Grid of Listings */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clientProjects.map((project) => (
                  <div
                    key={project.id}
                    className="
                      relative overflow-hidden flex flex-col justify-between p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl shadow-lg
                      hover:translate-y-[-4px] hover:border-indigo-500/40 hover:shadow-[0_4px_25px_-5px_rgba(99,102,241,0.15)]
                      transition-all duration-300 group cursor-pointer
                    "
                  >
                    {/* Header line & status */}
                    <div className="flex justify-between items-start mb-3 select-none">
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-950/60 border border-indigo-900/50 text-indigo-400">
                        {project.status}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {project.deadline}
                      </span>
                    </div>

                    {/* Title & Budget */}
                    <div className="space-y-2 mb-4">
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors leading-snug line-clamp-2">
                        {project.title}
                      </h4>
                      <div className="text-indigo-400 font-extrabold text-sm tracking-tight flex items-center gap-1 select-none">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>{project.budget}</span>
                      </div>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5 select-none">
                      {project.skills.map((skill) => (
                        <span 
                          key={skill} 
                          className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-850 text-slate-400"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Action & Proposal count footer */}
                    <div className="pt-4 border-t border-slate-900 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 select-none">
                        <span className="w-5 h-5 rounded-md bg-indigo-950/60 border border-indigo-900/40 flex items-center justify-center text-[10px] font-black text-indigo-400 shadow-sm">
                          {project.proposals}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500">Proposals received</span>
                      </div>
                      
                      <button className="py-1.5 px-3 rounded-lg border border-slate-800 text-[10.5px] font-bold text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-950 transition-all flex items-center gap-1 cursor-pointer">
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* ── VIEW 2: POST PROJECT PAGE WITH PREDICTIVE AI PANEL (Page 7) ─── */}
        {/* ───────────────────────────────────────────────────────────────── */}
        {activeTab === 'post-project' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Column (Left) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Form Card */}
              <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-slate-900/50 border border-slate-800 p-6 md:p-8 shadow-2xl">
                
                {/* Accent line */}
                <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                {/* Inner sheen */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/[0.025] to-transparent pointer-events-none" />

                <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2 select-none">
                  <Briefcase className="w-4 h-4 text-violet-400" />
                  Configure Project Parameters
                </h3>

                {/* Form Error Banner */}
                {formError && (
                  <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-xs text-rose-400 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handlePostProject} className="space-y-5">
                  
                  {/* Project Title */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 select-none">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. EVM Token Vesting Vault Protocol"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="
                        w-full px-4 py-3 rounded-xl
                        bg-slate-950 border border-slate-800
                        text-sm text-white placeholder:text-slate-700
                        focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/60
                        hover:border-slate-700
                        transition-all duration-200
                      "
                    />
                  </div>

                  {/* Project Description */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 select-none">
                      Contract Deliverables & Scope *
                    </label>
                    <textarea
                      placeholder="Specify technical scope, architectural parameters, and testing criteria..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="
                        w-full h-32 px-4 py-3 rounded-xl
                        bg-slate-950 border border-slate-800
                        text-sm text-white placeholder:text-slate-700
                        focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/60
                        hover:border-slate-700 resize-none
                        transition-all duration-200
                      "
                    />
                  </div>

                  {/* Required Skills Tag Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 select-none">
                      Required Skills Tags
                    </label>

                    {/* Skill list box */}
                    <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-900 min-h-[50px] items-center">
                      {skills.length === 0 ? (
                        <span className="text-xs text-slate-700 select-none pl-1">No skill tags added.</span>
                      ) : (
                        skills.map((skill) => (
                          <span
                            key={skill}
                            className="
                              inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                              bg-indigo-950/50 border border-indigo-500/20
                              text-xs text-indigo-300 font-semibold select-none
                            "
                          >
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              className="w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-indigo-500/30 text-indigo-400 hover:text-white transition-colors duration-150 cursor-pointer text-[10px]"
                            >
                              &times;
                            </button>
                          </span>
                        ))
                      )}
                    </div>

                    <input
                      type="text"
                      placeholder="Type tag (e.g. Solidity) and press Enter or comma"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleAddSkill}
                      className="
                        w-full px-4 py-3 rounded-xl
                        bg-slate-950 border border-slate-800
                        text-sm text-white placeholder:text-slate-700
                        focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/60
                        hover:border-slate-700
                        transition-all duration-200
                      "
                    />

                    {/* Suggestions */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5 select-none">
                      <span className="text-[10px] font-bold text-slate-600 mr-1">Quick add:</span>
                      {['Solidity', 'Hardhat', 'Rust', 'TypeScript', 'Next.js', 'Go'].map((s) => {
                        const isAdded = skills.includes(s);
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleQuickAddSkill(s)}
                            disabled={isAdded}
                            className={`
                              text-[10px] font-semibold px-2 py-0.5 rounded border transition-all cursor-pointer
                              ${isAdded 
                                ? 'bg-slate-900 border-slate-850 text-slate-700 cursor-not-allowed opacity-50' 
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                              }
                            `}
                          >
                            + {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Grid: Budget Limits */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Budget Min */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 select-none">
                        Minimum Budget Limit
                      </label>
                      <div className="relative group">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 group-focus-within:text-indigo-400 transition-colors pointer-events-none font-bold text-sm">
                          ₹
                        </span>
                        <input
                          type="number"
                          placeholder="e.g. 60000"
                          value={budgetMin}
                          onChange={(e) => setBudgetMin(e.target.value)}
                          className="
                            w-full pl-8 pr-4 py-3 rounded-xl
                            bg-slate-950 border border-slate-800
                            text-sm text-white placeholder:text-slate-700
                            focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/60
                            hover:border-slate-700
                            transition-all duration-200
                          "
                        />
                      </div>
                    </div>

                    {/* Budget Max */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 select-none">
                        Maximum Budget Limit
                      </label>
                      <div className="relative group">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 group-focus-within:text-indigo-400 transition-colors pointer-events-none font-bold text-sm">
                          ₹
                        </span>
                        <input
                          type="number"
                          placeholder="e.g. 120000"
                          value={budgetMax}
                          onChange={(e) => setBudgetMax(e.target.value)}
                          className="
                            w-full pl-8 pr-4 py-3 rounded-xl
                            bg-slate-950 border border-slate-800
                            text-sm text-white placeholder:text-slate-700
                            focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/60
                            hover:border-slate-700
                            transition-all duration-200
                          "
                        />
                      </div>
                    </div>

                  </div>

                  {/* Grid: Deadline & Project Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Project Deadline */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 select-none">
                        Contract Deadline
                      </label>
                      <div className="relative group">
                        <input
                          type="date"
                          value={deadline}
                          onChange={(e) => setDeadline(e.target.value)}
                          className="
                            w-full px-4 py-3 rounded-xl
                            bg-slate-950 border border-slate-800
                            text-sm text-white cursor-pointer
                            focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/60
                            hover:border-slate-700
                            transition-all duration-200
                          "
                        />
                      </div>
                    </div>

                    {/* Project Type Dropdown */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 select-none">
                        Billing Model Type
                      </label>
                      <div className="relative">
                        <select
                          value={projectType}
                          onChange={(e) => setProjectType(e.target.value)}
                          className="
                            w-full px-4 py-3 rounded-xl
                            bg-slate-950 border border-slate-800
                            text-sm text-white appearance-none cursor-pointer
                            focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/60
                            hover:border-slate-700
                            transition-all duration-200
                          "
                        >
                          <option value="fixed">Fixed Price Milestone Plan</option>
                          <option value="hourly">Hourly Rate Compensation</option>
                        </select>
                        <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-600 pointer-events-none">
                          <Plus className="w-4 h-4 rotate-45" />
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Submission Action Buttons */}
                  <div className="pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center gap-4">
                    
                    {/* Button A: Generate AI Brief */}
                    <button
                      type="button"
                      onClick={handleGenerateAiBrief}
                      disabled={generatingBrief}
                      className="
                        w-full sm:w-auto px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider
                        bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600
                        hover:brightness-110 active:scale-[0.98] disabled:opacity-50
                        text-white flex items-center justify-center gap-2 cursor-pointer shadow-md select-none
                      "
                    >
                      {generatingBrief ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                          <span>Auditing market data...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-violet-300" />
                          <span>Generate AI Brief</span>
                        </>
                      )}
                    </button>

                    {/* Button B: Post Project */}
                    <button
                      type="submit"
                      disabled={isPosting}
                      className="
                        w-full sm:flex-1 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider
                        bg-white text-slate-950 hover:bg-white/95 active:scale-[0.98] disabled:opacity-50
                        flex items-center justify-center gap-2 cursor-pointer shadow-lg select-none
                      "
                    >
                      {isPosting ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-slate-950 animate-spin" />
                          <span>Deploying contract brief...</span>
                        </>
                      ) : (
                        <>
                          <span>Post Project & Secure Escrow</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                  </div>

                </form>

              </div>

            </div>

            {/* Interactive AI Diagnostics Panel (Right Column) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* AI Co-Pilot Evaluation Container */}
              <div className="relative overflow-hidden rounded-2xl bg-indigo-950/15 border border-indigo-500/25 p-6 backdrop-blur-md shadow-xl">
                
                {/* Visual glows inside the container */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-indigo-500/10 blur-xl pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />

                <div className="flex justify-between items-center mb-6 select-none">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-indigo-300">
                      AI Co-Pilot Evaluation
                    </h3>
                  </div>
                  <span className="text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded bg-indigo-950 border border-indigo-500/30 text-indigo-300">
                    Live Diagnostics
                  </span>
                </div>

                <div className="space-y-6">
                  
                  {/* Outcome 1: Deliverables Checklist */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none">
                      Suggested Scope Checklist
                    </h4>
                    
                    <div className="space-y-2.5">
                      {[
                        { text: 'Decentralized Escrow Verification', weight: 'High Priority' },
                        { text: 'ERC-20 Compounding Vesting Vaults', weight: 'Core Protocol' },
                        { text: 'Gas Optimization Audit (<85k limit)', weight: 'Crucial' },
                        { text: 'E2E Unit Attestations Suite', weight: 'Standard Requirement' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-900/60 select-none">
                          <div className="w-4.5 h-4.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-center text-emerald-400 shrink-0">
                            <Check className="w-3 h-3" strokeWidth={3} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10.5px] font-bold text-white tracking-wide leading-none">{item.text}</p>
                            <p className="text-[8.5px] font-semibold text-slate-500 mt-1 uppercase tracking-wide">{item.weight}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Outcome 2: Suggested Timeline Chart */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none">
                      Milestone Timeline Optimization
                    </h4>

                    {/* Vertical Micro-Timeline Chart */}
                    <div className="space-y-3 pl-2.5 border-l border-slate-900 select-none">
                      {[
                        { phase: 'Phase 1: Solidity Smart Contract Audit', days: 'Optimized: 4 Days', width: 'w-2/3', color: 'from-violet-600 to-indigo-600' },
                        { phase: 'Phase 2: Escrow Bridge Compilation & Test', days: 'Optimized: 6 Days', width: 'w-full', color: 'from-indigo-600 to-violet-600' },
                        { phase: 'Phase 3: Attestations Attuned Compliance Review', days: 'Optimized: 2 Days', width: 'w-1/3', color: 'from-violet-600 to-fuchsia-600' }
                      ].map((t, index) => (
                        <div key={index} className="relative space-y-1">
                          <div className="absolute -left-[14.5px] top-1 w-2 h-2 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/30" />
                          <h5 className="text-[10.5px] font-bold text-white tracking-wide leading-none">{t.phase}</h5>
                          <span className="text-[9px] font-semibold text-slate-500">{t.days}</span>
                          
                          {/* Dotted chart loading line */}
                          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${t.color} ${t.width} transition-all duration-500`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Outcome 3: Realistic Budget Predictor */}
                  <div className="space-y-3 select-none">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Market Rate Budget Competition
                    </h4>

                    {/* Budget fit visual gauge */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-900/60 space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-slate-500">Low Offer</span>
                        <span className="text-indigo-400">Market Rate</span>
                        <span className="text-slate-500">Premium Offer</span>
                      </div>
                      
                      {/* Gauge Bar */}
                      <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden flex relative">
                        <div className="w-1/3 h-full bg-rose-500/30" />
                        <div className="w-1/3 h-full bg-emerald-500/30" />
                        <div className="w-1/3 h-full bg-indigo-500/30" />
                        {/* Selected fit slider dot */}
                        <div className="absolute top-1/2 -translate-y-1/2 left-[78%] w-3.5 h-3.5 rounded-full bg-indigo-400 border-2 border-slate-950 shadow-md animate-pulse" />
                      </div>

                      <div className="flex items-center justify-between gap-4 pt-1.5">
                        <span className="text-[9.5px] text-slate-500 font-semibold leading-relaxed">
                          Your budget ranges are compared with 142 Solidity auditable contracts posted this quarter.
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-extrabold text-emerald-400 uppercase tracking-widest shrink-0 shadow-sm shadow-emerald-500/5">
                          Budget Fit: Optimized (Top 15% competitive placement)
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* Client Messaging Hub */}
        {activeTab === 'messages' && (
          <WorkspaceMessagesAndContracts activeSection="messages" onNavigate={onNavigate} />
        )}

        {/* Client Escrow & Payments Ledger */}
        {activeTab === 'payments' && (
          <WorkspaceMessagesAndContracts activeSection="contracts" onNavigate={onNavigate} />
        )}

      </main>

      {/* ── Simulated Success Modal Overlay (Page 7 success) ── */}
      {showPostSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-8 text-center animate-scaleUp">
            
            {/* Header glow */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
            <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />

            {/* Checked Circular Banner */}
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping opacity-35" />
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600/30 to-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/25">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            </div>

            <h3 className="text-xl font-extrabold text-white tracking-tight leading-none mb-2">
              Project Live & Escrow Secured!
            </h3>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto mb-6">
              The project has been registered successfully. Verified smart-contract escrows are secured and matchmakers are auditing fits.
            </p>

            {/* Mini Escrow Badge */}
            <div className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-white/[0.03] border border-slate-800 text-[10px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
              <span>₹{parseFloat(budgetMax).toLocaleString('en-IN')} Secured in Escrow Ledger</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default ClientWorkspace;
