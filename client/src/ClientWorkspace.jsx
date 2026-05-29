import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Cpu, Briefcase, Sparkles, DollarSign, CheckCircle2,
  LogOut, LayoutDashboard, Plus,
  ChevronRight, Award, MessageSquare,
  Calendar, Check, ArrowRight, ShieldCheck, AlertCircle,
  Star, User, Bell, ArrowUpRight
} from 'lucide-react';
import WorkspaceMessagesAndContracts from './WorkspaceMessagesAndContracts';
import { authService, dashboardService, projectService, aiService, notificationService, savedService, followService } from './api';
import { socketService } from './api/services/socketService';

function ClientWorkspace() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = useMemo(() => {
    const path = location.pathname;
    if (path.endsWith('/post-project')) return 'post-project';
    if (path.endsWith('/listings')) return 'listings';
    if (path.endsWith('/saved-freelancers')) return 'saved-freelancers';
    if (path.endsWith('/messages')) return 'messages';
    if (path.endsWith('/payments')) return 'payments';
    return 'dashboard';
  }, [location.pathname]);

  const setActiveTab = (tab) => {
    if (tab === 'dashboard') {
      navigate('/client-dashboard');
    } else {
      navigate(`/client-dashboard/${tab}`);
    }
  };
  
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
  const [generatingBrief, setGeneratingBrief] = useState(false);
  const [aiScope, setAiScope] = useState(null);
  const [aiTimeline, setAiTimeline] = useState(null);
  const [aiRisks, setAiRisks] = useState(null);


  // ─── Real database-backed states ───────────────────────────────────────────
  const [profile, setProfile] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [clientProjects, setClientProjects] = useState([]);

  // ─── Saved Candidates & Followers states ──────────────────────────────────
  const [savedFreelancers, setSavedFreelancers] = useState([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [followersLoading, setFollowersLoading] = useState(false);

  // ─── Invitation Modal states ──────────────────────────────────────────────
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [invitingFreelancer, setInvitingFreelancer] = useState(null);
  const [selectedProjectIdToInvite, setSelectedProjectIdToInvite] = useState('');
  const [invitingStatusMessage, setInvitingStatusMessage] = useState('');

  // ─── Notifications states ───────────────────────────────────────────────
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError('');
      
      const [profileResult, dashboardResult] = await Promise.all([
        authService.getProfile(),
        dashboardService.getClientDashboard()
      ]);
      
      if (!active) return;
      setIsLoading(false);
      
      if (profileResult.success && dashboardResult.success) {
        setProfile(profileResult.data);
        setDashboardData(dashboardResult.data);

        // Initialize notifications and count
        const initialNotifications = dashboardResult.data?.notifications || [];
        setNotifications(initialNotifications);
        setUnreadCount(initialNotifications.filter(n => !n.isRead).length);
        
        // Map database projects to clientProjects state
        const mapped = (dashboardResult.data?.projects || []).map(p => ({
          id: p.id,
          title: p.title,
          budget: `₹${p.budgetMin.toLocaleString('en-IN')} - ₹${p.budgetMax.toLocaleString('en-IN')}`,
          deadline: new Date(p.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          skills: ['Solidity', 'Hardhat', 'Web3.js'],
          proposals: p.proposals?.length || 0,
          status: p.status === 'OPEN' ? 'Active' : p.status === 'IN_PROGRESS' ? 'In Progress' : p.status
        }));
        setClientProjects(mapped);
      } else {
        setError('Failed to fetch client workspace data. Please try again later.');
      }
    };
    
    fetchDashboardData();
    return () => { active = false; };
  }, []);

  // Fetch full notifications when notifications tab is active
  useEffect(() => {
    if (activeTab !== 'notifications') return;

    let active = true;
    const fetchAllNotifications = async () => {
      setNotificationsLoading(true);
      try {
        const res = await notificationService.getMyNotifications();
        if (res.success && active) {
          setNotifications(res.data || []);
          setUnreadCount((res.data || []).filter(n => !n.isRead).length);
        }
      } catch (err) {
        console.error("Failed to fetch all notifications", err);
      } finally {
        if (active) setNotificationsLoading(false);
      }
    };

    fetchAllNotifications();
    return () => { active = false; };
  }, [activeTab]);

  // Connect socket and listen for real-time notifications
  useEffect(() => {
    if (!profile?.id) return;

    const onNewNotification = (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    socketService.connect();
    socketService.join(profile.id);
    socketService.on('new_notification', onNewNotification);

    return () => {
      socketService.off('new_notification', onNewNotification);
    };
  }, [profile]);

  // Fetch Saved Freelancers when activeTab is active
  useEffect(() => {
    if (activeTab !== 'saved-freelancers') return;
    
    let active = true;
    const fetchSaved = async () => {
      setSavedLoading(true);
      try {
        const res = await savedService.getSavedFreelancers();
        if (res.success && active) {
          setSavedFreelancers(res.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch saved candidates", err);
      } finally {
        if (active) setSavedLoading(false);
      }
    };
    fetchSaved();
    return () => { active = false; };
  }, [activeTab]);

  // Fetch Followers when activeTab is active
  useEffect(() => {
    if (activeTab !== 'followers') return;
    
    let active = true;
    const fetchFollowers = async () => {
      setFollowersLoading(true);
      try {
        const res = await followService.getClientFollowers();
        if (res.success && active) {
          setFollowers(res.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch followers", err);
      } finally {
        if (active) setFollowersLoading(false);
      }
    };
    fetchFollowers();
    return () => { active = false; };
  }, [activeTab]);

  // ─── Notification Handlers ────────────────────────────────────────────────
  const handleMarkAsRead = async (id) => {
    try {
      const res = await notificationService.markAsRead(id);
      if (res.success) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await notificationService.markAllAsRead();
      if (res.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
    }
  };

  // ─── Saved Candidate & Invitation Handlers ────────────────────────────────
  const handleOpenInviteModal = (freelancer) => {
    setInvitingFreelancer(freelancer);
    setSelectedProjectIdToInvite('');
    setInvitingStatusMessage('');
    setInviteModalOpen(true);
  };

  const handleSendInvite = async () => {
    if (!selectedProjectIdToInvite || !invitingFreelancer) return;
    setInvitingStatusMessage('Sending invitation...');
    try {
      const result = await projectService.inviteFreelancer({
        projectId: selectedProjectIdToInvite,
        freelancerId: invitingFreelancer.id
      });
      if (result.success) {
        setInvitingStatusMessage('Invitation sent successfully!');
        setTimeout(() => {
          setInviteModalOpen(false);
          setInvitingFreelancer(null);
        }, 1500);
      } else {
        setInvitingStatusMessage(result.error?.message || 'Failed to send invitation.');
      }
    } catch (err) {
      setInvitingStatusMessage(err.message || 'Failed to send invitation.');
    }
  };

  const handleRemoveSaved = async (freelancerId) => {
    try {
      const res = await savedService.removeSavedFreelancer(freelancerId);
      if (res.success) {
        setSavedFreelancers(prev => prev.filter(item => item.id !== freelancerId));
        alert('Freelancer removed from saved list.');
      } else {
        alert(res.error?.message || 'Failed to remove freelancer.');
      }
    } catch (err) {
      alert(err.message || 'Failed to remove freelancer.');
    }
  };

  const totalBudget = useMemo(() => {
    if (!dashboardData?.projects) return 0;
    return dashboardData.projects.reduce((acc, p) => acc + (p.budgetMax || 0), 0);
  }, [dashboardData]);

  const totalProposalsCount = useMemo(() => {
    if (!dashboardData?.projects) return 0;
    return dashboardData.projects.reduce((acc, p) => acc + (p.proposals?.length || 0), 0);
  }, [dashboardData]);

  const pendingMilestonesCount = useMemo(() => {
    if (!dashboardData?.contracts) return 0;
    return dashboardData.contracts.reduce((acc, c) => {
      const submitted = c.milestones?.filter(m => m.status === 'SUBMITTED') || [];
      return acc + submitted.length;
    }, 0);
  }, [dashboardData]);

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
  const handleGenerateAiBrief = async () => {
    if (generatingBrief) return;
    
    if (!title.trim()) {
      setFormError('Please enter a project title first to generate an AI brief.');
      return;
    }
    
    setGeneratingBrief(true);
    setFormError('');
    
    try {
      const res = await aiService.generateBrief({
        title: title.trim(),
        skills,
        budgetMin: parseInt(budgetMin, 10) || 0,
        budgetMax: parseInt(budgetMax, 10) || 0,
        deadline,
        billingModel: projectType
      });
      
      if (res.success && res.data) {
        setDescription(res.data.description);
        
        // Merge recommended skills into active tags
        if (res.data.recommendedSkills && Array.isArray(res.data.recommendedSkills)) {
          setSkills(prev => Array.from(new Set([...prev, ...res.data.recommendedSkills])));
        }
        
        // Populate AI Diagnostics states
        setAiScope(res.data.deliverables);
        setAiTimeline(res.data.milestones);
        setAiRisks(res.data.risks);
      } else {
        setFormError(res.message || 'Failed to generate AI project brief.');
      }
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to generate AI project brief.');
    } finally {
      setGeneratingBrief(false);
    }
  };


  const handlePostProject = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Please specify a project title.');
      return;
    }
    if (title.trim().length < 3) {
      setFormError('Project title must be at least 3 characters long.');
      return;
    }
    if (!description.trim()) {
      setFormError('Please describe the scope of deliverables.');
      return;
    }
    if (description.trim().length < 10) {
      setFormError('Contract deliverables & scope must be at least 10 characters long.');
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

    const parsedMin = parseInt(budgetMin, 10);
    const parsedMax = parseInt(budgetMax, 10);
    if (isNaN(parsedMin) || parsedMin <= 0 || isNaN(parsedMax) || parsedMax <= 0) {
      setFormError('Budget limits must be positive numbers.');
      return;
    }
    if (parsedMin > parsedMax) {
      setFormError('Minimum budget limit cannot exceed maximum budget limit.');
      return;
    }

    setIsPosting(true);
    const result = await projectService.createProject({
      title: title.trim(),
      description: description.trim(),
      budgetMin: parsedMin,
      budgetMax: parsedMax,
      skills,
      deadline: deadline || null,
      billingModel: projectType
    });
    setIsPosting(false);

    if (result.success) {
      const newProj = result.data;
      const formattedNewProj = {
        id: newProj.id,
        title: newProj.title,
        budget: `₹${newProj.budgetMin.toLocaleString('en-IN')} - ₹${newProj.budgetMax.toLocaleString('en-IN')}`,
        deadline: new Date(newProj.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        skills: skills,
        proposals: 0,
        status: 'Active'
      };

      setClientProjects(prev => [formattedNewProj, ...prev]);
      
      // Update dashboardData projects as well
      setDashboardData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          projects: [newProj, ...(prev.projects || [])],
          totalProjects: (prev.totalProjects || 0) + 1
        };
      });

      setShowPostSuccess(true);

      setTimeout(() => {
        setShowPostSuccess(false);
        // Reset fields
        setTitle('');
        setDescription('');
        setSkills(['Solidity', 'Web3.js']);
        setBudgetMin('80000');
        setBudgetMax('120000');
        // Navigate back to listings
        setActiveTab('dashboard');
      }, 2000);
    } else {
      setFormError(result.error?.response?.data?.message || result.error?.message || 'Failed to create project listing.');
    }
  };

  // Loading Screen Layout
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute top-[-80px] right-[-60px] w-[500px] h-[500px] rounded-full bg-indigo-700/5 blur-[120px] animate-pulse-glow" />
        </div>
        <div className="text-center relative z-10 space-y-4 select-none">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Configuring Client Workspace...</p>
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
      
      {/* ── Layered ambient radial glows ── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-80px] right-[-60px] w-[500px] h-[500px] rounded-full bg-violet-200/20 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[-100px] left-[200px] w-[450px] h-[450px] rounded-full bg-indigo-700/4 blur-[100px] animate-pulse-glow-reverse" />
      </div>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* ── PERSISTENT LEFT SIDEBAR NAVIGATION ─────────────────────────── */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <aside className="w-64 h-screen sticky top-0 bg-white backdrop-blur-xl border-r border-slate-200 flex flex-col justify-between py-6 px-4 z-30 shrink-0">
        <div className="space-y-7">
          
          {/* Logo brand lockup */}
          <div className="flex items-center gap-2.5 px-2.5 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-650 to-violet-650 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Talent<span className="text-indigo-400 font-extrabold">Stage</span>
            </span>
          </div>

          {/* Navigation vertical list */}
          <nav className="space-y-1">
            
            {/* Dashboard Link (Page 6 view) */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`
                w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all relative group cursor-pointer
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



            {/* Post Project Link (Page 7 view) */}
            <button
              onClick={() => setActiveTab('post-project')}
              className={`
                w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all relative group cursor-pointer
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
                w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all relative group cursor-pointer
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
              onClick={() => setActiveTab('saved-freelancers')}
              className={`
                w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all relative group cursor-pointer
                ${activeTab === 'saved-freelancers'
                  ? 'bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500 pl-2.5 rounded-l-none'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.02]'
                }
              `}
            >
              <Award className="w-4 h-4 text-violet-400" />
              <span>Saved Freelancers</span>
              <span className="ml-auto px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 text-[10px] font-extrabold tracking-wide">
                4
              </span>
            </button>

            {/* Followers */}
            <button
              onClick={() => setActiveTab('followers')}
              className={`
                w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all relative group cursor-pointer
                ${activeTab === 'followers'
                  ? 'bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500 pl-2.5 rounded-l-none'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.02]'
                }
              `}
            >
              <User className="w-4 h-4 text-violet-400" />
              <span>My Followers</span>
              <span className="ml-auto px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 text-[10px] font-extrabold tracking-wide">
                {followers.length}
              </span>
            </button>

            {/* Messages */}
            <button
              onClick={() => setActiveTab('messages')}
              className={`
                w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all relative group cursor-pointer
                ${activeTab === 'messages'
                  ? 'bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500 pl-2.5 rounded-l-none'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.02]'
                }
              `}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Messages</span>
              <span className="ml-auto px-1.5 py-0.5 rounded-md bg-violet-600 text-slate-900 text-xs font-extrabold tracking-wide scale-95">
                5
              </span>
            </button>

            {/* Payments */}
            <button
              onClick={() => setActiveTab('payments')}
              className={`
                w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all relative group cursor-pointer
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
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-1.5">
            <div className="relative w-8 h-8 rounded-full border border-indigo-300 overflow-hidden bg-indigo-50 shrink-0">
              <div className="w-full h-full bg-gradient-to-tr from-indigo-600/40 to-violet-500/30 flex items-center justify-center text-xs font-bold text-indigo-300">
                {(profile?.profile?.fullName || 'Client').charAt(0).toUpperCase()}
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-slate-200" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[11px] font-bold text-white tracking-tight leading-none truncate">
                {profile?.profile?.fullName || 'Client Profile'}
              </h4>
              <p className="text-[9.5px] font-medium text-slate-500 mt-1 truncate">
                {profile?.email || 'client@talentstage.dev'}
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
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6 select-none">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              {activeTab === 'dashboard' ? `Welcome back, ${profile?.profile?.fullName || 'Client'}` : 
               activeTab === 'post-project' ? 'Post New Contract' :
               activeTab === 'listings' ? 'Active Project Listings' :
               activeTab === 'saved-freelancers' ? 'Saved & Verified Candidates' :
               activeTab === 'messages' ? 'Candidate Messages Hub' :
               activeTab === 'payments' ? 'Milestone & Escrow Ledger' : 'Client Workspace'}
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </h1>
            <p className="text-sm text-slate-400 mt-1 leading-normal font-medium">
              {activeTab === 'dashboard' ? `Review bid proposals, secure contract escrows, and verify deliverables for ${dashboardData?.totalProjects || 0} project listings.` :
               activeTab === 'post-project' ? 'Configure project parameters. Our AI diagnostics will evaluate budget optimization in real-time.' :
               activeTab === 'listings' ? 'Monitor review queues, bid proposal distributions, and hiring progress.' :
               activeTab === 'saved-freelancers' ? 'Verified talent profiles matched to your escrow vault criteria.' :
               activeTab === 'messages' ? 'Real-time encrypted communications with your contractors.' :
               activeTab === 'payments' ? 'Smart contract-backed milestone payments. Full audit trail.' :
               'Manage your active contracts and expert freelancers.'}
            </p>
          </div>

          {/* Calendar date badge */}
          <div className="flex items-center gap-2.5 py-2 px-3.5 rounded-xl bg-white border border-slate-805 text-sm font-semibold text-slate-300 shadow-md">
            <Calendar className="w-4 h-4 text-violet-400" />
            <span>{currentDate}</span>
          </div>
        </header>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* ── VIEW 1: CLIENT DASHBOARD VIEW (Page 6) ──────────────────────── */}
        {/* ───────────────────────────────────────────────────────────────── */}
        {/* ── Top Stats Cards (Rendered ONLY on Dashboard) ── */}
        {activeTab === 'dashboard' && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none animate-fade-in">
            
            {/* Card 1: Active Projects */}
            <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-slate-50 border border-slate-200 p-5 shadow-lg flex flex-col justify-between min-h-[110px] group hover:border-slate-700/80 transition-all duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">Active Projects</span>
                  <h3 className="text-2xl font-black text-white tracking-tight mt-1.5">
                    {dashboardData?.contracts?.filter(c => c.status === 'ACTIVE').length || 0} Active
                  </h3>
                </div>
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-sm relative">
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-500" />
                  <Briefcase className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <span className="text-[9.5px] text-slate-500 font-medium">Escrow contracts active</span>
              </div>
            </div>

            {/* Card 2: Total Budget */}
            <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-slate-50 border border-slate-200 p-5 shadow-lg flex flex-col justify-between min-h-[110px] group hover:border-slate-700/80 transition-all duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">Total Budget</span>
                  <h3 className="text-2xl font-black text-white tracking-tight mt-1.5">₹{totalBudget.toLocaleString('en-IN')}</h3>
                </div>
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-sm">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-center">
                <span className="text-[9.5px] text-indigo-400/90 font-extrabold uppercase tracking-wider select-none">
                  Allocated to Listings
                </span>
              </div>
            </div>

            {/* Card 3: AI Matches */}
            <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-slate-50 border border-slate-200 p-5 shadow-lg flex flex-col justify-between min-h-[110px] group hover:border-slate-700/80 transition-all duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">AI Matches</span>
                  <h3 className="text-2xl font-black text-white tracking-tight mt-1.5">{totalProposalsCount} Proposals</h3>
                </div>
                <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-center">
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/30 text-[8.5px] font-bold text-violet-300 uppercase tracking-wider shadow-sm">
                  Active proposals count
                </span>
              </div>
            </div>

            {/* Card 4: Pending Payments */}
            <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-slate-50 border border-slate-200 p-5 shadow-lg flex flex-col justify-between min-h-[110px] group hover:border-slate-700/80 transition-all duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">Pending Payments</span>
                  <h3 className="text-2xl font-black text-white tracking-tight mt-1.5">
                    {pendingMilestonesCount} Milestone{pendingMilestonesCount !== 1 ? 's' : ''}
                  </h3>
                </div>
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-sm">
                  <AlertCircle className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-sm text-amber-455 font-bold">Awaiting Attestation Approval</span>
              </div>
            </div>

          </section>
        )}

        {/* ── Project List Area (Rendered on Dashboard OR Listings Tab) ── */}
        {(activeTab === 'dashboard' || activeTab === 'listings') && (
          <section className="space-y-5 animate-fade-in">
            <div className="flex justify-between items-center select-none">
              <h3 className="text-lg font-bold text-white">
                Active Project Listings ({clientProjects.length})
              </h3>
              <button
                onClick={() => setActiveTab('post-project')}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:brightness-110 active:scale-[0.98] text-slate-900 text-sm font-semibold tracking-wide shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Post New Project</span>
              </button>
            </div>

            {/* Grid of Listings */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {!clientProjects.length ? (
                <div className="col-span-full py-12 text-center rounded-2xl border border-dashed border-slate-800/80 bg-slate-900/10 backdrop-blur-xl">
                  <Briefcase className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                  <p className="text-xs text-slate-400">No projects posted yet. Click "Post New Project" to get started!</p>
                </div>
              ) : (
                clientProjects.map((project) => (
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
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-900/50 text-indigo-400">
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
                ))
              )}
            </div>
          </section>
        )}

        {/* ── Saved Candidates Showcase View (Rendered on Saved Freelancers Tab) ── */}
        {activeTab === 'saved-freelancers' && (
          <div className="space-y-8 animate-fade-in select-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  name: 'Siddharth Mehta',
                  role: 'Solidity Protocol Architect',
                  skills: ['Solidity', 'Hardhat', 'ERC-4337', 'EVM Security'],
                  matchScore: 98,
                  attestations: '4 Attested Badges',
                  earned: '₹14,50,000',
                  rate: '₹4,500/hr',
                  bio: 'Architected five production-grade ERC-4337 bundler infrastructures. Specializes in gas-optimized paymaster designs and entry-point security audits.',
                  avatar: 'SM'
                },
                {
                  name: 'Pooja Ramachandran',
                  role: 'Senior React Architecture Lead',
                  skills: ['React', 'TypeScript', 'Next.js', 'Storybook'],
                  matchScore: 95,
                  attestations: '3 Attested Badges',
                  earned: '₹9,80,000',
                  rate: '₹3,500/hr',
                  bio: 'Expert in dynamic CSS structures, custom React hooks, concurrent state rendering, and robust atomic component libraries.',
                  avatar: 'PR'
                },
                {
                  name: 'Marcus Vance',
                  role: 'AI Orchestration & LLM Engineer',
                  skills: ['Python', 'LangChain', 'FastAPI', 'Docker'],
                  matchScore: 92,
                  attestations: '2 Attested Badges',
                  earned: '₹12,40,000',
                  rate: '₹4,000/hr',
                  bio: 'Engineered LLM agents with structured parsing. Integrated adaptive question generation pipelines using stateful memory designs.',
                  avatar: 'MV'
                },
                {
                  name: 'Amit Deshmukh',
                  role: 'Full-Stack Developer',
                  skills: ['Node.js', 'Express', 'PostgreSQL', 'Prisma'],
                  matchScore: 89,
                  attestations: '2 Attested Badges',
                  earned: '₹7,20,000',
                  rate: '₹2,800/hr',
                  bio: 'Designed secure double-entry ledgers and custom Express middleware with robust automated unit-test frameworks.',
                  avatar: 'AD'
                }
              ].map((f, idx) => (
                <div 
                  key={idx} 
                  className="rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-slate-800/60 p-6 shadow-lg relative overflow-hidden flex flex-col justify-between hover:border-slate-700/80 transition-all duration-300 group"
                >
                  <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/[0.015] to-transparent pointer-events-none" />
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-650/20 border border-indigo-500/30 flex items-center justify-center text-sm font-black text-indigo-400">
                          {f.avatar}
                        </div>
                        <div>
                          <h3 className="text-sm font-extrabold text-white leading-snug group-hover:text-indigo-400 transition-colors">{f.name}</h3>
                          <p className="text-[10.5px] font-semibold text-slate-500">{f.role}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border text-emerald-400 bg-emerald-500/10 border-emerald-500/20 whitespace-nowrap">
                        {f.matchScore}% Match
                      </span>
                    </div>

                    <p className="text-xs text-slate-450 leading-relaxed">{f.bio}</p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {f.skills.map((s, sIdx) => (
                        <span 
                          key={sIdx}
                          className="px-2 py-0.5 rounded bg-slate-850 border border-slate-800 text-[9px] font-bold text-slate-400"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-900/60 flex items-center justify-between text-[10px] font-bold">
                    <div className="flex gap-3 text-slate-500">
                      <span>Rate: <span className="text-white">{f.rate}</span></span>
                      <span>·</span>
                      <span>Earned: <span className="text-white">{f.earned}</span></span>
                    </div>
                    <span className="text-indigo-400 font-extrabold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      {f.attestations}
                    </span>
                  </div>
                </div>
              ))}
            </div>
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
              <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-slate-50/50 border border-slate-200 p-6 md:p-8 shadow-2xl">
                
                {/* Accent line */}
                <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                {/* Inner sheen */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/[0.025] to-transparent pointer-events-none" />

                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 select-none">
                  <Briefcase className="w-4.5 h-4.5 text-violet-400" />
                  Configure Project Parameters
                </h3>

                {/* Form Error Banner */}
                {formError && (
                  <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-sm text-rose-400 animate-fadeIn">
                    <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handlePostProject} className="space-y-5">
                  
                  {/* Project Title */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-[0.12em] text-indigo-400 select-none">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. EVM Token Vesting Vault Protocol"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="
                        w-full px-4 py-3 rounded-xl
                        bg-white border border-slate-200
                        text-sm text-slate-900 placeholder:text-slate-500
                        focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/60
                        hover:border-slate-700
                        transition-all duration-200
                      "
                    />
                  </div>

                  {/* Project Description */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-[0.12em] text-indigo-400 select-none">
                      Contract Deliverables & Scope *
                    </label>
                    <textarea
                      placeholder="Specify technical scope, architectural parameters, and testing criteria..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="
                        w-full h-32 px-4 py-3 rounded-xl
                        bg-white border border-slate-200
                        text-sm text-slate-900 placeholder:text-slate-500
                        focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/60
                        hover:border-slate-700 resize-none
                        transition-all duration-200
                      "
                    />
                  </div>

                  {/* Required Skills Tag Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-[0.12em] text-indigo-400 select-none">
                      Required Skills Tags
                    </label>

                    {/* Skill list box */}
                    <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 min-h-[50px] items-center">
                      {skills.length === 0 ? (
                        <span className="text-xs text-slate-500 select-none pl-1">No skill tags added.</span>
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
                              className="w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-indigo-500/30 text-indigo-400 hover:text-slate-900 transition-colors duration-150 cursor-pointer text-sm"
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
                        bg-white border border-slate-200
                        text-sm text-slate-900 placeholder:text-slate-500
                        focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/60
                        hover:border-slate-700
                        transition-all duration-200
                      "
                    />

                    {/* Suggestions */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5 select-none">
                      <span className="text-sm font-semibold text-slate-400 mr-1">Quick add:</span>
                      {['Solidity', 'Hardhat', 'Rust', 'TypeScript', 'Next.js', 'Go'].map((s) => {
                        const isAdded = skills.includes(s);
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleQuickAddSkill(s)}
                            disabled={isAdded}
                            className={`
                              text-sm font-semibold px-2 py-0.5 rounded border transition-all cursor-pointer
                              ${isAdded 
                                ? 'bg-slate-50 border-slate-850 text-slate-700 cursor-not-allowed opacity-50' 
                                : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-slate-900'
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
                      <label className="text-xs font-extrabold uppercase tracking-[0.12em] text-indigo-400 select-none">
                        Minimum Budget Limit
                      </label>
                      <div className="relative group">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-550 group-focus-within:text-indigo-400 transition-colors pointer-events-none font-bold text-sm">
                          ₹
                        </span>
                        <input
                          type="number"
                          placeholder="e.g. 60000"
                          value={budgetMin}
                          onChange={(e) => setBudgetMin(e.target.value)}
                          className="
                            w-full pl-8 pr-4 py-3 rounded-xl
                            bg-white border border-slate-200
                            text-sm text-slate-900 placeholder:text-slate-500
                            focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/60
                            hover:border-slate-700
                            transition-all duration-200
                          "
                        />
                      </div>
                    </div>

                    {/* Budget Max */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-extrabold uppercase tracking-[0.12em] text-indigo-400 select-none">
                        Maximum Budget Limit
                      </label>
                      <div className="relative group">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-550 group-focus-within:text-indigo-400 transition-colors pointer-events-none font-bold text-sm">
                          ₹
                        </span>
                        <input
                          type="number"
                          placeholder="e.g. 120000"
                          value={budgetMax}
                          onChange={(e) => setBudgetMax(e.target.value)}
                          className="
                            w-full pl-8 pr-4 py-3 rounded-xl
                            bg-white border border-slate-200
                            text-sm text-slate-900 placeholder:text-slate-500
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
                      <label className="text-xs font-extrabold uppercase tracking-[0.12em] text-indigo-400 select-none">
                        Contract Deadline
                      </label>
                      <div className="relative group">
                        <input
                          type="date"
                          value={deadline}
                          onChange={(e) => setDeadline(e.target.value)}
                          className="
                            w-full px-4 py-3 rounded-xl
                            bg-white border border-slate-200
                            text-sm text-slate-900 cursor-pointer
                            focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/60
                            hover:border-slate-700
                            transition-all duration-200
                          "
                        />
                      </div>
                    </div>

                    {/* Project Type Dropdown */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-extrabold uppercase tracking-[0.12em] text-indigo-400 select-none">
                        Billing Model Type
                      </label>
                      <div className="relative">
                        <select
                          value={projectType}
                          onChange={(e) => setProjectType(e.target.value)}
                          className="
                            w-full px-4 py-3 rounded-xl
                            bg-white border border-slate-200
                            text-sm text-slate-900 appearance-none cursor-pointer
                            focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/60
                            hover:border-slate-700
                            transition-all duration-200
                          "
                        >
                          <option value="fixed">Fixed Price Milestone Plan</option>
                          <option value="hourly">Hourly Rate Compensation</option>
                        </select>
                        <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 pointer-events-none">
                          <Plus className="w-4 h-4 rotate-45" />
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Submission Action Buttons */}
                  <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                    
                    {/* Button A: Generate AI Brief */}
                    <button
                      type="button"
                      onClick={handleGenerateAiBrief}
                      disabled={generatingBrief}
                      className="
                        w-full sm:w-auto px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider
                        bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600
                        hover:brightness-110 active:scale-[0.98] disabled:opacity-50
                        text-slate-900 flex items-center justify-center gap-2 cursor-pointer shadow-md select-none
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
                    <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                    <h3 className="text-sm font-bold tracking-wider text-indigo-300">
                      AI Co-Pilot Evaluation
                    </h3>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-indigo-950 border border-indigo-500/30 text-indigo-300">
                    Live Diagnostics
                  </span>
                </div>

                <div className="space-y-6">
                  
                  {/* Outcome 1: Deliverables Checklist */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 select-none">
                      Suggested Scope Checklist
                    </h4>
                    
                    <div className="space-y-2.5">
                      {(aiScope || [
                        { text: 'Decentralized Escrow Verification', weight: 'High Priority' },
                        { text: 'ERC-20 Compounding Vesting Vaults', weight: 'Core Protocol' },
                        { text: 'Gas Optimization Audit (<85k limit)', weight: 'Crucial' },
                        { text: 'E2E Unit Attestations Suite', weight: 'Standard Requirement' }
                      ]).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-2.5 rounded-lg bg-white border border-slate-200 select-none">
                          <div className="w-4.5 h-4.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-center text-emerald-400 shrink-0">
                            <Check className="w-3 h-3" strokeWidth={3} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 tracking-wide leading-none">{item.text}</p>
                            <p className="text-xs font-semibold text-indigo-300 mt-1.5 uppercase tracking-wide">{item.weight}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Outcome 2: Suggested Timeline Chart */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 select-none">
                      Milestone Timeline Optimization
                    </h4>

                    {/* Vertical Micro-Timeline Chart */}
                    <div className="space-y-3 pl-2.5 border-l border-slate-200 select-none">
                      {(aiTimeline || [
                        { phase: 'Phase 1: Solidity Smart Contract Audit', days: 'Optimized: 4 Days' },
                        { phase: 'Phase 2: Escrow Bridge Compilation & Test', days: 'Optimized: 6 Days' },
                        { phase: 'Phase 3: Attestations Attuned Compliance Review', days: 'Optimized: 2 Days' }
                      ]).map((t, index) => {
                        const colors = ['from-violet-600 to-indigo-600', 'from-indigo-600 to-violet-600', 'from-violet-600 to-fuchsia-600'];
                        const widths = ['w-2/3', 'w-full', 'w-1/3'];
                        const color = colors[index % colors.length];
                        const width = widths[index % widths.length];
                        return (
                          <div key={index} className="relative space-y-1.5">
                            <div className="absolute -left-[14.5px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/30" />
                            <h5 className="text-sm font-bold text-slate-900 tracking-wide leading-none">{t.phase}</h5>
                            <span className="text-xs font-semibold text-slate-400">{t.days.startsWith('Optimized:') ? t.days : `Optimized: ${t.days}`}</span>
                            
                            {/* Dotted chart loading line */}
                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div className={`h-full bg-gradient-to-r ${color} ${width} transition-all duration-500`} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Outcome 3: Realistic Budget Predictor */}
                  <div className="space-y-3 select-none">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                      Market Rate Budget Competition
                    </h4>

                    {/* Budget fit visual gauge */}
                    <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-400">Low Offer</span>
                        <span className="text-indigo-400 font-bold">Market Rate</span>
                        <span className="text-slate-400">Premium Offer</span>
                      </div>
                      
                      {/* Gauge Bar */}
                      <div className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden flex relative">
                        <div className="w-1/3 h-full bg-rose-500/30" />
                        <div className="w-1/3 h-full bg-emerald-500/30" />
                        <div className="w-1/3 h-full bg-indigo-500/30" />
                        {/* Selected fit slider dot */}
                        <div className="absolute top-1/2 -translate-y-1/2 left-[78%] w-3.5 h-3.5 rounded-full bg-indigo-400 border-2 border-slate-950 shadow-md animate-pulse" />
                      </div>

                      <div className="flex items-center justify-between gap-4 pt-1.5">
                        <span className="text-sm text-slate-400 font-medium leading-relaxed">
                          Your budget ranges are compared with 142 Solidity auditable contracts posted this quarter.
                        </span>
                        <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs font-extrabold text-emerald-400 uppercase tracking-widest shrink-0 shadow-sm shadow-emerald-500/5">
                          Budget Fit: Optimized
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Outcome 4: AI Risk Considerations */}
                  <div className="space-y-3 select-none">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">
                      AI Risk Considerations
                    </h4>
                    <div className="space-y-2">
                      {(aiRisks || [
                        'Smart contract audit coverage must exceed 95% line coverage.',
                        'Escrow bridge functions must restrict fee parameter configurations.'
                      ]).map((risk, index) => (
                        <div key={index} className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 shadow-sm">
                          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed font-medium">{risk}</span>
                        </div>
                      ))}
                    </div>
                  </div>


                </div>

              </div>

            </div>

          </div>
        )}

        {/* Client Messaging Hub */}
        {activeTab === 'messages' && (
          <WorkspaceMessagesAndContracts activeSection="messages" />
        )}

        {/* Client Escrow & Payments Ledger */}
        {activeTab === 'payments' && (
          <WorkspaceMessagesAndContracts activeSection="contracts" />
        )}

        {/* Saved Candidates View */}
        {activeTab === 'saved-freelancers' && (
          <SavedCandidatesView
            savedFreelancers={savedFreelancers}
            loading={savedLoading}
            onInvite={handleOpenInviteModal}
            onRemove={handleRemoveSaved}
          />
        )}

        {/* Followers View */}
        {activeTab === 'followers' && (
          <FollowersView
            followers={followers}
            loading={followersLoading}
            onInvite={handleOpenInviteModal}
          />
        )}

        {/* Notifications Hub */}
        {activeTab === 'notifications' && (
          <NotificationsView
            notifications={notifications}
            loading={notificationsLoading}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
        )}

      </main>

      {/* ── Simulated Success Modal Overlay (Page 7 success) ── */}
      {showPostSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-50/30 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 shadow-2xl p-8 text-center animate-scaleUp">
            
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

            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none mb-2">
              Project Live & Escrow Secured!
            </h3>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto mb-6">
              The project has been registered successfully. Verified smart-contract escrows are secured and matchmakers are auditing fits.
            </p>

            {/* Mini Escrow Badge */}
            <div className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-white/[0.03] border border-slate-200 text-sm text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
              <span>₹{parseFloat(budgetMax).toLocaleString('en-IN')} Secured in Escrow Ledger</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

function SavedCandidatesView({ savedFreelancers, loading, onInvite, onRemove }) {
  const navigate = useNavigate();
  return (
    <div className="space-y-8 animate-fade-in select-none">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-black tracking-tight text-slate-800 flex items-center gap-2">
          Saved Freelancers
          <span className="w-5 h-5 rounded-full bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-[10px] font-black text-indigo-500">
            {savedFreelancers.length}
          </span>
        </h1>
        <p className="text-sm text-slate-400 mt-1 leading-normal font-medium">
          Talented professionals you have bookmarked for current or future project collaborations.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-10 h-10 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <p className="text-xs font-bold text-slate-505 tracking-wider uppercase">Loading Candidates...</p>
        </div>
      ) : savedFreelancers.length === 0 ? (
        <div className="text-center py-24 space-y-4 border border-slate-200 bg-white rounded-2xl max-w-xl mx-auto shadow-sm">
          <Award className="w-10 h-10 text-slate-355 mx-auto" />
          <p className="text-sm font-bold text-slate-800">No Saved Candidates</p>
          <p className="text-xs text-slate-400">Bookmark freelancers from their profiles to keep them handy here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
          {savedFreelancers.map((item) => (
            <div key={item.id} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-sm font-black text-indigo-600">
                      {item.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 onClick={() => navigate(`/freelancer/${item.id}`)} className="text-sm font-black text-slate-900 cursor-pointer hover:text-indigo-600 transition-colors">
                        {item.fullName}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5 select-none">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-bold text-slate-600">{item.rating?.toFixed(2) || "0.00"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {item.bio || "No bio description provided by the freelancer."}
                </p>

                {item.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.skills.slice(0, 3).map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500 uppercase">
                        {s}
                      </span>
                    ))}
                    {item.skills.length > 3 && (
                      <span className="px-1.5 py-0.5 text-[9px] font-black text-slate-400 uppercase">
                        +{item.skills.length - 3} More
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-100 mt-2">
                <div className="text-[10px] font-bold text-slate-500">
                  Rate: <span className="text-xs font-black text-slate-800">₹{item.hourlyRate || "0"}/hr</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleRemoveSaved(item.id)}
                    className="py-1.5 px-3 rounded-lg border border-rose-200 hover:border-rose-400 hover:bg-rose-50/20 text-[10.5px] font-bold text-rose-600 transition-all cursor-pointer bg-white"
                  >
                    Remove
                  </button>
                  <button 
                    onClick={() => handleOpenInviteModal(item)}
                    className="py-1.5 px-3.5 rounded-lg bg-indigo-650 hover:bg-indigo-700 text-[10.5px] font-black text-white transition-all shadow-md cursor-pointer flex items-center gap-0.5"
                  >
                    Invite
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FollowersView({ followers, loading, onInvite }) {
  const navigate = useNavigate();
  return (
    <div className="space-y-8 animate-fade-in select-none">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-black tracking-tight text-slate-800 flex items-center gap-2">
          My Followers
          <span className="w-5 h-5 rounded-full bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-[10px] font-black text-indigo-500">
            {followers.length}
          </span>
        </h1>
        <p className="text-sm text-slate-400 mt-1 leading-normal font-medium">
          Freelancers who follow you to get real-time alerts whenever you post new project opportunities.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-10 h-10 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <p className="text-xs font-bold text-slate-505 tracking-wider uppercase">Loading Followers...</p>
        </div>
      ) : followers.length === 0 ? (
        <div className="text-center py-24 space-y-4 border border-slate-200 bg-white rounded-2xl max-w-xl mx-auto shadow-sm">
          <User className="w-10 h-10 text-slate-355 mx-auto" />
          <p className="text-sm font-bold text-slate-800">No Followers Yet</p>
          <p className="text-xs text-slate-400">Once freelancers start following your client profile, they'll list here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
          {followers.map((item) => (
            <div key={item.id} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-sm font-black text-indigo-600">
                      {item.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 onClick={() => navigate(`/freelancer/${item.id}`)} className="text-sm font-black text-slate-900 cursor-pointer hover:text-indigo-600 transition-colors">
                        {item.fullName}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5 select-none">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-bold text-slate-600">{item.rating?.toFixed(2) || "0.00"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-505 leading-relaxed line-clamp-2">
                  {item.bio || "No bio description provided by the freelancer."}
                </p>

                {item.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.skills.slice(0, 3).map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500 uppercase">
                        {s}
                      </span>
                    ))}
                    {item.skills.length > 3 && (
                      <span className="px-1.5 py-0.5 text-[9px] font-black text-slate-400 uppercase">
                        +{item.skills.length - 3} More
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-100 mt-2">
                <div className="text-[10px] font-bold text-slate-505">
                  Earned: <span className="text-xs font-black text-slate-800">₹{item.totalEarned?.toLocaleString() || "0"}</span>
                </div>
                <button 
                  onClick={() => handleOpenInviteModal(item)}
                  className="py-1.5 px-3.5 rounded-lg bg-indigo-650 hover:bg-indigo-700 text-[10.5px] font-black text-white transition-all shadow-md cursor-pointer flex items-center gap-0.5"
                >
                  Invite to Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationsView({ notifications, loading, onMarkAsRead, onMarkAllAsRead }) {
  const navigate = useNavigate();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const TYPE_CONFIG = {
    NEW_PROJECT: {
      icon: Sparkles,
      iconColor: 'text-rose-500 bg-rose-50 border-rose-200',
      actionLabel: 'View Project',
      actionColor: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20',
    },
    PROPOSAL_ACCEPTED: {
      icon: Award,
      iconColor: 'text-emerald-500 bg-emerald-50 border-emerald-200',
      actionLabel: 'Open Contract',
      actionColor: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20',
    },
    NEW_MESSAGE: {
      icon: MessageSquare,
      iconColor: 'text-sky-500 bg-sky-50 border-sky-200',
      actionLabel: 'Open Chat',
      actionColor: 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-500/20',
    },
    PROJECT_INVITATION: {
      icon: Briefcase,
      iconColor: 'text-violet-500 bg-violet-50 border-violet-200',
      actionLabel: 'View Invitation',
      actionColor: 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/20',
    },
    FOLLOW_NOTIFICATION: {
      icon: User,
      iconColor: 'text-indigo-500 bg-indigo-50 border-indigo-200',
      actionLabel: 'View Profile',
      actionColor: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20',
    },
    REVIEW_RECEIVED: {
      icon: Star,
      iconColor: 'text-amber-500 bg-amber-50 border-amber-200',
      actionLabel: 'View Profile',
      actionColor: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20',
    },
    CONTRACT_COMPLETED: {
      icon: CheckCircle2,
      iconColor: 'text-emerald-500 bg-emerald-50 border-emerald-200',
      actionLabel: 'View Contract',
      actionColor: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20',
    },
  };

  const DEFAULT_CONFIG = {
    icon: Bell,
    iconColor: 'text-slate-505 bg-slate-50 border-slate-200',
    actionLabel: null,
    actionColor: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20',
  };

  const handleActionClick = (n) => {
    const type = n.type;
    if (!n.isRead) {
      onMarkAsRead(n.id);
    }
    
    if (type === 'NEW_PROJECT' && n.projectId) {
      navigate('/project-feed', { state: { projectId: n.projectId } });
    } else if (type === 'PROPOSAL_ACCEPTED' && n.contractId) {
      navigate('/workspace', { state: { contractId: n.contractId, section: 'contracts' } });
    } else if (type === 'NEW_MESSAGE' && n.contractId) {
      navigate('/workspace', { state: { contractId: n.contractId, section: 'messages' } });
    } else if (type === 'PROJECT_INVITATION' && n.projectId) {
      navigate('/project-feed', { state: { projectId: n.projectId } });
    } else if (type === 'FOLLOW_NOTIFICATION') {
      if (n.clientId) {
        navigate(`/client/${n.clientId}`);
      } else if (n.freelancerId) {
        navigate(`/freelancer/${n.freelancerId}`);
      }
    } else if (type === 'REVIEW_RECEIVED') {
      if (n.freelancerId) {
        navigate(`/freelancer/${n.freelancerId}`);
      } else if (n.clientId) {
        navigate(`/client/${n.clientId}`);
      }
    } else if (type === 'CONTRACT_COMPLETED' && n.contractId) {
      navigate('/workspace', { state: { contractId: n.contractId, section: 'contracts' } });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in select-none">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-6 select-none">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 flex items-center gap-2">
            System Alerts & Notifications
            <span className="w-5 h-5 rounded-full bg-indigo-650/10 border border-indigo-500/30 flex items-center justify-center text-[10px] font-black text-indigo-500">
              {notifications.length}
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 leading-normal font-medium">
            Real-time updates regarding your contract matches, followings, and escrow payments.
          </p>
        </div>

        {unreadCount > 0 && (
          <button 
            onClick={onMarkAllAsRead}
            className="py-2 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-xs font-bold text-indigo-600 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4 select-none">
          <div className="w-10 h-10 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <p className="text-xs font-bold text-slate-500 tracking-wider uppercase">Loading Notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-24 space-y-4 border border-slate-200 bg-white rounded-2xl max-w-xl mx-auto shadow-sm select-none">
          <Bell className="w-10 h-10 text-slate-350 mx-auto animate-bounce" />
          <p className="text-sm font-bold text-slate-800">You're all caught up!</p>
          <p className="text-xs text-slate-400">No notifications found at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl">
          {notifications.map((n) => {
            const config = TYPE_CONFIG[n.type] || DEFAULT_CONFIG;
            return (
              <div 
                key={n.id} 
                className={`
                  p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row gap-5
                  bg-white shadow-sm hover:shadow-md
                  ${n.isRead ? 'border-slate-200 opacity-90' : 'border-indigo-150 bg-indigo-50/5 ring-1 ring-indigo-500/5'}
                `}
              >
                {/* Icon Container */}
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${config.iconColor}`}>
                  <config.icon className="w-6 h-6" />
                </div>

                {/* Main content block */}
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {!n.isRead && (
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse shrink-0 animate-ping" />
                      )}
                      <h3 className="text-sm font-black text-slate-800 leading-tight truncate">
                        {n.title}
                      </h3>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      {new Date(n.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-505 leading-relaxed font-semibold">
                    {n.message}
                  </p>

                  {/* Expanded Project & Client Credibility Snapshot for NEW_PROJECT */}
                  {n.type === 'NEW_PROJECT' && n.metadata?.project && (
                    <div className="mt-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-4">
                      {/* Project Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="col-span-2 space-y-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Project Name</span>
                          <span className="text-xs font-black text-slate-800 leading-normal">{n.metadata.project.title}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Budget Limits</span>
                          <span className="text-xs font-bold text-slate-700">
                            ₹{n.metadata.project.budgetMin?.toLocaleString('en-IN')} - ₹{n.metadata.project.budgetMax?.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Billing Type</span>
                          <span className="text-xs font-bold text-slate-700">{n.metadata.project.billingModel}</span>
                        </div>
                      </div>

                      {/* Skills required & Deadline */}
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pt-3 border-t border-slate-200/60">
                        {n.metadata.project.skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 items-center">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mr-1">Skills:</span>
                            {n.metadata.project.skills.map((s, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-[10px] font-extrabold text-indigo-600 uppercase tracking-wide">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                        {n.metadata.project.deadline && (
                          <div className="text-[10px] font-bold text-slate-500 shrink-0">
                            Deadline: <span className="text-slate-800">{new Date(n.metadata.project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        )}
                      </div>

                      {/* Client Reputation Snapshot */}
                      {n.metadata.client?.stats && (
                        <div className="mt-3 p-4 rounded-xl bg-indigo-50/20 border border-indigo-100/50 space-y-2.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9.5px] font-black text-indigo-600 uppercase tracking-wider">Client Credibility Snapshot</span>
                            <span className="h-px bg-indigo-100/50 flex-1" />
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                            <div className="p-2 rounded bg-white/60 border border-slate-100">
                              <span className="text-[15px] font-black text-slate-850 block">{n.metadata.client.stats.totalProjectsPosted}</span>
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Posted</span>
                            </div>
                            <div className="p-2 rounded bg-white/60 border border-slate-100">
                              <span className="text-[15px] font-black text-slate-850 block">{n.metadata.client.stats.totalProjectsCompleted}</span>
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Completed</span>
                            </div>
                            <div className="p-2 rounded bg-white/60 border border-slate-100">
                              <span className="text-[15px] font-black text-slate-850 block">₹{n.metadata.client.stats.totalAmountSpent.toLocaleString('en-IN')}</span>
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Spent</span>
                            </div>
                            <div className="p-2 rounded bg-white/60 border border-slate-100">
                              <span className="text-[15px] font-black text-slate-850 block">{n.metadata.client.stats.followersCount}</span>
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Followers</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Contextual Action Button Block */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
                    {config.actionLabel && (
                      <button 
                        onClick={() => handleActionClick(n)}
                        className={`py-2 px-4 rounded-xl text-xs font-black tracking-wide uppercase transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5 ${config.actionColor}`}
                      >
                        <span>{config.actionLabel}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {!n.isRead && (
                      <button 
                        onClick={() => onMarkAsRead(n.id)}
                        className="py-2 px-4 rounded-xl border border-slate-205 hover:border-indigo-400 hover:bg-indigo-50/10 text-xs font-black text-slate-600 hover:text-indigo-600 transition-all flex items-center gap-1 cursor-pointer bg-white"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark as Read</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Invitation Modal Overlay ── */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 md:p-8 animate-scaleUp">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-500" />
              <span>Invite to Project</span>
            </h3>
            
            {invitingFreelancer && (
              <p className="text-xs text-slate-505 mb-6">
                Send an invitation to <span className="font-bold text-slate-800">{invitingFreelancer.fullName}</span> to collaborate on one of your active projects.
              </p>
            )}

            <div className="space-y-4 mb-6">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400">
                Select Project Listing *
              </label>
              
              <div className="relative">
                <select
                  value={selectedProjectIdToInvite}
                  onChange={(e) => setSelectedProjectIdToInvite(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 cursor-pointer focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/60"
                >
                  <option value="" disabled>-- Choose an active project --</option>
                  {clientProjects.filter(p => p.status === 'Active' || p.status === 'OPEN').map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              {invitingStatusMessage && (
                <p className={`text-xs font-semibold ${invitingStatusMessage.includes('successfully') ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {invitingStatusMessage}
                </p>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setInviteModalOpen(false)}
                className="py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSendInvite}
                disabled={!selectedProjectIdToInvite || invitingStatusMessage.includes('Sending')}
                className="py-2 px-5 rounded-xl bg-indigo-650 hover:bg-indigo-700 text-xs font-bold text-white disabled:opacity-50 cursor-pointer"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientWorkspace;
