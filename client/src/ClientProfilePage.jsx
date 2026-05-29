import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Cpu, ArrowLeft, Calendar, Briefcase, DollarSign, CheckCircle2, 
  UserPlus, UserMinus, Users, Award, Sparkles, AlertCircle, RefreshCw, BarChart3
} from 'lucide-react';
import { authService, followService } from './api';

export default function ClientProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [followLoading, setFollowLoading] = useState(false);

  const fetchClientProfile = async () => {
    setIsLoading(true);
    setError('');
    const result = await authService.getClientProfile(id);
    if (result.success) {
      setProfile(result.data);
    } else {
      setError(result.error?.message || 'Failed to load client profile details.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchClientProfile();
  }, [id]);

  const handleFollowToggle = async () => {
    if (!profile || followLoading) return;
    setFollowLoading(true);
    
    const isFollowing = profile.stats?.isFollowing;
    let res;
    if (isFollowing) {
      res = await followService.unfollowClient(id);
    } else {
      res = await followService.followClient(id);
    }

    if (res.success) {
      // Toggle client stats locally
      setProfile(prev => {
        if (!prev) return prev;
        const offset = isFollowing ? -1 : 1;
        return {
          ...prev,
          stats: {
            ...prev.stats,
            isFollowing: !isFollowing,
            followersCount: Math.max(0, (prev.stats?.followersCount || 0) + offset)
          }
        };
      });
    }
    setFollowLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-955 flex items-center justify-center relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute top-[-80px] right-[-60px] w-[500px] h-[500px] rounded-full bg-indigo-700/5 blur-[120px]" />
        </div>
        <div className="text-center relative z-10 space-y-4 select-none">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Loading Client Reputation Vault...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-955 flex items-center justify-center relative overflow-hidden">
        <div className="text-center relative z-10 space-y-4 max-w-md px-6 select-none">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto animate-pulse">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Sync Error</h3>
          <p className="text-xs text-slate-400 leading-relaxed">{error || 'Client profile not found'}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-350 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { fullName, bio, email, createdAt, stats, projects } = profile;

  return (
    <div className="min-h-screen bg-[#08080a] text-slate-100 font-sans p-6 md:p-10 relative overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-80px] right-[-60px] w-[600px] h-[600px] rounded-full bg-red-950/10 blur-[130px]" />
        <div className="absolute bottom-[-100px] left-[200px] w-[500px] h-[500px] rounded-full bg-indigo-955/5 blur-[110px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-8 animate-fadeIn">
        
        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors duration-200 group bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back</span>
        </button>

        {/* Client Profile Header Card */}
        <section className="relative rounded-3xl overflow-hidden backdrop-blur-xl bg-[#121216]/60 border border-[#22222a] p-6 md:p-8 shadow-2xl">
          <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-[#e50914] to-transparent" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4.5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600/30 to-red-500/10 border border-red-500/35 flex items-center justify-center text-2xl font-black text-red-400 shadow-lg shadow-red-500/5 select-none">
                {fullName.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">{fullName}</h1>
                  <span className="px-2 py-0.5 rounded-md bg-red-950/40 border border-red-500/20 text-[9px] font-extrabold text-red-400 uppercase tracking-widest select-none">
                    Client
                  </span>
                </div>
                <p className="text-xs text-slate-450 font-medium">{email}</p>
                <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Member since {new Date(createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </p>
              </div>
            </div>

            {/* Follow/Unfollow client actions */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950 border border-[#22222a] text-slate-300 text-xs font-bold shadow-inner">
                <Users className="w-4 h-4 text-slate-400" />
                <span>{stats.followersCount} Follower{stats.followersCount !== 1 ? 's' : ''}</span>
              </div>
              
              <button
                onClick={handleFollowToggle}
                disabled={followLoading}
                className={`
                  px-4.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border-none flex items-center gap-2 shadow-md
                  ${stats.isFollowing 
                    ? 'bg-slate-900 border border-[#22222a] text-red-400 hover:bg-slate-950' 
                    : 'bg-[#e50914] text-white hover:bg-[#b80710]'
                  }
                `}
              >
                {followLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : stats.isFollowing ? (
                  <>
                    <UserMinus className="w-3.5 h-3.5" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Follow Client</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {bio && (
            <div className="mt-6 pt-6 border-t border-[#22222a]">
              <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 select-none mb-1.5">Company Bio</h4>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">{bio}</p>
            </div>
          )}
        </section>

        {/* Stats and Reputation Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Client Reputation Metrics Card */}
          <div className="rounded-2xl border border-[#22222a] bg-[#121216]/50 p-6 md:p-8 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#22222a] pb-4">
              <BarChart3 className="w-4.5 h-4.5 text-red-400" />
              Client Reputation Metrics
            </h3>

            <div className="grid grid-cols-3 gap-4 text-center">
              
              {/* Metric 1: Completion Rate */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500 block">Completion Rate</span>
                <p className="text-2xl font-black text-white">{stats.completionRate}%</p>
                <div className="w-full bg-[#22222a] h-1 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: `${stats.completionRate}%` }} />
                </div>
              </div>

              {/* Metric 2: Total Hires */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500 block">Total Hires</span>
                <p className="text-2xl font-black text-white">{stats.totalHires}</p>
                <span className="text-[10px] text-slate-500 font-bold block">Escrows Signed</span>
              </div>

              {/* Metric 3: Repeat Hire Rate */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500 block">Repeat Hire Rate</span>
                <p className="text-2xl font-black text-white">{stats.repeatHireRate}%</p>
                <div className="w-full bg-[#22222a] h-1 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${stats.repeatHireRate}%` }} />
                </div>
              </div>

            </div>
          </div>

          {/* Client Expenditure Stats Card */}
          <div className="rounded-2xl border border-[#22222a] bg-[#121216]/50 p-6 md:p-8 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#22222a] pb-4">
              <Award className="w-4.5 h-4.5 text-red-400" />
              General Project Metrics
            </h3>

            <div className="grid grid-cols-3 gap-4 text-center">
              
              {/* Stats 1: Projects Posted */}
              <div className="space-y-1">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500 block">Posted Listings</span>
                <p className="text-2xl font-black text-white">{stats.totalProjectsPosted}</p>
                <span className="text-[10px] text-slate-500 font-bold">Total Projects</span>
              </div>

              {/* Stats 2: Completed Projects */}
              <div className="space-y-1">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500 block">Completed Projects</span>
                <p className="text-2xl font-black text-emerald-400">{stats.totalProjectsCompleted}</p>
                <span className="text-[10px] text-slate-500 font-bold">Closed Listings</span>
              </div>

              {/* Stats 3: Amount Spent */}
              <div className="space-y-1">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500 block">Total Spent</span>
                <p className="text-2xl font-black text-red-400">₹{stats.totalAmountSpent.toLocaleString('en-IN')}</p>
                <span className="text-[10px] text-slate-500 font-bold">Avg: ₹{stats.averageProjectBudget.toLocaleString('en-IN')}</span>
              </div>

            </div>
          </div>

        </section>

        {/* Project History List */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-white select-none">Project Posting History ({projects.length})</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.length === 0 ? (
              <div className="col-span-full py-12 text-center rounded-2xl border border-dashed border-[#22222a] bg-[#121216]/10">
                <Briefcase className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                <p className="text-xs text-slate-400">This client hasn't posted any projects yet.</p>
              </div>
            ) : (
              projects.map((p) => {
                const statusColors = 
                  p.status === 'COMPLETED' 
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                    : p.status === 'IN_PROGRESS' 
                    ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' 
                    : p.status === 'CANCELLED'
                    ? 'text-slate-500 bg-slate-900 border-[#22222a]'
                    : 'text-red-400 bg-red-500/10 border-red-500/20';

                return (
                  <div
                    key={p.id}
                    className="p-5 rounded-2xl border border-[#22222a] bg-[#121216]/40 backdrop-blur-md flex flex-col justify-between hover:border-slate-800 transition-all duration-200 group"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-md border ${statusColors} select-none`}>
                          {p.status}
                        </span>
                        <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors leading-snug mt-2">{p.title}</h4>
                      </div>
                      
                      <span className="text-[10px] text-slate-500 font-bold whitespace-nowrap">
                        {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#22222a] flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-550">Budget Range</span>
                      <span className="text-red-400 flex items-center">
                        <DollarSign className="w-3 h-3" />
                        <span>₹{p.budgetMin.toLocaleString('en-IN')} - ₹{p.budgetMax.toLocaleString('en-IN')}</span>
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
