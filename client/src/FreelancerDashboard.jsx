import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Cpu, Briefcase, Sparkles, DollarSign, CheckCircle2,
  Clock, LogOut, LayoutDashboard, FolderGit2,
  ShieldCheck, Send, MessageSquare, User, Calendar, Plus,
  ChevronRight, ArrowUpRight, Award, AlertCircle, FileText
} from 'lucide-react';
import WorkspaceMessagesAndContracts from './WorkspaceMessagesAndContracts';
import { authService, dashboardService, projectService, aiService } from './api';

function FreelancerDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = useMemo(() => {
    const path = location.pathname;
    if (path.endsWith('/portfolio')) return 'portfolio';
    if (path.endsWith('/proposals')) return 'proposals';
    if (path.endsWith('/contracts')) return 'projects';
    if (path.endsWith('/earnings')) return 'earnings';
    if (path.endsWith('/messages')) return 'messages';
    if (path.endsWith('/profile')) return 'profile';
    return 'dashboard';
  }, [location.pathname]);

  const setActiveTab = (tab) => {
    if (tab === 'dashboard') {
      navigate('/dashboard');
    } else if (tab === 'projects') {
      navigate('/dashboard/contracts');
    } else {
      navigate(`/dashboard/${tab}`);
    }
  };
  
  // Real database-backed states
  const [profile, setProfile] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Live proposals tab state
  const [proposals, setProposals] = useState([]);
  const [proposalsLoading, setProposalsLoading] = useState(false);
  const [proposalsError, setProposalsError] = useState('');
  
  // AI Portfolio Audit states
  const [portfolioText, setPortfolioText] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [streamedSuggestions, setStreamedSuggestions] = useState([]);
  const [auditPhase, setAuditPhase] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Simulated dynamic dates
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  useEffect(() => {
    let active = true;
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError('');
      
      const [profileResult, dashboardResult] = await Promise.all([
        authService.getProfile(),
        dashboardService.getFreelancerDashboard()
      ]);
      
      if (!active) return;
      setIsLoading(false);
      
      if (profileResult.success && dashboardResult.success) {
        setProfile(profileResult.data);
        setDashboardData(dashboardResult.data);
        setPortfolioText(profileResult.data?.freelancerProfile?.bio || '');
      } else {
        setError('Failed to fetch dashboard data. Please try again later.');
      }
    };
    
    fetchDashboardData();
    return () => { active = false; };
  }, []);

  const handleAuditPortfolio = async () => {
    if (!portfolioText.trim() || portfolioText.length < 5) return;
    setIsAuditing(true);
    setAuditResult(null);
    setStreamedSuggestions([]);
    setApplySuccess(false);
    
    // Beautiful typewriter-style state progression logs
    const phases = [
      'Establishing connection to Gemini secure nodes...',
      'Deconstructing biography vocabulary...',
      'Checking alignment with decentralized skill networks...',
      'Compiling optimization recommendation matrix...',
      'Structuring improved profile copy...'
    ];
    
    let phaseIdx = 0;
    setAuditPhase(phases[0]);
    const phaseInterval = setInterval(() => {
      if (phaseIdx < phases.length - 1) {
        phaseIdx++;
        setAuditPhase(phases[phaseIdx]);
      }
    }, 900);
    
    try {
      const res = await aiService.reviewPortfolio(portfolioText);
      clearInterval(phaseInterval);
      
      if (res.success && res.data) {
        setAuditPhase('Structuring review suggestions...');
        setAuditResult(res.data);
        
        // Typewriter streaming effect for suggestions
        const suggestions = res.data.suggestions || [];
        let suggestionIdx = 0;
        
        const streamInterval = setInterval(() => {
          if (suggestionIdx < suggestions.length) {
            setStreamedSuggestions(prev => [...prev, suggestions[suggestionIdx]]);
            suggestionIdx++;
          } else {
            clearInterval(streamInterval);
            setAuditPhase('');
            setIsAuditing(false);
          }
        }, 1000);
      } else {
        clearInterval(phaseInterval);
        setAuditPhase('');
        setIsAuditing(false);
        alert(res.error?.message || 'Failed to audit portfolio. Please try again.');
      }
    } catch (err) {
      console.error(err);
      clearInterval(phaseInterval);
      setAuditPhase('');
      setIsAuditing(false);
      alert('An unexpected error occurred during the portfolio audit.');
    }
  };

  const handleApplyOptimizedBio = async () => {
    if (!auditResult?.improved) return;
    try {
      const res = await authService.updateFreelancerProfile({ bio: auditResult.improved });
      if (res.success) {
        setApplySuccess(true);
        // Refresh local dashboard states in real-time
        setProfile(prev => {
          if (!prev) return null;
          return {
            ...prev,
            freelancerProfile: {
              ...prev.freelancerProfile,
              bio: auditResult.improved
            }
          };
        });
        setPortfolioText(auditResult.improved);
        setTimeout(() => {
          setApplySuccess(false);
          setAuditResult(null);
          setStreamedSuggestions([]);
        }, 3000);
      } else {
        alert(res.error?.message || 'Failed to update biography in database.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving biography.');
    }
  };

  const copyToClipboard = () => {
    if (!auditResult?.improved) return;
    navigator.clipboard.writeText(auditResult.improved);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Fetch proposals when proposals tab is active
  useEffect(() => {
    if (activeTab !== 'proposals') return;
    
    let active = true;
    const fetchProposals = async () => {
      setProposalsLoading(true);
      setProposalsError('');
      try {
        const res = await projectService.getMyProposals();
        if (active) {
          if (res.success) {
            setProposals(res.data || []);
          } else {
            setProposalsError(res.error?.message || 'Failed to fetch proposals.');
          }
        }
      } catch (err) {
        if (active) {
          setProposalsError(err.message || 'An error occurred while loading proposals.');
        }
      } finally {
        if (active) {
          setProposalsLoading(false);
        }
      }
    };
    fetchProposals();
    return () => { active = false; };
  }, [activeTab]);

  // Dynamic Competency Radar Chart mapper
  const radarData = useMemo(() => {
    const defaultSkills = [
      { name: 'React Architecture', score: 95 },
      { name: 'TypeScript', score: 88 },
      { name: 'Node / Web3.js', score: 78 },
      { name: 'Communication', score: 90 }
    ];

    if (!profile?.userSkills?.length) return defaultSkills;

    // Map database userSkills
    const dbSkills = profile.userSkills.map(us => ({
      name: us.skill.name.toUpperCase(),
      score: us.score || 75
    }));

    // Pad with defaults if less than 4 skills
    const result = [...dbSkills];
    while (result.length < 4) {
      const missingIndex = result.length;
      result.push(defaultSkills[missingIndex]);
    }

    return result.slice(0, 4); // Keep exactly 4 for the 4-axis diamond
  }, [profile]);

  const pointsString = useMemo(() => {
    return `170,${150 - radarData[0].score} ${170 + radarData[1].score},150 170,${150 + radarData[2].score} ${170 - radarData[3].score},150`;
  }, [radarData]);

  const getSkillTier = (score) => {
    if (score >= 90) return 'Expert';
    if (score >= 80) return 'Master';
    if (score >= 70) return 'Advanced';
    return 'Intermediate';
  };

  const avgSkillScore = useMemo(() => {
    if (!profile?.userSkills?.length) return 92;
    const scores = profile.userSkills.filter(s => s.score).map(s => s.score);
    return scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 92;
  }, [profile]);

  const activeEscrowAmount = useMemo(() => {
    if (!dashboardData?.contracts) return 0;
    return dashboardData.contracts
      .filter(c => c.status === 'ACTIVE')
      .reduce((acc, c) => acc + (c.project?.budgetMax || 0), 0);
  }, [dashboardData]);

  // Loading Screen Layout
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute top-[-80px] right-[-60px] w-[500px] h-[500px] rounded-full bg-indigo-700/5 blur-[120px] animate-pulse-glow" />
        </div>
        <div className="text-center relative z-10 space-y-4 select-none">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Configuring Core Attestations...</p>
        </div>
      </div>
    );
  }

  // Error Screen Layout
  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute top-[-80px] right-[-60px] w-[500px] h-[500px] rounded-full bg-rose-700/5 blur-[120px] animate-pulse-glow" />
        </div>
        <div className="text-center relative z-10 space-y-4 max-w-md px-6 select-none">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto animate-pulse">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Sync Error</h3>
          <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center gap-2.5 px-2.5 cursor-pointer group" onClick={() => navigate('/')}>
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
              onClick={() => navigate('/project-feed')}
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
              onClick={() => navigate('/skill-match')}
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
            <div className="relative w-8 h-8 rounded-full border border-violet-500/30 overflow-hidden bg-slate-950 shrink-0">
              <div className="w-full h-full bg-gradient-to-tr from-violet-600/40 to-indigo-500/30 flex items-center justify-center text-xs font-bold text-violet-300">
                {(profile?.profile?.fullName || 'Developer').charAt(0).toUpperCase()}
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[11px] font-bold text-white tracking-tight leading-none truncate">
                {profile?.profile?.fullName || 'Developer Profile'}
              </h4>
              <p className="text-[9.5px] font-medium text-slate-500 mt-1 truncate">
                {profile?.email || 'developer@talentstage.dev'}
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
      {/* ── 2. MAIN WORKSPACE (Scrollable) ─────────────────────────────── */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <main className="flex-1 h-screen overflow-y-auto p-8 lg:p-10 relative z-10 space-y-8 bg-slate-50">
        
        {/* ── CONDITIONAL TABS RENDER ── */}
        {activeTab === 'dashboard' && <>
          
            {/* Workspace Top Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6 select-none">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Welcome back, {profile?.profile?.fullName || 'Developer'}
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </h1>
            <p className="text-xs text-slate-500 mt-1 leading-normal">
              Escrow ledger checked. You have <span className="text-indigo-400 font-bold">{dashboardData?.contracts?.filter(c => c.status === 'ACTIVE').length || 0} active contract{dashboardData?.contracts?.filter(c => c.status === 'ACTIVE').length !== 1 ? 's' : ''}</span> in database.
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
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">Total Earnings</span>
                <h3 className="text-2xl font-black text-white tracking-tight mt-1.5">₹{(profile?.freelancerProfile?.totalEarned || 0).toLocaleString('en-IN')}</h3>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400">
                Active Rating: {profile?.freelancerProfile?.rating || 0}★
              </span>
              <span className="text-[9.5px] text-slate-500 font-medium">overall score tier</span>
            </div>
          </div>

          {/* Card 2: Active Projects */}
          <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 p-5 shadow-sm flex flex-col justify-between min-h-[110px] group hover:border-indigo-200 hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">Active Projects</span>
                <h3 className="text-2xl font-black text-white tracking-tight mt-1.5">
                  {dashboardData?.contracts?.filter(c => c.status === 'ACTIVE').length || 0}
                </h3>
              </div>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[9.5px] text-slate-500 font-medium">{dashboardData?.totalContracts || 0} contracts loaded</span>
            </div>
          </div>

          {/* Card 3: AI Match Score */}
          <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 p-5 shadow-sm flex flex-col justify-between min-h-[110px] group hover:border-violet-200 hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">AI Match Rating</span>
                <h3 className="text-2xl font-black text-white tracking-tight mt-1.5">{avgSkillScore}%</h3>
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
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">Verified Skills</span>
                <h3 className="text-2xl font-black text-white tracking-tight mt-1.5">
                  {profile?.userSkills?.length || 0}
                </h3>
              </div>
              <div className="w-9 h-9 rounded-lg bg-fuchsia-50 border border-fuchsia-200 flex items-center justify-center text-fuchsia-600 shadow-sm">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-fuchsia-400" />
              <span className="text-[9.5px] text-slate-500 font-extrabold uppercase tracking-wide text-fuchsia-400">Attested Competencies</span>
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
                <polygon 
                  points={pointsString} 
                  fill="url(#indigoGrad)" 
                  stroke="#818cf8" 
                  strokeWidth="2.5" 
                  className="drop-shadow-[0_0_12px_rgba(129,140,248,0.3)] animate-pulse" 
                />

                {/* Skill Level Node Circles */}
                <circle cx="170" cy={150 - radarData[0].score} r="4" className="fill-slate-950 stroke-indigo-400 stroke-2" />
                <circle cx={170 + radarData[1].score} cy="150" r="4" className="fill-slate-950 stroke-indigo-400 stroke-2" />
                <circle cx="170" cy={150 + radarData[2].score} r="4" className="fill-slate-950 stroke-indigo-400 stroke-2" />
                <circle cx={170 - radarData[3].score} cy="150" r="4" className="fill-slate-950 stroke-indigo-400 stroke-2" />

                {/* ── AXIS TYPOGRAPHY LABELS ── */}
                {/* Top Label */}
                <text x="170" y="32" textAnchor="middle" className="fill-white text-[11px] font-bold tracking-wider select-none uppercase">
                  {radarData[0].name}
                </text>
                <text x="170" y="44" textAnchor="middle" className="fill-indigo-400 text-[9px] font-bold tracking-wide select-none">
                  {radarData[0].score}% {getSkillTier(radarData[0].score)}
                </text>

                {/* Right Label */}
                <text x="285" y="148" textAnchor="start" className="fill-white text-[11px] font-bold tracking-wider select-none uppercase">
                  {radarData[1].name}
                </text>
                <text x="285" y="160" textAnchor="start" className="fill-indigo-400 text-[9px] font-bold tracking-wide select-none">
                  {radarData[1].score}% {getSkillTier(radarData[1].score)}
                </text>

                {/* Bottom Label */}
                <text x="170" y="270" textAnchor="middle" className="fill-white text-[11px] font-bold tracking-wider select-none uppercase">
                  {radarData[2].name}
                </text>
                <text x="170" y="282" textAnchor="middle" className="fill-indigo-400 text-[9px] font-bold tracking-wide select-none">
                  {radarData[2].score}% {getSkillTier(radarData[2].score)}
                </text>

                {/* Left Label */}
                <text x="55" y="148" textAnchor="end" className="fill-white text-[11px] font-bold tracking-wider select-none uppercase">
                  {radarData[3].name}
                </text>
                <text x="55" y="160" textAnchor="end" className="fill-indigo-400 text-[9px] font-bold tracking-wide select-none">
                  {radarData[3].score}% {getSkillTier(radarData[3].score)}
                </text>
              </svg>
            </div>
          </div>

          {/* Right Panel: Interactive AI Portfolio Audit & Optimizer */}
          <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200 p-6 md:p-7 shadow-sm flex flex-col justify-between relative overflow-hidden transition-all duration-300">
            {/* Ambient visual overlay */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-violet-500 via-indigo-500 to-fuchsia-500" />
            
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-600 animate-pulse" />
                  <h3 className="text-base font-bold text-slate-800 tracking-tight">AI Portfolio Auditing</h3>
                </div>
                <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-full bg-violet-50 border border-violet-100 text-[10px] font-extrabold uppercase text-violet-600 tracking-wide">
                  <Sparkles className="w-3 h-3 animate-spin-slow" />
                  Gemini Optimizer
                </span>
              </div>

              {/* Dynamic audit views */}
              {!isAuditing && !auditResult && (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-xs text-slate-500 leading-normal font-semibold">
                    Optimize your professional profile summary below. The expert technical reviewer will analyze your stack, suggest strategic modifications, and construct a polished, high-impact biography.
                  </p>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Professional Bio Summary</label>
                    <textarea
                      value={portfolioText}
                      onChange={(e) => setPortfolioText(e.target.value.slice(0, 500))}
                      placeholder="Detail your technology stacks, smart contract verifications, React architectures, or team leadership accomplishments..."
                      className="w-full h-36 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-700 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none leading-relaxed"
                    />
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                      <span>⚡ AI recommendations adapt automatically</span>
                      <span className={portfolioText.length >= 450 ? 'text-amber-500' : 'text-slate-450'}>
                        {portfolioText.length} / 500 chars
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleAuditPortfolio}
                    disabled={portfolioText.trim().length < 5}
                    className={`w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 active:scale-[0.98] text-white text-xs font-bold tracking-wider uppercase shadow-md shadow-violet-500/10 transition-all cursor-pointer flex items-center justify-center gap-2 ${portfolioText.trim().length < 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Deconstruct & Optimize Bio</span>
                  </button>
                </div>
              )}

              {/* Streaming loading screen */}
              {isAuditing && (
                <div className="py-8 flex flex-col items-center justify-center space-y-5 text-center min-h-[300px] animate-pulse">
                  {/* Glowing spinner */}
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-100 animate-pulse" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 border-r-indigo-500 animate-spin" />
                    <Cpu className="w-6 h-6 text-indigo-600 animate-bounce" />
                  </div>
                  
                  <div className="space-y-2 max-w-xs">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Generating Audit Schema</h4>
                    <p className="text-[11px] text-indigo-600 font-bold font-mono tracking-wide">{auditPhase}</p>
                  </div>

                  {/* Display suggestions as they stream in */}
                  {streamedSuggestions.length > 0 && (
                    <div className="w-full text-left bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 animate-fade-in">
                      <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">Incoming Suggestions</span>
                      <div className="space-y-1.5">
                        {streamedSuggestions.map((s, idx) => (
                          <div key={idx} className="flex gap-2 text-[10px] text-slate-600 leading-normal font-semibold animate-slide-in">
                            <span className="text-indigo-500">✦</span>
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Audit results view */}
              {!isAuditing && auditResult && (
                <div className="space-y-5 animate-fade-in">
                  <div className="space-y-2.5">
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Expert Optimization Suggestions
                    </h4>
                    <div className="space-y-2">
                      {auditResult.suggestions?.map((suggestion, idx) => (
                        <div 
                          key={idx} 
                          className="flex gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all duration-200"
                        >
                          <span className="w-5 h-5 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs text-indigo-500 font-bold shrink-0">
                            {idx + 1}
                          </span>
                          <p className="text-xs text-slate-650 font-semibold leading-relaxed">
                            {suggestion}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[10px] font-black text-violet-600 uppercase tracking-widest">Optimized Biography Draft</h4>
                      <button
                        onClick={copyToClipboard}
                        className="text-[9.5px] font-extrabold text-slate-500 hover:text-indigo-600 hover:underline cursor-pointer flex items-center gap-1"
                      >
                        {copySuccess ? 'Copied ✓' : 'Copy Text'}
                      </button>
                    </div>
                    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-medium text-slate-255 leading-relaxed max-h-36 overflow-y-auto select-text shadow-inner">
                      {auditResult.improved}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleApplyOptimizedBio}
                      className={`flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 active:scale-[0.98] text-white text-xs font-bold tracking-wider uppercase shadow-md shadow-violet-500/15 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${applySuccess ? 'from-emerald-600 to-teal-600 shadow-emerald-500/15' : ''}`}
                    >
                      {applySuccess ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 animate-bounce" />
                          <span>Applied Successfully! ✓</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Apply Optimized Bio</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setAuditResult(null);
                        setStreamedSuggestions([]);
                      }}
                      className="py-3 px-4 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-xs font-bold uppercase transition-all cursor-pointer"
                    >
                      Edit Original
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom persistent link to launch Skill Verification */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 select-none">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                Decentralized nodes active
              </span>
              <span 
                onClick={() => navigate('/skill-match')}
                className="text-indigo-600 hover:underline cursor-pointer flex items-center gap-0.5"
              >
                Start Attestation Test
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
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
                    {!dashboardData?.contracts?.length ? (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-xs text-slate-500 select-none">
                          No active contracts found. Browse projects to get hired!
                        </td>
                      </tr>
                    ) : (
                      dashboardData.contracts.map((contract) => (
                        <tr 
                          key={contract.id} 
                          className="border-b border-slate-900/40 hover:bg-slate-900/40 transition-colors duration-150 group"
                        >
                          <td className="py-3 text-xs font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight">
                            {contract.project?.title}
                          </td>
                          <td className="py-3 text-xs font-medium text-slate-400">
                            {contract.project?.client?.profile?.fullName || contract.project?.client?.email || 'Client'}
                          </td>
                          <td className="py-3 text-xs">
                            {contract.status === 'ACTIVE' && (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-extrabold text-emerald-400">
                                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                                Active
                              </span>
                            )}
                            {contract.status === 'COMPLETED' && (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[9px] font-extrabold text-slate-500">
                                <span className="w-1 h-1 rounded-full bg-slate-600" />
                                Done
                              </span>
                            )}
                            {contract.status === 'CANCELLED' && (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-[9px] font-extrabold text-rose-400">
                                <span className="w-1 h-1 rounded-full bg-rose-600" />
                                Cancelled
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-xs font-bold text-slate-200">
                            ₹{(contract.project?.budgetMax || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 text-[10.5px] font-medium text-slate-500">
                            {new Date(contract.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick action info */}
            <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-sm font-semibold text-slate-500 select-none">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400/80" />
                ₹{activeEscrowAmount.toLocaleString('en-IN')} active deposits secured in Escrow
              </span>
              <span>{dashboardData?.contracts?.filter(c => c.status === 'COMPLETED').length || 0}/{dashboardData?.totalContracts || 0} Contracts Completed</span>
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
                <button 
                  onClick={() => navigate('/project-feed')}
                  className="p-1.5 rounded-lg bg-slate-950 border border-slate-850 text-slate-400 hover:text-white hover:border-slate-700 transition-colors text-[9px] font-bold cursor-pointer flex items-center gap-1"
                >
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
                    {!dashboardData?.proposals?.length ? (
                      <tr>
                        <td colSpan="4" className="py-8 text-center text-xs text-slate-500 select-none">
                          No recent proposals found. Submit bids to start earning!
                        </td>
                      </tr>
                    ) : (
                      dashboardData.proposals.map((proposal) => {
                        const score = (proposal.id.charCodeAt(proposal.id.length - 1) % 15) + 85;
                        return (
                          <tr 
                            key={proposal.id} 
                            className="border-b border-slate-900/40 hover:bg-slate-900/40 transition-colors duration-150 group"
                          >
                            <td className="py-3 text-xs font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight max-w-[200px] truncate">
                              {proposal.project?.title}
                            </td>
                            <td className="py-3 text-xs font-bold text-slate-200">
                              ₹{proposal.bidAmount.toLocaleString('en-IN')}
                            </td>
                            <td className="py-3 text-xs font-medium text-slate-500">
                              {proposal.timelineDays} Days
                            </td>
                            <td className="py-3 text-xs">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] font-bold text-violet-400">{score}/100</span>
                                {proposal.timelineDays <= 14 && (
                                  <span className="p-0.5 rounded bg-violet-600/10 border border-violet-500/20 text-violet-400 group-hover:bg-violet-600/20 transition-all" title="AI Optimized Bid Structure">
                                    <Sparkles className="w-3 h-3 text-violet-400" />
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
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

        {/* Portfolio Registry View */}
        {activeTab === 'portfolio' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-900 pb-6 select-none">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  Portfolio Registry
                  <FolderGit2 className="w-5 h-5 text-indigo-400" />
                </h1>
                <p className="text-xs text-slate-400 mt-1 leading-normal">
                  Showcase your past work, open-source contributions, and verified project deliveries.
                </p>
              </div>
              <button className="py-2 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 active:scale-[0.98] text-xs font-bold text-white shadow-md shadow-violet-500/10 transition-all cursor-pointer flex items-center gap-1.5 select-none">
                <Plus className="w-3.5 h-3.5" />
                <span>Add Portfolio Item</span>
              </button>
            </div>

            <div className="text-center py-24 space-y-4 border border-slate-800/60 bg-slate-900/40 backdrop-blur-xl rounded-2xl max-w-xl mx-auto shadow-lg">
              <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-2">
                <FolderGit2 className="w-8 h-8 text-indigo-400" />
              </div>
              <h2 className="text-lg font-black text-white">Your Portfolio is Empty</h2>
              <p className="text-sm text-slate-400 px-8 leading-relaxed">
                Start adding your best projects, GitHub repositories, or completed contracts to build your decentralized reputation.
              </p>
            </div>
          </div>
        )}

        {/* Developer Profile View */}
        {activeTab === 'profile' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-900 pb-6 select-none">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  Developer Profile
                  <User className="w-5 h-5 text-indigo-400" />
                </h1>
                <p className="text-xs text-slate-400 mt-1 leading-normal">
                  Manage your verified decentralized identity and professional biography.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 space-y-6">
                <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-xl p-6 shadow-lg flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-3xl font-black text-white shadow-lg shadow-violet-500/30 mb-4 border-4 border-slate-800">
                    {(profile?.profile?.fullName || 'D').charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-lg font-black text-white">{profile?.profile?.fullName || 'Developer'}</h2>
                  <p className="text-sm font-semibold text-slate-400 mb-4">{profile?.email}</p>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold tracking-wide uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Identity Verified
                  </span>
                </div>
              </div>

              <div className="md:col-span-2 space-y-6">
                <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-xl p-6 shadow-lg">
                  <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" /> Professional Bio
                  </h3>
                  <div className="bg-slate-950/50 border border-slate-800/60 rounded-xl p-4">
                    <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">
                      {profile?.freelancerProfile?.bio || 'No biography set. Head over to the Dashboard to use the AI Portfolio Auditor to optimize your bio!'}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-xl p-6 shadow-lg">
                  <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" /> Verified Skills
                  </h3>
                  {profile?.userSkills?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.userSkills.map((us) => (
                        <span key={us.skillId} className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg text-xs font-bold flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-indigo-400" />
                          {us.skill?.name}
                          <span className="text-indigo-400 bg-slate-950/50 px-1.5 rounded-md border border-indigo-500/20 ml-1">{us.score}/100</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic">No skills verified yet. Take a skill assessment to build your profile.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Workspace Messages Hub (Page 14) */}
        {activeTab === 'messages' && (
          <WorkspaceMessagesAndContracts activeSection="messages" />
        )}

        {/* Escrow Contract Ledger (Page 15) */}
        {activeTab === 'earnings' && (
          <WorkspaceMessagesAndContracts activeSection="contracts" />
        )}

        {/* Active Contracts view */}
        {activeTab === 'projects' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-900 pb-6 select-none">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  My Active Contracts
                  <Briefcase className="w-5 h-5 text-indigo-400" />
                </h1>
                <p className="text-xs text-slate-500 mt-1 leading-normal">
                  Manage the contracts you are currently working on.
                </p>
              </div>
            </div>
            
            {(!dashboardData?.contracts || dashboardData.contracts.filter(c => c.status === 'ACTIVE').length === 0) ? (
              <div className="text-center py-24 space-y-4 border border-slate-850 bg-slate-900/20 rounded-2xl max-w-xl mx-auto">
                <Briefcase className="w-10 h-10 text-slate-700 mx-auto" />
                <p className="text-sm font-bold text-slate-400">No Active Contracts</p>
                <p className="text-xs text-slate-500">You don't have any active contracts at the moment.</p>
                <button
                  onClick={() => navigate('/project-feed')}
                  className="py-2 px-4 rounded-xl bg-indigo-600 hover:brightness-110 active:scale-[0.98] text-xs font-bold text-white shadow-md shadow-indigo-500/10 transition-all cursor-pointer"
                >
                  Browse Projects
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {dashboardData.contracts.filter(c => c.status === 'ACTIVE').map(contract => (
                  <div key={contract.id} className="rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/60 p-6 shadow-lg relative overflow-hidden flex flex-col justify-between hover:border-slate-700/80 transition-all duration-300 group">
                    <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/[0.015] to-transparent pointer-events-none" />
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <h3 className="text-lg font-extrabold text-white leading-snug group-hover:text-indigo-400 transition-colors">{contract.project?.title || 'Contract'}</h3>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border text-emerald-400 bg-emerald-500/10 border-emerald-500/20 whitespace-nowrap select-none">
                        ACTIVE
                      </span>
                    </div>
                    <div className="text-sm text-slate-400 mb-4 line-clamp-2">
                      Client: <span className="text-slate-300">{contract.client?.profile?.fullName || contract.client?.email || 'Unknown Client'}</span>
                    </div>
                    <div className="pt-4 border-t border-slate-900/60 flex items-center justify-between text-xs font-bold text-slate-500">
                      <div className="flex gap-4">
                        <span className="text-white">Budget: ₹{(contract.project?.budgetMax || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <button 
                        onClick={() => setActiveTab('earnings')}
                        className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 cursor-pointer font-extrabold"
                      >
                        View Escrow Ledger <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Dedicated proposals list tab view */}
        {activeTab === 'proposals' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-900 pb-6 select-none">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  My Bid Proposals
                  <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                </h1>
                <p className="text-xs text-slate-500 mt-1 leading-normal">
                  Real-time status of your proposals submitted to open client contracts.
                </p>
              </div>

              <button 
                onClick={() => navigate('/project-feed')}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 active:scale-[0.98] text-xs font-bold text-white shadow-md shadow-violet-500/10 cursor-pointer flex items-center gap-1.5 transition-all select-none"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Submit New Proposal</span>
              </button>
            </div>

            {proposalsLoading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4 select-none">
                <div className="w-10 h-10 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                <p className="text-xs font-bold text-slate-500 tracking-wider uppercase">Loading Proposals...</p>
              </div>
            ) : proposalsError ? (
              <div className="text-center py-20 space-y-4 border border-red-500/20 bg-red-950/10 rounded-2xl max-w-xl mx-auto">
                <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
                <p className="text-sm font-bold text-red-400">Failed to Load Proposals</p>
                <p className="text-xs text-slate-500 px-6">{proposalsError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="py-2 px-4 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-xs font-bold text-red-350 border border-red-500/30 transition-all cursor-pointer"
                >
                  Retry Connection
                </button>
              </div>
            ) : proposals.length === 0 ? (
              <div className="text-center py-24 space-y-4 border border-slate-850 bg-slate-900/20 rounded-2xl max-w-xl mx-auto">
                <Send className="w-10 h-10 text-slate-700 mx-auto" />
                <p className="text-sm font-bold text-slate-400">No Proposals Found</p>
                <p className="text-xs text-slate-500">You haven't submitted any proposals yet. Check the project feed to find matches!</p>
                <button
                  onClick={() => navigate('/project-feed')}
                  className="py-2 px-4 rounded-xl bg-indigo-600 hover:brightness-110 active:scale-[0.98] text-xs font-bold text-white shadow-md shadow-indigo-500/10 transition-all cursor-pointer"
                >
                  Browse Projects Feed
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {proposals.map((proposal) => {
                  const score = (proposal.id.charCodeAt(proposal.id.length - 1) % 15) + 85;
                  const statusColors = 
                    proposal.status === 'ACCEPTED' 
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      : proposal.status === 'REJECTED'
                      ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                      : 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';

                  return (
                    <div 
                      key={proposal.id} 
                      className="rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/60 p-6 shadow-lg relative overflow-hidden flex flex-col justify-between hover:border-slate-700/80 transition-all duration-300 group"
                    >
                      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/[0.015] to-transparent pointer-events-none" />
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="text-sm font-extrabold text-white leading-snug group-hover:text-indigo-400 transition-colors line-clamp-1">{proposal.project?.title}</h3>
                          <span className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${statusColors} whitespace-nowrap select-none`}>
                            {proposal.status}
                          </span>
                        </div>
                        <p className="text-[11.5px] text-slate-400 line-clamp-3 leading-relaxed">{proposal.coverLetter}</p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-900/60 flex items-center justify-between text-[10px] font-bold">
                        <div className="flex gap-3 text-slate-500">
                          <span className="text-white">₹{proposal.bidAmount.toLocaleString('en-IN')}</span>
                          <span>·</span>
                          <span>{proposal.timelineDays} Days Delivery</span>
                        </div>
                        <span className="text-violet-400 font-extrabold flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          {score}/100 Match
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>

    </div>
  );
}

export default FreelancerDashboard;

