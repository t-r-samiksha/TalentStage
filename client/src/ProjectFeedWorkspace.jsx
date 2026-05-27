import { useState, useMemo, useEffect } from 'react';
import {
  Cpu, ArrowLeft, Search, Filter, Sparkles, CheckCircle2, Star,
  Clock, DollarSign, Calendar, Briefcase, ChevronDown, Code2,
  Globe, ArrowRight, Check, ShieldCheck, Award, ExternalLink,
  TrendingUp, Zap, MessageSquare, Send, User, AlertCircle
} from 'lucide-react';
import { projectService, dashboardService } from './api';

// ─── Time Ago Helper ────────────────────────────────────────────────────────
function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return `${diffMins || 1} minute${diffMins > 1 ? 's' : ''} ago`;
  }
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  }
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

// ─── Dynamic Category Resolver ──────────────────────────────────────────────
function determineCategory(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  if (
    text.includes('solidity') ||
    text.includes('smart contract') ||
    text.includes('erc-') ||
    text.includes('eip-') ||
    text.includes('layerzero') ||
    text.includes('escrow') ||
    text.includes('blockchain') ||
    text.includes('web3') ||
    text.includes('ethereum') ||
    text.includes('ether') ||
    text.includes('vyper') ||
    text.includes('evm')
  ) {
    return 'Smart Contracts';
  }
  if (
    text.includes('python') ||
    text.includes('langchain') ||
    text.includes('llm') ||
    text.includes('ai') ||
    text.includes('ml') ||
    text.includes('machine learning') ||
    text.includes('celery') ||
    text.includes('observability') ||
    text.includes('openai')
  ) {
    return 'AI / ML';
  }
  if (
    text.includes('css') ||
    text.includes('tailwind') ||
    text.includes('storybook') ||
    text.includes('design system') ||
    text.includes('component library') ||
    text.includes('radix') ||
    text.includes('frontend') ||
    text.includes('ui/ux') ||
    text.includes('ui')
  ) {
    return 'Frontend';
  }
  return 'Full-Stack';
}

// ─── Dynamic Skill Extractor ───────────────────────────────────────────────
function extractSkills(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  const availableSkills = [
    'Solidity', 'TypeScript', 'ERC-4337', 'Hardhat', 'Polygon zkEVM',
    'Next.js', 'FastAPI', 'WebSockets', 'Monaco Editor', 'Redis',
    'Python', 'LangChain', 'Docker', 'Celery', 'PostgreSQL',
    'Rust', 'LayerZero', 'Go', 'Chainlink', 'React', 'Tailwind CSS',
    'Radix UI', 'Storybook', 'Web3.js', 'Ethers.js', 'Node.js',
    'Express', 'Fastify', 'MongoDB', 'GraphQL'
  ];
  
  const matched = [];
  availableSkills.forEach(skill => {
    const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(text)) {
      matched.push(skill);
    }
  });

  if (matched.length === 0) {
    const category = determineCategory(title, description);
    if (category === 'Smart Contracts') return ['Solidity', 'Hardhat', 'Web3.js'];
    if (category === 'AI / ML') return ['Python', 'FastAPI', 'Docker'];
    if (category === 'Frontend') return ['React', 'TypeScript', 'Tailwind CSS'];
    return ['React', 'Node.js', 'PostgreSQL'];
  }
  return matched.slice(0, 5);
}

// ─── Stable Match Score Generator ──────────────────────────────────────────
function calculateMatch(title, description) {
  const sum = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return 85 + (sum % 14);
}

// ─── Project Feed Data (Fallback only) ──────────────────────────────────────
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
      <span className="ml-1 text-xs font-bold text-slate-500">{rating.toFixed(2)}</span>
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
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-sm font-extrabold uppercase tracking-wider select-none ${color.text} ${color.bg} ${color.border}`}
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

  // Live database project states
  const [dbProjects, setDbProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // Details loader
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  // Fetch all projects on mount
  useEffect(() => {
    let active = true;
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await projectService.getProjects();
        if (active) {
          if (res.success) {
            setDbProjects(res.data || []);
          } else {
            setError(res.error?.message || 'Failed to load projects.');
          }
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'An error occurred while fetching projects.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };
    fetchProjects();
    return () => {
      active = false;
    };
  }, []);

  // Map raw DB projects to feed project shape
  const projects = useMemo(() => {
    if (dbProjects.length === 0) return [];
    return dbProjects.map((p) => {
      const clientName = p.client?.profile?.fullName || p.client?.email || 'Anonymous Client';
      const cat = determineCategory(p.title, p.description);
      const sk = extractSkills(p.title, p.description);
      const budgetVal = p.budgetMax || 0;
      
      let budgetRange = 'low';
      if (budgetVal >= 150000) {
        budgetRange = 'high';
      } else if (budgetVal >= 80000) {
        budgetRange = 'mid';
      }

      const createDate = new Date(p.createdAt);
      const deadlineDate = new Date(createDate.getTime() + 14 * 24 * 60 * 60 * 1000);
      const deadlineStr = deadlineDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      return {
        id: p.id,
        title: p.title,
        client: clientName,
        postedAgo: timeAgo(p.createdAt),
        description: p.description,
        skills: sk,
        budget: `₹${budgetVal.toLocaleString('en-IN')}`,
        budgetMinVal: p.budgetMin,
        budgetMaxVal: p.budgetMax,
        deadline: deadlineStr,
        category: cat,
        match: calculateMatch(p.title, p.description),
        proposals: p.proposals?.length || 0,
        budgetRange: budgetRange,
        status: p.status
      };
    });
  }, [dbProjects]);

  // Computed filtered feed
  const filteredProjects = useMemo(() => {
    const list = projects.length > 0 ? projects : ALL_PROJECTS;
    return list.filter((p) => {
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
      // If live projects are loaded, filter out non-OPEN projects
      const isOpen = projects.length === 0 || p.status === 'OPEN';
      return matchesSearch && matchesSkill && matchesBudget && matchesCategory && isOpen;
    });
  }, [projects, searchQuery, filterSkill, filterBudget, filterCategory]);

  // Paginated subset of filtered projects
  const displayedProjects = useMemo(() => {
    return filteredProjects.slice(0, page * itemsPerPage);
  }, [filteredProjects, page]);

  // Live Proposals mapper
  const activeProposals = useMemo(() => {
    if (!selectedProject?.proposalsList || selectedProject.proposalsList.length === 0) {
      // Fallback mock proposals for design premiumness if no DB proposals yet
      return [
        {
          id: 'mock-1',
          name: 'Dr. Evelyn Vance',
          initials: 'EV',
          bid: '₹1,35,000',
          timeline: '18 days',
          coverSnippet: 'I have architected five production-grade ERC-4337 bundler infrastructures for leading Web3 protocols. My approach leverages gas-optimised entry-point factories, modular paymaster strategies, and a layered TypeScript SDK that achieves 3× faster developer onboarding.',
          aiScore: 98,
          aiLabel: 'Clarity Fit',
          gradient: 'from-violet-600/40 to-indigo-500/30',
          status: 'PENDING'
        },
        {
          id: 'mock-2',
          name: 'Elena Rostova',
          initials: 'ER',
          bid: '₹1,28,000',
          timeline: '21 days',
          coverSnippet: 'Specialist in Solidity protocol engineering and formal verification using Certora. Delivered the Aave v3 bridge contract suite reviewed by OpenZeppelin. My SDK design pattern uses discriminated union types for zero-runtime errors at the paymaster boundary.',
          aiScore: 95,
          aiLabel: 'Technical Depth',
          gradient: 'from-indigo-600/40 to-violet-500/30',
          status: 'PENDING'
        },
        {
          id: 'mock-3',
          name: 'Arjun Patel',
          initials: 'AP',
          bid: '₹98,000',
          timeline: '24 days',
          coverSnippet: 'Full-stack blockchain engineer with 4 years on Polygon zkEVM tooling. Built an open-source ERC-4337 relayer service with 99.97% uptime. Comfortable leading both the Hardhat test harness design and the TypeScript public API surface alignment.',
          aiScore: 88,
          aiLabel: 'Budget Fit',
          gradient: 'from-emerald-600/30 to-indigo-600/20',
          status: 'PENDING'
        }
      ];
    }

    return selectedProject.proposalsList.map((p, idx) => {
      const freelancerName = p.freelancer?.profile?.fullName || p.freelancer?.email || 'Anonymous Freelancer';
      const initials = freelancerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'FL';
      
      const gradients = [
        'from-violet-600/40 to-indigo-500/30',
        'from-indigo-600/40 to-violet-500/30',
        'from-emerald-600/30 to-indigo-600/20'
      ];
      const aiLabels = ['Clarity Fit', 'Technical Depth', 'Budget Fit'];
      
      return {
        id: p.id,
        name: freelancerName,
        initials,
        bid: `₹${p.bidAmount.toLocaleString('en-IN')}`,
        timeline: `${p.timelineDays} days`,
        coverSnippet: p.coverLetter,
        aiScore: 82 + ((idx * 7) % 18),
        aiLabel: aiLabels[idx % aiLabels.length],
        gradient: gradients[idx % gradients.length],
        status: p.status
      };
    });
  }, [selectedProject]);

  const openDetails = async (project) => {
    setView('details');
    setSelectedProject({
      ...project,
      proposalsList: []
    });
    setAcceptedProposal(null);
    setHired(null);
    setDetailsLoading(true);
    setDetailsError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const res = await projectService.getProjectDetails(project.id);
      if (res.success) {
        setSelectedProject((prev) => {
          if (!prev || prev.id !== project.id) return prev;
          return {
            ...prev,
            proposalsList: res.data?.proposals || []
          };
        });
      } else {
        setDetailsError(res.error?.message || 'Failed to load project details.');
      }
    } catch (err) {
      setDetailsError(err.message || 'An error occurred.');
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleSubmitProposal = async (projectId) => {
    setSubmitting(projectId);
    
    // Save previous state for rollback if needed
    const previousDbProjects = [...dbProjects];
    const previousSelectedProject = selectedProject ? { ...selectedProject } : null;

    // Optimistically update the project feed counts
    setDbProjects((prev) => 
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            proposals: [...(p.proposals || []), { id: 'optimistic-temp-id' }]
          };
        }
        return p;
      })
    );

    // Optimistically update the detail view bids list if currently opened
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject((prev) => {
        if (!prev) return prev;
        const tempProposal = {
          id: 'optimistic-temp-id',
          projectId,
          freelancerId: 'my-freelancer-id',
          coverLetter: `I am interested in working on "${prev.title || 'this project'}". I have verified skills in the required stack and can start immediately.`,
          bidAmount: Math.floor((prev.budgetMinVal + prev.budgetMaxVal) / 2) || 10000,
          timelineDays: 14,
          status: 'PENDING',
          freelancer: {
            id: 'my-freelancer-id',
            email: 'me@freelancer.com',
            profile: {
              fullName: 'Me (Optimistic Attestation)'
            }
          }
        };
        return {
          ...prev,
          proposalsList: [...(prev.proposalsList || []), tempProposal],
          proposals: (prev.proposals || 0) + 1
        };
      });
    }

    try {
      const project = (projects.length > 0 ? projects : ALL_PROJECTS).find(p => p.id === projectId);
      const budgetMin = project ? project.budgetMinVal : 10000;
      const budgetMax = project ? project.budgetMaxVal : 30000;
      const bidAmount = Math.floor((budgetMin + budgetMax) / 2) || 10000;

      const res = await projectService.submitProposal({
        projectId,
        coverLetter: `I am interested in working on "${project?.title || 'this project'}". I have verified skills in the required stack and can start immediately.`,
        bidAmount,
        timelineDays: 14
      });

      if (res.success) {
        setSubmitted(projectId);
        setTimeout(() => setSubmitted(null), 3000);

        // Re-fetch project details to sync the actual database record
        if (view === 'details' && selectedProject?.id === projectId) {
          const detailRes = await projectService.getProjectDetails(projectId);
          if (detailRes.success) {
            setSelectedProject((prev) => {
              if (!prev || prev.id !== projectId) return prev;
              return {
                ...prev,
                proposalsList: detailRes.data?.proposals || [],
                proposals: detailRes.data?.proposals?.length || prev.proposals
              };
            });
            setDbProjects((prev) =>
              prev.map((p) => (p.id === projectId ? detailRes.data : p))
            );
          }
        } else {
          // If in feed view, refresh projects list to replace optimistic token
          const refreshRes = await projectService.getProjects();
          if (refreshRes.success) {
            setDbProjects(refreshRes.data || []);
          }
        }
      } else {
        // Rollback
        setDbProjects(previousDbProjects);
        if (previousSelectedProject) {
          setSelectedProject(previousSelectedProject);
        }
        alert(res.error?.message || 'Failed to submit proposal. Note: Only accounts with the FREELANCER role can submit proposals.');
      }
    } catch (err) {
      // Rollback
      setDbProjects(previousDbProjects);
      if (previousSelectedProject) {
        setSelectedProject(previousSelectedProject);
      }
      alert(err.message || 'An error occurred while submitting proposal.');
    } finally {
      setSubmitting(null);
    }
  };

  const handleHire = (candidate) => {
    setHiring(true);
    setTimeout(() => {
      setHiring(false);
      setHired(candidate);
    }, 1200);
  };

  const handleAcceptProposal = async (proposalId) => {
    if (typeof proposalId === 'string' && proposalId.startsWith('mock-')) {
      setAcceptedProposal(proposalId);
      return;
    }

    try {
      const res = await dashboardService.hireFreelancer({ proposalId });
      if (res.success) {
        setAcceptedProposal(proposalId);
      } else {
        alert(res.error?.message || 'Failed to hire freelancer.');
      }
    } catch (err) {
      alert(err.message || 'An error occurred while hiring.');
    }
  };

  return (
    <div className="project-feed-shell min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden">
      {/* ── Ambient glows ── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-10 right-[-60px] w-[540px] h-[540px] rounded-full bg-violet-500/10 blur-[130px]" />
        <div className="absolute bottom-[-60px] left-[-40px] w-[500px] h-[480px] rounded-full bg-cyan-400/10 blur-[110px]" />
      </div>

      {/* ── Top Nav Bar ── */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {view === 'details' && (
              <button
                onClick={() => setView('feed')}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer group select-none mr-2"
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
              <span className="text-sm font-bold tracking-tight text-slate-800">
                Talent<span className="text-violet-600 font-extrabold">Stage</span>
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
            <button
              onClick={() => setView('feed')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer select-none ${view === 'feed' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-400/20' : 'text-slate-300 hover:text-white'}`}
            >
              Project Feed
            </button>
            <button
              onClick={() => onNavigate('client-dashboard')}
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white transition-all cursor-pointer select-none"
            >
              Client Dashboard
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white transition-all cursor-pointer select-none"
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
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-100 leading-tight">
                  Browse Open Projects
                </h1>
                <p className="text-sm text-slate-400 mt-1.5 leading-relaxed font-medium">
                  AI-curated contracts matched to your verified skill attestations and proposal history.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-500 select-none">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-500">{filteredProjects.length} contracts available</span>
              </div>
            </div>

            {/* ── Top Filter / Search Bar ── */}
            <div className="flex flex-col lg:flex-row gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">

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
                    bg-slate-900 border border-slate-800
                    text-sm text-slate-100 placeholder:text-slate-500
                    focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20
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
                    bg-slate-900 border border-slate-800
                    text-sm text-slate-200 appearance-none cursor-pointer font-medium
                    focus:outline-none focus:border-cyan-400 hover:border-slate-700
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
                    bg-slate-900 border border-slate-800
                    text-sm text-slate-200 appearance-none cursor-pointer font-medium
                    focus:outline-none focus:border-cyan-400 hover:border-slate-700
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
                    bg-slate-900 border border-slate-800
                    text-sm text-slate-200 appearance-none cursor-pointer font-medium
                    focus:outline-none focus:border-cyan-400 hover:border-slate-700
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
                className="flex items-center gap-2 py-2.5 px-4 rounded-xl border border-slate-800 text-sm font-semibold text-slate-300 hover:text-white hover:border-slate-600 transition-all cursor-pointer select-none whitespace-nowrap"
              >
                <Filter className="w-3.5 h-3.5" />
                Clear Filters
              </button>
            </div>

            {/* ── Project Card Grid ── */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="w-10 h-10 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                <p className="text-xs font-bold text-slate-500 tracking-wider uppercase">Loading Open Contracts...</p>
              </div>
            ) : error ? (
              <div className="text-center py-24 space-y-4 border border-red-500/20 bg-red-950/10 rounded-2xl max-w-xl mx-auto">
                <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
                <p className="text-sm font-bold text-red-400">Failed to Load Contracts</p>
                <p className="text-xs text-slate-500 px-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="py-2 px-4 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-xs font-bold text-red-300 border border-red-500/30 transition-all cursor-pointer"
                >
                  Retry Connection
                </button>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-24 space-y-3">
                <Search className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-base font-bold text-slate-800">No contracts match your active filters.</p>
                <p className="text-sm text-slate-500 font-medium">Try broadening your search or resetting filters.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {displayedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="
                      relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-sm p-6
                      hover:border-cyan-500/30 hover:shadow-lg
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
                              <span className="text-xs font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                                {project.category}
                              </span>
                              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-500" />
                                {project.postedAgo}
                              </span>
                            </div>
                            <h2 className="text-lg font-black tracking-tight text-slate-100 group-hover:text-cyan-300 transition-colors leading-snug">
                              {project.title}
                            </h2>
                            <p className="text-sm font-medium text-slate-400 mt-0.5">
                              Posted by <span className="text-cyan-300 font-semibold">{project.client}</span>
                            </p>
                          </div>

                          {/* Match badge — prominent placement */}
                          <MatchBadge match={project.match} />
                        </div>

                        {/* Description — 2-line clamp */}
                        <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">
                          {project.description}
                        </p>

                        {/* Telemetry row: skills + metadata pills */}
                        <div className="flex flex-wrap items-center gap-2">
                          {project.skills.map((skill) => (
                            <span
                              key={skill}
                              className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 select-none"
                            >
                              {skill}
                            </span>
                          ))}
                          <span className="flex items-center gap-1 text-sm font-bold text-cyan-300 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 select-none">
                            <DollarSign className="w-3.5 h-3.5 text-cyan-300" />
                            {project.budget}
                          </span>
                          <span className="flex items-center gap-1 text-sm font-semibold text-slate-300 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 select-none">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            Due {project.deadline}
                          </span>
                          <span className="flex items-center gap-1 text-sm font-semibold text-slate-400 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 select-none">
                            <Send className="w-3.5 h-3.5 text-slate-400" />
                            {project.proposals} proposals
                          </span>
                        </div>
                      </div>

                      {/* Action buttons — stacked vertically on the right */}
                      <div className="flex lg:flex-col gap-3 shrink-0 lg:min-w-[160px]">
                        <button
                          onClick={() => openDetails(project)}
                          className="
                            flex-1 lg:flex-none py-2.5 px-5 rounded-xl border border-slate-700 text-sm font-semibold text-slate-300
                            hover:bg-slate-800 hover:border-cyan-400 hover:text-white
                            active:scale-[0.98] transition-all duration-200 cursor-pointer select-none
                            flex items-center justify-center gap-1.5
                          "
                        >
                          <ExternalLink className="w-4 h-4 text-slate-400" />
                          View Project
                        </button>
                        <button
                          onClick={() => handleSubmitProposal(project.id)}
                          disabled={submitting === project.id || submitted === project.id}
                          className="
                            flex-1 lg:flex-none py-2.5 px-5 rounded-xl text-sm font-semibold
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
                {filteredProjects.length > displayedProjects.length && (
                  <div className="flex justify-center pt-6">
                    <button
                      onClick={() => setPage(prev => prev + 1)}
                      className="
                        py-2.5 px-6 rounded-xl border border-slate-800 text-xs font-bold text-slate-400
                        hover:bg-slate-900 hover:text-white hover:border-slate-700
                        active:scale-[0.98] transition-all duration-200 cursor-pointer select-none
                      "
                    >
                      Load More Projects
                    </button>
                  </div>
                )}
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
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 select-none">
                <span>Project Feed</span>
                <ChevronDown className="w-3 h-3 -rotate-90 text-slate-500" />
                <span className="text-indigo-400 font-bold">{selectedProject.title}</span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-100 leading-tight max-w-3xl">
                  {selectedProject.title}
                </h1>
                <MatchBadge match={selectedProject.match} />
              </div>
              <p className="text-sm font-medium text-slate-500">
                Posted by <span className="text-indigo-600 font-bold">{selectedProject.client}</span>
                <span className="mx-2 text-slate-300">·</span>
                <span className="text-slate-500">{selectedProject.postedAgo}</span>
              </p>
            </div>

            {/* ── Main Split Layout ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

              {/* ── Column A: Project Parameters (Left) ── */}
              <div className="lg:col-span-7 space-y-7">

                {/* Full Description */}
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 md:p-7 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-800/80 to-transparent pointer-events-none" />

                  <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-300 select-none">
                    Project Scope & Deliverables
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {selectedProject.description}
                  </p>
                  <p className="text-sm text-slate-500 leading-relaxed mt-4">
                    All deliverables must be accompanied by a comprehensive technical documentation package including architecture decision records (ADRs), deployment runbooks, and integration test coverage exceeding 90%. A code walkthrough session with the engineering team will be required before milestone release.
                  </p>
                </div>

                {/* Required Skills grid */}
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-300 mb-4 select-none">
                    Required Technical Stack
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {selectedProject.skills.map((skill) => (
                      <span
                        key={skill}
                        className="
                          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                          bg-indigo-50 border border-indigo-200
                          text-xs text-indigo-700 font-bold select-none
                          hover:bg-indigo-100 hover:border-indigo-300 transition-all duration-200
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
                  <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-sm space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-300 select-none">
                      Budget Allocation
                    </h3>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-black tracking-tight text-slate-100">{selectedProject.budget}</span>
                      <span className="text-xs font-bold text-slate-500 mb-0.5">fixed price</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-bold text-slate-500 select-none">
                        <span>Escrow Deposit</span>
                        <span className="text-emerald-600">100% Secured</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full w-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 select-none">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Smart contract escrow active
                    </div>
                  </div>

                  {/* Milestone Deadlines */}
                  <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-sm space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-300 select-none">
                      Milestone Schedule
                    </h3>
                    <div className="space-y-3 pl-2 border-l border-slate-700">
                      {[
                        { label: 'M1 – Architecture & Setup', date: 'Jun 20, 2026', pct: '25%' },
                        { label: 'M2 – Core Protocol Build', date: 'Jul 01, 2026', pct: '60%' },
                        { label: 'M3 – Audit & Finalisation', date: selectedProject.deadline, pct: '100%' },
                      ].map((m, i) => (
                        <div key={i} className="relative space-y-0.5 pl-3">
                          <div className="absolute -left-[15.5px] top-1.5 w-2 h-2 rounded-full bg-indigo-500 border border-slate-950" />
                          <p className="text-sm font-bold text-slate-100 leading-none">{m.label}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
                            <span>{m.date}</span>
                            <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-400/20 font-bold">
                              {m.pct} payment
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submit your proposal inline CTA */}
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-base font-extrabold text-slate-100 tracking-tight select-none">Interested in this contract?</h4>
                    <p className="text-sm text-slate-400 mt-1 select-none">Our AI will optimise your bid for maximum acceptance probability.</p>
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

                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-cyan-400/10 blur-2xl pointer-events-none" />
                  <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-cyan-400/10 to-transparent pointer-events-none" />

                  <div className="flex items-center justify-between mb-5 select-none">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                      <h3 className="text-xs font-extrabold uppercase tracking-widest text-indigo-700">
                        Top AI Freelancer Fits
                      </h3>
                    </div>
                    <span className="text-xs font-extrabold uppercase tracking-wide px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 select-none">
                      Live Match
                    </span>
                  </div>

                  <div className="space-y-4">
                    {AI_CANDIDATE_MATCHES.map((c) => (
                      <div
                        key={c.id}
                        className={`relative rounded-xl border p-4 bg-slate-900 transition-all duration-200 ${c.isTopPick ? `${c.borderColor} shadow-sm` : 'border-slate-700'}`}
                      >
                        {c.isTopPick && (
                          <span className="absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                        )}
                        {c.isTopPick && (
                          <span className="absolute top-2.5 right-2.5 text-xs font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-violet-500 text-white select-none">
                            Top Pick
                          </span>
                        )}

                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <div className={`w-9 h-9 rounded-full border ${c.borderColor} overflow-hidden bg-slate-200 shrink-0`}>
                            <div className={`w-full h-full bg-gradient-to-tr ${c.gradient} flex items-center justify-center text-xs font-black text-slate-100`}>
                              {c.initials}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="text-xs font-extrabold text-slate-100 tracking-tight leading-none">{c.name}</h4>
                                <p className="text-xs text-slate-500 mt-0.5 leading-none">{c.role}</p>
                              </div>
                              <span className={`text-sm font-black ${c.matchColor} shrink-0`}>{c.match}%</span>
                            </div>

                            <StarRating rating={c.rating} />

                            <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-slate-600 select-none">
                              <span className="flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                {c.verifiedSkills} verified skills
                              </span>
                              <span>·</span>
                              <span>{c.jobs} contracts</span>
                            </div>

                            {/* Match Metrics Bar */}
                            <div className="mt-3 space-y-1">
                              <div className="flex justify-between text-xs font-bold text-slate-600 select-none">
                                <span>Structural Overlap</span>
                                <span className={c.matchColor}>{c.match}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
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
                          <div className="w-full mt-3.5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 flex items-center justify-center gap-1.5 select-none">
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
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 md:p-7 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-800/80 to-transparent pointer-events-none" />

              <div className="flex items-center justify-between mb-6 select-none">
                <div>
                  <h3 className="text-lg font-bold text-slate-100">
                    Candidate Proposals — Evaluation Queue
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5 font-medium">AI-ranked by bid optimality, clarity score, and technical depth.</p>
                </div>
                {detailsLoading ? (
                  <span className="flex items-center gap-1 text-[9px] font-bold text-slate-500 uppercase tracking-widest animate-pulse">
                    <span className="w-2.5 h-2.5 rounded-full border border-slate-600 border-t-slate-400 animate-spin" />
                    Syncing Bids...
                  </span>
                ) : (
                  <span className="text-[9px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-400 select-none">
                    {activeProposals.length} Bids Received
                  </span>
                )}
              </div>

              <div className="space-y-5">
                {activeProposals.map((proposal, idx) => {
                  const isAccepted = acceptedProposal === proposal.id || proposal.status === 'ACCEPTED';
                  return (
                    <div
                      key={proposal.id}
                      className={`
                        relative overflow-hidden rounded-xl border p-5 transition-all duration-300 group
                        ${isAccepted
                          ? 'border-emerald-300 bg-slate-950 shadow-md'
                          : 'border-slate-700 bg-slate-900 hover:bg-slate-800 hover:border-slate-600'}
                      `}
                    >
                      {isAccepted && (
                        <span className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                      )}

                      <div className="flex flex-col lg:flex-row gap-5 lg:items-start">

                        {/* Profile & metadata */}
                        <div className="flex items-start gap-3.5 lg:w-56 shrink-0">
                          <div className={`w-9 h-9 rounded-full border ${idx === 0 ? 'border-violet-400' : 'border-slate-700'} overflow-hidden bg-slate-800 shrink-0`}>
                            <div className={`w-full h-full bg-gradient-to-tr ${proposal.gradient} flex items-center justify-center text-xs font-black text-white`}>
                              {proposal.initials}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-100 tracking-tight leading-none">{proposal.name}</h4>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-sm font-bold text-cyan-300">{proposal.bid}</span>
                              <span className="text-slate-500">·</span>
                              <span className="text-sm font-semibold text-slate-400 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-500" />
                                {proposal.timeline}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Cover letter snippet */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
                            {proposal.coverSnippet}
                          </p>
                        </div>

                        {/* Score + action */}
                        <div className="flex lg:flex-col items-center lg:items-end gap-3 lg:gap-3 shrink-0">
                          {/* AI Score Badge */}
                          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 select-none">
                            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                            <span className="text-sm font-black text-cyan-300">{proposal.aiScore}/100</span>
                            <span className="text-xs font-extrabold text-cyan-300 uppercase tracking-widest hidden sm:block">
                              {proposal.aiLabel}
                            </span>
                          </div>

                          {/* Accept Proposal button */}
                          {!isAccepted ? (
                            <button
                              onClick={() => handleAcceptProposal(proposal.id)}
                              className="
                                py-2 px-4 rounded-xl text-sm font-bold uppercase tracking-wide
                                border border-slate-700 text-slate-300
                                hover:bg-slate-800 hover:border-cyan-400 hover:text-white
                                active:scale-[0.97]
                                transition-all duration-200 cursor-pointer select-none whitespace-nowrap
                                flex items-center gap-1.5
                              "
                            >
                              <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                              Accept Proposal
                            </button>
                          ) : (
                            <div className="py-2 px-4 rounded-xl text-sm font-extrabold uppercase tracking-wide bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5 select-none">
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
